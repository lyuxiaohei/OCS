# CS 商城客服系统 — 项目记忆

> 本文件供 AI 助手快速理解项目上下文，避免重复读取源码。最后更新：2026-08-03

## 项目概况

> **仓库结构（2026-08-03 重组）**：本主仓当前仅含 `prototype/`（HTML 原型，原 `prototype-cs/` 改名而来）、`mini-program/`、`.planning/` 及文档。下表三端代码目录（`go-chat-service/`、`service-frontend/`、`service-user/`）已于 2026-08-03 从本仓移除 submodule 引用（本地无 `.gitmodules` / `.git/modules`），代码本体各自维护在独立 GitHub 仓库，需要时单独 clone。下文三端技术栈/入口描述作为整体 OCS 项目知识保留参考，但这些路径在本仓已不存在。

多租户在线客服系统，三端架构：

| 端 | 目录 | 技术栈 | 用户 |
|----|------|--------|------|
| 后端 | `go-chat-service/` | Go 1.23 / GoFrame v2 / MySQL / Redis / WebSocket | — |
| 管理端 | `service-frontend/` | React 18 / Umi Max v4 / Ant Design v5 / Tailwind | 客服人员 |
| 用户端 | `service-user/` | Taro 4.0 / React 18 / Tailwind / MobX | 终端用户（小程序+H5） |

## 后端关键入口

- **HTTP 启动**：`go-chat-service/internal/cmd/http.go`
- **路由注册**：`go-chat-service/internal/controller/router.go`
- **常量定义**：`go-chat-service/internal/consts/consts.go`（消息类型、Action、会话状态等全部常量）
- **数据库 Schema**：`go-chat-service/database.sql`
- **GF CLI 配置**：`go-chat-service/hack/config.yaml`（含数据库连接）
- **服务接口**：`go-chat-service/internal/service/` — 17 个接口文件（接口模式，实现在 `internal/logic/`）

## 路由

```
/api/user              → 前台（UserAuth 中间件保护 /chat 子路由）
/api/backend           → 后台（AdminAuth 中间件保护，/login 除外）
/api/backend/login     → 管理员登录（无需认证）
```

后端控制器：`controller/backend/` 含 chat, session, dashboard, auto_message, auto_rule, system_rule, chat_setting, transfer, option, file, ws 等。

## 数据库（MySQL `chat`）

13 张核心表，多租户通过 `customer_id` 隔离：

- `customers` — 租户
- `customer_admins` — 客服人员
- `users` — 终端用户
- `customer_chat_sessions` — 会话（状态：wait→accept→close/cancel）
- `customer_chat_messages` — 消息（来源：0=用户 1=客服 2=系统 3=AI）
- `customer_chat_auto_messages` — 快捷回复模板
- `customer_chat_auto_rules` — 自动回复规则
- `customer_chat_auto_rule_scenes` — 规则场景
- `customer_chat_settings` — 系统设置
- `customer_admin_chat_settings` — 客服个人设置
- `customer_chat_transfers` — 转接记录
- `customer_chat_files` — 聊天文件

## WebSocket 协议

连接：`ws://...?token=<JWT>`

| Action | 说明 |
|--------|------|
| `send-message` / `receive-message` | 消息收发 |
| `receipt` | 发送回执 |
| `read` | 已读通知 |
| `user-online` / `user-offline` | 用户上下线 |
| `waiting-users` / `waiting-user-count` | 等待队列 |
| `admins` | 客服列表 |
| `user-transfer` | 转接通知 |
| `other-login` | 异地登录踢出 |
| `more-than-one` | 多开警告 |
| `error-message` | 错误推送 |

消息类型：`text` `image` `audio` `video` `pdf` `navigator` `rate` `notice`

## 管理端前端

- **框架**：Umi Max（Ant Design Pro 6 模板）
- **页面路由**：`service-frontend/config/routes.ts`
- **WebSocket Store**：`service-frontend/src/pages/chat/store/websocket.ts`（valtio proxy）
- **API 层**：`service-frontend/src/services/index.ts`
- **认证**：Cookie 存储 JWT Token（`utils/auth.ts`）

核心页面：Login, Dashboard, Chat（全屏客服面板）, Admin, AutoMessage, AutoRule, SystemRule, Setting, Transfer, Session, ChatFiles

## 用户端前端

- **框架**：Taro 4.0（支持微信小程序 + H5）
- **主页面**：`service-user/src/pages/index/index.tsx`（聊天界面）
- **API**：`service-user/src/api/index.ts`（login, messages, setting, read）
- **请求封装**：`service-user/src/util/request.ts`（JWT Bearer 认证，401 自动跳转登录）
- **WebSocket**：Taro.connectSocket（小程序原生）

## 特殊功能

- **AI 集成**：`service/langchain.go` 接口 + `tmc/langchaingo`，消息来源=3
- **微服务**：gRPC + etcd 服务发现（可选），`service/grpc.go`
- **存储**：七牛云 / 本地（`internal/library/storage/`）
- **定时任务**：`internal/cron/cron.go`
- **规则引擎**：`controller/rule/` — 支持全匹配/部分匹配，触发场景含进入会话、客服离线等
- **数据库初始化**：`cmd init -c <customerId>`

## 开发命令

```bash
# 后端
cd go-chat-service
gf run cmd     # 启动 HTTP 服务

# 管理端前端
cd service-frontend
npm run start:dev    # 开发模式

# 用户端
cd service-user
npm run dev:weapp    # 微信小程序
npm run dev:h5       # H5
```

## 差距分析：排期 vs 现状

> 对照《线上客服排期.xlsx》"商城平台-2026Q3-Q4排期" Sheet（112 行功能清单）
> 排期硬性节点：开发 6/22 启动，V1.4 在线客服版 **8月底上线**

### 已具备功能（9 项 / 12%）

| # | 功能 | 代码对应 |
|---|------|----------|
| 1 | 多渠道工作台 | `/chat` 全屏面板 + WebSocket 多端 |
| 2 | 会话转接 | `CTransfer` + `ActionUserTransfer` |
| 3 | 历史服务记录 | `CSession` + 会话列表/详情页 |
| 4 | 历史会话 | `getChatSessions` + session 列表 |
| 5 | 快捷回复 | `CAutoMessage` CRUD |
| 6 | 欢迎语设置 | `welcome_content` 字段 |
| 7 | 排队等待提示 | `waiting-user-count` action |
| 8 | 消息已读/未读 | `ActionRead` + `is_read` |
| 9 | 断线重连 | 前端 WebSocket onclose 重连 |

### 1期-MVP 缺失功能（24 项）

#### 会话管理（6 项）
| 功能 | 缺失说明 |
|------|----------|
| 待处理事项面板 | 无专门待办列表，仅有等待队列展示 |
| 智能路由与分流 | 仅有简单 `is_auto_accept`，无分流规则引擎 |
| 消息撤回 | 无撤回 Action，消息模型无撤回状态 |
| 敏感词过滤 | 无敏感词表，无过滤中间件 |
| 会话超时自动关闭 | `cron.go` 存在但未实现超时逻辑 |
| 留言与离线反馈 | 无留言表，离线仅支持 `offline_content` 文案 |

#### 客户信息（4 项）
| 功能 | 缺失说明 |
|------|----------|
| 客户基础信息视图 | `getUserInfo` 存在但无会员等级等 |
| 客户行为数据 | 完全缺失，需对接商城系统 |
| 客户交易数据 | 完全缺失，需对接 OMS |
| 客户服务数据 | 仅有 `rate` 字段，无统计聚合 |

#### 知识库与评价（3 项）
| 功能 | 缺失说明 |
|------|----------|
| 知识库/FAQ 管理 | 无知识库表，无 CRUD |
| 话术库场景分类 | `auto_messages` 仅简单分类，无场景标签 |
| 客服评价管理 | 仅有 `rate` 字段，无评价管理页面 |

#### 用户端（8 项）
| 功能 | 缺失说明 |
|------|----------|
| 语音消息 | 文字/图片已有，语音缺失 |
| 电话呼叫 | 完全缺失 |
| 6页面咨询入口嵌入 | 仅有独立聊天页，无各页面嵌入入口 |
| 订单卡片交互 | 无 `order_card` 消息类型 |
| 商品卡片交互 | 无 `product_card` 消息类型 |
| 富媒体消息（优惠券） | 无 `coupon_card` 类型 |
| 离线留言提交 | 仅显示 offline_content，无留言提交 |
| 服务评价 UI | rate 类型存在但前端无评价组件 |

#### 其他（3 项）
| 功能 | 缺失说明 |
|------|----------|
| 离线自动回复 | 需扩展 auto_rules 的 u-offline 场景 |
| 关键词转人工 | auto_rules 仅有 message/transfer 两种 reply_type |
| FAQ 快捷问题 | 无常见问题推荐列表 |

### 2期缺失（17 项）— 体验提升
消息预显、三方会话、拉黑/屏蔽、主动推送、标签体系、AI话术推荐、商品推荐、订单上下文提醒、转人工意图提示、实时监控面板、个人绩效看板、预警机制、会话量统计、渠道统计、输入状态提示、FAQ多轮引导、猜你想问、自助办理、智能自助服务、大模型智能客服基础版

### 3期缺失（25+ 项）— AI智能化
**"未纳入讨论范围"**：客服管理/技能组、IVR/邮件/社交渠道、机器人配置、AI核心能力、售前售后场景、人机协同、6种角色权限、报表体系

### 实施计划位置
详细周次实施计划见 `.planning/workflows/cs-gap-analysis/PLAN.md`
