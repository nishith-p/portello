import { EntityOption } from '@/app/onboarding/utils/types';

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
    value: 'software_engineer',
    label: 'Software Engineer',
    description: 'Build and maintain software',
  },
  {
    value: 'product_manager',
    label: 'Product Manager',
    description: 'Drive product strategy',
  },
  {
    value: 'designer',
    label: 'Designer',
    description: 'Create user experiences',
  },
  {
    value: 'team_lead',
    label: 'Team Lead',
    description: 'Lead technical teams',
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Manage team operations',
  },
];
