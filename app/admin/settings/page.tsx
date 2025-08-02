"use client";

import { useState } from "react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Smartphone, CreditCard, Wallet } from "lucide-react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("Loyatee");
  const [adminEmail, setAdminEmail] = useState("admin@loyatee.com");
  const [notifications, setNotifications] = useState(true);
  const [networkBundles, setNetworkBundles] = useState({
    mtn: true,
    glo: true,
    airtel: false,
    nineMobile: false,
  });
  const [specificBundles, setSpecificBundles] = useState({
    mtnDaily: true,
    mtnWeekly: false,
    gloDaily: true,
    gloWeekly: false,
  });
  const [paymentChannels, setPaymentChannels] = useState({
    ussd: true,
    bankTransfer: true,
    cardPayment: true,
  });
  const [gatewayHandlers, setGatewayHandlers] = useState({
    nomba: true,
    paystack: true,
    flutterwave: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., API call to lib/admin/updateSettings.ts)
    console.log({
      siteName,
      adminEmail,
      notifications,
      networkBundles,
      specificBundles,
      paymentChannels,
      gatewayHandlers,
    });
  };

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-8">
          Settings
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
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
              <ToggleSwitch
                id="notifications"
                label="Enable Notifications"
                checked={notifications}
                onChange={setNotifications}
              />
            </div>
          </div>

          {/* Network Bundles */}
          <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Network Bundles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleSwitch
                id="mtn"
                label="MTN Bundles"
                checked={networkBundles.mtn}
                onChange={(checked) =>
                  setNetworkBundles({ ...networkBundles, mtn: checked })
                }
              />
              <ToggleSwitch
                id="glo"
                label="Glo Bundles"
                checked={networkBundles.glo}
                onChange={(checked) =>
                  setNetworkBundles({ ...networkBundles, glo: checked })
                }
              />
              <ToggleSwitch
                id="airtel"
                label="Airtel Bundles"
                checked={networkBundles.airtel}
                onChange={(checked) =>
                  setNetworkBundles({ ...networkBundles, airtel: checked })
                }
              />
              <ToggleSwitch
                id="nineMobile"
                label="9mobile Bundles"
                checked={networkBundles.nineMobile}
                onChange={(checked) =>
                  setNetworkBundles({ ...networkBundles, nineMobile: checked })
                }
              />
            </div>
          </div>

          {/* Specific Bundles */}
          <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Specific Bundles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleSwitch
                id="mtnDaily"
                label="MTN Daily"
                checked={specificBundles.mtnDaily}
                onChange={(checked) =>
                  setSpecificBundles({ ...specificBundles, mtnDaily: checked })
                }
              />
              <ToggleSwitch
                id="mtnWeekly"
                label="MTN Weekly"
                checked={specificBundles.mtnWeekly}
                onChange={(checked) =>
                  setSpecificBundles({ ...specificBundles, mtnWeekly: checked })
                }
              />
              <ToggleSwitch
                id="gloDaily"
                label="Glo Daily"
                checked={specificBundles.gloDaily}
                onChange={(checked) =>
                  setSpecificBundles({ ...specificBundles, gloDaily: checked })
                }
              />
              <ToggleSwitch
                id="gloWeekly"
                label="Glo Weekly"
                checked={specificBundles.gloWeekly}
                onChange={(checked) =>
                  setSpecificBundles({ ...specificBundles, gloWeekly: checked })
                }
              />
            </div>
          </div>

          {/* Payment Channels */}
          <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleSwitch
                id="ussd"
                label="USSD"
                checked={paymentChannels.ussd}
                onChange={(checked) =>
                  setPaymentChannels({ ...paymentChannels, ussd: checked })
                }
              />
              <ToggleSwitch
                id="bankTransfer"
                label="Bank Transfer"
                checked={paymentChannels.bankTransfer}
                onChange={(checked) =>
                  setPaymentChannels({
                    ...paymentChannels,
                    bankTransfer: checked,
                  })
                }
              />
              <ToggleSwitch
                id="cardPayment"
                label="Card Payment"
                checked={paymentChannels.cardPayment}
                onChange={(checked) =>
                  setPaymentChannels({
                    ...paymentChannels,
                    cardPayment: checked,
                  })
                }
              />
            </div>
          </div>

          {/* Gateway Handlers */}
          <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Gateway Handlers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleSwitch
                id="nomba"
                label="Nomba"
                checked={gatewayHandlers.nomba}
                onChange={(checked) =>
                  setGatewayHandlers({ ...gatewayHandlers, nomba: checked })
                }
              />
              <ToggleSwitch
                id="paystack"
                label="Paystack"
                checked={gatewayHandlers.paystack}
                onChange={(checked) =>
                  setGatewayHandlers({ ...gatewayHandlers, paystack: checked })
                }
              />
              <ToggleSwitch
                id="flutterwave"
                label="Flutterwave"
                checked={gatewayHandlers.flutterwave}
                onChange={(checked) =>
                  setGatewayHandlers({
                    ...gatewayHandlers,
                    flutterwave: checked,
                  })
                }
              />
            </div>
          </div>

          {/* Save Button */}
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
