export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import dynamic from 'next/dynamic';

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <ClientEvent id={params.id} />
    </div>
  );
}

// 避免导入错误，使用动态引入
const ClientEvent = dynamic(() => import('./event-client'), { ssr: false }); 