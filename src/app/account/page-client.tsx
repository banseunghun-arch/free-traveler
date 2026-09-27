'use client';

import { useEffect, useState } from 'react';
import { AuthPanel } from '@/components/scr005/AuthPanel';
import { ProfileSummary } from '@/components/scr005/ProfileSummary';
import { MyActivity } from '@/components/scr005/MyActivity';
import { AdminPanel } from '@/components/scr005/AdminPanel';
import { getBrowserClient } from '@/lib/supabase-browser';

type UserRole = 'guest' | 'member' | 'admin';

export default function AccountPageClient() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const supabase = getBrowserClient();

      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        setRole('guest');
        setIsLoading(false);
        return;
      }

      // User is logged in, fetch profile to determine role
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Failed to fetch profile:', error);
          setRole('member');
        } else {
          const fetchedProfile = data;
          // Check if admin (style contains 'admin')
          const isAdmin = fetchedProfile?.style?.includes('admin') || false;
          setRole(isAdmin ? 'admin' : 'member');
        }
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setRole('member');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndRole();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {role === 'guest' && <AuthPanel />}
      {role === 'member' && (
        <div className="space-y-12">
          <ProfileSummary />
          <MyActivity />
        </div>
      )}
      {role === 'admin' && (
        <div className="space-y-12">
          <AdminPanel />
        </div>
      )}
    </div>
  );
}
