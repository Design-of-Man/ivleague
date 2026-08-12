/**
 * Generates every raster icon from the client's real mark.
 *
 * Source: public/brand/ivl-mark.png — the shield cut out of their supplied
 * lockup, white knocked out to alpha. Nothing here is drawn; the artwork is
 * composited onto a tile and resized.
 *
 * The tile is WHITE. The mark is navy-and-blue on a white ground with a silver
 * hairline, and on a dark tile the navy sinks into it. White is also what an
 * app icon of this logo should look like.
 *
 * Known limitation: the mark is 53px wide in the source, so the 512px icon is
 * an ~10x upscale and is soft. An SVG or EPS from the client fixes that one
 * file. Run with:  node tools/icons/generate.mjs
 */
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

// IVL_ROOT lets this run from a directory where playwright-core resolves,
// which is not always the repo itself.
const ROOT =
  process.env.IVL_ROOT ?? new URL("../../", import.meta.url).pathname;
const OUT = `${ROOT}public`;
const MARK = `${OUT}/brand/ivl-mark.png`;

const markData = `data:image/png;base64,${readFileSync(MARK).toString("base64")}`;

/**
 * `pad` is the share of the tile left empty around the mark. Maskable icons get
 * cropped to a circle on Android, so their art needs more room than the rest.
 */
function html({ size, radius, pad, bg = "#ffffff" }) {
  return `<style>
    html,body{margin:0;padding:0}
    .tile{width:${size}px;height:${size}px;border-radius:${radius}px;background:${bg};
          display:grid;place-items:center;overflow:hidden}
    img{width:${Math.round(size * (1 - pad * 2) * 0.9)}px;height:auto;
        image-rendering:auto;display:block}
  </style><div class="tile"><img src="${markData}"></div>`;
}

const targets = [
  { file: "apple-icon.png", size: 180, radius: 0, pad: 0.1 },
  { file: "icon-192.png", size: 192, radius: 40, pad: 0.1 },
  { file: "icon-512.png", size: 512, radius: 106, pad: 0.1 },
  { file: "icon-maskable-512.png", size: 512, radius: 0, pad: 0.2 },
  { file: "_fav32.png", size: 32, radius: 6, pad: 0.06 },
  { file: "_fav16.png", size: 16, radius: 3, pad: 0.04 },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();

for (const t of targets) {
  await page.setViewportSize({ width: t.size, height: t.size });
  await page.setContent(html(t));
  const buf = await page.locator(".tile").screenshot();
  writeFileSync(`${OUT}/${t.file}`, buf);
  console.log(t.file, buf.length, "bytes");
}
await browser.close();

/**
 * favicon.ico carries both sizes, so browsers and crawlers that request
 * /favicon.ico blind get a real multi-resolution icon rather than a scaled one.
 * The PNGs go in verbatim — PNG-in-ICO is supported everywhere that still asks
 * for a .ico, so there is nothing to re-encode.
 */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;
  entries.forEach((e, i) => {
    const o = 16 * i;
    dir.writeUInt8(e.size, o); // width (0 would mean 256)
    dir.writeUInt8(e.size, o + 1); // height
    dir.writeUInt8(0, o + 2); // palette size
    dir.writeUInt8(0, o + 3); // reserved
    dir.writeUInt16LE(1, o + 4); // colour planes
    dir.writeUInt16LE(32, o + 6); // bits per pixel
    dir.writeUInt32LE(e.buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += e.buf.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.buf)]);
}

const buf = ico([
  { size: 16, buf: readFileSync(`${OUT}/_fav16.png`) },
  { size: 32, buf: readFileSync(`${OUT}/_fav32.png`) },
]);
writeFileSync(`${OUT}/favicon.ico`, buf);
unlinkSync(`${OUT}/_fav16.png`);
unlinkSync(`${OUT}/_fav32.png`);
console.log("favicon.ico", buf.length, "bytes");

// icon.svg wraps the same raster so the tab icon cannot drift from the rest.
writeFileSync(
  `${OUT}/icon.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 59" width="53" height="59">
  <image href="${markData}" width="53" height="59"/>
</svg>\n`,
);
console.log("icon.svg");
