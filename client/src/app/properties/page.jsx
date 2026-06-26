'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const AllPropertiesPage = loadable(() => import('@/views/AllPropertiesPage.jsx'), { ssr: false });

export default function Page() {
  return <AllPropertiesPage />;
}
