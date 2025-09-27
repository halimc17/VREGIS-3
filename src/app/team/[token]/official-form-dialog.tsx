'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Upload, Loader2, ImageIcon } from 'lucide-react';

interface Official {
  id: string;
  namaLengkap: string;
  posisi: string;
  nomorTelepon: string;
  fotoOfficial: string | null;
  createdAt: Date;
}

interface OfficialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamToken: string;
  existingOfficials: Official[];
  official?: Official | null;
  onOfficialAdded?: () => void;
  onOfficialUpdated?: () => void;
}

const OFFICIAL_POSITIONS = [
  'Manager',
  'Head Coach',
  'Assistant Coach 1',
  'Assistant Coach 2'
];

export default function OfficialFormDialog({
  open,
  onOpenChange,
  teamId,
  teamToken,
  existingOfficials,
  official,
  onOfficialAdded,
  onOfficialUpdated
}: OfficialFormDialogProps) {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    posisi: '',
    nomorTelepon: '',
    fotoOfficial: null as File | null,
    fotoOfficialUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!official;

  useEffect(() => {
    if (open && official) {
      setFormData({
        namaLengkap: official.namaLengkap,
        posisi: official.posisi,
        nomorTelepon: official.nomorTelepon,
        fotoOfficial: null,
        fotoOfficialUrl: official.fotoOfficial || ''
      });
    } else if (open && !official) {
      setFormData({
        namaLengkap: '',
        posisi: '',
        nomorTelepon: '',
        fotoOfficial: null,
        fotoOfficialUrl: ''
      });
    }
  }, [official, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          fotoOfficial: file,
          fotoOfficialUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvailablePositions = () => {
    if (isEditing) {
      // When editing, include current position even if it's already taken
      const usedPositions = existingOfficials
        .filter(o => o.id !== official?.id)
        .map(o => o.posisi);
      return OFFICIAL_POSITIONS.filter(pos => !usedPositions.includes(pos));
    } else {
      // When adding new, exclude all used positions
      const usedPositions = existingOfficials.map(o => o.posisi);
      return OFFICIAL_POSITIONS.filter(pos => !usedPositions.includes(pos));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaLengkap.trim() || !formData.posisi || !formData.nomorTelepon.trim()) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('namaLengkap', formData.namaLengkap.trim());
      formDataToSend.append('posisi', formData.posisi);
      formDataToSend.append('nomorTelepon', formData.nomorTelepon.trim());

      if (formData.fotoOfficial) {
        formDataToSend.append('fotoOfficial', formData.fotoOfficial);
      }

      const url = isEditing
        ? `/api/public/teams/${teamToken}/officials/${official.id}`
        : `/api/public/teams/${teamToken}/officials`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        if (isEditing) {
          onOfficialUpdated?.();
        } else {
          onOfficialAdded?.();
        }
        onOpenChange(false);
      } else {
        const error = await response.json();
        toast.error(error.error || `Gagal ${isEditing ? 'memperbarui' : 'menambahkan'} official`);
      }
    } catch (error) {
      console.error('Error submitting official:', error);
      toast.error(`Gagal ${isEditing ? 'memperbarui' : 'menambahkan'} official`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availablePositions = getAvailablePositions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Official' : 'Tambah Official Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-full">
          {/* Nama Lengkap */}
          <div className="space-y-2 w-full">
            <Label htmlFor="namaLengkap">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="namaLengkap"
              value={formData.namaLengkap}
              onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
              placeholder="Nama lengkap official"
              required
              className="w-full"
            />
          </div>

          {/* Posisi */}
          <div className="space-y-2 w-full">
            <Label htmlFor="posisi">
              Posisi <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.posisi}
              onValueChange={(value) => handleInputChange('posisi', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih posisi official" />
              </SelectTrigger>
              <SelectContent>
                {availablePositions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availablePositions.length === 0 && (
              <p className="text-sm text-red-500">
                Semua posisi official sudah terisi
              </p>
            )}
          </div>

          {/* Nomor Telepon/WhatsApp */}
          <div className="space-y-2 w-full">
            <Label htmlFor="nomorTelepon">
              Nomor Telepon/WhatsApp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nomorTelepon"
              value={formData.nomorTelepon}
              onChange={(e) => handleInputChange('nomorTelepon', e.target.value)}
              placeholder="Nomor telepon atau WhatsApp"
              required
              className="w-full"
            />
          </div>

          {/* Photo Upload Section */}
          <div className="border-t pt-4 w-full">
            <div className="flex items-center gap-4 w-full max-w-full">
              <div className="flex-shrink-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formData.fotoOfficialUrl} alt="Foto official" />
                  <AvatarFallback>
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0 space-y-1 overflow-hidden">
                <Label htmlFor="fotoOfficial" className="text-sm font-medium">
                  Foto Official
                </Label>
                <div className="flex flex-col gap-2 max-w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative flex-shrink-0 w-fit"
                    onClick={() => document.getElementById('fotoOfficial')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.fotoOfficialUrl ? 'Ganti Foto' : 'Pilih Foto'}
                  </Button>
                  <span className="text-xs text-muted-foreground break-words">
                    PNG, JPG hingga 5MB
                  </span>
                </div>
                <Input
                  id="fotoOfficial"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-shrink-0"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || availablePositions.length === 0}
              className="flex-shrink-0"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Perbarui Official' : 'Simpan Official'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}