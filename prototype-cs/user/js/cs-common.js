/* ============================================================
   cs-common.js — 用户端原型公共组件库（JS 注入式）
   ------------------------------------------------------------
   封装 7 个 chat 系列页面 + queue/offline/rating/faq 共有的：
   1. 状态栏 / 微信胶囊 SVG（HTML 片段）
   2. cardHtml(type, p) 卡片 HTML 生成器（含按钮跳转 mini-program）
   3. ratingCard() 评价卡片 HTML + bindRating(row) 交互绑定
   4. parseQuery() URL 参数解析
   5. ensureSender(row, name) 给 agent 消息补发送者名称
   6. esc(s) HTML 转义
   7. bindFaqRefresh(container) FAQ 卡片换一换
   8. quickCardsBar(opts) 快捷卡片入口条 HTML + bindQuickCards(cb) 事件绑定

   用法：各页面 <script src="js/cs-common.js"></script> 后通过
        CsCommon.xxx() 调用。改一处，全部页面生效。
   ============================================================ */
(function () {
  'use strict';

  // ---- HTML 转义 ----
  function esc(s) {
    return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---- 状态栏（小程序顶部 09:41 + WiFi + 电池） ----
  function statusBar() {
    return [
      '<div class="cs-status-bar">',
      '  <span class="sb-time">09:41</span>',
      '  <div class="sb-icons">',
      '    <svg viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>',
      '    <svg viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  // ---- 微信胶囊（导航栏右侧 2808×1024 viewBox SVG） ----
  function capsule() {
    return '<div class="cs-capsule" title="微信胶囊">' +
      '<svg viewBox="0 0 2808 1024" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2296.677184 1023.997952h-1784.679086a511.998098 511.998098 0 0 1-362.026541-874.024639A508.633539 508.633539 0 0 1 511.998098 0.001755h1784.679086a511.998098 511.998098 0 0 1 362.026541 874.02464A508.662796 508.662796 0 0 1 2296.677184 1023.997952z m-1784.679086-994.739162a482.741064 482.741064 0 0 0 0 965.482128h1784.679086a482.741064 482.741064 0 1 0 0-965.482128z"/>' +
      '<path d="M614.397718 492.075813a120.890065 117.78882 90 1 0 235.577639 0 120.890065 117.78882 90 1 0-235.577639 0Z"/>' +
      '<path d="M483.531004 508.225696m-78.52588 0a78.52588 78.52588 0 1 0 157.05176 0 78.52588 78.52588 0 1 0-157.05176 0Z"/>' +
      '<path d="M967.822691 495.147802m-65.447986 0a65.447985 65.447985 0 1 0 130.895971 0 65.447985 65.447985 0 1 0-130.895971 0Z"/>' +
      '<path d="M2065.400329 370.512836a145.934087 145.934087 0 0 0-145.758545 145.758545 145.934087 145.934087 0 0 0 145.758545 145.758544 145.934087 145.934087 0 0 0 145.758544-145.758544 145.934087 145.934087 0 0 0-145.758544-145.758545m0-117.028136a262.786681 262.786681 0 1 1 0 525.573362 262.786681 262.786681 0 0 1 0-525.573362z" fill="#000"/>' +
      '<path d="M2070.374024 521.332848m-91.633031 0a91.633031 91.633031 0 1 0 183.266062 0 91.633031 91.633031 0 1 0-183.266062 0Z"/>' +
      '<path d="M1404.337641 204.800995h29.257034v585.140684h-29.257034z"/>' +
      '</svg>' +
      '</div>';
  }

  // ---- URL 参数解析 ----
  function parseQuery() {
    var q = location.search.replace(/^\?/, '');
    var pairs = q ? q.split('&') : [];
    var o = {};
    for (var i = 0; i < pairs.length; i++) {
      var idx = pairs[i].indexOf('=');
      var k = idx > -1 ? pairs[i].substring(0, idx) : pairs[i];
      var v = idx > -1 ? pairs[i].substring(idx + 1) : '';
      o[decodeURIComponent(k)] = decodeURIComponent(v);
    }
    return o;
  }

  // ---- 给 agent 消息行补 .msg-sender（若缺） ----
  function ensureSender(row, name) {
    if (!row || row.classList.contains('user')) return;
    var content = row.querySelector('.msg-content');
    if (!content) return;
    if (content.querySelector('.msg-sender')) return;
    var sender = document.createElement('div');
    sender.className = 'msg-sender';
    sender.textContent = name || '客服';
    content.insertBefore(sender, content.firstChild);
  }

  // ---- mini-program 页面相对路径 ----
  // user/ → prototype-cs/ → OCS/ → 在线客服1/ → mini-program/pages/
  var MINI_BASE = '../../mini-program/pages/';
  // data-cs-action → mini-program 页面映射（与小程序实际跳转对齐）
  // 注：supplement/revoke/fillLogistics 已改为弹窗交互（不再跳转），见 user-chat-basic.html 事件委托
  var ACTION_URLS = {
    'viewDetail_order':    'order_detail.html',
    'aftersale':           '',
    'aftersale_exchange':  '',
    'editAddress':         '',
    'trackLogistics':      'logistics.html',
    'viewProgress':        'refund_detail.html',
    'viewDetail_product':  'product_detail.html',
    'viewDetail_logistics':'logistics.html',
    'viewFaq':             'help.html'
  };
  // 走弹窗交互的 action（不生成 onclick 跳转，由宿主页事件委托处理）
  var MODAL_ACTIONS = { 'supplement': 1, 'revoke': 1, 'fillLogistics': 1 };

  // ---- 卡片 HTML 生成器（product / order / logistics / aftersale / faq） ----
  function cardHtml(type, p) {
    p = p || {};
    var THUMB_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cs-primary)" stroke-width="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>';
    var body = '<div class="card-body">';
    var action = '';
    var h = '<div class="thread-card ' + type + '">';

    // 生成带跳转的按钮；supplement/revoke/fillLogistics 走弹窗（不跳转）
    function btn(text, act) {
      var oc = '';
      if (!MODAL_ACTIONS[act]) {
        var url = ACTION_URLS[act] ? (MINI_BASE + ACTION_URLS[act]) : '';
        oc = url ? ' onclick="location.href=\'' + url + '\'"' : '';
      }
      return '<button class="card-action-btn" data-cs-action="' + act + '"' + oc + '>' + text + '</button>';
    }
    // 生成带跳转的单按钮（.card-action 整块可点击）
    function singleBtn(text, act) {
      var url = ACTION_URLS[act] ? (MINI_BASE + ACTION_URLS[act]) : '';
      var oc = url ? ' onclick="location.href=\'' + url + '\'" style="cursor:pointer"' : '';
      return '<div class="card-action"' + oc + '>' + text + '</div>';
    }

    // 生成 header（统一结构：左图标+标签，右状态徽标）
    function mkHeader(cfg) {
      var badge = cfg.badgeText ? '<span class="status-badge ' + (cfg.badgeCls || '') + '">' + esc(cfg.badgeText) + '</span>' : '';
      var extra = cfg.extra || '';
      return '<div class="card-header"><div class="h-left"><span class="h-icon">' + cfg.icon + '</span><span>' + cfg.label + '</span></div>' + extra + badge + '</div>';
    }

    if (type === 'product') {
      h += mkHeader({
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        label: '商品', badgeCls: 's-done', badgeText: '在售'
      });
      body += '<div class="product-info"><div class="product-thumb">' + THUMB_SVG + '</div><div class="product-detail"><div class="product-name">' + esc(p.product_name || '日本进口保温杯') + '</div><div class="product-desc">白色 · 500ml · 304不锈钢</div></div></div><div class="price-line"><span class="now">¥' + esc(p.price || '68') + '</span></div>';
      action = '<div class="card-actions">' + btn('查看商品', 'viewDetail_product') + '</div>';
    } else if (type === 'order') {
      var orderStatusMap = {
        '待发货': 's-warn', '运输中': 's-warn', '已签收': 's-done',
        '售后中': 's-danger', '已完成': 's-done', '已取消': 's-danger'
      };
      var os = p.order_status || '运输中';
      var osBadge = orderStatusMap[os] || 's-warn';
      h += mkHeader({
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
        label: '订单', badgeCls: osBadge, badgeText: os
      });
      body += '<div class="card-row"><span class="label">订单编号</span><span class="value">' + esc(p.order_id || 'JS2026040888001') + '</span></div><div class="card-row"><span class="label">实付金额</span><span class="value">¥' + esc(p.amount || '196.90') + '</span></div>';
      var orderBtns = [btn('查看详情', 'viewDetail_order')];
      if (os === '待发货') {
        orderBtns.push(btn('申请售后', 'aftersale'), btn('修改地址', 'editAddress'));
      } else if (os === '运输中') {
        orderBtns.push(btn('查看物流', 'trackLogistics'), btn('申请售后', 'aftersale'));
      } else if (os === '已签收') {
        orderBtns.push(btn('查看物流', 'trackLogistics'), btn('申请售后', 'aftersale'));
      } else if (os === '售后中') {
        orderBtns.push(btn('查看售后进度', 'viewProgress'));
      }
      action = '<div class="card-actions">' + orderBtns.join('') + '</div>';
    } else if (type === 'logistics') {
      // 多包裹支持：p.packages 为数组时按包裹分组渲染（对齐小程序 order_detail 包裹块）
      var pkgs = (p.packages && p.packages.length) ? p.packages : null;
      var lgHeadStatus = '运输中', lgHeadCls = 's-warn';
      if (pkgs) {
        var allDelivered = true;
        for (var pi = 0; pi < pkgs.length; pi++) {
          if (pkgs[pi].status_text !== '已签收') {
            lgHeadStatus = pkgs[pi].status_text || '运输中';
            lgHeadCls = pkgs[pi].status === 'delivered' ? 's-done' : 's-warn';
            allDelivered = false;
            break;
          }
        }
        if (allDelivered) { lgHeadStatus = '已签收'; lgHeadCls = 's-done'; }
      }
      h += mkHeader({
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
        label: '物流', badgeCls: lgHeadCls, badgeText: lgHeadStatus
      });
      if (pkgs && pkgs.length > 1) {
        // 多包裹：按包裹分组渲染（对齐小程序 order_detail 包裹块）
        pkgs.forEach(function (pkg, idx) {
          var pCls = pkg.status === 'delivered' ? 's-done' : 's-warn';
          body += '<div class="pkg-block"' + (idx > 0 ? ' style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--cs-border-light);"' : '') + '>';
          body += '<div class="pkg-head"><span class="pkg-no">' + esc(pkg.no || ('包裹' + (idx + 1))) + '</span><span class="status-badge ' + pCls + '">' + esc(pkg.status_text || '') + '</span></div>';
          if (pkg.carrier) body += '<div class="card-row"><span class="label">承运商</span><span class="value">' + esc(pkg.carrier) + '</span></div>';
          if (pkg.tracking_no) body += '<div class="card-row"><span class="label">运单号</span><span class="value">' + esc(pkg.tracking_no) + '</span></div>';
          if (pkg.goods) body += '<div class="card-row"><span class="label">商品</span><span class="value">' + esc(pkg.goods) + '</span></div>';
          if (pkg.trace_tip) body += '<div class="pkg-trace">' + esc(pkg.trace_tip) + '</div>';
          body += '</div>';
        });
      } else {
        // 单包裹（向后兼容）
        body += '<div class="card-row"><span class="label">运单号</span><span class="value">' + esc(p.tracking_no || 'SF1234567890') + '</span></div><div class="card-row"><span class="label">承运商</span><span class="value">' + esc(p.carrier || '顺丰速运') + '</span></div>';
        body += '<div class="track-step"><span class="track-dot done"></span><div class="track-line">已揽收<span class="track-time">06-10 09:00</span></div></div>';
        body += '<div class="track-step"><span class="track-dot done"></span><div class="track-line">运输中<span class="track-time">06-11 14:20</span></div></div>';
        body += '<div class="track-step"><span class="track-dot active"></span><div class="track-line">派送中<span class="track-time">06-12 08:30</span></div></div>';
      }
      action = '<div class="card-actions">' + btn('查看物流详情', 'viewDetail_logistics') + '</div>';
    } else if (type === 'refund' || type === 'aftersale') {
      // ===== 售后卡片（状态文案与小程序 refund_detail.html / refund.html 完全对齐） =====
      // 三种售后类型的状态流转（文案取自小程序 timeline 节点 + statusText）：
      //   仅退款：  待商家审核 → 商家已审核 → 待退款 → 已退款(完成) / 申请已拒绝 / 已取消
      //   退货退款：待商家审核 → 商家已审核 → 待寄回商品 → 已寄回商品 → 待商家收货 → 商家已收货 → 待退款 → 已退款(完成) / 申请已拒绝 / 已取消
      //   换货：   待商家审核 → 商家已审核 → 待寄回商品 → 已寄回商品 → 待商家收货 → 商家已收货 → 待商家重新发货 → 商家已发货 → 完成 / 申请已拒绝 / 已取消
      var aftersaleType = p.aftersale_type || p.refund_type || '退货退款';
      var defaultStatus = '待商家审核';
      var rs = p.aftersale_status || p.refund_status || defaultStatus;
      // 状态徽标映射（与小程序 statusText / timeline 文案对齐）
      var aftersaleStatusMap = {
        '待商家审核': 's-warn',
        '商家已审核': 's-warn',
        '待寄回商品': 's-warn', '已寄回商品': 's-warn',
        '待商家收货': 's-warn', '商家已收货': 's-warn',
        '待退款': 's-warn',
        '待商家重新发货': 's-warn', '商家已发货': 's-warn',
        '已退款': 's-done', '完成': 's-done', '已完成': 's-done',
        '申请已拒绝': 's-danger', '已取消': 's-danger'
      };
      var rsBadge = aftersaleStatusMap[rs] || 's-warn';
      h += mkHeader({
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
        label: '售后 · ' + esc(aftersaleType), badgeCls: rsBadge, badgeText: rs
      });

      // 基本信息
      // 申请原因
      body += '<div class="card-row"><span class="label">申请原因</span><span class="value">' + esc(p.reason || '商品质量问题') + '</span></div>';
      // 商品名称
      body += '<div class="card-row"><span class="label">商品名称</span><span class="value">' + esc(p.product_name || '日本进口保温杯') + '</span></div>';
      // 退款金额（仅退款 / 退货退款 显示）— 拆分现金 + 苏银豆，对齐小程序 refund_detail points-row
      if (aftersaleType !== '换货') {
        // 可退积分（苏银豆）— 当 refund_points > 0 时显示，与小程序 points-row 一致
        var points = Number(p.refund_points || 0);
        if (points > 0) {
          body += '<div class="card-row"><span class="label">可退积分</span><span class="value">' + esc(String(points)) + '苏银豆</span></div>';
        }
        // 退还现金
        body += '<div class="card-row"><span class="label">退款金额</span><span class="value price">¥' + esc(p.refund_amount || p.amount || '68.00') + '</span></div>';
      }
      // 申请时间
      body += '<div class="card-row"><span class="label">申请时间</span><span class="value">' + esc(p.apply_time || '2026-04-08 10:30') + '</span></div>';
      // 商家处理意见（仅在"申请已拒绝"状态显示，其他状态不显示）
      if (rs === '申请已拒绝') {
        var opinion = p.merchant_opinion || '经核实商品无质量问题，拒绝申请';
        body += '<div class="card-row"><span class="label">处理意见</span><span class="value">' + esc(opinion) + '</span></div>';
      }

      // 按钮配置（查看进度→refund_detail 跳转；补充说明/撤销/填写物流→弹窗交互）
      // 卡片数据透传到按钮 data 属性，供宿主页事件委托打开弹窗时读取
      var refundId = p.aftersale_id || p.refund_id || '';
      var refundAmount = (aftersaleType !== '换货') ? (p.refund_amount || p.amount || '') : '';
      var supplementRemark = p.supplement_remark || '';
      // 按钮工厂（带 data 透传）
      function refundBtn(text, act) {
        return '<button class="card-action-btn" data-cs-action="' + act + '"' +
          ' data-refund-id="' + esc(refundId) + '"' +
          ' data-refund-type="' + esc(aftersaleType) + '"' +
          ' data-refund-status="' + esc(rs) + '"' +
          (refundAmount ? ' data-refund-amount="' + esc(refundAmount) + '"' : '') +
          (supplementRemark ? ' data-supplement-remark="' + esc(supplementRemark).replace(/"/g, '&quot;') + '"' : '') +
          '>' + text + '</button>';
      }
      var refundBtns = [refundBtn('查看进度', 'viewProgress')];
      if (rs === '待商家审核') {
        refundBtns.push(refundBtn('补充说明', 'supplement'), refundBtn('撤销申请', 'revoke'));
      } else if (rs === '商家已审核' || rs === '待寄回商品') {
        // 审核通过后，待寄回商品阶段可填写物流
        refundBtns.push(refundBtn('填写物流', 'fillLogistics'));
      }
      action = '<div class="card-actions">' + refundBtns.join('') + '</div>';
    } else if (type === 'faq') {
      // FAQ 卡片：题库 FAQ_LIBRARY 按"点击次数"排序，一张卡片显示前 FAQ_PAGE_SIZE 条
      h += '<div class="card-header"><div class="h-left"><span class="h-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><span>常见问题</span></div><span class="faq-refresh" data-cs-action="faqRefresh" title="换一换" style="font-size:var(--cs-font-size-xs);color:var(--cs-primary);cursor:pointer;display:inline-flex;align-items:center;gap:2px;font-weight:500;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>换一换</span></div>';
      body += '<div class="faq-list">';
      // 默认显示第 0 屏（题库前 FAQ_PAGE_SIZE 条）
      faqPageSlice(0).forEach(function (q) {
        body += '<div class="faq-item" data-cs-faq-q="' + q.replace(/"/g, '&quot;') + '">' + q + '<span class="q-arrow">></span></div>';
      });
      body += '</div>';
    } else {
      return '';
    }
    body += '</div>';
    return h + body + action + '</div>';
  }

  // ---- FAQ 卡片题库与换一换（任务4 升级版） ----
  // FAQ_LIBRARY：按"点击次数"从高到低排序的问答库（题库来源：06-FAQ机器人客服.md §6.4.4）
  // FAQ_PAGE_SIZE：一张卡片显示的问题条数
  // 换一换：按题库顺序逐屏往后翻，到末尾不足一屏时循环回开头
  var FAQ_PAGE_SIZE = 4;
  var FAQ_LIBRARY = [
    { q: '如何申请七天无理由退货？', a: '在「我的订单」中找到对应订单，点击「申请售后」> 选择「退货退款」> 填写退货原因并提交。商品需保持全新未使用状态，附带完整配件与包装。审核通过后将自动生成退货物流单。' },
    { q: '订单显示"已发货"但查不到物流信息？', a: '物流单号一般在商家发货后 2-4 小时内更新。若超过 24 小时仍无更新，可能是物流公司系统延迟，建议耐心等待；如急需处理可点击下方「联系客服」转人工咨询。' },
    { q: '退款多久能到账？', a: '退款审核通过后：支付宝/微信原路退回 1-3 个工作日；银行卡 3-7 个工作日；余额即时到账。节假日可能顺延，以银行实际入账时间为准。' },
    { q: '支持哪些支付方式？', a: '目前支持微信支付、支付宝、银联云闪付、信用卡分期及商城余额支付。部分商品支持花呗与白条，具体以结算页可选方式为准。' },
    { q: '支付时提示"交易关闭"怎么办？', a: '订单超过支付时效（通常 30 分钟）会自动关闭。请在「我的订单」中找到该订单重新发起支付，或重新下单。如金额已扣款但订单关闭，系统将在 1 个工作日内原路退回。' },
    { q: '可以修改或取消已下的订单吗？', a: '订单在「待付款」状态可直接取消；已付款未发货的订单，请在订单详情页点击「申请取消」，商家审核通过后自动退款。已发货订单无法取消，需在收货后申请退货。' },
    { q: '可以修改收货地址吗？', a: '订单未发货前，可在订单详情页点击「修改地址」更新收货信息。已发货订单无法修改，建议联系收件人或快递员沟通改派。' },
    { q: '忘记登录密码怎么找回？', a: '在登录页点击「忘记密码」，输入注册手机号获取验证码，验证通过后即可设置新密码。建议使用 8-20 位含字母与数字的组合密码。' },
    { q: '收到的商品有质量问题如何处理？', a: '请在签收后 7 天内通过「申请售后」提交，并上传商品问题的照片/视频凭证。客服将在 24 小时内审核，质量问题产生的退换货运费由商家承担。' }
  ];
  // 取第 page 屏（每屏 FAQ_PAGE_SIZE 条），不足一屏时从开头补齐循环
  function faqPageSlice(page) {
    var len = FAQ_LIBRARY.length;
    var start = (page * FAQ_PAGE_SIZE) % len;
    var slice = [];
    for (var i = 0; i < FAQ_PAGE_SIZE; i++) {
      slice.push(FAQ_LIBRARY[(start + i) % len].q);
    }
    return slice;
  }
  function faqAnswerOf(q) {
    for (var i = 0; i < FAQ_LIBRARY.length; i++) {
      if (FAQ_LIBRARY[i].q === q) return FAQ_LIBRARY[i].a;
    }
    return '';
  }
  // FAQ 卡片内问题点击 → 把答案追加到当前聊天消息流（不跳页、不弹窗）
  function bindFaqItemClicks(card) {
    var items = card.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var q = item.getAttribute('data-cs-faq-q') || '';
        var a = faqAnswerOf(q);
        if (!a) return;
        var box = document.getElementById('chatMessages');
        if (!box) return;
        var t = new Date().toTimeString().slice(0, 5);

        // 1. 用户气泡：发出点击的问题（像用户自己发送）
        var userRow = document.createElement('div');
        userRow.className = 'msg-row user';
        userRow.innerHTML =
          '<div class="msg-content">' +
            '<div class="msg-bubble-user">' + q + '</div>' +
            '<div class="msg-meta">' + t + '</div>' +
          '</div>';
        box.appendChild(userRow);
        box.scrollTop = box.scrollHeight;

        // 2. 延迟后客服气泡：回复该问题的答案
        setTimeout(function () {
          var agentRow = document.createElement('div');
          agentRow.className = 'msg-row';
          var t2 = new Date().toTimeString().slice(0, 5);
          agentRow.innerHTML =
            '<div class="msg-avatar agent">智</div>' +
            '<div class="msg-content">' +
              '<div class="msg-sender">智能客服小助手</div>' +
              '<div class="msg-bubble-agent">' + a + '</div>' +
              '<div class="msg-meta">' + t2 + '</div>' +
            '</div>';
          box.appendChild(agentRow);
          box.scrollTop = box.scrollHeight;
        }, 500);
      });
    });
  }
  function bindFaqRefresh(container) {
    if (!container) container = document;
    var refreshBtns = container.querySelectorAll('.faq-refresh[data-cs-action="faqRefresh"]');
    refreshBtns.forEach(function (btnEl) {
      if (btnEl.dataset.bound === '1') return;
      btnEl.dataset.bound = '1';
      var card = btnEl.closest('.thread-card');
      if (card) bindFaqItemClicks(card);   // 初始屏也绑定点击
      var gi = 0;
      btnEl.addEventListener('click', function (e) {
        e.stopPropagation();
        gi = gi + 1;   // 下一屏（faqPageSlice 内部已做循环）
        if (!card) return;
        var list = card.querySelector('.faq-list');
        if (!list) return;
        list.innerHTML = '';
        faqPageSlice(gi).forEach(function (q) {
          var item = document.createElement('div');
          item.className = 'faq-item';
          item.setAttribute('data-cs-faq-q', q);
          item.innerHTML = q + '<span class="q-arrow">></span>';
          list.appendChild(item);
        });
        bindFaqItemClicks(card);   // 新一屏重新绑定点击
        var icon = btnEl.querySelector('svg');
        if (icon) {
          icon.style.transition = 'transform .45s';
          icon.style.transform = 'rotate(' + ((gi + 1) * 360) + 'deg)';
        }
      });
    });
  }

  // ---- 评价卡片 HTML ----
  function ratingCard() {
    return [
      '<div class="msg-rating-card">',
      '  <div class="rc-title">服务评价</div>',
      '  <div class="rc-sub">感谢您的咨询，请对本次服务打分</div>',
      '  <div class="rc-stars">',
      '    <span class="rc-star" data-v="1">★</span>',
      '    <span class="rc-star" data-v="2">★</span>',
      '    <span class="rc-star" data-v="3">★</span>',
      '    <span class="rc-star" data-v="4">★</span>',
      '    <span class="rc-star" data-v="5">★</span>',
      '  </div>',
      '  <div class="rc-resolve">',
      '    <span class="rc-resolve-q">请问您的问题解决了吗?</span>',
      '    <div class="rc-resolve-btns">',
      '      <button type="button" class="rc-resolve-btn" data-v="resolved">已解决</button>',
      '      <button type="button" class="rc-resolve-btn" data-v="unresolved">未解决</button>',
      '    </div>',
      '  </div>',
      '  <button class="rc-submit" disabled>提交评价</button>',
      '  <div class="rc-thanks">感谢您的评价，祝您生活愉快！</div>',
      '</div>'
    ].join('\n');
  }

  // ---- 评价卡片（已过期，不可评价） ----
  // 复用正常评价卡片结构，整体灰色禁用；加 .expired 类触发灰色样式
  function ratingCardExpired() {
    return [
      '<div class="msg-rating-card expired">',
      '  <div class="rc-title">服务评价</div>',
      '  <div class="rc-sub">该会话评价已过期</div>',
      '  <div class="rc-stars">',
      '    <span class="rc-star">★</span>',
      '    <span class="rc-star">★</span>',
      '    <span class="rc-star">★</span>',
      '    <span class="rc-star">★</span>',
      '    <span class="rc-star">★</span>',
      '  </div>',
      '  <div class="rc-resolve">',
      '    <span class="rc-resolve-q">请问您的问题解决了吗?</span>',
      '    <div class="rc-resolve-btns">',
      '      <button type="button" class="rc-resolve-btn" disabled>已解决</button>',
      '      <button type="button" class="rc-resolve-btn" disabled>未解决</button>',
      '    </div>',
      '  </div>',
      '  <button class="rc-submit" disabled>评价已过期</button>',
      '</div>'
    ].join('\n');
  }

  // ---- 评价卡片交互绑定 ----
  function bindRating(row) {
    if (!row) return;
    var card = row.querySelector('.msg-rating-card');
    if (!card || card.dataset.bound === '1') return;
    card.dataset.bound = '1';

    var rating = 0;
    var stars = card.querySelectorAll('.rc-star');
    var submit = card.querySelector('.rc-submit');

    stars.forEach(function (star) {
      star.addEventListener('click', function () {
        rating = parseInt(star.getAttribute('data-v'), 10);
        stars.forEach(function (s, i) {
          s.classList.toggle('active', i < rating);
        });
        submit.disabled = (rating === 0);
      });
    });

    // 问题解决确认：单选互斥（已解决 / 未解决）
    var resolveBtns = card.querySelectorAll('.rc-resolve-btn');
    resolveBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        resolveBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
      });
    });

    submit.addEventListener('click', function () {
      if (rating === 0) return;
      card.classList.add('done');
      var box = document.getElementById('chatMessages');
      if (box) box.scrollTop = box.scrollHeight;
    });
  }

  // ---- 用户消息撤回（2 分钟内，长按/右键触发，微信式弹出菜单）----
  // 用法：CsCommon.bindRecall(document.getElementById('chatMessages'))
  // 仅对 .msg-row.user 内的气泡生效；长按后弹出小菜单（复制/撤回），点「撤回」直接执行
  var RECALL_WINDOW = 2 * 60 * 1000; // 2 分钟

  // 把指定消息行替换为居中撤回提示条（不保留原文，符合微信/淘宝惯例）
  // text：操作方看「你撤回了一条消息」，对方看「客服撤回了一条消息」
  function replaceWithRecallNotice(row, text) {
    var notice = document.createElement('div');
    notice.className = 'msg-recalled-notice';
    notice.innerHTML = '<svg class="recall-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + (text || '你撤回了一条消息');
    row.parentNode.replaceChild(notice, row);
  }

  // ---- 客服撤回 → 用户端展示（ADR-0006 双向可见）----
  // 用法：CsCommon.renderAgentRecalled(agentRow)
  // 把客服消息行替换为居中灰条「客服撤回了一条消息」，不保留原文、不允许重新查看
  function renderAgentRecalled(row) {
    if (!row) return;
    replaceWithRecallNotice(row, '客服撤回了一条消息');
  }

  function bindRecall(container) {
    if (!container || container.dataset.recallBound === '1') return;
    container.dataset.recallBound = '1';

    // 长按定时器
    var pressTimer = null;
    function clearPress() {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
    }

    // 关闭已存在的撤回菜单
    function closeRecallMenu() {
      var existing = document.getElementById('recallPopover');
      if (existing) existing.remove();
      var mask = document.getElementById('recallPopoverMask');
      if (mask) mask.remove();
    }

    // 执行撤回（无二次确认）
    function doRecall(row) {
      replaceWithRecallNotice(row, '你撤回了一条消息');
    }

    // 弹出长按菜单（微信式）
    function showRecallMenu(row) {
      if (!row || !row.classList.contains('user')) return;
      closeRecallMenu();

      // 时间校验
      var ts = parseInt(row.getAttribute('data-ts') || '0', 10);
      var canRecall = !ts || (Date.now() - ts <= RECALL_WINDOW);

      // 获取消息文本
      var bubble = row.querySelector('.msg-bubble-user');
      var msgText = bubble ? bubble.textContent.trim() : '';

      // 创建遮罩（点击外部关闭）
      var mask = document.createElement('div');
      mask.id = 'recallPopoverMask';
      mask.className = 'recall-popover-mask';
      document.body.appendChild(mask);

      // 创建菜单
      var menu = document.createElement('div');
      menu.id = 'recallPopover';
      menu.className = 'recall-popover';

      var html = '';
      if (msgText) {
        html += '<div class="recall-popover-item" data-action="copy">复制</div>';
      }
      // 仅 2 分钟内显示撤回项；超过 2 分钟不显示撤回
      if (canRecall) {
        html += '<div class="recall-popover-item danger" data-action="recall">撤回</div>';
      }
      menu.innerHTML = html;
      document.body.appendChild(menu);

      // 定位：消息气泡右上方
      var rect = row.getBoundingClientRect();
      var menuRect = menu.getBoundingClientRect();
      var top = rect.top - menuRect.height - 8;
      if (top < 10) top = rect.bottom + 8; // 空间不够则放下方
      menu.style.top = top + 'px';
      // 用户消息右对齐，菜单也靠右
      var left = rect.right - menuRect.width;
      if (left < 10) left = 10;
      menu.style.left = left + 'px';

      // 菜单项点击
      menu.addEventListener('click', function (e) {
        var item = e.target.closest('.recall-popover-item');
        if (!item) return;
        var action = item.getAttribute('data-action');
        closeRecallMenu();

        if (action === 'copy' && msgText) {
          if (navigator.clipboard) navigator.clipboard.writeText(msgText);
          if (window.csModal) csModal.toast('已复制');
        } else if (action === 'recall') {
          if (!canRecall) {
            if (window.csModal) csModal.toast('发送超过 2 分钟，无法撤回');
            else alert('发送超过 2 分钟，无法撤回');
            return;
          }
          doRecall(row);
        }
      });

      // 遮罩点击关闭
      mask.addEventListener('click', closeRecallMenu);
      mask.addEventListener('touchstart', closeRecallMenu, { passive: true });
    }

    // 长按（移动端）
    container.addEventListener('touchstart', function (e) {
      var row = e.target.closest('.msg-row.user');
      if (!row) return;
      var bubble = e.target.closest('.msg-bubble, .msg-bubble-user, .msg-content');
      if (!bubble) return;
      clearPress();
      pressTimer = setTimeout(function () {
        showRecallMenu(row);
      }, 500);
    }, { passive: true });
    container.addEventListener('touchend', clearPress);
    container.addEventListener('touchmove', clearPress);

    // 右键（PC 端）
    container.addEventListener('contextmenu', function (e) {
      var row = e.target.closest('.msg-row.user');
      if (!row) return;
      var bubble = e.target.closest('.msg-bubble, .msg-bubble-user, .msg-content');
      if (!bubble) return;
      e.preventDefault();
      showRecallMenu(row);
    });
  }

  // ---- 快捷卡片入口条（输入框上方，横向滚动） ----
  // opts.id: 可选，给容器加 id（如 basic 页需后续操作快捷栏）
  var QUICK_CARDS = [
    { action: 'transfer',  label: '转人工',       svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { action: 'order',     label: '发送订单',     svg: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
    { action: 'refund',    label: '发送售后',     svg: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>' },
    { action: 'logistics', label: '查看物流',     svg: '<rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
    { action: 'rating',    label: '服务评价',     svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' }
  ];
  function quickCardsBar(opts) {
    opts = opts || {};
    var idAttr = opts.id ? ' id="' + opts.id + '"' : '';
    var html = '<div class="quick-cards-bar"' + idAttr + '>';
    for (var i = 0; i < QUICK_CARDS.length; i++) {
      var it = QUICK_CARDS[i];
      html += '<button class="quick-card" data-action="' + it.action + '" type="button">';
      html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + it.svg + '</svg>';
      html += it.label;
      html += '</button>';
    }
    html += '</div>';
    return html;
  }

  // ---- 快捷栏事件绑定 ----
  // onAction: function(action) — 点击按钮时回调，action 为 data-action 值
  function bindQuickCards(onAction) {
    document.querySelectorAll('.quick-cards-bar .quick-card').forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (onAction) onAction(chip.getAttribute('data-action'));
      });
    });
  }

  // ---- 暴露 API ----
  window.CsCommon = {
    esc: esc,
    statusBar: statusBar,
    capsule: capsule,
    parseQuery: parseQuery,
    ensureSender: ensureSender,
    cardHtml: cardHtml,
    ratingCard: ratingCard,
    ratingCardExpired: ratingCardExpired,
    bindRating: bindRating,
    bindFaqRefresh: bindFaqRefresh,
    bindRecall: bindRecall,
    renderAgentRecalled: renderAgentRecalled,
    quickCardsBar: quickCardsBar,
    bindQuickCards: bindQuickCards
  };
})();
