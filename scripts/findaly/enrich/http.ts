import { Agent, setGlobalDispatcher } from "undici";

export type FetchResult = {
  url: string;
  status: number;
  contentType: string | null;
  text: string;
};

// Fix for UND_ERR_HEADERS_OVERFLOW (some sites send huge headers, often Set-Cookie)
setGlobalDispatcher(
  new Agent({
    // 64KB header limit (higher than default)
    maxHeaderSize: 64 * 1024,
    connect: { timeout: 15_000 },
  }),
);

function isHttpUrl(u: string) {
  try {
    const p = new URL(u).protocol;
    return p === "http:" || p === "https:";
  } catch {
    return false;
  }
}

type UndiciFetchInit = RequestInit & {
  // undici supports this option, but it isn't in TS DOM lib types
  maxRedirections?: number;
};

export async function fetchText(url: string, timeoutMs = 15000): Promise<FetchResult> {
  // Prevent "unknown scheme" (mailto:, javascript:, etc.)
  if (!isHttpUrl(url)) {
    return { url, status: 0, contentType: null, text: "" };
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const init: UndiciFetchInit = {
      redirect: "follow",
      signal: controller.signal,
      maxRedirections: 8,
      headers: {
        "user-agent": "findaly-enricher/1.0 (+https://findaly.co)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    };

    const res = await fetch(url, init);

    const contentType = res.headers.get("content-type");
    const text = await res.text();
    return { url: res.url, status: res.status, contentType, text };
  } catch {
    // Never crash the whole pipeline on fetch issues
    return { url, status: 0, contentType: null, text: "" };
  } finally {
    clearTimeout(t);
  }
}
