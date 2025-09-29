import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
import { db } from '../src/lib/db/connection';
import { teams, players, officials } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

// Sample data for female athletes born 2008-2010
const athleteNames = [
  'Sari Dewi Putri', 'Rina Maharani', 'Maya Sari Indah', 'Devi Kusuma Wati',
  'Lina Permata Sari', 'Eka Fitri Yani', 'Nisa Ayu Lestari', 'Putri Cantika Sari',
  'Dewi Rahma Yanti', 'Sinta Bella Putri', 'Ayu Kartika Dewi', 'Lia Permata Indah',
  'Rani Sukma Wati', 'Dina Cahaya Putri', 'Tari Bunga Sari', 'Wulan Permata Dewi',
  'Kirana Ayu Sari', 'Melati Indah Putri', 'Jasmine Sari Wati', 'Rosa Permata Dewi'
];

const schoolNames = [
  'SMAN 1 Jakarta', 'SMAN 2 Bandung', 'SMAN 3 Surabaya', 'SMAN 1 Medan',
  'SMAN 5 Semarang', 'SMAN 2 Yogyakarta', 'SMAN 1 Malang', 'SMAN 3 Palembang',
  'SMAN 4 Makassar', 'SMAN 1 Denpasar', 'SMAN 2 Balikpapan', 'SMAN 1 Pontianak'
];

const cities = [
  'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang',
  'Yogyakarta', 'Malang', 'Palembang', 'Makassar', 'Denpasar'
];

const birthPlaces = [
  'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Yogyakarta',
  'Solo', 'Malang', 'Bekasi', 'Tangerang', 'Depok', 'Bogor'
];

const positions = ['Outside Hitter', 'Middle Blocker', 'Setter', 'Libero', 'Opposite Hitter', 'Defensive Specialist'];

const officialNames = [
  'Budi Santoso', 'Ahmad Rahman', 'Siti Nurhaliza', 'Eko Prasetyo',
  'Indira Sari', 'Joko Susilo', 'Ratna Dewi', 'Hendra Wijaya'
];

// Function to generate random birth date between 2008-2010
function getRandomBirthDate(): Date {
  const years = [2008, 2009, 2010];
  const year = years[Math.floor(Math.random() * years.length)];
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month - 1, day);
}

// Function to generate random NIK
function generateNIK(): string {
  return Math.floor(Math.random() * 9000000000000000 + 1000000000000000).toString();
}

// Function to generate random NISN
function generateNISN(): string {
  return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
}

async function addSampleData() {
  try {
    console.log('Starting to add sample data...');

    // Get team IDs for the specified tokens
    const teamTokens = ['HW8EOX8S', 'WXPOK06I', 'Z4OVDFQE', 'JX1LZY2Q', '7SGHWQ0C'];

    for (const token of teamTokens) {
      // Get team data
      const teamResult = await db
        .select()
        .from(teams)
        .where(eq(teams.token, token))
        .limit(1);

      if (teamResult.length === 0) {
        console.log(`Team with token ${token} not found, skipping...`);
        continue;
      }

      const team = teamResult[0];
      console.log(`Adding data for team: ${team.name} (${token})`);

      // Add 12 female athletes per team
      const athletesToAdd = [];
      for (let i = 0; i < 12; i++) {
        const birthDate = getRandomBirthDate();
        athletesToAdd.push({
          teamId: team.id,
          namaLengkap: athleteNames[Math.floor(Math.random() * athleteNames.length)],
          namaJersey: athleteNames[Math.floor(Math.random() * athleteNames.length)].split(' ')[0],
          noJersey: i + 1,
          position: positions[Math.floor(Math.random() * positions.length)] as any,
          gender: 'putri' as const,
          tempatLahir: birthPlaces[Math.floor(Math.random() * birthPlaces.length)],
          tanggalLahir: birthDate,
          tinggi: Math.floor(Math.random() * 20) + 155, // 155-175 cm
          berat: Math.floor(Math.random() * 15) + 45,   // 45-60 kg
          nik: generateNIK(),
          nisn: generateNISN(),
          sekolah: schoolNames[Math.floor(Math.random() * schoolNames.length)],
          kotaSekolahAsal: cities[Math.floor(Math.random() * cities.length)],
          fotoAtlet: null,
        });
      }

      // Insert athletes
      await db.insert(players).values(athletesToAdd);
      console.log(`Added ${athletesToAdd.length} athletes for team ${team.name}`);

      // Add 4 officials per team
      const officialsToAdd = [
        {
          teamId: team.id,
          namaLengkap: officialNames[Math.floor(Math.random() * officialNames.length)],
          posisi: 'Manager' as const,
          nomorTelepon: `081${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          fotoOfficial: null,
        },
        {
          teamId: team.id,
          namaLengkap: officialNames[Math.floor(Math.random() * officialNames.length)],
          posisi: 'Head Coach' as const,
          nomorTelepon: `082${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          fotoOfficial: null,
        },
        {
          teamId: team.id,
          namaLengkap: officialNames[Math.floor(Math.random() * officialNames.length)],
          posisi: 'Assistant Coach 1' as const,
          nomorTelepon: `083${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          fotoOfficial: null,
        },
        {
          teamId: team.id,
          namaLengkap: officialNames[Math.floor(Math.random() * officialNames.length)],
          posisi: 'Assistant Coach 2' as const,
          nomorTelepon: `085${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          fotoOfficial: null,
        },
      ];

      // Insert officials
      await db.insert(officials).values(officialsToAdd);
      console.log(`Added ${officialsToAdd.length} officials for team ${team.name}`);
    }

    console.log('✅ Sample data added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

// Run the script
addSampleData().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});