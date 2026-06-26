import Link from "next/link";
import useAuth from "../../hooks/useAuth.js";

const TenantHomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-main mb-2">
        Welcome back, {user?.name?.split(" ")[0]}.
      </h1>
      <p className="text-text-muted mb-8">
        Manage your bookings, favorites, and profile.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            to: "/dashboard/tenant/bookings",
            icon: "calendar_month",
            title: "My Bookings",
            desc: "View reservation history",
          },
          {
            to: "/dashboard/tenant/favorites",
            icon: "favorite",
            title: "Favorites",
            desc: "Saved properties",
          },
          {
            to: "/dashboard/tenant/profile",
            icon: "person",
            title: "Profile",
            desc: "Update your info",
          },
        ].map((card) => (
          <Link
            key={card.to}
            href={card.to}
            className="bg-surface rounded-xl border border-border-subtle p-6 hover:shadow-lg transition-shadow"
          >
            <span className="material-symbols-outlined text-primary text-3xl mb-3">
              {card.icon}
            </span>
            <h2 className="font-semibold text-lg">{card.title}</h2>
            <p className="text-sm text-text-muted mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TenantHomePage;
