import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { fetchBookingById } from '../api/bookings.api.js';
import { createCheckoutSession } from '../api/payments.api.js';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import { formatRent, formatLocation, getPropertyImage } from '../utils/propertyHelpers.js';

const PaymentPage = () => {
  const pathname = usePathname();
  const bookingId = pathname.split("/").pop();

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => fetchBookingById(bookingId),
    enabled: Boolean(bookingId),
  });

  const checkoutMutation = useMutation({
    mutationFn: () => createCheckoutSession(bookingId),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Unable to start checkout');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create checkout session');
    },
  });

  if (isLoading) return <LoadingSpinner fullScreen message="Loading booking..." />;

  if (isError || !booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <span className="material-symbols-outlined text-5xl text-error mb-4">payments</span>
        <p className="text-error font-medium mb-2">Booking not found</p>
        <Link href="/dashboard/tenant/bookings" className="btn btn-primary-nestify mt-4">
          My Bookings
        </Link>
      </div>
    );
  }

  const property = booking.propertyId;
  const { amount, suffix } = formatRent(booking.amount, property?.rentType);
  const isPaid = booking.paymentStatus === 'paid';

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-surface rounded-xl border border-border-subtle shadow-ambient overflow-hidden">
        <div className="bg-primary/5 px-6 py-8 text-center border-b border-border-subtle">
          <span className="material-symbols-outlined text-4xl text-primary mb-3">payments</span>
          <h1 className="text-2xl font-bold text-text-main">Complete Your Payment</h1>
          <p className="text-text-muted mt-2 text-sm">Secure checkout powered by Stripe</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <img
              src={getPropertyImage(property)}
              alt={property?.title}
              className="w-24 h-24 rounded-lg object-cover shrink-0"
            />
            <div>
              <h2 className="font-semibold text-lg">{property?.title}</h2>
              <p className="text-sm text-text-muted">{formatLocation(property?.location)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-border-subtle pt-4">
            <div>
              <p className="text-text-muted">Move-in Date</p>
              <p className="font-medium">{format(new Date(booking.moveInDate), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-text-muted">Booking Status</p>
              <p className="font-medium capitalize">{booking.bookingStatus}</p>
            </div>
            <div>
              <p className="text-text-muted">Payment Status</p>
              <p className={`font-medium capitalize ${isPaid ? 'text-secondary' : ''}`}>
                {booking.paymentStatus}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Reservation Fee</p>
              <p className="font-bold text-primary text-lg">${amount}{suffix}</p>
            </div>
          </div>

          {isPaid ? (
            <div className="alert alert-success text-sm">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Payment already completed for this booking.</span>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary-nestify w-full py-3 text-base gap-2"
              disabled={checkoutMutation.isPending}
              onClick={() => checkoutMutation.mutate()}
            >
              {checkoutMutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <span className="material-symbols-outlined">lock</span>
                  Pay with Stripe
                </>
              )}
            </button>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/tenant/bookings" className="btn btn-outline flex-1">
              My Bookings
            </Link>
            <Link href={`/properties/${property?._id}`} className="btn btn-ghost flex-1">
              Back to Property
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
