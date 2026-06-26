import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { verifyPayment } from '../api/payments.api.js';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { formatLocation } from '../utils/propertyHelpers.js';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['payments', 'verify', sessionId],
    queryFn: () => verifyPayment(sessionId),
    enabled: Boolean(sessionId),
    retry: 2,
  });

  if (!sessionId) {
    return (
      <EmptyState
        icon="error_outline"
        title="Invalid payment session"
        description="No session ID was provided."
        action={
          <Link href="/dashboard/tenant/bookings" className="btn btn-primary-nestify">
            My Bookings
          </Link>
        }
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Confirming your payment..." />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon="error_outline"
        title="Payment verification failed"
        description="We could not verify your payment. If you were charged, check My Bookings or contact support."
        action={
          <div className="flex gap-3">
            <button type="button" className="btn btn-outline" onClick={() => refetch()}>
              Retry
            </button>
            <Link href="/dashboard/tenant/bookings" className="btn btn-primary-nestify">
              My Bookings
            </Link>
          </div>
        }
      />
    );
  }

  const { booking, transaction, paymentStatus } = data;
  const property = booking?.propertyId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        className="bg-surface rounded-xl border border-border-subtle shadow-ambient overflow-hidden text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-10 bg-secondary/5 border-b border-border-subtle">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4"
          >
            <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-text-main">Payment Successful!</h1>
          <p className="text-text-muted mt-2">Your reservation fee has been received.</p>
        </div>

        <div className="p-6 text-left space-y-4">
          <div>
            <h2 className="font-semibold">{property?.title}</h2>
            <p className="text-sm text-text-muted">{formatLocation(property?.location)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text-muted">Amount Paid</p>
              <p className="font-bold text-primary">${transaction?.amount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-text-muted">Payment Status</p>
              <p className="font-medium capitalize text-secondary">{paymentStatus}</p>
            </div>
            <div>
              <p className="text-text-muted">Move-in</p>
              <p className="font-medium">
                {booking?.moveInDate && format(new Date(booking.moveInDate), 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Booking Status</p>
              <p className="font-medium capitalize">{booking?.bookingStatus}</p>
            </div>
          </div>

          <div className="alert alert-info text-sm">
            <span className="material-symbols-outlined">info</span>
            <span>The property owner will review and approve your booking request.</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/dashboard/tenant/bookings" className="btn btn-primary-nestify flex-1">
              View My Bookings
            </Link>
            <Link href="/properties" className="btn btn-outline flex-1">
              Browse More
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
