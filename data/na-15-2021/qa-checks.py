#!/usr/bin/env python3
import os
import sqlite3
import sys


DATA_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DATA_DIR, "staging.db")


def fetch_all(conn: sqlite3.Connection, query: str, params: tuple = ()) -> list[sqlite3.Row]:
    cur = conn.execute(query, params)
    return cur.fetchall()


def main() -> int:
    if not os.path.exists(DB_PATH):
        print(f"Missing staging DB at {DB_PATH}")
        return 2

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    errors: list[str] = []
    warnings: list[str] = []

    try:
        fk_issues = fetch_all(conn, "PRAGMA foreign_key_check")
        if fk_issues:
            errors.append(f"Foreign key violations: {len(fk_issues)}")

        dupe_entries = fetch_all(
            conn,
            """
            SELECT cycle_id, constituency_id, list_order, COUNT(*) AS cnt
            FROM candidate_entry
            GROUP BY cycle_id, constituency_id, list_order
            HAVING cnt > 1
            """,
        )
        if dupe_entries:
            errors.append(f"Duplicate candidate_entry rows: {len(dupe_entries)} groups")

        dupe_names = fetch_all(
            conn,
            """
            SELECT ce.cycle_id, c.locality_id, p.full_name_folded, COUNT(*) AS cnt
            FROM candidate_entry ce
            JOIN person p ON p.id = ce.person_id
            JOIN constituency c ON c.id = ce.constituency_id
            GROUP BY ce.cycle_id, c.locality_id, p.full_name_folded
            HAVING cnt > 1
            """,
        )
        if dupe_names:
            warnings.append(f"Duplicate names within cycle+locality: {len(dupe_names)} groups")

        missing_required = fetch_all(
            conn,
            """
            SELECT ce.id
            FROM candidate_entry ce
            JOIN person p ON p.id = ce.person_id
            WHERE p.full_name IS NULL OR TRIM(p.full_name) = ""
               OR ce.constituency_id IS NULL
               OR ce.list_order IS NULL
            """,
        )
        if missing_required:
            errors.append(f"Missing key fields on candidate_entry: {len(missing_required)}")

        missing_sources = fetch_all(
            conn,
            """
            SELECT ce.id
            FROM candidate_entry ce
            LEFT JOIN source s
              ON s.record_type = 'candidate_entry' AND s.record_id = ce.id
            WHERE s.id IS NULL
            """,
        )
        if missing_sources:
            warnings.append(f"Candidate entries missing sources: {len(missing_sources)}")

        document_count = fetch_all(conn, "SELECT COUNT(*) AS cnt FROM document")
        if document_count and document_count[0]["cnt"] == 0:
            warnings.append("No documents recorded in document table")
    finally:
        conn.close()

    if warnings:
        print("WARNINGS:")
        for item in warnings:
            print(f"- {item}")
    if errors:
        print("ERRORS:")
        for item in errors:
            print(f"- {item}")

    if errors:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
