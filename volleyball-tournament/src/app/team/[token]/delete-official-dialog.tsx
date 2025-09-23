'use client';

import { useState } from 'react';
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
import { toast } from 'sonner';

interface Official {
  id: string;
  namaLengkap: string;
  posisi: string;
  nomorTelepon: string;
  fotoOfficial: string | null;
  createdAt: Date;
}

interface DeleteOfficialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  official: Official | null;
  teamToken: string;
  onOfficialDeleted: () => void;
}

export default function DeleteOfficialDialog({
  open,
  onOpenChange,
  official,
  teamToken,
  onOfficialDeleted
}: DeleteOfficialDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!official) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/public/teams/${teamToken}/officials/${official.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onOfficialDeleted();
        onOpenChange(false);
        toast.success('Official berhasil dihapus dari tim!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Gagal menghapus official');
      }
    } catch (error) {
      console.error('Error deleting official:', error);
      toast.error('Gagal menghapus official');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Official</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus{' '}
            <span className="font-semibold">{official?.namaLengkap}</span>{' '}
            dari daftar official tim? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus Official'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}