'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const LoginPage = loadable(() => import('@/views/LoginPage.jsx'), { ssr: false });

export default function Page() {
  return <LoginPage />;
}
