import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push("page: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text());
});
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Start hopping" }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: "/workspace/screenshots/decades.png", fullPage: true });
await page.getByRole("button", { name: /The First Pair/ }).click();
await page.waitForTimeout(2200);
await page.screenshot({ path: "/workspace/screenshots/play-1966.png" });
const canvas = page.locator("canvas");
const box = await canvas.boundingBox();
console.log("canvas box", box);
if (box) {
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.55);
  await page.mouse.down();
  await page.waitForTimeout(700);
  await page.screenshot({ path: "/workspace/screenshots/play-charging.png" });
  await page.mouse.up();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "/workspace/screenshots/play-after-hop.png" });
}
console.log("errors", JSON.stringify(errors, null, 2));
await browser.close();
