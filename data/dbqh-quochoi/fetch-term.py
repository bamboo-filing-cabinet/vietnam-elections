#!/usr/bin/env python3
"""Fetch delegate profiles from dbqh.quochoi.vn for a given NA term.

Usage: python fetch-term.py XV
       python fetch-term.py I

Handles cookie gate (D1N) and session state (ASP.NET session per term).
Saves raw HTML to raw/{term}/profiles/ and the listing page.
"""
import concurrent.futures
import http.cookiejar
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(__file__).parent
BASE_URL = "https://dbqh.quochoi.vn"
WORKERS = 10


def get_opener():
    """Create a URL opener with cookie support."""
    cj = http.cookiejar.CookieJar()
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj)), cj


def fetch(opener, url):
    req = urllib.request.Request(url, headers={
        "User-Agent": "bamboo-filing-cabinet/vietnam-elections (research; https://github.com/bamboo-filing-cabinet/vietnam-elections)",
        "Accept": "text/html",
    })
    with opener.open(req, timeout=30) as resp:
        return resp.read()


def setup_session(opener, cj, term):
    """Get D1N cookie and set term session."""
    # Step 1: Get D1N cookie
    data = fetch(opener, BASE_URL + "/")
    d1n_match = re.search(r'D1N=([^"]+)"', data.decode("utf-8", errors="replace"))
    if not d1n_match:
        print("ERROR: Could not find D1N cookie value")
        sys.exit(1)
    d1n = d1n_match.group(1)
    print(f"D1N cookie: {d1n}")

    # Manually set the D1N cookie since JS can't run
    cookie = http.cookiejar.Cookie(
        version=0, name="D1N", value=d1n,
        port=None, port_specified=False,
        domain="dbqh.quochoi.vn", domain_specified=True, domain_initial_dot=False,
        path="/", path_specified=True,
        secure=False, expires=None, discard=True,
        comment=None, comment_url=None, rest={},
    )
    cj.set_cookie(cookie)

    # Step 2: Set term session
    print(f"Setting session to Khóa {term}...")
    listing_data = fetch(opener, f"{BASE_URL}/{term}/Daibieu.aspx")
    return listing_data


def extract_profile_urls(html):
    """Extract unique profile URLs (page type /1/) from the listing page."""
    urls = re.findall(r'/daibieu/\d+/\d+/1/[^"]+\.aspx', html)
    return sorted(set(urls))


def fetch_profile(opener, url, delegate_id, profiles_dir, index, total):
    """Fetch a single profile. Returns (delegate_id, success, message)."""
    full_url = BASE_URL + urllib.parse.quote(url, safe="/:@!$&'()*+,;=")
    try:
        data = fetch(opener, full_url)
        out_path = profiles_dir / f"{delegate_id}.html"
        out_path.write_bytes(data)
        now = datetime.now().strftime("%H:%M:%S")
        return (delegate_id, True, f"  {now} [{index}/{total}] {delegate_id} — {len(data)} bytes")
    except Exception as e:
        now = datetime.now().strftime("%H:%M:%S")
        return (delegate_id, False, f"  {now} [{index}/{total}] {delegate_id} — ERROR: {e}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python fetch-term.py <TERM>")
        print("  e.g., python fetch-term.py XV")
        sys.exit(1)

    term = sys.argv[1]
    raw_dir = DATA_DIR / "raw" / term
    profiles_dir = raw_dir / "profiles"
    profiles_dir.mkdir(parents=True, exist_ok=True)

    opener, cj = get_opener()
    listing_html_bytes = setup_session(opener, cj, term)
    listing_html = listing_html_bytes.decode("utf-8", errors="replace")

    # Save listing page
    listing_path = raw_dir / "listing.html"
    listing_path.write_bytes(listing_html_bytes)
    print(f"Saved listing page ({len(listing_html_bytes)} bytes)")

    # Extract profile URLs
    profile_urls = extract_profile_urls(listing_html)
    print(f"Found {len(profile_urls)} delegate profiles")
    print(f"Workers: {WORKERS}")

    # Filter already-fetched
    already = {f.stem for f in profiles_dir.glob("*.html")}
    to_fetch = []
    for i, url in enumerate(profile_urls):
        m = re.search(r'/daibieu/(\d+)/(\d+)/1/', url)
        if not m:
            continue
        delegate_id = m.group(2)
        if delegate_id not in already:
            to_fetch.append((i + 1, url, delegate_id))

    print(f"Already fetched: {len(already)}, to fetch: {len(to_fetch)}")

    hits = 0
    errors = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {
            pool.submit(fetch_profile, opener, url, did, profiles_dir, idx, len(profile_urls)): did
            for idx, url, did in to_fetch
        }
        for future in concurrent.futures.as_completed(futures):
            did, success, msg = future.result()
            print(msg, flush=True)
            if success:
                hits += 1
            else:
                errors += 1

    total = hits + len(already)
    print(f"\nDone. {hits} new profiles ({total} total), {errors} errors.")


if __name__ == "__main__":
    main()
