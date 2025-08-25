import { ChangelogEntry, ChangelogChange } from '@/types/changelog';

/**
 * Helper function to create a new changelog entry
 */
export function createChangelogEntry(
  id: string,
  title: string,
  date: string,
  changes: Omit<ChangelogChange, 'id'>[]
): ChangelogEntry {
  return {
    id,
    title,
    date,
    changes: changes.map((change, index) => ({
      ...change,
      id: `${id}-change-${index + 1}`
    }))
  };
}

/**
 * Helper function to create a new changelog change
 */
export function createChange(
  type: ChangelogChange['type'],
  description: string,
  details?: string
): Omit<ChangelogChange, 'id'> {
  return {
    type,
    description,
    details
  };
}

/**
 * Helper function to sort changelog entries by date (newest first)
 */
export function sortChangelogEntries(entries: ChangelogEntry[]): ChangelogEntry[] {
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
