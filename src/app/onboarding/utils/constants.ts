import { EntityOption } from '@/app/onboarding/utils/types';
import exp from 'constants';

export const ENTITIES: EntityOption[] = [
  {
    value: 'engineering',
    label: 'Engineering',
    description: 'Software Development and Infrastructure',
  },
  {
    value: 'product',
    label: 'Product',
    description: 'Product Management and Design',
  },
  {
    value: 'marketing',
    label: 'Marketing',
    description: 'Marketing and Communications',
  },
  {
    value: 'sales',
    label: 'Sales',
    description: 'Sales and Business Development',
  },
  {
    value: 'finance',
    label: 'Finance',
    description: 'Finance and Operations',
  },
];

export const POSITIONS: EntityOption[] = [
  {
    value: 'mcp',
    label: 'MCP',
    description: 'Build and maintain software',
  },
  {
    value: 'mcvp',
    label: 'MCVP',
    description: 'Drive product strategy',
  },
  {
    value: 'lcp',
    label: 'LCP',
    description: 'Create user experiences',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Lead technical teams',
  }
];

export const COUNTRYCODES = [
  { value: "+1", label: "+1 (US)" },
  { value: "+44", label: "+44 (UK)" },
  { value: "+91", label: "+91 (IN)" },
  { value: "+81", label: "+81 (JP)" },
  { value: "+86", label: "+86 (CN)" },
];

export const REGIONS = [
  {
    value: 'asia_pacific',
    label: 'Asia Pacific'
  },
  {
    value: 'europe',
    label: 'Europe '
  },
  {
    value: 'middle_east_africa',
    label: 'Middle East & Africa'
  },
  {
    value: 'Americas',
    label: 'Americas'
  },
];

export const LC = [
  {value: 'xyz', label: 'XYZ'}
];

export const TSHIRTSIZES = [
  { value: 'xxs', label: 'XXS' },
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' }
];

export const MEALPREFERENCE = [
  { value: 'veg', label: 'Veg' },
  { value: 'non_veg', label: 'Non Veg' },
  { value: 'halal', label: 'Halal' },
  { value: 'other', label: 'Other' },
];
