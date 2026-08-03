const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', m => { if (['error','warning'].includes(m.type())) errors.push(m.type()+': '+m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  const log = (...a) => console.log(...a);

  // ---------- create standalone ----------
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket-create.html?mode=standalone', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1) + 添加订单(查询关联) 按钮
  await page.locator('button:has-text("添加订单")').first().click();
  await page.waitForTimeout(900);
  let frame = page.frames().find(f => f.url().includes('drawer-ticket-order'));
  log('[standalone] 点+添加订单 → 抽屉打开?', !!frame);
  if (frame) {
    await frame.locator('.order-item').first().click();
    await frame.locator('#confirmBtn').click();
    await page.waitForTimeout(500);
  }
  log('[standalone] 抽屉确认后行数:', await page.locator('#orderCardList tr').count(), '| 首行:', (await page.locator('#orderCardList tr').first().innerText()).replace(/\t/g,'|').slice(0,60));

  // 2) 手动输入 + 追加
  await page.fill('#manualOrder', '260717081900001');
  await page.locator('button:has-text("追加")').click();
  await page.waitForTimeout(500);
  log('[standalone] 手动追加后行数:', await page.locator('#orderCardList tr').count());
  log('[standalone] 追加行内容:', (await page.locator('#orderCardList tr').last().innerText()).replace(/\t/g,'|').slice(0,80));

  // 3) 移除
  const before = await page.locator('#orderCardList tr').count();
  await page.locator('#orderCardList .oci-del').last().click();
  await page.waitForTimeout(400);
  log('[standalone] 移除:', before, '→', await page.locator('#orderCardList tr').count());

  // ---------- create session 模式(默认入口) ----------
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket-create.html?mode=session', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('button:has-text("添加订单")').first().click();
  await page.waitForTimeout(900);
  frame = page.frames().find(f => f.url().includes('drawer-ticket-order'));
  log('[session] 点+添加订单 → 抽屉打开?', !!frame);
  if (!frame) {
    const ov = await page.locator('.cs-modal-overlay, [class*=modal], iframe').count();
    log('[session] 页面内 modal/iframe 元素数:', ov);
    const t = await page.locator('.cs-toast, [class*=toast]').last().textContent().catch(()=>'(无toast)');
    log('[session] toast:', t);
  }

  // ---------- detail ----------
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket-detail.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('a:has-text("添加订单")').first().click();
  await page.waitForTimeout(900);
  frame = page.frames().find(f => f.url().includes('drawer-ticket-order'));
  log('[detail] 点+添加订单 → 抽屉打开?', !!frame);
  if (!frame) {
    const t = await page.locator('.cs-toast, [class*=toast]').last().textContent().catch(()=>'(无toast)');
    log('[detail] toast:', t);
  }

  console.log('errors:', errors.length ? errors.join(' || ') : 'none');
  await browser.close();
})();
