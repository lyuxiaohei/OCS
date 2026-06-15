# CS 商城客服系统 — 原型操作流程图

> 生成日期：2026-06-12  
> 覆盖范围：全部 20 个原型页面（管理端 15 页 + 用户端 5 页）

---

## 目录

- [一、全局导航架构](#一全局导航架构)
- [二、管理端页面流程](#二管理端页面流程)
  - [1. 管理员登录](#1-管理员登录)
  - [2. 数据仪表盘](#2-数据仪表盘)
  - [3. 客服工作台](#3-客服工作台)
  - [4. 待办事项](#4-待办事项)
  - [5. 历史会话](#5-历史会话)
  - [6. 客户信息](#6-客户信息)
  - [7. 会话转接](#7-会话转接)
  - [8. 知识库管理](#8-知识库管理)
  - [9. 话术库](#9-话术库)
  - [10. 评价管理](#10-评价管理)
  - [11. 系统设置](#11-系统设置)
  - [12. 留言管理](#12-留言管理)
  - [13. 机器人配置](#13-机器人配置)
  - [14. 智能质检](#14-智能质检)
  - [15. 报表看板](#15-报表看板)
- [三、用户端页面流程](#三用户端页面流程)
  - [16. 场景咨询入口](#16-场景咨询入口)
  - [17. 聊天主界面](#17-聊天主界面)
  - [18. FAQ 常见问题](#18-faq-常见问题)
  - [19. 离线留言](#19-离线留言)
  - [20. 服务评价](#20-服务评价)
- [四、跨页面完整用户旅程](#四跨页面完整用户旅程)

---

## 一、全局导航架构

### 管理端侧边栏导航

```
┌─────────────────────────────┐
│       CS 客服管理后台         │
├─────────────────────────────┤
│ ▸ 工作台                     │
│   ├─ 数据仪表盘              │──→ admin-dashboard.html
│   ├─ 客服工作台              │──→ admin-workbench.html
│   └─ 待办事项                │──→ admin-todo.html
│ ▸ 服务管理                   │
│   ├─ 历史会话                │──→ admin-session-list.html
│   ├─ 会话转接                │──→ admin-transfer.html
│   ├─ 评价管理                │──→ admin-rating-mgmt.html
│   └─ 留言管理                │──→ admin-leave-mgmt.html
│ ▸ 配置                       │
│   ├─ 知识库                  │──→ admin-knowledge.html
│   ├─ 话术库                  │──→ admin-scripts.html
│   ├─ 自动回复                │──→ ai-bot-config.html
│   └─ 系统设置                │──→ admin-settings.html
│ ▸ AI 智能化                  │
│   ├─ 机器人配置              │──→ ai-bot-config.html
│   ├─ 质检分析                │──→ ai-quality.html
│   └─ 报表看板                │──→ ai-report.html
└─────────────────────────────┘
```

> 说明：所有管理端页面共享 `nav.js` 渲染侧边栏，通过 `data-active` 属性高亮当前页。

### 页面间核心导航关系

```mermaid
graph LR
    LOGIN[登录页] -->|登录成功| INDEX[原型首页]
    INDEX --> DASH[仪表盘]
    INDEX --> WB[工作台]
    INDEX --> TODO[待办事项]
    
    DASH -->|查看全部待办| TODO
    TODO -->|全部处理| WB
    TODO -->|查看全部评价| RATING[评价管理]
    
    WB -->|顶部导航| DASH
    WB -->|顶部导航| TODO
    WB -->|顶部导航| SESSION[历史会话]
    WB -->|顶部导航| KB[知识库]
    WB -->|顶部导航| SETTINGS[系统设置]
    
    SESSION -->|查看会话| WB
    RATING -->|查看会话| SESSION
    
    LEAVE[留言管理] -.->|来源| USER_OFFLINE[用户离线页]
    
    style LOGIN fill:#f56c6c,color:#fff
    style WB fill:#409eff,color:#fff
    style DASH fill:#67c23a,color:#fff
```

---

## 二、管理端页面流程

### 1. 管理员登录

**文件**：`admin/admin-login.html`  
**角色**：管理员

```mermaid
flowchart TD
    START([打开登录页]) --> INPUT[输入用户名和密码]
    INPUT --> TOGGLE{切换密码可见?}
    TOGGLE -->|点击眼睛图标| SHOW[明文显示密码]
    TOGGLE -->|不切换| HIDDEN[密码掩码显示]
    SHOW --> REMEMBER
    HIDDEN --> REMEMBER{记住登录?}
    REMEMBER -->|勾选| CHECKED[记住状态]
    REMEMBER -->|不勾选| UNCHECK[不记住]
    CHECKED --> LOGIN_CLICK
    UNCHECK --> LOGIN_CLICK[点击登录按钮]
    
    LOGIN_CLICK --> VALIDATE{字段校验}
    VALIDATE -->|用户名或密码为空| ALERT1[弹出提示：请输入用户名和密码]
    ALERT1 --> INPUT
    
    VALIDATE -->|字段非空| SUCCESS[弹出提示：登录成功]
    SUCCESS --> REDIRECT[跳转至原型首页 index.html]
    
    FORGOT[忘记密码?] -.->|占位| INPUT
    BACK[返回原型首页] -.-> REDIRECT
    
    style START fill:#909399,color:#fff
    style SUCCESS fill:#67c23a,color:#fff
    style ALERT1 fill:#f56c6c,color:#fff
    style REDIRECT fill:#409eff,color:#fff
```

---

### 2. 数据仪表盘

**文件**：`admin/admin-dashboard.html`  
**功能**：运营数据概览 — 今日会话、在线客服、响应时长、满意度、趋势图、绩效排行、待办汇总

```mermaid
flowchart TD
    ENTER([进入仪表盘]) --> VIEW[查看顶部4个指标卡片]
    VIEW --> METRICS[
        今日会话 1,286<br/>
        在线客服 18/24<br/>
        平均响应 42秒<br/>
        满意度 4.82
    ]
    
    METRICS --> ACTIONS{用户操作}
    
    ACTIONS -->|切换图表时段| CHART[会话量趋势图<br/>今日 / 近7天]
    ACTIONS -->|查看绩效排行| RANKING[客服绩效排行<br/>本月接待量排名]
    ACTIONS -->|查看待办汇总| PENDING[
        超时未响应 3<br/>
        差评待跟进 4<br/>
        待评价催办 5
    ]
    ACTIONS -->|点击查看全部待办| TODO[跳转 → 待办事项页]
    ACTIONS -->|侧边栏导航| OTHER[跳转至其他管理端页面]
    
    PENDING -->|点击查看全部| TODO
    
    style ENTER fill:#909399,color:#fff
    style TODO fill:#e6a23c,color:#fff
```

---

### 3. 客服工作台

**文件**：`admin/admin-workbench.html`  
**功能**：核心工作界面 — 三栏布局（会话列表 | 聊天窗 | 客户信息）

```mermaid
flowchart TD
    ENTER([进入工作台]) --> THREE_COL[
        左栏：会话列表<br/>
        中栏：聊天窗口<br/>
        右栏：客户信息
    ]
    
    %% 左栏操作
    THREE_COL --> LEFT_TAB{会话列表Tab}
    LEFT_TAB -->|进行中 8| SHOW_ACTIVE[显示活跃会话]
    LEFT_TAB -->|等待中 3| SHOW_WAITING[显示排队会话]
    LEFT_TAB -->|已结束 13| SHOW_CLOSED[显示历史会话]
    
    SHOW_ACTIVE --> SELECT_SESSION[点击选中某个会话]
    SELECT_SESSION --> LOAD_CHAT[中栏加载该会话聊天记录]
    
    %% 中栏操作
    LOAD_CHAT --> CHAT_ACTIONS{聊天操作}
    
    CHAT_ACTIONS -->|发送文本| TYPE[输入框输入文字]
    TYPE -->|Enter 发送| SENT[消息发送，清空输入框]
    
    CHAT_ACTIONS -->|快捷回复| QR_CLICK[点击「快捷回复」按钮]
    QR_CLICK --> QR_PANEL[展开快捷回复面板]
    QR_PANEL --> QR_SELECT[选择一条快捷回复]
    QR_SELECT -->|插入文字| TYPE
    
    CHAT_ACTIONS -->|消息撤回| HOVER[悬停客服发送的消息]
    HOVER --> THREE_DOT[显示三点菜单按钮]
    THREE_DOT --> CLICK_MENU[点击展开菜单]
    CLICK_MENU --> CLICK_RECALL[点击「撤回」]
    CLICK_RECALL --> RECALLED[消息替换为灰色斜体<br/>「你撤回了一条消息」]
    
    CHAT_ACTIONS -->|发送卡片| CARD_BTN[点击工具栏卡片按钮]
    CARD_BTN --> ORDER_CARD[订单卡片 / 商品卡片 / 优惠券]
    
    CHAT_ACTIONS -->|转接| TRANSFER_BTN[点击「转接」按钮]
    CHAT_ACTIONS -->|结束会话| END_BTN[点击关闭按钮]
    
    %% 右栏操作
    SELECT_SESSION --> RIGHT_TAB{客户信息Tab}
    RIGHT_TAB -->|基础信息| TAB_BASIC[头像/姓名/等级/标签]
    RIGHT_TAB -->|行为数据| TAB_BEHAVIOR[浏览轨迹/加购/收藏]
    RIGHT_TAB -->|交易数据| TAB_TRADE[订单列表/消费金额]
    RIGHT_TAB -->|服务数据| TAB_SERVICE[咨询次数/满意度]
    
    %% 顶部导航
    ENTER --> TOP_NAV{顶部导航栏}
    TOP_NAV -->|待办事项| TODO_PAGE[→ admin-todo.html]
    TOP_NAV -->|历史会话| SESSION_PAGE[→ admin-session-list.html]
    TOP_NAV -->|数据仪表盘| DASH_PAGE[→ admin-dashboard.html]
    
    style ENTER fill:#909399,color:#fff
    style RECALLED fill:#909399,color:#fff
    style SENT fill:#67c23a,color:#fff
```

---

### 4. 待办事项

**文件**：`admin/admin-todo.html`  
**功能**：集中展示未回复消息、超时预警、待评价催办

```mermaid
flowchart TD
    ENTER([进入待办页]) --> VIEW_STATS[
        8 未回复消息<br/>
        3 超时预警<br/>
        5 待评价催办<br/>
        16 总待办
    ]
    
    VIEW_STATS --> THREE_COLS{三栏操作}
    
    %% 未回复消息
    THREE_COLS -->|第一栏| UNANSWERED[未回复消息列表]
    UNANSWERED --> CLICK_REPLY[点击「立即回复」]
    CLICK_REPLY -->|跳转| WORKBENCH[→ 工作台打开该会话]
    UNANSWERED --> CLICK_ALL1[点击「全部处理」]
    CLICK_ALL1 -->|跳转| WORKBENCH
    
    %% 超时预警
    THREE_COLS -->|第二栏| TIMEOUT[超时预警列表<br/>🔴 已超时 / 🟠 即将超时]
    TIMEOUT --> ACTIONS_TIMEOUT{按严重程度}
    ACTIONS_TIMEOUT -->|已超时| ACCEPT[点击「立即接入」]
    ACTIONS_TIMEOUT -->|即将超时| FOLLOW[点击「跟进」或「回复」]
    ACTIONS_TIMEOUT -->|排队超时| QUEUE_ACTION[点击「转接」或「接入」]
    TIMEOUT --> RULES[点击「设置规则」]
    RULES -->|跳转| SETTINGS[→ 系统设置]
    
    %% 待评价催办
    THREE_COLS -->|第三栏| EVAL[待评价会话列表]
    EVAL --> NUDGE[点击「催评价」]
    NUDGE -->|触发| USER_RATING[用户端弹出评价弹窗]
    EVAL --> CLOSE_EVAL[点击「关闭」]
    EVAL --> BATCH_NUDGE[点击「一键催评价全部」]
    EVAL --> VIEW_ALL[点击「查看全部」]
    VIEW_ALL -->|跳转| RATING_PAGE[→ 评价管理页]
    
    style ENTER fill:#909399,color:#fff
    style WORKBENCH fill:#409eff,color:#fff
    style SETTINGS fill:#e6a23c,color:#fff
    style RATING_PAGE fill:#e6a23c,color:#fff
```

---

### 5. 历史会话

**文件**：`admin/admin-session-list.html`  
**功能**：多维度筛选历史会话记录，支持导出

```mermaid
flowchart TD
    ENTER([进入历史会话页]) --> STATS[
        1,284 总会话<br/>
        47 进行中<br/>
        1,128 已结束<br/>
        109 已转接
    ]
    
    STATS --> FILTER[设置筛选条件]
    FILTER --> FILTER_BAR[
        日期范围 + 客服筛选<br/>
        + 关键词搜索
    ]
    FILTER_BAR --> CLICK_QUERY[点击「查询」]
    CLICK_QUERY --> RESULTS[表格刷新显示结果]
    
    FILTER_BAR --> CLICK_RESET[点击「重置」]
    CLICK_RESET --> CLEAR[清空所有筛选条件]
    
    RESULTS --> STATUS_TAB{状态Tab切换}
    STATUS_TAB -->|全部 1,284| ALL
    STATUS_TAB -->|进行中 47| ACTIVE
    STATUS_TAB -->|已结束 1,128| CLOSED
    STATUS_TAB -->|已转接 109| TRANSFERRED
    
    RESULTS --> ROW_ACTION{行操作}
    ROW_ACTION -->|点击「详情」| DETAIL[查看会话完整聊天记录]
    ROW_ACTION -->|点击「转接记录」| TRANS_LOG[查看转接历史]
    ROW_ACTION -->|点击「查看评价」| EVAL_DETAIL[查看用户评价详情]
    ROW_ACTION -->|点击「差评追踪」| BAD_TRACK[发起差评跟进流程]
    
    RESULTS --> EXPORT[点击「导出记录」]
    RESULTS --> REFRESH[点击「刷新数据」]
    RESULTS --> PAGE[翻页操作]
    
    style ENTER fill:#909399,color:#fff
    style DETAIL fill:#67c23a,color:#fff
    style BAD_TRACK fill:#f56c6c,color:#fff
```

---

### 6. 客户信息

**文件**：`admin/admin-customer-info.html`  
**功能**：360° 客户画像 — 基础信息 / 行为轨迹 / 交易记录 / 服务历史

```mermaid
flowchart TD
    ENTER([进入客户详情页]) --> HEADER[
        客户头像 + 姓名 + 会员等级<br/>
        发消息 | 建工单 | 加标签
    ]
    
    HEADER --> HEADER_ACTION{头部操作}
    HEADER_ACTION -->|点击「发消息」| SEND_MSG[发送快捷消息]
    HEADER_ACTION -->|点击「建工单」| CREATE_TICKET[创建工单]
    HEADER_ACTION -->|点击「加标签」| ADD_TAG[添加客户标签]
    HEADER_ACTION -->|点击「返回工作台」| BACK_WB[→ 工作台]
    
    ENTER --> TAB_SWITCH{信息Tab切换}
    TAB_SWITCH -->|基础信息| BASIC[
        个人资料 → 编辑<br/>
        会员信息 → 只读<br/>
        联系方式 → 只读<br/>
        客户标签 → 管理
    ]
    TAB_SWITCH -->|行为轨迹 28| BEHAVIOR[
        近7天浏览记录<br/>
        访问12次 / 停留3.2h<br/>
        加购/收藏列表
    ]
    TAB_SWITCH -->|交易记录 15| TRADE[
        28笔订单 / 消费8.6k<br/>
        订单列表（含状态标签）<br/>
        点击「详情」 → 订单详情
    ]
    TAB_SWITCH -->|服务历史 6| SERVICE[
        16次咨询 / 本月3次<br/>
        满意度 4.8/5.0<br/>
        历史咨询记录
    ]
    
    BASIC -->|点击「编辑」| EDIT_PROFILE[编辑个人资料（需权限）]
    BASIC -->|点击「管理」| MANAGE_TAG[管理客户标签]
    TRADE -->|点击「加载更多」| LOAD_MORE[加载更多订单]
    TRADE -->|点击「详情」| ORDER_DETAIL[查看订单详情（OMS）]
    
    style ENTER fill:#909399,color:#fff
    style BACK_WB fill:#409eff,color:#fff
```

---

### 7. 会话转接

**文件**：`admin/admin-transfer.html`  
**功能**：管理转接记录 + 在线客服负载面板 + 选择转接目标

```mermaid
flowchart TD
    ENTER([进入转接页]) --> STATS[
        326 累计转接<br/>
        4 待处理<br/>
        312 已完成<br/>
        10 已拒绝<br/>
        95.7% 成功率
    ]
    
    STATS --> TWO_COLS{双栏布局}
    
    %% 左栏：转接记录
    TWO_COLS -->|左栏| LEFT[转接记录表格]
    LEFT --> FILTER[筛选：日期/原客服/目标客服/原因]
    FILTER --> STATUS_TAB{状态Tab}
    STATUS_TAB -->|全部 326| ALL_REC
    STATUS_TAB -->|待处理 4| PENDING
    STATUS_TAB -->|已接受 312| ACCEPTED
    STATUS_TAB -->|已拒绝 10| REJECTED
    
    PENDING -->|催办| URGE[发送催办通知]
    PENDING -->|取消| CANCEL[取消转接请求]
    
    ACCEPTED -->|查看会话| VIEW_SESSION[跳转 → 会话详情]
    
    REJECTED -->|重新转接| RETRY[重新发起转接]
    
    LEFT -->|点击「详情」| TRANS_DETAIL[查看转接详情]
    LEFT -->|点击「导出记录」| EXPORT[导出记录文件]
    
    %% 右栏：在线客服
    TWO_COLS -->|右栏| RIGHT[在线客服面板]
    RIGHT --> SORT{排序方式}
    SORT -->|按负载| BY_LOAD[按当前接待量排序]
    SORT -->|按技能| BY_SKILL[按技能标签排序]
    SORT -->|按评分| BY_RATING[按满意度评分排序]
    
    RIGHT --> AGENT_CARD[客服卡片<br/>容量条 + 当前会话数 + 评分]
    AGENT_CARD -->|点击「选为目标」| SELECT[高亮选中该客服]
    SELECT -->|客服满载| FULL[显示「无法转接」]
    SELECT -->|客服有空| AVAILABLE[显示「选为目标」]
    AVAILABLE --> CONFIRM[点击「确认转接至 XX」]
    CONFIRM -->|发送转接请求| NOTIFY[通知目标客服]
    
    style ENTER fill:#909399,color:#fff
    style CONFIRM fill:#67c23a,color:#fff
    style FULL fill:#f56c6c,color:#fff
```

---

### 8. 知识库管理

**文件**：`admin/admin-knowledge.html`  
**功能**：FAQ 文章管理 + 快捷回复模板管理 + 富文本编辑器

```mermaid
flowchart TD
    ENTER([进入知识库页]) --> TOP_TAB{顶级Tab}
    
    %% 知识库Tab
    TOP_TAB -->|知识库| KB_TAB[知识库管理]
    KB_TAB --> KB_STATS[128篇文章 / 5个分类 / 1,847月浏览]
    
    KB_TAB --> KB_TREE[左侧：分类树<br/>全部文章 / 订单 / 退换货 / 支付 / 物流 / 账户]
    KB_TREE --> CLICK_NODE[点击分类节点]
    CLICK_NODE --> FILTER_ARTICLES[右侧文章列表按分类筛选]
    
    KB_TAB --> KB_TOOLBAR[工具栏：搜索 + 分类 + 状态 + 排序]
    KB_TOOLBAR --> CLICK_QUERY1[点击「查询」]
    CLICK_QUERY1 --> FILTERED_LIST[显示筛选后的文章列表]
    
    KB_TAB --> CLICK_NEW[点击「+ 新建文章」]
    CLICK_NEW --> OPEN_EDITOR[展开富文本编辑器]
    OPEN_EDITOR --> EDIT_TOOLBAR[
        工具栏：B I U S | 标题<br/>
        OL UL | 链接 图片<br/>
        对齐 | 代码块
    ]
    EDIT_TOOLBAR --> EDIT_CONTENT[编辑内容区 contenteditable]
    EDIT_CONTENT --> SAVE_ARTICLE[点击「保存」]
    
    FILTERED_LIST --> ROW_ACTION{文章行操作}
    ROW_ACTION -->|已发布| PUB_ACTION[预览 | 编辑 | 下线 | 删除]
    ROW_ACTION -->|草稿| DRAFT_ACTION[编辑 | 发布 | 删除]
    ROW_ACTION -->|待审核| REVIEW_ACTION[预览 | 编辑 | 审核 | 删除]
    ROW_ACTION -->|已下线| OFFLINE_ACTION[预览 | 编辑 | 上线 | 删除]
    
    PUB_ACTION -->|点击「编辑」| OPEN_EDITOR
    DRAFT_ACTION -->|点击「编辑」| OPEN_EDITOR
    
    %% 快捷回复Tab
    TOP_TAB -->|快捷回复 86| QR_TAB[快捷回复管理]
    QR_TAB --> QR_FILTER[搜索 + 分类（通用/问候/售前/售后/投诉/物流）+ 状态]
    QR_FILTER --> QR_TABLE[快捷回复表格<br/>10条模板 / 86条总计]
    
    QR_TABLE --> QR_ROW{行操作}
    QR_ROW -->|编辑| QR_EDIT[编辑快捷回复]
    QR_ROW -->|停用/启用| QR_TOGGLE[切换状态]
    QR_ROW -->|删除| QR_DELETE[删除确认]
    
    QR_TAB --> CLICK_ADD_QR[点击「+ 新增快捷回复」]
    CLICK_ADD_QR --> QR_MODAL[弹出新增弹窗]
    QR_MODAL --> FILL_FORM[填写：内容 + 分类 + 排序 + 状态]
    FILL_FORM --> CLICK_CONFIRM[点击「确定」]
    CLICK_CONFIRM --> CLOSE_MODAL[关闭弹窗，列表刷新]
    
    style ENTER fill:#909399,color:#fff
    style SAVE_ARTICLE fill:#67c23a,color:#fff
    style CLICK_CONFIRM fill:#67c23a,color:#fff
```

---

### 9. 话术库

**文件**：`admin/admin-scripts.html`  
**功能**：话术管理 — 双维度分类（场景标签 × 业务分类）

```mermaid
flowchart TD
    ENTER([进入话术库页]) --> STATS[
        48 条话术<br/>
        4 个业务分类<br/>
        2,136 累计使用
    ]
    
    STATS --> DOUBLE_FILTER[双维度筛选]
    
    %% 场景筛选
    DOUBLE_FILTER --> SCENE[场景标签筛选]
    SCENE --> SCENE_CLICK{点击场景标签}
    SCENE_CLICK -->|全部 48| ALL_SCENE
    SCENE_CLICK -->|进入会话 15| ENTER_SCENE
    SCENE_CLICK -->|客服离线 9| OFFLINE_SCENE
    SCENE_CLICK -->|关键词匹配 16| KEYWORD_SCENE
    SCENE_CLICK -->|转人工 8| TRANSFER_SCENE
    
    %% 业务分类筛选
    DOUBLE_FILTER --> BIZ[业务分类筛选]
    BIZ --> BIZ_CLICK{点击业务标签}
    BIZ_CLICK -->|全部 48| ALL_BIZ
    BIZ_CLICK -->|售前 12| PRESALE
    BIZ_CLICK -->|售后 18| AFTERSALE
    BIZ_CLICK -->|投诉 8| COMPLAINT
    BIZ_CLICK -->|通用 10| GENERAL
    
    SCENE_CLICK --> APPLY[组合筛选 AND 逻辑]
    BIZ_CLICK --> APPLY
    APPLY --> FILTERED[显示符合双条件的话术列表]
    
    FILTERED --> SCRIPT_ITEM{点击话术条目}
    SCRIPT_ITEM --> EXPAND[展开详情<br/>触发场景 / 关键词 / 使用效果]
    SCRIPT_ITEM --> COPY[点击「复制」 → 复制内容]
    SCRIPT_ITEM --> EDIT_SCRIPT[点击「编辑」 → 填入右侧表单]
    
    %% 右侧新建表单
    ENTER --> NEW_FORM[右侧：新建话术表单]
    NEW_FORM --> FILL_CONTENT[填写话术内容<br/>支持变量 {用户昵称} {订单号}]
    FILL_CONTENT --> SELECT_SCENE[选择场景标签]
    SELECT_SCENE -->|关键词匹配| SHOW_KEYWORD[显示「触发关键词」输入框]
    SELECT_SCENE -->|其他场景| HIDE_KEYWORD[隐藏关键词输入]
    FILL_CONTENT --> SELECT_BIZ[选择业务分类<br/>售前 / 售后 / 投诉 / 通用]
    FILL_CONTENT --> CLICK_SAVE[点击「保存话术」]
    CLICK_SAVE --> CREATED[新话术创建成功]
    
    style ENTER fill:#909399,color:#fff
    style CREATED fill:#67c23a,color:#fff
```

---

### 10. 评价管理

**文件**：`admin/admin-rating-mgmt.html`  
**功能**：评价列表 + 满意度分布 + 客服排名 + 差评追踪

```mermaid
flowchart TD
    ENTER([进入评价管理页]) --> TOP_METRICS[
        平均满意度 4.6<br/>
        总评价 1,083<br/>
        差评 42
    ]
    
    TOP_METRICS --> DIST[满意度分布图<br/>5星 62% / 4星 24% / 3星 10% / 2星 2.6% / 1星 1.3%]
    DIST --> AGENT_RANK[客服满意度排名表]
    
    ENTER --> FILTER[筛选条件]
    FILTER --> FILTER_BAR[日期范围 + 客服 + 评分范围 + 关键词]
    FILTER --> CLICK_QUERY[点击「查询」]
    
    ENTER --> STATUS_TAB{状态Tab}
    STATUS_TAB -->|全部评价 1,083| ALL_RATING
    STATUS_TAB -->|好评 ≥4星 931| POSITIVE
    STATUS_TAB -->|中评 3星 110| NEUTRAL
    STATUS_TAB -->|差评 ≤2星 42| NEGATIVE
    
    ALL_RATING --> TABLE[评价数据表格]
    POSITIVE --> TABLE
    NEUTRAL --> TABLE
    NEGATIVE --> TABLE
    
    TABLE --> ROW_ACTION{行操作}
    ROW_ACTION -->|普通评价| NORMAL_ACTION[详情 | 查看会话]
    ROW_ACTION -->|差评行 黄色高亮| BAD_ACTION[详情 | 查看会话 | 差评追踪]
    
    BAD_ACTION -->|差评追踪| TRACK[发起差评跟进流程<br/>分配跟进任务 → 记录处理结果]
    
    ENTER --> EXPORT[导出评价数据]
    ENTER --> REFRESH[刷新统计数据]
    
    style ENTER fill:#909399,color:#fff
    style TRACK fill:#f56c6c,color:#fff
```

---

### 11. 系统设置

**文件**：`admin/admin-settings.html`  
**功能**：5 大配置模块 — 欢迎语 / 离线语 / 路由规则 / 会话超时 / 敏感词

```mermaid
flowchart TD
    ENTER([进入系统设置页]) --> ANCHOR[锚点导航栏<br/>欢迎语 | 离线语 | 路由规则 | 会话超时 | 敏感词]
    
    ANCHOR --> SECTION{选择配置模块}
    
    %% 欢迎语
    SECTION -->|欢迎语| WELCOME[
        编辑欢迎语文本<br/>
        选择推送时机<br/>
        进入会话立即 / 客服接入后 / 不推送
        预览效果
    ]
    
    %% 离线语
    SECTION -->|离线语| OFFLINE[
        编辑离线提示文本<br/>
        开关：允许用户留言<br/>
        通知方式：站内/短信/企微
        预览效果
    ]
    
    %% 路由规则
    SECTION -->|路由规则| ROUTING[
        开关：自动接入<br/>
        分流策略：轮询 / 按空闲度 / 按优先级<br/>
        客服容量上限<br/>
        排队超时转人工<br/>
        关键词转人工 + 关键词管理
    ]
    
    %% 会话超时
    SECTION -->|会话超时| TIMEOUT[
        用户无响应超时 15分钟<br/>
        自动关闭时间 30分钟<br/>
        超时提醒文案<br/>
        扫描频率<br/>
        开关：允许用户重新发起
    ]
    
    %% 敏感词
    SECTION -->|敏感词| SENSITIVE[
        开关：全局过滤<br/>
        处理策略：替换 / 拦截 / 仅记录<br/>
        4个词组分类管理<br/>
        添加/删除敏感词<br/>
        批量导入 / 导出词库
    ]
    
    WELCOME --> FOOTER
    OFFLINE --> FOOTER
    ROUTING --> FOOTER
    TIMEOUT --> FOOTER
    SENSITIVE --> FOOTER
    
    FOOTER[底部操作栏] -->|保存设置| SAVE[保存所有配置]
    FOOTER -->|取消| CANCEL[放弃修改]
    FOOTER -->|重置默认| RESET[恢复默认值]
    
    style ENTER fill:#909399,color:#fff
    style SAVE fill:#67c23a,color:#fff
    style RESET fill:#e6a23c,color:#fff
```

---

### 12. 留言管理

**文件**：`admin/admin-leave-mgmt.html`  
**功能**：离线留言全生命周期管理 — 待处理 → 分配 → 回复 → 已回复

```mermaid
flowchart TD
    ENTER([进入留言管理页]) --> STATS[
        7 待处理<br/>
        4 处理中<br/>
        23 已回复<br/>
        2 无效
    ]
    
    STATS --> STATUS_TAB{状态Tab}
    STATUS_TAB -->|全部 36| ALL_MSG
    STATUS_TAB -->|待处理 7| PENDING_MSG
    STATUS_TAB -->|处理中 4| IN_PROGRESS
    STATUS_TAB -->|已回复 23| REPLIED
    STATUS_TAB -->|无效 2| INVALID
    
    ALL_MSG --> TABLE[留言数据表格]
    PENDING_MSG --> TABLE
    IN_PROGRESS --> TABLE
    REPLIED --> TABLE
    INVALID --> TABLE
    
    TABLE --> FILTER[筛选：搜索 + 问题分类 + 处理人 + 时间]
    TABLE --> ROW_ACTION{行操作}
    
    %% 待处理行
    ROW_ACTION -->|待处理行| PENDING_ACTION{操作}
    PENDING_ACTION -->|点击「分配」| ASSIGN_DRAWER[打开分配抽屉]
    PENDING_ACTION -->|点击「回复」| REPLY_DRAWER[打开回复抽屉]
    
    %% 分配抽屉
    ASSIGN_DRAWER --> ASSIGN_FORM[
        查看留言摘要<br/>
        选择处理人<br/>
        选择优先级 普通/紧急/非常紧急<br/>
        填写分配说明
    ]
    ASSIGN_FORM --> CONFIRM_ASSIGN[点击「确认分配」]
    CONFIRM_ASSIGN -->|状态变更| TO_IN_PROGRESS[留言 → 处理中]
    
    %% 回复抽屉
    REPLY_DRAWER --> REPLY_FORM[
        查看留言摘要<br/>
        选择回复模板 → 自动填充<br/>
        编辑回复内容<br/>
        通知方式：站内/短信/微信<br/>
        处理结果：已解决/待跟进/需转人工
    ]
    REPLY_FORM --> SEND_REPLY[点击「发送回复」]
    SEND_REPLY -->|状态变更| TO_REPLIED[留言 → 已回复]
    
    %% 已回复/无效行
    ROW_ACTION -->|已回复行| VIEW_REPLY[点击「查看回复」]
    ROW_ACTION -->|无效行| VIEW_INVALID[点击「查看回复」]
    
    style ENTER fill:#909399,color:#fff
    style CONFIRM_ASSIGN fill:#67c23a,color:#fff
    style SEND_REPLY fill:#67c23a,color:#fff
```

---

### 13. 机器人配置

**文件**：`admin/ai-bot-config.html`  
**分期**：3期  
**功能**：可视化对话流设计 + 意图管理 + 知识库关联 + 测试对话

```mermaid
flowchart TD
    ENTER([进入机器人配置页]) --> STATUS_CARD[
        小C智能客服 状态开关<br/>
        意图识别 92.6%<br/>
        独立解决 85.3%
    ]
    
    STATUS_CARD --> MAIN_TAB{主Tab切换}
    
    %% 流程设计
    MAIN_TAB -->|流程设计| FLOW[对话流设计器]
    FLOW --> PALETTE[左侧：6种节点拖入画布<br/>触发器/意图识别/条件分支/AI回复/调用动作/转人工]
    FLOW --> CANVAS[右侧：画布<br/>节点连线 + 编辑]
    FLOW --> TOOLBAR[工具栏：撤销/重做/自动布局/缩放/全屏]
    FLOW --> TEMPLATE[3个流程模板<br/>售前咨询 / 售后退换货 / 支付问题]
    
    CANVAS --> NODE_FLOW[
        触发器 → 意图识别 → 条件分支<br/>
        高置信度 → AI回复 → 调用动作<br/>
        低置信度 → 转人工
    ]
    
    %% 意图管理
    MAIN_TAB -->|意图管理 24| INTENT[意图管理表格]
    INTENT --> INTENT_ROW[7个意图行<br/>名称 / 训练短语 / 知识库 / 置信度 / 状态]
    INTENT_ROW --> INTENT_ACTION{行操作}
    INTENT_ACTION -->|编辑| EDIT_INTENT[编辑意图配置]
    INTENT_ACTION -->|训练| TRAIN[触发模型训练]
    INTENT_ACTION -->|测试| TEST_INTENT[跳转测试面板]
    INTENT_ACTION -->|停用| DISABLE[停用意图]
    INTENT --> BATCH_TRAIN[批量训练]
    INTENT --> NEW_INTENT[新建意图]
    
    %% 知识库关联
    MAIN_TAB -->|知识库关联 6| KB_ASSOC[知识库开关面板]
    KB_ASSOC --> KB_TOGGLE[6个知识库卡片<br/>每个可独立开关]
    KB_ASSOC --> LINK_NEW[关联新知识库]
    
    %% 测试对话
    MAIN_TAB -->|测试对话| TEST_PANEL[测试对话面板]
    TEST_PANEL --> TEST_CHAT[左侧：模拟对话窗口]
    TEST_PANEL --> INSPECTOR[右侧：检测面板<br/>命中意图 / 置信度 / 引用知识库 / 执行链路]
    TEST_CHAT --> SEND_TEST[输入测试消息]
    SEND_TEST --> BOT_REPLY[机器人回复 + 意图追踪]
    
    style ENTER fill:#909399,color:#fff
    style NODE_FLOW fill:#722ed1,color:#fff
    style BOT_REPLY fill:#722ed1,color:#fff
```

---

### 14. 智能质检

**文件**：`admin/ai-quality.html`  
**分期**：3期  
**功能**：AI 自动质检评分 + 规则配置 + 问题会话标记

```mermaid
flowchart TD
    ENTER([进入智能质检页]) --> TOP_METRICS[
        综合评分 92.4<br/>
        已质检 8,642<br/>
        问题会话 187<br/>
        通过率 97.8%
    ]
    
    TOP_METRICS --> SCORE_BREAKDOWN[
        维度评分<br/>
        服务态度 95 / 响应时效 88<br/>
        话术规范 96 / 问题解决率 90
    ]
    
    SCORE_BREAKDOWN --> PROBLEM_TYPE[问题类型分布<br/>服务态度 31% / 响应超时 24% / 敏感词 14%]
    
    ENTER --> RULES[质检规则配置]
    RULES --> RULE_TOGGLE{6条规则开关}
    RULE_TOGGLE --> R1[服务态度检测 30%]
    RULE_TOGGLE --> R2[首响响应时效 25%]
    RULE_TOGGLE --> R3[违规敏感词 20% 红线规则]
    RULE_TOGGLE --> R4[问题解决率 15%]
    RULE_TOGGLE --> R5[话术规范 10%]
    RULE_TOGGLE --> R6[承诺兑现 0% 实验中]
    
    ENTER --> FILTER[筛选条件<br/>日期 + 客服 + 问题类型 + 分数段]
    FILTER --> SCORE_RANGE{分数段筛选}
    SCORE_RANGE -->|优秀 ≥90| EXCELLENT
    SCORE_RANGE -->|合格 80-89| PASS
    SCORE_RANGE -->|预警 60-79| WARN
    SCORE_RANGE -->|不合格 <60| FAIL
    
    FILTER --> RESULTS[质检结果表格]
    RESULTS --> ROW_ACTION{行操作}
    ROW_ACTION -->|普通行| NORMAL[查看会话 | 质检详情]
    ROW_ACTION -->|标红行 不合格| FLAGGED[查看会话 | 质检详情 | 发起复检]
    
    ENTER --> EXPORT[导出质检报告]
    ENTER --> RUN[立即发起质检]
    
    style ENTER fill:#909399,color:#fff
    style FLAGGED fill:#f56c6c,color:#fff
    style RUN fill:#722ed1,color:#fff
```

---

### 15. 报表看板

**文件**：`admin/ai-report.html`  
**分期**：3期  
**功能**：综合运营数据 — 趋势图 + 排行 + 满意度 + 渠道 + AI解决率 + 热力图

```mermaid
flowchart TD
    ENTER([进入报表看板页]) --> PERIOD[选择时间范围<br/>本月 / 本周 / 今日 / 自定义]
    
    PERIOD --> TOP_METRICS[
        会话总量 38,642<br/>
        满意度 96.3%<br/>
        平均响应 38秒<br/>
        AI解决率 78%
    ]
    
    TOP_METRICS --> CHART_ROW1{图表行1}
    CHART_ROW1 --> TREND[会话量趋势折线图<br/>人工会话 + AI会话]
    CHART_ROW1 --> RANKING[客服绩效排行柱状图<br/>7位客服接待量]
    
    CHART_ROW1 --> CHART_ROW2{图表行2}
    CHART_ROW2 --> PIE[满意度分布饼图<br/>非常满意62% / 满意24%]
    CHART_ROW2 --> CHANNEL[渠道统计<br/>小程序42.5% / H5 29.9% / APP 17.9%]
    CHART_ROW2 --> AI_RATE[AI解决率仪表盘<br/>AI独立78% / 转人工18%]
    
    CHART_ROW2 --> CHART_ROW3{图表行3}
    CHART_ROW3 --> HEATMAP[会话时段热力图<br/>周一至周日 × 9:00-20:00]
    CHART_ROW3 --> KEYWORDS[热门咨询关键词<br/>退换货 / 物流查询 / 优惠券]
    
    ENTER --> DETAIL_TABLE[会话明细表格]
    DETAIL_TABLE --> TABLE_FILTER[筛选 + 翻页]
    DETAIL_TABLE --> EXPORT_CSV[导出 CSV]
    ENTER --> EXPORT[导出报表]
    
    style ENTER fill:#909399,color:#fff
    style EXPORT fill:#722ed1,color:#fff
```

---

## 三、用户端页面流程

### 16. 场景咨询入口

**文件**：`user/user-entry.html`  
**功能**：展示商城 9 个页面中客服入口的嵌入方式和悬浮窗组件

```mermaid
flowchart TD
    ENTER([用户浏览商城]) --> MALL_PAGES[
        9个页面场景<br/>
        首页 / 商品详情 / 订单详情<br/>
        购物车 / 帮助中心 / 个人中心<br/>
        物流详情 / 退换货 / 电话咨询
    ]
    
    MALL_PAGES --> CLICK_FAB[点击页面浮动客服按钮]
    CLICK_FAB --> TAG[System 读取 entry_tag + 上下文参数]
    
    TAG --> ENTRY_MAP{入口场景映射}
    ENTRY_MAP -->|home| HOME_CTX[通用咨询<br/>无额外参数]
    ENTRY_MAP -->|product| PROD_CTX[商品咨询<br/>product_id + name + price]
    ENTRY_MAP -->|order| ORDER_CTX[订单咨询<br/>order_id + status + amount]
    ENTRY_MAP -->|cart| CART_CTX[购物车咨询<br/>cart_items + total]
    ENTRY_MAP -->|logistics| LOG_CTX[物流咨询<br/>tracking_no + carrier]
    ENTRY_MAP -->|refund| REFUND_CTX[退换货咨询<br/>order_id + refund_type]
    ENTRY_MAP -->|phone| PHONE_CTX[电话呼叫 仅H5<br/>session_id]
    
    ENTRY_MAP -->|floating| FLOAT_CTX[悬浮窗组件<br/>自动检测当前页上下文]
    
    ALL_CTX[携带上下文参数] -->|跳转| USER_CHAT[→ user-chat.html]
    
    HOME_CTX --> ALL_CTX
    PROD_CTX --> ALL_CTX
    ORDER_CTX --> ALL_CTX
    CART_CTX --> ALL_CTX
    LOG_CTX --> ALL_CTX
    REFUND_CTX --> ALL_CTX
    PHONE_CTX --> ALL_CTX
    FLOAT_CTX --> ALL_CTX
    
    style ENTER fill:#909399,color:#fff
    style USER_CHAT fill:#409eff,color:#fff
```

---

### 17. 聊天主界面

**文件**：`user/user-chat.html`  
**功能**：用户端核心聊天页 — 文字/图片/语音/卡片消息 + 历史会话 + 评价

```mermaid
flowchart TD
    ENTER([进入聊天页]) --> CHECK_AGENT{检测客服状态}
    
    CHECK_AGENT -->|客服在线| ONLINE[显示聊天界面<br/>状态：在线]
    CHECK_AGENT -->|客服离线| OFFLINE[→ user-offline.html]
    
    ONLINE --> CHAT{聊天操作}
    
    %% 发送消息
    CHAT -->|发送文本| INPUT[输入框输入文字]
    INPUT -->|Enter| SEND_TEXT[发送文字消息]
    
    CHAT -->|发送图片| IMG_BTN[点击图片按钮]
    IMG_BTN --> SEND_IMG[发送图片消息]
    
    CHAT -->|发送语音| MIC_BTN[点击麦克风按钮]
    MIC_BTN --> SEND_VOICE[发送语音消息 + 波形]
    
    CHAT -->|更多附件| MORE_BTN[点击「+」按钮]
    MORE_BTN --> MORE_PANEL[展开更多面板<br/>相册/视频/文件/位置/名片/电话]
    MORE_BTN -->|再次点击| CLOSE_PANEL[收起面板]
    
    %% 查看卡片
    CHAT -->|收到订单卡片| VIEW_ORDER[查看订单卡片<br/>订单号 + 商品 + 状态 + 金额]
    VIEW_ORDER -->|点击查看详情| ORDER_DETAIL[→ 订单详情页]
    
    CHAT -->|收到商品卡片| VIEW_PRODUCT[查看商品卡片<br/>图片 + 名称 + 价格]
    VIEW_PRODUCT -->|点击查看商品| PRODUCT_DETAIL[→ 商品详情页]
    
    CHAT -->|收到优惠券| VIEW_COUPON[查看优惠券卡片<br/>面值 + 门槛 + 有效期]
    VIEW_COUPON -->|点击领取| CLAIM_COUPON[领取优惠券]
    
    %% 历史会话
    CHAT -->|点击时钟图标| HISTORY_BTN[打开历史面板]
    HISTORY_BTN --> HISTORY_PANEL[右侧滑出面板<br/>6条历史会话]
    HISTORY_PANEL --> HISTORY_ITEM[
        日期 + 客服名 + 最后消息<br/>
        状态标签：已结束 / 已评价
    ]
    HISTORY_PANEL -->|点击X或背景| CLOSE_HISTORY[关闭面板]
    HISTORY_PANEL -->|点击「查看全部」| VIEW_ALL[查看全部历史]
    
    %% 会话结束 → 评价
    ONLINE -->|会话结束| END_DIVIDER[系统提示：会话即将结束]
    END_DIVIDER --> RATING_CARD[收到评价卡片<br/>5星 + 4个印象标签]
    RATING_CARD --> CLICK_STAR[点击评分]
    CLICK_STAR --> CLICK_TAGS[选择印象标签]
    CLICK_TAGS --> SUBMIT_RATING[点击「提交评价」]
    
    END_DIVIDER --> FULL_RATING[→ user-rating.html 全面评价弹窗]
    
    style ENTER fill:#909399,color:#fff
    style OFFLINE fill:#f56c6c,color:#fff
    style SEND_TEXT fill:#67c23a,color:#fff
    style FULL_RATING fill:#e6a23c,color:#fff
```

---

### 18. FAQ 常见问题

**文件**：`user/user-faq.html`  
**功能**：常见问题自助 + 图文服务指南

```mermaid
flowchart TD
    ENTER([进入FAQ页]) --> TOP_TAB{顶级Tab切换}
    
    %% 常见问题Tab
    TOP_TAB -->|常见问题| FAQ_PANEL[FAQ列表]
    FAQ_PANEL --> SEARCH[搜索框输入关键词]
    FAQ_PANEL --> CAT_TAB{分类Tab}
    CAT_TAB -->|全部| ALL_FAQ[显示全部9条FAQ]
    CAT_TAB -->|订单问题| ORDER_FAQ[按分类筛选]
    CAT_TAB -->|退换货| REFUND_FAQ[按分类筛选]
    CAT_TAB -->|支付| PAY_FAQ[按分类筛选]
    CAT_TAB -->|物流| SHIP_FAQ[按分类筛选]
    
    ALL_FAQ --> CLICK_FAQ[点击一条FAQ问题]
    CLICK_FAQ --> EXPAND[展开答案 手风琴模式]
    EXPAND --> HELPFUL{有帮助?}
    HELPFUL -->|点击「有用」| THUMBS_UP[标记有用]
    HELPFUL -->|点击「没用」| THUMBS_DOWN[标记没用]
    
    FAQ_PANEL --> SOLVED{问题已解决?}
    SOLVED -->|是| SELF_SERVE[用户自助解决，离开]
    SOLVED -->|否| TO_HUMAN[点击「转人工客服 ›」]
    TO_HUMAN -->|跳转| USER_CHAT[→ user-chat.html]
    
    %% 服务指南Tab
    TOP_TAB -->|服务指南| GUIDE_PANEL[图文服务指南]
    GUIDE_PANEL --> GUIDE_1[退换货流程<br/>4步：申请→审核→寄回→退款]
    GUIDE_PANEL --> GUIDE_2[支付方式说明<br/>微信/支付宝/银行卡]
    GUIDE_PANEL --> GUIDE_3[配送说明<br/>标准3-5天/加急1-2天/自提]
    GUIDE_PANEL --> GUIDE_4[发票政策<br/>电子发票/增值税发票]
    
    GUIDE_1 --> GUIDE_MORE[点击「了解更多」]
    GUIDE_2 --> GUIDE_MORE
    GUIDE_3 --> GUIDE_MORE
    GUIDE_4 --> GUIDE_MORE
    
    GUIDE_PANEL --> CONTACT_CS[点击「联系在线客服 ›」]
    CONTACT_CS -->|跳转| USER_CHAT
    
    style ENTER fill:#909399,color:#fff
    style SELF_SERVE fill:#67c23a,color:#fff
    style USER_CHAT fill:#409eff,color:#fff
```

---

### 19. 离线留言

**文件**：`user/user-offline.html`  
**功能**：客服离线时的留言提交表单

```mermaid
flowchart TD
    ENTER([客服离线 → 显示离线页]) --> BANNER[离线横幅<br/>客服已离线 + 工作时间]
    
    BANNER --> FORM[留言提交表单]
    FORM --> NAME[输入称呼 必填]
    FORM --> CONTACT_TYPE{选择联系方式}
    
    CONTACT_TYPE -->|手机| PHONE_INPUT[输入手机号<br/>placeholder: 请输入手机号码]
    CONTACT_TYPE -->|微信| WECHAT_INPUT[输入微信号<br/>placeholder: 请输入微信号]
    CONTACT_TYPE -->|邮箱| EMAIL_INPUT[输入邮箱地址<br/>placeholder: 请输入邮箱地址]
    
    PHONE_INPUT --> MESSAGE[输入留言内容 必填]
    WECHAT_INPUT --> MESSAGE
    EMAIL_INPUT --> MESSAGE
    
    MESSAGE --> SUBMIT[点击「提交留言」]
    
    SUBMIT --> VALIDATE{表单校验}
    VALIDATE -->|称呼为空| ERR_NAME[弹出：请输入您的称呼]
    ERR_NAME --> NAME
    
    VALIDATE -->|联系方式为空| ERR_CONTACT[弹出：请输入联系方式]
    ERR_CONTACT --> CONTACT_TYPE
    
    VALIDATE -->|留言为空| ERR_MSG[弹出：请输入留言内容]
    ERR_MSG --> MESSAGE
    
    VALIDATE -->|全部通过| SUCCESS[
        ✅ 留言成功<br/>
        留言编号 #LM20260611-0042<br/>
        预计回复：客服上线后30分钟内
    ]
    
    SUCCESS --> CLICK_BACK[点击「返回」]
    CLICK_BACK --> RESET[重置表单 → 返回表单页]
    
    style ENTER fill:#909399,color:#fff
    style ERR_NAME fill:#f56c6c,color:#fff
    style ERR_CONTACT fill:#f56c6c,color:#fff
    style ERR_MSG fill:#f56c6c,color:#fff
    style SUCCESS fill:#67c23a,color:#fff
```

---

### 20. 服务评价

**文件**：`user/user-rating.html`  
**功能**：会话结束后的多维度评价弹窗

```mermaid
flowchart TD
    ENTER([会话结束 → 弹出评价弹窗]) --> RATING_FORM[评价表单]
    
    %% 星级评分
    RATING_FORM --> DIMENSIONS[4个维度评分]
    DIMENSIONS --> D1[服务态度 ★★★★★]
    DIMENSIONS --> D2[响应速度 ★★★★★]
    DIMENSIONS --> D3[专业能力 ★★★★★]
    DIMENSIONS --> D4[解决问题能力 ★★★★★]
    
    D1 --> CLICK_STAR[点击星星 → 填充至点击位置]
    D2 --> CLICK_STAR
    D3 --> CLICK_STAR
    D4 --> CLICK_STAR
    
    %% 印象标签
    RATING_FORM --> TAGS[服务印象标签<br/>10个标签多选]
    TAGS --> TAG_CLICK[点击标签 → 切换选中状态]
    TAG_CLICK --> POSITIVE_TAGS[正向标签：态度热情 / 响应及时 / 专业 / 耐心]
    TAG_CLICK --> NEGATIVE_TAGS[负向标签：回复慢 / 态度一般 / 未解决]
    
    %% 文字评价
    RATING_FORM --> COMMENT[补充评价 选填<br/>textarea 最多200字]
    COMMENT --> CHAR_COUNT[实时字数统计 N/200]
    
    %% 提交或跳过
    RATING_FORM --> SUBMIT_OR_SKIP{用户选择}
    SUBMIT_OR_SKIP -->|点击「提交评价」| SUBMIT[提交评价]
    SUBMIT --> SUCCESS[
        ✅ 评价提交成功<br/>
        感谢您的反馈，期待再次为您服务！
    ]
    
    SUBMIT_OR_SKIP -->|点击「跳过」| SKIP[关闭评价弹窗<br/>不记录评价]
    SKIP --> ENDED_CHAT[显示已结束的聊天页面<br/>输入框置灰：会话已结束]
    
    style ENTER fill:#909399,color:#fff
    style SUCCESS fill:#67c23a,color:#fff
    style SKIP fill:#909399,color:#fff
```

---

## 四、跨页面完整用户旅程

### 用户端完整旅程

```mermaid
flowchart TD
    START([用户浏览商城]) --> SCENE[
        9个场景入口<br/>
        首页/商品详情/订单详情/购物车<br/>
        /帮助中心/个人中心/物流详情<br/>
        /退换货/悬浮窗
    ]
    
    SCENE --> CLICK[点击「联系客服」按钮]
    CLICK --> PARAMS[携带 entry_tag + 上下文参数]
    
    PARAMS --> CHECK{检测客服在线状态}
    
    %% 在线路径
    CHECK -->|客服在线| CHAT[聊天主界面<br/>user-chat.html]
    
    CHAT --> CHAT_ACTIONS{聊天中操作}
    CHAT_ACTIONS -->|发送文字/图片/语音| SEND_MSG[发送消息]
    CHAT_ACTIONS -->|查看卡片| VIEW_CARD[订单/商品/优惠券卡片]
    CHAT_ACTIONS -->|查看历史| HISTORY[历史会话面板]
    CHAT_ACTIONS -->|需要自助| FAQ[→ FAQ页<br/>user-faq.html]
    
    %% FAQ分支
    FAQ --> FAQ_RESULT{FAQ解决问题?}
    FAQ_RESULT -->|是| EXIT_FAQ[用户自行离开]
    FAQ_RESULT -->|否| TO_HUMAN[点击「转人工客服」]
    TO_HUMAN --> CHAT
    
    %% 会话结束路径
    CHAT --> SESSION_END[会话结束]
    SESSION_END --> RATING[→ 服务评价页<br/>user-rating.html]
    
    RATING --> RATING_CHOICE{用户选择}
    RATING_CHOICE -->|提交评价| SUBMIT_OK[评价成功]
    RATING_CHOICE -->|跳过| SKIPPED[跳过评价]
    
    SUBMIT_OK --> END([返回商城])
    SKIPPED --> END
    
    %% 离线路径
    CHECK -->|客服离线| OFFLINE[→ 离线留言页<br/>user-offline.html]
    
    OFFLINE --> FILL_FORM[填写留言表单<br/>姓名 + 联系方式 + 留言]
    FILL_FORM --> VALIDATE{表单校验}
    VALIDATE -->|失败| FIX[修正输入]
    FIX --> FILL_FORM
    VALIDATE -->|通过| LEAVE_OK[留言提交成功<br/>留言编号 + 预计回复时间]
    LEAVE_OK --> END
    
    style START fill:#909399,color:#fff
    style CHAT fill:#409eff,color:#fff
    style FAQ fill:#67c23a,color:#fff
    style OFFLINE fill:#e6a23c,color:#fff
    style RATING fill:#f56c6c,color:#fff
    style END fill:#909399,color:#fff
```

### 管理端客服工作流

```mermaid
flowchart TD
    LOGIN([管理员登录<br/>admin-login.html]) --> DASH[数据仪表盘<br/>查看运营概览]
    
    DASH --> WB[客服工作台<br/>核心工作界面]
    
    %% 工作台日常操作
    WB --> DAILY{日常操作}
    
    DAILY -->|接待新会话| ACCEPT[接入会话]
    ACCEPT --> CHAT[在聊天窗回复用户]
    
    DAILY -->|使用快捷回复| QR[选择快捷回复模板]
    DAILY -->|撤回消息| RECALL[撤回已发送消息]
    DAILY -->|查看客户| CUSTOMER[右栏客户信息<br/>基础/行为/交易/服务]
    
    %% 会话流转
    CHAT --> NEED_TRANSFER{需要转接?}
    NEED_TRANSFER -->|是| TRANSFER[→ 会话转接页<br/>admin-transfer.html]
    TRANSFER --> SELECT_AGENT[选择目标客服]
    SELECT_AGENT --> CONFIRM_TRANSFER[确认转接]
    
    NEED_TRANSFER -->|否| CONTINUE[继续服务]
    
    CONTINUE --> SESSION_DONE{会话结束?}
    SESSION_DONE -->|是| CLOSE[关闭会话]
    SESSION_DONE -->|否| CHAT
    
    %% 待办事项
    DASH --> TODO[→ 待办事项<br/>admin-todo.html]
    TODO --> UNANSWERED[处理未回复消息]
    TODO --> TIMEOUT[处理超时预警]
    TODO --> EVAL_REMIND[催评价]
    
    UNANSWERED -->|点击回复| WB
    TIMEOUT -->|点击接入| WB
    
    %% 配置管理
    DASH --> CONFIG{配置管理}
    CONFIG -->|知识库| KB[知识库 + 快捷回复管理]
    CONFIG -->|话术库| SCRIPTS[话术库管理]
    CONFIG -->|系统设置| SETTINGS[欢迎语/离线语/路由/超时/敏感词]
    CONFIG -->|留言管理| LEAVE[留言分配与回复]
    
    %% 数据分析
    DASH --> ANALYSIS{数据分析}
    ANALYSIS -->|历史会话| SESSIONS[会话记录查询]
    ANALYSIS -->|评价管理| RATINGS[评价查看 + 差评追踪]
    ANALYSIS -->|报表| REPORTS[报表看板]
    ANALYSIS -->|质检| QUALITY[AI智能质检]
    
    %% AI 配置
    DASH --> AI[→ 机器人配置<br/>ai-bot-config.html]
    AI --> FLOW_DESIGN[对话流设计]
    AI --> INTENT[意图管理]
    AI --> KB_LINK[知识库关联]
    AI --> TEST[测试对话]
    
    style LOGIN fill:#f56c6c,color:#fff
    style WB fill:#409eff,color:#fff
    style DASH fill:#67c23a,color:#fff
    style TODO fill:#e6a23c,color:#fff
    style AI fill:#722ed1,color:#fff
```

---

> **文档结束**  
> 本文档覆盖全部 20 个原型页面，共包含 20 个 Mermaid 流程图 + 2 个跨页面旅程图。
> 如需编辑流程图，可使用支持 Mermaid 语法的 Markdown 编辑器（如 Typora、VS Code + Mermaid 插件、GitHub）渲染查看。
