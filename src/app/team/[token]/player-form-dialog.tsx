'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2, ImageIcon } from 'lucide-react';

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
}

interface PlayerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamToken: string;
  teamGender: string;
  existingPlayers: Player[];
  player?: Player | null;
  onPlayerAdded?: () => void;
  onPlayerUpdated?: () => void;
}

export default function PlayerFormDialog({
  open,
  onOpenChange,
  teamId,
  teamToken,
  teamGender,
  existingPlayers,
  player,
  onPlayerAdded,
  onPlayerUpdated
}: PlayerFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaJersey: '',
    noJersey: '',
    position: '',
    gender: '',
    tempatLahir: '',
    tanggalLahir: '',
    tinggi: '',
    berat: '',
    nik: '',
    nisn: '',
    sekolah: '',
    kotaSekolahAsal: '',
    fotoAtlet: null as File | null,
    fotoAtletUrl: ''
  });

  // Reset form when dialog opens/closes or player changes
  useEffect(() => {
    if (open && player) {
      // Editing mode
      setFormData({
        namaLengkap: player.namaLengkap,
        namaJersey: player.namaJersey || '',
        noJersey: player.noJersey.toString(),
        position: player.position,
        gender: teamGender,
        tempatLahir: player.tempatLahir,
        tanggalLahir: new Date(player.tanggalLahir).toISOString().split('T')[0],
        tinggi: player.tinggi ? player.tinggi.toString() : '',
        berat: player.berat ? player.berat.toString() : '',
        nik: player.nik || '',
        nisn: player.nisn || '',
        sekolah: player.sekolah,
        kotaSekolahAsal: player.kotaSekolahAsal,
        fotoAtlet: null,
        fotoAtletUrl: player.fotoAtlet || ''
      });
    } else if (open && !player) {
      // Adding mode
      setFormData({
        namaLengkap: '',
        namaJersey: '',
        noJersey: '',
        position: '',
        gender: teamGender,
        tempatLahir: '',
        tanggalLahir: '',
        tinggi: '',
        berat: '',
        nik: '',
        nisn: '',
        sekolah: '',
        kotaSekolahAsal: '',
        fotoAtlet: null,
        fotoAtletUrl: ''
      });
    }
  }, [open, player, teamGender]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.namaLengkap || !formData.noJersey || !formData.position ||
        !formData.gender || !formData.tempatLahir || !formData.tanggalLahir ||
        !formData.sekolah || !formData.kotaSekolahAsal) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      setIsSubmitting(false);
      return;
    }

    // Validate photo is required for new players
    if (!player && !formData.fotoAtlet) {
      toast.error('Foto atlet wajib diisi');
      setIsSubmitting(false);
      return;
    }

    // Validate jersey number uniqueness
    const jerseyNum = parseInt(formData.noJersey);
    const duplicateJersey = existingPlayers.find(p =>
      p.noJersey === jerseyNum && (!player || p.id !== player.id)
    );
    if (duplicateJersey) {
      toast.error(`Nomor jersey ${jerseyNum} sudah digunakan oleh ${duplicateJersey.namaLengkap}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'fotoAtletUrl' && value !== null && value !== '') {
          submitData.append(key, value as string | File);
        }
      });

      submitData.append('teamId', teamId);

      const url = player
        ? `/api/public/teams/${teamToken}/players/${player.id}`
        : `/api/public/teams/${teamToken}/players`;

      const method = player ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (response.ok) {
        if (player) {
          onPlayerUpdated?.();
        } else {
          onPlayerAdded?.();
        }
        onOpenChange(false);
      } else {
        const error = await response.json();
        toast.error(player ? 'Gagal memperbarui atlet' : 'Gagal menambah atlet', {
          description: error.error || 'Terjadi kesalahan saat menyimpan data.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Terjadi kesalahan', {
        description: 'Tidak dapat menghubungi server. Silakan coba lagi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      fotoAtlet: file,
      fotoAtletUrl: URL.createObjectURL(file)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:!w-[90vw] lg:!w-[80vw] !max-w-none max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">
            {player ? 'Edit Data Atlet' : 'Tambah Atlet Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
          {/* Form Fields in 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-0">
            <div className="space-y-1 min-w-0">
              <Label htmlFor="namaLengkap">Nama Lengkap *</Label>
              <Input
                id="namaLengkap"
                value={formData.namaLengkap}
                onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="namaJersey">Nama Jersey</Label>
              <Input
                id="namaJersey"
                value={formData.namaJersey}
                onChange={(e) => handleInputChange('namaJersey', e.target.value)}
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="noJersey">No. Jersey *</Label>
              <Input
                id="noJersey"
                type="number"
                min="1"
                max="99"
                value={formData.noJersey}
                onChange={(e) => handleInputChange('noJersey', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="position">Posisi *</Label>
              <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih posisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Outside Hitter">Outside Hitter</SelectItem>
                  <SelectItem value="Middle Blocker">Middle Blocker</SelectItem>
                  <SelectItem value="Setter">Setter</SelectItem>
                  <SelectItem value="Libero">Libero</SelectItem>
                  <SelectItem value="Opposite Hitter">Opposite Hitter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="putra">Putra</SelectItem>
                  <SelectItem value="putri">Putri</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="tempatLahir">Tempat Lahir *</Label>
              <Input
                id="tempatLahir"
                value={formData.tempatLahir}
                onChange={(e) => handleInputChange('tempatLahir', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
              <Input
                id="tanggalLahir"
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => handleInputChange('tanggalLahir', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="tinggi">Tinggi (cm)</Label>
              <Input
                id="tinggi"
                type="number"
                min="120"
                max="250"
                value={formData.tinggi}
                onChange={(e) => handleInputChange('tinggi', e.target.value)}
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="berat">Berat (kg)</Label>
              <Input
                id="berat"
                type="number"
                min="30"
                max="200"
                value={formData.berat}
                onChange={(e) => handleInputChange('berat', e.target.value)}
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="nik">NIK (16 digit)</Label>
              <Input
                id="nik"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => handleInputChange('nik', e.target.value)}
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="nisn">NISN (10 digit)</Label>
              <Input
                id="nisn"
                maxLength={10}
                value={formData.nisn}
                onChange={(e) => handleInputChange('nisn', e.target.value)}
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="sekolah">Sekolah *</Label>
              <Input
                id="sekolah"
                value={formData.sekolah}
                onChange={(e) => handleInputChange('sekolah', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1 min-w-0">
              <Label htmlFor="kotaSekolahAsal">Kota Sekolah Asal *</Label>
              <Input
                id="kotaSekolahAsal"
                value={formData.kotaSekolahAsal}
                onChange={(e) => handleInputChange('kotaSekolahAsal', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Photo Upload Section - Moved to Bottom */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formData.fotoAtletUrl} alt="Foto atlet" />
                  <AvatarFallback>
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="fotoAtlet" className="text-sm font-medium">
                  Foto Atlet *
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative"
                    onClick={() => document.getElementById('fotoAtlet')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.fotoAtletUrl ? 'Ganti Foto' : 'Pilih Foto'}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG hingga 5MB
                  </span>
                </div>
                <Input
                  id="fotoAtlet"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!player}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {player ? 'Perbarui Atlet' : 'Tambah Atlet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}