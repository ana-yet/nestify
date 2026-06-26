'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const AdminPropertiesPage = loadable(() => import('@/views/admin/AdminPropertiesPage.jsx'), { ssr: false });

export default function Page() {
  return <AdminPropertiesPage />;
}
