import { Suspense } from 'react';
import EventsPageClient from './events-client';
import LoadingSpinner from '@/components/loading-spinner';

export default function EventsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EventsPageClient />
    </Suspense>
  );
} 