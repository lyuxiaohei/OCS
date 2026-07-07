/* ============================================================
   kb-tree-crud.js — 知识库 3 页（话术库/FAQ/知识文档）共享
   左侧分类树 增/删/改（CRUD），不渲染节点装饰图标（tree-icon）。
   依赖：cs-modal.js（csModal）、cs-icons.js（csIcon 可选）。
   ============================================================ */
(function () {
  if (!window.csModal) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var toast = function (t) { if (csModal.toast) csModal.toast(t); };
  var tree = document.querySelector('.category-tree');
  if (!tree) return;

  // 节点装饰图标不恢复（保持无 icon）；仅恢复操作按钮（编辑/新增子类/删除）
  function icon(name, fallback) { return (window.csIcon ? csIcon(name, 12) : fallback); }
  function actionsHtml() {
    return '<a title="编辑">' + icon('edit', '✎') + '</a>' +
           '<a title="新增子类">' + icon('plus', '+') + '</a>' +
           '<a title="删除" class="cat-del">' + icon('trash', '✗') + '</a>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  var seq = 1000;
  function buildNode(name, count, isChild) {
    var div = document.createElement('div');
    div.className = 'tree-node';
    div.setAttribute('data-cat', 'custom-' + (++seq));
    if (isChild) div.style.paddingLeft = '38px';
    div.innerHTML =
      '<span class="tree-label">' + esc(name) + '</span>' +
      '<span class="tree-count">' + (count || 0) + '</span>' +
      '<span class="tree-actions">' + actionsHtml() + '</span>';
    return div;
  }

  // 1. 给既有业务分类节点补「编辑/新增子类/删除」操作（跳过 all / 回收站）
  $$('.tree-node', tree).forEach(function (node) {
    var cat = node.getAttribute('data-cat') || '';
    if (cat === 'all' || cat === 'trash' || node.querySelector('.tree-actions')) return;
    var act = document.createElement('span');
    act.className = 'tree-actions';
    act.innerHTML = actionsHtml();
    node.appendChild(act);
  });

  function openCategoryModal(opts) {
    var titleText = $('.tree-title', tree).textContent.trim();
    csModal.open('modals/modal-category.html?mode=' + (opts.mode || 'add') +
      '&title=' + encodeURIComponent(opts.title || '') +
      '&name=' + encodeURIComponent(opts.name || '') +
      '&parent=' + encodeURIComponent(opts.parent || titleText),
      { variant: 'center', width: 440,
        onConfirm: function (d) { if (d && d.name) opts.onConfirm(d.name); } });
  }
  function deleteCategory(node) {
    var name = $('.tree-label', node).textContent.trim();
    var cnt = $('.tree-count', node);
    var n = cnt ? (parseInt(cnt.textContent, 10) || 0) : 0;
    csModal.open('modals/modal-delete-confirm.html?title=' + encodeURIComponent('确认删除该分类？') +
      '&desc=' + encodeURIComponent(n > 0
        ? '分类「' + name + '」下有 ' + n + ' 条内容，删除后内容将归入「全部」，且不可恢复。'
        : '分类「' + name + '」删除后不可恢复。'),
      { variant: 'center', width: 380,
        onConfirm: function () { node.remove(); toast('已删除分类：' + name); } });
  }

  // 2. 头部「+」新增一级分类
  var headerAdd = $('.tree-add', tree);
  if (headerAdd) {
    headerAdd.addEventListener('click', function () {
      openCategoryModal({ mode: 'add', title: '新增分类',
        onConfirm: function (name) {
          tree.appendChild(buildNode(name, 0, false));
          toast('已新增分类：' + name);
        }
      });
    });
  }

  // 3. 动作委派（捕获阶段，避免触发节点既有筛选 handler）
  tree.addEventListener('click', function (e) {
    var a = e.target.closest('.tree-actions a');
    if (!a) return;
    var title = a.getAttribute('title') || '';
    if (title !== '编辑' && title !== '新增子类' && title !== '删除') return;
    e.preventDefault();
    e.stopPropagation();
    var node = a.closest('.tree-node');
    var name = $('.tree-label', node).textContent.trim();
    if (title === '编辑') {
      openCategoryModal({ mode: 'edit', title: '编辑分类', name: name,
        onConfirm: function (nm) { var lbl = $('.tree-label', node); if (lbl) lbl.textContent = nm; toast('分类已重命名为：' + nm); } });
    } else if (title === '新增子类') {
      openCategoryModal({ mode: 'add', title: '新增子分类', parent: name,
        onConfirm: function (nm) { node.parentNode.insertBefore(buildNode(nm, 0, true), node.nextSibling); toast('已新增子分类：' + nm); } });
    } else {
      deleteCategory(node);
    }
  }, true);
})();
