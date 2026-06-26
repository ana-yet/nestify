'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';
import ProtectedPage from '@/app/_components/ProtectedPage.jsx';

const PropertyDetailsPage = loadable(() => import('@/views/PropertyDetailsPage.jsx'), { ssr: false });

export default function Page() {
  return (
    <ProtectedPage>
      <PropertyDetailsPage />
    </ProtectedPage>
  );
}
