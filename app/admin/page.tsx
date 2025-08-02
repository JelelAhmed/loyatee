"use client";

import StatCard from "@/components/admin/StatCard";
import UserTable from "@/components/admin/UserTable";
import UserCard from "@/components/admin/UserCard";
import TransactionTable from "@/components/admin/TransactionTable";
import TransactionCard from "@/components/admin/TransactionCard";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Users", value: "1,234" },
    { title: "Total Transactions", value: "5,678" },
    { title: "Total Revenue", value: "₦12,345,678" },
  ];

  const users = [
    {
      email: "ada.eze@email.com",
      phone: "+234 803 123 4567",
      joinedDate: "15 Jan, 2023",
    },
    {
      email: "chidi.okafor@email.com",
      phone: "+234 902 987 6543",
      joinedDate: "20 Feb, 2023",
    },
    {
      email: "nkechi.obi@email.com",
      phone: "+234 706 555 1212",
      joinedDate: "10 Mar, 2023",
    },
    {
      email: "emeka.nwosu@email.com",
      phone: "+234 812 333 4444",
      joinedDate: "05 Apr, 2023",
    },
    {
      email: "ifeoma.okoro@email.com",
      phone: "+234 909 777 8888",
      joinedDate: "12 May, 2023",
    },
  ];

  const transactions = [
    {
      user: "ada.eze@email.com",
      network: "MTN",
      amount: "₦1,000",
      date: "20 Jul, 2023",
      status: "Completed",
    },
    {
      user: "chidi.okafor@email.com",
      network: "Glo",
      amount: "₦500",
      date: "21 Jul, 2023",
      status: "Pending",
    },
    {
      user: "nkechi.obi@email.com",
      network: "Airtel",
      amount: "₦2,500",
      date: "22 Jul, 2023",
      status: "Completed",
    },
    {
      user: "emeka.nwosu@email.com",
      network: "9mobile",
      amount: "₦750",
      date: "23 Jul, 2023",
      status: "Failed",
    },
    {
      user: "ifeoma.okoro@email.com",
      network: "MTN",
      amount: "₦1,500",
      date: "24 Jul, 2023",
      status: "Completed",
    },
  ];

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={i} title={stat.title} value={stat.value} />
          ))}
        </div>
        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Recent Users
            </h2>
            <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
              <UserTable users={users} />
              <div className="sm:hidden space-y-4 p-4">
                {users.map((user, i) => (
                  <UserCard key={i} user={user} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Latest Transactions
            </h2>
            <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
              <TransactionTable transactions={transactions} />
              <div className="sm:hidden space-y-4 p-4">
                {transactions.map((transaction, i) => (
                  <TransactionCard key={i} transaction={transaction} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
