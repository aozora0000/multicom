export function replaceAt<T>(values: T[], index: number, value: T) {
  const nextValues = [...values];
  nextValues[index] = value;
  return nextValues;
}
