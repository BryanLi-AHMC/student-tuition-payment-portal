import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { StudentDashboardPage } from './pages/StudentDashboardPage'
import { MakePaymentPage } from './pages/MakePaymentPage'
import { PaymentPlanPage } from './pages/PaymentPlanPage'
import { ActivityDetailsPage } from './pages/ActivityDetailsPage'
import { StatementsPage } from './pages/StatementsPage'
import './styles/portal.css'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<StudentDashboardPage />} />
      <Route path="/payment" element={<MakePaymentPage />} />
      <Route path="/plan" element={<PaymentPlanPage />} />
      <Route path="/activity" element={<ActivityDetailsPage />} />
      <Route path="/statements" element={<StatementsPage />} />
    </Routes>
  )
}
