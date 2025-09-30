'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Trophy, Calendar, MapPin, Users, MoreHorizontal } from 'lucide-react';
import { TournamentForm } from './tournament-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showConfirmToast } from '@/components/ui/toast-confirm';
import { toast } from 'sonner';

interface Tournament {
  id: string;
  name: string;
  category: 'putra' | 'putri' | 'mixed';
  status: 'open' | 'closed';
  location: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxPlayersPerTeam: number;
  poolsPutra: number;
  poolsPutri: number;
  teamCount: number;
  putraTeams: number;
  putriTeams: number;
  createdAt: string;
  updatedAt: string;
}

export function TournamentManagement() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments');
      if (response.ok) {
        const data = await response.json();
        setTournaments(data.tournaments || []);
      } else {
        console.error('Failed to fetch tournaments');
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = () => {
    setSelectedTournament(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEditTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDeleteTournament = (tournamentId: string, tournamentName: string) => {
    showConfirmToast({
      title: 'Hapus Turnamen',
      description: `Apakah Anda yakin ingin menghapus "${tournamentName}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/tournaments/${tournamentId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setTournaments(tournaments.filter(tournament => tournament.id !== tournamentId));
            toast.success('Turnamen berhasil dihapus');
          } else {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Gagal menghapus turnamen';

            if (contentType?.includes('application/json')) {
              try {
                const error = await response.json();
                errorMessage = error.error || error.details || errorMessage;
              } catch {
                errorMessage = `Server error (${response.status})`;
              }
            } else {
              errorMessage = `Server error (${response.status})`;
            }

            toast.error(errorMessage);
          }
        } catch (error) {
          console.error('Error deleting tournament:', error);
          toast.error('Gagal menghapus turnamen');
        }
      }
    });
  };

  const handleTournamentSaved = () => {
    setIsDialogOpen(false);
    fetchTournaments();
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'putra':
        return 'default';
      case 'putri':
        return 'secondary';
      case 'mixed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'open' ? 'default' : 'secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Memuat turnamen...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kelola Turnamen</h2>
          <p className="text-muted-foreground">
            Buat dan kelola turnamen bola voli
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateTournament}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Turnamen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[50vw] w-[50vw] max-h-[90vh] overflow-y-auto" style={{ width: '50vw', maxWidth: '50vw' }}>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === 'create' ? 'Buat Turnamen Baru' : 'Edit Turnamen'}
              </DialogTitle>
            </DialogHeader>
            <TournamentForm
              tournament={selectedTournament}
              mode={dialogMode}
              onSaved={handleTournamentSaved}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Turnamen ({tournaments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tournaments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada turnamen ditemukan. Buat turnamen pertama Anda untuk memulai.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turnamen</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Pool</TableHead>
                    <TableHead className="text-center">Maks Pemain</TableHead>
                    <TableHead>Tim Terdaftar</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournaments.map((tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tournament.name}</div>
                          {tournament.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {tournament.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCategoryBadgeVariant(tournament.category)}>
                          {tournament.category.charAt(0).toUpperCase() + tournament.category.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(tournament.status)}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{tournament.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Reg: {formatDateTime(tournament.registrationDeadline)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {tournament.poolsPutra > 0 && (
                            <div>Putra: {tournament.poolsPutra}</div>
                          )}
                          {tournament.poolsPutri > 0 && (
                            <div>Putri: {tournament.poolsPutri}</div>
                          )}
                          {tournament.poolsPutra === 0 && tournament.poolsPutri === 0 && (
                            <div className="text-muted-foreground">Tidak ada pool</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">{tournament.maxPlayersPerTeam}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="font-medium">Total: {tournament.teamCount || 0}</span>
                          </div>
                          {tournament.category === 'mixed' ? (
                            <div className="space-y-0.5">
                              <div className="text-xs">Putra: {tournament.putraTeams || 0}</div>
                              <div className="text-xs">Putri: {tournament.putriTeams || 0}</div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              {tournament.category === 'putra' ? 'Putra' : 'Putri'}: {tournament.teamCount || 0}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTournament(tournament)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Turnamen
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteTournament(tournament.id, tournament.name)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus Turnamen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}