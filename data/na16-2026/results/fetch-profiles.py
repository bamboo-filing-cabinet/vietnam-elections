#!/usr/bin/env python3
"""Fetch individual delegate profile pages from baucuquochoi.vn.

Fetches each profile URL from the parsed delegate listing, saves raw HTML
to a profiles/ directory, and respects rate limits with a delay between
requests.

Source: https://baucuquochoi.vn/dai-bieu/quoc-hoi-khoa-XVI-{id}.html
"""
import json
import os
import time
import urllib.request
from pathlib import Path

DATA_DIR = Path(__file__).parent
PROFILES_DIR = DATA_DIR / "profiles"
DELEGATES_JSON = DATA_DIR / "baucuquochoi-delegates.json"
BASE_URL = "https://baucuquochoi.vn"
DELAY_SECONDS = 1.0


def fetch_profile(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "bamboo-filing-cabinet/vietnam-elections (research; https://github.com/bamboo-filing-cabinet/vietnam-elections)",
            "Accept": "text/html",
            "Accept-Encoding": "gzip, deflate",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        if resp.headers.get("Content-Encoding") == "gzip":
            import gzip
            data = gzip.decompress(data)
        return data


def main():
    PROFILES_DIR.mkdir(exist_ok=True)

    with open(DELEGATES_JSON, encoding="utf-8") as f:
        delegates = json.load(f)

    records = delegates["records"]
    total = len(records)
    print(f"Fetching {total} delegate profiles...")

    for i, record in enumerate(records):
        source_id = record["source_id"]
        profile_url = record["profile_url"]
        name = record["name_vi"]
        out_path = PROFILES_DIR / f"{source_id}.html"

        if out_path.exists():
            print(f"  [{i+1}/{total}] {name} — already fetched, skipping")
            continue

        url = BASE_URL + profile_url
        print(f"  [{i+1}/{total}] {name} — {url}")

        try:
            html = fetch_profile(url)
            out_path.write_bytes(html)
        except Exception as e:
            print(f"    ERROR: {e}")
            continue

        if i < total - 1:
            time.sleep(DELAY_SECONDS)

    fetched = sum(1 for f in PROFILES_DIR.iterdir() if f.suffix == ".html")
    print(f"\nDone. {fetched}/{total} profiles saved to {PROFILES_DIR}")


if __name__ == "__main__":
    main()
