'use client';

import { usePathname } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout.jsx';

export default function RouteAwareLayout({ children }) {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return children;
  }

  return <PublicLayout>{children}</PublicLayout>;
}
