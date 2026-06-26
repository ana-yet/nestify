'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const AdminHomePage = loadable(() => import('@/views/admin/AdminHomePage.jsx'), { ssr: false });

export default function Page() {
  return <AdminHomePage />;
}
