export function getLocationSearch() {
  return location.search;
}

export function getCurrentHref() {
  return location.href;
}

export function getLocationHostname() {
  return location.hostname || "";
}

export function pushUrlIfChanged(state: unknown, url: string) {
  if (url !== getCurrentHref()) {
    history.pushState(state, "", url);
  }
}

export async function writeClipboardText(value: string) {
  await navigator.clipboard.writeText(value);
}
