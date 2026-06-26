'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const MyBookingsPage = loadable(() => import('@/views/tenant/MyBookingsPage.jsx'), { ssr: false });

export default function Page() {
  return <MyBookingsPage />;
}
