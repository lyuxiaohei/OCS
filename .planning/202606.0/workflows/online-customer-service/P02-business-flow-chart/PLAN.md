---
phase: P02
skill: maestro-diagram-design
upstream:
  - .planning/202606.0/workflows/online-customer-service/P01-requirement-research/OUTPUT-01-raw-feature-list.md
  - .planning/202606.0/workflows/online-customer-service/P01-requirement-research/OUTPUT-02-capability-baseline.md
  - .planning/202606.0/workflows/online-customer-service/P01-requirement-research/OUTPUT-03-requirements-phase1.md
  - .planning/202606.0/workflows/online-customer-service/P01-requirement-research/OUTPUT-04-requirements-phase2.md
  - .planning/202606.0/workflows/online-customer-service/P01-requirement-research/OUTPUT-07-requirements-classification.md
  - .planning/202606.0/workflows/online-customer-service/P01-requirement-research/OUTPUT-08-research-report.md
---

# Phase P02: 业务现状流程图

## Objective

基于 P01 需求调研产出物和现有系统技术架构（CLAUDE.md），绘制 CS 商城客服系统全量核心业务流程现状图，标注痛点、缺失环节和优化机会，为后续原型设计和架构设计提供流程基线。

## 上游数据流向

| 上游产出物 | 本阶段用途 |
|-----------|-----------|
| OUTPUT-01 功能原始清单 | 提供已具备 9 项 + 缺失 24 项功能全量清单，用于流程图中标注"已有/缺失" |
| OUTPUT-02 能力基线 | 提供数据库表、API 路由、WebSocket Action、前端页面基线，用于流程技术映射 |
| OUTPUT-03 1期 MVP 用户故事 | 24 条用户故事作为流程图中待建功能节点的需求来源 |
| OUTPUT-04 2期用户故事 | 17 条用户故事作为扩展流程的远景参考 |
| OUTPUT-07 需求分类排序 | 提供功能依赖关系图和 W1-W9 周排布，用于流程图优先级标注 |
| OUTPUT-08 调研报告 | 提供全局视角、协同链路和外部系统集成方案，作为流程框架组织依据 |
| CLAUDE.md | 提供三端架构、WebSocket 协议、路由结构、数据库 schema 等技术实现细节 |

## CONTEXT.md 锁定决策遵从

| 决策 | 遵从方式 |
|------|---------|
| D-01 全流程覆盖 | 覆盖用户咨询→客服接待→会话管理→转接→评价→离线留言全部流程 |
| D-02 概览级粒度 | 每个流程 1-2 页 Mermaid 图，仅展示主干路径和关键分支 |
| D-03 Mermaid+Markdown | 所有流程图使用 Mermaid 语法嵌入 .md 文件 |
| D-04 先补全再画图 | Task 0 补充 P01 缺失内容，后续任务基于补充内容绘制 |
| CLD-01 用户旅程组织 | 按用户旅程为主线，辅以管理端和系统内部流程 |

---

## Tasks

### Task 0: 补充 P01 缺失内容

补充 P01 验证报告（VERIFICATION.md）中识别的两类缺失内容，作为后续流程图绘制的输入基线。

<action>
1. 创建 `OUTPUT-00-supplementary-stories.md`，包含以下内容：
   - **Section 1: 已有功能验证用户故事（9 条）**
     - 对 OUTPUT-01 中 F-EX-01 ~ F-EX-09 九项已具备功能，逐一编写验证用户故事
     - 格式参考 OUTPUT-03 的 9 字段格式（ID/名称/角色/用户故事/验收标准/优先级/期次/依赖/技术备注）
     - ID 命名规则：US-EX-01 ~ US-EX-09
     - 验收标准基于 OUTPUT-02 能力基线中的具体代码对应和完成度评估
     - 角色涵盖：终端用户（US-EX-07 排队等待）、客服人员（US-EX-01~05, 08）、系统管理员（US-EX-06, 09）
   - **Section 2: 租户管理员角色故事（3-4 条）**
     - 覆盖租户级配置管理场景：系统初始化（cmd init）、欢迎语/离线语设置、客服账号管理、路由规则配置
     - ID 命名规则：US-ADMIN-01 ~ US-ADMIN-04
     - 基于 OUTPUT-06 集成需求和 OUTPUT-07 中 5.3 节客服管理员需求分布编写
   - **Section 3: 集成对接方角色故事（2-3 条）**
     - 覆盖外部系统对接场景：API 接口调用、数据同步、Mock/真实切换
     - ID 命名规则：US-INT-01 ~ US-INT-03
     - 基于 OUTPUT-06 集成需求中的 6 个接口契约和安全策略编写
2. 数据来源：
   - 已有功能：OUTPUT-01 Section 2（9 项功能清单）+ OUTPUT-02 各节（代码对应）
   - 租户管理员：OUTPUT-06 Section 4（跨系统数据流）+ OUTPUT-07 Section 5.3（管理员需求分布）
   - 集成对接方：OUTPUT-06 Section 2（接口契约）+ Section 5（安全与限流）
3. 每条故事必须包含完整的 9 字段，验收标准可机械化检查
</action>

<acceptance_criteria>
- 文件 `OUTPUT-00-supplementary-stories.md` 存在于 P02 目录下
- Section 1 包含 9 条已有功能验证故事（US-EX-01 ~ US-EX-09），每条含 9 字段
- Section 2 包含 3-4 条租户管理员角色故事（US-ADMIN-01 ~ US-ADMIN-04）
- Section 3 包含 2-3 条集成对接方角色故事（US-INT-01 ~ US-INT-03）
- 所有故事的验收标准字段非空且可检查
- 每条故事的 ID 字段唯一，与 OUTPUT-03/04 的 ID 命名空间不冲突
</acceptance_criteria>

---

### Task 1: 绘制用户端主旅程流程图

绘制终端用户从进入咨询到会话结束的完整旅程流程图，这是客服系统最核心的端到端流程。

<action>
1. 创建 `OUTPUT-01-flow-user-journey.md`
2. 绘制 Mermaid flowchart（方向 TB），覆盖以下节点和路径：
   - **入口阶段**：
     - 用户从 6 个页面入口（首页/商品详情/订单详情/购物车/帮助中心/个人中心）进入，携带 entry_tag
     - F-EX-06 欢迎语展示（已有）
     - US-MVP-16 入口嵌入（待建），US-MVP-24 FAQ 快捷问题推荐（待建）
   - **登录与连接**：
     - JWT 登录（已有）→ WebSocket 连接（已有，F-EX-09 断线重连）
     - 传递 entry_tag 到后端
   - **路由分配**：
     - 路由规则匹配（US-MVP-02，待建，当前仅有 is_auto_accept）
     - 分配客服 → 进入会话
     - 客服全部离线 → 进入离线流程
   - **排队等待**：
     - F-EX-07 排队等待提示（已有）
     - waiting-user-count 实时更新（已有）
   - **会话中交互**：
     - 消息收发（text/image，已有）→ 新增 audio（US-MVP-14）、video（已有）
     - 消息已读/未读（F-EX-08，已有）
     - 消息撤回（US-MVP-03，待建）
     - 敏感词过滤（US-MVP-04，待建，用户侧替换 ***）
     - 卡片消息：订单卡片（US-MVP-17）、商品卡片（US-MVP-18）、优惠券卡片（US-MVP-19）
     - 电话呼叫（US-MVP-15）
   - **会话结束**：
     - 客服关闭会话 / 用户主动结束 / 超时自动关闭（US-MVP-05）
     - 服务评价弹窗（US-MVP-21，待建，当前仅有 rate 字段）
     - 历史消息查看（F-EX-03/04，已有）
   - **离线分支**：
     - 离线自动回复（US-MVP-22）
     - 留言引导卡片 → 留言表单提交（US-MVP-20）
   - **转接分支**：
     - F-EX-02 会话转接（已有）
     - user-transfer 通知（已有）
3. 每个节点标注状态：[已有] / [待建-1期] / [待建-2期]
4. 关键分支点使用菱形决策节点
5. 在流程图下方添加 Markdown 表格，列出每个节点对应的用户故事 ID 和功能 ID
</action>

<acceptance_criteria>
- 文件 `OUTPUT-01-flow-user-journey.md` 存在且非空
- 包含 1 个 Mermaid flowchart 代码块，语法正确可渲染
- 流程覆盖：入口 → 登录连接 → 路由分配 → 排队 → 会话 → 结束 → 离线分支 → 转接分支
- 每个节点标注了状态标签（[已有]/[待建-1期]/[待建-2期]）
- 节点数量在 25-45 个之间（概览级粒度）
- 流程图下方有节点-功能映射表，每个节点关联至少 1 个功能 ID
</acceptance_criteria>

---

### Task 2: 绘制管理端客服操作流程图

绘制客服人员在管理端的完整操作流程，涵盖登录、接待、会话中操作、转接、结束等环节。

<action>
1. 创建 `OUTPUT-02-flow-admin-operations.md`
2. 绘制 Mermaid flowchart（方向 TB），覆盖以下节点和路径：
   - **登录与初始化**：
     - 管理员登录（/api/backend/login，已有）
     - 进入 Chat 全屏面板（F-EX-01 多渠道工作台，已有）
     - WebSocket 连接 + 接收 admins 列表（已有）
     - 加载个人设置：is_auto_accept / welcome_content（已有）
   - **待处理事项**：
     - 待处理面板（US-MVP-01，待建）：未回复消息、超时预警、待评价
     - 等待队列 waiting-users（F-EX-07，已有）
   - **接手会话**：
     - 手动接手 / 自动分配（is_auto_accept，已有）→ 路由引擎分配（US-MVP-02，待建）
     - 查看客户信息面板（US-MVP-07/08/09/10，待建）：
       - 基础信息 Tab、行为数据 Tab、交易数据 Tab、服务数据 Tab
   - **会话中操作**：
     - 发送消息（text/image，已有）
     - 快捷回复选择（F-EX-05，已有）→ 场景分类（US-MVP-12，待建）
     - 发送卡片消息：订单卡片（US-MVP-17）、商品卡片（US-MVP-18）、优惠券卡片（US-MVP-19）
     - 消息撤回（US-MVP-03）
     - 标记已读（F-EX-08，已有）
     - 敏感词拦截提示（US-MVP-04，客服侧拦截并提示修改）
   - **转接操作**：
     - F-EX-02 会话转接（已有）→ 选择目标客服 → 发送 user-transfer
     - 转接记录查看（/transfer，已有）
   - **结束会话**：
     - 手动关闭会话
     - 超时自动关闭（US-MVP-05）
     - 查看评价结果（US-MVP-13）
   - **留言管理**：
     - 离线留言列表（US-MVP-06）：待处理/处理中/已回复/无效
     - 分配处理 → 回复
3. 标注每个节点状态：[已有] / [待建-1期] / [待建-2期]
4. 流程图下方添加节点-功能映射表
</action>

<acceptance_criteria>
- 文件 `OUTPUT-02-flow-admin-operations.md` 存在且非空
- 包含 1 个 Mermaid flowchart 代码块，语法正确可渲染
- 流程覆盖：登录初始化 → 待办面板 → 接手会话 → 客户信息 → 会话操作 → 转接 → 结束 → 留言管理
- 每个节点标注状态标签
- 节点数量在 25-40 个之间
- 流程图下方有节点-功能映射表
</acceptance_criteria>

---

### Task 3: 绘制系统内部流程图

绘制系统后端的内部处理流程，涵盖会话分配、消息路由、规则引擎、定时任务等系统级行为。

<action>
1. 创建 `OUTPUT-03-flow-system-internal.md`
2. 绘制 Mermaid flowchart（方向 TB），覆盖以下子系统流程：
   - **会话生命周期管理**：
     - 创建会话（customer_chat_sessions INSERT，状态 wait）
     - 状态流转：wait → accept → close / cancel
     - 多租户隔离：customer_id 过滤
   - **消息路由引擎**：
     - 用户发送消息 → WebSocket receive-message
     - 敏感词过滤中间件（US-MVP-04）：DFA 匹配 → 替换/拦截
     - 消息持久化（customer_chat_messages INSERT）
     - WebSocket push 给目标客服（send-message）
     - 已读状态更新（ActionRead + is_read + read_at）
     - 消息撤回流程（US-MVP-03）：revoke-message action + revoked_at 字段
   - **规则引擎处理**：
     - 当前：auto_rules + auto_rule_scenes（全匹配/部分匹配，reply_type=message/transfer）
     - 扩展：reply_type 增加 transfer-human（US-MVP-23）
     - 扩展：场景增加 u-offline（US-MVP-22）
     - 触发场景：进入会话 → 欢迎语 / 客服离线 → 离线回复 / 关键词匹配 → 转人工
   - **定时任务（cron.go）**：
     - 会话超时扫描（US-MVP-05）：扫描无响应会话 → 提醒 → 关闭
     - 未来扩展：超时预警（US-P2-13）
   - **路由分配引擎**：
     - 当前：is_auto_accept 简单分配
     - 待建（US-MVP-02）：路由规则匹配（entry_tag/用户属性/关键词） → 分配策略（轮询/空闲优先/指定）
     - 排队溢出处理
   - **外部系统对接层**：
     - Mock/真实接口切换机制
     - Redis 缓存层（会员信息 5min、商品 10min、订单 2min）
     - 降级策略：超时 → 返回缓存/Mock
3. 标注每个节点状态：[已有] / [待建-1期] / [待建-2期]
4. 流程图下方添加节点-功能映射表和涉及的数据库表/API 映射
</action>

<acceptance_criteria>
- 文件 `OUTPUT-03-flow-system-internal.md` 存在且非空
- 包含 1-2 个 Mermaid flowchart 代码块（消息路由和定时任务可分开），语法正确可渲染
- 覆盖：会话生命周期、消息路由（含敏感词/撤回）、规则引擎、定时任务、路由分配、外部对接层
- 每个节点标注状态标签
- 包含数据库表和 API 路由的映射说明
- 节点数量在 30-50 个之间
</acceptance_criteria>

---

### Task 4: 绘制扩展流程图（离线留言、评价、知识库）

绘制三个关键扩展场景的独立流程图，这些场景涉及跨角色协作和完整业务闭环。

<action>
1. 创建 `OUTPUT-04-flow-extended-scenarios.md`
2. 包含 3 个独立 Mermaid flowchart：
   - **流程 A：离线留言闭环**
     - 检测客服离线（Redis 在线状态）→ 触发离线自动回复（US-MVP-22）
     - 发送留言引导卡片（leave_message 类型）→ 用户填写留言表单（US-MVP-20）
     - 提交到 customer_chat_leave_messages 表 → 客服上线看到待处理留言（US-MVP-06）
     - 分配处理人 → 回复 → 通知用户
     - 标注协同关系：US-MVP-22 → US-MVP-20 → US-MVP-06
   - **流程 B：服务评价闭环**
     - 会话结束（关闭/超时）→ 用户端弹出评价引导（US-MVP-21）
     - 用户填写 4 维度评分 + 标签 + 评论 → 保存到 customer_chat_ratings 表
     - 管理端评价列表查看（US-MVP-13）→ 评价统计面板
     - 客户服务数据聚合（US-MVP-10）：咨询次数/满意度/响应时长
     - 标注协同关系：US-MVP-21 → US-MVP-13 → US-MVP-10
   - **流程 C：知识库生态流程**
     - 管理员创建/编辑知识库分类和条目（US-MVP-11）
     - 发布知识库条目 → 话术库关联知识库（US-MVP-12）
     - FAQ 快捷问题推荐（US-MVP-24）：按 entry_tag 匹配 + hit_count 排序
     - 用户点击 FAQ → 自动发送 → 展示答案
     - 标注协同关系：US-MVP-11 → US-MVP-12 / US-MVP-24
3. 每个流程图标注节点状态和协同关系箭头
4. 流程图下方分别添加节点-功能映射表
</action>

<acceptance_criteria>
- 文件 `OUTPUT-04-flow-extended-scenarios.md` 存在且非空
- 包含 3 个独立 Mermaid flowchart 代码块（流程 A/B/C），语法正确可渲染
- 流程 A 覆盖离线检测 → 自动回复 → 留言提交 → 留言管理完整链路
- 流程 B 覆盖会话结束 → 评价提交 → 评价管理 → 服务数据聚合完整链路
- 流程 C 覆盖知识库创建 → 发布 → 话术关联 → FAQ 推荐完整链路
- 每个流程图标注了协同关系（US-MVP-XX → US-MVP-XX）
- 每个流程 10-20 个节点
</acceptance_criteria>

---

### Task 5: 编写流程分析说明与优化建议

汇总所有流程图的分析发现，识别痛点、冗余环节和优化机会，输出分析报告。

<action>
1. 创建 `OUTPUT-05-flow-analysis-report.md`
2. 结构如下：
   - **Section 1: 流程覆盖度分析**
     - 对照 P01 OUTPUT-01 功能清单（75+ 项），统计流程图中已覆盖的功能数量和覆盖率
     - 按模块统计：会话管理/客户信息/知识库与评价/用户端/系统基础
     - 标注未在流程图中体现的功能（如有）及原因
   - **Section 2: 已有功能流程验证**
     - 基于 Task 0 产出的 US-EX-01~09 验证故事，确认 9 项已有功能在流程图中的位置
     - 标注已有功能的流程完整度（是否有断点或缺失分支）
   - **Section 3: 痛点与瓶颈识别**
     - 基于流程图分析，识别当前系统的主要痛点：
       - 路由分配：仅有 is_auto_accept，无法按规则智能分配
       - 离线体验：仅显示 offline_content 文案，无完整留言闭环
       - 评价体系：仅有 rate 字段，无多维度评价
       - 客户信息：无上下文感知，客服无法快速了解用户背景
       - 消息安全：无敏感词过滤
       - 会话管理：无超时自动关闭，客服资源无法释放
     - 每个痛点关联具体的流程图节点和功能 ID
   - **Section 4: 冗余环节识别**
     - 分析现有流程中是否存在可合并、可省略、可自动化的环节
     - 标注 1 期改造中需要重构的流程节点
   - **Section 5: 优化建议**
     - 按优先级（P0/P1/P2）列出流程优化建议
     - 每条建议包含：问题描述、优化方案、涉及功能 ID、预期收益
     - 特别关注 1 期 W1-2 基础设施阶段的流程改造点
   - **Section 6: 跨系统数据流摘要**
     - 基于 OUTPUT-06 集成需求，梳理流程中涉及的外部系统交互点
     - 标注 Mock/真实切换节点和数据一致性要求
3. 数据来源：Task 0~4 产出的所有流程图文件 + P01 所有 OUTPUT 文件 + CLAUDE.md
</action>

<acceptance_criteria>
- 文件 `OUTPUT-05-flow-analysis-report.md` 存在且非空
- 包含 Section 1~6 共 6 个章节，每节非空
- Section 1 包含按模块的覆盖率统计表（数字 + 百分比）
- Section 3 痛点至少列出 5 个，每个关联功能 ID
- Section 5 优化建议至少列出 8 条，按 P0/P1/P2 分级
- 所有功能 ID 引用与 OUTPUT-01/03/04 一致
</acceptance_criteria>

---

## Verification

1. **文件完整性检查**：确认 P02 目录下存在 6 个 OUTPUT 文件（OUTPUT-00 ~ OUTPUT-05），全部非空
2. **Mermaid 语法检查**：所有 .md 文件中的 Mermaid 代码块语法正确，可被 Mermaid 渲染器解析（无未闭合括号、无非法字符）
3. **状态标注一致性**：所有流程图节点的状态标签仅使用 [已有] / [待建-1期] / [待建-2期] 三种，与 OUTPUT-01 功能清单的期次分类一致
4. **功能覆盖检查**：OUTPUT-01 功能清单中的 9 项已有功能 + 24 项 1 期功能全部在至少一个流程图中出现（通过功能 ID 交叉验证）
5. **协同关系验证**：OUTPUT-03 中定义的 4 个协同组（离线场景/知识库生态/评价闭环/入口路由）在流程图中有完整链路体现
6. **节点映射表检查**：每个流程图文件包含节点-功能映射表，功能 ID 与 P01 产出物一致
7. **分析报告一致性**：OUTPUT-05 中的覆盖率数据与流程图实际节点可交叉验证

## 产出文件清单

| # | 文件名 | 内容 |
|---|--------|------|
| 0 | OUTPUT-00-supplementary-stories.md | P01 缺失补充（9 已有功能验证 + 管理员/集成对接方故事） |
| 1 | OUTPUT-01-flow-user-journey.md | 用户端主旅程流程图 |
| 2 | OUTPUT-02-flow-admin-operations.md | 管理端客服操作流程图 |
| 3 | OUTPUT-03-flow-system-internal.md | 系统内部流程图 |
| 4 | OUTPUT-04-flow-extended-scenarios.md | 扩展流程图（离线/评价/知识库） |
| 5 | OUTPUT-05-flow-analysis-report.md | 流程分析说明与优化建议 |

## 任务依赖关系

```
Task 0 (补充 P01 缺失)
  ↓
Task 1 (用户端流程) ──┐
Task 2 (管理端流程) ──┤ 可并行
Task 3 (系统内部流程) ─┤
Task 4 (扩展流程) ────┘
  ↓
Task 5 (分析报告) ← 依赖 Task 0~4 全部完成
```
