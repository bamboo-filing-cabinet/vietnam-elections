# NA XVI official candidate list (by electoral unit)

The official list of all 864 candidates for the 16th National Assembly (2026),
grouped **by electoral unit** — promulgated as **Resolution 151/NQ-HĐBCQG**
(14 Feb 2026), "công bố danh sách chính thức những người ứng cử đại biểu Quốc
hội Khoá XVI theo từng đơn vị trong cả nước."

- **Source:** https://xaydungchinhsach.chinhphu.vn/chi-tiet-danh-sach-864-nguoi-ung-cu-dai-bieu-quoc-hoi-khoa-xvi-119260215122125389.htm
- **File:** [`danhsachbaucu-1771132497531465944794.pdf`](./danhsachbaucu-1771132497531465944794.pdf) (~16 MB)
- **Format:** scanned-image PDF — **not** machine-readable as text. Extracting names requires OCR (e.g. Tesseract) or manual inspection.

## Why this matters

This is the authoritative **electoral unit → candidates** source. It complements
the two other pieces:

- **Resolution 85** (`../congressional-units.md`) — unit → *territory* (which
  communes/wards), but lists **no** candidates.
- **daibieunhandan** archive (`vietnam-elections-archive/daibieunhandan/`) — a
  machine-readable unit ↔ candidate index, but with its **own** unit numbering
  that must be validated against this official list.

## Cross-check against daibieunhandan

Plan: compare this PDF's per-unit candidate rosters to
`vietnam-elections-archive/daibieunhandan/units-candidates.json`. Each agreement
(same province + unit number → same set of names) corroborates daibieunhandan's
`unit_number` as the official Resolution 151 number.

Confirmed by manual PDF inspection (2026-07-09):

| Unit | Candidates (incl.) | daibieunhandan |
|------|--------------------|----------------|
| Lào Cai, đơn vị số 1 | Sùng A Lềnh, Phạm Thị Thanh Trà, Lý Thu Trang, … | ✅ matches |
| Tuyên Quang, đơn vị số 2 | Ma Thị Thúy, Nguyễn Việt Hà, Bàn Văn Trọng, Hoàng Hồng Trường | ✅ matches |

With these agreements, daibieunhandan's `unit_number` is treated as the official
electoral-unit number (see the daibieunhandan README).
