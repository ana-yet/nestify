'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const ProfilePage = loadable(() => import('@/views/tenant/ProfilePage.jsx'), { ssr: false });

export default function Page() {
  return <ProfilePage />;
}
