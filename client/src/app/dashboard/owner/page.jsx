'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const OwnerHomePage = loadable(() => import('@/views/owner/OwnerHomePage.jsx'), { ssr: false });

export default function Page() {
  return <OwnerHomePage />;
}
