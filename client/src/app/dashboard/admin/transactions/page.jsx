'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const AdminTransactionsPage = loadable(() => import('@/views/admin/AdminTransactionsPage.jsx'), { ssr: false });

export default function Page() {
  return <AdminTransactionsPage />;
}
