'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const AdminUsersPage = loadable(() => import('@/views/admin/AdminUsersPage.jsx'), { ssr: false });

export default function Page() {
  return <AdminUsersPage />;
}
