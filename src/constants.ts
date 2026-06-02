export const LAYOUTS = {
  "2x1": 2,
  "2x2": 4,
  "2x3": 6,
  "3x1": 3,
  "3x2": 6,
  "4x1": 4,
  "4x2": 8,
  "1x2": 2,
  "1x3": 3,
  "1x4": 4,
} as const;

export type Layout = keyof typeof LAYOUTS;

export const LAYOUT_GRIDS: Record<Layout, { columns: number; rows: number }> = {
  "2x1": { columns: 2, rows: 1 },
  "2x2": { columns: 2, rows: 2 },
  "2x3": { columns: 2, rows: 3 },
  "3x1": { columns: 3, rows: 1 },
  "3x2": { columns: 3, rows: 2 },
  "4x1": { columns: 4, rows: 1 },
  "4x2": { columns: 4, rows: 2 },
  "1x2": { columns: 1, rows: 2 },
  "1x3": { columns: 1, rows: 3 },
  "1x4": { columns: 1, rows: 4 },
};

export const DEFAULT_LAYOUT: Layout = "2x2";
export const LAYOUT_OPTIONS = Object.keys(LAYOUTS) as Layout[];
export const MAX_WINDOW_COUNT = Math.max(...Object.values(LAYOUTS));

export function isLayout(value: unknown): value is Layout {
  return typeof value === "string" && value in LAYOUTS;
}
