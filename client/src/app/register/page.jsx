'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const RegisterPage = loadable(() => import('@/views/RegisterPage.jsx'), { ssr: false });

export default function Page() {
  return <RegisterPage />;
}
