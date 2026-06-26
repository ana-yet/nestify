'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const HomePage = loadable(() => import('@/views/HomePage.jsx'), { ssr: false });

export default function Page() {
  return <HomePage />;
}
