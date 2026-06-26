'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const MyPropertiesPage = loadable(() => import('@/views/owner/MyPropertiesPage.jsx'), { ssr: false });

export default function Page() {
  return <MyPropertiesPage />;
}
