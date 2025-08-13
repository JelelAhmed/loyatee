// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
  display: "swap", // Ensures font swapping after loading
});

export const metadata: Metadata = {
  title: "Loyatee",
  description: "Buy cheap mobile data instantly in Nigeria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body
        className={`bg-[var(--navy-blue)] text-[var(--text-primary)] ${manrope.className}`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
