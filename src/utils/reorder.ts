export function swapValues(values: string[], fromIndex: number, toIndex: number) {
  if (!isValidIndex(values, fromIndex) || !isValidIndex(values, toIndex) || fromIndex === toIndex) {
    return [...values];
  }

  const next = [...values];
  [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
  return next;
}

function isValidIndex(values: string[], index: number) {
  return Number.isInteger(index) && index >= 0 && index < values.length;
}
