// components/ui/ConfirmDialog.tsx
"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import Button from "../ui/Button";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-[60]"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#1a1a24] rounded-xl border border-white/10 shadow-lg max-w-sm w-full p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-[#f8f8f2]">{title}</h3>
            <button onClick={() => setOpen(false)}>
              <X size={18} className="text-[#aaa]" />
            </button>
          </div>

          <p className="text-sm text-[#ccc] mb-5">{message}</p>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
              className="text-[#aaa] hover:text-white"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="bg-[var(--primary-color)]/20 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/30"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
