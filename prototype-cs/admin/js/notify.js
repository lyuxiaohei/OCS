/* ============================================================
   notify.js — 环境提示音 + 新消息弹窗 helper（PRD V2.2）
   ------------------------------------------------------------
   与 cs-modal.js 并列的共享运行时（无依赖，纯 WebAudio）。
   宿主页（workbench / todo）在 <head> 引入本文件后用 window.csNotify：
     csNotify.playBeep(opts?)                  // WebAudio 短提示音
     csNotify.unlockAudio()                    // 幂等；用户手势内调用以解锁自动播放
     csNotify.isAudioUnlocked()                // 当前是否已解锁
     csNotify.popup({ name, preview, onOpen }) // 右下浮动新消息卡片（单实例）
   样式：.nm-popup-host 系列在 styles.css（仿 .csm-toast-host）。
   注意：WebAudio 需用户手势后才能发声——首次点击里调 unlockAudio()。
   ============================================================ */
(function () {
  'use strict';

  var audioCtx = null;

  function ctx() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { audioCtx = new AC(); } catch (e) { return null; }
    }
    return audioCtx;
  }

  // 幂等：建/resume context。须在用户手势内调用（click/keydown）。
  function unlockAudio() {
    var c = ctx();
    if (c && c.state === 'suspended') {
      try { c.resume(); } catch (e) {}
    }
    return c;
  }

  function isAudioUnlocked() {
    var c = ctx();
    return !!c && c.state === 'running';
  }

  // 短提示音：oscillator(sine,~880Hz)→gain(0→peak→0 ramp ~150ms)→destination
  function playBeep(opts) {
    opts = opts || {};
    var c = ctx();
    if (!c) return;
    if (c.state === 'suspended') { try { c.resume(); } catch (e) {} }
    var freq = opts.freq || 880;
    var dur = opts.duration || 0.15;
    var peak = opts.gain || 0.15;
    var type = opts.type || 'sine';

    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  // —— 新消息浮动卡片（单实例，仿 csModal.toast：先移除已存在的）——
  var popupTimer = null;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function popup(opts) {
    opts = opts || {};
    var old = document.querySelector('.nm-popup-host');
    if (old) old.parentNode.removeChild(old);
    if (popupTimer) { clearTimeout(popupTimer); popupTimer = null; }

    var name = opts.name || '用户';
    var host = document.createElement('div');
    host.className = 'nm-popup-host';
    host.innerHTML =
      '<div class="nm-close" title="关闭">✕</div>' +
      '<div class="nm-header">' +
        '<div class="nm-avatar">' + escapeHtml(name.charAt(0)) + '</div>' +
        '<div class="nm-name">' + escapeHtml(name) + '</div>' +
      '</div>' +
      '<div class="nm-preview">' + escapeHtml(opts.preview || '您有一条新消息') + '</div>' +
      '<div class="nm-actions">' +
        '<button class="nm-btn" data-act="open">立即查看</button>' +
      '</div>';
    document.body.appendChild(host);

    function dismiss() {
      if (popupTimer) { clearTimeout(popupTimer); popupTimer = null; }
      host.classList.remove('show');
      setTimeout(function () { if (host.parentNode) host.parentNode.removeChild(host); }, 250);
    }

    host.addEventListener('click', function (e) {
      var t = e.target;
      if (t.classList.contains('nm-close')) { dismiss(); return; }
      var btn = t.closest('.nm-btn');
      if (btn) {
        var act = btn.getAttribute('data-act');
        dismiss();
        if (act === 'open' && typeof opts.onOpen === 'function') opts.onOpen();
      }
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { host.classList.add('show'); });
    });
    popupTimer = setTimeout(dismiss, opts.duration || 5000);
  }

  window.csNotify = {
    playBeep: playBeep,
    unlockAudio: unlockAudio,
    isAudioUnlocked: isAudioUnlocked,
    popup: popup
  };
})();
