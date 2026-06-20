const RoleBadge = ({ role }) => {
  const styles = {
    admin: 'badge-primary',
    owner: 'badge-secondary',
    tenant: 'badge-ghost',
  };

  return (
    <span className={`badge badge-sm capitalize ${styles[role] || 'badge-ghost'}`}>{role}</span>
  );
};

export default RoleBadge;
