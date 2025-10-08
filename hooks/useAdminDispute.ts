"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  resolveDataDispute,
  resolveWalletDispute,
} from "@/app/actions/admin/dispute.actions";

export function useAdminDispute(onResolved?: () => void) {
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openDispute = (dispute: any) => {
    setSelectedDispute(dispute);
    setIsModalOpen(true);
  };

  const closeDispute = () => {
    setIsModalOpen(false);
    setSelectedDispute(null);
  };

  const handleResolve = async (
    id: string,
    refund: boolean,
    note?: string,
    refundAmount?: number,
    statusOverride?: string
  ) => {
    if (!selectedDispute) return;

    const isWalletFunding = selectedDispute.type === "wallet_funding";

    try {
      setLoading(true);

      const result = isWalletFunding
        ? await resolveWalletDispute(
            id,
            refund,
            note,
            refundAmount,
            statusOverride
          )
        : await resolveDataDispute(id, refund, note);

      if (!result?.success)
        throw new Error(result?.message || "Unexpected error");

      toast.success(result.message);

      // 🔁 Refresh parent (if provided)
      if (onResolved) await onResolved();

      closeDispute();
    } catch (err: any) {
      toast.error(err.message || "Failed to resolve dispute.");
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedDispute,
    isModalOpen,
    loading,
    openDispute,
    closeDispute,
    handleResolve,
  };
}
