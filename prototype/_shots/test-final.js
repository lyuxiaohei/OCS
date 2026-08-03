const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  const log = (...a) => console.log(...a);

  // 1) http: 抽屉本体截图
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket-create.html?mode=standalone', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('button:has-text("添加订单")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '_shots/drawer-http.png' });
  log('[1] http 抽屉截图完成');

  // 2) file:// 直开
  await page.goto('file:///C:/Users/Administrator/Documents/qoder_project/OCS/prototype-cs/admin/admin-ticket-create.html?mode=standalone');
  await page.waitForTimeout(800);
  await page.locator('button:has-text("添加订单")').first().click().catch(e => log('[2] 点击失败:', e.message.slice(0,80)));
  await page.waitForTimeout(1200);
  const frame = page.frames().find(f => f.url().includes('drawer-ticket-order'));
  log('[2] file:// 抽屉打开?', !!frame);
  await page.screenshot({ path: '_shots/drawer-file.png' });

  // 3) 详情页加订单 → 返回列表 → 再进详情 → 订单还在吗
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket-detail.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const cntBefore = await page.locator('#orderCardList tr').count();
  await page.locator('a:has-text("添加订单")').first().click();
  await page.waitForTimeout(900);
  const fr = page.frames().find(f => f.url().includes('drawer-ticket-order'));
  await fr.locator('.order-item').nth(4).click();
  await fr.locator('#confirmBtn').click();
  await page.waitForTimeout(500);
  const cntAdded = await page.locator('#orderCardList tr').count();
  log('[3] 详情页订单:', cntBefore, '→ 添加后', cntAdded);
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket-detail.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const cntRe = await page.locator('#orderCardList tr').count();
  log('[3] 离开再进详情 → 订单数:', cntRe, cntRe === cntAdded ? '还在' : '★ 蒸发了');

  await browser.close();
})();
