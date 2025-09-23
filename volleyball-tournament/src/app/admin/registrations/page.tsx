"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  TypographyH1,
  TypographyMuted
} from "@/components/ui/typography"

interface RegistrationWithDetails {
  registration: {
    id: string
    status: string
    registrationDate: string
    paymentStatus: string
  }
  team: {
    id: string
    name: string
    captainName: string
    captainEmail: string
    experience: string
  }
  tournament: {
    id: string
    name: string
    startDate: string
    location: string
  }
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registrations")
      const data = await response.json()

      if (data.success) {
        setRegistrations(data.registrations)
      }
    } catch (error) {
      console.error("Failed to fetch registrations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      case "waitlisted":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "unpaid":
        return "destructive"
      case "refunded":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <TypographyH1>Registrations</TypographyH1>
          <TypographyMuted>Loading registrations...</TypographyMuted>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <TypographyH1>Registrations</TypographyH1>
        <TypographyMuted>
          Manage team registrations for tournaments
        </TypographyMuted>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tournament Registrations ({registrations.length})</CardTitle>
          <CardDescription>
            Overview of all team registrations across tournaments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Tournament</TableHead>
                <TableHead>Captain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Registered Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.registration.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reg.team?.name || "Unknown Team"}</div>
                      <div className="text-sm text-muted-foreground">
                        {reg.team?.experience || "N/A"} level
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reg.tournament?.name || "Unknown Tournament"}</div>
                      <div className="text-sm text-muted-foreground">
                        {reg.tournament?.location || "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{reg.team?.captainName || "N/A"}</div>
                      <div className="text-muted-foreground">{reg.team?.captainEmail || "N/A"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeColor(reg.registration.status)}>
                      {reg.registration.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentBadgeColor(reg.registration.paymentStatus)}>
                      {reg.registration.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(reg.registration.registrationDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {registrations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No registrations found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}