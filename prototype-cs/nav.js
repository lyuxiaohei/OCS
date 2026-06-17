/**
 * CS 商城客服系统 — 公共导航
 * 所有管理端页面共享此文件，确保侧边栏菜单统一。
 *
 * 使用方式：
 *   1. <aside class="admin-sidebar" id="sidebar-nav" data-active="dashboard"></aside>
 *   2. <script src="nav.js"></script>
 *
 * data-active 可选值见下方 MENU_DATA 中的 id 字段
 */

const MENU_DATA = [
  {
    group: '工作台',
    items: [
      { id: 'dashboard',  label: '数据仪表盘', href: 'admin-dashboard.html',    icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
      { id: 'workbench',  label: '客服工作台', href: 'admin-workbench.html',    icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
      { id: 'todo',        label: '待办事项',   href: 'admin-todo.html',          icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
    ]
  },
  {
    group: '服务管理',
    items: [
      { id: 'session-list', label: '历史会话', href: 'admin-session-list.html', icon: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' },
      { id: 'transfer',     label: '会话转接', href: 'admin-transfer.html',     icon: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>' },
      { id: 'rating',       label: '评价管理', href: 'admin-rating-mgmt.html',  icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
      { id: 'leave',        label: '留言管理', href: 'admin-leave-mgmt.html',   icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
    ]
  },
  {
    group: '配置',
    items: [
      { id: 'knowledge',   label: '知识库',   href: 'admin-knowledge.html',    icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' },
      { id: 'scripts',     label: '话术库',   href: 'admin-scripts.html',      icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
      { id: 'settings',    label: '系统设置', href: 'admin-settings.html',     icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09c-.658.003-1.25.396-1.51 1z"/>' },
    ]
  },
  // 以下 2/3 期分组已从 1 期侧边栏隐藏（详见 PRD V1.0 Out of Scope）：
  //   - 「配置 → 自动回复」(ai-bot-config.html, 3期)
  //   - 「AI 智能化」整组：机器人配置 / 质检分析 / 报表看板 (3期)
  //   - 「服务管理 → 工单系统」(2期，无原型)
  // 如需恢复，取消下方注释即可。
  // {
  //   group: '配置',
  //   items: [
  //     { id: 'auto-reply',  label: '自动回复', href: 'ai-bot-config.html', icon: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  //   ]
  // },
  // {
  //   group: 'AI 智能化',
  //   items: [
  //     { id: 'ai-bot',    label: '机器人配置', href: 'ai-bot-config.html',  icon: '<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>' },
  //     { id: 'ai-quality', label: '质检分析',   href: 'ai-quality.html',    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  //     { id: 'ai-report',  label: '报表看板',   href: 'ai-report.html',     icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  //   ]
  // }
];

/**
 * 根据页面所在层级解析 href（支持 admin/ 子目录内的页面）
 * 如果页面在 admin/ 目录下，同目录内链接不需要前缀
 */
function resolveHref(href) {
  return href; // 同目录内直接引用
}

/**
 * 渲染侧边栏到 #sidebar-nav 容器
 * 读取 data-active 属性来确定高亮项
 */
function renderSidebar() {
  const el = document.getElementById('sidebar-nav');
  if (!el) return;

  const activeId = el.getAttribute('data-active') || '';

  let html = '<div class="logo">供应链平台</div>';

  MENU_DATA.forEach(group => {
    html += `<div class="sidebar-menu-group-title">${group.group}</div>`;
    group.items.forEach(item => {
      const isActive = item.id === activeId ? ' active' : '';
      const svgIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:-2px;margin-right:8px;">${item.icon}</svg>`;
      html += `<a href="${item.href}" class="menu-item${isActive}">${svgIcon}${item.label}</a>`;
    });
  });

  el.innerHTML = html;
}

// 自动渲染
document.addEventListener('DOMContentLoaded', renderSidebar);
