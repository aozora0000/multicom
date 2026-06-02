import { DEFAULT_LAYOUT, isLayout, type Layout } from "../constants";
import { normalizeValues } from "./values";

export type ChatGridSnapshot = {
  layout: Layout;
  values: string[];
};

export function applyQueryParamsToSnapshot(search: string, snapshot: Partial<ChatGridSnapshot>) {
  const params = new URLSearchParams(search);
  const queryLayout = params.get("layout") || params.get("l");
  const next: ChatGridSnapshot = {
    layout: isLayout(snapshot.layout) ? snapshot.layout : DEFAULT_LAYOUT,
    values: normalizeValues(snapshot.values),
  };

  if (isLayout(queryLayout)) {
    next.layout = queryLayout;
  }

  for (let i = 1; i <= 4; i += 1) {
    const value = params.get(`w${i}`);
    if (value !== null) next.values[i - 1] = value;
  }

  return next;
}
