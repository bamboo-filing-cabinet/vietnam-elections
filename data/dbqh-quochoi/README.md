# dbqh.quochoi.vn Data

Delegate profiles from the official National Assembly delegate database at https://dbqh.quochoi.vn/.

## Coverage

All 15 NA terms (Khóa I–XV, 1946–2026), ~7,000 delegate profiles total.

## Raw data

`raw/{TERM}/listing.html` — full delegate listing page per term.
`raw/{TERM}/profiles/{id}.html` — individual profile pages (gitignored).

Profile HTML is fetched via `fetch-term.py`. The site requires cookie/session management:
1. A `D1N` cookie from the Cloudrity WAF
2. An ASP.NET session cookie set by visiting `/{TERM}/Daibieu.aspx`

## ID formats

- Khóa I–VIII, XI: zero-padded 10-digit IDs (e.g., `0000000002`)
- Khóa XII–XV: short numeric IDs (e.g., `2238`)
- Khóa IX, X: mixed (transition period)

## See also

- [Site structure investigation](../../docs/journals/2026-07-07.01.dbqh-quochoi-vn-site-structure.md)
- Issue #37 — Archive dbqh.quochoi.vn
