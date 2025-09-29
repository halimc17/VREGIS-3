'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shirt } from 'lucide-react';
import { TypographyMuted } from '@/components/ui/typography';

const jerseySchema = z.object({
  warnaJersey1: z.string().optional(),
  warnaJersey2: z.string().optional(),
  warnaJersey3: z.string().optional(),
});

type JerseyFormData = z.infer<typeof jerseySchema>;

interface TeamJersey {
  id: string;
  warnaJersey1: string | null;
  warnaJersey2: string | null;
  warnaJersey3: string | null;
}

interface JerseyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamToken: string;
  jersey?: TeamJersey | null;
  onJerseyAdded?: () => void;
  onJerseyUpdated?: () => void;
}

export default function JerseyFormDialog({
  open,
  onOpenChange,
  teamId,
  teamToken,
  jersey,
  onJerseyAdded,
  onJerseyUpdated,
}: JerseyFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!jersey;

  const form = useForm<JerseyFormData>({
    resolver: zodResolver(jerseySchema),
    defaultValues: {
      warnaJersey1: jersey?.warnaJersey1 || '',
      warnaJersey2: jersey?.warnaJersey2 || '',
      warnaJersey3: jersey?.warnaJersey3 || '',
    },
  });

  const onSubmit = async (data: JerseyFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing
        ? `/api/public/teams/${teamToken}/jerseys/${jersey.id}`
        : `/api/public/teams/${teamToken}/jerseys`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          warnaJersey1: data.warnaJersey1 || null,
          warnaJersey2: data.warnaJersey2 || null,
          warnaJersey3: data.warnaJersey3 || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan data jersey');
      }

      toast.success(isEditing ? 'Data jersey berhasil diperbarui!' : 'Data jersey berhasil ditambahkan!');

      if (isEditing && onJerseyUpdated) {
        onJerseyUpdated();
      } else if (!isEditing && onJerseyAdded) {
        onJerseyAdded();
      }

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving jersey:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan data jersey');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      form.reset({
        warnaJersey1: jersey?.warnaJersey1 || '',
        warnaJersey2: jersey?.warnaJersey2 || '',
        warnaJersey3: jersey?.warnaJersey3 || '',
      });
    } else {
      form.reset();
    }
  }, [open, jersey, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            {isEditing ? 'Edit Data Jersey' : 'Tambah Data Jersey'}
          </DialogTitle>
          <DialogDescription>
            Masukkan informasi warna jersey yang akan digunakan tim pada turnamen.
            <br />
            <span className="text-xs mt-2 text-amber-600 block">
              * Kosongkan jika tidak ada data jersey
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Warna Jersey 1 */}
            <div className="space-y-2">
              <Label htmlFor="warnaJersey1">Warna Jersey 1</Label>
              <Input
                id="warnaJersey1"
                placeholder="Contoh: Biru"
                {...form.register('warnaJersey1')}
                className="w-full"
              />
            </div>

            {/* Warna Jersey 2 */}
            <div className="space-y-2">
              <Label htmlFor="warnaJersey2">Warna Jersey 2</Label>
              <Input
                id="warnaJersey2"
                placeholder="Contoh: Putih"
                {...form.register('warnaJersey2')}
                className="w-full"
              />
            </div>

            {/* Warna Jersey 3 */}
            <div className="space-y-2">
              <Label htmlFor="warnaJersey3">Warna Jersey 3</Label>
              <Input
                id="warnaJersey3"
                placeholder="Contoh: Merah"
                {...form.register('warnaJersey3')}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Menyimpan...' : (isEditing ? 'Perbarui' : 'Simpan')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}