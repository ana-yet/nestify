import Link from "next/link";
import { motion } from "framer-motion";

const ADMIN_LINKS = [
  {
    to: "/dashboard/admin/users",
    icon: "group",
    title: "All Users",
    description: "View users and change roles",
  },
  {
    to: "/dashboard/admin/properties",
    icon: "domain",
    title: "All Properties",
    description: "Approve, reject, and manage listings",
  },
  {
    to: "/dashboard/admin/bookings",
    icon: "calendar_month",
    title: "All Bookings",
    description: "Monitor booking activity platform-wide",
  },
  {
    to: "/dashboard/admin/transactions",
    icon: "payments",
    title: "Transactions",
    description: "View the full payment ledger",
  },
];

const AdminHomePage = () => (
  <div>
    <h1 className="text-2xl font-bold text-text-main mb-2">Admin Dashboard</h1>
    <p className="text-text-muted mb-8">
      Platform moderation and monitoring tools
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {ADMIN_LINKS.map((item, index) => (
        <motion.div
          key={item.to}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
        >
          <Link
            href={item.to}
            className="block bg-surface rounded-xl border border-border-subtle p-6 hover:shadow-lg transition-shadow h-full"
          >
            <span className="material-symbols-outlined text-primary text-3xl mb-3">
              {item.icon}
            </span>
            <h2 className="font-semibold text-lg">{item.title}</h2>
            <p className="text-sm text-text-muted mt-1">{item.description}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default AdminHomePage;
