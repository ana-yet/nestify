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

export default PaymentStatusBadge;
