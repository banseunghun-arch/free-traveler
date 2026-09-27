'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Toast } from '@/components/shared/Toast';
import { signUpWithEmail, signInWithEmail, resetPassword } from '@/lib/auth';

type FormMode = 'login' | 'signup' | 'reset';

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  general?: string;
}

const PASSWORD_RULES = [
  '8자 이상',
  '영문, 숫자 포함',
  '특수문자 권장 (!@#$%^&*)',
];

const FEATURES_AFTER_LOGIN = [
  { icon: '✎', title: '동행글 작성', desc: '함께 여행할 사람을 찾아보세요.' },
  { icon: '✓', title: '참가 신청', desc: '관심 있는 동행글에 참가를 신청할 수 있습니다.' },
  { icon: '★', title: '여행지 즐겨찾기', desc: '마음에 드는 여행지를 저장해두세요.' },
  { icon: '◉', title: '안전한 커뮤니티', desc: '차단·신고로 안전한 환경을 만듭니다.' },
];

export function AuthPanel() {
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!email.trim()) newErrors.email = '이메일을 입력해주세요.';
    else if (!validateEmail(email)) newErrors.email = '유효한 이메일 주소를 입력해주세요.';

    if (!password) newErrors.password = '비밀번호를 입력해주세요.';
    else if (!validatePassword(password)) newErrors.password = '8자 이상, 영문·숫자 포함이 필요합니다.';

    if (!passwordConfirm) newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    else if (password !== passwordConfirm) newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await signUpWithEmail(email, password);
      setEmailVerificationSent(true);
      setToast({
        type: 'success',
        message: '회원가입 링크가 이메일로 발송되었습니다. 이메일을 확인해주세요.',
      });
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
    } catch (error) {
      const message = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!email.trim()) newErrors.email = '이메일을 입력해주세요.';
    else if (!validateEmail(email)) newErrors.email = '유효한 이메일 주소를 입력해주세요.';

    if (!password) newErrors.password = '비밀번호를 입력해주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await signInWithEmail(email, password);
      setToast({ type: 'success', message: '로그인되었습니다.' });
      setEmail('');
      setPassword('');
      window.location.href = '/account';
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!email.trim()) newErrors.email = '이메일을 입력해주세요.';
    else if (!validateEmail(email)) newErrors.email = '유효한 이메일 주소를 입력해주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await resetPassword(email);
      setResetSent(true);
      setToast({
        type: 'success',
        message: '비밀번호 재설정 링크가 이메일로 발송되었습니다.',
      });
      setEmail('');
    } catch (error) {
      const message = error instanceof Error ? error.message : '비밀번호 재설정 요청에 실패했습니다.';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <section className="text-center mb-6">
        <h2 className="text-[18px] font-bold text-[#262626] mb-2">
          로그인하여 더 많은 기능을 이용하세요
        </h2>
        <p className="text-[13px] text-[#666]">
          동행글 작성, 참가 신청, 여행지 저장 등 모든 기능을 사용할 수 있습니다.
        </p>
      </section>

      {/* Mode Tabs */}
      <div className="flex gap-2 border-b border-[#e5e3e0]">
        {(['login', 'signup', 'reset'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setErrors({});
              setEmail('');
              setPassword('');
              setPasswordConfirm('');
              setEmailVerificationSent(false);
              setResetSent(false);
            }}
            className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
              mode === m
                ? 'text-[#d03e1b] border-[#d03e1b]'
                : 'text-[#666] border-transparent hover:text-[#262626]'
            }`}
          >
            {m === 'login' && '로그인'}
            {m === 'signup' && '가입'}
            {m === 'reset' && '비밀번호 재설정'}
          </button>
        ))}
      </div>

      {/* Forms */}
      <div className="bg-[#f7f6f4] rounded-[8px] p-6">
        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-[#262626] block mb-1">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
              />
              {errors.email && (
                <p className="text-[11px] text-[#d7263d] mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#262626] block mb-1">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
              />
              {errors.password && (
                <p className="text-[11px] text-[#d7263d] mt-1">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <div className="bg-[#fef3f2] border border-[#fed7d3] rounded-[6px] p-3">
                <p className="text-[12px] text-[#d7263d]">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>

            <p className="text-center text-[12px] text-[#666]">
              아직 계정이 없으신가요?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#d03e1b] font-medium hover:underline"
              >
                가입하기
              </button>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {mode === 'signup' && !emailVerificationSent && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-[#262626] block mb-1">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
              />
              {errors.email && (
                <p className="text-[11px] text-[#d7263d] mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#262626] block mb-1">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
              />
              {errors.password && (
                <p className="text-[11px] text-[#d7263d] mt-1">{errors.password}</p>
              )}
              <ul className="text-[11px] text-[#666] mt-2 space-y-1">
                {PASSWORD_RULES.map((rule, i) => (
                  <li key={i}>• {rule}</li>
                ))}
              </ul>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#262626] block mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  if (errors.passwordConfirm) setErrors({ ...errors, passwordConfirm: '' });
                }}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
              />
              {errors.passwordConfirm && (
                <p className="text-[11px] text-[#d7263d] mt-1">{errors.passwordConfirm}</p>
              )}
            </div>

            {errors.general && (
              <div className="bg-[#fef3f2] border border-[#fed7d3] rounded-[6px] p-3">
                <p className="text-[12px] text-[#d7263d]">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? '가입 중...' : '가입하기'}
            </Button>

            <p className="text-center text-[12px] text-[#666]">
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#d03e1b] font-medium hover:underline"
              >
                로그인
              </button>
            </p>
          </form>
        )}

        {/* Email Verification Sent */}
        {mode === 'signup' && emailVerificationSent && (
          <div className="text-center space-y-4">
            <div className="bg-[#d1e7dd] border border-[#badbcc] rounded-[8px] p-4">
              <p className="text-[13px] text-[#0f5132] font-medium mb-2">이메일 확인이 필요합니다</p>
              <p className="text-[12px] text-[#0f5132]">
                가입 링크가 <strong>{email}</strong>로 발송되었습니다. 이메일을 확인하고 링크를 클릭해주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-[#d03e1b] text-[12px] font-medium hover:underline"
            >
              로그인으로 돌아가기
            </button>
          </div>
        )}

        {/* Password Reset Form */}
        {mode === 'reset' && !resetSent && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-[12px] text-[#666] mb-4">
              등록하신 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
            </p>

            <div>
              <label className="text-[12px] font-semibold text-[#262626] block mb-1">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px]"
              />
              {errors.email && (
                <p className="text-[11px] text-[#d7263d] mt-1">{errors.email}</p>
              )}
            </div>

            {errors.general && (
              <div className="bg-[#fef3f2] border border-[#fed7d3] rounded-[6px] p-3">
                <p className="text-[12px] text-[#d7263d]">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? '발송 중...' : '재설정 링크 발송'}
            </Button>

            <p className="text-center text-[12px] text-[#666]">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#d03e1b] font-medium hover:underline"
              >
                로그인으로 돌아가기
              </button>
            </p>
          </form>
        )}

        {/* Reset Sent */}
        {mode === 'reset' && resetSent && (
          <div className="text-center space-y-4">
            <div className="bg-[#d1e7dd] border border-[#badbcc] rounded-[8px] p-4">
              <p className="text-[13px] text-[#0f5132] font-medium mb-2">확인 이메일이 발송되었습니다</p>
              <p className="text-[12px] text-[#0f5132]">
                비밀번호 재설정 링크가 <strong>{email}</strong>로 발송되었습니다. 이메일을 확인해주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-[#d03e1b] text-[12px] font-medium hover:underline"
            >
              로그인으로 돌아가기
            </button>
          </div>
        )}
      </div>

      {/* Features After Login */}
      <section>
        <h3 className="text-[14px] font-bold text-[#262626] mb-3">로그인 후 이용 가능한 기능</h3>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES_AFTER_LOGIN.map((feature, i) => (
            <div key={i} className="border border-[#e5e3e0] rounded-[8px] p-3 bg-white">
              <p className="text-[20px] mb-1">{feature.icon}</p>
              <h4 className="text-[12px] font-semibold text-[#262626] mb-1">{feature.title}</h4>
              <p className="text-[11px] text-[#666]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Notice */}
      <section className="bg-[#fef3f2] border border-[#fed7d3] rounded-[8px] p-4">
        <h3 className="text-[13px] font-bold text-[#d7263d] mb-2">🔒 보안 안내</h3>
        <ul className="text-[11px] text-[#262626] space-y-1">
          <li>• 비밀번호는 암호화되어 저장됩니다. 절대 공유하지 마세요.</li>
          <li>• 의심되는 계정 활동이 있으면 즉시 비밀번호를 변경해주세요.</li>
          <li>• 공용 컴퓨터에서는 로그아웃 후 브라우저를 종료해주세요.</li>
        </ul>
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
