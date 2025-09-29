-- Sample data for volleyball teams
-- This script adds 10-12 female athletes (born 2008-2010) and 4 officials for each team

-- First, let's get the team IDs for the tokens
WITH team_tokens AS (
  SELECT id, name, token FROM teams WHERE token IN ('HW8EOX8S', 'WXPOK06I', 'Z4OVDFQE', 'JX1LZY2Q', '7SGHWQ0C')
)

-- Insert sample athletes for all teams
INSERT INTO players (
  team_id, nama_lengkap, nama_jersey, no_jersey, position, gender,
  tempat_lahir, tanggal_lahir, tinggi, berat, nik, nisn, sekolah, kota_sekolah_asal, foto_atlet
) VALUES

-- Team HW8EOX8S Athletes
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Sari Dewi Putri', 'Sari', 1, 'Outside Hitter', 'putri', 'Jakarta', '2008-03-15', 162, 52, '3201234567890001', '1234567890', 'SMAN 1 Jakarta', 'Jakarta', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Rina Maharani', 'Rina', 2, 'Setter', 'putri', 'Bandung', '2009-05-20', 158, 48, '3201234567890002', '1234567891', 'SMAN 2 Bandung', 'Bandung', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Maya Sari Indah', 'Maya', 3, 'Middle Blocker', 'putri', 'Surabaya', '2008-08-10', 168, 55, '3201234567890003', '1234567892', 'SMAN 3 Surabaya', 'Surabaya', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Devi Kusuma Wati', 'Devi', 4, 'Libero', 'putri', 'Medan', '2010-01-25', 155, 45, '3201234567890004', '1234567893', 'SMAN 1 Medan', 'Medan', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Lina Permata Sari', 'Lina', 5, 'Outside Hitter', 'putri', 'Semarang', '2009-11-08', 161, 50, '3201234567890005', '1234567894', 'SMAN 5 Semarang', 'Semarang', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Eka Fitri Yani', 'Eka', 6, 'Opposite Hitter', 'putri', 'Yogyakarta', '2008-07-12', 165, 53, '3201234567890006', '1234567895', 'SMAN 2 Yogyakarta', 'Yogyakarta', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Nisa Ayu Lestari', 'Nisa', 7, 'Middle Blocker', 'putri', 'Malang', '2009-04-18', 167, 54, '3201234567890007', '1234567896', 'SMAN 1 Malang', 'Malang', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Putri Cantika Sari', 'Putri', 8, 'Defensive Specialist', 'putri', 'Palembang', '2010-09-03', 157, 47, '3201234567890008', '1234567897', 'SMAN 3 Palembang', 'Palembang', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Dewi Rahma Yanti', 'Dewi', 9, 'Outside Hitter', 'putri', 'Makassar', '2008-12-22', 163, 51, '3201234567890009', '1234567898', 'SMAN 4 Makassar', 'Makassar', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Sinta Bella Putri', 'Sinta', 10, 'Setter', 'putri', 'Denpasar', '2009-06-14', 159, 49, '3201234567890010', '1234567899', 'SMAN 1 Denpasar', 'Denpasar', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Ayu Kartika Dewi', 'Ayu', 11, 'Libero', 'putri', 'Balikpapan', '2010-02-28', 156, 46, '3201234567890011', '1234567900', 'SMAN 2 Balikpapan', 'Balikpapan', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Lia Permata Indah', 'Lia', 12, 'Middle Blocker', 'putri', 'Pontianak', '2008-10-05', 166, 52, '3201234567890012', '1234567901', 'SMAN 1 Pontianak', 'Pontianak', NULL),

-- Team WXPOK06I Athletes
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Rani Sukma Wati', 'Rani', 1, 'Outside Hitter', 'putri', 'Jakarta', '2008-04-16', 160, 50, '3201234567890013', '1234567902', 'SMAN 1 Jakarta', 'Jakarta', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Dina Cahaya Putri', 'Dina', 2, 'Setter', 'putri', 'Bandung', '2009-07-21', 157, 47, '3201234567890014', '1234567903', 'SMAN 2 Bandung', 'Bandung', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Tari Bunga Sari', 'Tari', 3, 'Middle Blocker', 'putri', 'Surabaya', '2008-09-11', 169, 56, '3201234567890015', '1234567904', 'SMAN 3 Surabaya', 'Surabaya', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Wulan Permata Dewi', 'Wulan', 4, 'Libero', 'putri', 'Medan', '2010-03-26', 154, 44, '3201234567890016', '1234567905', 'SMAN 1 Medan', 'Medan', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Kirana Ayu Sari', 'Kirana', 5, 'Outside Hitter', 'putri', 'Semarang', '2009-12-09', 162, 51, '3201234567890017', '1234567906', 'SMAN 5 Semarang', 'Semarang', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Melati Indah Putri', 'Melati', 6, 'Opposite Hitter', 'putri', 'Yogyakarta', '2008-08-13', 164, 53, '3201234567890018', '1234567907', 'SMAN 2 Yogyakarta', 'Yogyakarta', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Jasmine Sari Wati', 'Jasmine', 7, 'Middle Blocker', 'putri', 'Malang', '2009-05-19', 168, 55, '3201234567890019', '1234567908', 'SMAN 1 Malang', 'Malang', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Rosa Permata Dewi', 'Rosa', 8, 'Defensive Specialist', 'putri', 'Palembang', '2010-10-04', 158, 48, '3201234567890020', '1234567909', 'SMAN 3 Palembang', 'Palembang', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Anisa Bella Sari', 'Anisa', 9, 'Outside Hitter', 'putri', 'Makassar', '2008-01-23', 161, 50, '3201234567890021', '1234567910', 'SMAN 4 Makassar', 'Makassar', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Fadila Nur Putri', 'Fadila', 10, 'Setter', 'putri', 'Denpasar', '2009-07-15', 160, 49, '3201234567890022', '1234567911', 'SMAN 1 Denpasar', 'Denpasar', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Nabila Ayu Dewi', 'Nabila', 11, 'Libero', 'putri', 'Balikpapan', '2010-04-01', 155, 45, '3201234567890023', '1234567912', 'SMAN 2 Balikpapan', 'Balikpapan', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Safira Indah Sari', 'Safira', 12, 'Middle Blocker', 'putri', 'Pontianak', '2008-11-06', 167, 54, '3201234567890024', '1234567913', 'SMAN 1 Pontianak', 'Pontianak', NULL),

-- Team Z4OVDFQE Athletes
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Zahra Putri Sari', 'Zahra', 1, 'Outside Hitter', 'putri', 'Jakarta', '2008-05-17', 163, 52, '3201234567890025', '1234567914', 'SMAN 1 Jakarta', 'Jakarta', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Alya Bella Dewi', 'Alya', 2, 'Setter', 'putri', 'Bandung', '2009-08-22', 158, 48, '3201234567890026', '1234567915', 'SMAN 2 Bandung', 'Bandung', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Kiara Ayu Putri', 'Kiara', 3, 'Middle Blocker', 'putri', 'Surabaya', '2008-10-12', 170, 57, '3201234567890027', '1234567916', 'SMAN 3 Surabaya', 'Surabaya', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Layla Sari Dewi', 'Layla', 4, 'Libero', 'putri', 'Medan', '2010-04-27', 153, 43, '3201234567890028', '1234567917', 'SMAN 1 Medan', 'Medan', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Naira Putri Indah', 'Naira', 5, 'Outside Hitter', 'putri', 'Semarang', '2009-01-10', 164, 52, '3201234567890029', '1234567918', 'SMAN 5 Semarang', 'Semarang', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Olivia Sari Wati', 'Olivia', 6, 'Opposite Hitter', 'putri', 'Yogyakarta', '2008-09-14', 166, 54, '3201234567890030', '1234567919', 'SMAN 2 Yogyakarta', 'Yogyakarta', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Qaila Bella Putri', 'Qaila', 7, 'Middle Blocker', 'putri', 'Malang', '2009-06-20', 169, 56, '3201234567890031', '1234567920', 'SMAN 1 Malang', 'Malang', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Rania Ayu Sari', 'Rania', 8, 'Defensive Specialist', 'putri', 'Palembang', '2010-11-05', 159, 49, '3201234567890032', '1234567921', 'SMAN 3 Palembang', 'Palembang', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Salma Dewi Putri', 'Salma', 9, 'Outside Hitter', 'putri', 'Makassar', '2008-02-24', 162, 51, '3201234567890033', '1234567922', 'SMAN 4 Makassar', 'Makassar', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Tasya Indah Sari', 'Tasya', 10, 'Setter', 'putri', 'Denpasar', '2009-08-16', 161, 50, '3201234567890034', '1234567923', 'SMAN 1 Denpasar', 'Denpasar', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Vania Putri Dewi', 'Vania', 11, 'Libero', 'putri', 'Balikpapan', '2010-05-02', 156, 46, '3201234567890035', '1234567924', 'SMAN 2 Balikpapan', 'Balikpapan', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Winda Sari Ayu', 'Winda', 12, 'Middle Blocker', 'putri', 'Pontianak', '2008-12-07', 168, 55, '3201234567890036', '1234567925', 'SMAN 1 Pontianak', 'Pontianak', NULL),

-- Team JX1LZY2Q Athletes
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Yara Bella Putri', 'Yara', 1, 'Outside Hitter', 'putri', 'Jakarta', '2008-06-18', 165, 53, '3201234567890037', '1234567926', 'SMAN 1 Jakarta', 'Jakarta', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Zara Ayu Dewi', 'Zara', 2, 'Setter', 'putri', 'Bandung', '2009-09-23', 159, 49, '3201234567890038', '1234567927', 'SMAN 2 Bandung', 'Bandung', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Bella Sari Indah', 'Bella', 3, 'Middle Blocker', 'putri', 'Surabaya', '2008-11-13', 171, 58, '3201234567890039', '1234567928', 'SMAN 3 Surabaya', 'Surabaya', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Cinta Putri Wati', 'Cinta', 4, 'Libero', 'putri', 'Medan', '2010-05-28', 152, 42, '3201234567890040', '1234567929', 'SMAN 1 Medan', 'Medan', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Dara Indah Sari', 'Dara', 5, 'Outside Hitter', 'putri', 'Semarang', '2009-02-11', 163, 51, '3201234567890041', '1234567930', 'SMAN 5 Semarang', 'Semarang', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Elin Ayu Putri', 'Elin', 6, 'Opposite Hitter', 'putri', 'Yogyakarta', '2008-10-15', 167, 55, '3201234567890042', '1234567931', 'SMAN 2 Yogyakarta', 'Yogyakarta', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Fira Bella Dewi', 'Fira', 7, 'Middle Blocker', 'putri', 'Malang', '2009-07-21', 170, 57, '3201234567890043', '1234567932', 'SMAN 1 Malang', 'Malang', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Gina Sari Putri', 'Gina', 8, 'Defensive Specialist', 'putri', 'Palembang', '2010-12-06', 160, 50, '3201234567890044', '1234567933', 'SMAN 3 Palembang', 'Palembang', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Hana Dewi Ayu', 'Hana', 9, 'Outside Hitter', 'putri', 'Makassar', '2008-03-25', 164, 52, '3201234567890045', '1234567934', 'SMAN 4 Makassar', 'Makassar', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Ica Putri Bella', 'Ica', 10, 'Setter', 'putri', 'Denpasar', '2009-09-17', 162, 51, '3201234567890046', '1234567935', 'SMAN 1 Denpasar', 'Denpasar', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Jihan Indah Sari', 'Jihan', 11, 'Libero', 'putri', 'Balikpapan', '2010-06-03', 157, 47, '3201234567890047', '1234567936', 'SMAN 2 Balikpapan', 'Balikpapan', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Kyla Ayu Dewi', 'Kyla', 12, 'Middle Blocker', 'putri', 'Pontianak', '2008-01-08', 169, 56, '3201234567890048', '1234567937', 'SMAN 1 Pontianak', 'Pontianak', NULL),

-- Team 7SGHWQ0C Athletes
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Luna Bella Putri', 'Luna', 1, 'Outside Hitter', 'putri', 'Jakarta', '2008-07-19', 166, 54, '3201234567890049', '1234567938', 'SMAN 1 Jakarta', 'Jakarta', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Mira Sari Dewi', 'Mira', 2, 'Setter', 'putri', 'Bandung', '2009-10-24', 160, 50, '3201234567890050', '1234567939', 'SMAN 2 Bandung', 'Bandung', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Naya Indah Putri', 'Naya', 3, 'Middle Blocker', 'putri', 'Surabaya', '2008-12-14', 172, 59, '3201234567890051', '1234567940', 'SMAN 3 Surabaya', 'Surabaya', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Ona Ayu Sari', 'Ona', 4, 'Libero', 'putri', 'Medan', '2010-06-29', 151, 41, '3201234567890052', '1234567941', 'SMAN 1 Medan', 'Medan', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Pira Bella Dewi', 'Pira', 5, 'Outside Hitter', 'putri', 'Semarang', '2009-03-12', 165, 53, '3201234567890053', '1234567942', 'SMAN 5 Semarang', 'Semarang', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Qira Putri Indah', 'Qira', 6, 'Opposite Hitter', 'putri', 'Yogyakarta', '2008-11-16', 168, 56, '3201234567890054', '1234567943', 'SMAN 2 Yogyakarta', 'Yogyakarta', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Rina Sari Ayu', 'Rina', 7, 'Middle Blocker', 'putri', 'Malang', '2009-08-22', 171, 58, '3201234567890055', '1234567944', 'SMAN 1 Malang', 'Malang', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Sila Dewi Bella', 'Sila', 8, 'Defensive Specialist', 'putri', 'Palembang', '2010-01-07', 161, 51, '3201234567890056', '1234567945', 'SMAN 3 Palembang', 'Palembang', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Tina Indah Putri', 'Tina', 9, 'Outside Hitter', 'putri', 'Makassar', '2008-04-26', 166, 54, '3201234567890057', '1234567946', 'SMAN 4 Makassar', 'Makassar', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Ula Ayu Sari', 'Ula', 10, 'Setter', 'putri', 'Denpasar', '2009-10-18', 163, 52, '3201234567890058', '1234567947', 'SMAN 1 Denpasar', 'Denpasar', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Vera Bella Dewi', 'Vera', 11, 'Libero', 'putri', 'Balikpapan', '2010-07-04', 158, 48, '3201234567890059', '1234567948', 'SMAN 2 Balikpapan', 'Balikpapan', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Wira Putri Indah', 'Wira', 12, 'Middle Blocker', 'putri', 'Pontianak', '2008-02-09', 170, 57, '3201234567890060', '1234567949', 'SMAN 1 Pontianak', 'Pontianak', NULL);

-- Insert officials for all teams
INSERT INTO officials (team_id, nama_lengkap, posisi, nomor_telepon, foto_official) VALUES

-- Team HW8EOX8S Officials
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Budi Santoso', 'Manager', '081234567890', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Ahmad Rahman', 'Head Coach', '082234567890', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Siti Nurhaliza', 'Assistant Coach 1', '083234567890', NULL),
((SELECT id FROM teams WHERE token = 'HW8EOX8S'), 'Eko Prasetyo', 'Assistant Coach 2', '085234567890', NULL),

-- Team WXPOK06I Officials
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Indira Sari', 'Manager', '081234567891', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Joko Susilo', 'Head Coach', '082234567891', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Ratna Dewi', 'Assistant Coach 1', '083234567891', NULL),
((SELECT id FROM teams WHERE token = 'WXPOK06I'), 'Hendra Wijaya', 'Assistant Coach 2', '085234567891', NULL),

-- Team Z4OVDFQE Officials
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Agus Firmansyah', 'Manager', '081234567892', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Lilis Suryani', 'Head Coach', '082234567892', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Rudi Hermawan', 'Assistant Coach 1', '083234567892', NULL),
((SELECT id FROM teams WHERE token = 'Z4OVDFQE'), 'Maya Sari', 'Assistant Coach 2', '085234567892', NULL),

-- Team JX1LZY2Q Officials
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Bambang Setiawan', 'Manager', '081234567893', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Dewi Kartika', 'Head Coach', '082234567893', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Tri Handoko', 'Assistant Coach 1', '083234567893', NULL),
((SELECT id FROM teams WHERE token = 'JX1LZY2Q'), 'Nina Permata', 'Assistant Coach 2', '085234567893', NULL),

-- Team 7SGHWQ0C Officials
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Fajar Nugroho', 'Manager', '081234567894', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Rina Susanti', 'Head Coach', '082234567894', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Dedi Kurniawan', 'Assistant Coach 1', '083234567894', NULL),
((SELECT id FROM teams WHERE token = '7SGHWQ0C'), 'Sari Indah', 'Assistant Coach 2', '085234567894', NULL);

-- Show summary of inserted data
SELECT
  t.name as team_name,
  t.token,
  COUNT(p.id) as total_players,
  COUNT(o.id) as total_officials
FROM teams t
LEFT JOIN players p ON t.id = p.team_id
LEFT JOIN officials o ON t.id = o.team_id
WHERE t.token IN ('HW8EOX8S', 'WXPOK06I', 'Z4OVDFQE', 'JX1LZY2Q', '7SGHWQ0C')
GROUP BY t.id, t.name, t.token
ORDER BY t.name;