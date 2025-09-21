"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import UserTable from "@/components/admin/UserTable";
import UserCard from "@/components/admin/UserCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { formatCurrency } from "@/lib/utils";
import debounce from "lodash/debounce";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  phone: string;
  role: string;
  walletBalance: number;
  status: string;
  is_banned: boolean;
  joinedDate: string;
}

export default function UsersPage() {
  const supabase = CreateSupabaseClient;

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;
  const activeRequestId = useRef(0);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    userId?: string;
    userEmail?: string;
    action?: "delete" | "toggleStatus" | "changeRole";
    payload?: any;
  }>({ isOpen: false });

  // Format Supabase rows
  const formatUsers = (data: any[] | null | undefined): User[] =>
    (data ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? "N/A",
      phone: u.phone ?? "N/A",
      role: u.role ?? "user",
      is_banned: !!u.is_banned,
      walletBalance: parseFloat(u.wallet_balance ?? "0"),
      status: u.is_banned ? "Suspended" : "Active",
      joinedDate: u.created_at
        ? new Date(u.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
    }));

  // Handlers
  const handleToggleStatus = async (id: string, isBanned: boolean) => {
    try {
      const newBanValue = !isBanned;
      const newStatus = newBanValue ? "Suspended" : "Active";

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_banned: newBanValue, status: newStatus } : u
        )
      );

      const { error } = await supabase
        .from("users")
        .update({ is_banned: newBanValue })
        .eq("id", id);

      if (error) throw error;
      toast.success(`User ${newStatus.toLowerCase()}`);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update status");
    }
  };

  const handleChangeRole = async (id: string, newRole: string) => {
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );

      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", id);

      if (error) throw error;
      toast.success("Role updated successfully");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update role");
    }
  };

  const handleDeleteUser = async (id: string) => {
    const { data, error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      toast.error(error.message || "Failed to delete user");
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    }
  };

  // Fetch users
  const fetchUsers = async (
    searchTerm: string,
    role: string,
    status: string,
    sort: string,
    currentPage: number
  ) => {
    const reqId = ++activeRequestId.current;
    setIsLoading(true);
    setError(null);

    try {
      let query: any = supabase
        .from("users")
        .select(
          "id, email, phone, role, is_banned, wallet_balance, created_at",
          { count: "exact" }
        )
        .order("created_at", { ascending: sort === "oldest" })
        .range((currentPage - 1) * limit, currentPage * limit - 1);

      if (searchTerm) {
        query = query.or(
          `email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        );
      }
      if (role !== "all") query = query.eq("role", role);
      if (status !== "all")
        query = query.eq("is_banned", status === "suspended");

      const { data, count, error } = await query;

      if (reqId !== activeRequestId.current) return;
      if (error) {
        setError(`Failed to fetch users: ${error.message}`);
        return;
      }

      setUsers(formatUsers(data));
      setTotal(count ?? 0);
    } catch (err: any) {
      if (reqId !== activeRequestId.current) return;
      setError(`Unexpected error: ${err?.message ?? err}`);
    } finally {
      if (reqId === activeRequestId.current) setIsLoading(false);
    }
  };

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
      activeRequestId.current += 1;
    };
  }, [debouncedSetSearch]);

  useEffect(() => {
    fetchUsers(search, roleFilter, statusFilter, sortOrder, page);
  }, [search, roleFilter, statusFilter, sortOrder, page]);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
    debouncedSetSearch(val);
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === "role") setRoleFilter(value);
    if (type === "status") setStatusFilter(value);
    if (type === "sort") setSortOrder(value);
    setPage(1);
  };

  const disablePrevious = isLoading || page <= 1;
  const disableNext = isLoading || totalPages === 0 || page >= totalPages;

  const handleNextClick = () => {
    if (!disableNext) setPage((p) => p + 1);
  };
  const handlePreviousClick = () => {
    if (!disablePrevious) setPage((p) => Math.max(1, p - 1));
  };

  const resetConfirmState = () =>
    setConfirmState({
      isOpen: false,
      userId: undefined,
      userEmail: undefined,
      action: undefined,
      payload: undefined,
    });

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={total} />
          <StatCard
            label="Admins"
            value={users.filter((u) => u.role === "admin").length}
          />
          <StatCard
            label="Suspended"
            value={users.filter((u) => u.is_banned).length}
          />
          <StatCard
            label="Total Wallet"
            value={formatCurrency(
              users.reduce((sum, u) => sum + (u.walletBalance ?? 0), 0)
            )}
          />
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search by email or phone..."
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="w-full bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            {["role", "status", "sort"].map((type) => (
              <select
                key={type}
                value={
                  type === "role"
                    ? roleFilter
                    : type === "status"
                    ? statusFilter
                    : sortOrder
                }
                onChange={(e) => handleFilterChange(type, e.target.value)}
                className="flex-1 min-w-[100px] sm:min-w-[120px] bg-gray-800/80 border border-gray-600 rounded-lg px-2 py-2 text-xs sm:text-sm text-gray-100 truncate focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              >
                {type === "role" && (
                  <>
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </>
                )}
                {type === "status" && (
                  <>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </>
                )}
                {type === "sort" && (
                  <>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </>
                )}
              </select>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden relative z-20">
          {error && <p className="text-red-400 text-center py-4">{error}</p>}
          {users.length === 0 ? (
            <p className="text-center py-4">No users found</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <UserTable
                  users={users}
                  onChangeRole={(id, newRole) => {
                    const user = users.find((u) => u.id === id);
                    if (!user) return;
                    setConfirmState({
                      isOpen: true,
                      userId: id,
                      userEmail: user.email,
                      action: "changeRole",
                      payload: { newRole },
                    });
                  }}
                  onToggleStatus={(id, isBanned) => {
                    const user = users.find((u) => u.id === id);
                    if (!user) return;
                    setConfirmState({
                      isOpen: true,
                      userId: id,
                      userEmail: user.email,
                      action: "toggleStatus",
                      payload: { isBanned },
                    });
                  }}
                  onDelete={(id) => {
                    const user = users.find((u) => u.id === id);
                    if (!user) return;
                    setConfirmState({
                      isOpen: true,
                      userId: id,
                      userEmail: user.email,
                      action: "delete",
                    });
                  }}
                />
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4 p-4">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onChangeRole={(id, newRole) =>
                      setConfirmState({
                        isOpen: true,
                        userId: id,
                        userEmail: user.email,
                        action: "changeRole",
                        payload: { newRole },
                      })
                    }
                    onToggleStatus={(id, isBanned) =>
                      setConfirmState({
                        isOpen: true,
                        userId: id,
                        userEmail: user.email,
                        action: "toggleStatus",
                        payload: { isBanned },
                      })
                    }
                    onDelete={(id) =>
                      setConfirmState({
                        isOpen: true,
                        userId: id,
                        userEmail: user.email,
                        action: "delete",
                      })
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 px-4 sm:px-6 py-4 gap-3 sm:gap-0">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <div className="sm:hidden text-sm text-[var(--text-secondary)] bg-[var(--card-background-color)]/80 px-4 py-2 rounded-full border border-white/10 shadow-sm">
                    <span className="font-bold text-[var(--text-primary)]">
                      {page}/{totalPages || 0}
                    </span>
                    <span className="mx-2">|</span>
                    <span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
                      </span>{" "}
                      of {total}
                    </span>
                  </div>
                  <div className="hidden sm:block text-sm text-[var(--text-secondary)] bg-[var(--card-background-color)]/70 px-3 py-1 rounded-md">
                    <span>
                      Page{" "}
                      <span className="font-bold text-[var(--text-primary)]">
                        {page}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-[var(--text-primary)]">
                        {totalPages || 0}
                      </span>
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      Showing{" "}
                      <span className="font-bold text-[var(--text-primary)]">
                        {(page - 1) * limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-[var(--text-primary)]">
                        {Math.min(page * limit, total)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-[var(--text-primary)]">
                        {total}
                      </span>{" "}
                      users
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    disabled={disablePrevious}
                    onClick={handlePreviousClick}
                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={disableNext}
                    onClick={handleNextClick}
                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          title={
            confirmState.action === "delete"
              ? "Delete User"
              : confirmState.action === "toggleStatus"
              ? "Change Status"
              : "Change Role"
          }
          message={
            confirmState.action === "delete"
              ? `This will permanently delete the user "${confirmState.userEmail}". Type the email to confirm.`
              : confirmState.action === "toggleStatus"
              ? `Are you sure you want to ${
                  confirmState.payload?.isBanned ? "activate" : "suspend"
                } "${confirmState.userEmail}"? Type the email to confirm.`
              : `Are you sure you want to change the role of "${confirmState.userEmail}" to "${confirmState.payload?.newRole}"? Type the email to confirm.`
          }
          requireEmailInput
          defaultEmail=""
          onCancel={resetConfirmState}
          onConfirm={async (typedEmail) => {
            if (typedEmail !== confirmState.userEmail) {
              toast.error("Email does not match. Action canceled.");
              resetConfirmState();
              return;
            }

            if (!confirmState.userId) return;

            if (confirmState.action === "delete") {
              await handleDeleteUser(confirmState.userId);
            } else if (confirmState.action === "toggleStatus") {
              await handleToggleStatus(
                confirmState.userId,
                confirmState.payload?.isBanned
              );
            } else if (confirmState.action === "changeRole") {
              await handleChangeRole(
                confirmState.userId,
                confirmState.payload.newRole
              );
            }

            resetConfirmState();
          }}
        />
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--card-background-color)]/70 p-4 rounded-lg border border-white/10 text-center relative z-10">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
