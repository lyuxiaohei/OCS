# -*- coding: utf-8 -*-
"""PRD-客服工单-V0.7.md → 独立发布 HTML(样式参考 汽车物流包装租赁 P1-R01 需求框架)。"""
import io
import re
import sys

import markdown

sys.stdout.reconfigure(encoding='utf-8')

SRC = r'D:\工作台-吕道远\5-【ACTIVE】在线客服\prototype\PRD\客服工单\PRD-客服工单-V0.7.md'
DST = r'D:\工作台-吕道远\5-【ACTIVE】在线客服\prototype\PRD\客服工单\PRD-客服工单-V0.7.html'
MERMAID = r'C:\Users\Administrator\AppData\Local\Temp\mermaid.min.js'

md_text = io.open(SRC, encoding='utf-8').read()

body = markdown.markdown(md_text, extensions=['tables', 'fenced_code', 'toc'])

# mermaid 代码块 → <div class="mermaid">(mermaid@10 startOnLoad 自动渲染;离线失败时显示源码)
def mermaid_repl(m):
    return '<div class="mermaid">' + m.group(1) + '</div>'

body = re.sub(
    r'<pre><code class="language-mermaid">([\s\S]*?)</code></pre>',
    lambda m: mermaid_repl(m),
    body,
)
# 其余代码块包 details 折叠(参考样式组件)
body = re.sub(
    r'<pre><code(?: class="language-([\w-]+)")?>([\s\S]*?)</code></pre>',
    lambda m: ('<details><summary>代码 / 结构(' + (m.group(1) or 'text') + ')</summary><pre><code>'
               + m.group(2) + '</code></pre></details>'),
    body,
)

# 页首折叠目录(从 h2 采集)
toc_items = re.findall(r'<h2 id="([^"]+)">([\s\S]*?)</h2>', body)
toc_html = ''.join(
    '<li><a href="#{0}">{1}</a></li>'.format(i, re.sub(r'<[^>]+>', '', t)) for i, t in toc_items
)
toc_block = ('<details class="toc"><summary>目录(点击展开,{0} 章)</summary><ol>{1}</ol></details>'
             .format(len(toc_items), toc_html)) if toc_items else ''

mermaid_js = io.open(MERMAID, encoding='utf-8').read()
# 内联安全转义:字符串字面量中的 <!-- 会扰乱 HTML script 解析状态机,\x21 等价 ! 且字符串值不变
mermaid_js = mermaid_js.replace('"<!-->"', '"<\\x21-->"').replace('"<!---->"', '"<\\x21---->"')
assert '<!--' not in mermaid_js, '仍有未转义的 <!--'

CSS = '''
:root{--ink:#111827;--muted:#6b7280;--accent:#2563eb;--line:#e5e7eb;--soft:#f8fafc}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'Segoe UI','Microsoft YaHei',sans-serif;color:var(--ink);background:#fff;line-height:1.75;font-size:15px}
.page{max-width:960px;margin:0 auto;padding:48px 56px 72px}
h1{font-size:26px;margin:8px 0 20px;letter-spacing:.01em}
h2{font-size:20px;margin:40px 0 14px;padding-bottom:8px;border-bottom:2px solid var(--ink)}
h3{font-size:16px;margin:26px 0 10px;padding-left:10px;border-left:4px solid var(--accent)}
h4{font-size:14.5px;margin:20px 0 8px;color:#374151}
p{margin:8px 0}
blockquote{margin:10px 0;padding:8px 16px;background:var(--soft);border-left:3px solid #94a3b8;color:#374151;border-radius:0 6px 6px 0}
blockquote p{margin:4px 0}
table{border-collapse:collapse;width:100%;margin:14px 0;font-size:13.5px}
th{background:#1f3864;color:#fff;font-weight:600;text-align:left;padding:8px 10px;border:1px solid #1f3864}
td{padding:7px 10px;border:1px solid var(--line);vertical-align:top}
tr:nth-child(even) td{background:#f9fafb}
img{max-width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin:12px 0;display:block}
details{border:1px solid var(--line);border-radius:8px;background:var(--soft);margin:12px 0;padding:0}
summary{cursor:pointer;padding:9px 14px;font-size:13px;color:var(--muted);user-select:none;list-style:none}
summary::before{content:'\\25B8  ';color:var(--accent)}
details[open] summary::before{content:'\\25BE  '}
details pre{margin:0 14px 14px}
pre{background:#f6f8fa;border:1px solid var(--line);border-radius:6px;padding:12px 14px;overflow-x:auto;font-size:12.5px;line-height:1.6}
code{font-family:Consolas,'Courier New',monospace}
p code,td code{background:#eef2f7;padding:1px 5px;border-radius:4px;font-size:12.5px}
ul,ol{margin:8px 0 8px 24px}
li{margin:4px 0}
hr{border:none;border-top:1px solid var(--line);margin:32px 0}
strong{color:#000}
.footer{margin-top:56px;padding-top:14px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}
details.toc ol{margin:6px 14px 14px 30px}
details.toc a{color:var(--accent);text-decoration:none}
details.toc a:hover{text-decoration:underline}
.mermaid{margin:14px 0;padding:12px;background:var(--soft);border:1px solid var(--line);border-radius:8px;text-align:center;overflow-x:auto}
@media print{.page{padding:0}h2{page-break-after:avoid}table,tr,img{page-break-inside:avoid}}
'''

html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>客服工单 PRD V0.7 — 商城运营后台</title>
<style>''' + CSS + '''</style>
</head>
<body><div class="page">
''' + toc_block + '''
''' + body + '''
<div class="footer">PRD-客服工单-V0.7 · 2026-09-01 · 评审稿(开发评审后修订) · 由 Markdown 原稿生成,修订请改 md 后重新转换</div>
</div>
<script>''' + mermaid_js + '''</script>
<script>mermaid.initialize({startOnLoad:true,theme:'neutral',flowchart:{useMaxWidth:true}});</script>
</body>
</html>
'''

io.open(DST, 'w', encoding='utf-8', newline='\n').write(html)
print('SAVED:', DST)
print('size:', round(len(html.encode("utf-8")) / 1024 / 1024, 2), 'MB |', '章节数:', len(toc_items))
