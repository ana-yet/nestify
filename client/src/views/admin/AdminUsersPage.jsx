import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { fetchAdminUsers, updateUserRole } from "../../api/admin.api.js";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import Pagination from "../../components/shared/Pagination.jsx";
import useAuth from "../../hooks/useAuth.js";

const ROLE_STYLES = {
  admin: "badge-error",
  owner: "badge-warning",
  tenant: "badge-info",
};

const ROLE_OPTIONS = [
  { value: "tenant", label: "Tenant" },
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
];

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => fetchAdminUsers({ page, limit: 12 }),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role updated");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update role"),
  });

  const users = data?.users || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">All Users</h1>
        <p className="text-text-muted mt-1">
          Manage platform users and assign roles
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading users..." />
      ) : isError ? (
        <EmptyState
          icon="error_outline"
          title="Failed to load users"
          description={error?.message || "Something went wrong"}
          action={
            <button className="btn btn-primary-nestify" onClick={refetch}>
              Retry
            </button>
          }
        />
      ) : users.length === 0 ? (
        <EmptyState icon="group" title="No users found" />
      ) : (
        <>
          <div className="bg-surface rounded-xl border border-border-subtle overflow-x-auto shadow-ambient">
            <table className="table w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-surface-container-low/40"
                  >
                    <td className="font-medium">{user.name}</td>
                    <td className="text-sm text-text-muted">{user.email}</td>
                    <td>
                      <span
                        className={`badge badge-sm capitalize ${ROLE_STYLES[user.role] || "badge-ghost"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="text-sm text-text-muted whitespace-nowrap">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </td>
                    <td>
                      <select
                        className="select select-bordered select-xs max-w-[120px]"
                        value={user.role}
                        disabled={
                          roleMutation.isPending ||
                          (user._id === currentUser?._id &&
                            user.role === "admin")
                        }
                        title={
                          user._id === currentUser?._id && user.role === "admin"
                            ? "You cannot demote yourself"
                            : "Change role"
                        }
                        onChange={(e) =>
                          roleMutation.mutate({
                            userId: user._id,
                            role: e.target.value,
                          })
                        }
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminUsersPage;
