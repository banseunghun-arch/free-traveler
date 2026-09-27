'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/shared/Button';

export function IntroCta() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="h-16" />;
  }

  const ctaHref = isLoggedIn ? '/travel-tools?tab=mate' : '/account';

  return (
    <div className="bg-white border-b border-[#e5e3e0] py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[#262626]">
              함께할 동행을 찾아보세요
            </h2>
            <p className="text-[14px] text-[#767676] mt-1">
              안전하고 즐거운 여행을 위해 동행 커뮤니티에 참여하세요.
            </p>
          </div>
          <Link href={ctaHref} className="flex-shrink-0">
            <Button className="whitespace-nowrap">
              {isLoggedIn ? '동행글 쓰기' : '로그인 후 작성'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
