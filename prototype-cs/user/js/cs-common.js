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
  var MINI_BASE = '../../../mini-program/pages/';
  // data-cs-action → mini-program 页面映射（与小程序实际跳转对齐）
  var ACTION_URLS = {
    'viewDetail_order':    'order_detail.html',
    'aftersale':           'apply_refund.html',
    'aftersale_exchange':  'apply_exchange.html',
    'editAddress':         'address_edit.html',
    'trackLogistics':      'logistics.html',
    'viewProgress':        'refund_detail.html',
    // 填写物流/撤销申请/补充说明：均跳转 refund_detail（小程序在该页内置物流表单/取消/补充凭证）
    'supplement':          'refund_detail.html',
    'revoke':              'refund_detail.html',
    'fillLogistics':       'refund_detail.html',
    'viewDetail_product':  'product_detail.html',
    'viewDetail_logistics':'logistics.html',
    'viewFaq':             'help.html'
  };

  // ---- 卡片 HTML 生成器（product / order / logistics / aftersale / faq） ----
  function cardHtml(type, p) {
    p = p || {};
    var THUMB_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cs-primary)" stroke-width="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>';
    var body = '<div class="card-body">';
    var action = '';
    var h = '<div class="thread-card ' + type + '">';

    // 生成带跳转的按钮（任务6）
    function btn(text, act) {
      var url = ACTION_URLS[act] ? (MINI_BASE + ACTION_URLS[act]) : '';
      var oc = url ? ' onclick="location.href=\'' + url + '\'"' : '';
      return '<button class="card-action-btn" data-cs-action="' + act + '"' + oc + '>' + text + '</button>';
    }
    // 生成带跳转的单按钮（.card-action 整块可点击）
    function singleBtn(text, act) {
      var url = ACTION_URLS[act] ? (MINI_BASE + ACTION_URLS[act]) : '';
      var oc = url ? ' onclick="location.href=\'' + url + '\'" style="cursor:pointer"' : '';
      return '<div class="card-action"' + oc + '>' + text + '</div>';
    }

    if (type === 'product') {
      h += '<div class="card-header"><div class="h-left"><span class="h-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span><span>商品</span></div><span class="status-badge s-done">在售</span></div>';
      body += '<div class="product-info"><div class="product-thumb">' + THUMB_SVG + '</div><div class="product-detail"><div class="product-name">' + esc(p.product_name || '日本进口保温杯') + '</div><div class="product-desc">白色 · 500ml · 304不锈钢</div></div></div><div class="price-line"><span class="now">¥' + esc(p.price || '68') + '</span></div>';
      action = '<div class="card-actions">' + btn('查看商品', 'viewDetail_product') + '</div>';
    } else if (type === 'order') {
      var orderStatusMap = {
        '待发货': 's-warn', '运输中': 's-proc', '已签收': 's-done',
        '售后中': 's-danger', '已完成': 's-done', '已取消': 's-danger'
      };
      var os = p.order_status || '运输中';
      var osBadge = orderStatusMap[os] || 's-proc';
      h += '<div class="card-header"><div class="h-left"><span class="h-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></span><span>订单</span></div><span class="status-badge ' + osBadge + '">' + esc(os) + '</span></div>';
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
      var lgHeadStatus = '运输中', lgHeadCls = 's-proc';
      if (pkgs) {
        var allDelivered = true;
        for (var pi = 0; pi < pkgs.length; pi++) {
          if (pkgs[pi].status_text !== '已签收') {
            lgHeadStatus = pkgs[pi].status_text || '运输中';
            lgHeadCls = pkgs[pi].status === 'delivered' ? 's-done' : (pkgs[pi].status === 'pending' ? 's-warn' : 's-proc');
            allDelivered = false;
            break;
          }
        }
        if (allDelivered) { lgHeadStatus = '已签收'; lgHeadCls = 's-done'; }
      }
      h += '<div class="card-header"><div class="h-left"><span class="h-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span><span>物流</span></div><span class="status-badge ' + lgHeadCls + '">' + esc(lgHeadStatus) + '</span></div>';
      if (pkgs && pkgs.length > 1) {
        // 多包裹：按包裹分组渲染（对齐小程序 order_detail 包裹块）
        pkgs.forEach(function (pkg, idx) {
          var pCls = pkg.status === 'delivered' ? 's-done' : (pkg.status === 'pending' ? 's-warn' : 's-proc');
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
        '商家已审核': 's-proc',
        '待寄回商品': 's-proc', '已寄回商品': 's-proc',
        '待商家收货': 's-proc', '商家已收货': 's-proc',
        '待退款': 's-warn',
        '待商家重新发货': 's-warn', '商家已发货': 's-proc',
        '已退款': 's-done', '完成': 's-done', '已完成': 's-done',
        '申请已拒绝': 's-danger', '已取消': 's-closed'
      };
      var rsBadge = aftersaleStatusMap[rs] || 's-warn';
      h += '<div class="card-header"><div class="h-left"><span class="h-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></span><span>售后 · ' + esc(aftersaleType) + '</span></div><span class="status-badge ' + rsBadge + '">' + esc(rs) + '</span></div>';

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

      // 按钮配置（与小程序一致：查看进度→refund_detail，填写物流/撤销/补充→refund_detail）
      var refundBtns = [btn('查看进度', 'viewProgress')];
      if (rs === '待商家审核') {
        refundBtns.push(btn('补充说明', 'supplement'), btn('撤销申请', 'revoke'));
      } else if (rs === '商家已审核' || rs === '待寄回商品') {
        // 审核通过后，待寄回商品阶段可填写物流
        refundBtns.push(btn('填写物流', 'fillLogistics'));
      }
      action = '<div class="card-actions">' + refundBtns.join('') + '</div>';
    } else if (type === 'faq') {
      // 任务4：FAQ 卡片右上角加"换一换"按钮
      h += '<div class="card-header"><div class="h-left"><span class="h-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><span>常见问题</span></div><span class="faq-refresh" data-cs-action="faqRefresh" title="换一换" style="font-size:var(--cs-font-size-xs);color:var(--cs-primary);cursor:pointer;display:inline-flex;align-items:center;gap:2px;font-weight:500;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>换一换</span></div>';
      body += '<div class="faq-list">';
      body += '<div class="faq-item" onclick="location.href=\'' + MINI_BASE + 'help.html\'">如何注册苏银豆商城账号？<span class="q-arrow">></span></div>';
      body += '<div class="faq-item" onclick="location.href=\'' + MINI_BASE + 'help.html\'">积分如何获取和使用？<span class="q-arrow">></span></div>';
      body += '<div class="faq-item" onclick="location.href=\'' + MINI_BASE + 'help.html\'">退款多久能到账？<span class="q-arrow">></span></div>';
      body += '<div class="faq-item" onclick="location.href=\'' + MINI_BASE + 'help.html\'">忘记密码怎么办？<span class="q-arrow">></span></div>';
      body += '</div>';
    } else {
      return '';
    }
    body += '</div>';
    return h + body + action + '</div>';
  }

  // ---- FAQ 卡片换一换（任务4） ----
  // 3 组问题，点击换一换循环切换
  var FAQ_GROUPS = [
    ['如何注册苏银豆商城账号？', '积分如何获取和使用？', '退款多久能到账？', '忘记密码怎么办？'],
    ['如何修改收货地址？', '优惠券如何使用？', '订单如何取消？', '发票如何开具？'],
    ['会员等级有哪些权益？', '商品退换货流程？', '如何联系人工客服？', '订单多久自动确认收货？']
  ];
  function bindFaqRefresh(container) {
    if (!container) container = document;
    var refreshBtns = container.querySelectorAll('.faq-refresh[data-cs-action="faqRefresh"]');
    refreshBtns.forEach(function (btnEl) {
      if (btnEl.dataset.bound === '1') return;
      btnEl.dataset.bound = '1';
      var gi = 0;
      btnEl.addEventListener('click', function (e) {
        e.stopPropagation();
        gi = (gi + 1) % FAQ_GROUPS.length;
        var card = btnEl.closest('.thread-card');
        if (!card) return;
        var list = card.querySelector('.faq-list');
        if (!list) return;
        list.innerHTML = '';
        FAQ_GROUPS[gi].forEach(function (q) {
          var item = document.createElement('div');
          item.className = 'faq-item';
          item.setAttribute('onclick', "location.href='" + MINI_BASE + "help.html'");
          item.innerHTML = q + '<span class="q-arrow">></span>';
          list.appendChild(item);
        });
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
      '  <div class="rc-tags">',
      '    <span class="rc-tag">响应迅速</span>',
      '    <span class="rc-tag">态度友好</span>',
      '    <span class="rc-tag">专业能力强</span>',
      '    <span class="rc-tag">问题已解决</span>',
      '  </div>',
      '  <button class="rc-submit" disabled>提交评价</button>',
      '  <div class="rc-thanks">感谢您的评价，祝您生活愉快！</div>',
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
    var tags = card.querySelectorAll('.rc-tag');
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

    tags.forEach(function (tag) {
      tag.addEventListener('click', function () {
        tag.classList.toggle('active');
      });
    });

    submit.addEventListener('click', function () {
      if (rating === 0) return;
      card.classList.add('done');
      var box = document.getElementById('chatMessages');
      if (box) box.scrollTop = box.scrollHeight;
    });
  }

  // ---- 用户消息撤回（2 分钟内，长按/右键触发）----
  // 用法：CsCommon.bindRecall(document.getElementById('chatMessages'))
  // 仅对 .msg-row.user 内的气泡生效；撤回后替换为「你撤回了一条消息」提示
  var RECALL_WINDOW = 2 * 60 * 1000; // 2 分钟
  function bindRecall(container) {
    if (!container || container.dataset.recallBound === '1') return;
    container.dataset.recallBound = '1';

    // 长按定时器
    var pressTimer = null;
    function clearPress() {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
    }

    // 触发撤回确认
    function tryRecall(row) {
      if (!row || !row.classList.contains('user')) return;
      // 时间校验：data-ts 缺失则视为当前可撤回（静态演示消息）
      var ts = parseInt(row.getAttribute('data-ts') || '0', 10);
      if (ts && (Date.now() - ts > RECALL_WINDOW)) {
        if (window.csModal) csModal.toast('发送超过 2 分钟，无法撤回');
        else alert('发送超过 2 分钟，无法撤回');
        return;
      }
      if (!window.confirm('确认撤回这条消息？')) return;
      // 替换为撤回提示
      var notice = document.createElement('div');
      notice.className = 'msg-recalled-notice';
      notice.innerHTML = '<svg class="recall-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>你撤回了一条消息';
      row.parentNode.replaceChild(notice, row);
    }

    // 长按（移动端）
    container.addEventListener('touchstart', function (e) {
      var row = e.target.closest('.msg-row.user');
      if (!row) return;
      var bubble = e.target.closest('.msg-bubble, .msg-bubble-user, .msg-content');
      if (!bubble) return;
      clearPress();
      pressTimer = setTimeout(function () {
        tryRecall(row);
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
      tryRecall(row);
    });
  }

  // ---- 快捷卡片入口条（输入框上方，横向滚动） ----
  // opts.id: 可选，给容器加 id（如 basic 页需后续操作快捷栏）
  var QUICK_CARDS = [
    { action: 'transfer',  label: '转人工',       svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { action: 'order',     label: '发送订单',     svg: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
    { action: 'refund',    label: '发送售后',     svg: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>' },
    { action: 'logistics', label: '查看物流',     svg: '<rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
    { action: 'cart',      label: '购物车',       svg: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>' },
    { action: 'rating',    label: '发送服务评价', svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' }
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
    bindRating: bindRating,
    bindFaqRefresh: bindFaqRefresh,
    bindRecall: bindRecall,
    quickCardsBar: quickCardsBar,
    bindQuickCards: bindQuickCards
  };
})();
