import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const OUT = "/home/user/ivleague/public";

// Kept byte-identical to the paths in src/components/ui/Logo.tsx. If one
// changes, change both — there is no build step sharing them.
const SHIELD_OUTER =
  "M8.8 8A2 2 0 0 1 10.8 6h26.4A2 2 0 0 1 39.2 8v17.2c0 8.2-6 14.4-15.2 18.4-9.2-4-15.2-10.2-15.2-18.4Z";
const SHIELD_INNER =
  "M11 9.6A1.4 1.4 0 0 1 12.4 8.2h23.2A1.4 1.4 0 0 1 37 9.6V25c0 7.2-5.2 12.6-13 16.2-7.8-3.6-13-9-13-16.2Z";
const DROP =
  "M24 12.8c0 0 7.4 9 7.4 14.4a7.4 7.4 0 0 1-14.8 0c0-5.4 7.4-14.4 7.4-14.4Z";

const GRAD = `
  <linearGradient id="d" x1="17" y1="34" x2="31" y2="12.8" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#3FBDEA"/>
    <stop offset="52%" stop-color="#1E7FC4"/>
    <stop offset="100%" stop-color="#1B4C9B"/>
  </linearGradient>`;

/** `rule` is the shield colour: navy on white, lightened on the dark tile. */
const glyph = (rule) => `
  <path d="${SHIELD_OUTER}" fill="none" stroke="${rule}" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="${SHIELD_INNER}" fill="none" stroke="${rule}" stroke-width="0.9" stroke-linejoin="round" opacity="0.62"/>
  <path d="${DROP}" fill="url(#d)"/>
  <path d="M19.4 30.2a5.4 5.4 0 0 0 3 4" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>`;

/**
 * `inset` shrinks the glyph toward the middle. Maskable icons get cropped to a
 * circle on Android, so their art has to sit inside the central 80%.
 */
function svg({ radius, inset = 0, bg = "#04070a", rule = "#63ACE2" }) {
  const s = (48 - inset * 2) / 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <defs>${GRAD}</defs>
  ${bg === "none" ? "" : `<rect width="48" height="48" rx="${radius}" fill="${bg}"/>`}
  <g transform="translate(${inset} ${inset}) scale(${s})">${glyph(rule)}</g>
</svg>`;
}

const targets = [
  { file: "apple-icon.png", size: 180, svg: svg({ radius: 0, inset: 3 }) },
  { file: "icon-192.png", size: 192, svg: svg({ radius: 10 }) },
  { file: "icon-512.png", size: 512, svg: svg({ radius: 10 }) },
  { file: "icon-maskable-512.png", size: 512, svg: svg({ radius: 0, inset: 6 }) },
  { file: "_fav32.png", size: 32, svg: svg({ radius: 8 }) },
  { file: "_fav16.png", size: 16, svg: svg({ radius: 6 }) },
];

// The standalone icon.svg is what modern browsers take for the tab. No tile
// behind it — a transparent glyph sits correctly on a light or dark tab strip,
// so the rule uses the navy that reads on both.
writeFileSync(`${OUT}/icon.svg`, svg({ radius: 0, bg: "none", rule: "#1F5FA8" }));
console.log("icon.svg");

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();

for (const t of targets) {
  await page.setViewportSize({ width: t.size, height: t.size });
  await page.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${t.size}px;height:${t.size}px}</style>${t.svg}`,
  );
  const buf = await page.locator("svg").screenshot({ omitBackground: true });
  writeFileSync(`${OUT}/${t.file}`, buf);
  console.log(t.file, buf.length, "bytes");
}
await browser.close();

// favicon.ico carries both sizes, so browsers and crawlers that request
// /favicon.ico blind get a real multi-resolution icon rather than a scaled one.
// The PNGs Playwright just wrote go in verbatim — PNG-in-ICO is supported
// everywhere that still asks for a .ico, so there is nothing to re-encode.
const { readFileSync, unlinkSync } = await import("node:fs");

function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;
  entries.forEach((e, i) => {
    const o = 16 * i;
    dir.writeUInt8(e.size, o);      // width  (0 would mean 256)
    dir.writeUInt8(e.size, o + 1);  // height
    dir.writeUInt8(0, o + 2);       // palette size
    dir.writeUInt8(0, o + 3);       // reserved
    dir.writeUInt16LE(1, o + 4);    // colour planes
    dir.writeUInt16LE(32, o + 6);   // bits per pixel
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
