'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Team } from '@/types';

interface DeleteTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  onTeamDeleted: () => void;
}

export default function DeleteTeamDialog({ open, onOpenChange, team, onTeamDeleted }: DeleteTeamDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!team) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/teams/${team.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Tim berhasil dihapus!');
        onTeamDeleted();
        onOpenChange(false);
      } else {
        toast.error(data.error || 'Gagal menghapus tim');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Terjadi kesalahan saat menghapus tim');
    } finally {
      setLoading(false);
    }
  };

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Hapus tim
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus tim <strong>{team.name}</strong>?
            Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data yang terkait dengan tim ini.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus Tim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}