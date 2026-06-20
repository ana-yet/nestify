import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';

const RoleRoute = ({ roles = [], children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (children) {
    return children;
  }

  return <Outlet />;
};

export default RoleRoute;
