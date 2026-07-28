# 工单管理 — 对存量系统的改动清单

> **⚠️ 已归档（V0.2 时代文档，2026-07-23 归档）**：本文基于 V0.2（SLA 时效 + 5 态状态机 + 详情抽屉嵌工作台 + 配置写在 admin-settings.html），与现行版本全面不符，仅作历史参考，勿据此开发。现行版本见 `../PRD-客服工单-V0.6.md`（完成期限代替 SLA / 3 态状态机 / 建单·详情独立页 / 工单设置独立页）。
>
> ~~面向开发。PRD 正文见 `PRD-工单管理-V0.2.md`。~~

## 原则

工单管理是 OCS 客服后台 V0.9 的迭代增量，遵循「最小侵入」原则：能复用不新建，能扩展不改接口签名。

## 新建表

| 表名 | 说明 | 关键字段 |
|------|------|---------|
| `customer_chat_tickets` | 工单主表 | ticket_id, ticket_no, title, type, priority, status, user_id FK, order_id FK, session_id FK, handler_admin_id FK, sla_response_due, sla_resolve_due, score, source, created_at, resolved_at, closed_at |
| `customer_chat_ticket_events` | 工单事件流水 | event_id, ticket_id FK, event_type(`ticket.created` / `ticket.assigned` / …), operator_id, operator_type(`admin` / `customer` / `system`), metadata JSON, created_at |
| `customer_chat_ticket_comments` | 工单备注 | comment_id, ticket_id FK, type(`internal` / `public`), content, author_id FK, created_at |
| `customer_chat_ticket_extensions` | 工单业务附表（T 型 KV） | ticket_id FK, ext_key, ext_value |
| `customer_chat_ticket_sla_config` | 工单 SLA 配置 | 优先级 × 事件 矩阵 / 升级阈值 / 工作时间 |

## 改动存量表

| 表 | 变更 | SQL 方向 |
|----|------|---------|
| `customer_chat_messages` | **+ `ticket_id`** varchar(32) NULL，FK → `customer_chat_tickets` | `ALTER TABLE customer_chat_messages ADD COLUMN ticket_id VARCHAR(32) NULL, ADD INDEX idx_ticket_id (ticket_id)` |
| `customer_chat_sessions` | **+ `ticket_id`** varchar(32) NULL，FK → `customer_chat_tickets` | `ALTER TABLE customer_chat_sessions ADD COLUMN ticket_id VARCHAR(32) NULL` |

## 新建 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/backend/ticket/list` | 工单列表（筛选：type/priority/status/handler/date） |
| GET | `/api/backend/ticket/detail` | 工单详情 |
| POST | `/api/backend/ticket/create` | 创建工单（含会话转工单） |
| POST | `/api/backend/ticket/update` | 状态变更（resolve/block/reopen/close） |
| POST | `/api/backend/ticket/assign` | 指派/转派 |
| POST | `/api/backend/ticket/comment` | 备注（internal/public） |
| GET/POST | `/api/backend/ticket/sla-config` | SLA 配置读写 |
| GET | `/api/backend/ticket/export` | 工单导出 |

## 改动存量 API

| 路径 | 变更 |
|------|------|
| `POST /api/backend/session/end` | `reason` 枚举新增 `converted_to_ticket`；触发时写入 SESSION.ticket_id |

## 扩展 cron

在 `internal/cron/cron.go` 中新增两个 goroutine：

| 任务 | 频率 | 逻辑 |
|------|------|------|
| `ticketSLA` | 每 5 分钟 | 扫描 `customer_chat_tickets` 中 `sla_response_due` / `sla_resolve_due`，按 80%/100%/150% 阈值触发预警/一级升级/二级升级 |
| `ticketAutoAssign` | 每 1 分钟 | 扫描 `status=新建 AND handler_admin_id IS NULL` 的工单，轮询在线客服分配 |

## 新建/扩展页面

| 页面/组件 | 类型 | 说明 |
|-----------|------|------|
| `admin-ticket.html` | 新建页 | 工单列表（侧边栏「会话管理 > 工单」） |
| 工单详情抽屉 | 新建组件 | 嵌入工作台和列表 |
| `admin-settings.html` | 扩展区块 | + 工单配置区 |
| `admin-dashboard.html` | 扩展区块 | + 工单指标卡 |
| `admin-workbench.html` | 扩展区块 | 操作栏 +「转工单」；右栏 +「该客户工单」 |

## 新建 WS Action

（复用现有 `receive-message` action，不新增 WS 协议）

工单通知通过现有 WebSocket 推 `type=notice` 消息，MESSAGE.ticket_id 使前端可识别工单通知。

## 依赖前置条件

| 条件 | 状态 |
|------|------|
| SESSION / MESSAGE 表扩展字段 | 需 DBA 执行 ALTER |
| OMS 订单查询接口 | 🔴 1 期只读展示，需确认接口可用性 |
| 工作台 PRD 配合 | ⚠️ 需工作台负责人对齐「转工单」按钮 +「该客户工单」区 |
| 用户端（Taro）配合 | ⚠️ 需前端识别 notice 消息的 ticket_id 并跳转工单进度页 |

## 实施顺序

```
1. 数据库迁移（新建 5 表 + ALTER 2 表）
2. 工单 CRUD API
3. 会话转工单链路（API + 工作台操作栏）
4. SLA 引擎（cron）
5. 轮询自动分派（cron）
6. 工单列表页 + 详情抽屉
7. 工单配置页 + 仪表盘扩展
```
