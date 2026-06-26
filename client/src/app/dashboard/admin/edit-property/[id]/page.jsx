'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const AdminEditPropertyPage = loadable(() => import('@/views/admin/AdminEditPropertyPage.jsx'), { ssr: false });

export default function Page() {
  return <AdminEditPropertyPage />;
}
