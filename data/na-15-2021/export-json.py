#!/usr/bin/env python3
import json
import os
import sqlite3
from datetime import datetime, timezone
import re
import unicodedata


DATA_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(DATA_DIR))
DB_PATH = os.path.join(DATA_DIR, "staging.db")
OUTPUT_ROOT = os.path.join(ROOT, "public", "data")


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def fold_text(value: str) -> str:
    if value is None:
        return ""
    text = value.strip().lower()
    text = text.replace("đ", "d")
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = re.sub(r"[^a-z0-9\s]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def constituency_label(unit_number: int | None) -> str:
    if unit_number is None:
        return "Đơn vị bầu cử"
    return f"Đơn vị bầu cử số {unit_number}"


def write_json(path: str, payload: dict) -> None:
    ensure_dir(os.path.dirname(path))
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def fetch_one(conn: sqlite3.Connection, query: str, params: tuple = ()) -> sqlite3.Row:
    cur = conn.execute(query, params)
    row = cur.fetchone()
    if row is None:
        raise RuntimeError("Expected a row but got none.")
    return row


def export_cycle(conn: sqlite3.Connection) -> None:
    conn.row_factory = sqlite3.Row

    cycle_row = fetch_one(
        conn,
        """
        SELECT id, name, year, type, start_date, end_date, notes
        FROM election_cycle
        ORDER BY year DESC
        LIMIT 1
        """,
    )
    cycle_id = cycle_row["id"]
    generated_at = utc_now()
    base_dir = os.path.join(OUTPUT_ROOT, "elections", cycle_id)

    localities = [
        {
            "id": row["id"],
            "name_vi": row["name"],
            "name_folded": row["name_folded"],
            "type": row["type"],
        }
        for row in conn.execute(
            """
            SELECT id, name, name_folded, type
            FROM locality
            WHERE cycle_id = ?
            ORDER BY name
            """,
            (cycle_id,),
        ).fetchall()
    ]

    constituencies = []
    for row in conn.execute(
        """
        SELECT id, locality_id, unit_number, seat_count, description, unit_context_raw
        FROM constituency
        WHERE cycle_id = ?
        ORDER BY locality_id, unit_number
        """,
        (cycle_id,),
    ).fetchall():
        districts = [
            {
                "name_vi": dist["name"],
                "name_folded": dist["name_folded"],
            }
            for dist in conn.execute(
                """
                SELECT name, name_folded
                FROM constituency_district
                WHERE constituency_id = ?
                ORDER BY name
                """,
                (row["id"],),
            ).fetchall()
        ]
        constituencies.append(
            {
                "id": row["id"],
                "locality_id": row["locality_id"],
                "unit_number": row["unit_number"],
                "seat_count": row["seat_count"],
                "name_vi": constituency_label(row["unit_number"]),
                "name_folded": fold_text(constituency_label(row["unit_number"])),
                "description": row["description"],
                "unit_context_raw": row["unit_context_raw"],
                "districts": districts,
            }
        )

    locality_map = {loc["id"]: loc for loc in localities}
    constituency_map = {c["id"]: c for c in constituencies}

    index_records = []
    detail_dir = os.path.join(base_dir, "candidates_detail")
    ensure_dir(detail_dir)

    candidate_rows = conn.execute(
        """
        SELECT ce.id AS entry_id,
               ce.person_id,
               ce.constituency_id,
               ce.list_order,
               ce.party_member_since,
               ce.is_na_delegate,
               ce.is_council_delegate,
               p.full_name,
               p.full_name_folded,
               p.dob,
               p.gender,
               p.nationality,
               p.ethnicity,
               p.religion,
               p.birthplace,
               p.current_residence,
               c.unit_number,
               c.locality_id
        FROM candidate_entry ce
        JOIN person p ON p.id = ce.person_id
        JOIN constituency c ON c.id = ce.constituency_id
        WHERE ce.cycle_id = ?
        ORDER BY c.locality_id, c.unit_number, ce.list_order
        """,
        (cycle_id,),
    ).fetchall()

    for row in candidate_rows:
        locality = locality_map.get(row["locality_id"])
        constituency = constituency_map.get(row["constituency_id"])

        index_record = {
            "entry_id": row["entry_id"],
            "person_id": row["person_id"],
            "name_vi": row["full_name"],
            "name_folded": row["full_name_folded"],
            "locality_id": locality["id"] if locality else None,
            "locality_vi": locality["name_vi"] if locality else None,
            "locality_folded": locality["name_folded"] if locality else None,
            "constituency_id": constituency["id"] if constituency else None,
            "constituency_vi": constituency["name_vi"] if constituency else None,
            "constituency_folded": constituency["name_folded"] if constituency else None,
            "unit_number": row["unit_number"],
            "list_order": row["list_order"],
        }
        index_records.append(index_record)

        attributes = [
            {"key": attr["key"], "value": attr["value"]}
            for attr in conn.execute(
                """
                SELECT key, value
                FROM candidate_attribute
                WHERE candidate_entry_id = ?
                ORDER BY key
                """,
                (row["entry_id"],),
            ).fetchall()
        ]

        changelog = [
            {
                "change_type": log["change_type"],
                "changed_at": log["changed_at"],
                "summary": log["summary"],
            }
            for log in conn.execute(
                """
                SELECT change_type, changed_at, summary
                FROM change_log
                WHERE record_type = 'candidate_entry' AND record_id = ?
                ORDER BY changed_at
                """,
                (row["entry_id"],),
            ).fetchall()
        ]

        sources = [
            {
                "field": src["field"],
                "document_id": src["document_id"],
                "title": src["title"],
                "url": src["url"] or src["document_url"],
                "doc_type": src["doc_type"],
                "published_date": src["published_date"],
                "fetched_date": src["fetched_date"],
                "notes": src["notes"],
            }
            for src in conn.execute(
                """
                SELECT s.field,
                       s.document_id,
                       s.url,
                       s.notes,
                       d.title,
                       d.url AS document_url,
                       d.doc_type,
                       d.published_date,
                       d.fetched_date
                FROM source s
                JOIN document d ON d.id = s.document_id
                WHERE s.record_type = 'candidate_entry' AND s.record_id = ?
                ORDER BY s.field, d.title
                """,
                (row["entry_id"],),
            ).fetchall()
        ]

        detail_payload = {
            "entry_id": row["entry_id"],
            "cycle_id": cycle_id,
            "person": {
                "id": row["person_id"],
                "full_name": row["full_name"],
                "full_name_folded": row["full_name_folded"],
                "dob": row["dob"],
                "gender": row["gender"],
                "nationality": row["nationality"],
                "ethnicity": row["ethnicity"],
                "religion": row["religion"],
                "birthplace": row["birthplace"],
                "current_residence": row["current_residence"],
            },
            "entry": {
                "constituency_id": row["constituency_id"],
                "list_order": row["list_order"],
                "party_member_since": row["party_member_since"],
                "is_na_delegate": row["is_na_delegate"],
                "is_council_delegate": row["is_council_delegate"],
            },
            "locality": locality,
            "constituency": constituency,
            "attributes": attributes,
            "sources": sources,
            "changelog": changelog,
        }

        write_json(os.path.join(detail_dir, f"{row['entry_id']}.json"), detail_payload)

    write_json(
        os.path.join(base_dir, "candidates_index.json"),
        {
            "cycle_id": cycle_id,
            "generated_at": generated_at,
            "records": index_records,
        },
    )

    write_json(
        os.path.join(base_dir, "localities.json"),
        {"cycle_id": cycle_id, "generated_at": generated_at, "records": localities},
    )

    write_json(
        os.path.join(base_dir, "constituencies.json"),
        {"cycle_id": cycle_id, "generated_at": generated_at, "records": constituencies},
    )

    write_json(
        os.path.join(base_dir, "documents.json"),
        {"cycle_id": cycle_id, "generated_at": generated_at, "records": []},
    )

    write_json(
        os.path.join(base_dir, "timeline.json"),
        {
            "cycle_id": cycle_id,
            "generated_at": generated_at,
            "cycle": {
                "id": cycle_row["id"],
                "name": cycle_row["name"],
                "year": cycle_row["year"],
                "type": cycle_row["type"],
                "start_date": cycle_row["start_date"],
                "end_date": cycle_row["end_date"],
                "notes": cycle_row["notes"],
            },
        },
    )

    write_json(
        os.path.join(base_dir, "changelog.json"),
        {"cycle_id": cycle_id, "generated_at": generated_at, "records": []},
    )


def main() -> None:
    if not os.path.exists(DB_PATH):
        raise RuntimeError(f"Missing staging DB at {DB_PATH}")

    ensure_dir(OUTPUT_ROOT)
    conn = sqlite3.connect(DB_PATH)
    try:
        export_cycle(conn)
    finally:
        conn.close()

    print(f"Exported JSON to {OUTPUT_ROOT}")


if __name__ == "__main__":
    main()
