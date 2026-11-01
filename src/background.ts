import type { CopyResult } from "./content.ts";

const badgeTimers = new Map<number, ReturnType<typeof setTimeout>>();
const badgeVersions = new Map<number, number>();

async function showBadge(tabId: number, text: "OK" | "ERR"): Promise<void> {
  const priorTimer = badgeTimers.get(tabId);
  if (priorTimer) clearTimeout(priorTimer);
  const version = (badgeVersions.get(tabId) ?? 0) + 1;
  badgeVersions.set(tabId, version);

  await chrome.action.setBadgeBackgroundColor({ tabId, color: text === "OK" ? "#16803c" : "#b42318" });
  await chrome.action.setBadgeText({ tabId, text });

  badgeTimers.set(tabId, setTimeout(() => {
    if (badgeVersions.get(tabId) !== version) return;
    badgeTimers.delete(tabId);
    badgeVersions.delete(tabId);
    void chrome.action.setBadgeText({ tabId, text: "" }).catch((error: unknown) => {
      console.warn("バッジを消去できませんでした", error);
    });
  }, 2500));
}

chrome.action.onClicked.addListener((tab) => {
  void (async () => {
    if (tab.id === undefined) {
      console.error("タブIDを取得できません");
      return;
    }

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      const result = results[0]?.result as CopyResult | undefined;
      if (!result?.ok) throw new Error(result?.error ?? "ページから結果が返されませんでした");
      await showBadge(tab.id, "OK");
    } catch (error) {
      console.error("Amazon Book Link Copier:", error);
      await showBadge(tab.id, "ERR").catch((badgeError: unknown) => {
        console.error("エラーバッジを表示できませんでした:", badgeError);
      });
    }
  })();
});
