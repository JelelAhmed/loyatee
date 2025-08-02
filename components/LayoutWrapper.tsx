"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isExcludedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  return (
    <>
      {!isExcludedRoute && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isExcludedRoute && <Footer />}
    </>
  );
}
