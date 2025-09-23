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
    message: "Tim Thunder mendaftar untuk Kejuaraan Musim Panas",
    time: "2 jam yang lalu",
  },
  {
    id: 2,
    type: "tournament",
    message: "Turnamen baru 'Piala Voli Pantai' telah dibuat",
    time: "4 jam yang lalu",
  },
  {
    id: 3,
    type: "registration",
    message: "Tim Lightning disetujui untuk Turnamen Musim Semi",
    time: "6 jam yang lalu",
  },
  {
    id: 4,
    type: "team",
    message: "Tim Spike berhasil mendaftar",
    time: "1 hari yang lalu",
  },
]

function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Turnamen</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTournaments}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {stats.activeTournaments} aktif
            </Badge>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tim Terdaftar</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTeams}</div>
          <p className="text-xs text-muted-foreground">
            +3 dari bulan lalu
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pendaftaran</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {stats.pendingRegistrations} menunggu
            </Badge>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendaftaran Disetujui</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approvedRegistrations}</div>
          <p className="text-xs text-muted-foreground">
            77% tingkat persetujuan
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
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>
          Pembaruan terbaru dari sistem pengelolaan turnamen
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
                {activity.type === "registration" ? "pendaftaran" : activity.type === "tournament" ? "turnamen" : "tim"}
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
          Selamat datang di sistem pengelolaan turnamen bola voli
        </TypographyMuted>
      </div>

      <Suspense fallback={<div>Memuat statistik...</div>}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Tugas umum dan pintasan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <a
                href="/admin/tournaments"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm"
              >
                <Trophy className="h-4 w-4" />
                Kelola Turnamen
              </a>
              <a
                href="/admin/registrations"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm"
              >
                <ClipboardList className="h-4 w-4" />
                Tinjau Pendaftaran
              </a>
              <a
                href="/admin/teams"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm"
              >
                <Users className="h-4 w-4" />
                Lihat Tim
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Dashboard Admin | Turnamen Bola Voli",
  description: "Kelola turnamen bola voli, tim, dan pendaftaran",
}