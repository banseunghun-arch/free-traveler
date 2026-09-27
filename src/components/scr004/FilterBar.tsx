'use client';

import { useState, useEffect } from 'react';
import { MatePost } from '@/lib/db';
import { Button } from '@/components/shared/Button';

interface FilterBarProps {
  posts: MatePost[];
  blockedUserIds?: string[];
  onFilterChange: (filteredPosts: MatePost[]) => void;
}

export function FilterBar({
  posts,
  blockedUserIds = [],
  onFilterChange,
}: FilterBarProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Get unique countries from posts
  const countries = Array.from(
    new Set(posts.map(p => p.country))
  ).sort();

  // Get regions based on selected country
  const regions = selectedCountry
    ? Array.from(
        new Set(
          posts
            .filter(p => p.country === selectedCountry)
            .map(p => p.region)
            .filter(Boolean)
        )
      ).sort()
    : [];

  // Status options
  const statuses = ['OPEN', 'CLOSED', 'FULL'];

  const applyFilters = () => {
    let filtered = posts.filter(post => {
      // Exclude blocked users
      if (blockedUserIds.includes(post.author_id)) {
        return false;
      }

      // Country filter
      if (selectedCountry && post.country !== selectedCountry) {
        return false;
      }

      // Region filter
      if (selectedRegion && post.region !== selectedRegion) {
        return false;
      }

      // Date range filter (posts that overlap with selected dates)
      if (startDate || endDate) {
        const postStart = new Date(post.start_date);
        const postEnd = new Date(post.end_date);
        const filterStart = startDate ? new Date(startDate) : null;
        const filterEnd = endDate ? new Date(endDate) : null;

        // Check if post dates overlap with filter dates
        if (filterStart && postEnd < filterStart) {
          return false;
        }
        if (filterEnd && postStart > filterEnd) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus && post.status !== selectedStatus) {
        return false;
      }

      return true;
    });

    onFilterChange(filtered);
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedCountry, selectedRegion, startDate, endDate, selectedStatus, posts, blockedUserIds]);

  const handleReset = () => {
    setSelectedCountry('');
    setSelectedRegion('');
    setStartDate('');
    setEndDate('');
    setSelectedStatus('');
  };

  // Calculate filtered count for display
  const displayedPosts = posts.filter(post => {
    if (blockedUserIds.includes(post.author_id)) return false;
    if (selectedCountry && post.country !== selectedCountry) return false;
    if (selectedRegion && post.region !== selectedRegion) return false;
    if (selectedStatus && post.status !== selectedStatus) return false;
    if (startDate || endDate) {
      const postStart = new Date(post.start_date);
      const postEnd = new Date(post.end_date);
      const filterStart = startDate ? new Date(startDate) : null;
      const filterEnd = endDate ? new Date(endDate) : null;
      if (filterStart && postEnd < filterStart) return false;
      if (filterEnd && postStart > filterEnd) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Country Filter */}
        <div>
          <label
            htmlFor="country-filter"
            className="text-[12px] font-semibold text-[#262626] block mb-1"
          >
            국가
          </label>
          <select
            id="country-filter"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
          >
            <option value="">전체</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label
            htmlFor="region-filter"
            className="text-[12px] font-semibold text-[#262626] block mb-1"
          >
            지역
          </label>
          <select
            id="region-filter"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            disabled={!selectedCountry}
            className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] disabled:bg-[#f7f6f4] disabled:cursor-not-allowed"
          >
            <option value="">전체</option>
            {regions.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label
            htmlFor="start-date-filter"
            className="text-[12px] font-semibold text-[#262626] block mb-1"
          >
            출발일
          </label>
          <input
            id="start-date-filter"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label
            htmlFor="end-date-filter"
            className="text-[12px] font-semibold text-[#262626] block mb-1"
          >
            귀국일
          </label>
          <input
            id="end-date-filter"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="status-filter"
            className="text-[12px] font-semibold text-[#262626] block mb-1"
          >
            모집상태
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e3e0] rounded-[6px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
          >
            <option value="">전체</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'OPEN' && '모집 중'}
                {status === 'CLOSED' && '모집 완료'}
                {status === 'FULL' && '인원 가득'}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleReset}
            variant="secondary"
            className="w-full"
          >
            초기화
          </Button>
        </div>
      </div>

      {/* Result Summary */}
      <div className="bg-[#f7f6f4] rounded-[8px] p-3 flex items-center justify-between">
        <p className="text-[14px] font-medium text-[#262626]">
          총 <span className="font-semibold text-[#d03e1b]">{displayedPosts.length}</span>개의 모집글이 있어요
        </p>
      </div>
    </div>
  );
}
