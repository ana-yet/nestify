'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const AdminBookingsPage = loadable(() => import('@/views/admin/AdminBookingsPage.jsx'), { ssr: false });

export default function Page() {
  return <AdminBookingsPage />;
}
