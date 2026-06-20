import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const EarningsChart = ({ data = [] }) => {
  const hasEarnings = data.some((item) => item.earnings > 0);

  if (!hasEarnings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[280px] text-text-muted">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">show_chart</span>
        <p className="text-sm">No earnings data yet for the last 12 months.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#888" />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#888"
          tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value), 'Earnings']}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid var(--border-subtle, #e5e7eb)',
          }}
        />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="#3525cd"
          strokeWidth={2.5}
          dot={{ fill: '#3525cd', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EarningsChart;
