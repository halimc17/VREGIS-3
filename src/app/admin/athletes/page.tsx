"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Filter, X, Search, UserCheck, Calendar, MapPin, Ruler, Weight, School, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Athlete {
  id: string
  namaLengkap: string
  namaJersey?: string
  noJersey: number
  position: string
  gender: 'putra' | 'putri'
  tanggalLahir: string
  tinggi?: number
  berat?: number
  sekolah: string
  kotaSekolahAsal: string
  fotoAtlet?: string
  age: string
  ageNumber: number
  team?: {
    id: string
    name: string
    gender: 'putra' | 'putri'
  }
  tournament?: {
    id: string
    name: string
    category: string
  }
}

interface Team {
  id: string
  name: string
  gender: 'putra' | 'putri'
}

interface Tournament {
  id: string
  name: string
  category: string
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [teamFilter, setTeamFilter] = useState<string>("all")
  const [tournamentFilter, setTournamentFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchAthletes = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (teamFilter !== 'all') params.append('teamId', teamFilter)
      if (tournamentFilter !== 'all') params.append('tournamentId', tournamentFilter)
      if (genderFilter !== 'all') params.append('gender', genderFilter)

      const response = await fetch(`/api/athletes?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setAthletes(data.athletes)
      }
    } catch (error) {
      console.error("Failed to fetch athletes:", error)
      toast.error("Gagal mengambil data atlit")
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams")
      const data = await response.json()

      if (data.success) {
        setTeams(data.teams)
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error)
    }
  }

  const fetchTournaments = async () => {
    try {
      const response = await fetch("/api/tournaments/public")
      const data = await response.json()

      if (data.success) {
        setTournaments(data.tournaments)
      }
    } catch (error) {
      console.error("Failed to fetch tournaments:", error)
    }
  }

  useEffect(() => {
    fetchTeams()
    fetchTournaments()
  }, [])

  useEffect(() => {
    fetchAthletes()
  }, [searchQuery, teamFilter, tournamentFilter, genderFilter])

  const clearFilters = () => {
    setSearchQuery("")
    setTeamFilter("all")
    setTournamentFilter("all")
    setGenderFilter("all")
  }

  // Filter teams based on selected gender
  const filteredTeams = genderFilter === "all"
    ? teams
    : teams.filter(team => team.gender === genderFilter)

  // Reset team filter when gender changes and current team is not in filtered teams
  useEffect(() => {
    if (teamFilter !== "all" && genderFilter !== "all") {
      const isTeamStillValid = filteredTeams.some(team => team.id === teamFilter)
      if (!isTeamStillValid) {
        setTeamFilter("all")
      }
    }
  }, [genderFilter, teamFilter, filteredTeams])

  const hasActiveFilters = searchQuery !== "" || teamFilter !== "all" || tournamentFilter !== "all" || genderFilter !== "all"

  const handleRowClick = (athlete: Athlete) => {
    setSelectedAthlete(athlete)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAthlete(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Atlit</h1>
          <p className="text-muted-foreground">
            Lihat dan kelola data atlit yang terdaftar dalam turnamen
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Atlit
              </CardTitle>
              <CardDescription>
                Cari dan filter atlit berdasarkan nama, tim, turnamen, dan jenis kelamin
              </CardDescription>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Hapus Filter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari nama atlit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex -space-x-px">
              <div className="flex-1">
                <Select value={tournamentFilter} onValueChange={setTournamentFilter}>
                  <SelectTrigger className="rounded-r-none border-r-0 focus:z-10">
                    <SelectValue placeholder="Semua Turnamen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Turnamen</SelectItem>
                    {tournaments.map((tournament) => (
                      <SelectItem key={tournament.id} value={tournament.id}>
                        {tournament.name} ({tournament.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="rounded-none border-x-0 focus:z-10">
                    <SelectValue placeholder="Semua Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis Kelamin</SelectItem>
                    <SelectItem value="putra">Putra</SelectItem>
                    <SelectItem value="putri">Putri</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="rounded-l-none border-l-0 focus:z-10">
                    <SelectValue placeholder="Semua Tim" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tim</SelectItem>
                    {filteredTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Data Atlit ({athletes.length})
          </CardTitle>
          <CardDescription>
            {hasActiveFilters
              ? `Menampilkan atlit berdasarkan filter yang dipilih`
              : `Daftar semua atlit yang terdaftar dalam sistem`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nama Atlit</TableHead>
                <TableHead>Umur</TableHead>
                <TableHead>Jersey</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Tim</TableHead>
                <TableHead>Turnamen</TableHead>
                <TableHead>Sekolah</TableHead>
                <TableHead>Fisik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.map((athlete) => (
                <TableRow
                  key={athlete.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRowClick(athlete)}
                >
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      {athlete.fotoAtlet ? (
                        <AvatarImage src={athlete.fotoAtlet} alt={athlete.namaLengkap} />
                      ) : null}
                      <AvatarFallback>
                        {athlete.namaLengkap.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{athlete.namaLengkap}</div>
                    <div className="text-sm text-muted-foreground">
                      <Badge variant={athlete.gender === 'putra' ? 'default' : 'secondary'} className="text-sm">
                        {athlete.gender === 'putra' ? 'Putra' : 'Putri'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{athlete.age}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">#{athlete.noJersey}</div>
                      {athlete.namaJersey && (
                        <div className="text-muted-foreground">{athlete.namaJersey}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-sm">
                      {athlete.position}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {athlete.team ? (
                      <div className="text-sm">
                        <div className="font-medium">{athlete.team.name}</div>
                        <div className="text-muted-foreground capitalize">{athlete.team.gender}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {athlete.tournament ? (
                      <div className="text-sm">
                        <div className="font-medium">{athlete.tournament.name}</div>
                        <div className="text-muted-foreground capitalize">{athlete.tournament.category}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{athlete.sekolah}</div>
                      <div className="text-muted-foreground">{athlete.kotaSekolahAsal}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {athlete.tinggi && (
                        <div>TB: {athlete.tinggi} cm</div>
                      )}
                      {athlete.berat && (
                        <div>BB: {athlete.berat} kg</div>
                      )}
                      {!athlete.tinggi && !athlete.berat && (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {athletes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UserCheck className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {hasActiveFilters ? "Tidak ada atlit yang sesuai dengan filter" : "Belum ada atlit terdaftar"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {hasActiveFilters
                  ? "Coba sesuaikan filter pencarian atau hapus semua filter"
                  : "Atlit akan muncul setelah tim mendaftarkan pemain mereka"
                }
              </p>
              {hasActiveFilters && (
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Hapus Filter
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Athlete Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="w-[60vw] max-w-[60vw] max-h-[85vh] overflow-y-auto p-4" style={{ width: '60vw', maxWidth: '60vw' }}>
          <DialogHeader className="pb-3">
            <DialogTitle className="text-xl font-bold">Detail Atlit</DialogTitle>
          </DialogHeader>

          {selectedAthlete && (
            <div className="space-y-4">
              {/* Header Section with Photo and Basic Info */}
              <div className="flex flex-row gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0">
                  <Avatar className="h-20 w-20">
                    {selectedAthlete.fotoAtlet ? (
                      <AvatarImage src={selectedAthlete.fotoAtlet} alt={selectedAthlete.namaLengkap} />
                    ) : null}
                    <AvatarFallback className="text-lg">
                      {selectedAthlete.namaLengkap.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedAthlete.namaLengkap}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <Badge variant={selectedAthlete.gender === 'putra' ? 'default' : 'secondary'} className="text-sm">
                      {selectedAthlete.gender === 'putra' ? 'Putra' : 'Putri'}
                    </Badge>
                    <Badge variant="outline" className="text-sm">{selectedAthlete.position}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Umur:</span> {selectedAthlete.age}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#</span>
                      <span className="text-sm">
                        <span className="font-medium">Jersey:</span> {selectedAthlete.noJersey}
                        {selectedAthlete.namaJersey && ` (${selectedAthlete.namaJersey})`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Information Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Personal Information */}
                <Card className="h-fit">
                  
                  <CardContent className="p-3 pt-0 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nama Lengkap:</span>
                      <span className="font-medium">{selectedAthlete.namaLengkap}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jenis Kelamin:</span>
                      <span className="font-medium capitalize">{selectedAthlete.gender}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Umur:</span>
                      <span className="font-medium">{selectedAthlete.age}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Posisi:</span>
                      <span className="font-medium">{selectedAthlete.position}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Physical Stats */}
                <Card className="h-fit">
              
                  <CardContent className="p-3 pt-0 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tinggi Badan:</span>
                      <span className="font-medium">
                        {selectedAthlete.tinggi ? `${selectedAthlete.tinggi} cm` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Berat Badan:</span>
                      <span className="font-medium">
                        {selectedAthlete.berat ? `${selectedAthlete.berat} kg` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nomor Jersey:</span>
                      <span className="font-medium">#{selectedAthlete.noJersey}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nama Jersey:</span>
                      <span className="font-medium">
                        {selectedAthlete.namaJersey || '—'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* School Information */}
                <Card className="h-fit">
           
                  <CardContent className="p-3 pt-0 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sekolah:</span>
                      <span className="font-medium">{selectedAthlete.sekolah}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kota Asal:</span>
                      <span className="font-medium">{selectedAthlete.kotaSekolahAsal}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Team & Tournament Information */}
                <Card className="h-fit">
     
                  <CardContent className="p-3 pt-0 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tim:</span>
                      <span className="font-medium">
                        {selectedAthlete.team?.name || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Turnamen:</span>
                      <span className="font-medium">
                        {selectedAthlete.tournament?.name || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kategori:</span>
                      <span className="font-medium capitalize">
                        {selectedAthlete.tournament?.category || '—'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}