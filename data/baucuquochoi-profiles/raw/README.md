# All Delegate Profiles

Raw HTML profile pages fetched from `baucuquochoi.vn` by scanning IDs 1–11,100.

- **Source URL pattern:** `https://baucuquochoi.vn/dai-bieu/quoc-hoi-khoa-XVI-{id}.html`
- **Fetched:** 2026-07-07
- **Script:** `../fetch-all-profiles.py`

The site serves profiles from **multiple NA terms** (not just Khóa XVI) under the same URL pattern. Each page's `<link rel="canonical">` tag indicates the actual term (e.g., `quoc-hoi-khoa-XIV-5.html` for a Khóa XIV delegate).

Files are named `{source_id}.html`. Empty responses (no profile data) are not saved.
