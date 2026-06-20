import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetchAdminBookings } from '../../api/admin.api.js';
import QueryState from '../../components/shared/QueryState.jsx';
import Pagination from '../../components/shared/Pagination.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import PaymentStatusBadge from '../../components/shared/PaymentStatusBadge.jsx';

const AdminBookingsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'bookings', page],
    queryFn: () => fetchAdminBookings({ page, limit: 12 }),
  });

  const bookings = data?.bookings || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">All Bookings</h1>
        <p className="text-text-muted mt-1">Monitor booking activity across the platform (read-only)</p>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={!isLoading && bookings.length === 0}
        emptyIcon="calendar_month"
        emptyTitle="No bookings yet"
        loadingMessage="Loading bookings..."
      >
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
              {bookings.map((booking) => {
                const tenant = booking.tenantId;
                const property = booking.propertyId;
                const owner = booking.ownerId;

                return (
                  <tr key={booking._id} className="hover:bg-surface-container-low/40">
                    <td>
                      <p className="font-medium text-sm">
                        {tenant?.name || booking.tenantInfo?.name || '—'}
                      </p>
                      <p className="text-xs text-text-muted">
                        {tenant?.email || booking.tenantInfo?.email}
                      </p>
                    </td>
                    <td className="font-medium text-sm max-w-[160px] truncate">
                      {property?.title || '—'}
                    </td>
                    <td>
                      <p className="text-sm">{owner?.name || '—'}</p>
                      <p className="text-xs text-text-muted">{owner?.email}</p>
                    </td>
                    <td className="font-medium">${booking.amount?.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={booking.bookingStatus} />
                    </td>
                    <td>
                      <PaymentStatusBadge status={booking.paymentStatus} />
                    </td>
                    <td className="text-sm text-text-muted whitespace-nowrap">
                      {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </QueryState>
    </div>
  );
};

export default AdminBookingsPage;
