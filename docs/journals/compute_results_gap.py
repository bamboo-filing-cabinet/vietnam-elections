import json
from collections import defaultdict

results_path = 'public/data/elections/na15-2021/results.json'
constituencies_path = 'public/data/elections/na15-2021/constituencies.json'
localities_path = 'public/data/elections/na15-2021/localities.json'

with open(results_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

with open(constituencies_path, 'r', encoding='utf-8') as f:
    constituencies_data = json.load(f)

with open(localities_path, 'r', encoding='utf-8') as f:
    localities_data = json.load(f)

records = data['records']
constituencies = constituencies_data['records']
localities = localities_data['records']

constituency_by_id = {c['id']: c for c in constituencies}
locality_by_id = {l['id']: l for l in localities}

if not records:
    raise SystemExit('No records found in results.json')

# Inspect a record to identify available keys
sample = records[0]

# Normalize keys for grouping
# Expected keys include: constituency_id, locality, unit_number, seat_count, votes, candidate_name
# We'll defensively handle possible naming differences.

def get_key(rec, key, fallback=None):
    if key in rec:
        return rec[key]
    return fallback

by_key = defaultdict(list)
for r in records:
    constituency_id = get_key(r, 'constituency_id')
    unit_number = get_key(r, 'unit_number')
    locality_id = get_key(r, 'locality_id')
    constituency = constituency_by_id.get(constituency_id)
    seat_count = constituency['seat_count'] if constituency else None
    locality = locality_by_id.get(locality_id)
    locality_name = locality['name_vi'] if locality else None
    if constituency_id is None:
        # Fall back to composite key if needed
        constituency_id = f"{locality_name}-{unit_number}"
    by_key[(constituency_id, locality_name, unit_number, seat_count)].append(r)

results = []
for (const_id, locality, unit, seat_count), items in by_key.items():
    items_sorted = sorted(items, key=lambda x: x['votes'], reverse=True)
    winners = items_sorted[:seat_count]
    losers = items_sorted[seat_count:]
    if not losers:
        continue
    lowest_winner = winners[-1]
    highest_loser = losers[0]
    lowest_winner_name = get_key(lowest_winner, 'candidate_name_vi', get_key(lowest_winner, 'candidate_name', get_key(lowest_winner, 'name', get_key(lowest_winner, 'full_name'))))
    highest_loser_name = get_key(highest_loser, 'candidate_name_vi', get_key(highest_loser, 'candidate_name', get_key(highest_loser, 'name', get_key(highest_loser, 'full_name'))))
    gap = lowest_winner['votes'] - highest_loser['votes']
    results.append({
        'constituency_id': const_id,
        'locality_name': locality,
        'unit_number': unit,
        'seat_count': seat_count,
        'lowest_winner_name': lowest_winner_name,
        'lowest_winner_votes': lowest_winner['votes'],
        'highest_loser_name': highest_loser_name,
        'highest_loser_votes': highest_loser['votes'],
        'gap': gap,
    })

results_sorted_desc = sorted(results, key=lambda x: x['gap'], reverse=True)
results_sorted_asc = sorted(results, key=lambda x: x['gap'])

print('sample_record_keys', sorted(sample.keys()))
print('top_5_gaps')
for r in results_sorted_desc[:5]:
    print(r)
print('bottom_5_gaps')
for r in results_sorted_asc[:5]:
    print(r)
