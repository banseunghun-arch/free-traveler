'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Toast } from '@/components/shared/Toast';
import { getBrowserClient } from '@/lib/supabase-browser';
import type { Profile } from '@/lib/db';

const AGE_GROUPS = ['20-24', '25-29', '30-34', '35-39', '40-49', '50+'];
const GENDERS = ['남성', '여성'];
const STYLES = ['개인여행', '단체여행', '액티브', '힐링', '문화탐방', '음식투어'];

export function ProfileSummary() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [style, setStyle] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const client = getBrowserClient();
        const { data: user } = await client.auth.getUser();

        if (!user?.user?.id) {
          setToast({ type: 'error', message: '사용자 정보를 불러올 수 없습니다.' });
          return;
        }

        const { data: prof, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', user.user.id)
          .single();

        if (error) throw error;

        const p = prof as Profile;
        setProfile(p);
        setNickname(p.nickname || '');
        setAgeGroup(p.age_group || '');
        setGender(p.gender || '');
        setStyle(p.style || '');
        setBio(p.bio || '');
      } catch (error) {
        const message = error instanceof Error ? error.message : '프로필을 불러올 수 없습니다.';
        setToast({ type: 'error', message });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';
    if (!ageGroup) newErrors.ageGroup = '연령대를 선택해주세요.';
    if (!style) newErrors.style = '여행 스타일을 선택해주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const client = getBrowserClient();
      const { data: user } = await client.auth.getUser();

      if (!user?.user?.id) throw new Error('사용자 정보를 확인할 수 없습니다.');

      const { data: updated, error } = await client
        .from('profiles')
        .update({
          nickname: nickname.trim(),
          age_group: ageGroup,
          gender: gender || null,
          style: style,
          bio: bio.trim() || null,
        })
        .eq('id', user.user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(updated as Profile);
      setEditing(false);
      setToast({ type: 'success', message: '프로필이 저장되었습니다.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '저장에 실패했습니다.';
      setToast({ type: 'error', message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-[13px] text-[#666]">프로필을 로드 중입니다...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8 text-[13px] text-[#d7263d]">프로필을 찾을 수 없습니다.</div>;
  }

  if (!editing) {
    return (
      <div className="space-y-4">
        {/* Profile Summary */}
        <div className="border border-[#e5e3e0] rounded-[8px] p-4 bg-white">
          <h3 className="text-[14px] font-bold text-[#262626] mb-3">프로필</h3>

          <div className="space-y-3 text-[12px]">
            <div>
              <p className="text-[11px] font-semibold text-[#666] mb-1">닉네임</p>
              <p className="text-[#262626]">{profile.nickname || '미설정'}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#666] mb-1">연령대</p>
              <p className="text-[#262626]">{profile.age_group || '미설정'}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#666] mb-1">성별</p>
              <p className="text-[#262626]">{profile.gender || '미설정'}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#666] mb-1">여행 스타일</p>
              <p className="text-[#262626]">{profile.style || '미설정'}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#666] mb-1">소개</p>
              <p className="text-[#262626]">{profile.bio || '없음'}</p>
            </div>
          </div>
        </div>

        {/* Adult Verification */}
        <div
          className={`border rounded-[8px] p-4 ${
            profile.is_adult
              ? 'border-[#d1e7dd] bg-[#f1f9f6]'
              : 'border-[#fef3f2] bg-[#fefaf9]'
          }`}
        >
          <h3 className="text-[14px] font-bold mb-2">성인 확인</h3>
          <p className={`text-[12px] ${profile.is_adult ? 'text-[#0f5132]' : 'text-[#662d11]'}`}>
            {profile.is_adult
              ? `✓ 확인됨 (${profile.adult_verified_at ? new Date(profile.adult_verified_at).toLocaleDateString('ko-KR') : '-'})`
              : '미확인 — 동행글 작성 시 확인이 필요합니다.'}
          </p>
        </div>

        <Button onClick={() => setEditing(true)} className="w-full">
          프로필 수정
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f6f4] rounded-[8px] p-6 space-y-4">
      <h3 className="text-[14px] font-bold text-[#262626]">프로필 수정</h3>

      <div>
        <label className="text-[12px] font-semibold text-[#262626] block mb-1">
          닉네임 <span className="text-[#d7263d]">*</span>
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            if (errors.nickname) setErrors({ ...errors, nickname: '' });
          }}
          placeholder="여행자 닉네임"
          className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
        />
        {errors.nickname && (
          <p className="text-[11px] text-[#d7263d] mt-1">{errors.nickname}</p>
        )}
      </div>

      <div>
        <label className="text-[12px] font-semibold text-[#262626] block mb-1">
          연령대 <span className="text-[#d7263d]">*</span>
        </label>
        <select
          value={ageGroup}
          onChange={(e) => {
            setAgeGroup(e.target.value);
            if (errors.ageGroup) setErrors({ ...errors, ageGroup: '' });
          }}
          className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
        >
          <option value="">선택</option>
          {AGE_GROUPS.map((ag) => (
            <option key={ag} value={ag}>
              {ag}
            </option>
          ))}
        </select>
        {errors.ageGroup && (
          <p className="text-[11px] text-[#d7263d] mt-1">{errors.ageGroup}</p>
        )}
      </div>

      <div>
        <label className="text-[12px] font-semibold text-[#262626] block mb-1">
          성별 <span className="text-[#999]">(선택)</span>
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
        >
          <option value="">미설정</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[12px] font-semibold text-[#262626] block mb-1">
          여행 스타일 <span className="text-[#d7263d]">*</span>
        </label>
        <select
          value={style}
          onChange={(e) => {
            setStyle(e.target.value);
            if (errors.style) setErrors({ ...errors, style: '' });
          }}
          className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
        >
          <option value="">선택</option>
          {STYLES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.style && (
          <p className="text-[11px] text-[#d7263d] mt-1">{errors.style}</p>
        )}
      </div>

      <div>
        <label className="text-[12px] font-semibold text-[#262626] block mb-1">
          소개 <span className="text-[#999]">(선택)</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="나의 여행 철학, 함께하고 싶은 사람들에 대해 이야기해주세요."
          className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[12px] resize-none h-20"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex-1"
        >
          {saving ? '저장 중...' : '저장'}
        </Button>
        <Button
          onClick={() => {
            setEditing(false);
            setNickname(profile.nickname || '');
            setAgeGroup(profile.age_group || '');
            setGender(profile.gender || '');
            setStyle(profile.style || '');
            setBio(profile.bio || '');
            setErrors({});
          }}
          variant="secondary"
          className="flex-1"
        >
          취소
        </Button>
      </div>

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
