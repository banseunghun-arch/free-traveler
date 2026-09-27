'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Toast } from '@/components/shared/Toast';

interface ReportBlockPanelProps {
  targetPostId: string;
  targetAuthorId: string;
  isBlocked?: boolean;
  onBlockChange?: (isBlocked: boolean) => void;
}

const REPORT_REASONS = [
  { code: 'inappropriate', label: '부적절한 콘텐츠' },
  { code: 'spam', label: '스팸' },
  { code: 'scam', label: '사기 의심' },
  { code: 'harassment', label: '괴롭힘' },
  { code: 'other', label: '기타' },
];

export function ReportBlockPanel({
  targetPostId,
  targetAuthorId,
  isBlocked = false,
  onBlockChange,
}: ReportBlockPanelProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isBlockingUser, setIsBlockingUser] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      setToast({ type: 'error', message: '신고 사유를 선택해주세요.' });
      return;
    }

    setIsSubmittingReport(true);
    try {
      const response = await fetch('/api/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: 'mate_post',
          target_id: targetPostId,
          reason: reportReason,
          description: reportDescription.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('신고 접수에 실패했습니다.');
      }

      const { id: reportId } = await response.json();
      setToast({
        type: 'success',
        message: `신고가 접수되었습니다. (접수번호: ${reportId.slice(0, 8)}...)`,
      });
      setIsReportOpen(false);
      setReportReason('');
      setReportDescription('');
    } catch (err) {
      const message = err instanceof Error ? err.message : '신고 중 오류가 발생했습니다.';
      setToast({ type: 'error', message });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleBlockToggle = async () => {
    setIsBlockingUser(true);
    try {
      const response = await fetch('/api/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isBlocked ? 'unblock' : 'block',
          target_user_id: targetAuthorId,
        }),
      });

      if (!response.ok) {
        throw new Error(isBlocked ? '차단 해제에 실패했습니다.' : '차단에 실패했습니다.');
      }

      const newBlockedState = !isBlocked;
      onBlockChange?.(newBlockedState);
      setToast({
        type: 'success',
        message: newBlockedState ? '사용자를 차단했습니다.' : '사용자 차단이 해제되었습니다.',
      });
      setShowBlockConfirm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : '차단 처리 중 오류가 발생했습니다.';
      setToast({ type: 'error', message });
    } finally {
      setIsBlockingUser(false);
    }
  };

  return (
    <>
      {/* Safety Banner */}
      <div className="bg-[#fef3f2] border border-[#fed7d3] rounded-[8px] p-4 mb-4">
        <h4 className="text-[13px] font-semibold text-[#d7263d] mb-2">
          안전한 동행을 위해
        </h4>
        <ul className="text-[12px] text-[#262626] space-y-1 mb-3">
          <li>• 개인 연락처는 신청 후 메시지로만 공유하세요.</li>
          <li>• 먼저 카페나 공개 장소에서 만나 상호 확인하세요.</li>
          <li>• 의심되는 사용자는 즉시 신고해주세요.</li>
        </ul>
        <a
          href="/travel-tools?tab=mate"
          className="inline-block text-[12px] font-medium text-[#d03e1b] hover:underline"
        >
          여행 조건도 함께 정리하기 →
        </a>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 flex flex-col">
        <Button
          type="button"
          onClick={() => setIsReportOpen(!isReportOpen)}
          variant="secondary"
          className="w-full"
          disabled={isSubmittingReport}
        >
          신고
        </Button>
        <Button
          type="button"
          onClick={() => setShowBlockConfirm(true)}
          variant="secondary"
          className="w-full"
          disabled={isBlockingUser || showBlockConfirm}
        >
          {isBlocked ? '차단 해제' : '차단'}
        </Button>
      </div>

      {/* Report Form */}
      {isReportOpen && (
        <div className="mt-4 p-4 bg-[#f7f6f4] rounded-[8px] space-y-3">
          <div>
            <label className="text-[12px] font-semibold text-[#262626] block mb-2">
              신고 사유
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
            >
              <option value="">선택</option>
              {REPORT_REASONS.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#262626] block mb-2">
              설명 (선택)
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="자세한 사항을 입력해주세요."
              className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[12px] resize-none h-20"
            />
          </div>
          <Button
            type="button"
            onClick={handleReportSubmit}
            disabled={isSubmittingReport || !reportReason}
            className="w-full"
          >
            {isSubmittingReport ? '제출 중...' : '신고 제출'}
          </Button>
        </div>
      )}

      {/* Block Confirmation */}
      {showBlockConfirm && (
        <div className="mt-4 p-4 bg-[#fef3f2] border border-[#fed7d3] rounded-[8px] space-y-3">
          <p className="text-[12px] text-[#262626]">
            {isBlocked
              ? '이 사용자의 차단을 해제하시겠어요?'
              : '이 사용자를 차단하면 서로의 글이 노출되지 않습니다.'}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setShowBlockConfirm(false)}
              variant="secondary"
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleBlockToggle}
              disabled={isBlockingUser}
              className="flex-1"
            >
              {isBlockingUser ? '처리 중...' : '확인'}
            </Button>
          </div>
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
    </>
  );
}
