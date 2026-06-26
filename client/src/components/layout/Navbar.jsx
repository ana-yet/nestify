import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "../../hooks/useAuth.js";
import { getDashboardPath } from "../../utils/formatters.js";

const Navbar = () => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const pathname = usePathname();

  const getLinkClass = (path, end = false) => {
    const isActive = end ? pathname === path : pathname.startsWith(path);
    return `font-medium text-sm transition-colors ${
      isActive
        ? "text-primary font-bold border-b-2 border-primary pb-1"
        : "text-on-surface-variant hover:text-primary"
    }`;
  };

  return (
    <nav className="bg-surface/80 backdrop-blur-xl sticky top-0 border-b border-border-subtle shadow-sm z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-20">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl text-primary font-bold tracking-tight"
          >
            Nestify
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={getLinkClass("/", true)}>
              Home
            </Link>
            <Link href="/properties" className={getLinkClass("/properties")}>
              All Properties
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <span className="loading loading-spinner loading-sm text-primary" />
          ) : isAuthenticated ? (
            <>
              <Link
                href={getDashboardPath(user.role)}
                className="hidden sm:inline-flex btn btn-ghost btn-sm text-primary"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="btn-outline-nestify btn-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-outline-nestify btn-sm hidden sm:inline-flex"
              >
                Login
              </Link>
              <Link href="/register" className="btn-primary-nestify btn-sm">
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
