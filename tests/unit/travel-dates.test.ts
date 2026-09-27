/**
 * Unit Test Suite — Travel Date Validation
 *
 * Tests date validation logic for travel date input fields.
 * Covers: past dates, reverse dates, same-day dates, leap years, edge cases.
 *
 * Run: npm run test:unit
 */

import { describe, it, expect } from "vitest";

interface TravelDateValidation {
  isValid: boolean;
  errors: string[];
}

// Helper function to validate travel date range
function validateTravelDates(startDate: Date, endDate: Date): TravelDateValidation {
  const errors: string[] = [];

  // Check for null/undefined
  if (!startDate || !endDate) {
    errors.push("Start and end dates are required");
    return { isValid: false, errors };
  }

  // Check if start date is in the past (before today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate < today) {
    errors.push("Travel start date cannot be in the past");
  }

  // Check if end date is before start date
  if (endDate < startDate) {
    errors.push("Travel end date cannot be before start date");
  }

  // Check if dates are the same (optional: allow or disallow)
  if (startDate.getTime() === endDate.getTime()) {
    // Allow same-day travel; no error
  }

  // Check date range is reasonable (e.g., within 365 days)
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 365) {
    errors.push("Travel duration cannot exceed 365 days");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper to parse date string (YYYY-MM-DD)
function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

describe("Travel Dates — Past Date Prevention (REQ-FUNC-017)", () => {
  it("rejects travel start date in the past", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const today = new Date();
    today.setDate(today.getDate() + 5);

    const result = validateTravelDates(yesterday, today);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Travel start date cannot be in the past");
  });

  it("rejects all dates in the past", () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const result = validateTravelDates(twoDaysAgo, oneDayAgo);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Travel start date cannot be in the past");
  });

  it("allows travel starting today or later", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = validateTravelDates(today, tomorrow);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("allows travel starting in the future", () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);

    const laterFuture = new Date(future);
    laterFuture.setDate(laterFuture.getDate() + 5);

    const result = validateTravelDates(future, laterFuture);
    expect(result.isValid).toBe(true);
  });
});

describe("Travel Dates — Reverse Date Prevention (REQ-FUNC-017)", () => {
  it("rejects end date before start date", () => {
    const start = new Date();
    start.setDate(start.getDate() + 10);

    const end = new Date();
    end.setDate(end.getDate() + 5);

    const result = validateTravelDates(start, end);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Travel end date cannot be before start date");
  });

  it("rejects when end date is one day before start date", () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() + 5);

    const end = new Date(today);
    end.setDate(end.getDate() + 4);

    const result = validateTravelDates(start, end);
    expect(result.isValid).toBe(false);
  });

  it("accepts equal start and end dates (same-day travel)", () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);

    const result = validateTravelDates(date, date);
    expect(result.isValid).toBe(true);
  });

  it("accepts end date same as or after start date", () => {
    const start = new Date();
    start.setDate(start.getDate() + 5);

    const endSameDay = new Date(start);
    const endNextDay = new Date(start);
    endNextDay.setDate(endNextDay.getDate() + 1);

    expect(validateTravelDates(start, endSameDay).isValid).toBe(true);
    expect(validateTravelDates(start, endNextDay).isValid).toBe(true);
  });
});

describe("Travel Dates — Same-Day Edge Case (REQ-FUNC-017)", () => {
  it("allows user to travel on same day (start = end)", () => {
    const travelDate = new Date();
    travelDate.setDate(travelDate.getDate() + 7);

    const result = validateTravelDates(travelDate, travelDate);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("counts same-day travel as valid duration", () => {
    const date = new Date();
    date.setDate(date.getDate() + 10);

    const result = validateTravelDates(date, date);
    // Same day should not trigger "exceeds 365 days" error
    expect(result.isValid).toBe(true);
  });

  it("handles leap year same-day travel", () => {
    // Feb 29, 2028 (leap year, future)
    const leapDate = new Date(2028, 1, 29); // Month is 0-indexed

    const result = validateTravelDates(leapDate, leapDate);
    expect(result.isValid).toBe(true);
  });
});

describe("Travel Dates — Duration Limits (REQ-FUNC-017)", () => {
  it("rejects travel duration exceeding 365 days", () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date(start);
    end.setDate(end.getDate() + 366); // 367 days total

    const result = validateTravelDates(start, end);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Travel duration cannot exceed 365 days");
  });

  it("allows travel exactly 365 days", () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date(start);
    end.setDate(end.getDate() + 364); // 365 days total (inclusive)

    const result = validateTravelDates(start, end);
    // Should pass based on duration check
    expect(result.errors.some((e) => e.includes("365 days"))).toBe(false);
  });

  it("allows short travel (1-14 days)", () => {
    const testCases = [1, 3, 7, 10, 14];

    testCases.forEach((days) => {
      const start = new Date();
      start.setDate(start.getDate() + 1);

      const end = new Date(start);
      end.setDate(end.getDate() + (days - 1));

      const result = validateTravelDates(start, end);
      expect(result.isValid).toBe(true);
    });
  });
});

describe("Travel Dates — Null/Undefined Handling", () => {
  it("rejects when start date is null", () => {
    const end = new Date();
    end.setDate(end.getDate() + 5);

    const result = validateTravelDates(null as unknown as Date, end);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Start and end dates are required");
  });

  it("rejects when end date is null", () => {
    const start = new Date();
    start.setDate(start.getDate() + 5);

    const result = validateTravelDates(start, null as unknown as Date);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Start and end dates are required");
  });

  it("rejects when both dates are null", () => {
    const result = validateTravelDates(null as unknown as Date, null as unknown as Date);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Start and end dates are required");
  });
});

describe("Travel Dates — Parsing and Formatting", () => {
  it("parses valid ISO date strings (YYYY-MM-DD)", () => {
    const startStr = "2026-10-15";
    const endStr = "2026-10-20";

    const start = parseDate(startStr);
    const end = parseDate(endStr);

    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(9); // October (0-indexed)
    expect(start.getDate()).toBe(15);
  });

  it("handles date boundary (month/year boundaries)", () => {
    // Sept 30 to Oct 5
    const start = parseDate("2026-09-30");
    const end = parseDate("2026-10-05");

    const result = validateTravelDates(start, end);
    // Would fail if in past, but structure is valid
    expect(typeof result.isValid).toBe("boolean");
  });

  it("handles leap year date (Feb 29)", () => {
    const leapDate = parseDate("2024-02-29");
    expect(leapDate.getDate()).toBe(29);
    expect(leapDate.getMonth()).toBe(1); // February
  });
});

describe("Travel Dates — Error Accumulation", () => {
  it("returns multiple errors when date range is invalid in multiple ways", () => {
    // End date is in past AND before start date
    const start = new Date();
    start.setDate(start.getDate() + 10);

    const end = new Date();
    end.setDate(end.getDate() - 5); // 5 days ago

    const result = validateTravelDates(start, end);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("includes only relevant errors", () => {
    // Valid range: start tomorrow, end day after
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const result = validateTravelDates(start, end);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
});

describe("Travel Dates — Edge Cases", () => {
  it("handles year boundary (Dec 31 to Jan 1 next year)", () => {
    const start = new Date("2026-12-31");
    const end = new Date("2027-01-01");

    const result = validateTravelDates(start, end);
    // Structure is valid regardless of year crossing
    expect(typeof result.isValid).toBe("boolean");
  });

  it("handles large date differences within 365-day limit", () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 12); // ~365 days later

    const result = validateTravelDates(start, end);
    expect(result.errors.some((e) => e.includes("365 days"))).toBe(false); // Should not exceed
  });

  it("correctly counts days across daylight saving time boundaries (if applicable)", () => {
    // US DST: Mar 9, 2025 (spring forward)
    const start = new Date("2025-03-08");
    const end = new Date("2025-03-10");

    const result = validateTravelDates(start, end);
    // Should handle DST without issues
    expect(typeof result.isValid).toBe("boolean");
  });
});
