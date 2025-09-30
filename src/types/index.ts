export type {
  User,
  NewUser,
  Tournament,
  NewTournament,
  Team,
  NewTeam,
  Registration,
  NewRegistration,
} from '@/lib/db/schema';

// Additional types for the application
export interface LoginFormData {
  email: string;
  password: string;
}

export interface TournamentFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  maxTeams: number;
  registrationDeadline: string;
  entryFee: number;
  status: 'open' | 'closed';
}

export interface TeamRegistrationFormData {
  name: string;
  gender: 'putra' | 'putri';
  tournamentId: string;
  logo?: File;
}

export interface DashboardStats {
  totalTournaments: number;
  activeTournaments: number;
  totalTeams: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
}