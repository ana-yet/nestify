'use client';

export const dynamic = 'force-dynamic';

import loadable from 'next/dynamic';
import ProtectedPage from '@/app/_components/ProtectedPage.jsx';

const PaymentSuccessPage = loadable(() => import('@/views/PaymentSuccessPage.jsx'), { ssr: false });

export default function Page() {
  return (
    <ProtectedPage roles={['tenant']}>
      <PaymentSuccessPage />
    </ProtectedPage>
  );
}
