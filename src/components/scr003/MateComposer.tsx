"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase-browser";
import { destinations } from "@/data/destinations";
import { detectContactInfo, validateDates } from "@/lib/contact-detection";
import { Button } from "@/components/shared/Button";

interface MateComposerState {
  title: string;
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  recruitmentCount: string;
  description: string;
  agreeToSafety: boolean;
}

interface MateComposerErrors {
  title?: string;
  country?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  recruitmentCount?: string;
  description?: string;
  agreeToSafety?: string;
  contact?: string;
}

export function MateComposer() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<MateComposerState>({
    title: "",
    country: "",
    region: "",
    startDate: "",
    endDate: "",
    recruitmentCount: "",
    description: "",
    agreeToSafety: false,
  });

  const [errors, setErrors] = useState<MateComposerErrors>({});

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const client = getBrowserClient();
        const { data, error } = await client.auth.getUser();

        if (error || !data?.user) {
          setUser(null);
        } else {
          // Fetch profile to check adult status
          const { data: profileData } = await client
            .from("profiles")
            .select("is_adult")
            .eq("id", data.user.id)
            .single();

          setUser({
            id: data.user.id,
            email: data.user.email,
            isAdult: profileData?.is_adult || false,
          });
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const countries = useMemo(() => {
    const countrySet = new Set(destinations.map((d) => d.country));
    return Array.from(countrySet).sort();
  }, []);

  const regions = useMemo(() => {
    if (!formData.country) return [];
    return destinations
      .filter((d) => d.country === formData.country)
      .map((d) => d.name)
      .sort();
  }, [formData.country]);

  const validateForm = (): boolean => {
    const newErrors: MateComposerErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력하세요";
    }
    if (!formData.country) {
      newErrors.country = "국가를 선택하세요";
    }
    if (!formData.region) {
      newErrors.region = "도시/지역을 선택하세요";
    }
    if (!formData.startDate) {
      newErrors.startDate = "출발일을 선택하세요";
    } else {
      const startDate = new Date(formData.startDate);
      if (startDate < today) {
        newErrors.startDate = "과거 날짜는 선택할 수 없습니다";
      }
    }
    if (!formData.endDate) {
      newErrors.endDate = "귀국일을 선택하세요";
    } else if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = "귀국일은 출발일보다 뒤여야 합니다";
      }
      if (endDate.getTime() === startDate.getTime()) {
        newErrors.endDate = "귀국일과 출발일이 같을 수 없습니다";
      }
    }

    if (!formData.recruitmentCount) {
      newErrors.recruitmentCount = "모집인원을 입력하세요";
    } else {
      const count = parseInt(formData.recruitmentCount);
      if (isNaN(count) || count < 1) {
        newErrors.recruitmentCount = "1 이상의 숫자를 입력하세요";
      }
    }

    if (!formData.agreeToSafety) {
      newErrors.agreeToSafety = "안전수칙에 동의해야 작성할 수 있습니다";
    }

    // Check for contact info in description
    if (formData.description) {
      const contactResult = detectContactInfo(formData.description);
      if (contactResult.hasContacts) {
        newErrors.contact = "설명에 연락처 정보(전화번호, 이메일, 메신저ID)를 포함할 수 없습니다. 설명을 수정해주세요.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/mates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          country: formData.country,
          region: formData.region,
          start_date: formData.startDate,
          end_date: formData.endDate,
          recruitment_count: parseInt(formData.recruitmentCount),
          description: formData.description,
          safety_agreed_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ ...errors, contact: error.error || "작성 실패. 다시 시도해주세요." });
      } else {
        // Success - reset form
        setFormData({
          title: "",
          country: "",
          region: "",
          startDate: "",
          endDate: "",
          recruitmentCount: "",
          description: "",
          agreeToSafety: false,
        });
        setErrors({});
        // In a real app, would redirect or show success message
      }
    } catch (error) {
      setErrors({
        ...errors,
        contact: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="w-full bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="rounded-lg bg-white p-8 border border-gray-200 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              로그인이 필요합니다
            </h3>
            <p className="mt-3 text-base text-gray-600">
              동행글을 작성하려면 이메일로 로그인해주세요.
            </p>
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-center">
              <Link
                href="/account"
                className="inline-flex items-center justify-center rounded-lg bg-coral px-6 py-3 text-base font-semibold text-white hover:bg-coral-active transition-colors"
              >
                로그인 또는 가입 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!user.isAdult) {
    return (
      <section className="w-full bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="rounded-lg bg-white p-8 border border-gray-200 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              성인 확인이 필요합니다
            </h3>
            <p className="mt-3 text-base text-gray-600">
              동행글 작성은 성인 인증 후 가능합니다.
            </p>
            <div className="mt-6">
              <Link
                href="/account"
                className="inline-flex items-center justify-center rounded-lg bg-coral px-6 py-3 text-base font-semibold text-white hover:bg-coral-active transition-colors"
              >
                성인 인증하기 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              제목 <span className="text-coral">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 2025년 봄, 유럽 배낭여행 함께할 사람 구합니다"
              className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-danger focus:ring-danger/20"
                  : "border-gray-300 focus:border-coral focus:ring-coral/20"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger">{errors.title}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              국가 <span className="text-coral">*</span>
            </label>
            <select
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value, region: "" })
              }
              className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                errors.country
                  ? "border-danger focus:ring-danger/20"
                  : "border-gray-300 focus:border-coral focus:ring-coral/20"
              }`}
            >
              <option value="">국가를 선택하세요</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-danger">{errors.country}</p>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              도시/지역 <span className="text-coral">*</span>
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              disabled={!formData.country}
              className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                errors.region
                  ? "border-danger focus:ring-danger/20"
                  : "border-gray-300 focus:border-coral focus:ring-coral/20"
              }`}
            >
              <option value="">도시/지역을 선택하세요</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="mt-1 text-sm text-danger">{errors.region}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                출발일 <span className="text-coral">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors.startDate
                    ? "border-danger focus:ring-danger/20"
                    : "border-gray-300 focus:border-coral focus:ring-coral/20"
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-danger">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900">
                귀국일 <span className="text-coral">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors.endDate
                    ? "border-danger focus:ring-danger/20"
                    : "border-gray-300 focus:border-coral focus:ring-coral/20"
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-danger">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Recruitment Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              모집인원 <span className="text-coral">*</span>
            </label>
            <input
              type="number"
              value={formData.recruitmentCount}
              onChange={(e) =>
                setFormData({ ...formData, recruitmentCount: e.target.value })
              }
              placeholder="1"
              min="1"
              className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                errors.recruitmentCount
                  ? "border-danger focus:ring-danger/20"
                  : "border-gray-300 focus:border-coral focus:ring-coral/20"
              }`}
            />
            {errors.recruitmentCount && (
              <p className="mt-1 text-sm text-danger">{errors.recruitmentCount}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              설명 (선택)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="여행 스타일, 관심 있는 활동, 기타 정보를 공유하세요. 연락처 정보는 포함하지 마세요."
              rows={5}
              className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                errors.contact
                  ? "border-danger focus:ring-danger/20"
                  : "border-gray-300 focus:border-coral focus:ring-coral/20"
              }`}
            />
            {errors.contact && (
              <p className="mt-1 text-sm text-danger">{errors.contact}</p>
            )}
          </div>

          {/* Safety Agreement */}
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <input
              type="checkbox"
              id="agreeToSafety"
              checked={formData.agreeToSafety}
              onChange={(e) =>
                setFormData({ ...formData, agreeToSafety: e.target.checked })
              }
              className="mt-1 h-4 w-4 rounded cursor-pointer"
            />
            <label htmlFor="agreeToSafety" className="flex-1 cursor-pointer">
              <p className="text-sm font-semibold text-gray-900">
                Free Traveler 동행 안전수칙에 동의합니다 <span className="text-coral">*</span>
              </p>
              <p className="mt-1 text-sm text-gray-600">
                개인정보 보호, 사기 예방, 안전한 만남을 위한 수칙입니다.
              </p>
            </label>
          </div>
          {errors.agreeToSafety && (
            <p className="text-sm text-danger">{errors.agreeToSafety}</p>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "작성 중..." : "동행글 작성"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
