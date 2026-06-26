import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchMyBookings } from "../../api/bookings.api.js";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import StatusBadge from "../../components/shared/StatusBadge.jsx";
import { formatLocation } from "../../utils/propertyHelpers.js";

const PaymentStatusBadge = ({ status }) => {
  const styles = {
    paid: "badge-success",
    unpaid: "badge-warning",
    failed: "badge-error",
    refunded: "badge-ghost",
  };
  return (
    <span
      className={`badge badge-sm capitalize ${styles[status] || "badge-ghost"}`}
    >
      {status}
    </span>
  );
};

const MyBookingsPage = () => {
  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["bookings", "my"],
    queryFn: fetchMyBookings,
  });

  if (isLoading) return <LoadingSpinner message="Loading your bookings..." />;

  if (isError) {
    return (
      <EmptyState
        icon="error_outline"
        title="Failed to load bookings"
        description="Something went wrong. Please try again."
        action={
          <button
            type="button"
            className="btn btn-primary-nestify"
            onClick={() => refetch()}
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">My Bookings</h1>
        <p className="text-text-muted mt-1">
          Track your reservation requests and payment status
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border-subtle">
          <EmptyState
            icon="calendar_month"
            title="No bookings yet"
            description="Browse properties and book your next home."
            action={
              <Link href="/properties" className="btn btn-primary-nestify">
                Explore Properties
              </Link>
            }
          />
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border-subtle overflow-x-auto shadow-ambient">
          <table className="table w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th>Property Name</th>
                <th>Booking Date</th>
                <th>Move-in</th>
                <th>Amount</th>
                <th>Booking Status</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-surface-container-low/40"
                >
                  <td>
                    <div>
                      <p className="font-medium">
                        {booking.propertyId?.title || "—"}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatLocation(booking.propertyId?.location)}
                      </p>
                    </div>
                  </td>
                  <td className="text-sm text-text-muted">
                    {format(new Date(booking.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="text-sm">
                    {format(new Date(booking.moveInDate), "MMM d, yyyy")}
                  </td>
                  <td className="font-medium">
                    ${booking.amount?.toLocaleString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <StatusBadge status={booking.bookingStatus} />
                      {booking.bookingStatus === "rejected" &&
                        booking.rejectedReason && (
                          <div className="dropdown dropdown-hover dropdown-end">
                            <span
                              tabIndex={0}
                              className="material-symbols-outlined text-xs text-error cursor-pointer"
                            >
                              info
                            </span>
                            <div
                              tabIndex={0}
                              className="dropdown-content z-10 card card-compact bg-error/10 border border-error/20 text-error text-xs p-3 w-56 shadow-lg mt-1"
                            >
                              <p className="font-semibold mb-1">
                                Rejection Reason:
                              </p>
                              <p>{booking.rejectedReason}</p>
                            </div>
                          </div>
                        )}
                    </div>
                  </td>
                  <td>
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </td>
                  <td>
                    {booking.paymentStatus === "unpaid" && (
                      <Link
                        href={`/payment/${booking._id}`}
                        className="btn btn-primary btn-xs"
                      >
                        Pay
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
