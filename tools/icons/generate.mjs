import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const OUT = "/home/user/ivleague/public";

// Kept byte-identical to the paths in src/components/ui/Logo.tsx. If one
// changes, change both — there is no build step sharing them.
const SHIELD =
  "M24 6.2c3.6 0 7.4.7 10.6 2.1V24.6c0 8.6-4.4 14.6-10.6 18C17.8 39.2 13.4 33.2 13.4 24.6V8.3C16.6 6.9 20.4 6.2 24 6.2Z";
const DROP =
  "M22.4 12.6c0 0 7 7.6 7 13a5.6 5.6 0 0 1-11.2 0c0-4.2 2.4-8.6 4.2-13Z";
const SWIRL =
  "M22.7 16.4c-1.4 3-2.7 5.3-2.7 7.2 0 1.4.8 2.6 1.9 3.2-.7-1.2-.9-2.3-.5-3.7.4-1.8 1-3.8 1.3-6.7Z";

const GRAD = `
  <linearGradient id="d" x1="19" y1="29" x2="29" y2="12.6" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#29ABE2"/>
    <stop offset="100%" stop-color="#1B60AE"/>
  </linearGradient>`;

/** `rule` is the shield colour: navy on white, lightened on the dark tile. */
const glyph = (rule) => `
  <path d="${SHIELD}" fill="none" stroke="${rule}" stroke-width="3.4" stroke-linejoin="round"/>
  <path d="${DROP}" fill="url(#d)"/>
  <path d="${SWIRL}" fill="#ffffff" opacity="0.42"/>`;

/**
 * `inset` shrinks the glyph toward the middle. Maskable icons get cropped to a
 * circle on Android, so their art has to sit inside the central 80%.
 */
function svg({ radius, inset = 0, bg = "#04070a", rule = "#5C8FE0" }) {
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
  {
    file: "icon-maskable-512.png",
    size: 512,
    svg: svg({ radius: 0, inset: 6 }),
  },
  { file: "_fav32.png", size: 32, svg: svg({ radius: 8 }) },
  { file: "_fav16.png", size: 16, svg: svg({ radius: 6 }) },
];

// The standalone icon.svg is what modern browsers take for the tab. No tile
// behind it — a transparent glyph sits correctly on a light or dark tab strip,
// so the rule uses the navy that reads on both.
writeFileSync(
  `${OUT}/icon.svg`,
  svg({ radius: 0, bg: "none", rule: "#1D2E7C" }),
);
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
    dir.writeUInt8(e.size, o); // width  (0 would mean 256)
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
