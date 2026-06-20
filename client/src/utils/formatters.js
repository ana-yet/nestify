export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'owner':
      return '/dashboard/owner';
    case 'tenant':
    default:
      return '/dashboard/tenant';
  }
};

export const formatRoleLabel = (role) => {
  if (!role) return '';
  return role.charAt(0).toUpperCase() + role.slice(1);
};
