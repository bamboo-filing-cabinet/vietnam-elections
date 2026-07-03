#!/usr/bin/env python3
"""Parse baucuquochoi.vn delegate HTML into structured JSON.

Source: https://api.daihoidang.vn/api/congress-party-detail.html?partyId=189
Fetched: 2026-07-03
"""
import json
import re
import sys
from pathlib import Path

INPUT = Path(__file__).parent / "baucuquochoi-delegates-raw.html"
OUTPUT = Path(__file__).parent / "baucuquochoi-delegates.json"


def extract_span_value(html: str, label: str) -> str | None:
    pattern = rf"<span>{re.escape(label)}</span>\s*(.*?)\s*</div>"
    match = re.search(pattern, html, re.DOTALL)
    if match:
        value = match.group(1).strip()
        value = re.sub(r"\s+", " ", value)
        return value
    return None


def extract_vote_percent(html: str) -> float | None:
    match = re.search(r"Đạt\s+([\d,]+)%\s*số phiếu", html)
    if match:
        return float(match.group(1).replace(",", "."))
    return None


def extract_vote_percent_raw(html: str) -> str | None:
    match = re.search(r"Đạt\s+([\d,]+%)\s*số phiếu", html)
    if match:
        return match.group(1)
    return None


def extract_img_url(html: str) -> str | None:
    match = re.search(r'<img\s+src="([^"]*)"', html)
    if match:
        return match.group(1)
    return None


def parse_entry(html: str) -> dict:
    record = {}

    # Profile link and ID
    href_match = re.search(r'href="([^"]*)"', html)
    if href_match:
        record["profile_url"] = href_match.group(1)
        id_match = re.search(r"-(\d+)\.html", href_match.group(1))
        if id_match:
            record["source_id"] = int(id_match.group(1))

    # Name from title attribute
    title_match = re.search(r'title="([^"]*)"', html)
    if title_match:
        record["name_vi"] = title_match.group(1)

    # Data attributes
    for attr in [
        "filter-name", "filter-city", "filter-town", "filter-age",
        "filter-sex", "filter-degree", "candidate-unit",
        "filter-discipline", "party-member",
    ]:
        match = re.search(rf'data-{attr}="([^"]*)"', html)
        if match:
            key = attr.replace("-", "_").replace("filter_", "")
            record[key] = match.group(1)

    # Visible fields
    record["birth_year"] = extract_span_value(html, "Năm sinh:")
    record["hometown_vi"] = extract_span_value(html, "Quê quán:")
    record["qualifications_vi"] = extract_span_value(html, "Trình độ chuyên môn:")
    record["position_vi"] = extract_span_value(html, "Chức vụ:")
    record["constituency_vi"] = extract_span_value(html, "Đơn vị ứng cử:")
    record["vote_percent"] = extract_vote_percent(html)
    record["vote_percent_raw"] = extract_vote_percent_raw(html)
    record["photo_url"] = extract_img_url(html)

    return record


def main():
    html = INPUT.read_text(encoding="utf-8")

    # Extract all item-member entries (DOTALL for multiline HTML)
    entries = re.findall(r'<a\s+class="item-member"[^>]*>.*?</a>', html, re.DOTALL)
    print(f"Total entries found: {len(entries)}")

    # Deduplicate: leadership entries (no data-filter-name) appear again
    # in the alphabetical list (with data-filter-name). Keep the richer version.
    seen_ids = set()
    records = []

    # First pass: entries with data attributes (alphabetical list)
    for entry in entries:
        if "data-filter-name" not in entry:
            continue
        record = parse_entry(entry)
        source_id = record.get("source_id")
        if source_id and source_id not in seen_ids:
            seen_ids.add(source_id)
            records.append(record)

    # Second pass: leadership entries without data attributes (only if not seen)
    for entry in entries:
        if "data-filter-name" in entry:
            continue
        record = parse_entry(entry)
        source_id = record.get("source_id")
        if source_id and source_id not in seen_ids:
            seen_ids.add(source_id)
            records.append(record)

    print(f"Unique delegates: {len(records)}")

    output = {
        "cycle_id": "na16-2026",
        "source": {
            "url": "https://api.daihoidang.vn/api/congress-party-detail.html?partyId=189",
            "site": "baucuquochoi.vn",
            "fetched_date": "2026-07-03",
        },
        "total": len(records),
        "records": sorted(records, key=lambda r: r.get("name_vi", "")),
    }

    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Written to {OUTPUT}")


if __name__ == "__main__":
    main()
