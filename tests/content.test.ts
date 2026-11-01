import assert from "node:assert/strict";
import test from "node:test";
import { runContentScript } from "../src/content.ts";

test("商品ページからコピーし、取得・コピーの失敗を返す", async () => {
  const oldLocation = Object.getOwnPropertyDescriptor(globalThis, "location");
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const oldNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  let copied = "";

  try {
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: { href: "https://www.amazon.co.jp/本/dp/B0ABC12345?tag=test-22" },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        querySelector(selector: string) {
          if (selector === "#productTitle") return { textContent: "  本の [題名]\n  第2版  " };
          return null;
        },
      },
    });
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { clipboard: { writeText: async (text: string) => { copied = text; } } },
    });

    assert.deepEqual(await runContentScript(), { ok: true });
    assert.equal(copied, "- [本の \\[題名\\] 第2版](https://www.amazon.co.jp/dp/B0ABC12345)");

    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { clipboard: { writeText: async () => { throw new Error("denied"); } } },
    });
    assert.match(JSON.stringify(await runContentScript()), /クリップボードへのコピーに失敗/);

    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: { href: "https://www.amazon.co.jp/" },
    });
    assert.match(JSON.stringify(await runContentScript()), /ASINを取得できません/);
  } finally {
    for (const [name, descriptor] of [
      ["location", oldLocation],
      ["document", oldDocument],
      ["navigator", oldNavigator],
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
});
