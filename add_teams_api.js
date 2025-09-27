const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3002/api';

const teams = [
  'Qubic', 'Kencana Jaya', 'Tunas', 'Gracia', 'Urban',
  'Gajah Mungkur', 'Karuci', 'SKY', 'Comet', 'Bharata Muda',
  'Pervina', 'JVC', 'VIKING'
];

async function addTeams() {
  try {
    // First get tournaments to find BEA PRO 17
    console.log('Fetching tournaments...');
    const tournamentsResponse = await fetch(`${API_BASE}/tournaments/public`);
    const tournamentsData = await tournamentsResponse.json();

    if (!tournamentsData.success) {
      console.error('Failed to fetch tournaments:', tournamentsData.error);
      return;
    }

    console.log('Available tournaments:');
    tournamentsData.tournaments.forEach(t => {
      console.log(`- ${t.name} (${t.category}) [${t.status}] - ID: ${t.id}`);
    });

    // Find BEA PRO 17 tournament
    const beaProTournament = tournamentsData.tournaments.find(t =>
      t.name.toLowerCase().includes('bea pro 17')
    );

    if (!beaProTournament) {
      console.log('\nBEA PRO 17 tournament not found. Using first available tournament...');
      if (tournamentsData.tournaments.length === 0) {
        console.log('No tournaments available.');
        return;
      }

      const firstTournament = tournamentsData.tournaments[0];
      console.log(`Using: ${firstTournament.name}`);
      await addTeamsToTournament(firstTournament.id, firstTournament.name);
      return;
    }

    console.log(`\nFound BEA PRO 17: ${beaProTournament.name} - ID: ${beaProTournament.id}`);
    await addTeamsToTournament(beaProTournament.id, beaProTournament.name);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function addTeamsToTournament(tournamentId, tournamentName) {
  console.log(`\nAdding ${teams.length} putri teams to ${tournamentName}...`);

  for (const teamName of teams) {
    try {
      const formData = new FormData();
      formData.append('name', teamName);
      formData.append('gender', 'putri');
      formData.append('tournamentId', tournamentId);

      const response = await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        console.log(`✓ Added team: ${teamName}`);
      } else {
        console.log(`✗ Failed to add team: ${teamName} - ${data.error}`);
      }

    } catch (error) {
      console.log(`✗ Error adding team: ${teamName} - ${error.message}`);
    }

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Finished adding teams to ${tournamentName}!`);
}

addTeams();