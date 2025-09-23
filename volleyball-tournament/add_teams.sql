-- Cari tournament BEA PRO 17
SELECT id, name, category FROM tournaments WHERE name ILIKE '%BEA PRO 17%';

-- Jika tidak ada, tampilkan semua tournament
SELECT id, name, category, status FROM tournaments ORDER BY created_at DESC;