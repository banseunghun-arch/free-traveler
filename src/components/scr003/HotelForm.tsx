"use client";

import { useState, useMemo } from "react";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/shared/Button";

interface HotelFormState {
  country: string;
  region: string;
  checkinDate: string;
  checkoutDate: string;
}

interface HotelFormErrors {
  country?: string;
  region?: string;
  checkinDate?: string;
  checkoutDate?: string;
}

export function HotelForm() {
  const [formData, setFormData] = useState<HotelFormState>({
    country: "",
    region: "",
    checkinDate: "",
    checkoutDate: "",
  });

  const [errors, setErrors] = useState<HotelFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [urlError, setUrlError] = useState("");

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
    const newErrors: HotelFormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.country) {
      newErrors.country = "국가를 선택하세요";
    }
    if (!formData.region) {
      newErrors.region = "도시/지역을 선택하세요";
    }
    if (!formData.checkinDate) {
      newErrors.checkinDate = "체크인일을 선택하세요";
    } else {
      const checkinDate = new Date(formData.checkinDate);
      if (checkinDate < today) {
        newErrors.checkinDate = "과거 날짜는 선택할 수 없습니다";
      }
    }
    if (!formData.checkoutDate) {
      newErrors.checkoutDate = "체크아웃일을 선택하세요";
    } else if (formData.checkinDate) {
      const checkinDate = new Date(formData.checkinDate);
      const checkoutDate = new Date(formData.checkoutDate);
      if (checkoutDate < checkinDate) {
        newErrors.checkoutDate = "체크아웃일은 체크인일보다 뒤여야 합니다";
      }
      if (checkoutDate.getTime() === checkinDate.getTime()) {
        newErrors.checkoutDate = "체크아웃일과 체크인일이 같을 수 없습니다";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      country: e.target.value,
      region: "",
    });
    setErrors({ ...errors, country: undefined, region: undefined });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, region: e.target.value });
    setErrors({ ...errors, region: undefined });
  };

  const handleDateChange = (field: "checkinDate" | "checkoutDate") => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setErrors({ ...errors, [field]: undefined });
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      setUrlError("");
    }
  };

  const handleExternalLink = () => {
    const externalUrl = process.env.NEXT_PUBLIC_HOTEL_URL;

    if (!externalUrl) {
      setUrlError(
        "숙소 검색 서비스 URL이 설정되지 않았습니다. 관리자에게 문의하세요."
      );
      return;
    }

    try {
      new URL(externalUrl);
      window.open(externalUrl, "_blank", "noopener,noreferrer");
    } catch {
      setUrlError("숙소 검색 서비스 URL 형식이 올바르지 않습니다.");
    }
  };

  const handleReset = () => {
    setFormData({
      country: "",
      region: "",
      checkinDate: "",
      checkoutDate: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setUrlError("");
  };

  const tips = [
    "주중 숙박이 주말보다 일반적으로 저렴합니다",
    "계절 성수기를 피하면 더 좋은 가격에 예약할 수 있습니다",
    "장기 숙박 시 할인을 협상할 수 있는지 확인해보세요",
  ];

  return (
    <div className="space-y-6">
      {isSubmitted ? (
        <>
          {/* Summary View */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="text-lg font-semibold text-green-900">
              숙소 검색 조건
            </h3>
            <div className="mt-4 space-y-2 text-sm text-green-800">
              <p>
                <span className="font-semibold">목적지:</span> {formData.region},
                {formData.country}
              </p>
              <p>
                <span className="font-semibold">체크인:</span>{" "}
                {new Date(formData.checkinDate).toLocaleDateString("ko-KR")}
              </p>
              <p>
                <span className="font-semibold">체크아웃:</span>{" "}
                {new Date(formData.checkoutDate).toLocaleDateString("ko-KR")}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 rounded bg-yellow-100 p-3 text-xs text-yellow-800">
              <strong>주의:</strong> 입력한 조건은 외부 숙소 검색 서비스로
              전달되지 않습니다. 다음 단계에서 직접 입력해주세요.
            </div>

            {/* External Link */}
            {urlError ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {urlError}
              </div>
            ) : null}

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleExternalLink}
                className="flex-1 bg-coral text-white hover:bg-coral/90"
              >
                호텔 보러 가기
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                다시 입력하기
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">찾기 팁</h4>
            {tips.map((tip, idx) => (
              <div key={idx} className="flex gap-3 rounded-lg bg-blue-50 p-4">
                <span className="flex-shrink-0 font-semibold text-blue-600">
                  {idx + 1}
                </span>
                <p className="text-sm text-blue-800">{tip}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Country Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                국가 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={handleCountryChange}
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors.country
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:border-coral focus:ring-coral/20"
                }`}
              >
                <option value="">선택하세요</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            {/* Region Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                도시/지역 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.region}
                onChange={handleRegionChange}
                disabled={!formData.country}
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500 ${
                  errors.region
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:border-coral focus:ring-coral/20"
                }`}
              >
                <option value="">선택하세요</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="mt-1 text-sm text-red-600">{errors.region}</p>
              )}
            </div>

            {/* Checkin Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                체크인일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.checkinDate}
                onChange={handleDateChange("checkinDate")}
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors.checkinDate
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:border-coral focus:ring-coral/20"
                }`}
              />
              {errors.checkinDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.checkinDate}
                </p>
              )}
            </div>

            {/* Checkout Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                체크아웃일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.checkoutDate}
                onChange={handleDateChange("checkoutDate")}
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors.checkoutDate
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:border-coral focus:ring-coral/20"
                }`}
              />
              {errors.checkoutDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.checkoutDate}
                </p>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
              <strong>주의:</strong> 입력한 조건은 외부 숙소 검색 서비스로
              전달되지 않습니다. 다음 단계에서 직접 입력해주세요.
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-coral text-white hover:bg-coral/90"
            >
              숙소 요약 보기
            </Button>
          </form>

          {/* Tips */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">찾기 팁</h4>
            {tips.map((tip, idx) => (
              <div key={idx} className="flex gap-3 rounded-lg bg-blue-50 p-4">
                <span className="flex-shrink-0 font-semibold text-blue-600">
                  {idx + 1}
                </span>
                <p className="text-sm text-blue-800">{tip}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
