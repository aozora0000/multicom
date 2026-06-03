import { replaceAt } from "../../utils/array";
import { normalizeValues } from "../../utils/values";
import { extractYouTubeVideoId, normalizeYouTubeInput } from "../../utils/youtube";

export type DraftApplyResult =
  | { accepted: true; values: string[]; draftValues: string[] }
  | { accepted: false; values: string[]; draftValues: string[]; error: string };

export function normalizeVideoValues(values: string[]) {
  return normalizeValues(values).map((value) => normalizeYouTubeInput(value));
}

export function setDraftValueAt(draftValues: string[], index: number, value: string) {
  return replaceAt(normalizeValues(draftValues), index, value);
}

export function applyDraftValue(values: string[], draftValues: string[], index: number): DraftApplyResult {
  const nextValues = normalizeValues(values);
  const nextDraftValues = normalizeValues(draftValues);
  const value = String(nextDraftValues[index] || "").trim();

  if (!value) {
    nextValues[index] = "";
    nextDraftValues[index] = "";
    return { accepted: true, values: nextValues, draftValues: nextDraftValues };
  }

  if (!extractYouTubeVideoId(value)) {
    return {
      accepted: false,
      values: nextValues,
      draftValues: nextDraftValues,
      error: `w${index + 1} のURLを認識できませんでした`,
    };
  }

  const normalizedValue = normalizeYouTubeInput(value);
  nextValues[index] = normalizedValue;
  nextDraftValues[index] = normalizedValue;
  return { accepted: true, values: nextValues, draftValues: nextDraftValues };
}
