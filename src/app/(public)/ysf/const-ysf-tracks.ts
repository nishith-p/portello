export interface Track {
  id: string;
  theme: string;
  name: string;
  description: string;
  color: string;
  maxSlots: number;
}

export const TRACK1: Track[] = [
  {
    id: 'mastercard',
    theme: 'Employability',
    name: 'Mastercard – Crafting Your Personal Brand for Impact',
    description: 'Learn how to shape a personal brand that reflects your strengths, values, and ambitions. Gain the tools to communicate your unique identity with confidence and stand out in the professional world.',
    color: 'blue',
    maxSlots: 1,
  },
  {
    id: 'solutions_ground',
    theme: 'Leadership',
    name: 'Solutions Ground – Legacy Leaders: The Be a CEO Edition',
    description: 'Develop leadership skills, team management, and organizational impact',
    color: 'green',
    maxSlots: 75,
  },
  {
    id: 'dhl',
    theme: 'Leadership',
    name: 'DHL – Leadership Reimagined',
    description: 'Environmental consciousness, sustainable development, and green initiatives',
    color: 'yellow',
    maxSlots: 75,
  },
  {
    id: 'jci',
    theme: 'Sustainability',
    name: 'JCI – Become a Sustainable Leader in Action',
    description: 'Inclusion, equity, and celebrating differences in the workplace',
    color: 'grape',
    maxSlots: 75,
  },
];

export const TRACK2: Track[] = [
  {
    id: 'pwc',
    theme: 'Employability',
    name: 'PwC – Building Your Personal Brand for Career and Purpose',
    description: 'Learn how to craft a personal brand that aligns your skills, values, and purpose to stand out in your career journey.',
    color: 'blue',
    maxSlots: 75,
  },
  {
    id: 'tcs',
    theme: 'Leadership',
    name: 'TCS – Leading Across Differences: Building Inclusive Teams in a Global World',
    description: 'Explore strategies to lead diverse teams effectively and foster inclusion in cross-cultural, global environments.',
    color: 'green',
    maxSlots: 75,
  },
  {
    id: 'henkel',
    theme: 'Sustainability',
    name: 'Henkel – The Importance of Emotional Intelligence in Leadership',
    description: 'Understand how emotional intelligence plays a critical role in building resilient, sustainable leadership.',
    color: 'red',
    maxSlots: 75,
  },
  {
    id: 'dhl',
    theme: 'Diversity',
    name: 'DHL – Entrepreneurship & Innovation for Social Sustainability',
    description: 'Dive into how innovation and entrepreneurship can drive inclusive solutions for a more sustainable and equitable future.',
    color: 'yellow',
    maxSlots: 75,
  },
];

export const PANELS = [
  {
    id: 'panelA',
    name: 'Panel 1',
    description:
      'Inclusive job markets and equity in access to opportunities with UN Foundation, UNICEF, JCI',
    maxSlots: 1,
  },
  {
    id: 'panelB',
    name: 'Panel 2',
    description:
      'How to lead the change and drive sustainability innovation with Project Everyone, UNIDO, EFF',
    maxSlots: 145,
  },
];
