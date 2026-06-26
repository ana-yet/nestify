import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  fetchOwnerBookingRequests,
  approveBooking,
  rejectBooking,
} from '../../api/bookings.api.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import EmptyState from '../../components/shared/EmptyState.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import { formatLocation } from '../../utils/propertyHelpers.js';

const PaymentStatusBadge = ({ status }) => {
  const styles = {
    paid: 'badge-success',
    unpaid: 'badge-warning',
    failed: 'badge-error',
    refunded: 'badge-ghost',
  };
  return (
    <span className={`badge badge-sm capitalize ${styles[status] || 'badge-ghost'}`}>{status}</span>
  );
};

const RejectModal = ({ booking, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('');

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reject Booking</h3>
        <p className="text-sm text-text-muted py-2">
          Reject booking for <strong>{booking?.propertyId?.title}</strong>?
        </p>
        <label className="form-label-nestify">Reason (optional)</label>
        <textarea
          rows={3}
          className="textarea textarea-bordered w-full"
          placeholder="Optional note for the tenant..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            disabled={loading}
            onClick={() => onConfirm(reason)}
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : 'Confirm Reject'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

const BookingRequestsPage = () => {
  const [rejectTarget, setRejectTarget] = useState(null);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', 'owner'],
    queryFn: fetchOwnerBookingRequests,
  });

  const approveMutation = useMutation({
    mutationFn: approveBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'owner'] });
      toast.success('Booking approved');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Approve failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'owner'] });
      toast.success('Booking rejected');
      setRejectTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Reject failed'),
  });

  if (isLoading) return <LoadingSpinner message="Loading booking requests..." />;

  if (isError) {
    return (
      <EmptyState
        icon="error_outline"
        title="Failed to load bookings"
        action={
          <button type="button" className="btn btn-primary-nestify" onClick={() => refetch()}>
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Booking Requests</h1>
        <p className="text-text-muted mt-1">Review and manage tenant reservation requests</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border-subtle">
          <EmptyState
            icon="calendar_month"
            title="No booking requests"
            description="When tenants book and pay for your properties, requests will appear here."
          />
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border-subtle overflow-x-auto shadow-ambient">
          <table className="table w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th>Tenant</th>
                <th>Property</th>
                <th>Amount</th>
                <th>Booking</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const tenant = booking.tenantId;
                const tenantName =
                  tenant?.name || booking.tenantInfo?.name || '—';
                const tenantEmail =
                  tenant?.email || booking.tenantInfo?.email || '—';

                return (
                  <tr key={booking._id} className="hover:bg-surface-container-low/40">
                    <td>
                      <p className="font-medium text-sm">{tenantName}</p>
                      <p className="text-xs text-text-muted">{tenantEmail}</p>
                    </td>
                    <td>
                      <p className="font-medium text-sm">{booking.propertyId?.title}</p>
                      <p className="text-xs text-text-muted">
                        {formatLocation(booking.propertyId?.location)}
                      </p>
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
                    <td>
                      {booking.bookingStatus === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            className="btn btn-success btn-xs"
                            disabled={
                              booking.paymentStatus !== 'paid' || approveMutation.isPending
                            }
                            title={
                              booking.paymentStatus !== 'paid'
                                ? 'Awaiting payment'
                                : 'Approve booking'
                            }
                            onClick={() => approveMutation.mutate(booking._id)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-warning btn-xs"
                            disabled={booking.paymentStatus === 'paid'}
                            title={
                              booking.paymentStatus === 'paid'
                                ? 'Paid bookings cannot be rejected'
                                : 'Reject booking'
                            }
                            onClick={() => setRejectTarget(booking)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          booking={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={(reason) =>
            rejectMutation.mutate({ id: rejectTarget._id, reason })
          }
          loading={rejectMutation.isPending}
        />
      )}
    </div>
  );
};

export default BookingRequestsPage;
