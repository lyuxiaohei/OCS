# 原型复核报告

## 1. 复核概述

- **复核对象**: 21 个 HTML 原型页面（用户端 5 + 管理端 12 + AI 端 3 + 首页 1）
- **复核维度**: 功能覆盖度 / 交互合理性 / 视觉一致性
- **复核日期**: 2026-06-11
- **复核方法**: 交叉比对 P05 功能清单（F-001~F-080，80 项）、P06 交互文档（23 页），并实测 13 个关键 HTML 文件（admin-workbench / user-chat / user-entry / user-offline / user-rating / admin-todo / admin-transfer / admin-customer-info / admin-knowledge / admin-scripts / admin-settings / admin-dashboard / ai-report）

---

## 2. 功能覆盖度复核

### 2.1 总体覆盖统计

| 范围 | 功能总数 | 已可视化 | 缺失 | 覆盖率 |
|------|---------|---------|------|--------|
| 已实现（F-001/002/040-050） | 13 | 13 | 0 | 100% |
| 1期-MVP（F-003~035,056,058） | 22 | 19 | 3 | 86% |
| 2期（F-011~039,051-055） | 19 | 8 | 11 | 42% |
| 3期（F-059~080） | 25+ | 3（部分） | 22+ | 12% |
| **合计** | **80** | **43** | **37** | **54%** |

> 总体覆盖率 54%，对原型阶段可接受；1期 MVP 接近完成，但存在 3 项 MVP-Critical 功能缺失可视化，2期覆盖率骤降至 42%。

### 2.2 逐页覆盖表

| 页面 | 文件 | 可视化功能 | 覆盖质量 |
|------|------|-----------|---------|
| U-01 聊天主界面 | user-chat.html | F-031(语音) F-034(订单卡) F-035(商品卡) F-036(优惠券) F-030(评价UI) F-005(撤回文案) F-046(断线) | 强 — 全部卡片类型渲染，语音波形，评价内联 |
| U-02 场景入口 | user-entry.html | F-033(6页入口) | 强 — 6 个 entry_tag 场景文档化 |
| U-03 离线留言 | user-offline.html | F-029(留言提交) | 合格 |
| U-04 服务评价 | user-rating.html | F-030(评价UI) | 强 — 4 维度星标 + 标签 + 评论 + 成功态 |
| U-05 FAQ 列表 | user-faq.html | F-025(FAQ快捷问题) | 合格 |
| A-01 登录 | admin-login.html | F-048(账号管理 部分) | 合格 |
| A-02 仪表盘 | admin-dashboard.html | F-053(部分) F-054(部分) | 合格 |
| A-03 工作台 | admin-workbench.html | F-001 F-002(部分) F-016~019 F-034~036 F-042~045 | **最强页** — 三栏布局完整，客户信息 4 标签全填充 |
| A-04 待办面板 | admin-todo.html | F-003 | 合格 |
| A-05 会话列表 | admin-session-list.html | F-040 F-041 | 合格 |
| A-06 客户信息 | admin-customer-info.html | F-016~019 F-020(标签 部分) | 强 — Mock 横幅明确，行为时间线，订单表，服务历史 |
| A-07 知识库 | admin-knowledge.html | F-022 | 合格 — 分类树 + 文章 CRUD 表 |
| A-08 话术库 | admin-scripts.html | F-023 F-042 | 合格 |
| A-09 评价管理 | admin-rating-mgmt.html | F-024 | 合格 |
| A-10 留言管理 | admin-leave-mgmt.html | F-008 | 合格 |
| A-11 会话转接 | admin-transfer.html | F-002 | 合格 |
| A-12 系统设置 | admin-settings.html | F-004 F-006 F-007 F-009 F-010 F-043 F-049 | 强 — 5 分区（欢迎/离线/路由/超时/敏感词）全部可交互 |
| AI-01 机器人配置 | ai-bot-config.html | F-063(部分) | 合格 |
| AI-02 智能质检 | ai-quality.html | F-061(部分) | 合格 |
| AI-03 报表看板 | ai-report.html | F-073(部分) | 合格 |

### 2.3 功能覆盖度差距清单

**[Critical] 1期-MVP 关键功能未可视化（3 项）**

| 功能ID | 名称 | 优先级 | 差距说明 |
|--------|------|--------|---------|
| F-032 | 电话呼叫 | P0-C | user-chat.html more-panel 仅含 "📞 电话" 静态标签（行 741），无通话中 UI、无 VoIP 拨号器、无回拨流程。P04 竞品分析已明确升级为 P0-C（七陌/智齿核心功能，0.5d 工作量） |
| F-005 | 消息撤回 | P0-C | 文档提及 "长按消息支持撤回（2分钟内）"，但无长按菜单可视化、无 "已撤回" 系统消息态、无撤回气泡样式。管理端 A-03 同样缺失 |
| F-058 | Mock/真实接口切换 | P0-C | 无 UI 开关或开发面板展示 Mock vs 真实 API 切换（可接受作为终端原型，但应在 admin-settings 出现开发模式切换） |

**[Major] 2期功能未可视化（11 项）**：F-011 消息预显、F-012 三方会话、F-013 拉黑/屏蔽、F-014 主动推送、F-015 输入状态提示、F-021 订单上下文提醒、F-026 AI话术推荐、F-028 个人绩效看板、F-037 智能商品推荐、F-038 猜你想问+自助办理、F-039 转人工意图提示。

**[Minor] 3期功能未可视化（22+ 项）**：除 AI 端 3 项部分可视化（F-061/F-063/F-073）外，其余 3期 功能均未展示。可接受 — 3期 明确 "未纳入讨论范围"。

---

## 3. 交互合理性复核

### 3.1 导航流程

- **[Good]** index.html 作为清晰的三段式卡片网格枢纽（用户端 5 / 管理端 12 / AI 端 3 = 20 页），所有卡片链接均指向已验证存在的 HTML；7 个被复核页面均有 "← 返回原型首页" 回链。轴辐模型成立。

- **[Critical]** admin-todo.html 与 admin-transfer.html 侧边栏 **0 可点击菜单项**：admin-todo（行 182-192）与 admin-transfer（行 489-501）的每个 `.menu-item` 均为无 `href`/`onclick` 的裸 `<div>`。reviewer 点击 "客服工作台" 无反应。这两页是 "处理待办→跳转工作台"、"发起转接→确认" 的主要意图页，导航完全断裂。

- **[Major]** 管理端三页采用 **三种不同的侧边栏结构 + 标签漂移**：
  - admin-workbench：顶部栏（6 项，无侧边栏）
  - admin-todo：左侧栏（11 项，标签如 "✅ 待办事项"）
  - admin-transfer：左侧栏带分组标题（工作台/服务管理/配置）
  - 同一目的地有 3 种标签："📁 历史会话"（transfer）vs "📋 会话列表"（todo）vs "会话记录"（workbench）。用户无法形成稳定的心智模型。

- **[Minor]** user-chat 头部 "更多" 三点控件有 hover 样式但无 `onclick`（行 514）。移动端此处应入口 "结束会话/转人工/评价"。

### 3.2 交互模式一致性

- **[Major]** 会话列表标签切换仅视觉切换、不换数据：admin-workbench 3 标签（进行中 8 / 等待中 3 / 已关闭 13）的 JS（行 1329-1334）只切换 `.active` 类，不过滤列表内容。"已关闭" 标签下仍显示在线会话，与备注（行 1323）声称的过滤能力矛盾。

- **[Major]** 评价提交行为在 user-chat 与规格冲突：user-chat 在消息流内嵌内联评价卡（行 689-713，星标/标签 JS 可用）；但 admin-todo（行 527）声明规范设计为 **独立评价页/弹层**（user-rating.html 专为此存在）。同一 US-MVP-21 流程存在两种冲突模式。

- **[Major]** 发送按钮无禁用态同步：admin-workbench 发送按钮有 `:disabled` CSS（行 594）但 Enter 发送 JS（行 1373-1384）从不切换 `disabled` 属性 — 空输入时按钮始终可点，空发送路径未定义。

- **[Minor]** 卡片按钮类型不一致：workbench 用 `<div class="tc-btn">`、user-chat 用 `<div class="card-action">`、todo 用 `<button class="btn-sm">`。`<div>` 不可键盘聚焦，无障碍性受损。

- **[Minor]** 快捷回复覆盖而非追加：admin-workbench 行 1366 `ta.value = it.textContent.trim()` — 选第二个快捷回复会替换第一个。

### 3.3 用户旅程完整性（入口→聊天→结束→评价）

- **[Critical]** user-entry 6 个 "联系客服" 悬浮按钮（`.cs-fab`，行 454 起）**无 href 或 onclick**，交互备注（行 722）承诺 "跳转至聊天主界面并自动发送带场景标签首条消息"，但点击无反应。**入口→聊天的交接在最首步即断裂。**

- **[Major]** user-chat 无用户主动 "结束会话" 动作：会话 "漂入" 内联评价卡（行 687 分隔线），无结束按钮。独立 user-rating.html 仅可从 index 到达，不从 user-chat 进入。chat→end→rating 旅程是隐式的。

- **[Major]** 无 user-chat → user-offline 路径：user-chat 硬编码 "在线" 客服状态，无切换或场景开关。US-MVP-20/22 依赖的离线分支从聊天页内完全无法体验。

- **[Good]** 离线留言表单完整：user-offline.html 3 字段表单含验证（行 374-386）、联系方式切换（359-371）、成功视图含工单号 + 重置（389-395）。用户端流程中内部最完整的一页。

### 3.4 错误/边界情况处理

- **[Major]** 无用户端排队等待屏：系统有 `waiting-users`/`waiting-user-count` WebSocket action，admin-todo 显示 "排队超时·王芳"（行 407），但 **用户端无任何排队状态原型** — 无 "您前面还有 N 人" 等待屏、无预估等待。CLAUDE.md 将 "排队等待提示" 标记为已具备，但用户侧原型存在盲点。

- **[Major]** 转接无用户侧表现：admin-transfer 完整展示客服侧转接记录 + 目标选择，但 **用户被转接的体验**（"您的会话已转接给客服 X" 系统消息）在 user-chat.html 中完全缺失。`user-transfer` action 在原型中仅后端存在。

- **[Minor]** admin-todo "立即回复" 仅 8 行未读中的 1 行（张伟，行 283）有按钮，其余 7 行仅时间戳。无视觉原因（如 "已分配他人" 标签），疑似疏漏。

- **[Minor]** admin-transfer 行操作 `<a>`（行 629 "催办|详情|取消"）均为裸 `<a>` 无 href。结合死侧边栏，admin-transfer 实为静态截图。

### 3.5 移动端响应式（用户端）

- **[Good]** user-chat、user-offline 移动优先：使用共享 `.chat-mobile-container`（375px），含 `viewport` meta，点击目标 32-34px（略低于 iOS 44px 最小值但原型可接受）。

- **[Major]** user-entry.html **非移动端 — 是桌面展示页**：标注 "用户端·Taro"（行 389）但以 3 列桌面网格（`.entry-grid`，行 105，`max-width:1280px`）渲染 6 个商城页 Mock，每卡含桌面 "浏览器地址栏" Mock（行 169）。对 Taro 小程序目标而言，这错误地表达了实际 UI。

- **[Minor]** user-chat 输入行在 <360px 屏幕拥挤：4 图标（各 30px）+ 输入 + 发送挤在 54px 行内，320px 视口下文本输入仅约 170px。无 `min-width` 保护。

---

## 4. 视觉一致性复核

### 4.1 颜色一致性

- **[Pass]** 主色 `#1677ff` 跨所有页面一致用于：激活导航项、主按钮/链接、聚焦边框、头像渐变、强调指标。无竞争性主蓝冲突。

- **[Major]** CSS 变量令牌重复声明 — `--cs-primary` 在 3 个文件中独立声明：`admin-login.html`、`admin-workbench.html`、`styles.css` 各自定义 `--cs-primary: #1677ff` 及相关令牌。而 `styles.css` 本身根本不定义这些 CSS 变量（全量硬编码 `#1677ff`），`admin-dashboard.html` 和 `ai-report.html` 也不声明 `--cs-*` 而内联硬编码。结果：5 页面、3 种不同主色来源方式。存在漂移风险，应统一到 `styles.css :root`。

- **[Minor]** 头像渐变不一致：`styles.css` `.session-avatar` 用平面 `background: #1677ff`，但每个页面级覆盖（workbench/dashboard/user-chat）都重声明为 `linear-gradient(135deg, #1677ff, #4096ff)`。共享类与其覆盖不一致。

- **[Minor]** 用户气泡颜色冲突：`styles.css` 定义 `.msg-bubble-user { background: #95ec69 }`（微信绿），但 `admin-workbench.html` 完全忽略并用自己的 `.msg-row.user .msg-bubble { background: #e6f4ff }`（Ant 蓝）。用户端与客服端将用户自己的消息渲染为两种不同颜色（可辩护：移动=绿/微信，桌面=蓝/AntD，但为未记录分歧 — 共享 `.msg-bubble-user` 类在客服上下文中实际已失效）。

### 4.2 排版

- **[Major]** 标题层级跨页不一致：
  - admin-login：`.login-title` = 20px
  - user-chat：`.page-head h1` = 20px
  - admin-dashboard / ai-report：页标题内联 `font-size:16px`，但 `.section-row h3` = 16px（与页标题同尺寸 — 无层级）
  - admin-workbench：`.left-title` = 16px，根本无 `<h1>`/`<h2>`
  - 无共享字号比例。仪表盘页上节标题与页标题在 16px 碰撞。

- **[Minor]** 基础 font-family 差异：`styles.css` body 用 `-apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei"`；`admin-workbench.html` 重声明为 `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei"`（增加 `BlinkMacSystemFont` 并重排序）。

- **[Pass]** body 基础字号 14px 与小文本约定（meta/label 12-13px）一致应用。

### 4.3 布局/间距/卡片

- **[Major]** 卡片组件分裂为 4+ 变体无共享契约：
  - `styles.css` `.card`：padding 20px，radius 8px，border `#f0f0f0`
  - `admin-dashboard.html` `.metric-card`：padding `20px 24px`，radius 8px（不同 padding）
  - `ai-report.html` `.metric-card`：与 dashboard 完全相同的重复定义（复制粘贴，非共享）
  - `admin-workbench.html` `.thread-card`/`.order-mini`：padding 10px，radius 8px
  - `styles.css` 已定义 `.card`，但两个仪表盘页都从零重定义 `.metric-card` 而非扩展 `.card`。`.metric-card` 块在 dashboard 与 ai-report 间逐字复制（约 50 行相同代码）。

- **[Minor]** 网格间距统一（`.grid { gap: 16px }`）一致应用 — 良好。

- **[Minor]** 管理端侧边栏宽度/结构分歧：`styles.css` `.admin-sidebar` = 208px（dashboard + ai-report 用）；`admin-workbench.html` 用 48px 顶部栏替代。两种管理端导航范式并存，无文档化理由。

### 4.4 组件模式（按钮/标签/徽章）

- **[Critical]** 按钮分类碎片化 — 至少 5 个重叠按钮类，无共享复用：
  - `styles.css`：`.btn-primary`、`.btn-default`
  - `admin-login.html`：`.btn-login`（忽略 `.btn-primary`，从零重定义）
  - `admin-workbench.html`：`.btn-sm`、`.btn-sm.primary`、`.card-btn`、`.tc-btn`、`.tc-btn.solid`、`.send-btn`
  - `admin-dashboard.html`/`ai-report.html`：用 `.btn-primary`/`.btn-default` 但几乎每个按钮都加内联 `style="padding:2px 10px; font-size:12px;"`
  - `styles.css` 按钮定义 `padding: 6px 16px`，但 dashboard/report 页每个实例都通过内联样式缩小。无共享 `.btn-sm`。workbench 自造 `.btn-sm` 而不加到共享表。

- **[Major]** 标签/徽章模式分歧为三种方案：
  - `styles.css`：`.tag-urgent`（红）、`.tag-normal`（绿）
  - `admin-workbench.html`：`.s-tag.waiting`、`.s-tag.urgent`、`.s-tag.transferred` — 不同类命名空间，不同颜色（urgent 文字 `#cf1322` vs 共享 `#f5222d`）
  - `user-chat.html`：`.rating-tag` 带 `.selected` — 又一种样式
  - "urgent" 标签依页面渲染不同（颜色 `#f5222d` 共享 vs `#cf1322` workbench）。

- **[Minor]** 状态徽章（`.status-badge.online/.offline/.waiting`）在 `styles.css` 定义但仅 `ai-report.html` 表格使用。workbench 自定义 `.status-pill` 和 `agent-status::before` 圆点模式。存在 3 种 "在线圆点" 实现。

### 4.5 三端差异化

- **[Pass]** 三端清晰区分：
  - **管理端（AntD）**：深色侧边栏 `#001529`，白卡片，`#1677ff` 主色，14px sans
  - **用户端（移动）**：375px 容器，`#ededed` 微信灰背景，绿色用户气泡 `#95ec69`，圆角移动外壳
  - **AI 端（仪表盘）**：同管理端外壳但用紫色 `#722ed1` 强调（`.phase-tag`、`.header-avatar`、仪表、AI 图例）+ "3期" 标签区分

- **[Minor]** `styles.css` 声明 `.dashboard-dark` 深色主题块（行 336-361）**从未使用**。`ai-report.html` 不应用 `.dashboard-dark`，改用浅色管理主题 + 紫色强调。死/误导性 CSS，暗示原型未交付的 AI 深色主题。

- **[Minor]** `styles.css` `.msg-card`（富媒体）被覆盖并部分取代：共享 `.msg-card`（240px，特定横幅渐变）在 `user-chat.html` 重定义（248px，不同横幅高 56px vs 90px，`border-radius:10px` vs `8px`），并在 `admin-workbench.html` 被 `.thread-card` 完全取代。共享类实际不是真理来源。

### 4.6 styles.css 类使用 vs 内联覆盖

- **[Major]** 共享类上的重度内联样式覆盖模式：`admin-dashboard.html` 和 `ai-report.html` 几乎对每个共享组件实例应用内联 `style=""`：
  - 按钮：`style="padding:2px 10px; font-size:12px;"`（dashboard 中 6+ 处）
  - 信息值：`.info-row .v` 上 `style="color:#faad14; font-weight:600;"`、`style="color:#722ed1;"`、`style="color:#52c41a;"`
  - 排名头像/条：`style="background:#52c41a;"` 等
  - 这使共享样式表失效。颜色/尺寸意图活在 HTML 中而非 CSS。

- **[Major]** `styles.css` 类被覆盖而非扩展。确认被覆盖（在页面 `<style>` 中重声明）而非复用：`.session-avatar`（平面→渐变）、`.session-item`/`.session-item.active`（左边框 vs `::before` 条）、`.msg-bubble-user`（绿→蓝）、`.msg-card`+`.card-banner`（尺寸/颜色）、`.chat-header`/`.chat-input-area`/`.chat-messages`（padding/gap）、`.metric-card`/`.chart-placeholder`/`.fake-bars`/`.section-row`/`.header-avatar`/`.menu-group-title`（dashboard 与 ai-report 间逐字复制而非放入 `styles.css`）。

- **[Pass]** `styles.css` 被全部 5 个 HTML 文件链接（`<link rel="stylesheet" href="styles.css" />`）— 无文件完全自包含。

- **[Critical — 死共享 CSS]** 若干 `styles.css` 类从未被任何页面使用：`.dashboard-dark` 和 `.dashboard-stat`（整个 AI 深色主题块，行 333-361）、`.msg-card .card-banner` 默认（总被覆盖）、`.msg-bubble-system`（user-chat 自定义 `.msg-system` 替代）。

---

## 5. 问题清单（按严重程度分级）

### Critical（必须修复，阻塞）

| # | 问题 | 页面 | 维度 | 建议 |
|---|------|------|------|------|
| C-1 | 电话呼叫（F-032）未可视化 — P0-Critical 功能仅静态 "电话" 标签，无通话发起/通话中/通话历史 UI | user-chat.html | 功能覆盖 | 新增呼叫发起模态 + 通话中覆盖层状态 |
| C-2 | 消息撤回（F-005）UI 不完整 — 无长按菜单、无 "已撤回" 系统气泡、无撤回气泡样式（用户端+客服端均缺） | user-chat.html / admin-workbench.html | 功能覆盖 | 新增长按上下文菜单 Mock + "xxx撤回了一条消息" 系统气泡示例 |
| C-3 | admin-todo & admin-transfer 侧边栏 0 可点击菜单项 — 所有 `.menu-item` 为裸 `<div>`，管理端页间导航完全断裂 | admin-todo.html / admin-transfer.html | 交互合理性 | 为所有侧边栏菜单项添加 `href` 指向对应页面 |
| C-4 | user-entry 6 个 "联系客服" 悬浮按钮无链接 — 入口→聊天交接在最首步即断裂 | user-entry.html | 交互合理性 | 为 `.cs-fab` 添加 `href="user-chat.html?entry_tag=xxx"` |
| C-5 | 按钮分类碎片化 — 5+ 重叠按钮类，无共享 `.btn-sm`，dashboard/report 每按钮内联样式缩小 | 全局 | 视觉一致性 | 在 `styles.css` 统一 `.btn-primary`/`.btn-default`/`.btn-sm`/`.btn-xs`，删除内联 padding/font-size |
| C-6 | 死共享 CSS — `.dashboard-dark`/`.dashboard-stat` 未使用（约 30 行），`.msg-bubble-system` 失效 | styles.css | 视觉一致性 | 删除死代码或按设计实现 |

### Major（重要，建议修复）

| # | 问题 | 页面 | 维度 | 建议 |
|---|------|------|------|------|
| M-1 | 智能路由规则引擎（F-004）仅部分可视化 — 只有 3 个高层策略单选，无多条件路由规则构建器，无 entry_tag→分组映射矩阵 | admin-settings.html | 功能覆盖 | 新增路由规则表展示 "IF entry_tag=order THEN 售后组" 风格规则 |
| M-2 | 离线自动回复（F-009）仅配置无触发可视化 — 无用户侧离线触发流程，无 AI 兜底回复气泡 | admin-settings.html / user-offline.html | 功能覆盖 | 在 user-offline.html 新增自动回复系统消息 "客服离线，已为您转接AI/留言" |
| M-3 | 话术库场景分类（F-023）缺场景标签 — workbench 快捷回复面板仅显示分类标题，非 F-023 定义的细粒度场景标签 | admin-scripts.html / admin-workbench.html | 功能覆盖 | 在 admin-scripts.html 明确场景标签过滤 UI |
| M-4 | 会话列表标签切换仅视觉、不换数据 — "已关闭" 标签下仍显示在线会话 | admin-workbench.html | 交互合理性 | 标签切换 JS 应过滤会话列表内容 |
| M-5 | 评价模式冲突 — user-chat 内联评价卡 vs 独立 user-rating.html 页，两种模式代表同一 US-MVP-21 流程 | user-chat.html vs user-rating.html | 交互合理性 | 确定一种规范模式并统一 |
| M-6 | 管理端导航不一致 — 三种侧边栏结构 + 标签漂移（同一目的地 3 种标签） | workbench/todo/transfer | 交互合理性 | 统一管理端导航结构与标签命名 |
| M-7 | 无用户主动 "结束会话" 动作 — 会话漂入评价卡，chat→end→rating 旅程隐式 | user-chat.html | 交互合理性 | 新增 "结束会话" 按钮驱动评价流程 |
| M-8 | 无用户端排队等待屏 — CLAUDE.md 标记 "排队等待提示" 已具备但用户侧原型存在盲点 | 缺失页面 | 交互合理性 | 新增 "您前面还有 N 人" 等待屏原型 |
| M-9 | 转接无用户侧表现 — "会话已转接给客服 X" 系统消息在 user-chat 完全缺失 | user-chat.html | 交互合理性 | 新增转接确认系统消息 |
| M-10 | user-entry 非移动端 — 标注 "Taro" 但为 3 列桌面网格 + 浏览器地址栏 Mock | user-entry.html | 交互合理性 | 改为移动端 375px 单列商城页 Mock |
| M-11 | 发送按钮空输入不禁用 — `:disabled` CSS 存在但 JS 从不切换 | admin-workbench.html | 交互合理性 | 输入为空时切换 `disabled` 属性 |
| M-12 | `--cs-*` 令牌在 3 文件独立声明 — styles.css 不定义而硬编码，5 页面 3 种主色来源 | styles.css / admin-login / admin-workbench | 视觉一致性 | 令牌统一到 `styles.css :root`，删除页面级 `:root` 块 |
| M-13 | 标题层级无比例 — 页标题与节标题在 16px 碰撞，workbench 无 `<h1>`/`<h2>` | 全局 | 视觉一致性 | 建立共享字号比例（如页标题 20px / 节标题 16px / 正文 14px） |
| M-14 | 卡片组件分裂 4+ 变体 — `.metric-card` 在 dashboard 与 ai-report 间逐字复制约 50 行 | styles.css / dashboard / ai-report | 视觉一致性 | 将 `.metric-card`/`.section-row`/`.menu-group-title` 等提升到 `styles.css` |
| M-15 | 标签/徽章三种方案 + 颜色漂移 — urgent 标签 `#f5222d` vs `#cf1322` | 全局 | 视觉一致性 | 选一种标签系统（`.tag-*` 或 `.s-tag`）并统一颜色 |
| M-16 | 共享类上重度内联样式覆盖 — 颜色/尺寸意图活在 HTML 而非 CSS | dashboard / ai-report | 视觉一致性 | 提取语义类到 `styles.css`，移除内联 `style=""` |
| M-17 | 共享类被覆盖而非扩展 — `.session-avatar`/`.msg-bubble-user`/`.msg-card` 等被重声明 | 全局 | 视觉一致性 | 改为扩展（如 `.card.metric-card`）而非重定义 |

### Minor（次要，可延后）

| # | 问题 | 页面 | 维度 | 建议 |
|---|------|------|------|------|
| m-1 | 历史服务记录（F-040）vs 历史会话（F-041）合并 — 单页覆盖两者，可接受 | admin-session-list.html | 功能覆盖 | 无需操作 |
| m-2 | FAQ 快捷问题（F-025）缺 "热门问题" 算法可视化 — 无 "🔥 Hot" 徽章或浏览量排序指示 | user-faq.html | 功能覆盖 | 新增热门徽章/浏览量排序指示 |
| m-3 | 系统初始化配置（F-047）未可视化 — CLI 命令无 UI，交互文档未提及 | 文档 | 功能覆盖 | 文档补充 CLI 说明 |
| m-4 | user-chat 头部 "更多" 三点死控件 — 有 hover 无 onclick | user-chat.html | 交互合理性 | 接入结束会话/转人工/评价入口 |
| m-5 | 卡片按钮类型不一致 — `<div>` vs `<button>` 混用，无障碍性受损 | workbench/user-chat/todo | 交互合理性 | 统一为 `<button>` |
| m-6 | 快捷回复覆盖而非追加 — 选第二条替换第一条 | admin-workbench.html | 交互合理性 | 改为在光标处追加 |
| m-7 | admin-todo 仅 8 行未读中 1 行有 "立即回复" 按钮 | admin-todo.html | 交互合理性 | 统一操作可用性或加状态标签说明 |
| m-8 | admin-transfer 行操作 `<a>` 均无 href — 实为静态截图 | admin-transfer.html | 交互合理性 | 接入操作或标注为静态示意 |
| m-9 | user-chat 输入行 <360px 拥挤 — 4 图标 + 输入 + 发送挤 54px 行 | user-chat.html | 交互合理性 | 加 `min-width` 保护或响应式折叠 |
| m-10 | 头像渐变不一致 — 共享平面 vs 页面级渐变 | 全局 | 视觉一致性 | 统一为渐变并放入共享类 |
| m-11 | 用户气泡颜色绿/蓝未记录分歧 — 移动绿 vs 桌面蓝 | user-chat vs workbench | 视觉一致性 | 文档记录设计意图 |
| m-12 | font-family 重排序 — workbench 增加 BlinkMacSystemFont | admin-workbench.html | 视觉一致性 | 统一到 styles.css |
| m-13 | 管理端双导航范式 — 208px 侧边栏 vs 48px 顶部栏并存 | 全局 | 视觉一致性 | 文档化设计理由 |
| m-14 | 3 种 "在线圆点" 实现 — `.status-badge`/`.status-pill`/`agent-status::before` | 全局 | 视觉一致性 | 统一为一种实现 |
| m-15 | `.dashboard-dark` 死深色主题块暗示未交付 AI 主题 | styles.css | 视觉一致性 | 删除或实现 |

---

## 6. 改进建议

按优先级排序的前 8 项改进：

1. **【Critical · 交互】打通管理端导航**：为 admin-todo.html 与 admin-transfer.html 所有侧边栏 `.menu-item` 添加 `href` 指向对应页面，使 "待办→工作台"、"转接→确认" 旅程可点击。（对应 C-3）

2. **【Critical · 交互】接通入口→聊天交接**：为 user-entry.html 6 个 `.cs-fab` 悬浮按钮添加 `href="user-chat.html?entry_tag=xxx"`，兑现交互文档 "自动发送带场景标签首条消息" 的承诺。（对应 C-4）

3. **【Critical · 功能】补齐电话呼叫（F-032）UI**：在 user-chat.html 新增呼叫发起模态 + 通话中覆盖层 + 通话历史卡片，匹配 P04 竞品分析的 P0-C 升级。（对应 C-1）

4. **【Critical · 功能】补齐消息撤回（F-005）视觉态**：在 user-chat.html 与 admin-workbench.html 新增长按上下文菜单 + "xxx撤回了一条消息" 系统气泡示例。（对应 C-2）

5. **【Major · 交互】新增用户端排队等待屏**：当前用户侧旅程存在盲点 — 用户要么在线聊天要么离线留言，中间的排队状态无原型。新增 "您前面还有 N 人，预计等待 X 分钟" 等待屏。（对应 M-8）

6. **【Critical · 视觉】统一设计令牌到 styles.css :root**：将 `--cs-primary` 等令牌集中到 `styles.css :root`，删除 admin-login/admin-workbench 的页面级 `:root` 块，所有文件消费同一令牌源；删除 `.dashboard-dark`/`.dashboard-stat` 等死 CSS。（对应 C-5、C-6、M-12）

7. **【Major · 视觉】提升共享组件并消除复制粘贴**：将 `.metric-card`/`.section-row`/`.menu-group-title`/`.header-avatar`/`.chart-placeholder`/`.btn-sm` 提升到 `styles.css`，删除 dashboard 与 ai-report 间约 50 行逐字复制。（对应 M-14、C-5）

8. **【Major · 交互】统一评价流程为一种规范模式**：在 user-chat 内联评价卡与独立 user-rating.html 间选定一种作为 US-MVP-21 的规范实现，消除两种冲突模式。（对应 M-5）

---

## 7. 复核结论

### 结论：CONDITIONAL（有条件通过）

**理由：**

原型在 **功能覆盖度** 上表现合格（总体 54%，1期 MVP 86%，已实现 100%），A-03 工作台为最强页（三栏布局完整、客户信息 4 标签全填充），user-offline 表单为用户端内部最完整流程。三端差异化清晰（管理端 AntD / 用户端移动 / AI 端紫色强调）。

但存在 **6 项 Critical 阻塞问题**，须在 P06 设计评审签字前修复：

- **2 项功能阻塞**：F-032 电话呼叫、F-005 消息撤回为 P0-Critical 1期功能，原型零可视化或仅静态标签。
- **2 项交互阻塞**：admin-todo/admin-transfer 侧边栏完全不可点击（管理端导航断裂）；user-entry 悬浮按钮无链接（入口→聊天首步即断）。
- **2 项视觉阻塞**：按钮分类 5+ 重叠无共享契约；死共享 CSS 约 30 行误导性主题块。

**放行条件（须全部满足方可转为 PASS）：**

1. 修复 C-1 ~ C-6 全部 6 项 Critical 问题
2. 修复 M-1（路由规则表）、M-8（排队等待屏）、M-9（转接用户侧表现）、M-10（user-entry 移动化）4 项高优 Major 问题
3. 完成改进建议 #6（设计令牌统一）作为视觉一致性基线

**可延后至开发阶段**：其余 Major 与全部 Minor 问题可在开发任务分解时作为前端规范（design tokens / 共享组件库）一并处理，不阻塞原型签字。

---

*报告生成：P07-prototype-review / OUTPUT-01*
*复核依据：P05/OUTPUT-01 功能清单（80 项）、P06/OUTPUT-01 交互文档（23 页）、13 个 HTML 文件实测*
