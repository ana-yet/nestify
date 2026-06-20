import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col">
      <header className="px-4 md:px-margin-desktop py-6">
        <Link to="/" className="text-2xl text-primary font-bold">
          Nestify
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 pb-12">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
