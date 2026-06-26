import { useState } from "react";
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

const MobileDashboardNav = ({ role }) => {
  const [open, setOpen] = useState(false);
  const links = LINKS_BY_ROLE[role] || [];
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getLinkClass = (path, end = false) => {
    const isActive = end ? pathname === path : pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
      isActive
        ? "bg-primary/10 text-primary font-bold"
        : "text-on-surface-variant"
    }`;
  };

  return (
    <>
      <button
        type="button"
        className="md:hidden btn btn-ghost btn-sm btn-square"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface border-r border-border-subtle shadow-xl flex flex-col p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-primary">Nestify</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => setOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={getLinkClass(link.to, link.end)}
                  onClick={() => setOpen(false)}
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-border-subtle space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <span className="material-symbols-outlined">home</span>
                Back to Site
              </Link>
              <button
                type="button"
                className="flex items-center gap-3 px-4 py-2 text-sm w-full"
                onClick={async () => {
                  setOpen(false);
                  await logout();
                  router.push("/");
                }}
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default MobileDashboardNav;
