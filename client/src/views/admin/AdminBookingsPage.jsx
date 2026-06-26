import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchAdminBookings } from "../../api/admin.api.js";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import Pagination from "../../components/shared/Pagination.jsx";
import StatusBadge from "../../components/shared/StatusBadge.jsx";

const PaymentBadge = ({ status }) => {
  const styles = {
    paid: "badge-success",
    unpaid: "badge-warning",
    failed: "badge-error",
  };
  return (
    <span
      className={`badge badge-sm capitalize ${styles[status] || "badge-ghost"}`}
    >
      {status}
    </span>
  );
};

const AdminBookingsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "bookings", page],
    queryFn: () => fetchAdminBookings({ page, limit: 12 }),
  });

  const bookings = data?.bookings || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">All Bookings</h1>
        <p className="text-text-muted mt-1">
          Monitor booking activity across the platform (read-only)
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading bookings..." />
      ) : isError ? (
        <EmptyState
          icon="error_outline"
          title="Failed to load bookings"
          description={error?.message || "Something went wrong"}
          action={
            <button className="btn btn-primary-nestify" onClick={refetch}>
              Retry
            </button>
          }
        />
      ) : bookings.length === 0 ? (
        <EmptyState icon="calendar_month" title="No bookings yet" />
      ) : (
        <>
          <div className="bg-surface rounded-xl border border-border-subtle overflow-x-auto shadow-ambient">
            <table className="table w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Owner</th>
                  <th>Amount</th>
                  <th>Booking Status</th>
                  <th>Payment Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-surface-container-low/40"
                  >
                    <td>
                      <p className="font-medium text-sm">
                        {booking.tenantId?.name ||
                          booking.tenantInfo?.name ||
                          "—"}
                      </p>
                      <p className="text-xs text-text-muted">
                        {booking.tenantId?.email || booking.tenantInfo?.email}
                      </p>
                    </td>
                    <td className="font-medium text-sm max-w-[160px] truncate">
                      {booking.propertyId?.title || "—"}
                    </td>
                    <td>
                      <p className="text-sm">{booking.ownerId?.name || "—"}</p>
                      <p className="text-xs text-text-muted">
                        {booking.ownerId?.email}
                      </p>
                    </td>
                    <td className="font-medium">
                      ${booking.amount?.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={booking.bookingStatus} />
                    </td>
                    <td>
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>
                    <td className="text-sm text-text-muted whitespace-nowrap">
                      {format(new Date(booking.createdAt), "MMM d, yyyy")}
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

export default AdminBookingsPage;
