"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Filter, X, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Team, Tournament } from "@/types"
import TeamFormDialog from "@/components/team-form-dialog"
import EditTeamDialog from "@/components/edit-team-dialog"
import DeleteTeamDialog from "@/components/delete-team-dialog"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null)
  const [tournamentFilter, setTournamentFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams")
      const data = await response.json()

      if (data.success) {
        setTeams(data.teams)
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTournaments = async () => {
    try {
      const response = await fetch("/api/tournaments/public")
      const data = await response.json()

      if (data.success) {
        setTournaments(data.tournaments)
        console.log("Tournaments loaded:", data.tournaments.length)
      } else {
        console.error("Failed to fetch tournaments:", data.error)
      }
    } catch (error) {
      console.error("Failed to fetch tournaments:", error)
    }
  }

  useEffect(() => {
    fetchTeams()
    fetchTournaments()
  }, [])

  // Filter teams based on selected filters
  const filteredTeams = teams.filter(team => {
    const matchesTournament = tournamentFilter === "all" || (team.tournament?.id === tournamentFilter)
    const matchesGender = genderFilter === "all" || team.gender === genderFilter
    const matchesSearch = !searchQuery || team.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTournament && matchesGender && matchesSearch
  })

  const clearFilters = () => {
    setTournamentFilter("all")
    setGenderFilter("all")
    setSearchQuery("")
  }

  const hasActiveFilters = tournamentFilter !== "all" || genderFilter !== "all" || searchQuery !== ""


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
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
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            View and manage registered volleyball teams
          </p>
        </div>
        <Button onClick={() => setShowTeamForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tim baru
        </Button>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>
                Search and filter teams by name, tournament, and gender
              </CardDescription>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search team name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <Select value={tournamentFilter} onValueChange={setTournamentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tournaments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tournaments</SelectItem>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name} ({tournament.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="putra">Putra</SelectItem>
                  <SelectItem value="putri">Putri</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Registered Teams ({filteredTeams.length}{teams.length !== filteredTeams.length ? ` of ${teams.length}` : ''})
          </CardTitle>
          <CardDescription>
            {hasActiveFilters
              ? `Showing filtered teams based on selected criteria`
              : `List of all teams that have registered for tournaments`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Tournament</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="w-[70px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team: any) => (
                <TableRow key={team.id}>
                  <TableCell>
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={`${team.name} logo`}
                        className="h-8 w-8 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground border">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>
                    <Badge variant={team.gender === 'putra' ? 'default' : 'secondary'}>
                      {team.gender === 'putra' ? 'Putra' : 'Putri'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {team.tournament ? (
                      <div className="text-sm">
                        <div className="font-medium">{team.tournament.name}</div>
                        <div className="text-muted-foreground capitalize">{team.tournament.category}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTeam(team)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingTeam(team)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTeams.length === 0 && teams.length > 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No teams match the current filters</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search terms, filter criteria, or clear all filters to see all teams.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={clearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
          {teams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No teams registered</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by adding your first team to the tournament.
              </p>
              <Button
                className="mt-4"
                onClick={() => setShowTeamForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tim baru
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TeamFormDialog
        open={showTeamForm}
        onOpenChange={setShowTeamForm}
        tournaments={tournaments}
        onTeamCreated={() => {
          fetchTeams()
          setShowTeamForm(false)
        }}
      />

      <EditTeamDialog
        open={!!editingTeam}
        onOpenChange={(open) => !open && setEditingTeam(null)}
        team={editingTeam}
        tournaments={tournaments}
        onTeamUpdated={() => {
          fetchTeams()
          setEditingTeam(null)
        }}
      />

      <DeleteTeamDialog
        open={!!deletingTeam}
        onOpenChange={(open) => !open && setDeletingTeam(null)}
        team={deletingTeam}
        onTeamDeleted={() => {
          fetchTeams()
          setDeletingTeam(null)
        }}
      />
    </div>
  )
}