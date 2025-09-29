// Script to insert sample data using API endpoints
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
  }
  // Continue with other teams...
];

async function insertAthletes(token, athletes) {
  console.log(`Inserting ${athletes.length} athletes for team ${token}...`);

  for (const athlete of athletes) {
    try {
      const response = await fetch(`${BASE_URL}/api/public/teams/${token}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...athlete,
          gender: 'putri'
        }),
      });

      if (!response.ok) {
        console.error(`Failed to add athlete ${athlete.namaLengkap}:`, await response.text());
      } else {
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
      const response = await fetch(`${BASE_URL}/api/public/teams/${token}/officials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(official),
      });

      if (!response.ok) {
        console.error(`Failed to add official ${official.namaLengkap}:`, await response.text());
      } else {
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