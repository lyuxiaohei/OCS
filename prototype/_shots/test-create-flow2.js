const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  const log = (...a) => console.log(...a);

  // ===== A 完整提交:standalone 全填 =====
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket-create.html?mode=standalone', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.fill('#fTitle', '测试：用户反馈冰箱不制冷');
  await page.fill('#custSearch', '陈芳');
  await page.waitForTimeout(400);
  await page.locator('#custList .inline-item').first().click();
  await page.selectOption('#fCategory', { label: '咨询业务' });
  await page.waitForTimeout(300);
  await page.selectOption('#fSubCategory', { index: 1 });
  await page.waitForTimeout(300);
  await page.selectOption('#fType', { index: 1 });
  await page.selectOption('#fPriority', { index: 1 });
  await page.selectOption('#fDeadline', { index: 1 });
  await page.fill('#fProject', '(兆点)苏宁邮政项目');
  await page.selectOption('#fFeedback', { index: 1 });
  await page.selectOption('#fDept', { index: 1 });
  await page.locator('.fm-actions .btn-primary').click();
  await page.waitForTimeout(300);
  log('[A] 提交 toast:', await page.locator('.cs-toast, [class*=toast]').last().textContent().catch(() => '(无)'));
  await page.waitForTimeout(1200);
  log('[A] 落地 URL:', page.url());
  const cnt = await page.locator('tbody tr', { hasText: '冰箱不制冷' }).count();
  log('[A] ★ 列表出现新工单?', cnt > 0 ? 'YES' : 'NO —— 建单即丢失');
  log('[A] localStorage 里有建单数据?', await page.evaluate(() => Object.keys(localStorage).join(',') || '(空)'));

  // ===== C 工作台 → 创建工单 =====
  await page.goto('http://127.0.0.1:8765/admin/admin-workbench.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const btn = page.locator('text=创建工单').first();
  await btn.click();
  await page.waitForTimeout(900);
  log('[C] 创建工单落地 URL:', page.url().slice(0, 140));
  if (page.url().includes('ticket-create')) {
    log('[C] 标题预填:', JSON.stringify(await page.locator('#fTitle').inputValue()));
    log('[C] ctx横幅:', await page.locator('#ctxBox').isVisible() ? '显示' : '隐藏');
    log('[C] 客户只读:', JSON.stringify(await page.locator('#fCustomerRO').inputValue().catch(() => '(无)')));
  }
  await browser.close();
})();
