'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth.js';
import LoadingSpinner from '@/components/shared/LoadingSpinner.jsx';

export default function ProtectedPage({ roles, children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (roles && roles.length > 0 && !roles.includes(user?.role)) {
      router.replace('/');
    }
  }, [loading, isAuthenticated, user, roles, router]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen message="Redirecting to login..." />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <LoadingSpinner fullScreen message="Redirecting..." />;
  }

  return children;
}
