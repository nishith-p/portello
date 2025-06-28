export interface Track {
  id: string;
  name: string;
  description: string;
  color: string;
  maxSlots: number;
}

export const TRACKS: Track[] = [
  {
    id: 'employability',
    name: 'Employability',
    description: 'Focus on career development, skills enhancement, and job readiness',
    color: 'blue',
    maxSlots: 80,
  },
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Develop leadership skills, team management, and organizational impact',
    color: 'green',
    maxSlots: 80,
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
    description: 'Environmental consciousness, sustainable development, and green initiatives',
    color: 'teal',
    maxSlots: 80,
  },
  {
    id: 'diversity',
    name: 'Diversity',
    description: 'Inclusion, equity, and celebrating differences in the workplace',
    color: 'grape',
    maxSlots: 80,
  },
];

export const PANELS = [
  { id: 'panelA', name: 'Panel Discussion A', description: 'UN Foundation, UNICEF, JCI', maxSlots: 150 },
  { id: 'panelB', name: 'Panel Discussion B', description: 'Project Everyone, UNIDO, EFF', maxSlots: 150 },
];
