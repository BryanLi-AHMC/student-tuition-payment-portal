import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { getStudentAccountPayload } from './services/studentAccountService.js'
import { DEMO_STUDENT_ID } from './constants.js'

const PORT = Number(process.env.PORT) || 3001
const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

function formatShortDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function buildActivityRows(payload) {
  const effective = payload.termChargeEffectiveDate
  const displayEffective = formatShortDate(effective)
  const rows = []
  let balance = 0
  for (const li of payload.lineItems) {
    balance += li.amount
    rows.push({
      date: displayEffective,
      description: li.description,
      charges: li.amount,
      credits: 0,
      balance,
    })
  }
  const pays = [...payload.payments].sort((a, b) => String(a.paidAt).localeCompare(String(b.paidAt)))
  for (const p of pays) {
    balance -= p.amount
    rows.push({
      date: formatShortDate(p.paidAt),
      description: p.description || 'Payment',
      charges: 0,
      credits: p.amount,
      balance,
    })
  }
  return rows
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 })
})

app.get('/api/students/:studentId/account', async (req, res) => {
  try {
    const term = req.query.term || 'Fall'
    const year = Number(req.query.year) || 2026
    const payload = await getStudentAccountPayload(req.params.studentId, term, year)
    res.json(payload)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load account' })
  }
})

app.get('/api/students/:studentId/activity', async (req, res) => {
  try {
    const term = req.query.term || 'Fall'
    const year = Number(req.query.year) || 2026
    const payload = await getStudentAccountPayload(req.params.studentId, term, year)
    res.json({ rows: buildActivityRows(payload) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load activity' })
  }
})

/** Default demo student for unauthenticated portal preview */
app.get('/api/demo/account', async (req, res) => {
  try {
    const term = req.query.term || 'Fall'
    const year = Number(req.query.year) || 2026
    const payload = await getStudentAccountPayload(DEMO_STUDENT_ID, term, year)
    console.log('[GET /api/demo/account]', {
      mongoReady: mongoose.connection.readyState === 1,
      lineItems: payload.lineItems.length,
      scheduleRows: payload.scheduleRows.length,
      payments: payload.payments.length,
    })
    res.json(payload)
  } catch (e) {
    console.error('[GET /api/demo/account]', e.message || e)
    res.status(500).json({ error: 'Failed to load account', detail: String(e.message || e) })
  }
})

app.get('/api/demo/activity', async (req, res) => {
  try {
    const term = req.query.term || 'Fall'
    const year = Number(req.query.year) || 2026
    const payload = await getStudentAccountPayload(DEMO_STUDENT_ID, term, year)
    const rows = buildActivityRows(payload)
    console.log('[GET /api/demo/activity]', {
      mongoReady: mongoose.connection.readyState === 1,
      rows: rows.length,
    })
    res.json({ rows })
  } catch (e) {
    console.error('[GET /api/demo/activity]', e.message || e)
    res.status(500).json({ error: 'Failed to load activity', detail: String(e.message || e) })
  }
})

async function start() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student-tuition-portal'
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('[mongo] Connection failed:', err.message)
    console.error(
      '[mongo] Server will still listen. GET /api/demo/account?term=Fall&year=2026 uses in-memory catalog data until Mongo is reachable.',
    )
  }
  app.listen(PORT, () => {
    console.log(`API http://127.0.0.1:${PORT}`)
    console.log(
      `Verify demo JSON: http://127.0.0.1:${PORT}/api/demo/account?term=Fall&year=2026`,
    )
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
