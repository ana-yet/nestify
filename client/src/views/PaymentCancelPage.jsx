import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const PaymentCancelPage = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <motion.div
        className="bg-surface rounded-xl border border-border-subtle shadow-ambient p-8 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl text-warning">cancel</span>
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-2">Payment Cancelled</h1>
        <p className="text-text-muted mb-8">
          Your payment was not completed. Your booking is still saved — you can try again when
          ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {bookingId && (
            <Link href={`/payment/${bookingId}`} className="btn btn-primary-nestify">
              Retry Payment
            </Link>
          )}
          <Link href="/dashboard/tenant/bookings" className="btn btn-outline">
            My Bookings
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelPage;
