# OUTPUT-00: 补充用户故事

> **阶段**: P02 业务流程图
> **产出日期**: 2026-06-11
> **范围**: 已有功能验证故事（9条）+ 租户管理员角色故事（4条）+ 集成对接方角色故事（3条）
> **总计**: 16 条用户故事

---

## Section 1: 已有功能验证用户故事（9 条）

> 对应 F-EX-01 ~ F-EX-09，基于 OUTPUT-02 能力基线的代码级分析编写验收标准。

---

### US-EX-01

- **ID**: US-EX-01
- **名称**: 多渠道工作台
- **角色**: 客服人员
- **用户故事**: 作为客服人员，我希望通过统一的WebSocket全屏工作台同时管理多个用户会话，以便高效地提供在线客服服务。
- **验收标准**:
  - AC1: 客服通过 `/api/backend/login` 获取 JWT Token 后，可在管理端 `/chat` 页面建立 WebSocket 连接（`ws://...?token=<JWT>`），连接成功后收到 `receipt` 确认。
  - AC2: 工作台左侧显示当前所有活跃会话列表，包含用户昵称、最后消息摘要、未读计数；点击会话可切换右侧聊天区域。
  - AC3: WebSocket 连接建立后，客服端收到 `admins` Action 推送当前在线客服列表；当新用户进入排队时，客服收到 `waiting-users` 和 `waiting-user-count` 推送。
  - AC4: 客服可在聊天区域发送 `text`、`image` 消息（通过 `send-message` Action），用户端实时收到 `receive-message`。
  - AC5: 管理端路由 `/chat`（定义于 `service-frontend/config/routes.ts`）为全屏布局，WebSocket 状态管理通过 valtio proxy（`service-frontend/src/pages/chat/store/websocket.ts`）维护。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: WebSocket 基于 gorilla/websocket；管理端聊天面板位于 `service-frontend/src/pages/chat/`；valtio 状态代理在 `store/websocket.ts`；路由注册在 `go-chat-service/internal/controller/router.go` 的 `/api/backend/ws` 路径。

---

### US-EX-02

- **ID**: US-EX-02
- **名称**: 会话转接
- **角色**: 客服人员
- **用户故事**: 作为客服人员，我希望将当前会话转接给其他客服，以便将专业问题分配给更合适的同事处理。
- **验收标准**:
  - AC1: 客服在会话中点击"转接"按钮后，可从在线客服列表中选择目标客服，并填写转接备注。
  - AC2: 后端通过 `CTransfer` 控制器创建转接记录，写入 `customer_chat_transfers` 表（含 from_admin_id、to_admin_id、session_id、remark）。
  - AC3: 目标客服通过 WebSocket 收到 `user-transfer` Action 推送，包含转接来源、用户信息和备注。
  - AC4: 转接完成后，原客服的会话列表中该会话消失（状态变更），目标客服的会话列表中出现该会话。
  - AC5: 转接记录可在 `/transfer` 管理页面（`CTransfer` 列表接口）中查看历史。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 后端控制器 `go-chat-service/internal/controller/backend/transfer.go`（CTransfer）；WebSocket Action `user-transfer` 由 `ActionUserTransfer` 处理；数据表 `customer_chat_transfers` 含 from/to admin/session 字段及 remark；管理端转接记录页路由 `/transfer`。

---

### US-EX-03

- **ID**: US-EX-03
- **名称**: 历史服务记录
- **角色**: 客服人员
- **用户故事**: 作为客服人员，我希望查看用户的历史服务记录，以便了解用户的过往咨询情况和问题处理进展。
- **验收标准**:
  - AC1: 客服在聊天面板中点击用户信息区域，可展开该用户的历史服务记录列表。
  - AC2: 历史记录通过 `CSession` 控制器的会话详情接口获取，按时间倒序展示，每条记录显示会话时间、接待客服、会话状态、评分。
  - AC3: 点击某条历史记录可展开该会话的完整消息记录（通过 `customer_chat_messages` 表按 session_id 查询）。
  - AC4: 消息记录支持分页加载，消息类型正确渲染（text/image/audio/video/pdf/navigator/notice）。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 后端控制器 `go-chat-service/internal/controller/backend/session.go`（CSession）；会话列表接口 `getChatSessions` 支持按 user_id 过滤；消息查询基于 `customer_chat_messages` 表；管理端会话详情页路由 `/session/:id`。

---

### US-EX-04

- **ID**: US-EX-04
- **名称**: 历史会话
- **角色**: 客服人员
- **用户故事**: 作为客服人员，我希望在会话列表页面查看所有历史会话并进行筛选，以便跟踪和分析服务质量。
- **验收标准**:
  - AC1: 管理端 `/session` 页面展示所有历史会话列表，包含用户信息、接待客服、会话状态（wait/accept/close/cancel）、创建时间、评分。
  - AC2: 列表支持按时间范围、会话状态、客服人员筛选，支持分页浏览。
  - AC3: `customer_chat_sessions` 表的 `rate` 字段正确展示会话评分（如有）。
  - AC4: 会话列表通过 `getChatSessions` 接口（`CSession` 控制器）获取，数据按 `customer_id` 多租户隔离。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 后端 `CSession` 控制器提供会话列表接口；数据表 `customer_chat_sessions` 含 status、rate 等字段；多租户通过 `customer_id` 隔离；管理端路由 `/session`（定义于 `config/routes.ts`）。

---

### US-EX-05

- **ID**: US-EX-05
- **名称**: 快捷回复
- **角色**: 客服人员
- **用户故事**: 作为客服人员，我希望使用预设的快捷回复模板快速回复常见问题，以便提高回复效率和标准化服务质量。
- **验收标准**:
  - AC1: 管理端 `/auto/message` 页面支持快捷回复模板的增删改查操作（CRUD）。
  - AC2: 每个模板包含名称（name）、分类（type）、内容（content），数据存储于 `customer_chat_auto_messages` 表，按 `customer_id` 多租户隔离。
  - AC3: 客服在聊天面板中可打开快捷回复面板，按分类筛选模板，点击模板后内容自动填入输入框。
  - AC4: 模板内容支持文本格式，发送后作为普通 `text` 消息通过 WebSocket 推送给用户。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 后端控制器 `go-chat-service/internal/controller/backend/auto_message.go`（CAutoMessage）提供 CRUD 接口；数据表 `customer_chat_auto_messages` 含 name、type、content、customer_id 字段；管理端路由 `/auto/message`。

---

### US-EX-06

- **ID**: US-EX-06
- **名称**: 欢迎语设置
- **角色**: 租户管理员
- **用户故事**: 作为租户管理员，我希望配置客服的欢迎语内容，以便用户进入会话时自动发送个性化问候。
- **验收标准**:
  - AC1: 租户管理员在管理端 `/setting` 页面的客服个人设置区域，可编辑 `welcome_content` 字段。
  - AC2: 欢迎语内容存储于 `customer_admin_chat_settings` 表的 `welcome_content` 字段，与特定 `admin_id` 关联。
  - AC3: 当新用户发起会话且被分配到该客服时，系统自动发送欢迎语消息（source=2 系统消息），消息类型为 `text`。
  - AC4: 欢迎语为空时不发送自动欢迎消息。
  - AC5: 修改保存后立即生效，新会话使用更新后的欢迎语。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 数据表 `customer_admin_chat_settings` 含 `welcome_content` 字段；管理端设置通过 `CCurrentAdmin.UpdateSetting`/`GetSetting` 接口（路由 `/api/backend/current`）；欢迎语在会话创建时由后端自动发送。

---

### US-EX-07

- **ID**: US-EX-07
- **名称**: 排队等待提示
- **角色**: 终端用户
- **用户故事**: 作为终端用户，我希望在等待客服接待时看到前面排队的人数提示，以便了解预计等待时间并减少焦虑。
- **验收标准**:
  - AC1: 用户通过用户端（Taro 小程序/H5）发起聊天后，若所有客服繁忙，进入等待队列。
  - AC2: 用户端通过 WebSocket 收到 `waiting-user-count` Action 推送，显示当前排队人数（如"前面还有 3 位用户等待"）。
  - AC3: 当排队人数变化时（新用户加入或前方用户被接待），用户端实时更新排队人数显示。
  - AC4: 当轮到该用户被客服接待时，排队提示消失，进入正常聊天界面，收到系统通知（source=2）告知已接入客服。
  - AC5: 用户端聊天主界面（`service-user/src/pages/index/index.tsx`）正确渲染排队等待提示 UI。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: WebSocket Action `waiting-user-count` 由服务端推送；用户端基于 Taro 4.0（`service-user/`），聊天页面 `src/pages/index/index.tsx` 通过 Taro.connectSocket 接收推送；后端通过 WebSocket 广播排队人数变化。

---

### US-EX-08

- **ID**: US-EX-08
- **名称**: 消息已读未读
- **角色**: 客服人员
- **用户故事**: 作为客服人员，我希望看到用户是否已读我的消息，以便判断用户是否收到信息并决定是否需要再次提醒。
- **验收标准**:
  - AC1: 消息表中每条消息包含 `is_read`（布尔值）和 `read_at`（时间戳）字段，用于标记已读状态。
  - AC2: 用户端打开聊天页面或滚动到某条消息时，通过 WebSocket 发送 `read` Action，携带消息 ID 列表。
  - AC3: 后端收到 `read` Action 后，通过 `ActionRead` 更新 `customer_chat_messages` 表对应消息的 `is_read` 为 true 并记录 `read_at` 时间。
  - AC4: 客服端收到 `read` Action 推送后，聊天界面中对应消息的未读标记（如蓝色圆点）变为已读标记。
  - AC5: 管理端会话列表中显示每个会话的未读消息计数。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 数据表 `customer_chat_messages` 含 `is_read` 和 `read_at` 字段；WebSocket Action `read` 由 `ActionRead` 处理（`go-chat-service/internal/`）；后端更新 `customer_chat_messages` 表后通过 WebSocket 推送已读回执给客服端。

---

### US-EX-09

- **ID**: US-EX-09
- **名称**: 断线重连
- **角色**: 终端用户
- **用户故事**: 作为终端用户，我希望在网络不稳定导致连接断开时系统能自动重新连接，以便不丢失聊天内容和中断服务体验。
- **验收标准**:
  - AC1: 用户端 WebSocket 连接断开（触发 `onclose` 事件）时，前端自动启动重连机制，无需用户手动操作。
  - AC2: 重连成功后，前端自动通过 JWT Token 重新认证（`ws://...?token=<JWT>`），恢复会话状态。
  - AC3: 重连后前端自动拉取离线期间的历史消息（通过消息接口分页加载），确保聊天记录完整不丢失。
  - AC4: 重连过程中用户端显示"正在重连..."提示，重连成功后提示消失。
  - AC5: 多次重连失败时（如 token 过期），引导用户重新登录（401 自动跳转登录页，参考 `service-user/src/util/request.ts` 逻辑）。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 用户端前端基于 Taro 4.0 的 `Taro.connectSocket` API（`service-user/src/pages/index/index.tsx`）；WebSocket `onclose` 事件触发自动重连；请求封装在 `service-user/src/util/request.ts`，401 状态码自动跳转登录页。

---

## Section 2: 租户管理员角色故事（4 条）

> 基于现有代码中管理员相关功能（cmd init、CRUD、chat_setting、auto_rules），定义租户管理员的用户故事。

---

### US-ADMIN-01

- **ID**: US-ADMIN-01
- **名称**: 系统初始化配置
- **角色**: 租户管理员
- **用户故事**: 作为租户管理员，我希望通过命令行工具初始化租户的基础配置数据，以便快速启用客服系统并开始使用。
- **验收标准**:
  - AC1: 执行 `cmd init -c <customerId>` 命令后，系统在 `customers` 表中创建租户记录，并初始化该租户的默认配置数据。
  - AC2: 初始化完成后，租户管理员可使用初始化时创建的管理员账号登录管理端（`/api/backend/login`）。
  - AC3: 初始化包含默认系统设置（`customer_chat_settings` 表的 KV 配置项）、默认自动回复规则（`customer_chat_auto_rules` 表）和默认规则场景（`customer_chat_auto_rule_scenes` 表）。
  - AC4: 重复执行 `cmd init -c <customerId>` 对已存在的租户不产生重复数据（幂等性检查）。
  - AC5: 初始化脚本入口位于 `go-chat-service/cmd/`，数据库连接配置参考 `go-chat-service/hack/config.yaml`。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 初始化命令入口 `go-chat-service/cmd/`，`init -c <customerId>` 子命令；数据库配置 `go-chat-service/hack/config.yaml`；涉及表 `customers`、`customer_chat_settings`、`customer_chat_auto_rules`、`customer_chat_auto_rule_scenes`。

---

### US-ADMIN-02

- **ID**: US-ADMIN-02
- **名称**: 客服账号管理
- **角色**: 租户管理员
- **用户故事**: 作为租户管理员，我希望创建、编辑、启用/禁用客服人员账号，以便管理客服团队的成员和权限。
- **验收标准**:
  - AC1: 管理端 `/admin` 页面展示当前租户下所有客服人员列表，包含用户名、创建时间、在线状态。
  - AC2: 管理员可新增客服账号（填写用户名和密码），后端通过 `CCustomerAdmin` 控制器将记录写入 `customer_admins` 表（含 customer_id、username、password hash）。
  - AC3: 管理员可编辑已有客服账号的用户名和密码（密码使用 hash 加密存储）。
  - AC4: 管理员可删除客服账号，删除后该客服无法登录（`/api/backend/login` 拒绝认证）。
  - AC5: 所有操作基于 `customer_id` 多租户隔离，管理员只能管理本租户的客服账号。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 后端控制器 `go-chat-service/internal/controller/backend/` 下的 `CCustomerAdmin`（路由 `/api/backend/admin`）；数据表 `customer_admins` 含 id、customer_id、username、password 字段；密码 hash 存储；管理端路由 `/admin`；多租户通过 AdminAuth 中间件注入的 customer_id 隔离。

---

### US-ADMIN-03

- **ID**: US-ADMIN-03
- **名称**: 系统设置管理
- **角色**: 租户管理员
- **用户故事**: 作为租户管理员，我希望配置客服系统的全局设置参数（如欢迎语、离线提示文案、自动接听等），以便统一管理客服系统的运行策略。
- **验收标准**:
  - AC1: 管理端 `/setting` 页面（`CChatSetting` 控制器）提供系统级设置的查看和编辑功能，数据存储于 `customer_chat_settings` 表（KV 结构，含 name、value、type 字段）。
  - AC2: 管理员可配置全局参数，包括但不限于：自动接听开关（对应 `customer_admin_chat_settings.is_auto_accept`）、离线提示文案（`offline_content`）。
  - AC3: `CSystemRule` 控制器（路由 `/api/backend/system-rule`）提供系统规则配置，管理员可查看和调整自动回复的系统级规则。
  - AC4: 设置修改保存后立即生效，影响新创建的会话和消息处理逻辑。
  - AC5: 所有设置按 `customer_id` 多租户隔离，不同租户的配置互不影响。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 后端控制器 `CChatSetting`（路由 `/api/backend/chat-setting`）和 `CSystemRule`（路由 `/api/backend/system-rule`）；数据表 `customer_chat_settings`（KV 结构，含 name/value/type/customer_id）和 `customer_admin_chat_settings`（含 is_auto_accept、welcome_content、offline_content）；管理端路由 `/setting` 和 `/auto/system-rule`。

---

### US-ADMIN-04

- **ID**: US-ADMIN-04
- **名称**: 路由规则配置
- **角色**: 租户管理员
- **用户故事**: 作为租户管理员，我希望配置自动回复规则和匹配场景（如全匹配/部分匹配、进入会话触发/客服离线触发），以便实现自动化的消息处理和客户分流。
- **验收标准**:
  - AC1: 管理端 `/auto/rule` 页面（`CAutoRule` 控制器）提供自动回复规则的 CRUD 操作，数据存储于 `customer_chat_auto_rules` 表（含 match、match_type、reply_type、message_id、scenes 字段）。
  - AC2: 管理员可配置规则的匹配方式（`match_type`：全匹配/部分匹配），以及匹配关键词内容（`match`）。
  - AC3: 管理员可配置规则的回复类型（`reply_type`：message 自动回复 / transfer 转接），并关联到具体的快捷回复模板（`message_id` 关联 `customer_chat_auto_messages`）。
  - AC4: 管理员可配置规则触发的场景（`customer_chat_auto_rule_scenes` 表），场景包括进入会话触发、客服离线触发等，通过 `scenes` 字段关联。
  - AC5: 规则引擎（`controller/rule/`）在消息到达时按优先级匹配规则，匹配成功后执行对应动作（自动回复或转接）。
  - AC6: 所有规则数据按 `customer_id` 多租户隔离。
- **优先级**: P0
- **期次**: 已实现
- **依赖**: 无
- **技术备注**: 后端控制器 `CAutoRule`（路由 `/api/backend/auto-rule`）；规则引擎位于 `go-chat-service/internal/controller/rule/`；数据表 `customer_chat_auto_rules`（含 match、match_type、reply_type、message_id、scenes）和 `customer_chat_auto_rule_scenes`（含 name、rule_id）；当前 reply_type 支持 message 和 transfer 两种。

---

## Section 3: 集成对接方角色故事（3 条）

> 基于 OUTPUT-06 集成需求，从集成开发者的角度定义用户故事，涵盖外部接口对接、缓存策略和 Mock 机制。

---

### US-INT-01

- **ID**: US-INT-01
- **名称**: 商城 API 对接
- **角色**: 集成开发者
- **用户故事**: 作为集成开发者，我希望对接商城系统的会员、商品、订单等外部 API，以便客服系统能获取客户维度的完整数据并在聊天界面展示。
- **验收标准**:
  - AC1: 后端实现商城会员库接口调用（GET `/api/external/member/info?user_id=xxx`），返回用户会员等级、昵称、注册时间、消费总额、积分等信息（JSON 格式，字段与 OUTPUT-06 2.1 契约一致）。
  - AC2: 后端实现商城商品库接口调用（GET `/api/external/product/detail?product_id=xxx`），返回商品名称、价格、图片、库存等信息（字段与 OUTPUT-06 2.2 契约一致）。
  - AC3: 后端实现 OMS 订单库接口调用，包含订单详情（GET `/api/external/order/detail?order_no=xxx`）和用户订单列表（GET `/api/external/order/list?user_id=xxx`），返回订单状态、商品项、金额等（字段与 OUTPUT-06 2.3 契约一致）。
  - AC4: 后端实现营销中心接口调用，包含优惠券详情（GET `/api/external/coupon/detail?coupon_id=xxx`）和优惠券领取（POST `/api/external/coupon/claim`），字段与 OUTPUT-06 2.4 契约一致。
  - AC5: 所有外部接口调用通过统一封装，支持 API Key 认证、HTTPS、3 秒超时、失败重试 1 次（间隔 500ms）。
  - AC6: 外部接口不可用时降级返回 Mock 数据或缓存数据，不影响客服系统核心聊天功能。
- **优先级**: P0
- **期次**: 1期-MVP（Mock先行，真实接口 1期后对接）
- **依赖**: 外部系统 API 就绪（1期使用 Mock 数据）
- **技术备注**: 接口契约定义于 OUTPUT-06 Section 2；涉及 5 个外部系统（会员库、商品库、OMS、营销中心、埋点系统）；1期策略为硬编码 Mock（`if config.Mock.Enabled` 分支）；后端实现位置拟在 `go-chat-service/internal/service/` 下新增外部接口服务层。

---

### US-INT-02

- **ID**: US-INT-02
- **名称**: 数据同步与缓存策略
- **角色**: 集成开发者
- **用户故事**: 作为集成开发者，我希望为外部接口数据实现合理的缓存策略和数据同步机制，以便在保证数据时效性的同时减少外部系统调用频次并提升响应速度。
- **验收标准**:
  - AC1: 会员信息查询结果缓存至 Redis，TTL 5 分钟，刷新策略为 TTL 过期 + 主动刷新，限流 10 次/秒/租户。
  - AC2: 商品详情查询结果缓存至 Redis，TTL 10 分钟，刷新策略为 TTL 过期，限流 20 次/秒/租户。
  - AC3: 订单详情查询结果缓存至 Redis，TTL 2 分钟，刷新策略为 TTL 过期，限流 10 次/秒/租户。
  - AC4: 优惠券详情不缓存（强一致），每次实时查询，限流 10 次/秒/租户；优惠券领取操作限流 5 次/秒/用户，不缓存。
  - AC5: 缓存 key 命名遵循统一格式（如 `cs:cache:{type}:{id}`），支持按租户前缀隔离。
  - AC6: 接口超时（3秒）或异常时，降级返回 Redis 中的过期缓存数据（如有），否则返回 Mock 数据。
- **优先级**: P1
- **期次**: 1期-MVP（随 US-INT-01 同步实现）
- **依赖**: US-INT-01
- **技术备注**: 缓存策略定义于 OUTPUT-06 Section 7（7.1 数据一致性策略 + 7.2 缓存策略）；缓存基于 Redis；限流配置参见 OUTPUT-06 Section 5.2；降级策略参见 OUTPUT-06 Section 5.1。

---

### US-INT-03

- **ID**: US-INT-03
- **名称**: Mock / 真实接口切换机制
- **角色**: 集成开发者
- **用户故事**: 作为集成开发者，我希望通过配置开关实现 Mock 数据和真实外部接口的无缝切换，以便在开发测试阶段使用 Mock 数据快速迭代，在外部系统就绪后平滑切换到真实接口。
- **验收标准**:
  - AC1: 后端配置文件中定义 `ExternalConfig` 结构体，包含每个外部接口的独立配置项（BaseURL、Mock 开关、Timeout），结构体定义与 OUTPUT-06 Section 3.3 一致。
  - AC2: 当 `Mock=true` 时，后端服务层返回硬编码的 Mock 数据，不发起外部 HTTP 请求；Mock 数据覆盖 3 种场景：normal（正常数据）、empty（无数据）、error（异常）。
  - AC3: 当 `Mock=false` 时，后端通过 `BaseURL` 和 `Timeout` 配置发起真实的外部接口 HTTP 调用。
  - AC4: 每个外部接口（会员库、商品库、订单库、营销中心）的 Mock 开关可独立配置，支持部分接口用 Mock、部分接口用真实调用的混合模式。
  - AC5: 配置变更后重启服务即可生效，无需修改代码；配置通过 GoFrame 标准配置文件加载（参考 `hack/config.yaml` 格式）。
  - AC6: Mock 数据的 JSON 结构与真实接口响应体结构完全一致，确保切换后前端无需任何修改。
- **优先级**: P0
- **期次**: 1期-MVP
- **依赖**: US-INT-01
- **技术备注**: 1期采用硬编码 Mock 方案；配置结构体 `ExternalConfig`（含 `APIConfig`，字段 BaseURL/Mock/Timeout）定义于 OUTPUT-06 Section 3.3；GoFrame 配置加载参考 `go-chat-service/hack/config.yaml`；每个接口 Mock 数据包含 normal/empty/error 三种场景（OUTPUT-06 Section 3.2）。

---

## 汇总统计

| Section | 分类 | 数量 | ID 范围 |
|---------|------|------|---------|
| Section 1 | 已有功能验证故事 | 9 | US-EX-01 ~ US-EX-09 |
| Section 2 | 租户管理员角色故事 | 4 | US-ADMIN-01 ~ US-ADMIN-04 |
| Section 3 | 集成对接方角色故事 | 3 | US-INT-01 ~ US-INT-03 |
| **合计** | — | **16** | — |

---

> **文件状态**: 初稿完成，16 条用户故事覆盖已实现功能验证、管理员角色和集成对接三个维度
