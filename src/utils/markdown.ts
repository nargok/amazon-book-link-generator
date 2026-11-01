export function normalizeTitle(rawTitle: string): string {
  return rawTitle.replace(/\s+/gu, " ").trim();
}

export function escapeMarkdownLinkText(title: string): string {
  return title.replace(/[\\\[\]*_`~<>]/gu, "\\$&");
}

export function makeMarkdownLink(title: string, url: string): string {
  const normalizedTitle = normalizeTitle(title);
  if (!normalizedTitle) throw new Error("商品タイトルが空です");
  return `- [${escapeMarkdownLinkText(normalizedTitle)}](${url})`;
}
