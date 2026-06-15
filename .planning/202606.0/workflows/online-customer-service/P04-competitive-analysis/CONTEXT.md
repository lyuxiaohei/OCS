# P04 CONTEXT: 竞品分析

## 范围

- **项目**: CS 商城客服系统
- **里程碑**: 202606.0
- **工作流**: online-customer-service
- **阶段目标**: 对主流客服 SaaS 进行功能/体验/技术/商业四维度系统分析，生成竞品对比报告和差异化策略建议

## 上游引用

- **P01@V1.0**: `.planning/202606.0/workflows/online-customer-service/P01-requirement-research/`
- **P02@V1.0**: `.planning/202606.0/workflows/online-customer-service/P02-business-flow-chart/`

## 约束

- 排期硬性节点：开发 6/22 启动，V1.4 **8月底上线**
- 已有 MVP 基础（~12% 完成度）

---

## Locked Decisions（必须实现）

- **D-01: 分析主流客服 SaaS**
  - 原因: 用户选择分析主流竞品
  - 影响: 覆盖美洽、智齿、网易七鱼、容联七陌等主流客服 SaaS

- **D-02: 全维度分析**
  - 原因: 用户选择全部四个维度
  - 影响: 分析报告包含功能对比、体验评估、技术架构、商业模式四个章节

- **D-03: 输出格式为 Markdown**
  - 原因: 与 P01/P02 产出格式保持一致
  - 影响: 竞品报告以 Markdown 文件产出

## Claude's Discretion（自主判断）

- **CLD-01: 竞品数量**
  - 选择: 4-5 个主流竞品（美洽、智齿科技、网易七鱼、容联七陌、小微客服）
  - 理由: 覆盖头部 SaaS + 中小竞品，足以支撑差异化分析
