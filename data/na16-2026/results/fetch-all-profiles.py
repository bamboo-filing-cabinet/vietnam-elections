#!/usr/bin/env python3
"""Scan all profile IDs on baucuquochoi.vn and fetch non-empty pages.

Brute-forces IDs through max_id using concurrent requests.
Saves any non-empty response. Skips already-fetched IDs.
"""
import concurrent.futures
import urllib.request
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(__file__).parent
ALL_PROFILES_DIR = DATA_DIR / "all-profiles"
START_ID = 11100
MAX_ID = 15000
WORKERS = 10


def fetch(source_id: int) -> tuple[int, bytes | None]:
    url = f"https://baucuquochoi.vn/dai-bieu/quoc-hoi-khoa-XVI-{source_id}.html"
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "bamboo-filing-cabinet/vietnam-elections (research; https://github.com/bamboo-filing-cabinet/vietnam-elections)",
                "Accept": "text/html",
                "Referer": "https://baucuquochoi.vn/",
                "Accept-Encoding": "gzip, deflate",
            },
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            if resp.headers.get("Content-Encoding") == "gzip":
                import gzip
                data = gzip.decompress(data)
            return (source_id, data if len(data) > 100 else None)
    except Exception as e:
        now = datetime.now().strftime("%H:%M:%S")
        print(f"  {now} [{source_id}/{MAX_ID}] ERROR: {e}", flush=True)
        return (source_id, None)


def main():
    ALL_PROFILES_DIR.mkdir(exist_ok=True)

    already = {int(f.stem) for f in ALL_PROFILES_DIR.glob("*.html")}
    ids_to_fetch = [i for i in range(START_ID, MAX_ID + 1) if i not in already]

    print(f"Already fetched: {len(already)}")
    print(f"To fetch: {len(ids_to_fetch)} (IDs {START_ID}–{MAX_ID})")
    print(f"Workers: {WORKERS}")

    hits = 0
    empty = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(fetch, sid): sid for sid in ids_to_fetch}
        for future in concurrent.futures.as_completed(futures):
            source_id, data = future.result()
            now = datetime.now().strftime("%H:%M:%S")
            if data:
                out_path = ALL_PROFILES_DIR / f"{source_id}.html"
                out_path.write_bytes(data)
                hits += 1
                print(f"  {now} [{source_id}/{MAX_ID}] HIT ({len(data)} bytes) — {hits} total hits", flush=True)
            else:
                empty += 1
                if empty % 100 == 0:
                    print(f"  {now} [{source_id}/{MAX_ID}] ... {empty} empty so far", flush=True)

    total = hits + len(already)
    print(f"\nDone. {hits} new hits ({total} total), {empty} empty in scan range.")


if __name__ == "__main__":
    main()
