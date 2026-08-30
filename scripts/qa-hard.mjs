import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'] });

async function hop(ms) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /start walking/i }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /the first pair/i }).click();
  await page.waitForTimeout(1600);
  const box = await page.locator('canvas').boundingBox();
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
  await page.waitForTimeout(1800);
  const msg = await page.locator('p.font-display').allTextContents();
  const hud = await page.locator('text=Hop').first().evaluate(el => el.parentElement?.innerText).catch(()=>'');
  await page.screenshot({ path: `/workspace/screenshots/charge-${ms}.png` });
  console.log('charge', ms, 'msgs', msg.slice(0,4), 'hud', JSON.stringify(hud));
  await page.close();
}
await hop(350);
await hop(550);
await hop(900);
await browser.close();
