'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface Player {
  id: string;
  namaLengkap: string;
  noJersey: number;
}

interface DeletePlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  teamToken: string;
  onPlayerDeleted: () => void;
}

export default function DeletePlayerDialog({
  open,
  onOpenChange,
  player,
  teamToken,
  onPlayerDeleted
}: DeletePlayerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!player) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/public/teams/${teamToken}/players/${player.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onPlayerDeleted();
        onOpenChange(false);
      } else {
        const error = await response.json();
        toast.error('Gagal menghapus atlet', {
          description: error.error || 'Terjadi kesalahan saat menghapus data atlet.'
        });
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error('Terjadi kesalahan', {
        description: 'Tidak dapat menghubungi server. Silakan coba lagi.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Atlet</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus atlet{' '}
            <span className="font-semibold">{player?.namaLengkap}</span>{' '}
            (#{player?.noJersey}) dari tim? Aksi ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus Atlet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}