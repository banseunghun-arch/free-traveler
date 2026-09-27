'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Toast } from '@/components/shared/Toast';
import { getBrowserClient } from '@/lib/supabase-browser';
import type { Report, ExternalUrl } from '@/lib/db';

type ReportStatus = 'OPEN' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED';
type UrlKey = 'flight' | 'hotel' | 'sns';

const STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: '대기중',
  REVIEWING: '검토중',
  RESOLVED: '해결됨',
  DISMISSED: '기각됨',
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  OPEN: 'bg-[#fff3cd] text-[#856404]',
  REVIEWING: 'bg-[#cfe2ff] text-[#084298]',
  RESOLVED: 'bg-[#d1e7dd] text-[#0f5132]',
  DISMISSED: 'bg-[#e2e3e5] text-[#383d41]',
};

const URL_KEY_LABELS: Record<UrlKey, string> = {
  flight: '항공편',
  hotel: '호텔',
  sns: 'SNS',
};

export function AdminPanel() {
  const [reports, setReports] = useState<Report[]>([]);
  const [externalUrls, setExternalUrls] = useState<ExternalUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>('OPEN');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Report state
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [resolutionReason, setResolutionReason] = useState('');
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);

  // URL form state
  const [urlFormData, setUrlFormData] = useState<Record<UrlKey, string>>({
    flight: '',
    hotel: '',
    sns: '',
  });
  const [urlErrors, setUrlErrors] = useState<Record<UrlKey, string>>({
    flight: '',
    hotel: '',
    sns: '',
  });
  const [savingUrl, setSavingUrl] = useState<UrlKey | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const client = getBrowserClient();

        // Fetch reports from database (RLS will enforce admin-only access)
        const { data: reportsData, error: reportsError } = await client
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (reportsError) throw new Error('신고 목록을 불러올 수 없습니다.');
        setReports(reportsData as Report[]);

        // Fetch external URLs
        const urlsRes = await fetch('/api/admin/urls');
        if (!urlsRes.ok) throw new Error('Failed to fetch URLs');
        const urlsData = await urlsRes.json();
        const urls = urlsData.data || [];

        // Populate form with existing URLs
        const urlMap: Record<UrlKey, string> = {
          flight: '',
          hotel: '',
          sns: '',
        };
        urls.forEach((url: ExternalUrl) => {
          urlMap[url.key] = url.url;
        });
        setUrlFormData(urlMap);
        setExternalUrls(urls);
      } catch (error) {
        const message = error instanceof Error ? error.message : '데이터를 불러올 수 없습니다.';
        setToast({ type: 'error', message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredReports = reports.filter((r) => r.status === selectedStatus);

  const handleReportStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    if (!resolutionReason.trim() && newStatus !== 'OPEN') {
      setToast({ type: 'error', message: '처리 사유를 입력해주세요.' });
      return;
    }

    setUpdatingReportId(reportId);
    try {
      const client = getBrowserClient();
      const { data: updatedReport, error } = await client
        .from('reports')
        .update({
          status: newStatus,
          resolution_reason: resolutionReason.trim() || null,
          resolved_at: newStatus !== 'OPEN' ? new Date().toISOString() : null,
        })
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? (updatedReport as Report) : r))
      );
      setToast({ type: 'success', message: '신고 상태가 변경되었습니다.' });
      setExpandedReportId(null);
      setResolutionReason('');
    } catch (error) {
      const message = error instanceof Error ? error.message : '상태 변경 중 오류가 발생했습니다.';
      setToast({ type: 'error', message });
    } finally {
      setUpdatingReportId(null);
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    if (!url.startsWith('https://')) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (key: UrlKey, value: string) => {
    setUrlFormData((prev) => ({ ...prev, [key]: value }));
    setUrlErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSaveUrl = async (key: UrlKey) => {
    const url = urlFormData[key].trim();

    if (!url) {
      setToast({ type: 'error', message: 'URL을 입력해주세요.' });
      return;
    }

    if (!validateUrl(url)) {
      setUrlErrors((prev) => ({
        ...prev,
        [key]: 'HTTPS로 시작하는 유효한 URL을 입력해주세요.',
      }));
      return;
    }

    setSavingUrl(key);
    try {
      const method = externalUrls.some((u) => u.key === key) ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/urls', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, url }),
      });

      if (!response.ok) throw new Error('URL 저장에 실패했습니다.');

      const { data: savedUrl } = await response.json();
      setExternalUrls((prev) => {
        const existing = prev.findIndex((u) => u.key === key);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = savedUrl;
          return updated;
        }
        return [...prev, savedUrl];
      });
      setToast({ type: 'success', message: `${URL_KEY_LABELS[key]} URL이 저장되었습니다.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'URL 저장 중 오류가 발생했습니다.';
      setToast({ type: 'error', message });
    } finally {
      setSavingUrl(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-[13px] text-[#666]">관리자 데이터를 로드 중입니다...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Report Queue Section */}
      <section>
        <h3 className="text-[16px] font-bold text-[#262626] mb-4">신고 큐</h3>

        {/* Status Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(Object.keys(STATUS_LABELS) as ReportStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-[#d03e1b] text-white'
                  : 'bg-[#f7f6f4] text-[#262626] hover:bg-[#e5e3e0] border border-[#e5e3e0]'
              }`}
            >
              {STATUS_LABELS[status]} ({reports.filter((r) => r.status === status).length})
            </button>
          ))}
        </div>

        {/* Report List */}
        <div className="space-y-2">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="border border-[#e5e3e0] rounded-[8px] p-4 bg-white"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-[12px] text-[#666] mb-1">
                      신고ID: {report.id.slice(0, 8)}... | 대상: {report.target_type}
                    </p>
                    <p className="text-[13px] text-[#262626]">{report.reason}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-[4px] text-[11px] font-medium whitespace-nowrap ${
                      STATUS_COLORS[report.status]
                    }`}
                  >
                    {STATUS_LABELS[report.status]}
                  </div>
                </div>

                {/* Expanded view */}
                {expandedReportId === report.id && (
                  <div className="mt-3 pt-3 border-t border-[#e5e3e0] space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#666] block mb-1">
                        담당자 ID
                      </label>
                      <p className="text-[12px] text-[#262626]">
                        {report.assigned_to ? report.assigned_to.slice(0, 8) + '...' : '미할당'}
                      </p>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#666] block mb-2">
                        처리 사유
                      </label>
                      <textarea
                        value={resolutionReason}
                        onChange={(e) => setResolutionReason(e.target.value)}
                        placeholder="처리 내용을 입력해주세요."
                        className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[12px] resize-none h-16"
                      />
                    </div>

                    <div className="flex gap-2">
                      {(Object.keys(STATUS_LABELS) as ReportStatus[])
                        .filter((s) => s !== report.status)
                        .map((status) => (
                          <Button
                            key={status}
                            type="button"
                            onClick={() => handleReportStatusChange(report.id, status)}
                            disabled={updatingReportId === report.id}
                            variant="secondary"
                            className="flex-1 text-[12px]"
                          >
                            {updatingReportId === report.id
                              ? '처리 중...'
                              : `→ ${STATUS_LABELS[status]}`}
                          </Button>
                        ))}
                      <Button
                        type="button"
                        onClick={() => {
                          setExpandedReportId(null);
                          setResolutionReason('');
                        }}
                        variant="secondary"
                        className="flex-1 text-[12px]"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                )}

                {expandedReportId !== report.id && (
                  <button
                    onClick={() => {
                      setExpandedReportId(report.id);
                      setResolutionReason(report.resolution_reason || '');
                    }}
                    className="mt-2 text-[12px] text-[#d03e1b] hover:underline font-medium"
                  >
                    상태 변경하기
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-[12px] text-[#999] py-4">
              {selectedStatus === 'OPEN'
                ? '대기중인 신고가 없습니다.'
                : `${STATUS_LABELS[selectedStatus]} 상태의 신고가 없습니다.`}
            </p>
          )}
        </div>
      </section>

      {/* External URL Settings Section */}
      <section>
        <h3 className="text-[16px] font-bold text-[#262626] mb-4">외부 URL 설정</h3>
        <div className="space-y-4">
          {(Object.keys(URL_KEY_LABELS) as UrlKey[]).map((key) => (
            <div key={key} className="border border-[#e5e3e0] rounded-[8px] p-4 bg-white">
              <label className="text-[12px] font-semibold text-[#262626] block mb-2">
                {URL_KEY_LABELS[key]} URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlFormData[key]}
                  onChange={(e) => handleUrlChange(key, e.target.value)}
                  placeholder={`https://example.com (${URL_KEY_LABELS[key]} 링크)`}
                  className="flex-1 px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
                />
                <Button
                  type="button"
                  onClick={() => handleSaveUrl(key)}
                  disabled={savingUrl === key || !urlFormData[key].trim()}
                  className="text-[12px]"
                >
                  {savingUrl === key ? '저장 중...' : '저장'}
                </Button>
              </div>
              {urlErrors[key] && (
                <p className="text-[11px] text-[#d7263d] mt-1">{urlErrors[key]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

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
