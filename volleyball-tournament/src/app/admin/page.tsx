import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TypographyH1,
  TypographyP,
  TypographyMuted
} from "@/components/ui/typography"
import { Calendar, Trophy, Users, ClipboardList } from "lucide-react"

// Mock data for now - will be replaced with real data later
const stats = {
  totalTournaments: 5,
  activeTournaments: 2,
  totalTeams: 24,
  totalRegistrations: 31,
  pendingRegistrations: 7,
  approvedRegistrations: 24,
}

const recentActivities = [
  {
    id: 1,
    type: "registration",
    message: "Team Thunder registered for Summer Championship",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "tournament",
    message: "New tournament 'Beach Volleyball Cup' created",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "registration",
    message: "Team Lightning approved for Spring Tournament",
    time: "6 hours ago",
  },
  {
    id: 4,
    type: "team",
    message: "Team Spike registered successfully",
    time: "1 day ago",
  },
]

function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTournaments}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {stats.activeTournaments} active
            </Badge>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registered Teams</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTeams}</div>
          <p className="text-xs text-muted-foreground">
            +3 from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {stats.pendingRegistrations} pending
            </Badge>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Registrations</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approvedRegistrations}</div>
          <p className="text-xs text-muted-foreground">
            77% approval rate
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from the tournament management system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
              <div className="flex-1">
                <p className="text-sm">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Badge
                variant={
                  activity.type === "registration"
                    ? "default"
                    : activity.type === "tournament"
                    ? "secondary"
                    : "outline"
                }
                className="text-xs"
              >
                {activity.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <TypographyH1>Dashboard</TypographyH1>
        <TypographyMuted>
          Welcome to the volleyball tournament management system
        </TypographyMuted>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <a
                href="/admin/tournaments"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm"
              >
                <Trophy className="h-4 w-4" />
                Manage Tournaments
              </a>
              <a
                href="/admin/registrations"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm"
              >
                <ClipboardList className="h-4 w-4" />
                Review Registrations
              </a>
              <a
                href="/admin/teams"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm"
              >
                <Users className="h-4 w-4" />
                View Teams
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Admin Dashboard | Volleyball Tournament",
  description: "Manage volleyball tournaments, teams, and registrations",
}