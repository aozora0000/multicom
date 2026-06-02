import { MAX_WINDOW_COUNT } from "../constants";

export function normalizeValues(input: unknown) {
  const arr = Array.isArray(input) ? input : [];
  return Array.from({ length: MAX_WINDOW_COUNT }, (_, i) => String(arr[i] || ""));
}
