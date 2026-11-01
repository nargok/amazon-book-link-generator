import { normalizeAmazonUrl } from "./utils/amazon.ts";
import { makeMarkdownLink, normalizeTitle } from "./utils/markdown.ts";

export type CopyResult = { ok: true } | { ok: false; error: string };

function getProductTitle(): string | null {
  const candidates = [
    document.querySelector("#productTitle")?.textContent,
    document.querySelector("#ebooksProductTitle")?.textContent,
    document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    document.querySelector('meta[name="title"]')?.getAttribute("content"),
    document.querySelector("#title")?.textContent,
  ];

  for (const candidate of candidates) {
    const title = normalizeTitle(candidate ?? "");
    if (title) return title;
  }
  return null;
}

export async function runContentScript(): Promise<CopyResult> {
  try {
    const url = normalizeAmazonUrl(location.href);
    if (!url) return { ok: false, error: "Amazon.co.jpの商品URLからASINを取得できません" };

    const title = getProductTitle();
    if (!title) return { ok: false, error: "商品タイトルを取得できません" };

    if (!navigator.clipboard?.writeText) {
      return { ok: false, error: "Clipboard APIを利用できません" };
    }

    await navigator.clipboard.writeText(makeMarkdownLink(title, url));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: `クリップボードへのコピーに失敗しました: ${String(error)}` };
  }
}
