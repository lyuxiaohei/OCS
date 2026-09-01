const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  const log = (...a) => console.log(...a);

  // ===== 流程 A:列表页 → 创建工单(standalone) =====
  await page.goto('http://127.0.0.1:8765/admin/admin-ticket.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.locator('#btnCreate').click();
  await page.waitForTimeout(700);
  log('[A1] 落地 URL:', page.url());
  log('[A1] ctx横幅显示?', await page.locator('#ctxBox').isVisible());
  log('[A1] 客户搜索框显示?', await page.locator('#custSearch').isVisible());
  log('[A1] 标题字段值:', JSON.stringify(await page.locator('#fTitle').inputValue()));

  // 直接提交 → 校验顺序
  await page.locator('.fm-actions .btn-primary').click();
  await page.waitForTimeout(400);
  const toast1 = await page.locator('.cs-toast, [class*=toast]').last().textContent().catch(() => '(无toast)');
  log('[A2] 空表单提交提示:', toast1);

  // 填标题后再提交 → 看下一个校验
  await page.fill('#fTitle', '测试：用户反馈冰箱不制冷');
  await page.locator('.fm-actions .btn-primary').click();
  await page.waitForTimeout(400);
  log('[A3] 只填标题提交提示:', await page.locator('.cs-toast, [class*=toast]').last().textContent().catch(() => '(无)'));

  // 客户搜索
  await page.fill('#custSearch', '陈芳');
  await page.waitForTimeout(500);
  const items = await page.locator('#custList .inline-item').count();
  log('[A4] 客户搜索"陈芳"命中:', items);
  if (items) await page.locator('#custList .inline-item').first().click();
  await page.waitForTimeout(300);

  // 三级联动
  const catOpts = await page.locator('#fCategory option').allTextContents();
  log('[A5] 一级选项:', JSON.stringify(catOpts));
  await page.selectOption('#fCategory', { label: '咨询业务' });
  await page.waitForTimeout(400);
  const subOpts = await page.locator('#fSubCategory option').allTextContents();
  log('[A5] 选一级后二级选项:', JSON.stringify(subOpts.slice(0, 4)));
  const subEnabled = await page.locator('#fSubCategory').isEnabled();
  log('[A5] 二级可选?', subEnabled);
  if (subOpts.length > 1) await page.selectOption('#fSubCategory', { index: 1 });
  await page.waitForTimeout(400);
  const typeOpts = await page.locator('#fType option').allTextContents();
  log('[A5] 选二级后三级选项数:', typeOpts.length, JSON.stringify(typeOpts.slice(0, 3)));
  if (typeOpts.length > 1) await page.selectOption('#fType', { index: 1 });

  // 优先级/期限
  await page.selectOption('#fPriority', { index: 1 });
  await page.selectOption('#fDeadline', { index: 1 });

  // 业务字段:项目/反馈方式/提交部门
  log('[A6] 项目名称默认:', JSON.stringify(await page.locator('#fProject').inputValue()));
  const fbOpts = await page.locator('#fFeedback option').allTextContents();
  log('[A6] 反馈方式选项:', JSON.stringify(fbOpts));
  await page.selectOption('#fFeedback', { index: 1 });
  await page.selectOption('#fDept', { index: 1 });

  // 提交
  await page.locator('.fm-actions .btn-primary').click();
  await page.waitForTimeout(300);
  log('[A7] 提交提示:', await page.locator('.cs-toast, [class*=toast]').last().textContent().catch(() => '(无)'));
  await page.waitForTimeout(1200);
  log('[A7] 跳转后 URL:', page.url());
  // 列表里找新工单
  const found = await page.locator('tbody tr', { hasText: '冰箱不制冷' }).count();
  log('[A7] ★ 列表中能找到刚建的工单?', found > 0 ? 'YES' : 'NO —— 工单消失了');

  // ===== 流程 B:订单列表 → 行内创建工单 =====
  await page.goto('http://127.0.0.1:8765/admin/admin-order-list.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.locator('.op-create').first().click();
  await page.waitForTimeout(700);
  log('[B1] 落地 URL 前120:', page.url().slice(0, 120));
  log('[B1] 标题预填:', JSON.stringify(await page.locator('#fTitle').inputValue()));
  log('[B1] 客户只读值:', JSON.stringify(await page.locator('#fCustomerRO').inputValue()));
  // 直接提交看还差什么
  await page.locator('.fm-actions .btn-primary').click();
  await page.waitForTimeout(400);
  log('[B2] 订单模式直接提交提示:', await page.locator('.cs-toast, [class*=toast]').last().textContent().catch(() => '(无)'));

  // ===== 流程 C:工作台创建工单入口 =====
  await page.goto('http://127.0.0.1:8765/admin/admin-workbench.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const zg = await page.locator('text=创建工单').count();
  log('[C1] 工作台「创建工单」按钮数:', zg);

  console.log('errors:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
})();
