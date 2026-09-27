'use client';

import { MatePost } from '@/lib/db';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostDetailProps {
  post: MatePost | null;
  onClose?: () => void;
  isDrawer?: boolean;
}

export function PostDetail({ post, onClose, isDrawer = false }: PostDetailProps) {
  if (!post) {
    return (
      <div className={`${isDrawer ? 'p-6' : 'p-4'} text-center text-[#767676]`}>
        <p className="text-[14px]">동행글을 선택해주세요.</p>
      </div>
    );
  }

  const startDate = new Date(post.start_date);
  const endDate = new Date(post.end_date);
  const formattedStartDate = format(startDate, 'yyyy년 M월 d일', { locale: ko });
  const formattedEndDate = format(endDate, 'M월 d일', { locale: ko });

  const statusLabel = {
    OPEN: '모집 중',
    CLOSED: '모집 완료',
    FULL: '인원 가득',
  }[post.status];

  const statusColor = {
    OPEN: 'bg-[#f0f9ff] text-[#1d4ed8]',
    CLOSED: 'bg-[#fef3f2] text-[#d7263d]',
    FULL: 'bg-[#fef3f2] text-[#d7263d]',
  }[post.status];

  return (
    <div className={`${isDrawer ? 'space-y-6 p-6' : 'space-y-4 p-4 border-l border-[#e5e3e0]'} h-full overflow-y-auto`}>
      {/* Header */}
      {isDrawer && onClose && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[#262626]">동행글 상세</h3>
          <button
            onClick={onClose}
            className="text-[20px] text-[#767676] hover:text-[#262626]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* Title */}
      <div>
        <h2 className="text-[18px] font-semibold text-[#262626] line-clamp-2">
          {post.title}
        </h2>
      </div>

      {/* Status Badge */}
      <div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-[12px] font-medium ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Key Info */}
      <div className="grid grid-cols-2 gap-3 bg-[#f7f6f4] rounded-[8px] p-4">
        <div>
          <p className="text-[11px] text-[#767676] font-semibold mb-1">국가·지역</p>
          <p className="text-[13px] font-medium text-[#262626]">
            {post.country}
            {post.region && `, ${post.region}`}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-[#767676] font-semibold mb-1">모집인원</p>
          <p className="text-[13px] font-medium text-[#262626]">
            {post.recruitment_count}명
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] text-[#767676] font-semibold mb-1">여행 기간</p>
          <p className="text-[13px] font-medium text-[#262626]">
            {formattedStartDate} ~ {formattedEndDate}
          </p>
        </div>
      </div>

      {/* Description */}
      {post.description && (
        <div>
          <h4 className="text-[12px] font-semibold text-[#262626] mb-2">설명</h4>
          <p className="text-[13px] text-[#262626] whitespace-pre-wrap">
            {post.description}
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="border-t border-[#e5e3e0] pt-4 mt-auto">
        <p className="text-[12px] text-[#767676] mb-3">
          동행글에 관심이 있으신가요? 신청하기를 눌러 작성자에게 메시지를 보내세요.
        </p>
      </div>
    </div>
  );
}
