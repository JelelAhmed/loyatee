// app/components/DashboardFooter.tsx
export default function DashboardFooter() {
  return (
    <footer className="w-full bg-[#111827] text-gray-400 text-sm py-4 px-6 text-center">
      <p>© {new Date().getFullYear()} Yata. All rights reserved.</p>
    </footer>
  );
}
