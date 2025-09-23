"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  TypographyH1,
  TypographyMuted
} from "@/components/ui/typography"
import { Team } from "@/types"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchTeams()
  }, [])

  const getExperienceBadgeColor = (experience: string) => {
    switch (experience) {
      case "beginner":
        return "secondary"
      case "intermediate":
        return "default"
      case "advanced":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <TypographyH1>Teams</TypographyH1>
          <TypographyMuted>Loading teams...</TypographyMuted>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <TypographyH1>Teams</TypographyH1>
        <TypographyMuted>
          View and manage registered volleyball teams
        </TypographyMuted>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Teams ({teams.length})</CardTitle>
          <CardDescription>
            List of all teams that have registered for tournaments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Captain</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.captainName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{team.captainEmail}</div>
                      <div className="text-muted-foreground">{team.captainPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{team.institution || "—"}</TableCell>
                  <TableCell>{team.playerCount}</TableCell>
                  <TableCell>
                    <Badge variant={getExperienceBadgeColor(team.experience)}>
                      {team.experience}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {teams.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No teams registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}