import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth.js";

const TENANT_LINKS = [
  { to: "/dashboard/tenant", label: "Dashboard", icon: "dashboard", end: true },
  {
    to: "/dashboard/tenant/bookings",
    label: "My Bookings",
    icon: "calendar_month",
  },
  { to: "/dashboard/tenant/favorites", label: "Favorites", icon: "favorite" },
  { to: "/dashboard/tenant/profile", label: "Profile", icon: "person" },
];

const OWNER_LINKS = [
  { to: "/dashboard/owner", label: "Dashboard", icon: "dashboard", end: true },
  {
    to: "/dashboard/owner/bookings",
    label: "Owner Bookings",
    icon: "calendar_month",
  },
  {
    to: "/dashboard/owner/add-property",
    label: "Add Property",
    icon: "add_home",
  },
  { to: "/dashboard/owner/properties", label: "My Properties", icon: "domain" },
  { to: "/dashboard/owner/profile", label: "Profile", icon: "person" },
];

const ADMIN_LINKS = [
  { to: "/dashboard/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/dashboard/admin/users", label: "All Users", icon: "group" },
  {
    to: "/dashboard/admin/properties",
    label: "All Properties",
    icon: "domain",
  },
  {
    to: "/dashboard/admin/bookings",
    label: "All Bookings",
    icon: "calendar_month",
  },
  {
    to: "/dashboard/admin/transactions",
    label: "Transactions",
    icon: "payments",
  },
  { to: "/dashboard/admin/profile", label: "Profile", icon: "person" },
];

const LINKS_BY_ROLE = {
  tenant: TENANT_LINKS,
  owner: OWNER_LINKS,
  admin: ADMIN_LINKS,
};

const Sidebar = ({ role }) => {
  const links = LINKS_BY_ROLE[role] || [];
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getLinkClass = (path, end = false) => {
    const isActive = end ? pathname === path : pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
      isActive
        ? "bg-primary/10 text-primary font-bold border-r-4 border-primary"
        : "text-on-surface-variant hover:bg-surface-container-low"
    }`;
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface border-r border-border-subtle shadow-lg py-6 px-4 z-40">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">
            real_estate_agent
          </span>
        </div>
        <div>
          <Link href="/" className="text-lg font-bold text-primary">
            Nestify
          </Link>
          <p className="text-xs text-text-muted capitalize">{role} Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.to}
            href={link.to}
            className={getLinkClass(link.to, link.end)}
          >
            <span className="material-symbols-outlined text-xl">
              {link.icon}
            </span>
            {link.label}
          </Link>
        ))}
      </nav>

      {role === "owner" && (
        <Link
          href="/dashboard/owner/add-property"
          className="btn btn-primary-nestify w-full mt-4 gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Listing
        </Link>
      )}

      <div className="mt-auto pt-4 border-t border-border-subtle space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg"
        >
          <span className="material-symbols-outlined">home</span>
          Back to Site
        </Link>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
