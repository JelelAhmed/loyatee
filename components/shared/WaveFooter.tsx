// app/components/DashboardFooter.tsx
export default function DashboardFooter() {
  return (
    <footer
      className="
        w-full 
        bg-[#111827] 
        text-gray-400 
        text-sm 
        py-4 
        px-6 
        text-center 
        relative 
        z-[0]  /* 👈 Ensure it's below all content */
      "
    >
      <p>© {new Date().getFullYear()} Yata. All rights reserved.</p>
    </footer>
  );
}
