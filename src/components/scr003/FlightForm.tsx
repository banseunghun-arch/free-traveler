"use client";

import { useState, useMemo } from "react";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/shared/Button";

interface FlightFormState {
  country: string;
  region: string;
  departDate: string;
  returnDate: string;
}

interface FlightFormErrors {
  country?: string;
  region?: string;
  departDate?: string;
  returnDate?: string;
}

export function FlightForm() {
  const [formData, setFormData] = useState<FlightFormState>({
    country: "",
    region: "",
    departDate: "",
    returnDate: "",
  });

  const [errors, setErrors] = useState<FlightFormErrors>({});
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
    const newErrors: FlightFormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.country) {
      newErrors.country = "국가를 선택하세요";
    }
    if (!formData.region) {
      newErrors.region = "도시/지역을 선택하세요";
    }
    if (!formData.departDate) {
      newErrors.departDate = "출발일을 선택하세요";
    } else {
      const departDate = new Date(formData.departDate);
      if (departDate < today) {
        newErrors.departDate = "과거 날짜는 선택할 수 없습니다";
      }
    }
    if (!formData.returnDate) {
      newErrors.returnDate = "귀국일을 선택하세요";
    } else if (formData.departDate) {
      const departDate = new Date(formData.departDate);
      const returnDate = new Date(formData.returnDate);
      if (returnDate < departDate) {
        newErrors.returnDate = "귀국일은 출발일보다 뒤여야 합니다";
      }
      if (returnDate.getTime() === departDate.getTime()) {
        newErrors.returnDate = "귀국일과 출발일이 같을 수 없습니다";
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

  const handleDateChange = (field: "departDate" | "returnDate") => {
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
    const externalUrl = process.env.NEXT_PUBLIC_FLIGHT_URL;

    if (!externalUrl) {
      setUrlError(
        "항공편 검색 서비스 URL이 설정되지 않았습니다. 관리자에게 문의하세요."
      );
      return;
    }

    try {
      new URL(externalUrl);
      window.open(externalUrl, "_blank", "noopener,noreferrer");
    } catch {
      setUrlError("항공편 검색 서비스 URL 형식이 올바르지 않습니다.");
    }
  };

  const handleReset = () => {
    setFormData({
      country: "",
      region: "",
      departDate: "",
      returnDate: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setUrlError("");
  };

  const tips = [
    "출발 3개월 전에 예매하면 더 저렴한 항공편을 찾을 수 있습니다",
    "주말 출발보다 평일 출발이 일반적으로 저렴합니다",
    "연중 가장 저렴한 시기를 선택하면 비용을 절감할 수 있습니다",
  ];

  return (
    <div className="space-y-6">
      {isSubmitted ? (
        <>
          {/* Summary View */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="text-lg font-semibold text-green-900">
              항공편 검색 조건
            </h3>
            <div className="mt-4 space-y-2 text-sm text-green-800">
              <p>
                <span className="font-semibold">목적지:</span> {formData.region},
                {formData.country}
              </p>
              <p>
                <span className="font-semibold">출발일:</span>{" "}
                {new Date(formData.departDate).toLocaleDateString("ko-KR")}
              </p>
              <p>
                <span className="font-semibold">귀국일:</span>{" "}
                {new Date(formData.returnDate).toLocaleDateString("ko-KR")}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 rounded bg-yellow-100 p-3 text-xs text-yellow-800">
              <strong>주의:</strong> 입력한 조건은 외부 항공편 검색 서비스로
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
                항공편 보러 가기
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
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

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                출발일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.departDate}
                onChange={handleDateChange("departDate")}
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors.departDate
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:border-coral focus:ring-coral/20"
                }`}
              />
              {errors.departDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.departDate}
                </p>
              )}
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                귀국일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={handleDateChange("returnDate")}
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors.returnDate
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:border-coral focus:ring-coral/20"
                }`}
              />
              {errors.returnDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.returnDate}
                </p>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
              <strong>주의:</strong> 입력한 조건은 외부 항공편 검색 서비스로
              전달되지 않습니다. 다음 단계에서 직접 입력해주세요.
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-coral text-white hover:bg-coral/90"
            >
              항공편 요약 보기
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
