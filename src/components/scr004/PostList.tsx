'use client';

import { useState } from 'react';
import { MatePost } from '@/lib/db';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostListProps {
  posts: MatePost[];
  selectedPostId?: string;
  onSelectPost: (post: MatePost) => void;
  isLoading?: boolean;
}

const POSTS_PER_PAGE = 8;

export function PostList({
  posts,
  selectedPostId,
  onSelectPost,
  isLoading = false,
}: PostListProps) {
  const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE);

  const displayedPosts = posts.slice(0, displayCount);
  const hasMore = displayCount < posts.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + POSTS_PER_PAGE);
  };

  const isPostClosed = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getStatusLabel = (post: MatePost) => {
    if (post.status === 'FULL') return '인원 가득';
    if (isPostClosed(post.end_date)) return '모집 완료';
    return '모집 중';
  };

  const getStatusColor = (post: MatePost) => {
    if (post.status === 'FULL' || isPostClosed(post.end_date)) {
      return 'bg-[#fef3f2] text-[#d7263d]';
    }
    return 'bg-[#f0f9ff] text-[#1d4ed8]';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(POSTS_PER_PAGE)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#f7f6f4] rounded-[8px] h-24"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[14px] font-medium text-[#262626]">
          조건에 맞는 동행글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedPosts.map(post => (
        <button
          key={post.id}
          onClick={() => onSelectPost(post)}
          className={`w-full text-left p-4 rounded-[8px] border-2 transition-colors ${
            selectedPostId === post.id
              ? 'border-[#d03e1b] bg-[#fff5f3]'
              : 'border-[#e5e3e0] bg-white hover:bg-[#f7f6f4]'
          }`}
        >
          {/* Title and Status */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[14px] font-semibold text-[#262626] line-clamp-2 flex-1">
              {post.title}
            </h3>
            <span
              className={`flex-shrink-0 px-2 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${getStatusColor(
                post
              )}`}
            >
              {getStatusLabel(post)}
            </span>
          </div>

          {/* Location and Dates */}
          <p className="text-[12px] text-[#767676] mb-2">
            {post.country}
            {post.region && `, ${post.region}`}
          </p>

          {/* Recruitment Info */}
          <div className="flex items-center gap-2 text-[12px] text-[#262626]">
            <span>📅 {format(new Date(post.start_date), 'MM.dd', { locale: ko })} ~ {format(new Date(post.end_date), 'MM.dd', { locale: ko })}</span>
            <span>👥 {post.recruitment_count}명</span>
          </div>
        </button>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full py-3 text-center text-[13px] font-medium text-[#d03e1b] hover:bg-[#fef3f2] rounded-[8px] border border-[#e5e3e0]"
        >
          더 보기 ({displayCount} / {posts.length})
        </button>
      )}
    </div>
  );
}
