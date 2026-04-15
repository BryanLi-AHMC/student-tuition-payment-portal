import os
import csv
import pymysql
from pymysql.constants import CLIENT

HOST = "school-db.cd6o8awqe4ig.us-east-2.rds.amazonaws.com"
USER = "admin"
PASSWORD = "School123!aws"
DATABASE = "school"
PORT = 3306

OUTPUT_DIR = "/Users/alt./Desktop/mysql_exports_all"
os.makedirs(OUTPUT_DIR, exist_ok=True)

conn = pymysql.connect(
    host=HOST,
    user=USER,
    password=PASSWORD,
    database=DATABASE,
    port=PORT,
    charset="utf8mb4",
    ssl={"ssl": {}},
    client_flag=CLIENT.MULTI_STATEMENTS,
    cursorclass=pymysql.cursors.Cursor,
)

def safe_text(v):
    if v is None:
        return None
    if isinstance(v, bytes):
        for enc in ("utf-8", "big5", "latin1"):
            try:
                return v.decode(enc)
            except Exception:
                pass
        return v.decode("utf-8", errors="replace")
    return v

with conn.cursor() as cur:
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = %s
        ORDER BY table_name
    """, (DATABASE,))
    tables = [row[0] for row in cur.fetchall()]

    print(f"Found {len(tables)} tables")

    for table in tables:
        print(f"Exporting {table} ...")
        cur.execute(f"SELECT * FROM `{table}`")
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]

        out_path = os.path.join(OUTPUT_DIR, f"{table}.csv")
        with open(out_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow(columns)
            for row in rows:
                writer.writerow([safe_text(v) for v in row])

print(f"Done. CSV files written to: {OUTPUT_DIR}")
conn.close()
