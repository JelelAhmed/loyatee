"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, ShieldCheck, ShieldX, Clock, Wallet } from "lucide-react";
import Button from "../ui/Button";
import ConfirmDialog from "./ConfirmDialog";

interface AdminDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispute: {
    id: string;
    user_email?: string;
    dispute_type?: string;
    dispute_note?: string;
    status: string;
    amount: string;
    type: string; // "data_purchase" | "wallet_funding"
    phone_number?: string;
    network_name?: string;
    created_at?: string;
    vendor_response?: any;
    payment_method?: string;
    payment_reference?: string;
    error_message?: string;
  } | null;
  onResolve?: (
    id: string,
    refund: boolean,
    note?: string,
    refundAmount?: number,
    statusOverride?: string
  ) => Promise<void>;
}

export default function AdminDisputeModal({
  isOpen,
  onClose,
  dispute,
  onResolve,
}: AdminDisputeModalProps) {
  const [adminNote, setAdminNote] = useState("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundError, setRefundError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [actionDone, setActionDone] = useState<
    null | "refunded" | "rejected" | "pending"
  >(null);
  const [confirmAction, setConfirmAction] = useState<null | {
    type: "refund" | "reject" | "pending";
  }>(null);

  // Reset modal state whenever it closes or a new dispute is opened
  useEffect(() => {
    if (!isOpen) {
      setConfirmAction(null);
      setActionDone(null);
      setAdminNote("");
      setRefundAmount("");
      setRefundError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Also reset when a different dispute is loaded (prevents old action popup)
  useEffect(() => {
    setConfirmAction(null);
    setActionDone(null);
    setAdminNote("");
    setRefundAmount("");
    setRefundError(null);
    setLoading(false);
  }, [dispute?.id]);

  if (!dispute) return null;

  const isWalletFunding = dispute.type === "wallet_funding";
  const isDataPurchase = dispute.type === "data_purchase";

  const handleRefundInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRefundAmount(value);

    const num = parseFloat(value);
    const max = parseFloat(dispute.amount);

    if (num > max) {
      setRefundError(`Refund cannot exceed ₦${max.toLocaleString()}`);
    } else {
      setRefundError(null);
    }
  };

  const handleAction = async (
    type: "refund" | "reject" | "pending"
  ): Promise<void> => {
    if (!onResolve) return;

    // ✅ Safety check before running refund
    if (type === "refund" && refundAmount) {
      const num = parseFloat(refundAmount);
      const max = parseFloat(dispute.amount);
      if (num > max) {
        setRefundError(`Refund cannot exceed ₦${max.toLocaleString()}`);
        return;
      }
    }

    setLoading(true);
    const isRefund = type === "refund";
    const statusOverride = type === "pending" ? "pending_review" : undefined;

    await onResolve(
      dispute.id,
      isRefund,
      adminNote,
      refundAmount ? parseFloat(refundAmount) : undefined,
      statusOverride
    );

    setLoading(false);
    setActionDone(
      isRefund ? "refunded" : type === "pending" ? "pending" : "rejected"
    );

    setTimeout(() => onClose(), 1800);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#1a1a24] text-[#f8f8f2] rounded-xl shadow-2xl max-w-2xl w-full border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="text-[var(--primary-color)] h-5 w-5" />
              {isWalletFunding
                ? "Wallet Funding Dispute"
                : "Data Purchase Dispute"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-md transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            {/* Transaction Summary */}
            <section>
              <h4 className="text-sm uppercase text-[#999] mb-2 font-semibold">
                Transaction Summary
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <Info label="User" value={dispute.user_email} />
                <Info label="Amount" value={`₦${dispute.amount}`} />
                <Info label="Status" value={dispute.status} capitalize />
                <Info
                  label="Date"
                  value={
                    dispute.created_at
                      ? new Date(dispute.created_at).toLocaleString("en-NG")
                      : "—"
                  }
                />

                {isDataPurchase && (
                  <>
                    <Info label="Phone" value={dispute.phone_number} />
                    <Info label="Network" value={dispute.network_name} />
                  </>
                )}

                {/* {isWalletFunding && (
                  <>
                    <Info
                      label="Payment Method"
                      value={dispute.payment_method ?? "—"}
                    />
                    <Info
                      label="Reference"
                      value={dispute.payment_reference ?? "—"}
                    />
                    <Info
                      label="Error Message"
                      value={
                        dispute.error_message ? dispute.error_message : "—"
                      }
                    />
                  </>
                )} */}
              </div>
            </section>

            {/* User Complaint */}
            {(dispute.dispute_type || dispute.dispute_note) && (
              <section>
                <h4 className="text-sm uppercase text-[#999] mb-2 font-semibold">
                  User Complaint
                </h4>
                <div className="bg-[#222233] p-4 rounded-lg border border-white/10 space-y-2 text-sm">
                  <p>
                    <span className="text-[#999] font-medium">Type:</span>{" "}
                    {dispute.dispute_type ?? "N/A"}
                  </p>
                  <p>
                    <span className="text-[#999] font-medium">Note:</span>{" "}
                    {dispute.dispute_note ?? "—"}
                  </p>
                </div>
              </section>
            )}

            {/* Vendor Response – unchanged for data purchase */}
            {isDataPurchase && dispute.vendor_response && (
              <DataVendorResponse vendorResponse={dispute.vendor_response} />
            )}

            {/* Wallet Vendor Response */}
            {isWalletFunding && dispute.vendor_response && (
              <WalletVendorResponse vendorResponse={dispute.vendor_response} />
            )}

            {/* Wallet Refund Controls */}
            {isWalletFunding && (
              <section>
                <h4 className="text-sm uppercase text-[#999] mb-2 font-semibold">
                  Refund / Adjustment
                </h4>
                <div className="bg-[#222233] p-4 rounded-lg border border-white/10 space-y-3 text-sm">
                  <label className="block text-[#aaa] text-xs mb-1">
                    Partial Refund Amount (optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={refundAmount}
                    onChange={handleRefundInput}
                    placeholder={`e.g. ${dispute.amount}`}
                    className={`w-full bg-[#12121a] border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                      refundError
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-white/10 focus:ring-[var(--primary-color)]"
                    }`}
                  />
                  {refundError ? (
                    <p className="text-xs text-red-400">{refundError}</p>
                  ) : (
                    <p className="text-xs text-[#888]">
                      Leave blank to refund full amount (₦{dispute.amount})
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Admin Resolution Note */}
            <section>
              <h4 className="text-sm uppercase text-[#999] mb-2 font-semibold">
                Resolution Note (optional)
              </h4>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add your decision or internal note..."
                className="w-full bg-[#12121a] border border-white/10 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                rows={3}
              />
            </section>
          </div>

          {/* Success Message */}
          {actionDone && (
            <div
              className={`text-center py-3 rounded-md ${
                actionDone === "refunded"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : actionDone === "pending"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {actionDone === "refunded"
                ? "✅ Dispute resolved — refund issued."
                : actionDone === "pending"
                ? "🕓 Dispute marked as pending review."
                : "❌ Dispute rejected successfully."}
            </div>
          )}

          {/* Footer */}
          <div
            className="
							flex flex-wrap sm:flex-nowrap 
							items-center justify-end sm:justify-between 
							gap-2 sm:gap-3 
							border-t border-white/10 
							px-4 sm:px-6 py-3 sm:py-4 
							bg-white/5
						"
          >
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirmAction({ type: "reject" })}
                disabled={loading}
                className="flex-1 sm:flex-none text-xs sm:text-sm py-2 sm:py-2.5
        bg-red-500/20 text-red-400 hover:bg-red-500/30
        flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <ShieldX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Reject
              </Button>

              <Button
                variant="primary"
                onClick={() => setConfirmAction({ type: "pending" })}
                disabled={loading}
                className="flex-1 sm:flex-none text-xs sm:text-sm py-2 sm:py-2.5
        bg-amber-500/20 text-amber-400 hover:bg-amber-500/30
        flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Pending
              </Button>

              <Button
                onClick={() => setConfirmAction({ type: "refund" })}
                disabled={loading || !!refundError}
                className="flex-1 sm:flex-none text-xs sm:text-sm py-2 sm:py-2.5
        bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30
        flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Refund
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>

      {/* Confirm dialog */}
      {confirmAction && (
        <ConfirmDialog
          title={
            confirmAction.type === "refund"
              ? "Confirm Refund Action"
              : confirmAction.type === "pending"
              ? "Mark as Pending Review?"
              : "Reject Dispute?"
          }
          message={
            confirmAction.type === "refund"
              ? "Are you sure you want to refund this user's transaction?"
              : confirmAction.type === "pending"
              ? "This will mark the dispute as pending review. Continue?"
              : "Are you sure you want to reject this dispute? This cannot be undone."
          }
          confirmText={
            confirmAction.type === "refund"
              ? "Yes, Refund"
              : confirmAction.type === "pending"
              ? "Yes, Mark Pending"
              : "Yes, Reject"
          }
          cancelText="Cancel"
          onConfirm={() => handleAction(confirmAction.type)}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </Dialog>
  );
}

/* Helper Components */
function Info({
  label,
  value,
  capitalize,
}: {
  label: string;
  value?: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <span className="text-[#777] block">{label}</span>
      <span className={capitalize ? "capitalize" : ""}>{value ?? "—"}</span>
    </div>
  );
}

/* Vendor response for data purchase parsed and beautify */
function DataVendorResponse({ vendorResponse }: { vendorResponse: any }) {
  <section>
    <h4 className="text-sm uppercase text-[#999] mb-2 font-semibold">
      Vendor Response
    </h4>

    {(() => {
      const vr = vendorResponse.vendor_response;

      // --- Grouping Logic ---
      const deliveryInfo = {
        mobile_number: vr.mobile_number,
        plan_name: vr.plan_name,
        plan_code: vr.plan_code,
        amount: vr.amount,
        create_date: vr.create_date,
      };

      const responseDetails = {
        status: vr.status || vr.Status,
        api_response: vr.api_response,
        message: vr.message,
        result: vr.result,
        response_code: vr.response_code,
      };

      const metaData = {
        reference: vr.reference,
        transaction_id: vr.transaction_id,
        vendor_ref: vr.vendor_ref,
        server_time: vr.server_time,
      };

      const usedKeys = new Set([
        ...Object.keys(deliveryInfo),
        ...Object.keys(responseDetails),
        ...Object.keys(metaData),
      ]);

      const otherInfo = Object.entries(vr).filter(
        ([key]) => !usedKeys.has(key)
      );

      const renderGroup = (title: string, obj: Record<string, any>) => {
        const entries = Object.entries(obj).filter(([_, v]) => v !== undefined);
        if (!entries.length) return null;

        return (
          <div className="bg-[#12121a] border border-white/10 rounded-lg p-4 mb-4">
            <h5 className="text-xs text-[#aaa] uppercase mb-2 tracking-wide">
              {title}
            </h5>
            <div className="space-y-2 text-sm">
              {entries.map(([key, value]) => {
                const label = key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());
                let displayValue: React.ReactNode = "—";
                const lowerValue =
                  typeof value === "string" ? value.toLowerCase() : "";

                if (value === null || value === undefined) displayValue = "—";
                else if (
                  typeof value === "string" &&
                  /\d{4}-\d{2}-\d{2}t\d{2}:\d{2}/i.test(value)
                ) {
                  displayValue = new Date(value).toLocaleString("en-NG");
                } else if (typeof value === "boolean") {
                  displayValue = value ? "Yes" : "No";
                } else if (
                  ["success", "successful", "completed"].includes(lowerValue)
                ) {
                  displayValue = (
                    <span className="text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md text-xs">
                      {String(value)}
                    </span>
                  );
                } else if (["failed", "error"].includes(lowerValue)) {
                  displayValue = (
                    <span className="text-red-400 bg-red-500/20 px-2 py-0.5 rounded-md text-xs">
                      {String(value)}
                    </span>
                  );
                } else if (["pending", "processing"].includes(lowerValue)) {
                  displayValue = (
                    <span className="text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md text-xs">
                      {String(value)}
                    </span>
                  );
                } else if (typeof value === "object") {
                  displayValue = (
                    <pre className="text-[#bbb] text-xs bg-black/20 p-2 rounded-md overflow-x-auto max-h-24">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  );
                } else {
                  displayValue = String(value);
                }

                return (
                  <div
                    key={key}
                    className="flex justify-between items-start gap-4 border-b border-white/5 pb-2 last:border-0"
                  >
                    <span className="text-[#999] font-medium w-1/3 break-words">
                      {label}
                    </span>
                    <span className="text-[#e0e0e0] w-2/3 break-words text-right">
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      };

      return (
        <div className="space-y-4">
          {renderGroup("Delivery Info", deliveryInfo)}
          {renderGroup("Response Details", responseDetails)}
          {renderGroup("Meta Data", metaData)}
          {otherInfo.length > 0 && (
            <div className="bg-[#12121a] border border-white/10 rounded-lg p-4">
              <h5 className="text-xs text-[#aaa] uppercase mb-2 tracking-wide">
                Other Info
              </h5>
              <div className="space-y-2 text-sm">
                {otherInfo.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-start gap-4 border-b border-white/5 pb-2 last:border-0"
                  >
                    <span className="text-[#999] font-medium w-1/3 break-words">
                      {key}
                    </span>
                    <span className="text-[#e0e0e0] w-2/3 break-words text-right">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    })()}
  </section>;
  return null; // placeholder; keep your existing code intact here.
}

/* Vendor response for wallet parsed and beautify */
function WalletVendorResponse({ vendorResponse }: { vendorResponse: any }) {
  let data: any = vendorResponse;

  try {
    if (typeof vendorResponse === "string") {
      data = JSON.parse(vendorResponse);
    }
  } catch (err) {
    console.error("Invalid vendor response JSON", err);
  }

  if (!data || typeof data !== "object") return null;

  const {
    gateway_response,
    channel,
    authorization,
    customer,
    paid_at,
    currency,
    amount,
    reference,
    ip_address,
  } = data;

  return (
    <section>
      <h4 className="text-sm uppercase text-[#999] mb-2 font-semibold">
        Paystack Response
      </h4>

      <div className="bg-[#222233] p-4 rounded-lg border border-white/10 text-sm space-y-2">
        <Info label="Status" value={data.status ?? "—"} capitalize />
        <Info label="Gateway Response" value={gateway_response ?? "—"} />
        <Info label="Payment Channel" value={channel ?? "—"} />
        <Info label="Reference" value={reference ?? "—"} />
        <Info
          label="Amount"
          value={amount ? `₦${(amount / 100).toLocaleString()}` : "—"}
        />
        <Info
          label="Paid At"
          value={paid_at ? new Date(paid_at).toLocaleString("en-NG") : "—"}
        />
        <Info label="Currency" value={currency ?? "NGN"} />
        <Info label="IP Address" value={ip_address ?? "—"} />

        {authorization && (
          <div className="mt-3 border-t border-white/10 pt-3 space-y-1">
            <p className="text-[#999] text-xs uppercase font-semibold">
              Card Authorization
            </p>
            <Info label="Card Type" value={authorization.card_type} />
            <Info label="Bank" value={authorization.bank} />
            <Info label="Last 4 Digits" value={authorization.last4} />
            <Info
              label="Exp Date"
              value={`${authorization.exp_month}/${authorization.exp_year}`}
            />
            <Info
              label="Reusable"
              value={authorization.reusable ? "Yes" : "No"}
            />
          </div>
        )}

        {customer && (
          <div className="mt-3 border-t border-white/10 pt-3 space-y-1">
            <p className="text-[#999] text-xs uppercase font-semibold">
              Customer Info
            </p>
            <Info label="Email" value={customer.email} />
            <Info label="Customer Code" value={customer.customer_code} />
          </div>
        )}
      </div>
    </section>
  );
}
