'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TypographyH1, TypographyH3, TypographyMuted, TypographyLead } from '@/components/ui/typography';
import { Plus, Users, UserCheck, MessageCircle } from 'lucide-react';
import PlayerFormDialog from './player-form-dialog';
import DeletePlayerDialog from './delete-player-dialog';
import OfficialFormDialog from './official-form-dialog';
import DeleteOfficialDialog from './delete-official-dialog';

interface Player {
  id: string;
  namaLengkap: string;
  namaJersey: string | null;
  noJersey: number;
  position: string;
  gender: string;
  tempatLahir: string;
  tanggalLahir: Date;
  tinggi: number;
  berat: number;
  nik: string;
  nisn: string;
  sekolah: string;
  kotaSekolahAsal: string;
  fotoAtlet: string | null;
  createdAt: Date;
}

interface Official {
  id: string;
  namaLengkap: string;
  posisi: string;
  nomorTelepon: string;
  fotoOfficial: string | null;
  createdAt: Date;
}

interface Team {
  id: string;
  name: string;
  gender: string;
  logo: string | null;
  token: string;
  tournament: {
    id: string;
    name: string;
    category: string;
    maxPlayersPerTeam: number;
  } | null;
  players: Player[];
  officials: Official[];
}

interface TeamPlayersClientProps {
  team: Team;
}

export default function TeamPlayersClient({ team: initialTeam }: TeamPlayersClientProps) {
  const [team, setTeam] = useState(initialTeam);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [showOfficialForm, setShowOfficialForm] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [deletingOfficial, setDeletingOfficial] = useState<Official | null>(null);

  const refreshPlayers = async () => {
    try {
      const response = await fetch(`/api/public/teams/${team.token}/players`);
      if (response.ok) {
        const data = await response.json();
        setTeam(prev => ({ ...prev, players: data.players }));
      }
    } catch (error) {
      console.error('Failed to refresh players:', error);
    }
  };

  const refreshOfficials = async () => {
    try {
      const response = await fetch(`/api/public/teams/${team.token}/officials`);
      if (response.ok) {
        const data = await response.json();
        setTeam(prev => ({ ...prev, officials: data.officials }));
      }
    } catch (error) {
      console.error('Failed to refresh officials:', error);
    }
  };

  const handlePlayerAdded = () => {
    refreshPlayers();
    setShowPlayerForm(false);
    toast.success('Atlet berhasil ditambahkan!');
  };

  const handlePlayerUpdated = () => {
    refreshPlayers();
    setEditingPlayer(null);
    toast.success('Data atlet berhasil diperbarui!');
  };

  const handlePlayerDeleted = () => {
    refreshPlayers();
    setDeletingPlayer(null);
    toast.success('Atlet berhasil dihapus dari tim!');
  };

  const handleOfficialAdded = () => {
    refreshOfficials();
    setShowOfficialForm(false);
    toast.success('Official berhasil ditambahkan!');
  };

  const handleOfficialUpdated = () => {
    refreshOfficials();
    setEditingOfficial(null);
    toast.success('Data official berhasil diperbarui!');
  };

  const handleOfficialDeleted = () => {
    refreshOfficials();
    setDeletingOfficial(null);
    toast.success('Official berhasil dihapus dari tim!');
  };

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      'Outside Hitter': 'bg-blue-100 text-blue-800',
      'Middle Blocker': 'bg-green-100 text-green-800',
      'Setter': 'bg-purple-100 text-purple-800',
      'Libero': 'bg-orange-100 text-orange-800',
      'Opposite Hitter': 'bg-red-100 text-red-800',
      'Defensive Specialist': 'bg-gray-100 text-gray-800',
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  const getOfficialPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      'Manager': 'bg-indigo-100 text-indigo-800',
      'Head Coach': 'bg-emerald-100 text-emerald-800',
      'Assistant Coach 1': 'bg-yellow-100 text-yellow-800',
      'Assistant Coach 2': 'bg-pink-100 text-pink-800',
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col space-y-6">
            {/* Team Header */}
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={team.logo || ''} alt={`${team.name} logo`} />
                <AvatarFallback className="text-xl font-bold">
                  {team.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <TypographyH1 className="!text-3xl !leading-tight">
                    {team.name}
                  </TypographyH1>
                  <Badge variant={team.gender === 'putra' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                    {team.gender === 'putra' ? 'PUTRA' : 'PUTRI'}
                  </Badge>
                </div>
                <TypographyLead className="!mt-1">
                  {team.tournament ? `${team.tournament.name} - Manajemen Atlet Tim` : 'Manajemen Atlet Tim'}
                </TypographyLead>
              </div>
            </div>
          </div>

          {/* Players Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle>Daftar Atlet</CardTitle>
                    {team.tournament && (
                      <Badge variant="secondary" className="text-sm font-medium">
                        {team.players.length}/{team.tournament.maxPlayersPerTeam} pemain
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {team.tournament ? (
                      <>
                        Kelola data atlet yang terdaftar dalam tim
                        {team.tournament.maxPlayersPerTeam - team.players.length > 0 && (
                          <span className="text-green-600 ml-1">
                            • masih bisa didaftarkan {team.tournament.maxPlayersPerTeam - team.players.length} pemain lagi
                          </span>
                        )}
                        {team.players.length >= team.tournament.maxPlayersPerTeam && (
                          <span className="text-amber-600 ml-1">
                            • tim sudah mencapai batas maksimal pemain
                          </span>
                        )}
                      </>
                    ) : (
                      'Kelola data atlet yang terdaftar dalam tim'
                    )}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowPlayerForm(true)}
                  disabled={team.tournament && team.players.length >= team.tournament.maxPlayersPerTeam}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Atlet
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {team.players.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="mt-6 space-y-2">
                    <TypographyH3>Belum ada atlet terdaftar</TypographyH3>
                    <TypographyMuted>
                      Mulai dengan menambahkan atlet pertama untuk tim Anda.
                    </TypographyMuted>
                  </div>
                  <Button
                    className="mt-6"
                    onClick={() => setShowPlayerForm(true)}
                    disabled={team.tournament && team.players.length >= team.tournament.maxPlayersPerTeam}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Atlet Pertama
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Foto</TableHead>
                      <TableHead className="w-[100px]">No. Jersey</TableHead>
                      <TableHead>Nama Lengkap</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead className="w-[120px]">Tinggi/Berat</TableHead>
                      <TableHead>Sekolah</TableHead>
                      <TableHead className="w-[70px] text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={player.fotoAtlet || ''} alt={player.namaLengkap} />
                            <AvatarFallback className="text-xs">
                              {player.namaLengkap.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            #{player.noJersey}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{player.namaLengkap}</div>
                            {player.namaJersey && (
                              <div className="text-sm text-muted-foreground">
                                Jersey: {player.namaJersey}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPositionColor(player.position)}>
                            {player.position}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-1">
                            <div>{player.tinggi ? `${player.tinggi}cm` : '—'}</div>
                            <div className="text-muted-foreground">{player.berat ? `${player.berat}kg` : '—'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{player.sekolah}</div>
                            <div className="text-sm text-muted-foreground">
                              {player.kotaSekolahAsal}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => setEditingPlayer(player)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => setDeletingPlayer(player)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Officials & Jersey Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Officials Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle>Daftar Official Tim</CardTitle>
                      <Badge variant="secondary" className="text-sm font-medium">
                        {team.officials.length}/4
                      </Badge>
                    </div>
                    <CardDescription>
                      Daftar official yang terdaftar dalam tim
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowOfficialForm(true)}
                    disabled={team.officials.length >= 4}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Official
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {team.officials.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <UserCheck className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <TypographyH3 className="!text-lg">Belum ada official</TypographyH3>
                      <TypographyMuted className="!text-sm">
                        Tambahkan official pertama untuk tim Anda.
                      </TypographyMuted>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Foto</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Telepon</TableHead>
                        <TableHead className="w-[100px] text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.officials.map((official) => (
                        <TableRow key={official.id}>
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={official.fotoOfficial || ''} alt={official.namaLengkap} />
                              <AvatarFallback className="text-xs">
                                {official.namaLengkap.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <TypographyMuted className="!font-medium !text-sm !text-foreground">{official.namaLengkap}</TypographyMuted>
                              <Badge className={`${getOfficialPositionColor(official.posisi)} text-xs`}>
                                {official.posisi}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypographyMuted className="!font-mono !text-sm">{official.nomorTelepon}</TypographyMuted>
                              <button
                                type="button"
                                className="h-6 w-6 bg-green-500 text-white hover:bg-green-600 rounded-full flex items-center justify-center border-0 outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                                onClick={() => window.open(`https://wa.me/${official.nomorTelepon.replace(/\D/g, '')}`, '_blank')}
                                title={`Chat WhatsApp dengan ${official.namaLengkap}`}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="h-3 w-3"
                                >
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                                </svg>
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => setDeletingOfficial(official)}
                            >
                              Hapus
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Jersey Section */}
            <Card>
              <CardHeader>
                <div className="flex flex-col space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle>Daftar Jersey Tim</CardTitle>
                      <Badge variant="secondary" className="text-sm font-medium">
                        {team.players.length} jersey
                      </Badge>
                    </div>
                    <CardDescription>
                      Informasi nomor jersey dan nama jersey atlet
                      {team.players.length === 0 && (
                        <span className="text-muted-foreground block mt-1">
                          • jersey akan muncul setelah menambahkan atlet
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {team.players.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <div className="h-6 w-6 text-muted-foreground font-bold">#</div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <TypographyH3 className="!text-lg">Belum ada jersey</TypographyH3>
                      <TypographyMuted className="!text-sm">
                        Jersey akan ditampilkan setelah menambahkan atlet.
                      </TypographyMuted>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {team.players
                      .sort((a, b) => a.noJersey - b.noJersey)
                      .map((player) => (
                        <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                            #{player.noJersey}
                          </div>
                          <div className="flex-1 min-w-0">
                            <TypographyMuted className="!font-medium !text-sm !text-foreground truncate">{player.namaLengkap}</TypographyMuted>
                            {player.namaJersey ? (
                              <TypographyMuted className="!text-xs mt-1">
                                Jersey: {player.namaJersey}
                              </TypographyMuted>
                            ) : (
                              <TypographyMuted className="!text-xs mt-1 italic">
                                Nama jersey belum diisi
                              </TypographyMuted>
                            )}
                            <div className="mt-1">
                              <Badge className={`${getPositionColor(player.position)} text-xs`}>
                                {player.position}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 mt-16">
        <div className="container mx-auto px-6">
          <div className="text-center text-sm text-muted-foreground">
            powered by : Tornado Volleyball Club 2025
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <PlayerFormDialog
        open={showPlayerForm}
        onOpenChange={setShowPlayerForm}
        teamId={team.id}
        teamToken={team.token}
        teamGender={team.gender}
        existingPlayers={team.players}
        onPlayerAdded={handlePlayerAdded}
      />

      <PlayerFormDialog
        open={!!editingPlayer}
        onOpenChange={(open) => !open && setEditingPlayer(null)}
        teamId={team.id}
        teamToken={team.token}
        teamGender={team.gender}
        existingPlayers={team.players}
        player={editingPlayer}
        onPlayerUpdated={handlePlayerUpdated}
      />

      <DeletePlayerDialog
        open={!!deletingPlayer}
        onOpenChange={(open) => !open && setDeletingPlayer(null)}
        player={deletingPlayer}
        teamToken={team.token}
        onPlayerDeleted={handlePlayerDeleted}
      />

      <OfficialFormDialog
        open={showOfficialForm}
        onOpenChange={setShowOfficialForm}
        teamId={team.id}
        teamToken={team.token}
        existingOfficials={team.officials}
        onOfficialAdded={handleOfficialAdded}
      />

      <OfficialFormDialog
        open={!!editingOfficial}
        onOpenChange={(open) => !open && setEditingOfficial(null)}
        teamId={team.id}
        teamToken={team.token}
        existingOfficials={team.officials}
        official={editingOfficial}
        onOfficialUpdated={handleOfficialUpdated}
      />

      <DeleteOfficialDialog
        open={!!deletingOfficial}
        onOpenChange={(open) => !open && setDeletingOfficial(null)}
        official={deletingOfficial}
        teamToken={team.token}
        onOfficialDeleted={handleOfficialDeleted}
      />
    </div>
  );
}