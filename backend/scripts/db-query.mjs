/**
 * Run a single SQL statement against DB_* in backend/.env (no mysql CLI required).
 * Usage (from repo root): npm run db:query -w backend -- "DESCRIBE courses;"
 * Or from backend/: npm run db:query -- "SELECT 1;"
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const sql = process.argv.slice(2).join(" ").trim();
if (!sql) {
  console.error('Usage: npm run db:query -w backend -- "YOUR SQL HERE"');
  process.exit(1);
}

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT ?? 3306);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD ?? "";
const database = process.env.DB_NAME;

if (!host || !user || !database) {
  console.error("Missing DB_HOST, DB_USER, or DB_NAME in backend/.env");
  process.exit(1);
}

const conn = await mysql.createConnection({
  host,
  port,
  user,
  password,
  database,
});

try {
  const [rows, fields] = await conn.query(sql);
  if (Array.isArray(rows)) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.log(JSON.stringify({ result: rows, fields }, null, 2));
  }
} finally {
  await conn.end();
}
