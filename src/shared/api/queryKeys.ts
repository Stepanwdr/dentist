// src/shared/api/queryKeys.ts

export const queryKeys = {
  timeSlots: {
    root: ['timeSlots'] as const,
    list: (filters?: Record<string, any>) => ['timeSlots', 'list', normalizeFilters(filters)] as const,
    detail: (id: number | string) => ['timeSlots', 'detail', String(id)] as const,
  },
};

function normalizeFilters(filters?: Record<string, any>) {
  if (!filters) return {};
  // ensure stable serialization order
  const entries = Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return Object.fromEntries(entries);
}
