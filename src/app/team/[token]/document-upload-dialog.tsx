'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TypographyH4, TypographyMuted } from '@/components/ui/typography';
import { Upload, Loader2, FileText, X } from 'lucide-react';

interface Player {
  id: string;
  namaLengkap: string;
}

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player;
  teamToken: string;
  onDocumentUploaded?: () => void;
}

const DOCUMENT_TYPES = [
  'Akte Kelahiran',
  'Ijasah/Raport',
  'NISN',
  'Kartu Keluarga',
  'KTP/SIM',
  'Lainnya'
] as const;

type DocumentType = typeof DOCUMENT_TYPES[number];

export default function DocumentUploadDialog({
  open,
  onOpenChange,
  player,
  teamToken,
  onDocumentUploaded,
}: DocumentUploadDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [customDocumentType, setCustomDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const resetForm = () => {
    setDocumentType('');
    setCustomDocumentType('');
    setSelectedFile(null);
    setDragActive(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Hanya file gambar (JPG, PNG) atau PDF yang diperbolehkan');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error('Ukuran file tidak boleh lebih dari 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentType) {
      toast.error('Pilih tipe dokumen terlebih dahulu');
      return;
    }

    if (documentType === 'Lainnya' && !customDocumentType.trim()) {
      toast.error('Masukkan nama tipe dokumen untuk pilihan "Lainnya"');
      return;
    }

    if (!selectedFile) {
      toast.error('Pilih file dokumen terlebih dahulu');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('playerId', player?.id || '');
      formData.append('documentType', documentType);
      if (documentType === 'Lainnya') {
        formData.append('customDocumentType', customDocumentType.trim());
      }

      const response = await fetch(`/api/public/teams/${teamToken}/players/${player?.id || ''}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengunggah dokumen');
      }

      toast.success('Dokumen berhasil diunggah!');
      onDocumentUploaded?.();
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mengunggah dokumen');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Dokumen Atlet</DialogTitle>
          <DialogDescription>
            Upload dokumen untuk <span className="font-medium">{player?.namaLengkap || ''}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="documentType">Tipe Dokumen</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe dokumen" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Document Type Input - shown when "Lainnya" is selected */}
          {documentType === 'Lainnya' && (
            <div className="space-y-2">
              <Label htmlFor="customDocumentType">Nama Tipe Dokumen</Label>
              <Input
                id="customDocumentType"
                value={customDocumentType}
                onChange={(e) => setCustomDocumentType(e.target.value)}
                placeholder="Masukkan nama tipe dokumen"
                required
              />
              <TypographyMuted className="!text-sm">
                Contoh: Surat Keterangan, Kartu Pelajar, dll.
              </TypographyMuted>
            </div>
          )}

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>File Dokumen</Label>

            {!selectedFile ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                } hover:border-primary/50 hover:bg-primary/5`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <TypographyH4 className="!text-base">
                      Upload file dokumen
                    </TypographyH4>
                    <TypographyMuted className="!text-sm">
                      Klik untuk memilih file atau drag & drop ke sini
                    </TypographyMuted>
                    <TypographyMuted className="!text-xs">
                      Format: JPG, PNG, PDF • Maksimal 10MB
                    </TypographyMuted>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeSelectedFile}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Dokumen
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}