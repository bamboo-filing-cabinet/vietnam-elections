#!/usr/bin/env python3
"""Parse fetched delegate profile pages into structured JSON.

Reads HTML files from profiles/ and extracts biographical data, career
timeline, and election details into a single JSON output.
"""
import json
import re
from pathlib import Path

DATA_DIR = Path(__file__).parent
PROFILES_DIR = DATA_DIR / "profiles"
OUTPUT = DATA_DIR / "baucuquochoi-profiles.json"
DELEGATES_JSON = DATA_DIR / "baucuquochoi-delegates.json"


def clean(text: str) -> str:
    text = re.sub(r"<[^>]*>", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_span(html: str, label: str) -> str | None:
    pattern = rf"<span>{re.escape(label)}</span>\s*(.*?)\s*</div>"
    match = re.search(pattern, html, re.DOTALL)
    if match:
        return clean(match.group(1))
    return None


def extract_timeline(html: str) -> list[dict]:
    events = []
    for match in re.finditer(
        r'class="tl-event-time">(.*?)</div>\s*<div\s+class="tl-event-content">(.*?)</div>',
        html,
        re.DOTALL,
    ):
        events.append({
            "period": clean(match.group(1)),
            "description": clean(match.group(2)),
        })
    return events


def parse_profile(html: str, source_id: int) -> dict:
    record = {"source_id": source_id}

    # Find the profile info section (the one with full DOB, not the listing)
    # The profile section uses "Ngày sinh" while the listing uses "Năm sinh"
    profile_start = html.find("Ngày sinh:")
    if profile_start < 0:
        # Fallback: try the listing section
        profile_start = 0

    # Use the section from "Ngày sinh" onward for field extraction
    profile_section = html[max(0, profile_start - 500):]

    fields = {
        "name_vi": None,
        "dob": extract_span(profile_section, "Ngày sinh:"),
        "gender": extract_span(profile_section, "Giới tính:"),
        "ethnicity": extract_span(profile_section, "Dân tộc:"),
        "hometown_vi": extract_span(profile_section, "Quê quán:"),
        "party_date": extract_span(profile_section, "Ngày vào Đảng:"),
        "political_theory": extract_span(profile_section, "Trình độ lý luận chính trị:"),
        "qualifications_vi": extract_span(profile_section, "Trình độ chuyên môn:"),
        "position_vi": extract_span(profile_section, "Chức vụ:"),
        "constituency_vi": extract_span(profile_section, "Đơn vị ứng cử:"),
        "vote_percent_raw": extract_span(profile_section, "Tỷ lệ trúng cử:"),
    }

    # Extract name from title tag
    title_match = re.search(r"<title>(.*?)\s*\|", html)
    if title_match:
        fields["name_vi"] = clean(title_match.group(1))

    # Extract photo URL from the profile section
    img_match = re.search(r'class="avatar">\s*<img\s+src="([^"]*)"', profile_section, re.DOTALL)
    if img_match:
        fields["photo_url"] = img_match.group(1)

    # Parse vote percent to float
    if fields["vote_percent_raw"]:
        pct_match = re.search(r"([\d,]+)%", fields["vote_percent_raw"])
        if pct_match:
            fields["vote_percent"] = float(pct_match.group(1).replace(",", "."))

    # Career timeline
    fields["career_timeline"] = extract_timeline(html)

    record.update(fields)
    return record


def main():
    # Load the delegate listing to get source IDs
    with open(DELEGATES_JSON, encoding="utf-8") as f:
        delegates = json.load(f)

    id_to_name = {r["source_id"]: r["name_vi"] for r in delegates["records"]}

    profile_files = sorted(PROFILES_DIR.glob("*.html"))
    print(f"Parsing {len(profile_files)} profile files...")

    records = []
    errors = []

    for path in profile_files:
        source_id = int(path.stem)
        html = path.read_text(encoding="utf-8", errors="replace")

        try:
            record = parse_profile(html, source_id)
            records.append(record)
        except Exception as e:
            errors.append({"source_id": source_id, "error": str(e)})
            print(f"  ERROR parsing {path.name}: {e}")

    # Sort by name
    records.sort(key=lambda r: r.get("name_vi") or "")

    output = {
        "cycle_id": "na16-2026",
        "source": {
            "site": "baucuquochoi.vn",
            "profile_url_pattern": "https://baucuquochoi.vn/dai-bieu/quoc-hoi-khoa-XVI-{source_id}.html",
            "fetched_date": "2026-07-03",
        },
        "total": len(records),
        "errors": errors,
        "records": records,
    }

    OUTPUT.write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # Stats
    has_dob = sum(1 for r in records if r.get("dob"))
    has_ethnicity = sum(1 for r in records if r.get("ethnicity"))
    has_party = sum(1 for r in records if r.get("party_date"))
    has_timeline = sum(1 for r in records if r.get("career_timeline"))
    avg_timeline = sum(len(r.get("career_timeline", [])) for r in records) / max(len(records), 1)

    print(f"\nParsed {len(records)} profiles, {len(errors)} errors")
    print(f"  DOB: {has_dob}/{len(records)}")
    print(f"  Ethnicity: {has_ethnicity}/{len(records)}")
    print(f"  Party date: {has_party}/{len(records)}")
    print(f"  Career timeline: {has_timeline}/{len(records)} (avg {avg_timeline:.1f} entries)")
    print(f"Written to {OUTPUT}")


if __name__ == "__main__":
    main()
