"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, UserCircle, Shirt, FileText, Calendar, MapPin, Phone, Ruler, Weight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface Player {
  id: string
  namaLengkap: string
  namaJersey: string | null
  noJersey: number
  position: string
  gender: string
  tempatLahir: string
  tanggalLahir: string
  tinggi: number | null
  berat: number | null
  nik: string | null
  nisn: string | null
  sekolah: string
  kotaSekolahAsal: string
  fotoAtlet: string | null
  documents: Document[]
}

interface Official {
  id: string
  namaLengkap: string
  posisi: string
  nomorTelepon: string
  fotoOfficial: string | null
}

interface Document {
  id: string
  documentType: string
  customDocumentType: string | null
  fileName: string
  fileUrl: string
}

interface Jersey {
  id: string
  warnaJersey1: string | null
  warnaJersey2: string | null
  warnaJersey3: string | null
}

interface TeamDetailData {
  team: {
    id: string
    name: string
    gender: string
    logo: string | null
  }
  players: Player[]
  officials: Official[]
  jerseys: Jersey | null
}

interface TeamDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string | null
}

export default function TeamDetailModal({ open, onOpenChange, teamId }: TeamDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<TeamDetailData | null>(null)

  useEffect(() => {
    if (open && teamId) {
      fetchTeamDetails()
    }
  }, [open, teamId])

  // Prevent body scroll lock when modal is open - force override with important
  useEffect(() => {
    if (open) {
      // Add a style tag with !important to override Radix UI's overflow hidden
      const styleTag = document.createElement('style')
      styleTag.id = 'modal-scroll-override'
      styleTag.innerHTML = `
        body[data-scroll-locked] {
          overflow: auto !important;
          padding-right: 0 !important;
        }
      `
      document.head.appendChild(styleTag)

      return () => {
        const tag = document.getElementById('modal-scroll-override')
        if (tag) {
          tag.remove()
        }
      }
    }
  }, [open])

  const fetchTeamDetails = async () => {
    if (!teamId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/teams/${teamId}/details`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        console.error("Failed to fetch team details:", result.error)
      }
    } catch (error) {
      console.error("Error fetching team details:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getPositionBadgeVariant = (position: string) => {
    switch (position) {
      case 'Outside Hitter':
        return 'default'
      case 'Middle Blocker':
        return 'secondary'
      case 'Setter':
        return 'outline'
      case 'Libero':
        return 'destructive'
      case 'Opposite Hitter':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] !absolute !top-[2rem] !translate-y-0 left-[50%] -translate-x-1/2 my-8 mb-16" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detail Tim</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6 py-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : data ? (
          <div className="space-y-6 py-4">
            {/* Team Info */}
            <div className="flex items-center gap-4">
              {data.team.logo ? (
                <img
                  src={data.team.logo}
                  alt={data.team.name}
                  className="h-16 w-16 rounded-lg object-cover border-2"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-2xl font-bold border-2">
                  {data.team.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold">{data.team.name}</h3>
                <Badge variant={data.team.gender === 'putra' ? 'default' : 'secondary'}>
                  {data.team.gender === 'putra' ? 'Putra' : 'Putri'}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Players */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h4 className="text-lg font-semibold">
                  Atlet ({data.players.length})
                </h4>
              </div>
              {data.players.length > 0 ? (
                <div className="rounded-md border-t border-b overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="w-[80px]">Foto</TableHead>
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Nama Jersey</TableHead>
                        <TableHead>Posisi</TableHead>
                        <TableHead>Tempat, Tanggal Lahir</TableHead>
                        <TableHead>Sekolah</TableHead>
                        <TableHead className="text-center">Tinggi</TableHead>
                        <TableHead className="text-center">Berat</TableHead>
                        <TableHead>NISN</TableHead>
                        <TableHead className="text-center">Dokumen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.players.map((player, index) => (
                        <TableRow key={player.id} className={index !== data.players.length - 1 ? "border-b" : ""}>
                          <TableCell>
                            {player.fotoAtlet ? (
                              <img
                                src={player.fotoAtlet}
                                alt={player.namaLengkap}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                <Users className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {player.noJersey}
                          </TableCell>
                          <TableCell className="font-medium">{player.namaLengkap}</TableCell>
                          <TableCell>{player.namaJersey || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={getPositionBadgeVariant(player.position)}>
                              {player.position}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {player.tempatLahir}, {formatDate(player.tanggalLahir)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{player.sekolah}</div>
                              <div className="text-muted-foreground">{player.kotaSekolahAsal}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {player.tinggi ? `${player.tinggi} cm` : '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {player.berat ? `${player.berat} kg` : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {player.nisn || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {player.documents.length > 0 ? (
                              <Badge variant="secondary">{player.documents.length}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada atlet yang terdaftar</p>
              )}
            </div>

            <Separator />

            {/* Officials */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <h4 className="text-lg font-semibold">
                  Official ({data.officials.length})
                </h4>
              </div>
              {data.officials.length > 0 ? (
                <div className="rounded-md border-t border-b overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="w-[80px]">Foto</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Posisi</TableHead>
                        <TableHead>No. Telepon</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.officials.map((official, index) => (
                        <TableRow key={official.id} className={index !== data.officials.length - 1 ? "border-b" : ""}>
                          <TableCell>
                            {official.fotoOfficial ? (
                              <img
                                src={official.fotoOfficial}
                                alt={official.namaLengkap}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                <UserCircle className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{official.namaLengkap}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{official.posisi}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{official.nomorTelepon}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada official yang terdaftar</p>
              )}
            </div>

            {/* Jersey Colors */}
            {data.jerseys && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Shirt className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-lg font-semibold">Warna Jersey</h4>
                  </div>
                  <div className="flex gap-4">
                    {data.jerseys.warnaJersey1 && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded border-2"
                          style={{ backgroundColor: data.jerseys.warnaJersey1 }}
                        />
                        <span className="text-sm text-muted-foreground">Jersey 1</span>
                      </div>
                    )}
                    {data.jerseys.warnaJersey2 && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded border-2"
                          style={{ backgroundColor: data.jerseys.warnaJersey2 }}
                        />
                        <span className="text-sm text-muted-foreground">Jersey 2</span>
                      </div>
                    )}
                    {data.jerseys.warnaJersey3 && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded border-2"
                          style={{ backgroundColor: data.jerseys.warnaJersey3 }}
                        />
                        <span className="text-sm text-muted-foreground">Jersey 3</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Tidak ada data
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
