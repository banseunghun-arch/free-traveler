'use client';

import { useEffect, useState } from 'react';
import { MatePost, ParticipationRequest, Block } from '@/lib/db';
import { Footer } from '@/components/shared/Footer';
import { EmptyState } from '@/components/shared/EmptyState';
import { IntroCta } from '@/components/scr004/IntroCta';
import { FilterBar } from '@/components/scr004/FilterBar';
import { PostList } from '@/components/scr004/PostList';
import { PostDetail } from '@/components/scr004/PostDetail';
import { ApplyFlow } from '@/components/scr004/ApplyFlow';
import { ReportBlockPanel } from '@/components/scr004/ReportBlockPanel';
import { getBrowserClient } from '@/lib/supabase-browser';

interface MatesPageClientProps {}

export default function MatesPageClient({}: MatesPageClientProps) {
  const [posts, setPosts] = useState<MatePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<MatePost[]>([]);
  const [selectedPost, setSelectedPost] = useState<MatePost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [participationRequests, setParticipationRequests] = useState<Record<string, ParticipationRequest>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      const supabase = getBrowserClient();

      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      setUserId(currentUserId || null);

      // Fetch mate posts
      setIsLoading(true);
      try {
        const response = await fetch('/api/mates');
        const data = await response.json();
        const matePostsData = data.data || [];

        setPosts(matePostsData);
        setFilteredPosts(matePostsData);

        // Fetch blocked users if logged in
        if (currentUserId) {
          const blocksResponse = await fetch('/api/moderation?action=blocked');
          const blocksData = await blocksResponse.json();
          const blockedIds = (blocksData.data || []).map((block: Block) => block.blocked_user_id);
          setBlockedUserIds(blockedIds);

          // Fetch participation requests for this user
          const reqResponse = await fetch('/api/participation?requester=me');
          const reqData = reqResponse.json();
          const requests: Record<string, ParticipationRequest> = {};
          (await reqData).data?.forEach((req: ParticipationRequest) => {
            requests[req.mate_post_id] = req;
          });
          setParticipationRequests(requests);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectPost = (post: MatePost) => {
    setSelectedPost(post);
    setIsDrawerOpen(true);
  };

  const handleBlockChange = (isBlocked: boolean) => {
    if (selectedPost) {
      if (isBlocked) {
        setBlockedUserIds(prev => [...prev, selectedPost.author_id]);
      } else {
        setBlockedUserIds(prev => prev.filter(id => id !== selectedPost.author_id));
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Section 1: Intro + CTA */}
        <IntroCta />

        {/* Section 2: Filter Bar */}
        <div className="mt-6">
          <FilterBar
            posts={posts}
            blockedUserIds={blockedUserIds}
            onFilterChange={setFilteredPosts}
          />
        </div>

        {/* Desktop Layout: List + Detail Split */}
        <div className="mt-6 hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Section 3: Post List (Left) */}
          <div className="lg:col-span-1">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-[#f7f6f4] rounded-[8px] h-24" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <EmptyState
                title="조건에 맞는 동행글이 없어요"
                description="필터를 조정하거나 나중에 다시 확인해보세요."
                actions={[
                  { label: '필터 초기화', href: '#' },
                  { label: '동행글 쓰기', href: userId ? '/travel-tools?tab=mate' : '/account' },
                ]}
              />
            ) : (
              <PostList
                posts={filteredPosts}
                selectedPostId={selectedPost?.id}
                onSelectPost={handleSelectPost}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Section 4: Post Detail (Right) */}
          <div className="lg:col-span-2 space-y-4 border-l border-[#e5e3e0] pl-6">
            {selectedPost ? (
              <>
                <PostDetail post={selectedPost} />

                {/* Section 5: Apply Flow */}
                <div className="border-t border-[#e5e3e0] pt-4">
                  <h3 className="text-[14px] font-semibold text-[#262626] mb-4">
                    동행 신청하기
                  </h3>
                  <ApplyFlow
                    matePostId={selectedPost.id}
                    existingRequest={participationRequests[selectedPost.id]}
                  />
                </div>

                {/* Section 6: Report/Block */}
                <div className="border-t border-[#e5e3e0] pt-4">
                  <ReportBlockPanel
                    targetPostId={selectedPost.id}
                    targetAuthorId={selectedPost.author_id}
                    isBlocked={blockedUserIds.includes(selectedPost.author_id)}
                    onBlockChange={handleBlockChange}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-[#767676]">
                <p className="text-[14px]">동행글을 선택해주세요.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout: List only (Drawer for detail) */}
        <div className="mt-6 lg:hidden">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#f7f6f4] rounded-[8px] h-24" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              title="조건에 맞는 동행글이 없어요"
              description="필터를 조정하거나 나중에 다시 확인해보세요."
              actions={[
                { label: '필터 초기화', href: '#' },
                { label: '동행글 쓰기', href: userId ? '/travel-tools?tab=mate' : '/account' },
              ]}
            />
          ) : (
            <PostList
              posts={filteredPosts}
              selectedPostId={selectedPost?.id}
              onSelectPost={handleSelectPost}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Mobile Drawer for Detail */}
        {isDrawerOpen && selectedPost && (
          <div className="fixed inset-0 lg:hidden z-50 bg-black/50" onClick={() => setIsDrawerOpen(false)}>
            <div
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <PostDetail
                post={selectedPost}
                onClose={() => setIsDrawerOpen(false)}
                isDrawer
              />

              <div className="border-t border-[#e5e3e0] p-4">
                <h3 className="text-[14px] font-semibold text-[#262626] mb-4">
                  동행 신청하기
                </h3>
                <ApplyFlow
                  matePostId={selectedPost.id}
                  existingRequest={participationRequests[selectedPost.id]}
                />
              </div>

              <div className="border-t border-[#e5e3e0] p-4">
                <ReportBlockPanel
                  targetPostId={selectedPost.id}
                  targetAuthorId={selectedPost.author_id}
                  isBlocked={blockedUserIds.includes(selectedPost.author_id)}
                  onBlockChange={handleBlockChange}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
