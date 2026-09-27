'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Toast } from '@/components/shared/Toast';
import { EmptyState } from '@/components/shared/EmptyState';
import { getBrowserClient } from '@/lib/supabase-browser';
import type { MatePost, ParticipationRequest, Block } from '@/lib/db';

type ActivityTab = 'posts' | 'requests' | 'favorites' | 'blocked';

interface ParticipationRequestWithPost extends ParticipationRequest {
  mate_post?: MatePost;
}

const TAB_LABELS: Record<ActivityTab, string> = {
  posts: '내 글',
  requests: '참가 요청',
  favorites: '즐겨찾기',
  blocked: '차단 목록',
};

const EMPTY_MESSAGES: Record<ActivityTab, { title: string; desc: string; cta: string }> = {
  posts: {
    title: '아직 쓴 글이 없어요',
    desc: '함께 여행할 사람을 찾아보세요.',
    cta: '첫 동행글 작성하기',
  },
  requests: {
    title: '아직 참가 요청이 없어요',
    desc: '동행글을 찾아 참가를 신청해보세요.',
    cta: '동행 찾아보기',
  },
  favorites: {
    title: '아직 즐겨찾기한 여행지가 없어요',
    desc: '마음에 드는 여행지를 저장해두세요.',
    cta: '여행지 둘러보기',
  },
  blocked: {
    title: '차단한 사용자가 없어요',
    desc: '안전한 커뮤니티를 위해 필요하면 차단해주세요.',
    cta: '돌아가기',
  },
};

export function MyActivity() {
  const [tab, setTab] = useState<ActivityTab>('posts');
  const [myPosts, setMyPosts] = useState<MatePost[]>([]);
  const [requests, setRequests] = useState<ParticipationRequestWithPost[]>([]);
  const [favoriteDestinations, setFavoriteDestinations] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [updatingReqId, setUpdatingReqId] = useState<string | null>(null);
  const [unblockingUserId, setUnblockingUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const client = getBrowserClient();

        // Fetch my posts
        const { data: posts, error: postsError } = await client
          .from('mate_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setMyPosts((posts as MatePost[]) || []);

        // Fetch participation requests (both sent and received)
        const { data: reqs, error: reqsError } = await client
          .from('participation_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (reqsError) throw reqsError;

        // Fetch mate posts for request details
        const postIds = [...new Set((reqs as ParticipationRequest[])?.map((r) => r.mate_post_id))];
        let postMap: Record<string, MatePost> = {};
        if (postIds.length > 0) {
          const { data: postData } = await client
            .from('mate_posts')
            .select('*')
            .in('id', postIds);
          postMap = Object.fromEntries((postData || []).map((p) => [p.id, p]));
        }

        setRequests(
          (reqs as ParticipationRequest[])?.map((r) => ({
            ...r,
            mate_post: postMap[r.mate_post_id],
          })) || []
        );

        // Fetch blocked users
        const { data: blocks, error: blocksError } = await client
          .from('blocks')
          .select('*')
          .order('created_at', { ascending: false });

        if (blocksError) throw blocksError;
        setBlockedUsers((blocks as Block[]) || []);

        // Load favorites from localStorage
        try {
          const favs = localStorage.getItem('favorites');
          setFavoriteDestinations(favs ? JSON.parse(favs) : []);
        } catch (e) {
          setFavoriteDestinations([]);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : '데이터를 불러올 수 없습니다.';
        setToast({ type: 'error', message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말 이 글을 삭제하시겠어요?')) return;

    setDeletingPostId(postId);
    try {
      const client = getBrowserClient();
      const { error } = await client
        .from('mate_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
      setToast({ type: 'success', message: '글이 삭제되었습니다.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '삭제에 실패했습니다.';
      setToast({ type: 'error', message });
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleUpdateParticipationStatus = async (
    reqId: string,
    newStatus: 'ACCEPTED' | 'REJECTED'
  ) => {
    setUpdatingReqId(reqId);
    try {
      const client = getBrowserClient();
      const { data: updated, error } = await client
        .from('participation_requests')
        .update({ status: newStatus })
        .eq('id', reqId)
        .select()
        .single();

      if (error) throw error;

      setRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
      );
      setToast({
        type: 'success',
        message: newStatus === 'ACCEPTED' ? '요청을 승인했습니다.' : '요청을 거절했습니다.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '상태 업데이트에 실패했습니다.';
      setToast({ type: 'error', message });
    } finally {
      setUpdatingReqId(null);
    }
  };

  const handleUnblockUser = async (blockedUserId: string) => {
    setUnblockingUserId(blockedUserId);
    try {
      const client = getBrowserClient();
      const { error } = await client
        .from('blocks')
        .delete()
        .eq('blocked_user_id', blockedUserId);

      if (error) throw error;

      setBlockedUsers((prev) => prev.filter((b) => b.blocked_user_id !== blockedUserId));
      setToast({ type: 'success', message: '차단이 해제되었습니다.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '차단 해제에 실패했습니다.';
      setToast({ type: 'error', message });
    } finally {
      setUnblockingUserId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-[13px] text-[#666]">데이터를 로드 중입니다...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[#e5e3e0] overflow-x-auto">
        {(Object.keys(TAB_LABELS) as ActivityTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === t
                ? 'text-[#d03e1b] border-[#d03e1b]'
                : 'text-[#666] border-transparent hover:text-[#262626]'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* My Posts */}
      {tab === 'posts' && (
        <div className="space-y-3">
          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <div
                key={post.id}
                className="border border-[#e5e3e0] rounded-[8px] p-4 bg-white"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="text-[13px] font-semibold text-[#262626]">{post.title}</h3>
                    <p className="text-[11px] text-[#666] mt-1">
                      {post.country} {post.region && `· ${post.region}`}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-[10px] font-semibold rounded-[4px] whitespace-nowrap ${
                      post.status === 'OPEN'
                        ? 'bg-[#d1e7dd] text-[#0f5132]'
                        : 'bg-[#e2e3e5] text-[#383d41]'
                    }`}
                  >
                    {post.status === 'OPEN' ? '모집중' : post.status === 'FULL' ? '마감' : '마감됨'}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    onClick={() => (window.location.href = `/mates/${post.id}`)}
                    variant="secondary"
                    className="flex-1 text-[11px]"
                  >
                    수정하기
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletingPostId === post.id}
                    variant="secondary"
                    className="flex-1 text-[11px]"
                  >
                    {deletingPostId === post.id ? '삭제 중...' : '삭제'}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title={EMPTY_MESSAGES.posts.title}
              actions={[
                {
                  label: EMPTY_MESSAGES.posts.cta,
                  href: '/travel-tools?tab=mate',
                },
              ]}
            />
          )}
        </div>
      )}

      {/* Participation Requests */}
      {tab === 'requests' && (
        <div className="space-y-3">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div
                key={req.id}
                className="border border-[#e5e3e0] rounded-[8px] p-4 bg-white"
              >
                <div className="mb-2">
                  <p className="text-[12px] font-semibold text-[#262626] mb-1">
                    {req.mate_post?.title || '글 없음'}
                  </p>
                  <p className="text-[11px] text-[#666]">
                    신청자 ID: {req.requester_id.slice(0, 8)}...
                  </p>
                  <p className="text-[11px] text-[#666] mt-1">메시지: {req.message || '없음'}</p>
                </div>

                <div
                  className={`px-2 py-1 text-[10px] font-semibold rounded-[4px] inline-block mb-3 ${
                    req.status === 'PENDING'
                      ? 'bg-[#fff3cd] text-[#856404]'
                      : req.status === 'ACCEPTED'
                        ? 'bg-[#d1e7dd] text-[#0f5132]'
                        : 'bg-[#f8d7da] text-[#842029]'
                  }`}
                >
                  {req.status === 'PENDING' ? '대기중' : req.status === 'ACCEPTED' ? '승인됨' : '거절됨'}
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleUpdateParticipationStatus(req.id, 'ACCEPTED')}
                      disabled={updatingReqId === req.id}
                      className="flex-1 text-[11px]"
                    >
                      {updatingReqId === req.id ? '처리 중...' : '승인'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleUpdateParticipationStatus(req.id, 'REJECTED')}
                      disabled={updatingReqId === req.id}
                      variant="secondary"
                      className="flex-1 text-[11px]"
                    >
                      {updatingReqId === req.id ? '처리 중...' : '거절'}
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <EmptyState
              title={EMPTY_MESSAGES.requests.title}
              actions={[
                {
                  label: EMPTY_MESSAGES.requests.cta,
                  href: '/mates',
                },
              ]}
            />
          )}
        </div>
      )}

      {/* Favorites */}
      {tab === 'favorites' && (
        <div className="space-y-3">
          {favoriteDestinations.length > 0 ? (
            <div className="text-[12px] text-[#666]">
              <p className="mb-3">즐겨찾기한 {favoriteDestinations.length}개 여행지</p>
              <div className="space-y-2">
                {favoriteDestinations.slice(0, 10).map((slug, i) => (
                  <div
                    key={slug}
                    className="p-2 bg-[#f7f6f4] rounded-[6px] border border-[#e5e3e0]"
                  >
                    <p className="text-[11px] text-[#262626]">{slug}</p>
                  </div>
                ))}
              </div>
              {favoriteDestinations.length > 10 && (
                <p className="text-[11px] text-[#999] mt-2">외 {favoriteDestinations.length - 10}개</p>
              )}
            </div>
          ) : (
            <EmptyState
              title={EMPTY_MESSAGES.favorites.title}
              actions={[
                {
                  label: EMPTY_MESSAGES.favorites.cta,
                  href: '/',
                },
              ]}
            />
          )}
        </div>
      )}

      {/* Blocked Users */}
      {tab === 'blocked' && (
        <div className="space-y-3">
          {blockedUsers.length > 0 ? (
            blockedUsers.map((block) => (
              <div
                key={block.id}
                className="border border-[#e5e3e0] rounded-[8px] p-4 bg-white flex items-center justify-between"
              >
                <p className="text-[12px] text-[#262626]">
                  {block.blocked_user_id.slice(0, 8)}... 차단됨
                </p>
                <Button
                  type="button"
                  onClick={() => handleUnblockUser(block.blocked_user_id)}
                  disabled={unblockingUserId === block.blocked_user_id}
                  variant="secondary"
                  className="text-[11px]"
                >
                  {unblockingUserId === block.blocked_user_id ? '해제 중...' : '차단 해제'}
                </Button>
              </div>
            ))
          ) : (
            <EmptyState
              title={EMPTY_MESSAGES.blocked.title}
              actions={[
                {
                  label: EMPTY_MESSAGES.blocked.cta,
                  href: '/account',
                },
              ]}
            />
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
