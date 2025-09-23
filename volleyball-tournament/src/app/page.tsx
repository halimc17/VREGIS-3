import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TypographyH1,
  TypographyH2,
  TypographyLead,
  TypographyMuted
} from "@/components/ui/typography"
import { Trophy, Users, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <TypographyH1 className="mb-4">
            🏐 Volleyball Tournament
          </TypographyH1>
          <TypographyLead className="mb-8">
            Join competitive volleyball tournaments and showcase your team's skills
          </TypographyLead>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/register">Register Your Team</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/login">Admin Login</a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <CardTitle>Competitive Tournaments</CardTitle>
              <CardDescription>
                Join exciting volleyball competitions with teams from around the region
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <CardTitle>Team Registration</CardTitle>
              <CardDescription>
                Easy online registration process for teams of all skill levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <CardTitle>Event Management</CardTitle>
              <CardDescription>
                Professional tournament organization with comprehensive scheduling
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <TypographyH2 className="mb-4 border-none">
            Ready to Compete?
          </TypographyH2>
          <TypographyMuted className="mb-6">
            Register your team today and be part of the volleyball community
          </TypographyMuted>
          <Button size="lg" asChild>
            <a href="/register">Get Started</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
