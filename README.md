# Amazon Book Link Copier

Amazon.co.jpの商品ページを開いて拡張アイコンをクリックすると、Obsidianに貼り付けられるMarkdownリンクをクリップボードにコピーします。ポップアップや設定画面はありません。

出力例：

```markdown
- [現場主義の競争戦略](https://www.amazon.co.jp/dp/B0ABC12345)
```

## 開発環境のセットアップ

Node.js 22以上とnpmを用意し、プロジェクトのルートで次を実行します。

```sh
npm ci
```

実行時ライブラリや外部APIは使用しません。ビルドにはTypeScriptとesbuildを使います。

## ビルド

```sh
npm run build
```

型チェック後、Chromeに読み込ませる `dist/` が生成されます。`manifest.json` とアイコンも `dist/` にコピーされます。

## Chromeへのインストール

1. Chromeで `chrome://extensions` を開きます。
2. 右上の「デベロッパー モード」を有効にします。
3. 「パッケージ化されていない拡張機能を読み込む」を押し、このプロジェクトの **`dist/`** フォルダーを選びます。
4. 必要に応じてツールバーの拡張機能メニューからアイコンを固定します。

コードを変更したら `npm run build` を再実行し、`chrome://extensions` で拡張機能を再読み込みしてください。

## 使い方

Amazon.co.jpの商品詳細ページ（`/dp/ASIN` または `/gp/product/ASIN`）でアイコンを1回クリックします。コピーに成功するとバッジに `OK`、失敗すると `ERR` が約2.5秒表示されます。コピー後はObsidianの通常のMarkdownノートに貼り付けてください。

タイトルは商品ページのDOMから取得し、空白を整えます。URLは `https://www.amazon.co.jp/dp/ASIN` に統一され、検索・追跡・アフィリエイトのパラメータは含まれません。

## テスト

```sh
npm test
npm run build
```

単体テストはASIN抽出、URL正規化、不正URL、タイトルの空白、Markdownのエスケープと生成を確認します。

Chromeでの手動確認：

1. Amazon.co.jpの書籍商品ページを開き、アイコンを1回クリックします。`OK` を確認し、Obsidianに貼り付けた結果が `- [タイトル](https://www.amazon.co.jp/dp/ASIN)` であることを確認します。
2. `/gp/product/ASIN` と商品名を含む `/商品名/dp/ASIN` のページでも、同じ正規形になることを確認します。
3. 追跡パラメータや `tag` が付いた商品URLを開き、コピー結果にパラメータが残らないことを確認します。
4. Amazon.co.jpのトップページ、検索結果、Amazon以外のページ、`chrome://extensions` でクリックし、`ERR` を確認します。
5. タイトル要素のない商品ページをテスト用HTML等で再現する場合は `ERR`、クリップボード書き込みをブラウザ側で拒否した場合も `ERR` を確認します。
6. 失敗理由は `chrome://extensions` の拡張機能カードにある「Service Worker」をクリックし、DevToolsのConsoleで確認します。

## 既知の制約

- 対象はAmazon.co.jpのみです。書籍かどうかの厳密な判定はしません。
- Amazonの商品ページのDOM構造が変わると、タイトルを取得できなくなる場合があります。
- Chrome内部ページなど、スクリプトを注入できないページではコピーできません。
- クリップボードの利用がブラウザやOSに拒否された場合は `ERR` になります。

拡張機能は閲覧データを外部送信せず、ローカルストレージにも保存しません。権限はクリック時のタブアクセス、スクリプト注入、クリップボード書き込みに限ります。
