'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const BookingRequestsPage = loadable(() => import('@/views/owner/BookingRequestsPage.jsx'), { ssr: false });

export default function Page() {
  return <BookingRequestsPage />;
}
