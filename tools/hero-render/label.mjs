import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
// The bag label, rendered from the real lockup at print resolution so the
// emblem and wordmark are vector-sharp in the ray-traced result.
const html = `<style>
  html,body{margin:0;padding:0}
  .l{width:1100px;height:820px;background:#fff;display:flex;flex-direction:column;
     align-items:center;justify-content:center;gap:46px;font-family:Inter,Helvetica,Arial,sans-serif}
  .w{font-size:104px;font-weight:800;letter-spacing:.02em;color:#14293b;line-height:1}
  .s{font-size:31px;font-weight:500;letter-spacing:.223em;color:#0b8fa8;text-transform:uppercase}
  .r{width:520px;height:2px;background:#dbe3e8}
  .f{font-size:26px;letter-spacing:.16em;color:#8a9aa6;text-transform:uppercase}
</style>
<div class="l">
  <svg width="230" height="230" viewBox="0 0 48 48">
    <defs><linearGradient id="b" x1="12" y1="6" x2="38" y2="44" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#5fdcd2"/><stop offset="45%" stop-color="#1fcdc0"/>
      <stop offset="100%" stop-color="#0b8fa8"/></linearGradient></defs>
    <path d="M24 2.6c0 0 15.4 16.2 15.4 26A15.4 15.4 0 0 1 8.6 28.6c0-9.8 15.4-26 15.4-26Z" fill="none" stroke="#14293b" stroke-width="1.6"/>
    <path d="M24 7.4c0 0 11.7 12.6 11.7 20.3A11.7 11.7 0 0 1 12.3 27.7C12.3 20 24 7.4 24 7.4Z" fill="url(#b)"/>
    <path d="M24 15.4c0 0 6.1 6.6 6.1 10.6a6.1 6.1 0 0 1-12.2 0c0-4 6.1-10.6 6.1-10.6Z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/>
  </svg>
  <div style="text-align:center">
    <div class="w">IV LEAGUE</div>
    <div class="s" style="margin-top:18px">Infusion Services</div>
  </div>
  <div class="r"></div>
  <div class="f">Midlothian, Virginia</div>
</div>`;
const b = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium", args:["--no-sandbox"] });
const p = await b.newPage({ viewport:{width:1100,height:820}, deviceScaleFactor:2 });
await p.setContent(html);
writeFileSync("label.png", await p.locator(".l").screenshot());
await b.close();
console.log("label.png written");
