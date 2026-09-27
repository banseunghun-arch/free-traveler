'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { FormField } from '@/components/shared/FormField';
import { ParticipationRequest } from '@/lib/db';

interface ApplyFlowProps {
  matePostId: string;
  existingRequest?: ParticipationRequest;
  onSubmitSuccess?: () => void;
}

export function ApplyFlow({
  matePostId,
  existingRequest,
  onSubmitSuccess,
}: ApplyFlowProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const MAX_LENGTH = 500;
  const hasExistingRequest = existingRequest &&
    (existingRequest.status === 'PENDING' || existingRequest.status === 'ACCEPTED');
  const isDisabled = hasExistingRequest || isLoading;
  const charCount = message.length;
  const isOverLimit = charCount > MAX_LENGTH;

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('메시지를 입력해주세요.');
      return;
    }

    if (message.length > MAX_LENGTH) {
      setError(`500자 이내로 작성해주세요. (현재 ${charCount}자)`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mate_post_id: matePostId,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const { error: apiError } = await response.json();
        throw new Error(apiError || '신청에 실패했습니다.');
      }

      setSuccess(true);
      setMessage('');
      onSubmitSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : '신청 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasExistingRequest) {
    return (
      <div className="space-y-4">
        <div className="bg-[#fef3f2] border border-[#fed7d3] rounded-[8px] p-4">
          <p className="text-[14px] font-medium text-[#d7263d]">
            이미 신청하신 요청이 있습니다.
          </p>
          <p className="text-[12px] text-[#767676] mt-1">
            {existingRequest.status === 'PENDING' && '작성자의 승인을 기다리고 있습니다.'}
            {existingRequest.status === 'ACCEPTED' && '신청이 승인되었습니다.'}
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[#f0f9ff] border border-[#bfdbfe] rounded-[8px] p-4">
        <p className="text-[14px] font-medium text-[#1d4ed8]">
          신청이 완료되었습니다!
        </p>
        <p className="text-[12px] text-[#767676] mt-1">
          작성자의 답변을 기다려주세요. 계정 페이지에서 신청 상태를 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 3단계 안내 */}
      <div className="space-y-2">
        <h3 className="text-[14px] font-semibold text-[#262626]">
          참가 신청 방법
        </h3>
        <ol className="space-y-2">
          {[
            { step: 1, text: '동행글의 조건을 확인하세요.' },
            { step: 2, text: '비공개 메시지로 동행자에게 인사하세요.' },
            { step: 3, text: '작성자가 승인하면 참가가 확정됩니다.' },
          ].map(({ step, text }) => (
            <li key={step} className="flex gap-2 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d03e1b] text-white text-[12px] font-semibold flex items-center justify-center">
                {step}
              </span>
              <span className="text-[13px] text-[#262626] pt-0.5">
                {text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* 메시지 입력 폼 */}
      <FormField
        label="소개 메시지"
        inputId="apply-message"
        error={error || (isOverLimit ? `500자 이내로 작성해주세요. (현재 ${charCount}자)` : undefined)}
        helperText={!isOverLimit ? `${charCount} / ${MAX_LENGTH}자` : undefined}
      >
        <textarea
          id="apply-message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setError(null);
          }}
          disabled={isDisabled}
          placeholder="동행자에게 인사하고 함께 가고 싶은 이유를 알려주세요."
          className={`w-full px-3 py-2 border rounded-[8px] text-[14px] resize-none h-[120px] ${
            isOverLimit || error ? 'border-[#d7263d]' : 'border-[#e5e3e0]'
          } focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:ring-offset-2 disabled:bg-[#f7f6f4] disabled:cursor-not-allowed`}
        />
      </FormField>

      {/* 제출 버튼 */}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isDisabled || !message.trim() || isOverLimit}
        className="w-full"
      >
        {isLoading ? '신청 중...' : '신청하기'}
      </Button>
    </div>
  );
}
