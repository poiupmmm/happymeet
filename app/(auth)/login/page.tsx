import { Suspense } from 'react';
import LoginClientPage from './login-client';
import LoadingSpinner from '@/components/loading-spinner';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginClientPage />
    </Suspense>
  );
} 