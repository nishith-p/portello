export type Day = {
  id: number;
  title: string;
  date: string;
  description: string;
  color: string;
  display_order: number;
  tracks: Track[];
  sessions: Session[];
};

export type Track = {
  id: number;
  name: string;
  display_order: number;
};

export type Session = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  type: string;
  show_badges: boolean;
  display_order: number;
  targetRoles: string[];
};
