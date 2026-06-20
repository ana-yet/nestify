const DashboardTable = ({ children, emptyMessage }) => (
  <div className="bg-surface rounded-xl border border-border-subtle shadow-ambient overflow-hidden">
    <div className="overflow-x-auto">
      <table className="table w-full">{children}</table>
    </div>
    {emptyMessage && (
      <p className="text-center text-text-muted py-12 text-sm">{emptyMessage}</p>
    )}
  </div>
);

export default DashboardTable;
