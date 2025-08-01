import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WaveFooter from "@/components/shared/WaveFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile Sidebar - visible below lg */}
      <div className="lg:hidden">
        <MobileSidebar />
      </div>

      <div className="min-h-screen bg-[#0d0f1a]">
        {/* Sidebar stays fixed on the left */}
        <Sidebar />

        {/* Main content area with left margin to avoid going under the sidebar */}
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <main className="flex-1">
            {/* This wrapper handles spacing + width */}
            <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
              <DashboardHeader />
              {children}
              <WaveFooter />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
