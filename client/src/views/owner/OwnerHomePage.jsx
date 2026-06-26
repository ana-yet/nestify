import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchOwnerSummary, fetchOwnerMonthlyEarnings } from '../../api/analytics.api.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import EmptyState from '../../components/shared/EmptyState.jsx';
import EarningsChart from '../../components/owner/EarningsChart.jsx';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

const KPI_CARDS = [
  {
    key: 'totalEarnings',
    label: 'Total Earnings',
    icon: 'account_balance_wallet',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    format: formatCurrency,
  },
  {
    key: 'totalProperties',
    label: 'Total Properties',
    icon: 'home_work',
    iconBg: 'bg-primary/5',
    iconColor: 'text-primary',
    format: (v) => v?.toLocaleString() ?? '0',
  },
  {
    key: 'totalBookings',
    label: 'Total Bookings',
    icon: 'calendar_today',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    format: (v) => v?.toLocaleString() ?? '0',
  },
];

const OwnerHomePage = () => {
  const summaryQuery = useQuery({
    queryKey: ['analytics', 'owner', 'summary'],
    queryFn: fetchOwnerSummary,
  });

  const earningsQuery = useQuery({
    queryKey: ['analytics', 'owner', 'monthly-earnings'],
    queryFn: fetchOwnerMonthlyEarnings,
  });

  const isLoading = summaryQuery.isLoading || earningsQuery.isLoading;
  const isError = summaryQuery.isError || earningsQuery.isError;

  if (isLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  if (isError) {
    return (
      <EmptyState
        icon="error_outline"
        title="Failed to load analytics"
        description="Something went wrong while fetching your dashboard data."
        action={
          <button
            type="button"
            className="btn btn-primary-nestify"
            onClick={() => {
              summaryQuery.refetch();
              earningsQuery.refetch();
            }}
          >
            Retry
          </button>
        }
      />
    );
  }

  const summary = summaryQuery.data || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Owner Dashboard</h1>
        <p className="text-text-muted mt-1">Welcome back. Here&apos;s what&apos;s happening with your properties.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KPI_CARDS.map((card, index) => (
          <motion.div
            key={card.key}
            className="bg-surface rounded-xl p-6 border border-border-subtle shadow-ambient"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-text-muted">{card.label}</h3>
              <div className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${card.iconColor} text-sm`}>
                  {card.icon}
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-main">
              {card.format(summary[card.key])}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="bg-surface rounded-xl p-6 border border-border-subtle shadow-ambient">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-text-main">Monthly Earnings</h2>
          <span className="text-xs text-text-muted">Last 12 months</span>
        </div>
        <EarningsChart data={earningsQuery.data || []} />
      </section>
    </div>
  );
};

export default OwnerHomePage;
