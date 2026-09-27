/**
 * Contact pattern detection to prevent direct contact info in posts
 * Detects: phone numbers, email addresses, messenger IDs
 */

// Phone number patterns (including international)
const PHONE_PATTERNS = [
  /\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{4}/g, // Korean: 01x-xxxx-xxxx
  /\+?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, // International
  /\(\d{2,4}\)\s?\d{3,4}\s?\d{4}/g, // (xx) xxxx xxxx
];

// Email patterns
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Messenger/social IDs
const MESSENGER_PATTERNS = [
  /@[a-zA-Z0-9_.]+/g, // @username (Twitter, Instagram)
  /(?:kakao|telegram|whatsapp|wechat|viber|line)[:=]?\s*[a-zA-Z0-9._-]+/gi,
  /\b(?:ID|카톡|텔레그램|라인|위챗)\s*[:=]?\s*[a-zA-Z0-9._-]+/gi,
];

export interface ContactDetectionResult {
  hasContacts: boolean;
  detectedTypes: string[];
  detailedMatches: {
    phones: string[];
    emails: string[];
    messengers: string[];
  };
}

/**
 * Detect contact information in text
 */
export function detectContactInfo(text: string): ContactDetectionResult {
  const result: ContactDetectionResult = {
    hasContacts: false,
    detectedTypes: [],
    detailedMatches: {
      phones: [],
      emails: [],
      messengers: [],
    },
  };

  if (!text || typeof text !== "string") {
    return result;
  }

  // Check phones
  for (const pattern of PHONE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      result.detailedMatches.phones.push(...matches);
      result.detectedTypes.push("phone");
      result.hasContacts = true;
    }
  }

  // Check emails
  const emailMatches = text.match(EMAIL_PATTERN);
  if (emailMatches) {
    result.detailedMatches.emails.push(...emailMatches);
    result.detectedTypes.push("email");
    result.hasContacts = true;
  }

  // Check messengers
  for (const pattern of MESSENGER_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      result.detailedMatches.messengers.push(...matches);
      result.detectedTypes.push("messenger");
      result.hasContacts = true;
    }
  }

  // Deduplicate detected types
  result.detectedTypes = [...new Set(result.detectedTypes)];

  return result;
}

/**
 * Check if text contains any contact information
 */
export function containsContactInfo(text: string): boolean {
  const result = detectContactInfo(text);
  return result.hasContacts;
}

/**
 * Validate mate post dates
 */
export function validateDates(startDate: string, endDate: string): {
  valid: boolean;
  error?: string;
} {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { valid: false, error: "Invalid date format" };
    }

    // Check if end date is not before start date
    if (end < start) {
      return { valid: false, error: "End date cannot be before start date" };
    }

    // Check if start date is not in the past
    if (start < now) {
      return { valid: false, error: "Start date cannot be in the past" };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Date validation failed" };
  }
}
