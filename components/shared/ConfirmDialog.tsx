"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (email?: string) => void;
  onCancel: () => void;
  requireEmailInput?: boolean;
  defaultEmail?: string;
  loading?: boolean; // ✅ new optional prop
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  requireEmailInput = false,
  defaultEmail = "",
  loading = false, // ✅ default false
}: ConfirmDialogProps) {
  const [inputEmail, setInputEmail] = useState(defaultEmail);

  // Reset input whenever dialog opens
  useEffect(() => {
    if (isOpen) setInputEmail(""); // clear field
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireEmailInput && !inputEmail.trim()) return;
    onConfirm(requireEmailInput ? inputEmail.trim() : undefined);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="bg-[var(--card-background-color)]/100 p-6 rounded-xl w-[90%] max-w-md border border-white/20 shadow-2xl space-y-5">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-red-500 w-6 h-6 flex-shrink-0" />
          <h2 className="text-lg font-bold text-red-500">{title}</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>

        {requireEmailInput && (
          <input
            type="email"
            placeholder="Enter user email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        )}

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-white/20 text-sm text-[var(--text-secondary)] hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (requireEmailInput && !inputEmail.trim())}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
