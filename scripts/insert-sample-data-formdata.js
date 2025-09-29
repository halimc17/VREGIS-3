// Script to insert sample data using API endpoints with FormData
const BASE_URL = 'http://localhost:3001';

// Sample data
const teamTokens = ['HW8EOX8S', 'WXPOK06I', 'Z4OVDFQE', 'JX1LZY2Q', '7SGHWQ0C'];

const athleteData = [
  // Team HW8EOX8S
  {
    token: 'HW8EOX8S',
    athletes: [
      { namaLengkap: 'Sari Dewi Putri', namaJersey: 'Sari', noJersey: 1, position: 'Outside Hitter', tempatLahir: 'Jakarta', tanggalLahir: '2008-03-15', tinggi: 162, berat: 52, nik: '3201234567890001', nisn: '1234567890', sekolah: 'SMAN 1 Jakarta', kotaSekolahAsal: 'Jakarta' },
      { namaLengkap: 'Rina Maharani', namaJersey: 'Rina', noJersey: 2, position: 'Setter', tempatLahir: 'Bandung', tanggalLahir: '2009-05-20', tinggi: 158, berat: 48, nik: '3201234567890002', nisn: '1234567891', sekolah: 'SMAN 2 Bandung', kotaSekolahAsal: 'Bandung' },
      { namaLengkap: 'Maya Sari Indah', namaJersey: 'Maya', noJersey: 3, position: 'Middle Blocker', tempatLahir: 'Surabaya', tanggalLahir: '2008-08-10', tinggi: 168, berat: 55, nik: '3201234567890003', nisn: '1234567892', sekolah: 'SMAN 3 Surabaya', kotaSekolahAsal: 'Surabaya' },
      { namaLengkap: 'Devi Kusuma Wati', namaJersey: 'Devi', noJersey: 4, position: 'Libero', tempatLahir: 'Medan', tanggalLahir: '2010-01-25', tinggi: 155, berat: 45, nik: '3201234567890004', nisn: '1234567893', sekolah: 'SMAN 1 Medan', kotaSekolahAsal: 'Medan' },
      { namaLengkap: 'Lina Permata Sari', namaJersey: 'Lina', noJersey: 5, position: 'Outside Hitter', tempatLahir: 'Semarang', tanggalLahir: '2009-11-08', tinggi: 161, berat: 50, nik: '3201234567890005', nisn: '1234567894', sekolah: 'SMAN 5 Semarang', kotaSekolahAsal: 'Semarang' },
      { namaLengkap: 'Eka Fitri Yani', namaJersey: 'Eka', noJersey: 6, position: 'Opposite Hitter', tempatLahir: 'Yogyakarta', tanggalLahir: '2008-07-12', tinggi: 165, berat: 53, nik: '3201234567890006', nisn: '1234567895', sekolah: 'SMAN 2 Yogyakarta', kotaSekolahAsal: 'Yogyakarta' },
      { namaLengkap: 'Nisa Ayu Lestari', namaJersey: 'Nisa', noJersey: 7, position: 'Middle Blocker', tempatLahir: 'Malang', tanggalLahir: '2009-04-18', tinggi: 167, berat: 54, nik: '3201234567890007', nisn: '1234567896', sekolah: 'SMAN 1 Malang', kotaSekolahAsal: 'Malang' },
      { namaLengkap: 'Putri Cantika Sari', namaJersey: 'Putri', noJersey: 8, position: 'Defensive Specialist', tempatLahir: 'Palembang', tanggalLahir: '2010-09-03', tinggi: 157, berat: 47, nik: '3201234567890008', nisn: '1234567897', sekolah: 'SMAN 3 Palembang', kotaSekolahAsal: 'Palembang' },
      { namaLengkap: 'Dewi Rahma Yanti', namaJersey: 'Dewi', noJersey: 9, position: 'Outside Hitter', tempatLahir: 'Makassar', tanggalLahir: '2008-12-22', tinggi: 163, berat: 51, nik: '3201234567890009', nisn: '1234567898', sekolah: 'SMAN 4 Makassar', kotaSekolahAsal: 'Makassar' },
      { namaLengkap: 'Sinta Bella Putri', namaJersey: 'Sinta', noJersey: 10, position: 'Setter', tempatLahir: 'Denpasar', tanggalLahir: '2009-06-14', tinggi: 159, berat: 49, nik: '3201234567890010', nisn: '1234567899', sekolah: 'SMAN 1 Denpasar', kotaSekolahAsal: 'Denpasar' },
      { namaLengkap: 'Ayu Kartika Dewi', namaJersey: 'Ayu', noJersey: 11, position: 'Libero', tempatLahir: 'Balikpapan', tanggalLahir: '2010-02-28', tinggi: 156, berat: 46, nik: '3201234567890011', nisn: '1234567900', sekolah: 'SMAN 2 Balikpapan', kotaSekolahAsal: 'Balikpapan' },
      { namaLengkap: 'Lia Permata Indah', namaJersey: 'Lia', noJersey: 12, position: 'Middle Blocker', tempatLahir: 'Pontianak', tanggalLahir: '2008-10-05', tinggi: 166, berat: 52, nik: '3201234567890012', nisn: '1234567901', sekolah: 'SMAN 1 Pontianak', kotaSekolahAsal: 'Pontianak' }
    ],
    officials: [
      { namaLengkap: 'Budi Santoso', posisi: 'Manager', nomorTelepon: '081234567890' },
      { namaLengkap: 'Ahmad Rahman', posisi: 'Head Coach', nomorTelepon: '082234567890' },
      { namaLengkap: 'Siti Nurhaliza', posisi: 'Assistant Coach 1', nomorTelepon: '083234567890' },
      { namaLengkap: 'Eko Prasetyo', posisi: 'Assistant Coach 2', nomorTelepon: '085234567890' }
    ]
  },
  // Team WXPOK06I
  {
    token: 'WXPOK06I',
    athletes: [
      { namaLengkap: 'Rani Sukma Wati', namaJersey: 'Rani', noJersey: 1, position: 'Outside Hitter', tempatLahir: 'Jakarta', tanggalLahir: '2008-04-16', tinggi: 160, berat: 50, nik: '3201234567890013', nisn: '1234567902', sekolah: 'SMAN 1 Jakarta', kotaSekolahAsal: 'Jakarta' },
      { namaLengkap: 'Dina Cahaya Putri', namaJersey: 'Dina', noJersey: 2, position: 'Setter', tempatLahir: 'Bandung', tanggalLahir: '2009-07-21', tinggi: 157, berat: 47, nik: '3201234567890014', nisn: '1234567903', sekolah: 'SMAN 2 Bandung', kotaSekolahAsal: 'Bandung' },
      { namaLengkap: 'Tari Bunga Sari', namaJersey: 'Tari', noJersey: 3, position: 'Middle Blocker', tempatLahir: 'Surabaya', tanggalLahir: '2008-09-11', tinggi: 169, berat: 56, nik: '3201234567890015', nisn: '1234567904', sekolah: 'SMAN 3 Surabaya', kotaSekolahAsal: 'Surabaya' },
      { namaLengkap: 'Wulan Permata Dewi', namaJersey: 'Wulan', noJersey: 4, position: 'Libero', tempatLahir: 'Medan', tanggalLahir: '2010-03-26', tinggi: 154, berat: 44, nik: '3201234567890016', nisn: '1234567905', sekolah: 'SMAN 1 Medan', kotaSekolahAsal: 'Medan' },
      { namaLengkap: 'Kirana Ayu Sari', namaJersey: 'Kirana', noJersey: 5, position: 'Outside Hitter', tempatLahir: 'Semarang', tanggalLahir: '2009-12-09', tinggi: 162, berat: 51, nik: '3201234567890017', nisn: '1234567906', sekolah: 'SMAN 5 Semarang', kotaSekolahAsal: 'Semarang' },
      { namaLengkap: 'Melati Indah Putri', namaJersey: 'Melati', noJersey: 6, position: 'Opposite Hitter', tempatLahir: 'Yogyakarta', tanggalLahir: '2008-08-13', tinggi: 164, berat: 53, nik: '3201234567890018', nisn: '1234567907', sekolah: 'SMAN 2 Yogyakarta', kotaSekolahAsal: 'Yogyakarta' },
      { namaLengkap: 'Jasmine Sari Wati', namaJersey: 'Jasmine', noJersey: 7, position: 'Middle Blocker', tempatLahir: 'Malang', tanggalLahir: '2009-05-19', tinggi: 168, berat: 55, nik: '3201234567890019', nisn: '1234567908', sekolah: 'SMAN 1 Malang', kotaSekolahAsal: 'Malang' },
      { namaLengkap: 'Rosa Permata Dewi', namaJersey: 'Rosa', noJersey: 8, position: 'Defensive Specialist', tempatLahir: 'Palembang', tanggalLahir: '2010-10-04', tinggi: 158, berat: 48, nik: '3201234567890020', nisn: '1234567909', sekolah: 'SMAN 3 Palembang', kotaSekolahAsal: 'Palembang' },
      { namaLengkap: 'Anisa Bella Sari', namaJersey: 'Anisa', noJersey: 9, position: 'Outside Hitter', tempatLahir: 'Makassar', tanggalLahir: '2008-01-23', tinggi: 161, berat: 50, nik: '3201234567890021', nisn: '1234567910', sekolah: 'SMAN 4 Makassar', kotaSekolahAsal: 'Makassar' },
      { namaLengkap: 'Fadila Nur Putri', namaJersey: 'Fadila', noJersey: 10, position: 'Setter', tempatLahir: 'Denpasar', tanggalLahir: '2009-07-15', tinggi: 160, berat: 49, nik: '3201234567890022', nisn: '1234567911', sekolah: 'SMAN 1 Denpasar', kotaSekolahAsal: 'Denpasar' },
      { namaLengkap: 'Nabila Ayu Dewi', namaJersey: 'Nabila', noJersey: 11, position: 'Libero', tempatLahir: 'Balikpapan', tanggalLahir: '2010-04-01', tinggi: 155, berat: 45, nik: '3201234567890023', nisn: '1234567912', sekolah: 'SMAN 2 Balikpapan', kotaSekolahAsal: 'Balikpapan' },
      { namaLengkap: 'Safira Indah Sari', namaJersey: 'Safira', noJersey: 12, position: 'Middle Blocker', tempatLahir: 'Pontianak', tanggalLahir: '2008-11-06', tinggi: 167, berat: 54, nik: '3201234567890024', nisn: '1234567913', sekolah: 'SMAN 1 Pontianak', kotaSekolahAsal: 'Pontianak' }
    ],
    officials: [
      { namaLengkap: 'Indira Sari', posisi: 'Manager', nomorTelepon: '081234567891' },
      { namaLengkap: 'Joko Susilo', posisi: 'Head Coach', nomorTelepon: '082234567891' },
      { namaLengkap: 'Ratna Dewi', posisi: 'Assistant Coach 1', nomorTelepon: '083234567891' },
      { namaLengkap: 'Hendra Wijaya', posisi: 'Assistant Coach 2', nomorTelepon: '085234567891' }
    ]
  },
  // Team Z4OVDFQE
  {
    token: 'Z4OVDFQE',
    athletes: [
      { namaLengkap: 'Citra Dewi Sari', namaJersey: 'Citra', noJersey: 1, position: 'Outside Hitter', tempatLahir: 'Jakarta', tanggalLahir: '2008-05-17', tinggi: 161, berat: 51, nik: '3201234567890025', nisn: '1234567914', sekolah: 'SMAN 1 Jakarta', kotaSekolahAsal: 'Jakarta' },
      { namaLengkap: 'Vania Putri Indah', namaJersey: 'Vania', noJersey: 2, position: 'Setter', tempatLahir: 'Bandung', tanggalLahir: '2009-08-22', tinggi: 158, berat: 48, nik: '3201234567890026', nisn: '1234567915', sekolah: 'SMAN 2 Bandung', kotaSekolahAsal: 'Bandung' },
      { namaLengkap: 'Luna Sari Dewi', namaJersey: 'Luna', noJersey: 3, position: 'Middle Blocker', tempatLahir: 'Surabaya', tanggalLahir: '2008-10-12', tinggi: 170, berat: 57, nik: '3201234567890027', nisn: '1234567916', sekolah: 'SMAN 3 Surabaya', kotaSekolahAsal: 'Surabaya' },
      { namaLengkap: 'Zahra Permata Wati', namaJersey: 'Zahra', noJersey: 4, position: 'Libero', tempatLahir: 'Medan', tanggalLahir: '2010-04-27', tinggi: 153, berat: 43, nik: '3201234567890028', nisn: '1234567917', sekolah: 'SMAN 1 Medan', kotaSekolahAsal: 'Medan' },
      { namaLengkap: 'Bella Ayu Lestari', namaJersey: 'Bella', noJersey: 5, position: 'Outside Hitter', tempatLahir: 'Semarang', tanggalLahir: '2009-01-10', tinggi: 163, berat: 52, nik: '3201234567890029', nisn: '1234567918', sekolah: 'SMAN 5 Semarang', kotaSekolahAsal: 'Semarang' },
      { namaLengkap: 'Celine Indah Putri', namaJersey: 'Celine', noJersey: 6, position: 'Opposite Hitter', tempatLahir: 'Yogyakarta', tanggalLahir: '2008-09-14', tinggi: 166, berat: 54, nik: '3201234567890030', nisn: '1234567919', sekolah: 'SMAN 2 Yogyakarta', kotaSekolahAsal: 'Yogyakarta' },
      { namaLengkap: 'Diana Sari Wati', namaJersey: 'Diana', noJersey: 7, position: 'Middle Blocker', tempatLahir: 'Malang', tanggalLahir: '2009-06-20', tinggi: 169, berat: 56, nik: '3201234567890031', nisn: '1234567920', sekolah: 'SMAN 1 Malang', kotaSekolahAsal: 'Malang' },
      { namaLengkap: 'Elena Permata Dewi', namaJersey: 'Elena', noJersey: 8, position: 'Defensive Specialist', tempatLahir: 'Palembang', tanggalLahir: '2010-11-05', tinggi: 159, berat: 49, nik: '3201234567890032', nisn: '1234567921', sekolah: 'SMAN 3 Palembang', kotaSekolahAsal: 'Palembang' },
      { namaLengkap: 'Fiona Bella Sari', namaJersey: 'Fiona', noJersey: 9, position: 'Outside Hitter', tempatLahir: 'Makassar', tanggalLahir: '2008-02-24', tinggi: 162, berat: 51, nik: '3201234567890033', nisn: '1234567922', sekolah: 'SMAN 4 Makassar', kotaSekolahAsal: 'Makassar' },
      { namaLengkap: 'Gita Nur Putri', namaJersey: 'Gita', noJersey: 10, position: 'Setter', tempatLahir: 'Denpasar', tanggalLahir: '2009-08-16', tinggi: 161, berat: 50, nik: '3201234567890034', nisn: '1234567923', sekolah: 'SMAN 1 Denpasar', kotaSekolahAsal: 'Denpasar' },
      { namaLengkap: 'Hana Ayu Dewi', namaJersey: 'Hana', noJersey: 11, position: 'Libero', tempatLahir: 'Balikpapan', tanggalLahir: '2010-05-02', tinggi: 156, berat: 46, nik: '3201234567890035', nisn: '1234567924', sekolah: 'SMAN 2 Balikpapan', kotaSekolahAsal: 'Balikpapan' },
      { namaLengkap: 'Ira Indah Sari', namaJersey: 'Ira', noJersey: 12, position: 'Middle Blocker', tempatLahir: 'Pontianak', tanggalLahir: '2008-12-07', tinggi: 168, berat: 55, nik: '3201234567890036', nisn: '1234567925', sekolah: 'SMAN 1 Pontianak', kotaSekolahAsal: 'Pontianak' }
    ],
    officials: [
      { namaLengkap: 'Cahyo Pranoto', posisi: 'Manager', nomorTelepon: '081234567892' },
      { namaLengkap: 'Dedi Kurniawan', posisi: 'Head Coach', nomorTelepon: '082234567892' },
      { namaLengkap: 'Evi Susanti', posisi: 'Assistant Coach 1', nomorTelepon: '083234567892' },
      { namaLengkap: 'Fandi Setiawan', posisi: 'Assistant Coach 2', nomorTelepon: '085234567892' }
    ]
  },
  // Team JX1LZY2Q
  {
    token: 'JX1LZY2Q',
    athletes: [
      { namaLengkap: 'Jihan Dewi Sari', namaJersey: 'Jihan', noJersey: 1, position: 'Outside Hitter', tempatLahir: 'Jakarta', tanggalLahir: '2008-06-18', tinggi: 162, berat: 52, nik: '3201234567890037', nisn: '1234567926', sekolah: 'SMAN 1 Jakarta', kotaSekolahAsal: 'Jakarta' },
      { namaLengkap: 'Kania Putri Indah', namaJersey: 'Kania', noJersey: 2, position: 'Setter', tempatLahir: 'Bandung', tanggalLahir: '2009-09-23', tinggi: 159, berat: 49, nik: '3201234567890038', nisn: '1234567927', sekolah: 'SMAN 2 Bandung', kotaSekolahAsal: 'Bandung' },
      { namaLengkap: 'Laila Sari Dewi', namaJersey: 'Laila', noJersey: 3, position: 'Middle Blocker', tempatLahir: 'Surabaya', tanggalLahir: '2008-11-13', tinggi: 171, berat: 58, nik: '3201234567890039', nisn: '1234567928', sekolah: 'SMAN 3 Surabaya', kotaSekolahAsal: 'Surabaya' },
      { namaLengkap: 'Mira Permata Wati', namaJersey: 'Mira', noJersey: 4, position: 'Libero', tempatLahir: 'Medan', tanggalLahir: '2010-05-28', tinggi: 154, berat: 44, nik: '3201234567890040', nisn: '1234567929', sekolah: 'SMAN 1 Medan', kotaSekolahAsal: 'Medan' },
      { namaLengkap: 'Nina Ayu Lestari', namaJersey: 'Nina', noJersey: 5, position: 'Outside Hitter', tempatLahir: 'Semarang', tanggalLahir: '2009-02-11', tinggi: 164, berat: 53, nik: '3201234567890041', nisn: '1234567930', sekolah: 'SMAN 5 Semarang', kotaSekolahAsal: 'Semarang' },
      { namaLengkap: 'Olla Indah Putri', namaJersey: 'Olla', noJersey: 6, position: 'Opposite Hitter', tempatLahir: 'Yogyakarta', tanggalLahir: '2008-10-15', tinggi: 167, berat: 55, nik: '3201234567890042', nisn: '1234567931', sekolah: 'SMAN 2 Yogyakarta', kotaSekolahAsal: 'Yogyakarta' },
      { namaLengkap: 'Putri Sari Wati', namaJersey: 'Putri', noJersey: 7, position: 'Middle Blocker', tempatLahir: 'Malang', tanggalLahir: '2009-07-21', tinggi: 170, berat: 57, nik: '3201234567890043', nisn: '1234567932', sekolah: 'SMAN 1 Malang', kotaSekolahAsal: 'Malang' },
      { namaLengkap: 'Qila Permata Dewi', namaJersey: 'Qila', noJersey: 8, position: 'Defensive Specialist', tempatLahir: 'Palembang', tanggalLahir: '2010-12-06', tinggi: 160, berat: 50, nik: '3201234567890044', nisn: '1234567933', sekolah: 'SMAN 3 Palembang', kotaSekolahAsal: 'Palembang' },
      { namaLengkap: 'Rara Bella Sari', namaJersey: 'Rara', noJersey: 9, position: 'Outside Hitter', tempatLahir: 'Makassar', tanggalLahir: '2008-03-25', tinggi: 163, berat: 52, nik: '3201234567890045', nisn: '1234567934', sekolah: 'SMAN 4 Makassar', kotaSekolahAsal: 'Makassar' },
      { namaLengkap: 'Sari Nur Putri', namaJersey: 'Sari', noJersey: 10, position: 'Setter', tempatLahir: 'Denpasar', tanggalLahir: '2009-09-17', tinggi: 162, berat: 51, nik: '3201234567890046', nisn: '1234567935', sekolah: 'SMAN 1 Denpasar', kotaSekolahAsal: 'Denpasar' },
      { namaLengkap: 'Tara Ayu Dewi', namaJersey: 'Tara', noJersey: 11, position: 'Libero', tempatLahir: 'Balikpapan', tanggalLahir: '2010-06-03', tinggi: 157, berat: 47, nik: '3201234567890047', nisn: '1234567936', sekolah: 'SMAN 2 Balikpapan', kotaSekolahAsal: 'Balikpapan' },
      { namaLengkap: 'Una Indah Sari', namaJersey: 'Una', noJersey: 12, position: 'Middle Blocker', tempatLahir: 'Pontianak', tanggalLahir: '2008-01-08', tinggi: 169, berat: 56, nik: '3201234567890048', nisn: '1234567937', sekolah: 'SMAN 1 Pontianak', kotaSekolahAsal: 'Pontianak' }
    ],
    officials: [
      { namaLengkap: 'Gani Saputra', posisi: 'Manager', nomorTelepon: '081234567893' },
      { namaLengkap: 'Hadi Nugroho', posisi: 'Head Coach', nomorTelepon: '082234567893' },
      { namaLengkap: 'Ika Purnama', posisi: 'Assistant Coach 1', nomorTelepon: '083234567893' },
      { namaLengkap: 'Joko Prabowo', posisi: 'Assistant Coach 2', nomorTelepon: '085234567893' }
    ]
  },
  // Team 7SGHWQ0C
  {
    token: '7SGHWQ0C',
    athletes: [
      { namaLengkap: 'Vera Dewi Sari', namaJersey: 'Vera', noJersey: 1, position: 'Outside Hitter', tempatLahir: 'Jakarta', tanggalLahir: '2008-07-19', tinggi: 163, berat: 53, nik: '3201234567890049', nisn: '1234567938', sekolah: 'SMAN 1 Jakarta', kotaSekolahAsal: 'Jakarta' },
      { namaLengkap: 'Wina Putri Indah', namaJersey: 'Wina', noJersey: 2, position: 'Setter', tempatLahir: 'Bandung', tanggalLahir: '2009-10-24', tinggi: 160, berat: 50, nik: '3201234567890050', nisn: '1234567939', sekolah: 'SMAN 2 Bandung', kotaSekolahAsal: 'Bandung' },
      { namaLengkap: 'Xena Sari Dewi', namaJersey: 'Xena', noJersey: 3, position: 'Middle Blocker', tempatLahir: 'Surabaya', tanggalLahir: '2008-12-14', tinggi: 172, berat: 59, nik: '3201234567890051', nisn: '1234567940', sekolah: 'SMAN 3 Surabaya', kotaSekolahAsal: 'Surabaya' },
      { namaLengkap: 'Yuni Permata Wati', namaJersey: 'Yuni', noJersey: 4, position: 'Libero', tempatLahir: 'Medan', tanggalLahir: '2010-06-29', tinggi: 155, berat: 45, nik: '3201234567890052', nisn: '1234567941', sekolah: 'SMAN 1 Medan', kotaSekolahAsal: 'Medan' },
      { namaLengkap: 'Zara Ayu Lestari', namaJersey: 'Zara', noJersey: 5, position: 'Outside Hitter', tempatLahir: 'Semarang', tanggalLahir: '2009-03-12', tinggi: 165, berat: 54, nik: '3201234567890053', nisn: '1234567942', sekolah: 'SMAN 5 Semarang', kotaSekolahAsal: 'Semarang' },
      { namaLengkap: 'Adel Indah Putri', namaJersey: 'Adel', noJersey: 6, position: 'Opposite Hitter', tempatLahir: 'Yogyakarta', tanggalLahir: '2008-11-16', tinggi: 168, berat: 56, nik: '3201234567890054', nisn: '1234567943', sekolah: 'SMAN 2 Yogyakarta', kotaSekolahAsal: 'Yogyakarta' },
      { namaLengkap: 'Bina Sari Wati', namaJersey: 'Bina', noJersey: 7, position: 'Middle Blocker', tempatLahir: 'Malang', tanggalLahir: '2009-08-22', tinggi: 171, berat: 58, nik: '3201234567890055', nisn: '1234567944', sekolah: 'SMAN 1 Malang', kotaSekolahAsal: 'Malang' },
      { namaLengkap: 'Cika Permata Dewi', namaJersey: 'Cika', noJersey: 8, position: 'Defensive Specialist', tempatLahir: 'Palembang', tanggalLahir: '2010-01-07', tinggi: 161, berat: 51, nik: '3201234567890056', nisn: '1234567945', sekolah: 'SMAN 3 Palembang', kotaSekolahAsal: 'Palembang' },
      { namaLengkap: 'Dara Bella Sari', namaJersey: 'Dara', noJersey: 9, position: 'Outside Hitter', tempatLahir: 'Makassar', tanggalLahir: '2008-04-26', tinggi: 164, berat: 53, nik: '3201234567890057', nisn: '1234567946', sekolah: 'SMAN 4 Makassar', kotaSekolahAsal: 'Makassar' },
      { namaLengkap: 'Era Nur Putri', namaJersey: 'Era', noJersey: 10, position: 'Setter', tempatLahir: 'Denpasar', tanggalLahir: '2009-10-18', tinggi: 163, berat: 52, nik: '3201234567890058', nisn: '1234567947', sekolah: 'SMAN 1 Denpasar', kotaSekolahAsal: 'Denpasar' },
      { namaLengkap: 'Fara Ayu Dewi', namaJersey: 'Fara', noJersey: 11, position: 'Libero', tempatLahir: 'Balikpapan', tanggalLahir: '2010-07-04', tinggi: 158, berat: 48, nik: '3201234567890059', nisn: '1234567948', sekolah: 'SMAN 2 Balikpapan', kotaSekolahAsal: 'Balikpapan' },
      { namaLengkap: 'Gina Indah Sari', namaJersey: 'Gina', noJersey: 12, position: 'Middle Blocker', tempatLahir: 'Pontianak', tanggalLahir: '2008-02-09', tinggi: 170, berat: 57, nik: '3201234567890060', nisn: '1234567949', sekolah: 'SMAN 1 Pontianak', kotaSekolahAsal: 'Pontianak' }
    ],
    officials: [
      { namaLengkap: 'Kris Mahendra', posisi: 'Manager', nomorTelepon: '081234567894' },
      { namaLengkap: 'Lukman Hakim', posisi: 'Head Coach', nomorTelepon: '082234567894' },
      { namaLengkap: 'Maya Sartika', posisi: 'Assistant Coach 1', nomorTelepon: '083234567894' },
      { namaLengkap: 'Nova Pratama', posisi: 'Assistant Coach 2', nomorTelepon: '085234567894' }
    ]
  }
];

async function insertAthletes(token, athletes) {
  console.log(`Inserting ${athletes.length} athletes for team ${token}...`);

  for (const athlete of athletes) {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('namaLengkap', athlete.namaLengkap);
      formData.append('namaJersey', athlete.namaJersey);
      formData.append('noJersey', athlete.noJersey.toString());
      formData.append('position', athlete.position);
      formData.append('gender', 'putri');
      formData.append('tempatLahir', athlete.tempatLahir);
      formData.append('tanggalLahir', athlete.tanggalLahir);
      formData.append('tinggi', athlete.tinggi.toString());
      formData.append('berat', athlete.berat.toString());
      formData.append('nik', athlete.nik);
      formData.append('nisn', athlete.nisn);
      formData.append('sekolah', athlete.sekolah);
      formData.append('kotaSekolahAsal', athlete.kotaSekolahAsal);

      const response = await fetch(`${BASE_URL}/api/public/teams/${token}/players`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to add athlete ${athlete.namaLengkap}:`, errorText);
      } else {
        const result = await response.json();
        console.log(`✓ Added athlete: ${athlete.namaLengkap}`);
      }

      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error adding athlete ${athlete.namaLengkap}:`, error.message);
    }
  }
}

async function insertOfficials(token, officials) {
  console.log(`Inserting ${officials.length} officials for team ${token}...`);

  for (const official of officials) {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('namaLengkap', official.namaLengkap);
      formData.append('posisi', official.posisi);
      formData.append('nomorTelepon', official.nomorTelepon);

      const response = await fetch(`${BASE_URL}/api/public/teams/${token}/officials`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to add official ${official.namaLengkap}:`, errorText);
      } else {
        const result = await response.json();
        console.log(`✓ Added official: ${official.namaLengkap}`);
      }

      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error adding official ${official.namaLengkap}:`, error.message);
    }
  }
}

async function insertAllData() {
  console.log('Starting data insertion...');

  for (const teamData of athleteData) {
    console.log(`\n=== Processing team ${teamData.token} ===`);

    // Insert athletes
    await insertAthletes(teamData.token, teamData.athletes);

    // Insert officials
    await insertOfficials(teamData.token, teamData.officials);

    console.log(`Completed team ${teamData.token}`);

    // Longer delay between teams
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✅ All data insertion completed!');
}

// Run the script
insertAllData().catch(console.error);