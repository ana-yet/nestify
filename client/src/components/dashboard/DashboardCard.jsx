const DashboardCard = ({ children, className = '' }) => (
  <div
    className={`bg-surface rounded-xl border border-border-subtle shadow-ambient ${className}`}
  >
    {children}
  </div>
);

export default DashboardCard;
