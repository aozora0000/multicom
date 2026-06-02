export function extractYouTubeVideoId(raw: string) {
  const value = String(raw || "").trim();
  if (!value) return "";

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return cleanId(url.pathname.split("/").filter(Boolean)[0]);
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const fromV = cleanId(url.searchParams.get("v"));
      if (fromV) return fromV;

      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) {
        return cleanId(parts[1]);
      }
    }
  } catch {
    // URLでない場合は下の緩い抽出に進む
  }

  const loose = value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
  return cleanId(loose?.[1]);
}

export function buildLiveChatUrl(value: string, domain: string) {
  const videoId = extractYouTubeVideoId(value);
  if (!videoId || !domain) return "";

  return `https://www.youtube.com/live_chat?v=${encodeURIComponent(videoId)}&embed_domain=${encodeURIComponent(domain)}`;
}

export function normalizeYouTubeInput(raw: string) {
  const value = String(raw || "").trim();
  return extractYouTubeVideoId(value) || value;
}

function cleanId(value: string | null | undefined) {
  const id = String(value || "").trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
}
