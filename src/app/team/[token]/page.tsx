import { notFound } from 'next/navigation';
import { db } from '@/lib/db/connection';
import { teams, players, tournaments, officials, teamJerseys } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import TeamPlayersClient from './team-players-client';

interface TeamPageProps {
  params: Promise<{
    token: string;
  }>;
}

async function getTeamByToken(token: string) {
  const team = await db
    .select({
      id: teams.id,
      name: teams.name,
      gender: teams.gender,
      logo: teams.logo,
      token: teams.token,
      tournament: {
        id: tournaments.id,
        name: tournaments.name,
        category: tournaments.category,
        maxPlayersPerTeam: tournaments.maxPlayersPerTeam,
      }
    })
    .from(teams)
    .leftJoin(tournaments, eq(teams.tournamentId, tournaments.id))
    .where(eq(teams.token, token))
    .limit(1);

  if (team.length === 0) {
    return null;
  }

  // Get existing players for this team
  const teamPlayers = await db
    .select()
    .from(players)
    .where(eq(players.teamId, team[0].id));

  // Get existing officials for this team
  const teamOfficials = await db
    .select()
    .from(officials)
    .where(eq(officials.teamId, team[0].id));

  // Get existing jerseys for this team
  const teamJerseysData = await db
    .select()
    .from(teamJerseys)
    .where(eq(teamJerseys.teamId, team[0].id));

  return {
    ...team[0],
    players: teamPlayers,
    officials: teamOfficials,
    jerseys: teamJerseysData
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { token } = await params;
  const team = await getTeamByToken(token);

  if (!team) {
    notFound();
  }

  return <TeamPlayersClient team={team} />;
}