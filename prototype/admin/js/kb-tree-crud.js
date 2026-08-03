/* ============================================================
   kb-tree-crud.js — 知识库 3 页（话术库/FAQ/知识文档）共享
   左侧分类树 增/删/改（CRUD），仅 2 级：
   - 根目录（全部）= 一级分类：仅「新增子目录」，不支持编辑/删除
   - 其他分类 = 二级分类：编辑 / 删除（不支持新增子类，无第三级）
   - 快捷回复(quickreply) / 回收站(trash)：无增删改
   不渲染节点装饰图标。依赖：cs-modal.js、cs-icons.js(可选)。
   ============================================================ */
(function () {
  if (!window.csModal) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var toast = function (t) { if (csModal.toast) csModal.toast(t); };
  var tree = document.querySelector('.category-tree');
  if (!tree) return;

  function icon(name, fallback) { return (window.csIcon ? csIcon(name, 12) : fallback); }

  /* 操作按钮：root=仅新增子目录；leaf=编辑+删除 */
  function actionsHtml(level) {
    if (level === 'root') {
      return '<span class="tree-actions"><a title="新增子目录">' + icon('plus', '+') + '</a></span>';
    }
    return '<span class="tree-actions">' +
      '<a title="编辑">' + icon('edit', '✎') + '</a>' +
      '<a title="删除" class="cat-del">' + icon('trash', '✗') + '</a>' +
      '</span>';
  }

  function nodeLevel(node) {
    var cat = node.getAttribute('data-cat') || '';
    if (cat === 'all') return 'root';
    if (cat === 'trash' || cat === 'quickreply') return 'skip';
    return 'leaf';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  var seq = 1000;
  function buildNode(name, count) {
    var div = document.createElement('div');
    div.className = 'tree-node';
    div.setAttribute('data-cat', 'custom-' + (++seq));
    div.style.paddingLeft = '38px'; // 二级分类缩进
    div.innerHTML =
      '<span class="tree-label">' + esc(name) + '</span>' +
      '<span class="tree-count">' + (count || 0) + '</span>' +
      actionsHtml('leaf');
    return div;
  }

  // 1. 给既有节点补操作按钮 + 二级分类缩进
  $$('.tree-node', tree).forEach(function (node) {
    if (node.querySelector('.tree-actions')) return;
    var level = nodeLevel(node);
    if (level === 'skip') { node.style.paddingLeft = '38px'; return; } // 快捷回复/回收站：缩进、无操作
    if (level === 'leaf') node.style.paddingLeft = '38px'; // 二级分类缩进
    var act = document.createElement('span');
    act.className = 'tree-actions';
    act.innerHTML = actionsHtml(level);
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

  // 2. 头部「+」新增二级分类（与根目录「新增子目录」等价）
  var headerAdd = $('.tree-add', tree);
  if (headerAdd) {
    headerAdd.addEventListener('click', function () {
      openCategoryModal({ mode: 'add', title: '新增分类',
        onConfirm: function (name) {
          tree.appendChild(buildNode(name, 0));
          toast('已新增分类：' + name);
        }
      });
    });
  }

  // 3. 动作委派（捕获阶段）
  tree.addEventListener('click', function (e) {
    var a = e.target.closest('.tree-actions a');
    if (!a) return;
    var title = a.getAttribute('title') || '';
    if (title !== '编辑' && title !== '新增子目录' && title !== '删除') return;
    e.preventDefault();
    e.stopPropagation();
    var node = a.closest('.tree-node');
    var name = $('.tree-label', node) ? $('.tree-label', node).textContent.trim() : '';
    if (title === '新增子目录') {
      openCategoryModal({ mode: 'add', title: '新增分类',
        onConfirm: function (nm) { tree.appendChild(buildNode(nm, 0)); toast('已新增分类：' + nm); } });
    } else if (title === '编辑') {
      openCategoryModal({ mode: 'edit', title: '编辑分类', name: name,
        onConfirm: function (nm) { var lbl = $('.tree-label', node); if (lbl) lbl.textContent = nm; toast('分类已重命名为：' + nm); } });
    } else if (title === '删除') {
      deleteCategory(node);
    }
  }, true);
})();
