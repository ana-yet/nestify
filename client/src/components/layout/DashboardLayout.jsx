import Sidebar from "./Sidebar.jsx";
import MobileDashboardNav from "./MobileDashboardNav.jsx";
import useAuth from "../../hooks/useAuth.js";

const DashboardLayout = ({ role, children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      <Sidebar role={role} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur border-b border-border-subtle px-4 md:px-8 py-4 flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <MobileDashboardNav role={role} />
            <div className="md:hidden">
              <span className="text-lg font-bold text-primary">Nestify</span>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
              </div>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-text-muted capitalize">{user?.role}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-container-max mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
