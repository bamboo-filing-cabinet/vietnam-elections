#!/usr/bin/env python3
import csv
import json
import glob
import hashlib
import os
import re
import sqlite3
import unicodedata


DATA_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(DATA_DIR)
DB_PATH = os.path.join(ROOT, "staging.db")
MANUAL_TIMELINES_PATH = os.path.join(ROOT, "manual", "timelines.json")

ELECTION_CYCLE_ID = "na15-2021"
ELECTION_CYCLE_NAME = "15th National Assembly"
ELECTION_CYCLE_YEAR = 2021
ELECTION_CYCLE_TYPE = "national_assembly"
DOCUMENT_FETCHED_DATE = "2026-01-02"
RESULTS_FETCHED_DATE = "2026-01-09"
DOC_URL_CANDIDATE_LIST = "https://images.hcmcpv.org.vn/Uploads/File/280420219523F244/Danhsachbaucu-PYFO.pdf"
DOC_URL_CONGRESSIONAL_UNITS = "https://images.hcmcpv.org.vn/Uploads/File/280420219523F244/Danhsachbaucu-PYFO.pdf"
DOC_URL_DOCX_LIST = "https://baochinhphu.vn/danh-sach-868-nguoi-ung-cu-dbqh-khoa-xv-102291334.htm"
DOC_URL_RESULTS_CEMA = "https://web.archive.org/web/20250221194402/http://www.cema.gov.vn/bau-cu-QH-HDND/cong-bo-danh-sach-499-nguoi-trung-cu-dai-bieu-quoc-hoi-khoa-xv.htm"
DOC_PATH_CANDIDATE_PDF = "data/na15-2021/candidates-list/candidates-list-vietnamese.pdf"
DOC_PATH_CONGRESSIONAL_UNITS = "data/na15-2021/congressional-units.pdf"
RESULTS_CEMA_JSON = os.path.join(DATA_DIR, "results", "cema-district-results.json")


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


def normalize_candidate_name(value: str) -> tuple[str, str | None]:
    if value is None:
        return "", None
    # Prefer the name outside parentheses; keep alias (if any) as a fallback.
    alias_match = re.search(r"\(([^)]*)\)", value)
    alias_raw = alias_match.group(1).strip() if alias_match else None
    cleaned = re.sub(r"\([^)]*\)", "", value)
    folded = fold_text(cleaned)
    for prefix in ("ong ", "ba "):
        if folded.startswith(prefix):
            folded = folded[len(prefix):].strip()
            break
    alias_folded = None
    if alias_raw:
        alias_folded = fold_text(alias_raw)
    return folded, alias_folded


def escape_like(value: str) -> str:
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def normalize_locality_name(value: str) -> str:
    if value is None:
        return ""
    text = value.strip()
    text = re.sub(r"^tp\.?\s+", "Thành phố ", text, flags=re.IGNORECASE)
    text = re.sub(r"^t\.\s+", "Tỉnh ", text, flags=re.IGNORECASE)
    return text


def locality_match_keys(value: str) -> list[str]:
    normalized = normalize_locality_name(value)
    folded = fold_text(normalized)
    keys = {folded}
    if folded.startswith("tinh "):
        keys.add(folded.replace("tinh ", "", 1))
    if folded.startswith("thanh pho "):
        keys.add(folded.replace("thanh pho ", "", 1))
    return sorted(keys)


def make_id(prefix: str, raw: str) -> str:
    digest = hashlib.sha1(raw.encode("utf-8")).hexdigest()[:12]
    return f"{prefix}{digest}"


def to_int(value: str) -> int:
    if value is None or value == "":
        return 0
    return int(str(value).strip())


def parse_seat_count(text: str) -> int | None:
    if not text:
        return None
    match = re.search(r"(\d+)\s+người", text)
    if match:
        return int(match.group(1))
    return None


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS election_cycle (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          year INTEGER NOT NULL,
          type TEXT NOT NULL,
          start_date TEXT,
          end_date TEXT,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS locality (
          id TEXT PRIMARY KEY,
          cycle_id TEXT NOT NULL REFERENCES election_cycle(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          name_folded TEXT NOT NULL,
          type TEXT NOT NULL,
          effective_from TEXT,
          effective_to TEXT,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS constituency (
          id TEXT PRIMARY KEY,
          cycle_id TEXT NOT NULL REFERENCES election_cycle(id) ON DELETE CASCADE,
          locality_id TEXT NOT NULL REFERENCES locality(id) ON DELETE RESTRICT,
          unit_number INTEGER NOT NULL,
          seat_count INTEGER NOT NULL,
          description TEXT,
          unit_context_raw TEXT
        );

        CREATE TABLE IF NOT EXISTS constituency_district (
          id TEXT PRIMARY KEY,
          constituency_id TEXT NOT NULL REFERENCES constituency(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          name_folded TEXT NOT NULL,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS person (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          full_name_folded TEXT NOT NULL,
          dob TEXT,
          gender TEXT,
          nationality TEXT,
          ethnicity TEXT,
          religion TEXT,
          birthplace TEXT,
          current_residence TEXT
        );

        CREATE TABLE IF NOT EXISTS candidate_entry (
          id TEXT PRIMARY KEY,
          person_id TEXT NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
          cycle_id TEXT NOT NULL REFERENCES election_cycle(id) ON DELETE CASCADE,
          constituency_id TEXT NOT NULL REFERENCES constituency(id) ON DELETE RESTRICT,
          list_order INTEGER NOT NULL,
          party_member_since TEXT,
          is_na_delegate TEXT,
          is_council_delegate TEXT
        );

        CREATE TABLE IF NOT EXISTS candidate_attribute (
          id TEXT PRIMARY KEY,
          candidate_entry_id TEXT NOT NULL REFERENCES candidate_entry(id) ON DELETE CASCADE,
          key TEXT NOT NULL,
          value TEXT,
          value_folded TEXT,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS document (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT,
          file_path TEXT,
          doc_type TEXT NOT NULL,
          published_date TEXT,
          fetched_date TEXT,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS source (
          id TEXT PRIMARY KEY,
          document_id TEXT NOT NULL REFERENCES document(id) ON DELETE RESTRICT,
          record_type TEXT NOT NULL,
          record_id TEXT NOT NULL,
          field TEXT NOT NULL,
          url TEXT,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS change_log (
          id TEXT PRIMARY KEY,
          record_type TEXT NOT NULL,
          record_id TEXT NOT NULL,
          change_type TEXT NOT NULL,
          changed_at TEXT NOT NULL,
          summary TEXT
        );

        CREATE TABLE IF NOT EXISTS election_result_candidate (
          id TEXT PRIMARY KEY,
          cycle_id TEXT NOT NULL REFERENCES election_cycle(id) ON DELETE CASCADE,
          locality_id TEXT REFERENCES locality(id) ON DELETE RESTRICT,
          constituency_id TEXT REFERENCES constituency(id) ON DELETE RESTRICT,
          candidate_entry_id TEXT REFERENCES candidate_entry(id) ON DELETE RESTRICT,
          candidate_name TEXT NOT NULL,
          candidate_name_folded TEXT NOT NULL,
          unit_number INTEGER,
          unit_description TEXT,
          order_in_unit INTEGER,
          votes INTEGER,
          votes_raw TEXT,
          percent REAL,
          percent_raw TEXT,
          source_document_id TEXT REFERENCES document(id) ON DELETE RESTRICT,
          notes TEXT
        );

        CREATE UNIQUE INDEX IF NOT EXISTS ux_constituency_cycle_locality_unit
          ON constituency (cycle_id, locality_id, unit_number);

        CREATE UNIQUE INDEX IF NOT EXISTS ux_candidate_cycle_constituency_order
          ON candidate_entry (cycle_id, constituency_id, list_order);

        CREATE UNIQUE INDEX IF NOT EXISTS ux_source_record_field_url
          ON source (record_type, record_id, field, url);

        CREATE INDEX IF NOT EXISTS ix_locality_name_folded ON locality (name_folded);
        CREATE INDEX IF NOT EXISTS ix_person_name_folded ON person (full_name_folded);
        CREATE INDEX IF NOT EXISTS ix_district_name_folded ON constituency_district (name_folded);
        CREATE INDEX IF NOT EXISTS ix_candidate_cycle ON candidate_entry (cycle_id);
        CREATE INDEX IF NOT EXISTS ix_candidate_constituency ON candidate_entry (constituency_id);
        CREATE INDEX IF NOT EXISTS ix_result_constituency ON election_result_candidate (constituency_id);
        CREATE INDEX IF NOT EXISTS ix_result_candidate_entry ON election_result_candidate (candidate_entry_id);
        """
    )


def load_manual_timelines() -> dict:
    if not os.path.exists(MANUAL_TIMELINES_PATH):
        return {}
    with open(MANUAL_TIMELINES_PATH, "r", encoding="utf-8") as fh:
        payload = json.load(fh)
    if not isinstance(payload, dict):
        raise RuntimeError("Manual timelines must be a JSON object keyed by cycle id.")
    return payload

def load_documents(conn: sqlite3.Connection) -> None:
    documents = [
        {
            "title": "Candidate list (PDF)",
            "url": DOC_URL_CANDIDATE_LIST,
            "file_path": DOC_PATH_CANDIDATE_PDF,
            "doc_type": "pdf",
            "fetched_date": DOCUMENT_FETCHED_DATE,
        },
        {
            "title": "Election results bulletin (CEMA)",
            "url": DOC_URL_RESULTS_CEMA,
            "doc_type": "web",
            "published_date": "2021-06-11",
            "fetched_date": RESULTS_FETCHED_DATE,
        },
        {
            "title": "Congressional units (PDF)",
            "url": DOC_URL_CONGRESSIONAL_UNITS,
            "file_path": DOC_PATH_CONGRESSIONAL_UNITS,
            "doc_type": "pdf",
            "fetched_date": DOCUMENT_FETCHED_DATE,
        },
    ]

    docx_paths = sorted(glob.glob(os.path.join(DATA_DIR, "candidates-list", "*.docx")))
    for path in docx_paths:
        filename = os.path.basename(path)
        documents.append(
            {
                "title": f"Candidate list ({filename})",
                "url": DOC_URL_DOCX_LIST,
                "file_path": f"data/na15-2021/candidates-list/{filename}",
                "doc_type": "docx",
                "fetched_date": DOCUMENT_FETCHED_DATE,
            }
        )

    for doc in documents:
        doc_key = doc.get("file_path") or doc.get("url") or doc["title"]
        doc_id = make_id("doc-", f"{doc['doc_type']}|{doc_key}")
        conn.execute(
            """
            INSERT INTO document
              (id, title, url, file_path, doc_type, published_date, fetched_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                doc_id,
                doc["title"],
                doc.get("url"),
                doc.get("file_path"),
                doc["doc_type"],
                doc.get("published_date"),
                doc.get("fetched_date"),
            ),
        )


def add_candidate_sources(conn: sqlite3.Connection) -> None:
    document_id = make_id("doc-", f"pdf|{DOC_PATH_CANDIDATE_PDF}")
    candidate_rows = conn.execute("SELECT id FROM candidate_entry").fetchall()
    for (entry_id,) in candidate_rows:
        source_id = make_id(
            "source-", f"candidate_entry|{entry_id}|candidate_list|{DOC_URL_CANDIDATE_LIST}"
        )
        conn.execute(
            """
            INSERT INTO source (id, document_id, record_type, record_id, field, url)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                source_id,
                document_id,
                "candidate_entry",
                entry_id,
                "candidate_list",
                DOC_URL_CANDIDATE_LIST,
            ),
        )


def add_constituency_sources(conn: sqlite3.Connection) -> None:
    document_id = make_id("doc-", f"pdf|{DOC_PATH_CONGRESSIONAL_UNITS}")
    constituency_rows = conn.execute("SELECT id FROM constituency").fetchall()
    for (constituency_id,) in constituency_rows:
        source_id = make_id(
            "source-",
            f"constituency|{constituency_id}|congressional_units|{DOC_URL_CONGRESSIONAL_UNITS}",
        )
        conn.execute(
            """
            INSERT INTO source (id, document_id, record_type, record_id, field, url)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                source_id,
                document_id,
                "constituency",
                constituency_id,
                "congressional_units",
                DOC_URL_CONGRESSIONAL_UNITS,
            ),
        )

    district_rows = conn.execute(
        "SELECT id FROM constituency_district"
    ).fetchall()
    for (district_id,) in district_rows:
        source_id = make_id(
            "source-",
            f"constituency_district|{district_id}|congressional_units|{DOC_URL_CONGRESSIONAL_UNITS}",
        )
        conn.execute(
            """
            INSERT INTO source (id, document_id, record_type, record_id, field, url)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                source_id,
                document_id,
                "constituency_district",
                district_id,
                "congressional_units",
                DOC_URL_CONGRESSIONAL_UNITS,
            ),
        )


def load_congressional_units(conn: sqlite3.Connection) -> dict:
    path = os.path.join(DATA_DIR, "congressional-units-parsed.csv")
    locality_map = {}
    locality_key_map = {}
    constituency_map = {}

    with open(path, "r", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            locality_name_raw = row["associated_province"].strip()
            locality_keys = locality_match_keys(locality_name_raw)
            locality_folded = locality_keys[0]
            if locality_folded not in locality_map:
                locality_id = make_id("loc-", f"{ELECTION_CYCLE_ID}|{locality_folded}")
                locality_map[locality_folded] = locality_id
                conn.execute(
                    """
                    INSERT INTO locality (id, cycle_id, name, name_folded, type)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (locality_id, ELECTION_CYCLE_ID, locality_name_raw, locality_folded, "province_or_city"),
                )
                for key in locality_keys:
                    locality_key_map[key] = locality_id
            else:
                for key in locality_keys:
                    locality_key_map.setdefault(key, locality_map[locality_folded])

            constituency_id = f"{ELECTION_CYCLE_ID}-const-{row['congressional_unit_id']}"
            constituency_map[(locality_map[locality_folded], to_int(row["province_congressional_unit_number"]))] = (
                constituency_id
            )

            conn.execute(
                """
                INSERT INTO constituency
                  (id, cycle_id, locality_id, unit_number, seat_count, description)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    constituency_id,
                    ELECTION_CYCLE_ID,
                    locality_map[locality_folded],
                    to_int(row["province_congressional_unit_number"]),
                    to_int(row["representatives_count"]),
                    row.get("districts"),
                ),
            )

            districts_raw = row.get("districts") or ""
            for district in [d.strip() for d in districts_raw.split(",") if d.strip()]:
                district_folded = fold_text(district)
                district_id = make_id("dist-", f"{constituency_id}|{district_folded}")
                conn.execute(
                    """
                    INSERT INTO constituency_district (id, constituency_id, name, name_folded)
                    VALUES (?, ?, ?, ?)
                    """,
                    (district_id, constituency_id, district, district_folded),
                )

    return {
        "locality_map": locality_map,
        "locality_key_map": locality_key_map,
        "constituency_map": constituency_map,
    }


def get_attr(row: dict, key: str) -> str:
    value = row.get(key)
    if value is None:
        return ""
    return str(value).strip()


def load_candidates(
    conn: sqlite3.Connection, locality_key_map: dict, constituency_map: dict
) -> None:
    csv_paths = sorted(glob.glob(os.path.join(DATA_DIR, "candidates-list", "*.csv")))
    if not csv_paths:
        raise RuntimeError("No candidate CSV files found.")

    for path in csv_paths:
        with open(path, "r", encoding="utf-8") as fh:
            reader = csv.DictReader(fh)
            for row in reader:
                province_raw = get_attr(row, "province_or_city")
                province_folded = fold_text(normalize_locality_name(province_raw))
                if province_folded not in locality_key_map:
                    raise RuntimeError(
                        f"Unknown locality: {province_raw} (folded: {province_folded})"
                    )

                unit_number = to_int(get_attr(row, "unit_number"))
                locality_id = locality_key_map[province_folded]
                constituency_id = constituency_map.get((locality_id, unit_number))
                if constituency_id is None:
                    unit_context_raw = get_attr(row, "unit_context")
                    unit_description = get_attr(row, "unit_description")
                    seat_count = parse_seat_count(unit_context_raw or unit_description) or 0
                    constituency_id = make_id(
                        "const-auto-", f"{ELECTION_CYCLE_ID}|{locality_id}|{unit_number}"
                    )
                    conn.execute(
                        """
                        INSERT INTO constituency
                          (id, cycle_id, locality_id, unit_number, seat_count, description, unit_context_raw)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            constituency_id,
                            ELECTION_CYCLE_ID,
                            locality_id,
                            unit_number,
                            seat_count,
                            unit_description or None,
                            unit_context_raw or None,
                        ),
                    )
                    constituency_map[(locality_id, unit_number)] = constituency_id

                full_name = get_attr(row, "Họ và tên")
                dob = get_attr(row, "Ngày tháng năm sinh")
                birthplace = get_attr(row, "Quê quán")
                # IDs are deterministic: changes in source fields will change IDs on rebuild.
                person_key = f"{fold_text(full_name)}|{dob}|{fold_text(birthplace)}"
                person_id = make_id("person-", person_key)

                conn.execute(
                    """
                    INSERT OR IGNORE INTO person
                      (id, full_name, full_name_folded, dob, gender, nationality,
                       ethnicity, religion, birthplace, current_residence)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        person_id,
                        full_name,
                        fold_text(full_name),
                        dob,
                        get_attr(row, "Giới tính"),
                        get_attr(row, "Quốc tịch"),
                        get_attr(row, "Dân tộc"),
                        get_attr(row, "Tôn giáo"),
                        birthplace,
                        get_attr(row, "Nơi ở hiện nay"),
                    ),
                )

                list_order = to_int(get_attr(row, "STT"))
                # Candidate entries are keyed by cycle + constituency + list order (STT).
                candidate_entry_id = f"{ELECTION_CYCLE_ID}-{constituency_id}-{list_order}"

                conn.execute(
                    """
                    INSERT INTO candidate_entry
                      (id, person_id, cycle_id, constituency_id, list_order,
                       party_member_since, is_na_delegate, is_council_delegate)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        candidate_entry_id,
                        person_id,
                        ELECTION_CYCLE_ID,
                        constituency_id,
                        list_order,
                        get_attr(row, "Ngày vào Đảng"),
                        get_attr(row, "Là đại biểu QH"),
                        get_attr(row, "Là đại biểu HĐND"),
                    ),
                )

                conn.execute(
                    """
                    UPDATE constituency
                    SET unit_context_raw = COALESCE(unit_context_raw, ?),
                        description = COALESCE(description, ?)
                    WHERE id = ?
                    """,
                    (
                        get_attr(row, "unit_context"),
                        get_attr(row, "unit_description"),
                        constituency_id,
                    ),
                )

                attr_map = {
                    "Trình độ học vấn - Giáo dục phổ thông": "education_general",
                    "Trình độ học vấn - Chuyên môn, nghiệp vụ": "education_professional",
                    "Trình độ học vấn - Học hàm, học vị": "education_academic_rank",
                    "Trình độ học vấn - Lý luận chính trị": "education_political",
                    "Trình độ học vấn - Ngoại ngữ": "education_languages",
                    "Nghề nghiệp, chức vụ": "occupation_title",
                    "Nơi công tác": "workplace",
                }

                for source_key, attr_key in attr_map.items():
                    value = get_attr(row, source_key)
                    if not value:
                        continue
                    # Attribute IDs are deterministic per candidate entry + attribute key.
                    attr_id = make_id("attr-", f"{candidate_entry_id}|{attr_key}")
                    conn.execute(
                        """
                        INSERT INTO candidate_attribute
                          (id, candidate_entry_id, key, value, value_folded)
                        VALUES (?, ?, ?, ?, ?)
                        """,
                        (
                            attr_id,
                            candidate_entry_id,
                            attr_key,
                            value,
                            fold_text(value),
                        ),
                    )


def resolve_candidate_entry_id(
    conn: sqlite3.Connection,
    cycle_id: str,
    constituency_id: str,
    name_folded: str,
    name_folded_raw: str,
) -> tuple[str | None, str | None]:
    rows = conn.execute(
        """
        SELECT ce.id, ce.constituency_id
        FROM candidate_entry ce
        JOIN person p ON p.id = ce.person_id
        WHERE ce.constituency_id = ? AND p.full_name_folded = ?
        """,
        (constituency_id, name_folded),
    ).fetchall()
    if len(rows) == 1:
        return rows[0][0], None
    if len(rows) > 1:
        return None, "multiple_candidates_match"

    if name_folded_raw != name_folded:
        rows = conn.execute(
            """
            SELECT ce.id, ce.constituency_id
            FROM candidate_entry ce
            JOIN person p ON p.id = ce.person_id
            WHERE ce.constituency_id = ? AND p.full_name_folded = ?
            """,
            (constituency_id, name_folded_raw),
        ).fetchall()
        if len(rows) == 1:
            return rows[0][0], None
        if len(rows) > 1:
            return None, "multiple_candidates_match"

    like_patterns = [
        ("name_like_prefix", "{}%"),
        ("name_like_suffix", "%{}"),
        ("name_like_contains", "%{}%"),
    ]

    for label, pattern in like_patterns:
        escaped = escape_like(name_folded)
        rows = conn.execute(
            """
            SELECT ce.id, ce.constituency_id
            FROM candidate_entry ce
            JOIN person p ON p.id = ce.person_id
            WHERE ce.constituency_id = ?
              AND p.full_name_folded LIKE ? ESCAPE '\\'
            """,
            (constituency_id, pattern.format(escaped)),
        ).fetchall()
        if len(rows) == 1:
            return rows[0][0], label
        if len(rows) > 1:
            return None, "multiple_candidates_match"

    if name_folded_raw != name_folded:
        for label, pattern in like_patterns:
            escaped = escape_like(name_folded_raw)
            rows = conn.execute(
                """
                SELECT ce.id, ce.constituency_id
                FROM candidate_entry ce
                JOIN person p ON p.id = ce.person_id
                WHERE ce.constituency_id = ?
                  AND p.full_name_folded LIKE ? ESCAPE '\\'
                """,
                (constituency_id, pattern.format(escaped)),
            ).fetchall()
            if len(rows) == 1:
                return rows[0][0], f"{label}_raw"
            if len(rows) > 1:
                return None, "multiple_candidates_match"

    # Cycle-wide fallback: match by name and flag if constituency differs.
    rows = conn.execute(
        """
        SELECT ce.id, ce.constituency_id
        FROM candidate_entry ce
        JOIN person p ON p.id = ce.person_id
        WHERE ce.cycle_id = ? AND p.full_name_folded = ?
        """,
        (cycle_id, name_folded),
    ).fetchall()
    if len(rows) == 1:
        note = None if rows[0][1] == constituency_id else "constituency_mismatch"
        return rows[0][0], note
    if len(rows) > 1:
        return None, "multiple_candidates_match"

    for label, pattern in like_patterns:
        escaped = escape_like(name_folded)
        rows = conn.execute(
            """
            SELECT ce.id, ce.constituency_id
            FROM candidate_entry ce
            JOIN person p ON p.id = ce.person_id
            WHERE ce.cycle_id = ? AND p.full_name_folded LIKE ? ESCAPE '\\'
            """,
            (cycle_id, pattern.format(escaped)),
        ).fetchall()
        if len(rows) == 1:
            note = label
            if rows[0][1] != constituency_id:
                note = f"constituency_mismatch;{label}"
            return rows[0][0], note
        if len(rows) > 1:
            return None, "multiple_candidates_match"

    if name_folded_raw != name_folded:
        rows = conn.execute(
            """
            SELECT ce.id, ce.constituency_id
            FROM candidate_entry ce
            JOIN person p ON p.id = ce.person_id
            WHERE ce.cycle_id = ? AND p.full_name_folded = ?
            """,
            (cycle_id, name_folded_raw),
        ).fetchall()
        if len(rows) == 1:
            note = None if rows[0][1] == constituency_id else "constituency_mismatch"
            return rows[0][0], note
        if len(rows) > 1:
            return None, "multiple_candidates_match"

    if name_folded_raw != name_folded:
        for label, pattern in like_patterns:
            escaped = escape_like(name_folded_raw)
            rows = conn.execute(
                """
                SELECT ce.id, ce.constituency_id
                FROM candidate_entry ce
                JOIN person p ON p.id = ce.person_id
                WHERE ce.cycle_id = ? AND p.full_name_folded LIKE ? ESCAPE '\\'
                """,
                (cycle_id, pattern.format(escaped)),
            ).fetchall()
            if len(rows) == 1:
                note = f"{label}_raw"
                if rows[0][1] != constituency_id:
                    note = f"constituency_mismatch;{label}_raw"
                return rows[0][0], note
            if len(rows) > 1:
                return None, "multiple_candidates_match"

    return None, "candidate_unmatched"


def load_cema_results(
    conn: sqlite3.Connection, locality_key_map: dict, constituency_map: dict
) -> None:
    if not os.path.exists(RESULTS_CEMA_JSON):
        return

    with open(RESULTS_CEMA_JSON, "r", encoding="utf-8") as fh:
        payload = json.load(fh)

    records = payload.get("records", [])
    if not isinstance(records, list):
        raise RuntimeError("CEMA results JSON records must be a list.")

    document_id = make_id("doc-", f"web|{DOC_URL_RESULTS_CEMA}")

    for record in records:
        province_raw = str(record.get("province") or "").strip()
        unit_number = record.get("unit_number")
        unit_description = record.get("unit_description")
        candidate_name = str(record.get("candidate_name") or "").strip()
        order_in_unit = record.get("order")
        votes = record.get("votes")
        votes_raw = record.get("votes_raw")
        percent = record.get("percent")
        percent_raw = record.get("percent_raw")

        name_folded_raw = fold_text(candidate_name)
        name_folded, name_folded_alias = normalize_candidate_name(candidate_name)

        locality_id = None
        constituency_id = None
        notes = None

        if province_raw:
            province_folded = fold_text(normalize_locality_name(province_raw))
            locality_id = locality_key_map.get(province_folded)
        if locality_id and unit_number is not None:
            constituency_id = constituency_map.get((locality_id, int(unit_number)))

        candidate_entry_id = None
        if constituency_id:
            candidate_entry_id, match_note = resolve_candidate_entry_id(
                conn, ELECTION_CYCLE_ID, constituency_id, name_folded, name_folded_raw
            )
            if match_note:
                notes = match_note
            if candidate_entry_id is None and name_folded_alias:
                candidate_entry_id, match_note = resolve_candidate_entry_id(
                    conn,
                    ELECTION_CYCLE_ID,
                    constituency_id,
                    name_folded_alias,
                    name_folded_alias,
                )
                if match_note:
                    notes = "alias_" + match_note
                elif candidate_entry_id:
                    notes = "alias_match"
        else:
            notes = "constituency_unmatched"

        result_id = make_id(
            "res-",
            f"{ELECTION_CYCLE_ID}|{province_raw}|{unit_number}|{order_in_unit}|{name_folded}",
        )

        conn.execute(
            """
            INSERT INTO election_result_candidate
              (id, cycle_id, locality_id, constituency_id, candidate_entry_id,
               candidate_name, candidate_name_folded, unit_number, unit_description,
               order_in_unit, votes, votes_raw, percent, percent_raw,
               source_document_id, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                result_id,
                ELECTION_CYCLE_ID,
                locality_id,
                constituency_id,
                candidate_entry_id,
                candidate_name,
                name_folded,
                int(unit_number) if unit_number is not None else None,
                unit_description,
                int(order_in_unit) if order_in_unit is not None else None,
                int(votes) if votes is not None else None,
                votes_raw,
                float(percent) if percent is not None else None,
                percent_raw,
                document_id,
                notes,
            ),
        )

        source_id = make_id(
            "source-", f"election_result_candidate|{result_id}|results|{DOC_URL_RESULTS_CEMA}"
        )
        conn.execute(
            """
            INSERT INTO source (id, document_id, record_type, record_id, field, url)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                source_id,
                document_id,
                "election_result_candidate",
                result_id,
                "results",
                DOC_URL_RESULTS_CEMA,
            ),
        )

def main() -> None:
    ensure_dir(DATA_DIR)
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    try:
        init_db(conn)
        conn.execute(
            """
            INSERT INTO election_cycle (id, name, year, type)
            VALUES (?, ?, ?, ?)
            """,
            (ELECTION_CYCLE_ID, ELECTION_CYCLE_NAME, ELECTION_CYCLE_YEAR, ELECTION_CYCLE_TYPE),
        )
        manual_timelines = load_manual_timelines()
        cycle_override = manual_timelines.get(ELECTION_CYCLE_ID)
        if cycle_override:
            conn.execute(
                """
                UPDATE election_cycle
                SET start_date = ?, end_date = ?, notes = ?
                WHERE id = ?
                """,
                (
                    cycle_override.get("start_date"),
                    cycle_override.get("end_date"),
                    cycle_override.get("notes"),
                    ELECTION_CYCLE_ID,
                ),
            )
        load_documents(conn)
        maps = load_congressional_units(conn)
        load_candidates(conn, maps["locality_key_map"], maps["constituency_map"])
        add_candidate_sources(conn)
        add_constituency_sources(conn)
        load_cema_results(conn, maps["locality_key_map"], maps["constituency_map"])
        conn.commit()
    finally:
        conn.close()

    print(f"Created {DB_PATH}")


if __name__ == "__main__":
    main()
