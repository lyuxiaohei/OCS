# 组件库定义 — CS 商城客服系统

> 阶段：P08 UI 设计 · 版本 V1.0 · 更新于 2026-06-11
> 上游依据：P06@V1.0 原型样式 `prototype/styles.css` · P06@V1.0 交互说明文档 · P06 设计令牌（色彩 / 字体 / 间距 / 圆角 / 阴影 / 动效）
> 管理端落地框架：Ant Design v5 + Umi Max · 用户端框架：Taro 4.0 + React 18
> 色彩令牌统一前缀 `--cs-*`，详见 P06 设计令牌章节

---

## 1. 基础组件

### 1.1 Button 按钮

按钮基于 Ant Design v5 `Button` 封装，遵循原型 `styles.css` 中 `.btn-primary` / `.btn-default` 定义。

| 类型 | 背景色 | 文字色 | 边框 | 使用场景 |
|------|--------|--------|------|---------|
| Primary | `#1677ff`（hover `#4096ff`） | `#fff` | 无 | 主操作（发送消息 / 提交 / 保存） |
| Default | `#fff` | `#1f1f1f`（hover `#1677ff`） | `1px solid #d9d9d9`（hover `#1677ff`） | 次要操作（取消 / 关闭） |
| Text | 透明 | `#1677ff` | 无 | 链接式操作（查看更多 / 跳转） |
| Danger | `#ff4d4f`（hover `#ff7875`） | `#fff` | 无 | 删除 / 危险操作（下线知识 / 清空） |
| Link | 透明 | `#1677ff`（hover `#4096ff`） | 无 | 行内链接（如「查看订单」） |

**尺寸规格**

| 尺寸 | 高度 | 内边距 | 字号 | 圆角 | 适用场景 |
|------|------|--------|------|------|---------|
| large | `40px` | `8px 24px` | `15px` | `6px` | 登录提交 / 大区域主操作 |
| middle | `32px` | `6px 16px` | `14px` | `6px` | 默认尺寸，表格操作 / 表单提交 |
| small | `24px` | `2px 8px` | `12px` | `4px` | 列表行内操作 / 卡片 CTA |

**通用交互态**：`transition: all 0.2s` · disabled 态 opacity `.5` + cursor `not-allowed` · loading 态显示 `<Loading />` 图标替换左侧 icon。

---

### 1.2 Input 输入框

| 状态 | 边框色 | 阴影 | 背景 | 说明 |
|------|--------|------|------|------|
| 默认 | `#d9d9d9` | 无 | `#fff` | 未聚焦静态状态 |
| 聚焦 (focus) | `#1677ff` | `0 0 0 2px rgba(22,119,255,.12)` | `#fff` | 蓝色聚焦环 |
| 错误 (error) | `#ff4d4f` | `0 0 0 2px rgba(255,77,79,.12)` | `#fff` | 校验失败 |
| 禁用 (disabled) | `#d9d9d9` | 无 | `#f5f5f5` | 不可编辑 |

**规格**：默认高度 `32px`（large `40px` / small `24px`）· 内边距 `4px 11px` · 圆角 `6px` · 字号 `14px` · 占位符色 `#bfbfbf`。

**变体**：
- `TextArea` 多行：行高 `1.5`，最小高度 `80px`，右下角拖拽调整高度手柄
- `Search` 搜索框：右侧内嵌放大镜图标，回车触发 `onSearch`
- 用户端聊天输入：`height: 36px` · `border-radius: 18px`（胶囊形）· 内边距 `0 16px`（见 `styles.css .chat-input-area input`）

---

### 1.3 Tag 标签

方形标签 `border-radius: 4px`，内边距 `2px 8px`，字号 `12px`，用于状态标记与会话属性。

| 标签 | 背景色 | 文字色 | 边框色 | 场景 |
|------|--------|--------|--------|------|
| 紧急 urgent | `#fff1f0` | `#f5222d` | `#ffccc7` | 待办紧急 / 超时风险 |
| 超时 timeout | `#fff7e6` | `#d46b08` | `#ffd591` | 会话即将超时 |
| 待处理 pending | `#fffbe6` | `#614700` | `#ffe58f` | 待办未处理 |
| 已回复 replied | `#f6ffed` | `#389e0d` | `#b7eb8f` | 会话已回复 |
| 正向 positive | `#f6ffed` | `#52c41a` | `#b7eb8f` | 评价正向标签 |
| 负向 negative | `#fff1f0` | `#f5222d` | `#ffccc7` | 评价负向标签 |
| 期次·1期 | `#e6f4ff` | `#1677ff` | — | MVP 必交付 |
| 期次·2期 | `#f6ffed` | `#389e0d` | — | 体验提升 |
| 期次·3期 | `#f9f0ff` | `#722ed1` | — | AI 智能化 |
| 核心 | `#fff7e6` | `#d46b08` | — | 核心功能标记 |

**胶囊变体**：`border-radius: 999px`，用于 entry_tag 来源场景（home / product / order / cart / help / profile）。

---

### 1.4 Badge 徽标

| 类型 | 颜色 | 形态 | 场景 |
|------|------|------|------|
| 未读计数 | `#ff4d4f` 底 / `#fff` 字 | 圆形 / 胶囊，`min-width: 16px`，`font-size: 11px` | 会话列表未读消息数 |
| 红点 dot | `#ff4d4f` | `6px × 6px` 圆点 | 悬浮咨询按钮有新消息 |
| 在线点 online | `#52c41a` | `6px × 6px` 圆点 | 客服 / 用户在线 |
| 忙碌点 busy | `#faad14` | `6px × 6px` 圆点 | 客服忙碌 |
| 离线点 offline | `#bfbfbf` | `6px × 6px` 圆点 | 客服离线 |
| 等待点 waiting | `#faad14` | `6px × 6px` 圆点 | 会话排队中 |

**组合规则**：状态点位于头像右下角，`2px` 白色描边；未读计数位于列表项右上角，`box-shadow: 0 0 0 1px #fff`。

---

## 2. 业务组件

### 2.1 会话列表项 SessionItem

工作台左栏与历史会话列表的核心行单元。

**布局**（对应 `styles.css .session-item`）：

```
┌──────────────────────────────────────────────┐
│ [头像40]  昵称 / 客服名           12:30      │
│          最后消息预览...           [未读 3]   │
│          [来源标签] [状态点]                  │
└──────────────────────────────────────────────┘
```

| 元素 | 规格 |
|------|------|
| 容器 | `display: flex` · `gap: 12px` · `padding: 12px` · `border-bottom: 1px solid #f0f0f0` |
| 头像 | `40px × 40px` 圆形，默认 `#1677ff` 底 + 白色首字，右下角状态点 |
| 昵称 | `font-size: 14px` · `font-weight: 500` · `color: #1f1f1f` |
| 时间 | `font-size: 12px` · `color: #8c8c8c` · 右上角 |
| 最后消息 | `font-size: 12px` · `color: #8c8c8c` · `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` |
| 未读数 | Badge 红底圆形，右上角 |
| 来源标签 | 胶囊 Tag，昵称下方 |
| 选中态 active | 背景 `#e6f4ff` · `border-left: 3px solid #1677ff` |
| 悬浮态 hover | 背景 `#f5f5f5` · `transition: background 0.2s` |

---

### 2.2 消息气泡 MessageBubble

聊天消息流核心组件，区分四种来源（对应 `customer_chat_messages.source`）。

| 来源 | 对齐 | 背景 | 文字 | 圆角 | 边框 | 附加 |
|------|------|------|------|------|------|------|
| 用户 (source=0) | 右 (`flex-end`) | `#95ec69` 微信绿 | `#1f1f1f` | `8px`，右上角 `2px` 尖角 | 无 | 无头像 |
| 客服 (source=1) | 左 (`flex-start`) | `#fff` | `#1f1f1f` | `8px`，左上角 `2px` 尖角 | `1px solid #eee` | 左侧带头像 `32px` |
| 系统 (source=2) | 居中 | `rgba(0,0,0,.12)` | `#fff` | `4px` | 无 | 字号 `12px`，内边距 `4px 12px` |
| AI (source=3) | 左 (`flex-start`) | `#f9f0ff` 浅紫 | `#1f1f1f` | `8px`，左上角 `2px` | `1px solid #d3adf7` | 左上角「AI」角标紫色 `#722ed1` |

**通用规格**：`max-width: 72%` · `padding: 9px 14px` · `font-size: 14px` · `word-wrap: break-word` · 气泡间 `gap: 10px`。

**消息流容器**：`display: flex; flex-direction: column; gap: 10px; padding: 12px; background: #ededed; overflow-y: auto`。

**附加元素**：
- 时间戳：气泡下方，`font-size: 11px` · `color: #bfbfbf`
- 已读状态：用户气泡右下角，「已读」灰色 / 「未读」蓝色
- 撤回标记：撤回后气泡替换为灰色文字「XX 撤回了一条消息」（居中系统消息样式）

---

### 2.3 卡片消息 MessageCard

富媒体卡片嵌于消息流内，统一容器 `.msg-card`：`width: 240px` · `border-radius: 8px` · `border: 1px solid #f0f0f0` · `overflow: hidden` · `font-size: 13px`。

#### 订单卡片 order_card

```
┌─────────────────────────────┐
│  [橙色渐变 banner: 订单]      │  ← linear-gradient(135deg, #fa8c16, #ffa940)
├─────────────────────────────┤
│  订单号: NO.20260611001      │
│  [商品图] 商品名缩略...       │
│  状态: 待发货        ¥299.00 │
│  ┌─────────────────────────┐ │
│  │      查看订单            │ │  ← #1677ff 底白字 CTA
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

| 元素 | 规格 |
|------|------|
| banner | `height: 90px` · 橙色渐变 `linear-gradient(135deg, #fa8c16, #ffa940)` |
| card-body | `padding: 10px 12px` |
| card-row | `display: flex; justify-content: space-between; margin: 4px 0` |
| CTA | `text-align: center` · `padding: 8px` · `background: #1677ff` · `color: #fff` · `margin-top: 8px` · `cursor: pointer` |

#### 商品卡片 product_card

| 元素 | 规格 |
|------|------|
| banner | `height: 90px` · 绿色渐变 `linear-gradient(135deg, #52c41a, #73d13d)` |
| 字段 | 商品主图 + 名称 + 规格 + 价格 |
| CTA | 「查看商品」跳转商品详情页 |

#### 优惠券卡片 coupon_card

| 元素 | 规格 |
|------|------|
| banner | `height: 90px` · 红色渐变 `linear-gradient(135deg, #f5222d, #ff7875)` |
| 字段 | 券面额（大字）+ 适用范围 + 有效期 |
| CTA | 「立即领取」，领取后变为「已领取」灰色 disabled |

**卡片交互**：hover `transform: translateY(-2px)` · `box-shadow: 0 2px 8px rgba(0,0,0,.10)` · CTA 点击跳转对应商城详情页（用户端）或新标签打开（管理端）。

---

### 2.4 客户信息面板 CustomerInfoPanel

工作台右栏与客户详情页（A-06）共用，4 Tab 切换。

**容器**：`background: #fff` · `border-radius: 8px` · `border: 1px solid #f0f0f0` · `padding: 16px`。

**Tab 结构**：

| Tab | 字段 | 数据来源 |
|-----|------|---------|
| 基础信息 | 头像、昵称、手机号、会员等级、注册时间、最近活跃 | `users` 表 + 商城会员系统 |
| 行为数据 | 浏览轨迹、咨询历史、关注商品 | 商城埋点（2 期补齐） |
| 交易数据 | 订单总数、消费总额、最近订单列表 | OMS 对接 |
| 服务数据 | 历史会话数、平均满意度、投诉记录、标签 | `customer_chat_sessions` 聚合 |

**字段行 info-row**：`display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px`。
- 标签 `info-label`：`color: #8c8c8c`
- 值：`color: #1f1f1f`

**顶部摘要区**：头像 `64px` + 昵称 + 会员等级徽章 + 来源 entry_tag 标签。

**快捷操作区**（底部固定）：打标签 / 查看订单 / 发起会话 / 加入黑名单（2 期）。

---

### 2.5 待办面板 TodoPanel

待办事项集中视图（A-04），按紧急程度分区。

**容器**：`background: #fff` · `border-radius: 8px` · `border: 1px solid #f0f0f0` · `padding: 16px`。

**3 Section 分区**：

| Section | 标题 | 内容 | 颜色编码 |
|---------|------|------|---------|
| 未回复会话 | 「未读会话」+ 计数 | 用户发消息后客服未回复的会话 | 紧急红 `#f5222d`（超 60s） |
| 超时预警 | 「超时预警」+ 计数 | 接近或超过约定响应时长的会话 | 警告橙 `#faad14` |
| 待评价回访 | 「待回访」+ 计数 | 差评（1-2 星）待跟进 | 负向红 `#f5222d` |

**待办项 todo-item 规格**：

| 元素 | 规格 |
|------|------|
| 容器 | `display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f5f5f5` |
| 左侧 | 优先级标签 + 来源会话名 + 剩余时间倒计时 |
| 右侧 | 「处理」按钮（small primary） |
| 倒计时 | `< 60s` 红色高亮闪烁；`< 5min` 橙色；`> 5min` 灰色 |
| 操作 | 标记完成 / 忽略 / 转交他人（more 菜单） |

**顶部统计条**：今日待办总数 / 已处理数 / 超时数（3 个 mini stat，字号 `20px` 粗体 + `12px` 标签）。

---

## 3. 导航组件

### 3.1 管理端侧边栏 Sidebar

Ant Design v5 `Layout.Sider` 封装（对应 `styles.css .admin-sidebar`）。

| 元素 | 规格 |
|------|------|
| 容器 | `width: 208px` · `background: #001529` · `color: rgba(255,255,255,.85)` · `padding: 16px 0` |
| Logo | `height: 56px` · 居中 · `font-size: 16px` · `font-weight: 600` · `color: #fff` · 底部 `1px solid rgba(255,255,255,.08)` |
| 菜单项 menu-item | `padding: 10px 24px` · `cursor: pointer` · `transition: all 0.2s` |
| 菜单 hover | `background: rgba(255,255,255,.06)` |
| 菜单 active | `background: #1677ff` · `color: #fff` |

**6 大模块**：工作台 / 会话 / 客户 / 知识 / 设置 /（3 期）AI。每项含图标（左）+ 文字（右），子菜单展开缩进 `24px`。

---

### 3.2 用户端底部 TabBar

Taro `TabBar` 配置，仅用于用户端独立页面（聊天主界面为全屏，不显示 TabBar）。

| Tab | 图标 | 文字 | 跳转 |
|-----|------|------|------|
| 首页 | home | 首页 | 商城首页 |
| FAQ | help-circle | 常见问题 | U-05 FAQ 列表 |
| 我的 | user | 个人中心 | 个人中心 |

**规格**：`height: 50px` · 背景 `#fff` · 上边框 `1px solid #e5e5e5` · 文字选中 `#1677ff` / 未选中 `#8c8c8c` · 图标 `24px`。

---

## 4. 弹窗与反馈

### 4.1 Modal 对话框

基于 Ant Design `Modal`。

| 元素 | 规格 |
|------|------|
| 遮罩 | `background: rgba(0,0,0,.45)` |
| 容器 | `background: #fff` · `border-radius: 8px` · `box-shadow: 0 6px 16px rgba(0,0,0,.08)` |
| 头部 | `padding: 16px 24px` · 标题 `font-size: 16px; font-weight: 600` |
| 内容 | `padding: 16px 24px` · `font-size: 14px` |
| 底部 | 右对齐，Default 取消 + Primary 确认，`gap: 8px` |

**宽度档位**：small `400px` / default `520px` / large `720px`。

---

### 4.2 评价弹窗 RatingModal

用户端会话结束后触发（对应 U-04 服务评价），全屏 Modal 或底部抽屉。

**结构**：

| 区块 | 元素 | 规格 |
|------|------|------|
| 标题 | 「为本次服务评分」 | 居中，`font-size: 17px; font-weight: 600` |
| 星级 | 5 星可点选 | 星标 `32px`，默认 5 星亮黄 `#faad14`，未选中灰 `#e8e8e8` |
| 标签 | 7 个预设标签（响应快 / 态度好 / 专业 / 解决了问题 / 回复慢 / 态度差 / 没解决） | 胶囊 Tag，正向 `#f6ffed/#52c41a`，负向 `#fff1f0/#f5222d`，可多选 |
| 文字评价 | TextArea，选填，最多 200 字 | 右下角字数计数 `X/200` |
| 匿名开关 | Switch | 默认关闭 |
| 提交按钮 | Primary large 全宽 | 「提交评价」 |

**提交后**：展示「感谢您的评价」成功态 1.5s 后自动关闭并结束会话。

---

### 4.3 留言表单 LeaveMessageForm

用户端离线时展示（对应 U-03 离线留言）。

| 字段 | 类型 | 校验 | 规格 |
|------|------|------|------|
| 问题分类 | Select 下拉 | 必填 | 选项：售前 / 售后 / 物流 / 退款 / 账户 / 其他 |
| 问题描述 | TextArea | 必填 | `min-height: 120px`，最多 500 字 |
| 联系方式 | Input | 必填（手机或邮箱格式） | 已登录用户自动填充 |
| 图片附件 | Upload | 可选，最多 6 张 | 缩略图 `80px`，九宫格 |

**顶部提示横条**：`background: #fffbe6` · `border-left: 4px solid #faad14` · 文案「客服当前不在线，请留下您的问题」。
**提交成功态**：展示「留言成功，客服将在工作时间内回复」+ 「返回」按钮。

---

### 4.4 Toast 轻提示

Ant Design `message` 组件封装。

| 类型 | 图标色 | 背景 | 场景 |
|------|--------|------|------|
| success | `#52c41a` 勾选 | `#f6ffed` | 操作成功（保存 / 提交 / 删除） |
| info | `#1677ff` 信息 | `#e6f4ff` | 中性提示 |
| warning | `#faad14` 警告 | `#fffbe6` | 非阻断性警告 |
| error | `#ff4d4f` 错误 | `#fff1f0` | 操作失败 / 网络异常 |

**规格**：`font-size: 14px` · `border-radius: 6px` · 顶部居中弹出 · 默认 `3s` 自动消失 · `margin-top: 8px` 堆叠。

**用户端 Toast**：Taro `Taro.showToast`，居中弹出，图标 + 标题，`2s` 消失。

---

## 5. 组件交互状态

所有可交互组件统一遵循以下状态规范，状态间 `transition: all 0.2s ease`。

| 状态 | 视觉表现 | 触发 |
|------|---------|------|
| default | 默认静态样式 | 初始 / 离开 |
| hover | 背景加深 / 边框变蓝 / 轻微上浮 `translateY(-2px)` | 鼠标悬停 |
| active / pressed | 背景再加深 / `transform: scale(.98)` | 鼠标按下 / 移动端按压 |
| focus | 蓝色聚焦环 `0 0 0 2px rgba(22,119,255,.12)` + 边框 `#1677ff` | 键盘聚焦 / 点击输入 |
| disabled | `opacity: .5` · `cursor: not-allowed` | 表单未填 / 权限不足 |
| loading | 内容替换为 `<Loading />` 图标 · 禁用交互 | 异步请求中 |
| selected (列表项) | 背景 `#e6f4ff` + 左侧 `3px solid #1677ff` | 会话 / 行选中 |

**特殊动效**：
- 悬浮咨询按钮（用户端）：`fab-pulse 2.4s ease-in-out infinite`，阴影在 `rgba(22,119,255,.35)` ~ `.55` 间呼吸
- 卡片悬浮：`translateY(-3px)` + 阴影增强，`0.18s ease`
- 消息气泡进入：新消息自底部 `fadeIn + translateY(8px → 0)`，`0.2s ease`

---

## 附录：组件 — 页面映射

| 组件 | 使用页面 |
|------|---------|
| Button | 全部页面 |
| Input / TextArea | A-01 登录, A-03 工作台, A-07 知识库, A-08 话术库, A-12 设置, U-01 聊天, U-03 留言 |
| Tag | A-03 工作台, A-04 待办, A-05 会话列表, A-09 评价管理, U-04 评价 |
| Badge | A-03 工作台（未读 / 状态点）, A-02 仪表盘, 用户端悬浮按钮 |
| SessionItem | A-03 工作台左栏, A-05 会话列表 |
| MessageBubble | A-03 工作台中栏, U-01 聊天主界面 |
| MessageCard | A-03 工作台, U-01 聊天, U-02 场景入口 |
| CustomerInfoPanel | A-03 工作台右栏, A-06 客户信息 |
| TodoPanel | A-04 待办面板 |
| Sidebar | 管理端全部页面（A-02 ~ A-12） |
| TabBar | 用户端 FAQ / 我的页面 |
| Modal | A-11 转接, A-07 知识库编辑, A-09 申诉 |
| RatingModal | U-04 服务评价 |
| LeaveMessageForm | U-03 离线留言 |
| Toast | 全部页面（操作反馈） |

---

## 验收要点

- [ ] 基础组件（Button / Input / Tag / Badge）色彩、尺寸、圆角与 `styles.css` 1:1 对齐
- [ ] 业务组件覆盖工作台三栏（SessionItem / MessageBubble / CustomerInfoPanel）全部元素
- [ ] 消息气泡四来源色标（用户 / 客服 / 系统 / AI）与交互文档定义一致
- [ ] 三种卡片（order / product / coupon）banner 渐变色与 CTA 规格明确
- [ ] 所有组件交互态（default / hover / focus / disabled / loading）完整定义
- [ ] 组件与页面映射表可追溯到 P06 交互文档 23 个逻辑页面
