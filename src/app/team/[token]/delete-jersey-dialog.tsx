'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface TeamJersey {
  id: string;
  warnaJersey1: string | null;
  warnaJersey2: string | null;
  warnaJersey3: string | null;
}

interface DeleteJerseyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jersey: TeamJersey | null;
  teamToken: string;
  onJerseyDeleted: () => void;
}

export default function DeleteJerseyDialog({
  open,
  onOpenChange,
  jersey,
  teamToken,
  onJerseyDeleted,
}: DeleteJerseyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!jersey) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/public/teams/${teamToken}/jerseys/${jersey.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus data jersey');
      }

      toast.success('Data jersey berhasil dihapus!');
      onJerseyDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting jersey:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus data jersey');
    } finally {
      setIsLoading(false);
    }
  };

  if (!jersey) return null;

  const getJerseyInfo = () => {
    const jerseys = [];
    if (jersey.warnaJersey1) jerseys.push(`Jersey Utama (${jersey.warnaJersey1})`);
    if (jersey.warnaJersey2) jerseys.push(`Jersey Kedua (${jersey.warnaJersey2})`);
    if (jersey.warnaJersey3) jerseys.push(`Jersey Ketiga (${jersey.warnaJersey3})`);
    return jerseys.join(', ');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Jersey</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus semua data jersey tim ini?
            <br />
            <span className="font-medium text-foreground mt-2 block">
              Data yang akan dihapus: {getJerseyInfo()}
            </span>
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}