'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Tournament, Team } from '@/types';

interface EditTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  tournaments: Tournament[];
  onTeamUpdated: () => void;
}

interface FormData {
  name: string;
  gender: 'putra' | 'putri' | '';
  tournamentId: string;
  logo?: File;
}

export default function EditTeamDialog({ open, onOpenChange, team, tournaments, onTeamUpdated }: EditTeamDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: '',
    tournamentId: '',
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (team && open) {
      setFormData({
        name: team.name,
        gender: team.gender,
        tournamentId: team.tournament?.id || '',
      });
      setLogoPreview(team.logo || null);
    }
  }, [team, open]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!team) return;

    if (!formData.name.trim()) {
      toast.error('Nama tim harus diisi');
      return;
    }

    if (!formData.gender) {
      toast.error('Gender harus dipilih');
      return;
    }

    if (!formData.tournamentId) {
      toast.error('Tournament harus dipilih');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('gender', formData.gender);
      submitData.append('tournamentId', formData.tournamentId);

      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }

      const response = await fetch(`/api/teams/${team.id}`, {
        method: 'PUT',
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Tim berhasil diperbarui!');
        onTeamUpdated();
        resetForm();
      } else {
        toast.error(data.error || 'Gagal memperbarui tim');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Terjadi kesalahan saat memperbarui tim');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gender: '',
      tournamentId: '',
    });
    setLogoPreview(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit tim</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Tim</Label>
            <Input
              id="name"
              placeholder="Masukkan nama tim"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="putra">Putra</SelectItem>
                  <SelectItem value="putri">Putri</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tournament">Tournament</Label>
              <Select
                value={formData.tournamentId}
                onValueChange={(value) => handleInputChange('tournamentId', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tournament" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.filter(tournament => tournament.status === 'open').length === 0 ? (
                    <SelectItem value="" disabled>
                      Tidak ada tournament tersedia
                    </SelectItem>
                  ) : (
                    tournaments.filter(tournament => tournament.status === 'open').map((tournament) => (
                      <SelectItem key={tournament.id} value={tournament.id}>
                        {tournament.name} ({tournament.category})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo Tim (Opsional)</Label>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="h-12 w-12 object-cover rounded border" />
                ) : (
                  <div className="h-12 w-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="logo"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Pilih File
                </label>
                <input
                  id="logo"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, GIF. Max 5MB
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Perbarui Tim
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}