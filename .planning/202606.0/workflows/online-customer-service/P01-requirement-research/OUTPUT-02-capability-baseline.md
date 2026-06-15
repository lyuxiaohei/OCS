# OUTPUT-02: 能力基线

> **阶段**: P01 需求调研
> **任务**: T2 — 能力基线
> **产出日期**: 2026-06-11
> **数据来源**: database.sql、consts.go、router.go、routes.ts、CLAUDE.md

---

## 1. 技术架构基线

### 1.1 三端架构

| 端 | 目录 | 技术栈 | 运行时 | 当前状态 |
|----|------|--------|--------|---------|
| 后端 | `go-chat-service/` | Go 1.23 / GoFrame v2 / MySQL 5.7 / Redis | HTTP + WebSocket | 可运行 |
| 管理端 | `service-frontend/` | React 18 / Umi Max v4 / Ant Design v5 / Tailwind | 浏览器 | 可运行 |
| 用户端 | `service-user/` | Taro 4.0 / React 18 / Tailwind / MobX | 微信小程序 + H5 | 可运行 |

### 1.2 基础设施

| 组件 | 技术选型 | 用途 |
|------|---------|------|
| 数据库 | MySQL 5.7 (`chat` 库) | 业务数据持久化 |
| 缓存 | Redis | 会话状态、在线状态 |
| WebSocket | gorilla/websocket | 实时消息推送 |
| 文件存储 | 七牛云 / 本地 | 聊天文件上传 |
| 认证 | JWT (双端) | Admin + User 认证 |
| 定时任务 | Go cron | 框架已搭建，逻辑待补 |
| 微服务 | gRPC + etcd (可选) | 服务间通信 |
| AI | LangChain Go | AI 对话接口（预留） |

---

## 2. 数据库能力基线

### 2.1 现有表结构（13 张表）

| 表名 | 用途 | 核心字段 | 多租户 | 扩展性评估 |
|------|------|---------|--------|-----------|
| `customers` | 租户 | id, name | — | 低（仅 id+name） |
| `customer_admins` | 客服人员 | id, customer_id, username, password | customer_id | 低（无角色/权限/技能组） |
| `users` | 终端用户 | id, customer_id, username, password | customer_id | 低（无会员等级/标签/画像） |
| `customer_chat_sessions` | 会话 | id, user_id, admin_id, customer_id, rate, type | customer_id | 中（需增 status、closed_at、source_entry 等） |
| `customer_chat_messages` | 消息 | id, session_id, type, content, source, req_id | customer_id | 中（需增 revoked_at、card_data 等） |
| `customer_chat_auto_messages` | 快捷回复 | id, name, type, content, customer_id | customer_id | 中（需增 category_id、scene_tags） |
| `customer_chat_auto_rules` | 自动回复规则 | id, match, match_type, reply_type, message_id, scenes | customer_id | 中（需增 assign_type 等） |
| `customer_chat_auto_rule_scenes` | 规则场景 | id, name, rule_id | — | 中 |
| `customer_chat_settings` | 系统设置 | id, name, value, type, customer_id | customer_id | 高（KV 结构灵活） |
| `customer_admin_chat_settings` | 客服个人设置 | id, admin_id, is_auto_accept, welcome_content, offline_content | — | 中（需增更多配置项） |
| `customer_chat_transfers` | 转接记录 | id, from/to admin/session, remark | customer_id | 中（需增原因/分类） |
| `customer_chat_files` | 聊天文件 | id, path, name, type, disk | customer_id | 高 |

### 2.2 缺失表（1期-MVP 需新增）

| 表名（拟） | 用途 | 关联功能 |
|-----------|------|---------|
| `customer_chat_sensitive_words` | 敏感词库 | F-MVP-04 |
| `customer_chat_route_rules` | 路由分流规则 | F-MVP-02 |
| `knowledge_categories` | 知识库分类 | F-MVP-11 |
| `knowledge_items` | 知识库条目 | F-MVP-11 |
| `customer_chat_leave_messages` | 离线留言 | F-MVP-06, F-MVP-20 |
| `customer_chat_ratings` | 服务评价 | F-MVP-13, F-MVP-21 |
| `customer_chat_quality_inspections` | 质检记录 | B4 PRD |
| `customer_chat_entry_configs` | 入口配置 | F-MVP-16 |

---

## 3. 后端 API 能力基线

### 3.1 已有路由

```
/api/user                   → 前台（UserAuth 中间件保护）
/api/user                   → CUser（登录/注册）
/api/user/chat              → CWs（WebSocket）+ CChat（消息接口）

/api/backend/login          → CCurrentAdmin.Login（无需认证）
/api/backend/               → AdminAuth 中间件保护
  /dashboard                → CDashboard
  /session                  → CSession
  /admin                    → CCustomerAdmin
  /current                  → CCurrentAdmin（Index/UpdateSetting/GetSetting）
  /auto-message             → CAutoMessage
  /image                    → CImage
  /auto-rule                → CAutoRule
  /system-rule              → CSystemRule
  /chat-setting             → CChatSetting
  /transfer                 → CTransfer
  /option                   → COption
  /ws                       → CWs
  /chat                     → CChat
  /chat-file                → CChatFile
```

### 3.2 需新增 API（1期-MVP）

| 路由（拟） | 用途 | 关联功能 |
|-----------|------|---------|
| `/api/backend/route-rule/*` | 路由规则 CRUD | F-MVP-02 |
| `/api/backend/sensitive-word/*` | 敏感词 CRUD | F-MVP-04 |
| `/api/backend/session-timeout/*` | 超时设置 | F-MVP-05 |
| `/api/backend/knowledge/*` | 知识库 CRUD | F-MVP-11 |
| `/api/backend/leave-message/*` | 留言管理 | F-MVP-06 |
| `/api/backend/rating/*` | 评价管理 | F-MVP-13 |
| `/api/backend/todo/*` | 待办事项 | F-MVP-01 |
| `/api/backend/revoke` | 消息撤回 | F-MVP-03 |
| `/api/user/chat/leave-message` | 用户留言提交 | F-MVP-20 |
| `/api/user/chat/rating` | 用户评价提交 | F-MVP-21 |
| `/api/user/chat/entry-config` | 入口配置查询 | F-MVP-16 |
| `/api/user/chat/faq` | FAQ 快捷问题 | F-MVP-24 |

---

## 4. WebSocket 能力基线

### 4.1 已有 Action

| Action | 方向 | 说明 | 状态 |
|--------|------|------|------|
| `send-message` | 双向 | 发送消息 | 完整 |
| `receive-message` | 双向 | 接收消息 | 完整 |
| `receipt` | 双向 | 发送回执 | 完整 |
| `read` | 双向 | 已读通知 | 完整 |
| `user-online` | Server→ | 用户上线 | 完整 |
| `user-offline` | Server→ | 用户下线 | 完整 |
| `waiting-users` | Server→ | 等待队列 | 完整 |
| `waiting-user-count` | Server→ | 等待数量 | 完整 |
| `admins` | Server→ | 客服列表 | 完整 |
| `user-transfer` | Server→ | 转接通知 | 完整 |
| `other-login` | Server→ | 异地登录踢出 | 完整 |
| `more-than-one` | Server→ | 多开警告 | 完整 |
| `error-message` | Server→ | 错误推送 | 完整 |
| `ping` | 双向 | 心跳 | 完整 |
| `user-rate` | 双向 | 用户评价 | 基础 |

### 4.2 需新增 Action（1期-MVP）

| Action（拟） | 方向 | 用途 | 关联功能 |
|-------------|------|------|---------|
| `revoke-message` | 双向 | 消息撤回通知 | F-MVP-03 |
| `session-close` | Server→ | 会话超时关闭通知 | F-MVP-05 |
| `typing` | 双向 | 输入状态提示（2期预留） | F-P2-15 |
| `leave-message-guide` | Server→ | 离线留言引导 | F-MVP-20 |

---

## 5. 消息类型能力基线

### 5.1 已有消息类型

| type | 说明 | consts.go 定义 | 用户可用 | 客服可用 |
|------|------|---------------|---------|---------|
| `text` | 文本消息 | MessageTypeText | Yes | Yes |
| `image` | 图片消息 | MessageTypeImage | Yes | Yes |
| `audio` | 音频消息 | MessageTypeAudio | Yes（定义有） | Yes |
| `video` | 视频消息 | MessageTypeVideo | Yes | Yes |
| `pdf` | PDF 文件 | MessageTypePdf | Yes | Yes |
| `navigator` | 导航卡片 | MessageTypeNavigate | Yes | Yes |
| `rate` | 服务评价 | MessageTypeRate | Yes | — |
| `notice` | 系统通知 | MessageTypeNotice | — | — |

### 5.2 需新增消息类型（1期-MVP）

| type（拟） | 说明 | 关联功能 | 来源 |
|-----------|------|---------|------|
| `order_card` | 订单卡片 | F-MVP-17 | B 泳道 PRD C2 |
| `product_card` | 商品卡片 | F-MVP-18 | B 泳道 PRD C2 |
| `coupon_card` | 优惠券卡片 | F-MVP-19 | B 泳道 PRD C2 |
| `leave_message` | 留言引导卡片 | F-MVP-20 | B 泳道 PRD C4 |
| `revoke` | 撤回通知 | F-MVP-03 | 新增 |

---

## 6. 管理端前端能力基线

### 6.1 已有页面

| 路由 | 页面 | 功能 | 扩展性 |
|------|------|------|--------|
| `/login` | 登录页 | JWT 登录 | 完整 |
| `/dashboard` | 仪表盘 | 数据概览 | 需增强 |
| `/admin` | 客服管理 | CRUD | 完整 |
| `/auto/message` | 快捷回复 | CRUD | 需增场景标签 |
| `/auto/rule` | 自定义规则 | CRUD | 需增转人工类型 |
| `/auto/system-rule` | 系统规则 | 查看 | 需增场景配置 |
| `/setting` | 系统设置 | KV 配置 | 需增子页 |
| `/transfer` | 转接记录 | 列表 | 完整 |
| `/session` | 会话记录 | 列表+详情 | 需增强 |
| `/chat-files` | 聊天文件 | 文件管理 | 完整 |
| `/chat` | 客服面板 | WebSocket 全屏 | 核心页面 |

### 6.2 需新增页面（1期-MVP）

| 路由（拟） | 页面 | 关联功能 |
|-----------|------|---------|
| `/setting/route-rule` | 路由规则管理 | F-MVP-02 |
| `/setting/sensitive-word` | 敏感词管理 | F-MVP-04 |
| `/setting/session-timeout` | 会话超时设置 | F-MVP-05 |
| `/knowledge` | 知识库管理 | F-MVP-11 |
| `/leave-message` | 留言管理 | F-MVP-06 |
| `/rating` | 评价管理 | F-MVP-13 |
| `/todo` | 待办面板 | F-MVP-01 |

### 6.3 需改造页面

| 路由 | 改造内容 | 关联功能 |
|------|---------|---------|
| `/chat` | 增加待办面板、撤回操作 | F-MVP-01, F-MVP-03 |
| `/session/:id` | 增加筛选维度、质检标记 | B4 PRD |
| `/auto/message` | 增加场景标签、知识库关联 | F-MVP-12 |
| `/auto/rule` | 增加关键词转人工类型 | F-MVP-23 |
| `/dashboard` | 增加统计数据维度 | F-MVP-10 |

---

## 7. 用户端前端能力基线

### 7.1 已有页面/功能

| 功能 | 实现 | 状态 |
|------|------|------|
| 登录 | JWT 登录 | 完整 |
| 聊天主界面 | WebSocket + Taro.connectSocket | 完整 |
| 文字消息 | 发送/接收 | 完整 |
| 图片消息 | 发送/接收 | 完整 |
| 排队等待 | waiting-user-count 展示 | 完整 |
| 已读回执 | ActionRead | 完整 |
| 历史消息 | 分页加载 | 完整 |

### 7.2 需新增功能（1期-MVP）

| 功能 | 关联功能 | 需新增内容 |
|------|---------|-----------|
| 语音消息 | F-MVP-14 | Taro.getRecorderManager + 播放组件 |
| 电话呼叫 | F-MVP-15 | 呼叫按钮 + tel: 协议 |
| 6 页面入口 | F-MVP-16 | 浮动按钮组件 + 页面集成 |
| 订单卡片 | F-MVP-17 | order_card 消息渲染 |
| 商品卡片 | F-MVP-18 | product_card 消息渲染 |
| 优惠券卡片 | F-MVP-19 | coupon_card 消息渲染 + 领取 |
| 留言提交 | F-MVP-20 | 离线检测 + 留言表单组件 |
| 服务评价 | F-MVP-21 | 星级评价弹窗组件 |
| FAQ 快捷问题 | F-MVP-24 | 推荐列表 + 点击发送 |

---

## 8. 外部依赖能力评估

### 8.1 需对接的外部系统

| 系统 | 数据 | 接口方向 | 优先级 | MVP 替代方案 |
|------|------|---------|--------|-------------|
| 商城会员库 | 用户会员等级 | 拉取 | P0 | Mock 数据 |
| 商城商品库 | 商品详情（名称/价格/图片） | 拉取 | P0 | Mock 数据 |
| OMS/订单库 | 订单详情 | 拉取 | P0 | Mock 数据 |
| 营销中心 | 优惠券信息/领取 | 双向 | P0 | Mock 数据 |
| 埋点系统 | 用户浏览/加购轨迹 | 拉取 | P1 | 暂不对接 |

### 8.2 内部系统扩展需求

| 组件 | 当前状态 | 扩展需求 |
|------|---------|---------|
| 规则引擎 | 全匹配/部分匹配 + 2 种 reply_type | 需增关键词转人工、场景扩展 |
| 定时任务 | cron.go 框架存在 | 需实现超时关闭、超时预警 |
| 文件存储 | 七牛云/本地 | 需增语音文件存储支持 |
| AI 接口 | LangChain 预留 | 1期可暂不启用 |

---

## 9. 安全与合规能力

| 维度 | 当前状态 | 1期需求 |
|------|---------|---------|
| 认证 | JWT 双端 | 满足 |
| 多租户隔离 | customer_id | 满足 |
| 敏感词过滤 | 无 | 需新增 |
| 数据加密 | 密码 hash | 满足 |
| 审计日志 | 无 | 1期可不做 |
| GDPR/隐私 | 无 | 1期可不做 |

---

## 10. 能力差距总结

| 维度 | 能力覆盖率 | 说明 |
|------|-----------|------|
| 数据库 | 62%（13/21 表） | 8 张新表需新建 |
| 后端 API | 65%（17/29 接口组） | 12 个新接口组需开发 |
| WebSocket | 80%（14/18 Action） | 4 个新 Action 需开发 |
| 消息类型 | 60%（8/13 类型） | 5 个新类型需开发 |
| 管理端页面 | 55%（11/18 页面） | 7 个新页面 + 5 个改造 |
| 用户端功能 | 50%（7/16 功能） | 9 个新功能需开发 |
| 外部系统对接 | 0%（0/5 系统） | 全部需对接或 Mock |
| **综合能力覆盖** | **~12%（9/75+）** | 24 项 1期功能待开发 |

---

> **文件状态**: 初稿完成，与 T1 功能原始清单交叉验证一致
