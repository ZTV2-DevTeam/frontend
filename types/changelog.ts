export interface ChangelogEntry {
  id: string;
  title: string; // Usually a date like "2025-08-25" or "v1.2.0"
  date: string; // ISO date string
  changes: ChangelogChange[];
}

export interface ChangelogChange {
  id: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'breaking' | 'security' | 'removed';
  description: string;
  details?: string;
}

export type ChangelogType = ChangelogChange['type'];
