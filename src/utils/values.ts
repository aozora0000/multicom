export function normalizeValues(input: unknown) {
  const arr = Array.isArray(input) ? input : [];
  return [0, 1, 2, 3].map((i) => String(arr[i] || ""));
}
