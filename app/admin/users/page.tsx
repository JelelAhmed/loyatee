"use client";

import { useState } from "react";
import UserTable from "@/components/admin/UserTable";
import UserCard from "@/components/admin/UserCard";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const users = [
    {
      email: "ada.eze@email.com",
      phone: "+234 803 123 4567",
      joinedDate: "15 Jan, 2023",
      status: "Active",
    },
    {
      email: "chidi.okafor@email.com",
      phone: "+234 902 987 6543",
      joinedDate: "20 Feb, 2023",
      status: "Active",
    },
    {
      email: "nkechi.obi@email.com",
      phone: "+234 706 555 1212",
      joinedDate: "10 Mar, 2023",
      status: "Suspended",
    },
    {
      email: "emeka.nwosu@email.com",
      phone: "+234 812 333 4444",
      joinedDate: "05 Apr, 2023",
      status: "Active",
    },
    {
      email: "ifeoma.okoro@email.com",
      phone: "+234 909 777 8888",
      joinedDate: "12 May, 2023",
      status: "Active",
    },
  ];

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Users
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
            />
            <button
              type="button"
              className="bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-white/10 transition-colors"
            >
              Filters
            </button>
          </div>
        </div>
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
          <UserTable users={users} />
          <div className="sm:hidden space-y-4 p-4">
            {users.map((user, i) => (
              <UserCard key={i} user={user} />
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing 1 to 5 of 20 results
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
