#!/usr/bin/env python3
import csv
from pathlib import Path

import psycopg2
from psycopg2 import sql


CSV_FOLDER = Path("/Users/alt./Desktop/mysql_exports_all")

DB_CONFIG = {
    "host": "db.hffpwguupjiffaltbjri.supabase.co",
    "port": 5432,
    "dbname": "postgres",
    "user": "postgres",
    "password": "MyAMU@2026_Supabase!",
    "sslmode": "require",
}


def import_csv_file(connection, csv_path: Path) -> None:
    table_name = csv_path.stem
    print(f"Starting import for table '{table_name}' from '{csv_path.name}'...")

    try:
        file_size = csv_path.stat().st_size
        if file_size == 0:
            print(f"Skipping '{table_name}': CSV file is empty.")
            return

        with csv_path.open("r", encoding="utf-8-sig", newline="") as csv_file:
            reader = csv.reader(csv_file)
            header = next(reader, None)

            if not header:
                print(f"Skipping '{table_name}': CSV file has no header row.")
                return

            if any(column.strip() == "" for column in header):
                print(f"Skipping '{table_name}': header contains empty column name(s).")
                return

            first_data_row = next(reader, None)
            if first_data_row is None:
                print(f"Skipping '{table_name}': CSV file has no data rows.")
                return

            csv_file.seek(0)

            column_identifiers = [sql.Identifier(column) for column in header]
            copy_query = sql.SQL(
                "COPY {} ({}) FROM STDIN WITH (FORMAT csv, HEADER true)"
            ).format(
                sql.Identifier(table_name),
                sql.SQL(", ").join(column_identifiers),
            )

            with connection.cursor() as cursor:
                cursor.copy_expert(copy_query.as_string(connection), csv_file)

        connection.commit()
        print(f"Finished import for table '{table_name}'.")
    except Exception as exc:
        connection.rollback()
        print(f"Failed to import table '{table_name}': {exc}")


def main() -> None:
    if not CSV_FOLDER.exists():
        print(f"CSV folder not found: {CSV_FOLDER}")
        return

    csv_files = sorted(CSV_FOLDER.glob("*.csv"))
    if not csv_files:
        print(f"No CSV files found in: {CSV_FOLDER}")
        return

    print(f"Found {len(csv_files)} CSV file(s) in '{CSV_FOLDER}'.")

    connection = None
    try:
        connection = psycopg2.connect(**DB_CONFIG)
        print("Connected to Supabase Postgres.")

        for csv_path in csv_files:
            import_csv_file(connection, csv_path)
    except Exception as exc:
        print(f"Database connection failed: {exc}")
    finally:
        if connection is not None:
            connection.close()
            print("Database connection closed.")


if __name__ == "__main__":
    main()
