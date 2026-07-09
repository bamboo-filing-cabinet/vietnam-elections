# 15th National Assembly of Vietnam

1. [15th National Assembly of Vietnam](https://en.wikipedia.org/wiki/15th_National_Assembly_of_Vietnam)
2. [2021 Vietnamese legislative election](https://en.wikipedia.org/wiki/2021_Vietnamese_legislative_election)
    1. One seat in Bình Dương Province was left vacant after the National Election Council did not confirm the winning candidate was eligible to enter parliament.
2. File [candidates-list-vietnamese.pdf](./candidates-list/candidates-list-vietnamese.pdf) is taken from [https://www.hcmcpv.org.vn/](https://images.hcmcpv.org.vn/Uploads/File/280420219523F244/Danhsachbaucu-PYFO.pdf) (fetched: 2026-01-02)
3. File [congressional-units.pdf](./congressional-units.pdf) is taken from [https://quochoi.vn/](https://images.hcmcpv.org.vn/Uploads/File/280420219523F244/Danhsachbaucu-PYFO.pdf) (fetched: 2026-01-02)
4. The numbered docx files in [candidates-list/](./candidates-list/) were taken from [https://baochinhphu.vn](https://baochinhphu.vn/danh-sach-868-nguoi-ung-cu-dbqh-khoa-xv-102291334.htm) (fetched: 2026-01-02):
5. Results bulletin (CEMA): [cong-bo-danh-sach-499-nguoi-trung-cu-dai-bieu-quoc-hoi-khoa-xv.htm](https://web.archive.org/web/20250221194402/http://www.cema.gov.vn/bau-cu-QH-HDND/cong-bo-danh-sach-499-nguoi-trung-cu-dai-bieu-quoc-hoi-khoa-xv.htm) (fetched: 2026-01-09)

## Data Pipeline
- Build the staging database: `python3 data/na15-2021/build-staging-db.py` (creates `data/staging.db`)
- Run QA checks: `python3 data/na15-2021/qa-checks.py`
- Export JSON for the site: `python3 data/na15-2021/export-json.py` (writes to `public/data/elections/na15-2021/`)
Note: these scripts require PyYAML (`pip install pyyaml`).

## Dataset metadata
- `data/na15-2021/dataset.yml` is the authoritative source for per-document terms status and metadata.

## Outputs
- SQLite staging DB: `data/staging.db`
- JSON exports for static site:
  - `public/data/elections/na15-2021/candidates_index.json`
  - `public/data/elections/na15-2021/candidates_detail/*.json`
  - `public/data/elections/na15-2021/localities.json`
  - `public/data/elections/na15-2021/constituencies.json`
  - `public/data/elections/na15-2021/documents.json`
  - `public/data/elections/na15-2021/timeline.json`
  - `public/data/elections/na15-2021/results.json`
  - `public/data/elections/na15-2021/changelog.json`

Notes:
- `results.json` exports `statuses` per candidate result, derived from annotations. No single `status` is exported.

## Candidate CSV Notes
- Files: `data/na15-2021/candidates-list/*.csv` (extracted from official DOCX/PDF sources).
- Key columns used in staging: `province_or_city`, `unit_number`, `STT`, `Họ và tên`, `Ngày tháng năm sinh`, `Giới tính`, `Quốc tịch`, `Dân tộc`, `Tôn giáo`, `Quê quán`, `Nơi ở hiện nay`, `Nghề nghiệp, chức vụ`, `Nơi công tác`, and education-related fields.
- Party membership + delegate flags: `Ngày vào Đảng`, `Là đại biểu QH`, `Là đại biểu HĐND`.

## CSV -> JSON Mapping (Current)
- `Họ và tên` -> `person.full_name`
- `Ngày tháng năm sinh` -> `person.dob`
- `Giới tính` -> `person.gender`
- `Quốc tịch` -> `person.nationality`
- `Dân tộc` -> `person.ethnicity`
- `Tôn giáo` -> `person.religion`
- `Quê quán` -> `person.birthplace`
- `Nơi ở hiện nay` -> `person.current_residence`
- `STT` -> `entry.list_order`
- `Ngày vào Đảng` -> `entry.party_member_since`
- `Là đại biểu QH` -> `entry.is_na_delegate`
- `Là đại biểu HĐND` -> `entry.is_council_delegate`
- `Trình độ học vấn - Giáo dục phổ thông` -> `attributes.education_general`
- `Trình độ học vấn - Chuyên môn, nghiệp vụ` -> `attributes.education_professional`
- `Trình độ học vấn - Học hàm, học vị` -> `attributes.education_academic_rank`
- `Trình độ học vấn - Lý luận chính trị` -> `attributes.education_political`
- `Trình độ học vấn - Ngoại ngữ` -> `attributes.education_languages`
- `Nghề nghiệp, chức vụ` -> `attributes.occupation_title`
- `Nơi công tác` -> `attributes.workplace`

## Known Gaps / TBD
- Sources table and per-field citations are not populated yet for candidate attributes.
- Change logs are not populated yet; per-entry `changelog` is empty until diffs are generated.

## Note
- This election was done with the administrative map prior to [2025 Vietnamese administrative reforms](https://en.wikipedia.org/wiki/2025_Vietnamese_administrative_reforms)
- Pre-2025, districts are part of congressional units, which are under province/city
