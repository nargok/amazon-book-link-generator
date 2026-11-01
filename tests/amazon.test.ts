import assert from "node:assert/strict";
import test from "node:test";
import { extractAsin, normalizeAmazonUrl } from "../src/utils/amazon.ts";

const asin = "B0ABC12345";

test("対応する商品URLからASINを抽出する", () => {
  assert.equal(extractAsin(`https://www.amazon.co.jp/dp/${asin}`), asin);
  assert.equal(extractAsin(`https://www.amazon.co.jp/gp/product/${asin}/ref=abc`), asin);
  assert.equal(extractAsin(`https://www.amazon.co.jp/日本語の本/dp/${asin}?tag=affiliate-22`), asin);
  assert.equal(extractAsin(`https://amazon.co.jp/dp/b0abc12345`), asin);
});

test("URLをパラメータのない正規形にする", () => {
  assert.equal(
    normalizeAmazonUrl(`https://www.amazon.co.jp/本/dp/${asin}/ref=sr_1_1?keywords=book&tag=xyz-22#detail`),
    `https://www.amazon.co.jp/dp/${asin}`,
  );
});

test("不正URL、非商品ページ、非Amazonサイトを拒否する", () => {
  const invalid = [
    "not a url",
    "https://www.amazon.co.jp/",
    "https://www.amazon.co.jp/s?k=book",
    "https://example.com/dp/B0ABC12345",
    "https://www.amazon.co.jp.evil.example/dp/B0ABC12345",
    "https://www.amazon.co.jp/dp/SHORT",
    "https://www.amazon.co.jp/dp/B0ABC123456",
    "https://www.amazon.co.jp/dp/B0ABC1234-",
    "https://www.amazon.co.jp/other/B0ABC12345",
    "ftp://www.amazon.co.jp/dp/B0ABC12345",
    "https://user:pass@www.amazon.co.jp/dp/B0ABC12345",
  ];

  for (const url of invalid) {
    assert.equal(extractAsin(url), null, url);
    assert.equal(normalizeAmazonUrl(url), null, url);
  }
});
