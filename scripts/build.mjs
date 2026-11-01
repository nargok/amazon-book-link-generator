import { build } from "esbuild";
import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outdir = "dist";
await mkdir(join(outdir, "icons"), { recursive: true });

await build({
  entryPoints: ["src/background.ts"],
  outfile: join(outdir, "background.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "chrome114",
});

const content = await build({
  entryPoints: ["src/content.ts"],
  outfile: join(outdir, "content.js"),
  bundle: true,
  format: "iife",
  globalName: "BookLinkContent",
  platform: "browser",
  target: "chrome114",
  write: false,
});

// executeScript reports the final expression's value, including a resolved Promise.
await writeFile(
  join(outdir, "content.js"),
  `${content.outputFiles[0].text}\nBookLinkContent.runContentScript();\n`,
);

await copyFile("manifest.json", join(outdir, "manifest.json"));
for (const size of [16, 32, 48, 128]) {
  await copyFile(`public/icons/icon-${size}.png`, join(outdir, `icons/icon-${size}.png`));
}
