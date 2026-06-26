'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const TenantHomePage = loadable(() => import('@/views/tenant/TenantHomePage.jsx'), { ssr: false });

export default function Page() {
  return <TenantHomePage />;
}
