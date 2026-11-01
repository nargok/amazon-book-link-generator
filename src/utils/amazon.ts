const ASIN_PATHS = [
  /^\/(?:[^/]+\/)?dp\/([A-Za-z0-9]{10})(?:\/|$)/,
  /^\/gp\/product\/([A-Za-z0-9]{10})(?:\/|$)/,
];

/** Product type is deliberately not checked in v1. */
export function extractAsin(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (
    !["https:", "http:"].includes(url.protocol) ||
    !["amazon.co.jp", "www.amazon.co.jp"].includes(url.hostname.toLowerCase()) ||
    url.username !== "" ||
    url.password !== ""
  ) {
    return null;
  }

  for (const pattern of ASIN_PATHS) {
    const asin = url.pathname.match(pattern)?.[1];
    if (asin) return asin.toUpperCase();
  }
  return null;
}

export function normalizeAmazonUrl(rawUrl: string): string | null {
  const asin = extractAsin(rawUrl);
  return asin ? `https://www.amazon.co.jp/dp/${asin}` : null;
}
