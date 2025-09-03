import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { formatFundingType } from "@/lib/utils";

type Transaction = {
  id: string;
  type: "wallet_funding" | "data_purchase";
  amount: number;
  created_at: string;
  status: string;
  data_size?: string;
  duration?: string;
  phone_number?: number;
};

export default function TransactionCardDash({ entry }: { entry: Transaction }) {
  const Icon =
    entry.type === "wallet_funding"
      ? Wallet
      : entry.type === "data_purchase"
      ? ArrowDown
      : ArrowUp;

  return (
    <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-md text-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-green-400" />
          <span className="font-semibold capitalize">
            {formatFundingType(entry.type)}
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            entry.status === "success"
              ? "bg-green-500/20 text-green-400"
              : entry.status === "pending"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {entry.status}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-1 text-gray-300">
        <p>
          <span className="text-gray-500">Date:</span>{" "}
          {new Date(entry.created_at).toLocaleDateString("en-NG", {
            day: "2-digit",
            month: "short", // e.g. Aug
            year: "numeric",
          })}
        </p>
        <p>
          <span className="text-gray-500">Amount:</span> ₦
          {entry.amount.toLocaleString()}
        </p>

        {entry.type === "data_purchase" && (
          <>
            <p>
              <span className="text-gray-500">Duration:</span> {entry.duration}
            </p>
            <p>
              <span className="text-gray-500">Phone:</span>{" "}
              {entry.phone_number || "-"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
