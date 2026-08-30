import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/workspace/screenshots/title-ladder.png' });
await page.getByRole('button', { name: /how to play/i }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/workspace/screenshots/how-ladder.png' });
await page.getByRole('button', { name: /walk 1966/i }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: '/workspace/screenshots/select-ladder.png' });
await page.getByRole('button', { name: /the first pair/i }).click();
await page.waitForTimeout(1800);
await page.screenshot({ path: '/workspace/screenshots/play-hard-1966.png' });
// try a sloppy charge — should often miss now
const box = await page.locator('canvas').boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
  await page.mouse.down();
  await page.waitForTimeout(900);
  await page.mouse.up();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: '/workspace/screenshots/play-hard-miss.png' });
}
await browser.close();
console.log('ok');
