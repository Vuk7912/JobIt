import { useState } from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastOptions {
  title?: string;
  description?: string;
  action?: any;
  variant?: ToastVariant;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const toast = (options: ToastOptions) => {
    setToasts((prevToasts) => [...prevToasts, options]);
  };

  const dismiss = (toastId: string) => {
    setToasts((prevToasts) => 
      prevToasts.filter((toast) => toast.title !== toastId)
    );
  };

  return { 
    toast, 
    dismiss, 
    toasts 
  };
}