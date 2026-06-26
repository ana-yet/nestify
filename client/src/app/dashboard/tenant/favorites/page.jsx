'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';

const FavoritesPage = loadable(() => import('@/views/tenant/FavoritesPage.jsx'), { ssr: false });

export default function Page() {
  return <FavoritesPage />;
}
