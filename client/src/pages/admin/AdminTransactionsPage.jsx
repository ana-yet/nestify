import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchAdminTransactions } from "../../api/admin.api.js";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import Pagination from "../../components/shared/Pagination.jsx";

const AdminTransactionsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "transactions", page, search],
    queryFn: () =>
      fetchAdminTransactions({ page, limit: 12, search: search || undefined }),
  });

  const transactions = data?.transactions || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Transactions</h1>
          <p className="text-text-muted mt-1">
            Full payment ledger across the platform
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="search"
            className="input input-bordered input-sm flex-1 sm:w-64"
            placeholder="Search property, tenant, owner, ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary-nestify btn-sm">
            Search
          </button>
          {search && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearch("");
                setSearchInput("");
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading transactions..." />
      ) : isError ? (
        <EmptyState
          icon="error_outline"
          title="Failed to load transactions"
          description={error?.message || "Something went wrong"}
          action={
            <button className="btn btn-primary-nestify" onClick={refetch}>
              Retry
            </button>
          }
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon="payments"
          title={search ? "No matching transactions" : "No transactions yet"}
        />
      ) : (
        <>
          <div className="bg-surface rounded-xl border border-border-subtle overflow-x-auto shadow-ambient">
            <table className="table w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  <th>Transaction ID</th>
                  <th>Property Name</th>
                  <th>Tenant Name</th>
                  <th>Owner Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr
                    key={txn._id}
                    className="hover:bg-surface-container-low/40"
                  >
                    <td
                      className="font-mono text-xs max-w-[100px] truncate"
                      title={txn._id}
                    >
                      {txn._id}
                    </td>
                    <td className="font-medium text-sm max-w-[160px] truncate">
                      {txn.propertyId?.title || "—"}
                    </td>
                    <td className="text-sm">{txn.tenantId?.name || "—"}</td>
                    <td className="text-sm">{txn.ownerId?.name || "—"}</td>
                    <td className="font-medium">
                      ${txn.amount?.toLocaleString()}
                    </td>
                    <td className="text-sm text-text-muted whitespace-nowrap">
                      {format(
                        new Date(txn.paidAt || txn.createdAt),
                        "MMM d, yyyy",
                      )}
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

export default AdminTransactionsPage;
