import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function attempt(ms) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start hopping" }).click();
  await page.getByRole("button", { name: /The First Pair/ }).click();
  await page.waitForTimeout(1800);
  const box = await page.locator("canvas").boundingBox();
  await page.mouse.move(box.x + 400, box.y + 500);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
  await page.waitForTimeout(1800);
  const score = await page.locator(".tabular-nums").nth(2).textContent();
  const hop = await page.locator(".tabular-nums").nth(0).textContent();
  await page.screenshot({ path: `/workspace/screenshots/land-${ms}.png` });
  await page.close();
  return { ms, hop, score };
}

const results = [];
for (const ms of [350, 500, 650, 800]) {
  results.push(await attempt(ms));
}
console.log(results);
await browser.close();
