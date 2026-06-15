---
phase: P01
skill: maestro-meeting-minutes
upstream: []
---

# Phase P01: 需求调研

## Objective

基于现有资产（排期表 112 行功能清单、gap 分析、数据库 schema、路由定义、常量定义、前端路由）进行全量需求调研，产出用户故事级需求文档，覆盖 1 期 MVP + 2 期体验提升 + 3 期 AI 智能化全部功能，并为每条需求标注期次和优先级。

## Context Summary

### 输入资产校验（D-07）

| 资产 | 路径 | 校验结果 |
|------|------|----------|
| CLAUDE.md | `CLAUDE.md` | EXISTS — 含技术全景、差距分析摘要 |
| gap 分析 PLAN | `.planning/workflows/cs-gap-analysis/PLAN.md` | EXISTS — 完整差距分析 + MVP 实施计划 |
| database.sql | `go-chat-service/database.sql` | EXISTS — 13 张核心表 DDL |
| consts.go | `go-chat-service/internal/consts/consts.go` | EXISTS — 消息类型/Action/会话状态常量 |
| router.go | `go-chat-service/internal/controller/router.go` | EXISTS — HTTP 路由注册 |
| routes.ts | `service-frontend/config/routes.ts` | EXISTS — 管理端页面路由 |
| 排期表 | `prototype-cs/线上客服排期_20260610.xlsx` | EXISTS — 112 行功能清单 |

### 关键决策（CONTEXT.md）

- **D-01**: 基于现有资产深化，不重复造轮子
- **D-02**: 目标用户覆盖全部四个角色：客服人员、终端用户（C 端买家）、租户管理员、系统集成对接方
- **D-03**: 范围覆盖全量需求（1/2/3 期）
- **D-04**: 全量产出 + 标注期次（1/2/3）和优先级（P0/P1/P2）
- **D-05**: 全部重新验证，含已有功能 9 项
- **D-06**: 用户故事级颗粒度

### 技术基线摘要

**数据库**：13 张核心表，多租户 `customer_id` 隔离。核心表含 `customer_chat_sessions`（会话）、`customer_chat_messages`（消息）、`customer_chat_auto_rules`（自动规则）、`customer_chat_transfers`（转接）。消息来源 0=用户 1=客服 2=系统 3=AI。会话状态 wait/accept/close/cancel。

**WebSocket Actions**：send-message, receive-message, receipt, read, user-online/offline, waiting-users/count, admins, user-transfer, other-login, more-than-one, error-message, user-rate。

**消息类型**：text, image, audio, video, pdf, navigator, rate, notice。

**管理端页面**：Login, Dashboard, Chat（全屏面板）, Admin, AutoMessage, AutoRule, SystemRule, Setting, Transfer, Session, ChatFiles。

**后端路由**：`/api/user/chat`（前台）、`/api/backend/`（后台，含 chat/session/dashboard/auto_message/auto_rule/system_rule/chat_setting/transfer/option/file/ws）。

## Tasks

### Task 1: 提取排期表全量功能清单

<action>
读取 `prototype-cs/线上客服排期_20260610.xlsx`（112 行功能清单），逐行提取功能条目，构建功能原始列表。每条记录：编号、功能名称、所属模块、排期版本（1/2/3 期）、功能描述（如有）。与 CLAUDE.md 差距分析中的已具备功能（9 项）、MVP 缺失（24 项）、2 期缺失（17 项）、3 期缺失（25+ 项）进行交叉比对，确认覆盖完整性。产出结构化功能原始清单。
</action>

<acceptance_criteria>
- 文件 `OUTPUT-01-raw-feature-list.md` 存在
- 清单包含排期表全部 112 行功能条目
- 每条功能含编号、名称、所属模块、排期版本
- 与 CLAUDE.md 差距分析数据交叉比对完成，无遗漏
</acceptance_criteria>

### Task 2: 分析现有代码能力基线

<action>
基于 database.sql（13 张表 DDL）、consts.go（消息类型/Action/会话状态常量）、router.go（后端路由）、routes.ts（管理端页面路由）四份源文件，提取当前系统已实现的能力清单。逐项分析：

1. **数据库能力**：每张表支持的业务能力（字段级分析），标注可扩展点
2. **消息能力**：现有消息类型（text/image/audio/video/pdf/navigator/rate/notice）及缺失类型（order_card/product_card/coupon_card 等）
3. **WebSocket 能力**：现有 Action 覆盖的实时通信场景
4. **管理端能力**：现有页面覆盖的管理场景
5. **用户端能力**：基于 API 接口分析用户端可用能力

产出能力基线文档，每项标注：能力名称、数据表/接口/页面对应、是否完整、缺失场景。
</action>

<acceptance_criteria>
- 文件 `OUTPUT-02-capability-baseline.md` 存在
- 按数据库/消息/WebSocket/管理端/用户端五个维度组织
- 每项能力标注代码对应位置（表名/常量/路由/页面路径）
- 已有 9 项功能（CLAUDE.md）全部覆盖并补充缺失场景
- 标注可扩展点和限制条件
</acceptance_criteria>

### Task 3: 编写 1 期 MVP 需求用户故事

<action>
基于 Task 1 的功能原始清单和 Task 2 的能力基线，针对 1 期 MVP 的 24 项缺失功能 + 9 项已有功能的场景补充，编写用户故事级需求文档。

按模块分组：
- **会话管理**（6 项缺失 + 已有功能场景补充）：待处理事项面板、智能路由与分流、消息撤回、敏感词过滤、会话超时自动关闭、留言与离线反馈
- **客户信息**（4 项缺失）：客户基础信息视图、客户行为数据、客户交易数据、客户服务数据
- **知识库与评价**（3 项缺失）：知识库/FAQ 管理、话术库场景分类、客服评价管理
- **用户端**（8 项缺失）：语音消息、电话呼叫、6 页面咨询入口嵌入、订单卡片交互、商品卡片交互、富媒体消息（优惠券）、离线留言提交、服务评价 UI
- **其他**（3 项缺失）：离线自动回复、关键词转人工、FAQ 快捷问题
- **已有功能验证**（9 项）：多渠道工作台、会话转接、历史服务记录、历史会话、快捷回复、欢迎语设置、排队等待提示、消息已读未读、断线重连

每条用户故事格式：
```
ID: REQ-1P-XXX
名称: <功能名称>
角色: <客服人员|终端用户|租户管理员|集成对接方>
用户故事: 作为 <角色>，我希望 <功能描述>，以便 <价值说明>
验收标准:
  - AC1: <可检查的验收条件>
  - AC2: ...
  - MVP验收标准: <仅对外部依赖功能填写，Mock数据可用即可通过>
  - 完整验收标准: <仅对外部依赖功能填写，真实API对接完成>
优先级: P0-Critical 或 P0-Nice
期次: 1期-MVP
依赖: <依赖的其他需求或外部系统>
技术备注: <基于代码分析的实现要点>
```

**二级优先级规则（PM-03）**：
- **P0-Critical**：核心会话流程、消息能力、已验证需求（如待处理面板、消息撤回、敏感词过滤、会话超时关闭、留言反馈、语音消息、评价UI等）
- **P0-Nice**：高复杂度或高外部依赖的可降级功能（如电话呼叫、智能路由与分流、富媒体优惠券卡片、客户行为数据、客户交易数据、订单卡片、商品卡片等）

**外部依赖双套验收标准（PM-04）**：
以下 4 个功能依赖外部商城 API，必须同时提供 MVP 验收标准（Mock 数据）和完整验收标准（真实 API）：
1. 客户行为数据（需商城用户行为 API）
2. 客户交易数据（需 OMS 订单 API）
3. 订单卡片交互（需订单数据源）
4. 商品卡片交互（需商品数据源）

**离线场景优先级规则（PM-05）**：
"离线自动回复"与"留言与离线反馈"的用户故事中需明确：先展示离线留言表单 → 用户不留言时触发自动回复。两者标注为协同关系而非互斥。
</action>

<acceptance_criteria>
- 文件 `OUTPUT-03-requirements-phase1.md` 存在
- 包含 24 项 MVP 缺失功能 + 9 项已有功能场景补充 = 33 条用户故事
- 每条用户故事含完整格式（ID/名称/角色/故事/验收标准/优先级/期次/依赖/技术备注）
- 覆盖四个角色（客服人员、终端用户、租户管理员、集成对接方）
- 优先级标注为 P0-Critical 或 P0-Nice，且二级分类合理
- 4 个外部依赖功能含双套验收标准（MVP + 完整）
- 离线自动回复与留言反馈的用户故事中明确协同关系
- 验收标准可机械化检查
</acceptance_criteria>

### Task 4: 编写 2 期体验提升需求用户故事

<action>
基于 Task 1 功能原始清单中的 2 期功能（体验提升），编写用户故事级需求文档。

功能清单参考 CLAUDE.md：消息预显、三方会话、拉黑/屏蔽、主动推送、标签体系、AI 话术推荐、商品推荐、订单上下文提醒、转人工意图提示、实时监控面板、个人绩效看板、预警机制、会话量统计、渠道统计、输入状态提示、FAQ 多轮引导、猜你想问、自助办理、智能自助服务、大模型智能客服基础版。

每条用户故事格式同 Task 3，优先级标注为 P1，期次标注为 2 期-体验提升。
</action>

<acceptance_criteria>
- 文件 `OUTPUT-04-requirements-phase2.md` 存在
- 覆盖 CLAUDE.md 2 期清单全部条目（数量以排期表实际数据为准，不硬编码数量）
- 每条用户故事含完整格式
- 优先级标注为 P1
- 期次标注为 2 期-体验提升
</acceptance_criteria>

### Task 5: 编写 3 期 AI 智能化需求用户故事

<action>
基于 Task 1 功能原始清单中的 3 期功能（AI 智能化），编写用户故事级需求文档。

**数据源优先级（PM-02）**：优先以排期表 112 行中标注为 3 期的条目为准，CLAUDE.md 中的 8 个大类（客服管理/技能组、IVR/邮件/社交渠道、机器人配置、AI 核心能力、售前售后场景、人机协同、6 种角色权限、报表体系）作为补充校验维度，防止凭空生成排期表没有的需求。

每条用户故事格式同 Task 3，优先级标注为 P2，期次标注为 3 期-AI 智能化。由于排期表中 3 期功能可能描述较粗，需根据业务合理性细化子功能。
</action>

<acceptance_criteria>
- 文件 `OUTPUT-05-requirements-phase3.md` 存在
- 覆盖排期表中全部 3 期标注条目（数量以排期表实际数据为准）
- CLAUDE.md 8 个大类作为交叉校验维度已覆盖
- 每条用户故事含完整格式
- 优先级标注为 P2
- 期次标注为 3 期-AI 智能化
- 粗粒度功能已细化为可执行的子功能用户故事
</acceptance_criteria>

### Task 6: 编写集成对接需求用户故事

<action>
针对 D-02 中的第四个角色"系统集成对接方"，分析全量功能中涉及外部系统对接的需求，编写集成对接专项需求文档。包含：

1. **商城系统对接**：商品数据、订单数据、会员数据、优惠券数据
2. **AI 服务对接**：大模型接口、知识库检索、意图识别
3. **存储服务对接**：七牛云/本地存储扩展
4. **消息推送对接**：小程序模板消息、H5 推送
5. **第三方渠道对接**：IVR、邮件、社交渠道（3 期）

每条对接需求含：对接系统、数据流向、接口契约要求（请求/响应格式）、数据安全要求、SLA 要求。
</action>

<acceptance_criteria>
- 文件 `OUTPUT-06-requirements-integration.md` 存在
- 覆盖商城/AI/存储/推送/渠道五大对接域
- 每条对接需求含接口契约要求数据流向
- 标注哪些对接 1 期必需、哪些可延后
- 1 期必需的外部接口（用户行为API、订单API、商品API）标注契约文档交付截止时间（6/22 开发启动前）
</acceptance_criteria>

### Task 7: 编写需求分类表与优先级排序

<action>
汇总 Task 3~6 的全部用户故事，按以下维度进行交叉分类和优先级排序：

1. **按模块分类**：会话管理、客户信息、知识库评价、用户端、管理端、AI 能力、集成对接
2. **按角色分类**：客服人员、终端用户、租户管理员、集成对接方
3. **按期次排序**：1 期 P0 > 2 期 P1 > 3 期 P2
4. **按依赖关系排序**：前置依赖在前，依赖项在后
5. **按实现复杂度标注**：S（简单）/M（中等）/L（复杂），基于代码基线分析

产出需求分类总表，含需求 ID 索引、模块-期次矩阵、优先级排序总表。
</action>

<acceptance_criteria>
- 文件 `OUTPUT-07-requirements-classification.md` 存在
- 包含按模块/角色/期次三个维度的分类索引
- 包含优先级排序总表（全部需求 ID 按优先级排列）
- 包含模块-期次矩阵（行=模块，列=期次，值=功能数量）
- 包含依赖关系图（文字描述）
- 每条需求标注实现复杂度 S/M/L
- 总需求数量 >= 排期表 112 行（因细化可能更多）
</acceptance_criteria>

### Task 8: 编写调研总结报告

<action>
汇总 Task 1~7 的调研成果，编写需求调研总结报告。包含：

1. **调研概述**：调研方法（文档分析+代码逆向分析）、输入资产清单、覆盖范围
2. **关键发现**：
   - 已有功能能力评估（9 项完整度分析）
   - MVP 缺失功能缺口分析（24 项）
   - 跨期功能依赖关系
   - 外部系统对接依赖点
3. **需求统计**：按模块/角色/期次/优先级/复杂度的数量统计
4. **风险项**：功能冲突、外部依赖、技术限制
5. **建议**：实施优先级调整建议、MVP 范围调整建议
6. **产出物索引**：所有 OUTPUT 文件的路径和内容摘要
</action>

<acceptance_criteria>
- 文件 `OUTPUT-08-research-report.md` 存在
- 包含调研概述、关键发现、需求统计、风险项、建议五个章节
- 需求统计数据与 OUTPUT-07 分类表数据一致
- 风险项含具体缓解措施
- 产出物索引列出全部 OUTPUT 文件路径
</acceptance_criteria>

## Task 依赖关系

```
Task 1 (功能原始清单)
  └→ Task 2 (能力基线) [可并行]
       └→ Task 3 (1期需求) ← 依赖 T1 + T2
       └→ Task 4 (2期需求) ← 依赖 T1 + T2
       └→ Task 5 (3期需求) ← 依赖 T1 + T2
       └→ Task 6 (集成需求) ← 依赖 T1 + T2
            └→ Task 7 (分类排序) ← 依赖 T3 + T4 + T5 + T6
                 └→ Task 8 (调研报告) ← 依赖 T7
```

## 产出物清单

| 编号 | 文件名 | 说明 |
|------|--------|------|
| 1 | `OUTPUT-01-raw-feature-list.md` | 排期表全量功能原始清单 |
| 2 | `OUTPUT-02-capability-baseline.md` | 现有代码能力基线分析 |
| 3 | `OUTPUT-03-requirements-phase1.md` | 1 期 MVP 用户故事（33 条） |
| 4 | `OUTPUT-04-requirements-phase2.md` | 2 期体验提升用户故事（17+ 条） |
| 5 | `OUTPUT-05-requirements-phase3.md` | 3 期 AI 智能化用户故事（25+ 条） |
| 6 | `OUTPUT-06-requirements-integration.md` | 集成对接用户故事 |
| 7 | `OUTPUT-07-requirements-classification.md` | 需求分类表与优先级排序 |
| 8 | `OUTPUT-08-research-report.md` | 调研总结报告 |

所有产出物写入目录：`.planning/202606.0/workflows/online-customer-service/P01-requirement-research/`

## Verification

1. **文件存在性**：检查 8 个 OUTPUT 文件全部存在于 phase_dir 目录
2. **需求 ID 唯一性**：OUTPUT-03/04/05/06 中所有需求 ID 无重复
3. **格式完整性**：每条用户故事包含 ID/名称/角色/故事/验收标准/优先级/期次/依赖 8 个字段
4. **覆盖完整性**：1 期需求覆盖 CLAUDE.md 中 24 项 MVP 缺失 + 9 项已有功能
5. **分类一致性**：OUTPUT-07 中的需求数量与 OUTPUT-03/04/05/06 合计一致
6. **优先级正确性**：1 期=P0-Critical/P0-Nice、2 期=P1、3 期=P2，无错标
7. **角色覆盖**：四个角色（客服人员、终端用户、租户管理员、集成对接方）均有对应用户故事
8. **P0二级分类**：1 期 MVP 用户故事中 P0-Critical 和 P0-Nice 分类合理（高复杂度/高外部依赖标注为 P0-Nice）
9. **外部依赖双套标准**：4 个外部依赖功能（客户行为/交易数据、订单/商品卡片）含 MVP 验收标准和完整验收标准
10. **离线场景协同**：离线自动回复与留言反馈的用户故事中明确协同关系
