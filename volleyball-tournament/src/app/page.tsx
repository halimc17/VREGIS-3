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
            🏐 Turnamen Bola Voli
          </TypographyH1>
          <TypographyLead className="mb-8">
            Ikuti turnamen bola voli kompetitif dan tunjukkan kemampuan tim Anda
          </TypographyLead>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/register">Daftar Tim Anda</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/login">Login Admin</a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <CardTitle>Turnamen Kompetitif</CardTitle>
              <CardDescription>
                Ikuti kompetisi bola voli yang menarik dengan tim dari berbagai daerah
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <CardTitle>Pendaftaran Tim</CardTitle>
              <CardDescription>
                Proses pendaftaran online yang mudah untuk tim dengan berbagai tingkat kemampuan
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <CardTitle>Manajemen Acara</CardTitle>
              <CardDescription>
                Organisasi turnamen profesional dengan penjadwalan yang komprehensif
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <TypographyH2 className="mb-4 border-none">
            Siap Berkompetisi?
          </TypographyH2>
          <TypographyMuted className="mb-6">
            Daftar tim Anda hari ini dan jadilah bagian dari komunitas bola voli
          </TypographyMuted>
          <Button size="lg" asChild>
            <a href="/register">Mulai Sekarang</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
