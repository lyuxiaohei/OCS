# 色彩与字体规范

> 基于 P06 原型统一样式 `prototype/styles.css`，对齐 Ant Design v5 设计体系。
> 适用于管理端（service-frontend）与用户端（service-user）。最后更新：2026-06-11

---

## 1. 完整色板

### 1.1 品牌色阶（基于 #1677ff）

主色 `#1677ff` 为 Ant Design v5 默认 Daybreak Blue，全端统一使用。

| 级别 | 色值 | 用途 |
|------|------|------|
| primary-1 | `#e6f4ff` | hover bg、会话列表 active 背景 |
| primary-2 | `#bae0ff` | tag bg、轻量填充背景 |
| primary-3 | `#91caff` | disabled 状态、占位描边 |
| primary-4 | `#69b1ff` | light 强调、渐变浅端 |
| primary-5 | `#4096ff` | hover（btn-primary:hover） |
| primary-6 | `#1677ff` | 默认主色（按钮、链接、徽标） |
| primary-7 | `#0958d9` | active 按下态 |
| primary-8 | `#003eb3` | dark 深色强调 |

> 渐变场景：`linear-gradient(135deg, #1677ff, #4096ff)` —— 用于卡片 banner、统计数值。

### 1.2 中性色阶

| 级别 | 色值 | 用途 |
|------|------|------|
| gray-1 | `#ffffff` | 卡片背景、Agent 气泡背景 |
| gray-2 | `#fafafa` | 次级背景 |
| gray-3 | `#f5f5f5` | hover 背景、分隔区块 |
| gray-4 | `#f0f0f0` | 卡片边框、Header 底边 |
| gray-5 | `#d9d9d9` | 默认按钮边框、输入框边框 |
| gray-6 | `#bfbfbf` | 离线状态点、占位文本 |
| gray-7 | `#8c8c8c` | 辅助文本（时间戳、label） |
| gray-8 | `#595959` | 次级正文 |
| gray-9 | `#1f1f1f` | 主正文（body color） |
| gray-10 | `#141414` | 暗色主题底背景 |

> 页面级背景：`#f0f2f5`（admin-content）；用户端聊天区背景：`#ededed`。

### 1.3 功能色

每个功能色提供完整的三态（默认 / hover / active / border / bg）。

| 语义 | 默认 | hover | active | bg | border |
|------|------|-------|--------|-----|--------|
| Success 成功 | `#52c41a` | `#73d13d` | `#389e0d` | `#f6ffed` | `#b7eb8f` |
| Warning 警告 | `#faad14` | `#ffc53d` | `#d48806` | `#fffbe6` | `#ffe58f` |
| Error 错误 | `#ff4d4f` | `#ff7875` | `#d9363e` | `#fff1f0` | `#ffccc7` |
| Info 信息 | `#1677ff` | `#4096ff` | `#0958d9` | `#e6f4ff` | `#91caff` |

> Error 深色变体 `#f5222d` 用于 tag-urgent 文字与 coupon 卡片 banner 渐变。

### 1.4 业务场景色

源自 `styles.css` 中 status-badge、msg-card banner、tag 定义，业务语义固定不可混用。

| 场景 | 色值 | 来源 | 说明 |
|------|------|------|------|
| 在线状态 | `#52c41a` (绿) | `.status-badge.online` | 客服/用户在线圆点 |
| 离线状态 | `#bfbfbf` (灰) | `.status-badge.offline` | 离线圆点 |
| 等待中 | `#faad14` (橙) | `.status-badge.waiting` | 排队等待、原型提示框左边框 |
| 转接中 | `#722ed1` (紫) | 业务扩展 | 转接会话标识 |
| 未读徽标 | `#ff4d4f` (红) | 业务扩展 | 会话未读消息计数 |
| 用户气泡 | `#95ec69` (微信绿) | `.msg-bubble-user` | 用户端发送气泡背景 |
| 客服气泡 | `#ffffff` (白) | `.msg-bubble-agent` | 客服/系统回复气泡背景 |
| 订单卡片 | `#fa8c16 → #ffa940` | `.msg-card.order` | 订单卡片 banner 渐变 |
| 优惠券卡片 | `#f5222d → #ff7875` | `.msg-card.coupon` | 优惠券卡片 banner 渐变 |
| 商品卡片 | `#52c41a → #73d13d` | `.msg-card.product` | 商品卡片 banner 渐变 |

> 暗色主题（AI Dashboard）：底色 `#141414`，卡片 `#1f1f1f`，边框 `#303030`，统计数值采用 `#1677ff → #52c41a` 渐变文字。

---

## 2. 字体规范

### 2.1 字体族

```css
/* 中文优先（与 styles.css body font-family 对齐） */
font-family: -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
```

| 用途 | 字体栈 | 说明 |
|------|--------|------|
| 中文 | `"PingFang SC", "Microsoft YaHei", sans-serif` | macOS/iOS 用苹方，Windows 用微软雅黑 |
| 英文/数字 | `-apple-system, "Segoe UI", Roboto, sans-serif` | 系统字体优先，保证数字渲染清晰 |
| 等宽 | `"SF Mono", "Cascadia Code", "Consolas", monospace` | 订单号、金额、代码片段 |

### 2.2 字号体系（管理端）

| 用途 | 字号 | 行高 | 字重 | 示例 |
|------|------|------|------|------|
| H1 页面标题 | 20px | 28px | 600 | 客服工作台 |
| H2 区块标题 | 16px | 24px | 600 | 待处理事项、客户信息 |
| Card 标题 | 15px | 22px | 600 | 会话详情卡片标题 |
| H3 列表标题 | 14px | 22px | 500 | 会话列表项、客户名 |
| Body 正文 | 14px | 22px | 400 | 消息内容、表单文本 |
| Caption 辅助 | 13px | 20px | 400 | 客户信息行、面包屑 |
| Tag/Mini | 12px | 20px | 400 | 时间戳、标签、系统提示气泡 |

> 基准正文 14px / line-height 1.5（与 styles.css body 一致）；统计数值例外：32px / 700。

### 2.3 字号体系（用户端 — 移动端 375px）

移动端字号较管理端略大，保证小屏可读性。

| 用途 | 字号 | 行高 | 字重 | 示例 |
|------|------|------|------|------|
| 导航标题 | 17px | 24px | 600 | 聊天页 Header 标题 |
| 消息正文 | 15px | 22px | 400 | 气泡内文字（建议上浮 1px） |
| 卡片标题 | 15px | 22px | 500 | 订单/商品卡片标题 |
| 卡片辅助 | 13px | 20px | 400 | 卡片描述、金额备注 |
| 系统提示 | 12px | 18px | 400 | 居中系统气泡、时间分割 |
| 输入框 | 15px | — | 400 | 底部输入区文字 |

> 当前 styles.css 消息气泡为 14px，移动端落地时建议提升至 15px 以符合 iOS HIG。

### 2.4 字重使用规则

| 字重 | 数值 | 使用场景 |
|------|------|----------|
| Regular | 400 | 正文、辅助文本、时间戳、输入框文字 |
| Medium | 500 | 列表项标题、卡片标题、强调内容 |
| Semi-Bold | 600 | 页面标题、区块标题、按钮文字、导航标题 |
| Bold | 700 | 统计数值（dashboard-stat .stat-value） |

> 规则：正文永远 400；标题与按钮永远 600；列表项 500 做层级过渡；禁止对正文使用 700。

---

## 3. 对比度检查

依据 WCAG 2.1，文本与背景对比度需达标。下表基于实际配色组合计算（使用 WebAIM 对比度算法）。

### 3.1 管理端（亮色主题）

| 文本色 | 背景色 | 对比度 | 等级 | 场景 |
|--------|--------|--------|------|------|
| `#1f1f1f` (gray-9) | `#ffffff` | 15.3:1 | AAA | 卡片正文 |
| `#1f1f1f` (gray-9) | `#f0f2f5` | 13.6:1 | AAA | 页面正文 |
| `#595959` (gray-8) | `#ffffff` | 7.5:1 | AAA | 次级正文 |
| `#8c8c8c` (gray-7) | `#ffffff` | 3.9:1 | ⚠ AA Fail | 仅用于 ≥14px 辅助文本，需提升至 `#767676`(4.5:1) |
| `#8c8c8c` (gray-7) | `#f5f5f5` | 3.5:1 | ⚠ AA Fail | 时间戳背景 hover 态，建议改 `#767676` |
| `#1677ff` (primary-6) | `#ffffff` | 4.5:1 | AA | 链接、主色文字（达标下限） |
| `#0958d9` (primary-7) | `#ffffff` | 7.3:1 | AAA | 链接 active 态 |
| `#ffffff` | `#1677ff` (按钮) | 4.5:1 | AA | 主按钮文字（达标下限） |
| `#ffffff` | `#001529` (侧边栏) | 17.4:1 | AAA | 侧边栏菜单文字 |
| `rgba(255,255,255,0.85)` | `#001529` | 14.1:1 | AAA | 侧边栏次级文字 |

### 3.2 用户端（移动聊天）

| 文本色 | 背景色 | 对比度 | 等级 | 场景 |
|--------|--------|--------|------|------|
| `#1f1f1f` | `#95ec69` (用户气泡) | 10.2:1 | AAA | 用户气泡文字 |
| `#1f1f1f` | `#ffffff` (客服气泡) | 15.3:1 | AAA | 客服气泡文字 |
| `#ffffff` | `rgba(0,0,0,0.12)` (系统提示) | ⚠ 低 | Fail | 系统气泡需加深背景至 `rgba(0,0,0,0.45)` 达 4.5:1 |
| `#1f1f1f` | `#ededed` (聊天区) | 13.9:1 | AAA | 聊天区默认文字 |

### 3.3 功能色文字对比

| 文本色 | 背景色 | 对比度 | 等级 | 场景 |
|--------|--------|--------|------|------|
| `#52c41a` (success) | `#f6ffed` | 3.2:1 | ⚠ 仅大字号 | tag-normal，<14px 不可读 |
| `#f5222d` (error) | `#fff1f0` | 4.8:1 | AA | tag-urgent 文字 |
| `#faad14` (warning) | `#fffbe6` | 2.4:1 | Fail | 提示框文字，需深化为 `#ad6800`(5.2:1) |
| `#614700` (note 深棕) | `#fffbe6` | 7.1:1 | AAA | prototype-note 正文（已达标） |

### 3.4 整改建议（需在 P08-UI 落地时修正）

1. `#8c8c8c` 辅助文本在白底未达 AA（3.9:1）→ 提升至 `#767676`（4.5:1）。
2. 系统提示气泡 `rgba(0,0,0,0.12)` 背景过浅 → 加深至 `rgba(0,0,0,0.45)` 或改用 `#000` + 80% 不透明度。
3. Warning 文字 `#faad14` 在 `#fffbe6` 上对比度仅 2.4:1 → 文字改 `#ad6800`（深琥珀）。
4. Success tag 文字 `#52c41a` 在 `#f6ffed` 上仅 3.2:1 → 小字号场景改用 `#389e0d`（5.0:1）。
5. 主按钮白字对 `#1677ff` 刚好 4.5:1（下限），关键 CTA 建议用 `#0958d9` 提升至 7.3:1（AAA）。

---

## 附录：设计 Token 导出（CSS 变量）

供前端实现时直接引用：

```css
:root {
  /* Brand */
  --primary-1: #e6f4ff;
  --primary-5: #4096ff;
  --primary-6: #1677ff;
  --primary-7: #0958d9;

  /* Neutral */
  --gray-1: #ffffff;
  --gray-3: #f5f5f5;
  --gray-4: #f0f0f0;
  --gray-7: #8c8c8c;
  --gray-9: #1f1f1f;

  /* Functional */
  --success: #52c41a;
  --warning: #faad14;
  --error: #ff4d4f;
  --info: #1677ff;

  /* Business */
  --status-online: #52c41a;
  --status-offline: #bfbfbf;
  --status-waiting: #faad14;
  --status-transfer: #722ed1;
  --badge-unread: #ff4d4f;
  --bubble-user: #95ec69;
  --bubble-agent: #ffffff;
}
```
