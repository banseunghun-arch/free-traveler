import { Metadata } from 'next';
import MatesPageClient from './page-client';

export const metadata: Metadata = {
  title: '동행 찾기 | Free Traveler',
  description: '안전하고 즐거운 여행을 함께할 동행을 찾아보세요.',
};

export default function MatesPage() {
  return <MatesPageClient />;
}
