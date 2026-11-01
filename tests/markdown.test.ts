import assert from "node:assert/strict";
import test from "node:test";
import { escapeMarkdownLinkText, makeMarkdownLink, normalizeTitle } from "../src/utils/markdown.ts";

test("商品タイトルの空白と改行を正規化する", () => {
  assert.equal(normalizeTitle("  現場主義の\n  競争戦略\t\t新版  "), "現場主義の 競争戦略 新版");
});

test("Markdownリンクテキストの特殊文字をエスケープする", () => {
  assert.equal(
    escapeMarkdownLinkText("A [guide] *new* _book_ `code` \\ ~x~ <tag>"),
    "A \\[guide\\] \\*new\\* \\_book\\_ \\`code\\` \\\\ \\~x\\~ \\<tag\\>",
  );
});

test("Obsidianに貼り付けるMarkdownの箇条書きを生成する", () => {
  assert.equal(
    makeMarkdownLink("  現場主義の競争戦略  ", "https://www.amazon.co.jp/dp/B0ABC12345"),
    "- [現場主義の競争戦略](https://www.amazon.co.jp/dp/B0ABC12345)",
  );
  assert.throws(() => makeMarkdownLink(" \n ", "https://www.amazon.co.jp/dp/B0ABC12345"));
});
