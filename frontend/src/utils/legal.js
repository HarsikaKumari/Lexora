export const LEGAL_ISSUES = [
  'family_law',
  'criminal_law',
  'corporate_law',
  'property_law',
  'labor_law',
  'tax_law',
  'intellectual_property',
  'immigration_law',
  'human_rights',
  'contract_law',
  'tort_law',
  'constitutional_law',
  'other',
];

export const DOCUMENT_TYPES = [
  'affidavit',
  'contract',
  'divorce_petition',
  'will_and_testament',
  'power_of_attorney',
  'lease_agreement',
  'employment_contract',
  'partnership_agreement',
  'non_disclosure_agreement',
  'legal_notice',
  'other',
];

export function formatLabel(value) {
  if (!value) return '';

  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getDashboardPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'lawyer') return '/lawyer';
  return '/client';
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDateTime(value, options) {
  if (!value) return '';

  return new Date(value).toLocaleString('en-IN', options);
}
