import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getDashboardPath } from '../../utils/formatters.js';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `font-medium text-sm transition-colors ${
      isActive
        ? 'text-primary font-bold border-b-2 border-primary pb-1'
        : 'text-on-surface-variant hover:text-primary'
    }`;

  return (
    <nav className="bg-surface/80 backdrop-blur-xl sticky top-0 border-b border-border-subtle shadow-sm z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-20">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl text-primary font-bold tracking-tight">
            Nestify
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/properties" className={navLinkClass}>
              All Properties
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath(user.role)}
                className="hidden sm:inline-flex btn btn-ghost btn-sm text-primary"
              >
                Dashboard
              </Link>
              <button type="button" onClick={logout} className="btn-outline-nestify btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline-nestify btn-sm hidden sm:inline-flex">
                Login
              </Link>
              <Link to="/register" className="btn-primary-nestify btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
