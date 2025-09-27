'use client';

import { toast } from 'sonner';
import { Button } from './button';

interface ToastConfirmProps {
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function showConfirmToast({
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive'
}: ToastConfirmProps) {
  toast(title, {
    description,
    position: 'top-center',
    duration: 10000,
    action: {
      label: confirmText,
      onClick: async () => {
        try {
          await onConfirm();
        } catch (error) {
          console.error('Error in confirmation action:', error);
        }
      },
    },
    cancel: {
      label: cancelText,
      onClick: () => {
        // Just dismiss the toast
      },
    },
    className: variant === 'destructive' ? 'border-destructive' : '',
  });
}