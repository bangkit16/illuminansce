"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  type?: "success" | "info" | "warning";
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

type ToastContextValue = {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration ?? 4000;
      setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Pemberitahuan sistem"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl bg-il-dark-surface/95 border border-il-dark-border text-il-ink-on-dark shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* Gambar item jika ada */}
          {toast.image ? (
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-il-dark-bg border border-il-dark-border shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={toast.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-il-accent/15 text-il-accent flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Konten teks */}
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-semibold text-xs text-il-ink-on-dark truncate">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="font-body text-[11px] text-il-ink-on-dark/60 truncate mt-0.5">
                {toast.description}
              </p>
            )}
            {toast.actionLabel && toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  onDismiss(toast.id);
                }}
                className="text-[11px] font-semibold text-il-accent hover:underline mt-1 block cursor-pointer"
              >
                {toast.actionLabel} &rarr;
              </button>
            )}
          </div>

          {/* Tombol tutup */}
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Tutup notifikasi"
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-il-ink-on-dark/50 hover:text-il-ink-on-dark transition-colors cursor-pointer shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
