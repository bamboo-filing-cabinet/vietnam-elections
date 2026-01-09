#!/usr/bin/env python3
"""Pulls and summarizes results sources for NA15-2021."""

from __future__ import annotations

import datetime as dt
import html as html_lib
import json
import re
from pathlib import Path
from typing import Iterable
from urllib.request import Request, urlopen

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0 Safari/537.36"
)

VTV_URL = (
    "https://web.archive.org/web/20210621105212/"
    "https://vtv.vn/chinh-tri/khong-xac-nhan-tu-cach-dai-bieu-quoc-hoi-voi-"
    "bi-thu-tinh-uy-binh-duong-20210610192156321.htm"
)

CEMA_URL = (
    "https://web.archive.org/web/20250221194402/"
    "http://www.cema.gov.vn/bau-cu-QH-HDND/cong-bo-danh-sach-499-nguoi-"
    "trung-cu-dai-bieu-quoc-hoi-khoa-xv.htm"
)

OUT_DIR = Path(__file__).resolve().parent


def fetch_html(url: str) -> str:
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req) as resp:
        return resp.read().decode("utf-8", errors="replace")


def strip_tags(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_lib.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def dedupe_keep_order(items: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        result.append(item)
    return result


def extract_meta(html: str, name: str) -> str | None:
    pattern = (
        rf"property=[\"']{re.escape(name)}[\"'][^>]*"
        rf"content=[\"'](.*?)[\"']"
    )
    match = re.search(pattern, html, re.IGNORECASE)
    if match:
        return html_lib.unescape(match.group(1)).strip()
    return None


def extract_meta_name(html: str, name: str) -> str | None:
    pattern = rf"name=[\"']{re.escape(name)}[\"'][^>]*content=[\"'](.*?)[\"']"
    match = re.search(pattern, html, re.IGNORECASE)
    if match:
        return html_lib.unescape(match.group(1)).strip()
    return None


def extract_title(html: str) -> str | None:
    for tag in ("h1", "h2"):
        match = re.search(rf"<{tag}[^>]*>(.*?)</{tag}>", html, re.S | re.I)
        if match:
            title = strip_tags(match.group(1))
            if title:
                return title
    title_match = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
    if title_match:
        return strip_tags(title_match.group(1))
    return None


def extract_first_date(text: str) -> str | None:
    match = re.search(r"(\d{1,2}/\d{1,2}/\d{4})", text)
    return match.group(1) if match else None


def extract_vtv() -> dict:
    html = fetch_html(VTV_URL)
    title = extract_meta(html, "og:title") or extract_title(html)
    description = extract_meta(html, "og:description") or extract_meta_name(
        html, "description"
    )
    published_time = extract_meta(html, "article:published_time")

    block_match = re.search(
        r"<div[^>]+class=[\"']detail_left[^\"']*[\"'][^>]*>(.*?)"
        r"<div[^>]+class=[\"']detail_comment",
        html,
        re.S | re.I,
    )
    paragraphs: list[str] = []
    if block_match:
        paragraph_html = re.findall(r"<p[^>]*>(.*?)</p>", block_match.group(1), re.S | re.I)
        paragraphs = [strip_tags(p) for p in paragraph_html]
        paragraphs = [p for p in paragraphs if p]

    keywords = (
        "Trần Văn Nam",
        "không xác nhận",
        "Hội đồng Bầu cử",
        "tư cách",
        "Bình Dương",
        "499",
        "500",
    )
    key_points = [p for p in paragraphs if any(k in p for k in keywords)]
    key_points = dedupe_keep_order(key_points)

    author_line = None
    author_match = re.search(r"<p[^>]+class=[\"']author[\"'][^>]*>(.*?)</p>", html, re.S | re.I)
    if author_match:
        author_line = strip_tags(author_match.group(1))

    return {
        "id": "vtv_report_tran_van_nam_ineligible",
        "title": title,
        "url": VTV_URL,
        "published_time": published_time,
        "author_line": author_line,
        "description": description,
        "key_points": key_points,
    }


def extract_cema() -> dict:
    html = fetch_html(CEMA_URL)
    title = extract_title(html)
    text = strip_tags(html)
    published_date = extract_first_date(text)

    paragraphs_html = re.findall(r"<p[^>]*>(.*?)</p>", html, re.S | re.I)
    paragraphs = [strip_tags(p) for p in paragraphs_html]
    paragraphs = [p for p in paragraphs if p]

    # Focus on the results section and overall stats.
    header_index = None
    for i, p in enumerate(paragraphs):
        if "KẾT QUẢ BẦU CỬ ĐẠI BIỂU QUỐC HỘI" in p:
            header_index = i
            break
        if "KẾT QUẢ BẦU CỬ CHUNG" in p:
            header_index = i
            break

    results_section: list[str] = []
    if header_index is not None:
        section = paragraphs[header_index : header_index + 30]
        results_section = [
            p
            for p in section
            if p.startswith("-")
            or "Tổng số" in p
            or "trúng cử" in p
            or "Không xác nhận" in p
        ]

    summary_lines = [
        p
        for p in paragraphs
        if "Hội đồng Bầu cử" in p and "trúng cử" in p
    ]
    summary_lines = dedupe_keep_order(summary_lines)

    return {
        "id": "cema_bulletin_499_winners",
        "title": title,
        "url": CEMA_URL,
        "published_date": published_date,
        "paragraphs": paragraphs,
        "summary_lines": summary_lines,
        "results_section": results_section,
    }


def parse_cema_district_results(paragraphs: list[str]) -> dict:
    header_index = None
    for i, line in enumerate(paragraphs):
        if "II." in line and "KẾT QUẢ" in line and "TỈNH" in line:
            header_index = i
            break

    records = []
    current_province = None
    current_unit_number = None
    current_unit_description = None
    skipped = []

    if header_index is None:
        return {
            "records": records,
            "skipped": ["Missing II. section header"],
        }

    for line in paragraphs[header_index + 1 :]:
        if re.match(r"^[IVXL]+\\.\\s", line):
            break

        province_match = re.match(r"^(\d+)\s*-\s*(.+)$", line)
        if province_match:
            current_province = province_match.group(2).strip()
            current_unit_number = None
            current_unit_description = None
            continue

        unit_match = re.match(
            r"^Đơn vị bầu cử\s*Số\s*(\d+)\s*:\s*(.*)$",
            line,
            re.IGNORECASE,
        )
        if unit_match:
            current_unit_number = int(unit_match.group(1))
            current_unit_description = unit_match.group(2).strip()
            continue

        if line.startswith("Số phiếu bầu cho mỗi người ứng cử"):
            continue

        candidate_match = re.match(r"^(\d+)\)\s+(.*)$", line)
        if candidate_match and current_province and current_unit_number is not None:
            order = int(candidate_match.group(1))
            remainder = candidate_match.group(2).strip()
            name = remainder
            votes = None
            percent = None
            votes_raw = None
            percent_raw = None

            name_match = re.match(r"^(.*?)\s+được\s+([\d\.]+)\s+phiếu", remainder, re.I)
            if name_match:
                name = name_match.group(1).strip()
                votes_raw = name_match.group(2)
                votes = int(votes_raw.replace(".", "")) if votes_raw else None

            percent_match = re.search(r"tỷ\s+lệ\s+([\d,]+)%", remainder, re.I)
            if percent_match:
                percent_raw = percent_match.group(1)
                try:
                    percent = float(percent_raw.replace(",", "."))
                except ValueError:
                    percent = None

            records.append(
                {
                    "province": current_province,
                    "unit_number": current_unit_number,
                    "unit_description": current_unit_description,
                    "order": order,
                    "candidate_name": name,
                    "votes": votes,
                    "votes_raw": votes_raw,
                    "percent": percent,
                    "percent_raw": percent_raw,
                }
            )
            continue

        if candidate_match and not current_province:
            skipped.append(line)
            continue

    return {
        "records": records,
        "skipped": skipped,
    }


def main() -> None:
    extracted_at = dt.datetime.now(dt.timezone.utc).isoformat()
    cema = extract_cema()
    paragraphs = cema.pop("paragraphs", [])
    district_results = parse_cema_district_results(paragraphs)

    data = {
        "cycle_id": "na15-2021",
        "extracted_at": extracted_at,
        "sources": [cema, extract_vtv()],
        "district_results_summary": {
            "record_count": len(district_results["records"]),
            "skipped_count": len(district_results["skipped"]),
        },
        "notes": "Parsed from Wayback snapshots; paragraphs extracted from HTML <p> tags.",
    }

    out_json = OUT_DIR / "research.json"
    out_md = OUT_DIR / "research.md"
    out_results_json = OUT_DIR / "cema-district-results.json"
    out_results_csv = OUT_DIR / "cema-district-results.csv"

    out_json.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    out_results_json.write_text(
        json.dumps(
            {
                "cycle_id": "na15-2021",
                "source_id": cema["id"],
                "source_url": cema["url"],
                "extracted_at": extracted_at,
                "records": district_results["records"],
                "skipped": district_results["skipped"],
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    import csv

    with out_results_csv.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "province",
                "unit_number",
                "unit_description",
                "order",
                "candidate_name",
                "votes",
                "votes_raw",
                "percent",
                "percent_raw",
            ],
        )
        writer.writeheader()
        writer.writerows(district_results["records"])

    lines = [
        "# Results research (NA15-2021)",
        "",
        f"Extracted at: {extracted_at}",
        "",
    ]
    for source in data["sources"]:
        lines.append(f"## {source.get('title') or source['id']}")
        lines.append(f"URL: {source['url']}")
        if source.get("published_time"):
            lines.append(f"Published time: {source['published_time']}")
        if source.get("published_date"):
            lines.append(f"Published date (page text): {source['published_date']}")
        if source.get("author_line"):
            lines.append(f"Author line: {source['author_line']}")
        if source.get("description"):
            lines.append(f"Description: {source['description']}")
        if source.get("summary_lines"):
            lines.append("Summary lines:")
            for item in source["summary_lines"]:
                lines.append(f"- {item}")
        if source.get("key_points"):
            lines.append("Key points:")
            for item in source["key_points"]:
                lines.append(f"- {item}")
        if source.get("results_section"):
            lines.append("Results section:")
            for item in source["results_section"]:
                lines.append(f"- {item}")
        lines.append("")

    lines.append("## CEMA district results (parsed)")
    lines.append(f"Records: {len(district_results['records'])}")
    lines.append(f"Skipped lines: {len(district_results['skipped'])}")
    lines.append(f"JSON: {out_results_json.name}")
    lines.append(f"CSV: {out_results_csv.name}")
    lines.append("")

    out_md.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
