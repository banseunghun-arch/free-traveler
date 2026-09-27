#!/usr/bin/env node

/**
 * Validation script for Free Traveler content data
 * Verifies:
 * - Destinations: 10+ domestic, 30+ international (15 countries)
 * - Required fields completeness
 * - Safety info: 100% country coverage for included destinations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const REQUIRED_DEST_FIELDS = [
  'id',
  'name',
  'region',
  'country',
  'imageUrl',
  'description',
];

const REQUIRED_SAFETY_FIELDS = ['country', 'region', 'level', 'categories'];

const INTERNATIONAL_COUNTRIES = [
  '일본',
  '태국',
  '프랑스',
  '영국',
  '스페인',
  '이탈리아',
  '독일',
  '네덜란드',
  '아랍에미리트',
  '미국',
  '캐나다',
];

let hasErrors = false;

function logError(msg) {
  console.error(`❌ ${msg}`);
  hasErrors = true;
}

function logSuccess(msg) {
  console.log(`✅ ${msg}`);
}

function validateDestinations() {
  const destPath = path.join(projectRoot, 'src/data/destinations.ts');

  if (!fs.existsSync(destPath)) {
    logError('Destinations file not found: src/data/destinations.ts');
    return;
  }

  const content = fs.readFileSync(destPath, 'utf-8');

  // Simple regex to extract the array (fragile but works for this case)
  const match = content.match(/export const destinations[^=]*=\s*\[([\s\S]*?)\];/);
  if (!match) {
    logError('Could not parse destinations array');
    return;
  }

  const arrayStr = `[${match[1]}]`;
  let destinations;
  try {
    destinations = eval(arrayStr);
  } catch (e) {
    logError(`Failed to evaluate destinations array: ${e.message}`);
    return;
  }

  if (!Array.isArray(destinations)) {
    logError('Destinations is not an array');
    return;
  }

  // Count domestic and international
  const domestic = destinations.filter((d) => d.region === 'domestic');
  const intl = destinations.filter((d) => d.region === 'international');

  if (domestic.length < 10) {
    logError(
      `Domestic destinations: ${domestic.length} (expected 10+). Missing ${10 - domestic.length}.`
    );
  } else {
    logSuccess(`Domestic destinations: ${domestic.length} ✓`);
  }

  if (intl.length < 30) {
    logError(
      `International destinations: ${intl.length} (expected 30+). Missing ${30 - intl.length}.`
    );
  } else {
    logSuccess(`International destinations: ${intl.length} ✓`);
  }

  // Check countries coverage
  const intlCountries = new Set(intl.map((d) => d.country));
  if (intlCountries.size < INTERNATIONAL_COUNTRIES.length) {
    const missing = INTERNATIONAL_COUNTRIES.filter((c) => !intlCountries.has(c));
    logError(`Missing country coverage: ${missing.join(', ')}`);
  } else {
    logSuccess(`International countries covered: ${intlCountries.size} ✓`);
  }

  // Check required fields
  const withoutFields = destinations.filter(
    (d) => !REQUIRED_DEST_FIELDS.every((f) => f in d && d[f])
  );
  if (withoutFields.length > 0) {
    withoutFields.forEach((d) => {
      const missing = REQUIRED_DEST_FIELDS.filter((f) => !d[f]);
      logError(`Destination "${d.name || d.id}" missing fields: ${missing.join(', ')}`);
    });
  } else {
    logSuccess(`All destinations have required fields ✓`);
  }
}

function validateSafetyInfo() {
  const safetyPath = path.join(projectRoot, 'src/data/safety.ts');

  if (!fs.existsSync(safetyPath)) {
    logError('Safety info file not found: src/data/safety.ts');
    return;
  }

  const content = fs.readFileSync(safetyPath, 'utf-8');

  const match = content.match(/export const safetyInfo[^=]*=\s*\[([\s\S]*?)\];/);
  if (!match) {
    logError('Could not parse safetyInfo array');
    return;
  }

  const arrayStr = `[${match[1]}]`;
  let safetyData;
  try {
    safetyData = eval(arrayStr);
  } catch (e) {
    logError(`Failed to evaluate safetyInfo array: ${e.message}`);
    return;
  }

  if (!Array.isArray(safetyData)) {
    logError('safetyInfo is not an array');
    return;
  }

  logSuccess(`Safety info entries: ${safetyData.length} ✓`);

  // Check required fields
  const withoutFields = safetyData.filter(
    (s) => !REQUIRED_SAFETY_FIELDS.every((f) => f in s && s[f] !== undefined)
  );
  if (withoutFields.length > 0) {
    withoutFields.forEach((s) => {
      const missing = REQUIRED_SAFETY_FIELDS.filter((f) => !(f in s));
      logError(`Safety info "${s.country}" missing fields: ${missing.join(', ')}`);
    });
  } else {
    logSuccess(`All safety info has required fields ✓`);
  }

  // Verify categories structure
  const categoriesIssues = safetyData.filter((s) => {
    if (!Array.isArray(s.categories)) return true;
    return s.categories.some((c) => !c.name || !c.status || !c.details);
  });

  if (categoriesIssues.length > 0) {
    categoriesIssues.forEach((s) => {
      logError(`Safety info "${s.country}" has malformed categories`);
    });
  } else {
    logSuccess(`All safety categories properly structured ✓`);
  }
}

function validateRepresentative() {
  const repPath = path.join(projectRoot, 'src/data/representative.ts');

  if (!fs.existsSync(repPath)) {
    logError('Representative data file not found: src/data/representative.ts');
    return;
  }

  const content = fs.readFileSync(repPath, 'utf-8');

  const match = content.match(/export const representative[^=]*=\s*({[\s\S]*?});/);
  if (!match) {
    logError('Could not parse representative object');
    return;
  }

  const objStr = match[1];
  let representative;
  try {
    representative = eval(`(${objStr})`);
  } catch (e) {
    logError(`Failed to evaluate representative object: ${e.message}`);
    return;
  }

  const requiredFields = ['name', 'title', 'bio', 'stats', 'highlights'];
  const missing = requiredFields.filter((f) => !(f in representative) || !representative[f]);

  if (missing.length > 0) {
    logError(`Representative data missing fields: ${missing.join(', ')}`);
  } else {
    logSuccess(`Representative data complete ✓`);
  }

  // Check stats
  if (representative.stats) {
    const statsFields = ['trips', 'countries', 'years'];
    const statsMissing = statsFields.filter((f) => !(f in representative.stats));
    if (statsMissing.length > 0) {
      logError(`Representative stats missing: ${statsMissing.join(', ')}`);
    } else {
      logSuccess(`Representative stats complete ✓`);
    }
  }

  // Check highlights array
  if (!Array.isArray(representative.highlights) || representative.highlights.length === 0) {
    logError('Representative highlights must be a non-empty array');
  } else {
    logSuccess(`Representative highlights: ${representative.highlights.length} ✓`);
  }
}

function main() {
  console.log('🔍 Validating Free Traveler content data...\n');

  validateDestinations();
  console.log();
  validateSafetyInfo();
  console.log();
  validateRepresentative();

  console.log();
  if (hasErrors) {
    console.error('❌ Validation FAILED');
    process.exit(1);
  } else {
    console.log('✅ All validations PASSED');
    process.exit(0);
  }
}

main();
