import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "How to play" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/how-to.png", fullPage: true });
await page.getByRole("button", { name: "Choose a decade" }).click();
await page.getByRole("button", { name: /The First Pair/ }).click();
await page.waitForTimeout(1600);
const box = await page.locator("canvas").boundingBox();
async function tryCharge(ms) {
  await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.6);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
  await page.waitForTimeout(1600);
  const hud = await page.locator("text=/Hop /").first().textContent().catch(() => "");
  return hud;
}
// one attempt
const after = await tryCharge(520);
console.log("after 520ms charge hud", after);
await page.screenshot({ path: "/workspace/screenshots/play-land-attempt.png" });
console.log("errors", errors);
await browser.close();
