"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const dataBundles = [
  { size: "1GB", price: 250 },
  { size: "2GB", price: 480 },
  { size: "5GB", price: 1200 },
  { size: "10GB", price: 2300 },
];

export default function BuyDataPage() {
  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("MTN");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleBuy = (bundle: any) => {
    if (!phone) return alert("Please enter a phone number.");
    setSelected(bundle);
    setShowModal(true);
  };

  const confirmPurchase = () => {
    console.log("Confirming purchase", selected);
    setShowModal(false);
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen bg-[var(--navy-blue)] text-white">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[var(--navy-blue)] backdrop-blur-sm rounded-2xl px-4 py-6 sm:p-6 md:p-8 shadow-2xl border border-[var(--border-color)]">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
            Buy Data
          </h2>

          <form className="space-y-6">
            {/* Network Selector */}
            <div>
              <label
                htmlFor="network"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Select Network
              </label>
              <select
                id="network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full bg-[var(--dark-navy)] text-white border border-[var(--border-color)] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
              >
                {["MTN", "Glo", "Airtel", "9mobile"].map((net) => (
                  <option
                    key={net}
                    value={net}
                    className="bg-[var(--dark-navy)] text-white"
                  >
                    {net}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +2348012345678"
                className="w-full bg-[var(--dark-navy)] text-white placeholder-gray-500 border border-[var(--border-color)] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
              />
            </div>

            {/* Data Bundles */}
            {/* Data Bundles */}
            <div className="pt-2 space-y-4">
              <h3 className="text-lg font-semibold text-white">Data Bundles</h3>
              <div className="grid grid-cols-2 gap-4">
                {dataBundles.map((bundle) => (
                  <div
                    key={bundle.size}
                    className="bg-[var(--dark-navy)] border border-[var(--border-color)] p-4 rounded-xl text-center flex flex-col justify-between hover:shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <div>
                      <p className="font-bold text-lg">{bundle.size}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Valid for 30 days
                      </p>
                      <p className="font-semibold text-lg mt-2 text-white">
                        ₦{bundle.price}
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleBuy(bundle)}
                      variant="primary"
                      className="mt-4 w-full text-sm sm:text-base"
                    >
                      Buy Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--dark-navy)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-lg w-full max-w-sm text-center">
            <p className="mb-6 text-base sm:text-lg text-white">
              Confirm purchase of <strong>{selected?.size}</strong> for{" "}
              <strong>{phone}</strong> on <strong>{network}</strong>?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="w-full"
                onClick={confirmPurchase}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
