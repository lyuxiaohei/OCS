# CONTEXT — cs-gap-analysis

## 背景

CS 客服系统（`~/Documents/qoder_project/CS/`）是三端架构的在线客服系统：
- **go-chat-service**：Go 后端（GoFrame + MySQL + Redis + WebSocket + gRPC + LangChain）
- **service-frontend**：管理端（Umi Max + Ant Design v5），客服人员使用
- **service-user**：用户端（Taro 4.0 + React），终端用户使用（微信小程序 + H5）

## 排期文件

`~/Documents/qoder_project/CS/线上客服排期.xlsx`，包含 5 个 Sheet：
1. **自研数据平台详细看板** — 数据交换平台对接任务（与客服无直接关系）
2. **商城平台-2026Q3-Q4排期** — 客服系统完整功能清单（112行，含"是否有此功能"列）
3. **供应链平台排期** — OMS/WMS/业财一体（与客服模块仅有"客服模块"子项：退货单、补发、工单）
4. **大数据平台** — 接口迁移任务
5. **AI提交版-自研商城排期** — 关键时间线：
   - 在线客服（人工+自动问答）：开发 6/22–7/24，测试 7/27–8/7
   - AI智能客服：开发 7/13–8/7，测试 8/10–8/18
   - **V1.4 在线客服版上线：8月底**
6. **自研商城版本上线排期** — V1.4 在线客服版 7-9月（8月底）上线

## 当前代码库已实现的功能

### 后端（go-chat-service）
- WebSocket 实时聊天（gorilla/websocket）
- 多租户隔离（customer_id）
- 客服人员管理（customer_admins CRUD）
- 会话管理（session 状态机：wait→accept→close/cancel）
- 消息类型：text, image, audio, video, pdf, navigator, rate, notice
- 消息来源：0=用户, 1=客服, 2=系统, 3=AI
- 会话转接（transfer 表 + ActionUserTransfer）
- 快捷回复（auto_messages CRUD）
- 自动回复规则（auto_rules：全匹配/部分匹配，触发场景含进入会话/客服离线）
- 客服个人设置（欢迎语/离线语/头像/自动接入）
- 系统设置（chat_settings KV 表）
- 聊天文件管理（七牛云/本地存储）
- 会话历史查询（session + message 分页）
- 仪表盘（dashboard 接口）
- LangChain AI 接口（预留，未对接具体 LLM）
- gRPC 微服务支持（可选）
- 定时任务框架（cron.go 存在但逻辑待补充）
- JWT 认证（admin + user 双端）

### 管理端前端（service-frontend）
- 登录页
- 仪表盘页（Dashboard）
- 全屏客服面板（Chat）— WebSocket 消息收发、用户列表、等待队列
- 客服账号管理页（Admin CRUD）
- 快捷回复管理页（AutoMessage CRUD）
- 自动规则管理页（AutoRule CRUD）
- 系统规则页（SystemRule）
- 系统设置页（Setting）
- 转接记录页（Transfer）
- 会话记录页（Session 列表 + 详情）
- 聊天文件页（ChatFile）

### 用户端前端（service-user）
- 登录页
- 聊天主界面（WebSocket + Taro.connectSocket）
- 文字/图片消息收发
- 排队等待提示（waiting-user-count）
- 消息已读回执
- 分页加载历史消息

## 排期表功能清单（112行）分类

排期表"是否有此功能"列标注：
- **"有"** = 代码已有对应实现
- **"无"** = 代码无对应实现
- 空值 = 排期表未标注

## 差距分析（上一轮已完成的详细分析）

### 已具备功能（9项）
1. 多渠道工作台 — 前端 /chat 全屏面板
2. 会话转接 — CTransfer + ActionUserTransfer
3. 历史服务记录 — CSession + 会话列表
4. 历史会话 — getChatSessions + session 列表
5. 快捷回复 — CAutoMessage CRUD
6. 欢迎语设置 — welcome_content
7. 排队等待提示 — waiting-user-count
8. 消息已读/未读 — ActionRead + is_read
9. 断线重连 — WebSocket onclose 重连

### 1期-MVP 缺失（24项）

#### 会话管理（6项）
- 待处理事项面板
- 智能路由与分流规则引擎
- 消息撤回
- 敏感词过滤
- 会话超时自动关闭
- 留言与离线反馈

#### 客户信息（4项）
- 客户基础信息视图（会员等级等）
- 客户行为数据（浏览/加购/搜索）
- 客户交易数据（订单/消费额）
- 客户服务数据（咨询/满意度统计）

#### 知识库与评价（3项）
- 知识库/FAQ 管理
- 话术库场景分类
- 客服评价管理

#### 用户端（8项）
- 语音消息（录音+上传）
- 电话呼叫
- 6个页面咨询入口嵌入
- 订单卡片交互
- 商品卡片交互
- 富媒体消息（优惠券卡片）
- 离线留言提交
- 服务评价 UI

#### 其他（3项）
- 离线自动回复
- 关键词转人工（完善）
- FAQ快捷问题

### 2期缺失（17项） — 体验提升
消息预显、三方会话、拉黑/屏蔽、主动推送、标签体系、AI话术推荐、商品推荐、订单上下文提醒、转人工意图提示、实时监控面板、个人绩效看板、预警机制、会话量统计、渠道统计、输入状态提示、FAQ多轮引导、猜你想问、自助办理、智能自助服务、大模型智能客服基础版

### 3期缺失（25+项） — AI智能化（"未纳入讨论范围"）
客服管理、技能组分流、IVR/邮件/社交媒体渠道、机器人配置、AI核心能力、售前售后场景、人机协同、报表、6种角色权限

## 关键时间约束
- 开发启动：6月22日
- V1.4 上线：8月底
- 可用开发时间：约 9 周
- 负责人：吕道远（产品+前端）、贺远航（开发）
