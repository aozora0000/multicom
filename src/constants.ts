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

export type VtuberLayoutCell = {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const VTUBER_LAYOUTS = {
  1: { label: "1", slots: 1, cells: [{ index: 1, x: 1, y: 1, width: 2, height: 2 }] },
  2: {
    label: "2",
    slots: 2,
    cells: [
      { index: 1, x: 1, y: 0, width: 1, height: 1 },
      { index: 2, x: 1, y: 1, width: 1, height: 1 },
    ],
  },
  3: {
    label: "3",
    slots: 2,
    cells: [
      { index: 1, x: 0, y: 1, width: 1, height: 1 },
      { index: 2, x: 1, y: 1, width: 1, height: 1 },
    ],
  },
  4: {
    label: "4",
    slots: 3,
    cells: [
      { index: 1, x: 1, y: 0, width: 1, height: 1 },
      { index: 2, x: 0, y: 1, width: 1, height: 1 },
      { index: 3, x: 1, y: 1, width: 1, height: 1 },
    ],
  },
  5: {
    label: "5",
    slots: 3,
    cells: [
      { index: 1, x: 0, y: 0, width: 1, height: 1 },
      { index: 2, x: 1, y: 0, width: 1, height: 1 },
      { index: 3, x: 0.5, y: 1, width: 1, height: 1 },
    ],
  },
  6: {
    label: "6",
    slots: 4,
    cells: [
      { index: 1, x: 0, y: 0, width: 1, height: 1 },
      { index: 2, x: 1, y: 0, width: 1, height: 1 },
      { index: 3, x: 0, y: 1, width: 1, height: 1 },
      { index: 4, x: 1, y: 1, width: 1, height: 1 },
    ],
  },
  7: {
    label: "7",
    slots: 6,
    cells: [
      { index: 1, x: 0, y: 0, width: 1, height: 1 },
      { index: 2, x: 1, y: 0, width: 1, height: 1 },
      { index: 3, x: 0, y: 1, width: 1, height: 1 },
      { index: 4, x: 1, y: 1, width: 1, height: 1 },
      { index: 5, x: 0, y: 2, width: 1, height: 1 },
      { index: 6, x: 1, y: 2, width: 1, height: 1 },
    ],
  },
  8: {
    label: "8",
    slots: 6,
    cells: [
      { index: 1, x: 0, y: 0, width: 1, height: 1 },
      { index: 2, x: 1, y: 0, width: 1, height: 1 },
      { index: 3, x: 2, y: 0, width: 1, height: 1 },
      { index: 4, x: 0, y: 1, width: 1, height: 1 },
      { index: 5, x: 1, y: 1, width: 1, height: 1 },
      { index: 6, x: 2, y: 1, width: 1, height: 1 },
    ],
  },
  9: {
    label: "9",
    slots: 9,
    cells: [
      { index: 1, x: 0, y: 0, width: 1, height: 1 },
      { index: 2, x: 1, y: 0, width: 1, height: 1 },
      { index: 3, x: 2, y: 0, width: 1, height: 1 },
      { index: 4, x: 0, y: 1, width: 1, height: 1 },
      { index: 5, x: 1, y: 1, width: 1, height: 1 },
      { index: 6, x: 2, y: 1, width: 1, height: 1 },
      { index: 7, x: 0, y: 2, width: 1, height: 1 },
      { index: 8, x: 1, y: 2, width: 1, height: 1 },
      { index: 9, x: 2, y: 2, width: 1, height: 1 },
    ],
  },
  10: {
    label: "10",
    slots: 3,
    cells: [
      { index: 1, x: 0, y: 0, width: 2, height: 2 },
      { index: 2, x: 0, y: 2, width: 1, height: 1 },
      { index: 3, x: 1, y: 2, width: 1, height: 1 },
    ],
  },
  11: {
    label: "11",
    slots: 3,
    cells: [
      { index: 1, x: 0, y: 0, width: 2, height: 2 },
      { index: 2, x: 2, y: 0, width: 1, height: 1 },
      { index: 3, x: 2, y: 1, width: 1, height: 1 },
    ],
  },
  12: {
    label: "12",
    slots: 6,
    cells: [
      { index: 1, x: 0, y: 0, width: 2, height: 2 },
      { index: 2, x: 2, y: 0, width: 1, height: 1 },
      { index: 3, x: 2, y: 1, width: 1, height: 1 },
      { index: 4, x: 0, y: 2, width: 1, height: 1 },
      { index: 5, x: 1, y: 2, width: 1, height: 1 },
      { index: 6, x: 2, y: 2, width: 1, height: 1 },
    ],
  },
} as const;

export type VtuberLayoutId = keyof typeof VTUBER_LAYOUTS;
export type VtuberLayoutSelection = "auto" | VtuberLayoutId;
export const VTUBER_LAYOUT_OPTIONS = Object.keys(VTUBER_LAYOUTS).map(Number) as VtuberLayoutId[];

export const AUTO_VTUBER_LAYOUT_BY_LAYOUT: Record<Layout, VtuberLayoutId> = {
  "2x1": 3,
  "2x2": 6,
  "2x3": 7,
  "3x1": 5,
  "3x2": 8,
  "4x1": 6,
  "4x2": 9,
  "1x2": 2,
  "1x3": 10,
  "1x4": 6,
};

export function isLayout(value: unknown): value is Layout {
  return typeof value === "string" && value in LAYOUTS;
}
