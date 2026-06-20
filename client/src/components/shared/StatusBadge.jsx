const STATUS_STYLES = {
  approved: 'badge-success',
  pending: 'badge-warning',
  rejected: 'badge-error',
};

const STATUS_LABELS = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
};

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || 'pending';
  return (
    <span className={`badge badge-sm ${STATUS_STYLES[normalized] || 'badge-ghost'}`}>
      {STATUS_LABELS[normalized] || status}
    </span>
  );
};

export default StatusBadge;
