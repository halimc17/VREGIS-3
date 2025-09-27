"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, MapPin, Users, DollarSign, Trophy } from "lucide-react"
import { Tournament, TeamRegistrationFormData } from "@/types"
import {
  TypographyH1,
  TypographyH2,
  TypographyP,
  TypographyMuted
} from "@/components/ui/typography"

const registrationSchema = z.object({
  tournamentId: z.string().min(1, "Please select a tournament"),
  name: z.string().min(1, "Team name is required"),
  captainName: z.string().min(1, "Captain name is required"),
  captainEmail: z.string().email("Invalid email format"),
  captainPhone: z.string().min(1, "Captain phone is required"),
  institution: z.string().optional(),
  playerCount: z.number().min(6, "Team must have at least 6 players").max(12, "Team cannot have more than 12 players"),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  notes: z.string().optional(),
})

export default function RegisterPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)

  const form = useForm<TeamRegistrationFormData & { tournamentId: string }>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      tournamentId: "",
      name: "",
      captainName: "",
      captainEmail: "",
      captainPhone: "",
      institution: "",
      playerCount: 6,
      experience: "beginner",
      notes: "",
    },
  })

  const fetchTournaments = async () => {
    try {
      const response = await fetch("/api/tournaments")
      const data = await response.json()

      if (data.success) {
        // Filter only upcoming tournaments with open registration
        const availableTournaments = data.tournaments.filter((tournament: Tournament) => {
          return tournament.status === 'upcoming' &&
                 new Date() < new Date(tournament.registrationDeadline)
        })
        setTournaments(availableTournaments)
      }
    } catch (error) {
      console.error("Failed to fetch tournaments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournaments()
  }, [])

  const onSubmit = async (data: TeamRegistrationFormData & { tournamentId: string }) => {
    setSubmitting(true)

    try {
      const { tournamentId, ...teamData } = data

      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentId,
          teamData: {
            ...teamData,
            playerCount: Number(teamData.playerCount),
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        form.reset()
      } else {
        console.error("Failed to register team:", result.error)
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error("Failed to register team:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleTournamentSelect = (tournamentId: string) => {
    form.setValue("tournamentId", tournamentId)
    const tournament = tournaments.find(t => t.id === tournamentId)
    setSelectedTournament(tournament || null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TypographyH1 className="mb-2">🏐 Tournament Registration</TypographyH1>
          <TypographyMuted>Loading available tournaments...</TypographyMuted>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Registration Successful!</CardTitle>
            <CardDescription>
              Your team has been registered successfully. You will receive a confirmation email shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => {setSuccess(false); window.location.reload()}}>
              Register Another Team
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <TypographyH1 className="mb-2">🏐 Volleyball Tournament Registration</TypographyH1>
          <TypographyMuted>Register your team for upcoming tournaments</TypographyMuted>
        </div>

        {tournaments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tournaments are currently accepting registrations</p>
              <Button onClick={() => window.location.href = "/"}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <TypographyH2 className="mb-4 border-none">Available Tournaments</TypographyH2>
              <div className="space-y-4">
                {tournaments.map((tournament) => (
                  <Card
                    key={tournament.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTournament?.id === tournament.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleTournamentSelect(tournament.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tournament.name}</CardTitle>
                        <Badge variant="default">Open</Badge>
                      </div>
                      <CardDescription>{tournament.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{tournament.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Max {tournament.maxTeams} teams</span>
                        </div>
                        {tournament.entryFee > 0 && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>${(tournament.entryFee / 100).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="text-xs text-red-600">
                          Registration deadline: {formatDate(tournament.registrationDeadline)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <TypographyH2 className="mb-4 border-none">Team Registration</TypographyH2>
              <Card>
                <CardHeader>
                  <CardTitle>Register Your Team</CardTitle>
                  <CardDescription>
                    Fill out the form below to register your team for the selected tournament
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Team Name</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="Thunder Spikes"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="captainName">Captain Name</Label>
                      <Input
                        id="captainName"
                        {...form.register("captainName")}
                        placeholder="John Doe"
                      />
                      {form.formState.errors.captainName && (
                        <p className="text-sm text-red-600">{form.formState.errors.captainName.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="captainEmail">Captain Email</Label>
                      <Input
                        id="captainEmail"
                        type="email"
                        {...form.register("captainEmail")}
                        placeholder="john@example.com"
                      />
                      {form.formState.errors.captainEmail && (
                        <p className="text-sm text-red-600">{form.formState.errors.captainEmail.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="captainPhone">Captain Phone</Label>
                      <Input
                        id="captainPhone"
                        {...form.register("captainPhone")}
                        placeholder="(555) 123-4567"
                      />
                      {form.formState.errors.captainPhone && (
                        <p className="text-sm text-red-600">{form.formState.errors.captainPhone.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="institution">Institution (Optional)</Label>
                      <Input
                        id="institution"
                        {...form.register("institution")}
                        placeholder="University or Club Name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="playerCount">Number of Players</Label>
                        <Input
                          id="playerCount"
                          type="number"
                          min="6"
                          max="12"
                          {...form.register("playerCount", { valueAsNumber: true })}
                        />
                        {form.formState.errors.playerCount && (
                          <p className="text-sm text-red-600">{form.formState.errors.playerCount.message}</p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select onValueChange={(value) => form.setValue("experience", value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.experience && (
                          <p className="text-sm text-red-600">{form.formState.errors.experience.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        {...form.register("notes")}
                        placeholder="Any additional information about your team..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting || !selectedTournament}
                    >
                      {submitting ? "Registering..." : "Register Team"}
                    </Button>

                    {!selectedTournament && (
                      <p className="text-sm text-muted-foreground text-center">
                        Please select a tournament to register for
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}