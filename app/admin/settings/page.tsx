"use client";

import { useEffect, useState } from "react";
import { fetchVendorAccount } from "@/app/actions/vendor.actions";
import { User, Banknote } from "lucide-react";

interface VendorAccount {
  id: number;
  email: string;
  username: string;
  fullName: string;
  pin: string;
  img: string;
  address: string;
  phone: string;
  user_type: string;
  email_verify: boolean;
  account_balance: number;
  wallet_balance: string;
  bonus_balance: string;
  referer_username: string;
  reserved_account_number: string;
  reserved_bank_name: string;
  bank_accounts: {
    accounts: {
      bankCode: string;
      bankName: string;
      accountNumber: string;
      accountName: string;
    }[];
  };
}

export default function SettingsPage() {
  const [vendor, setVendor] = useState<VendorAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [siteName, setSiteName] = useState("Yata");
  const [adminEmail, setAdminEmail] = useState("admin@yata.com");

  useEffect(() => {
    const loadVendor = async () => {
      try {
        const data = await fetchVendorAccount();
        setVendor(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load vendor account");
      } finally {
        setLoading(false);
      }
    };
    loadVendor();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      siteName,
      adminEmail,
    });
  };

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Settings
        </h2>

        {/* Vendor Account Section */}
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Vendor Account
          </h3>

          {loading && (
            <p className="text-[var(--text-secondary)] text-sm">
              Loading vendor data...
            </p>
          )}

          {error && <p className="text-red-400 text-sm">Error: {error}</p>}

          {vendor && (
            <>
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={vendor.img}
                  alt={vendor.fullName}
                  className="w-20 h-20 rounded-full border border-white/10 object-cover"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Full Name
                    </p>
                    <p className="text-[var(--text-primary)] font-medium">
                      {vendor.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Username
                    </p>
                    <p className="text-[var(--text-primary)] font-medium">
                      {vendor.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Email
                    </p>
                    <p className="text-[var(--text-primary)] font-medium">
                      {vendor.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Phone
                    </p>
                    <p className="text-[var(--text-primary)] font-medium">
                      {vendor.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Account Balance
                    </p>
                    <p className="text-[var(--text-primary)] font-medium">
                      ₦{vendor.account_balance}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Address
                    </p>
                    <p className="text-[var(--text-primary)] font-medium">
                      {vendor.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Reserved Account
                    </p>
                    <p className="text-[var(--text-primary)] font-medium">
                      {vendor.reserved_bank_name} —{" "}
                      {vendor.reserved_account_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  Linked Bank Accounts
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left border border-white/10 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-[var(--card-background-color)]/70 border-b border-white/10">
                        <th className="px-4 py-2 text-[var(--text-secondary)] font-medium">
                          Bank Name
                        </th>
                        <th className="px-4 py-2 text-[var(--text-secondary)] font-medium">
                          Account Name
                        </th>
                        <th className="px-4 py-2 text-[var(--text-secondary)] font-medium">
                          Account Number
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendor.bank_accounts.accounts.map((acc, i) => (
                        <tr
                          key={i}
                          className="border-b border-white/5 hover:bg-white/5 transition"
                        >
                          <td className="px-4 py-2 text-[var(--text-primary)]">
                            {acc.bankName}
                          </td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">
                            {acc.accountName}
                          </td>
                          <td className="px-4 py-2 text-[var(--text-primary)] font-mono">
                            {acc.accountNumber}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Basic Site Settings */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              General Settings
            </h3>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="mt-1 w-full bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="adminEmail"
                  className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                  Admin Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="mt-1 w-full bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-[var(--primary-color)] rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--primary-color)]/80 hover:scale-105 transform transition-all duration-300"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
