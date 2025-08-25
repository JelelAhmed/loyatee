"use client";

import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { CreateSupabaseClient } from "@/lib/supabase/client";

export default function DashboardHeader() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data, error } = await CreateSupabaseClient.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      const user = data.session?.user;
      setUserName(user?.user_metadata?.display_name || user?.email || "User");
    }

    getUser();
  }, []);

  return (
    <header className="bg-gray-900 text-white py-4 shadow-md rounded-xl">
      <div className="flex justify-between items-center p-4">
        {/* Greeting and Date */}
        <div>
          <h1 className="text-xl font-semibold text-emerald-400">
            Welcome back, {userName ?? "…"}
          </h1>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <UserCircle className="w-10 h-10 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
