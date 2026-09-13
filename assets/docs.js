// OWLG docs: fetch + render markdown, sidebar, on-this-page TOC, link rewriting.
const DOCS = [
  { slug: 'getting-started', title: 'Getting Started', file: 'getting-started.md' },
  { slug: 'cli', title: 'CLI Reference', file: 'cli.md' },
  { slug: 'python-api', title: 'Python API', file: 'python-api.md' },
  { slug: 'node-api', title: 'Node.js / JavaScript API', file: 'node-api.md' },
  { slug: 'qgis', title: 'QGIS Plugin', file: 'qgis.md' },
  { slug: 'format', title: 'Format Specification', file: 'format.md' },
];

const current = document.body.dataset.doc;

function renderSidebar() {
  const nav = document.getElementById('doc-sidebar');
  if (!nav) return;
  nav.innerHTML = '<a href="/owlg/docs/" class="doc-home' + (current ? '' : ' on') + '">Overview</a>' +
    DOCS.map(d => `<a href="/owlg/docs/${d.slug}/"${d.slug === current ? ' class="on"' : ''}>${d.title}</a>`).join('');
}
renderSidebar();

// mobile sidebar toggle
document.querySelector('.doc-menu-btn')?.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
document.getElementById('doc-sidebar')?.addEventListener('click', e => { if (e.target.tagName === 'A') document.body.classList.remove('sidebar-open'); });

if (current) {
  const doc = DOCS.find(d => d.slug === current);
  const byFile = Object.fromEntries(DOCS.map(d => [d.file, d]));
  const content = document.getElementById('doc-content');
  const toc = document.getElementById('doc-toc');

  marked.setOptions({ headerIds: true, mangle: false });

  fetch(`/owlg/docs/content/${doc.file}`)
    .then(r => r.text())
    .then(md => {
      content.innerHTML = marked.parse(md);
      stripContentsBlock();
      processCodeBlocks();
      wrapTables();
      rewriteLinks();
      buildToc();
      scrollToFragment();
    });

  // same glass card every table on the site sits in (see .tbl in style.css)
  function wrapTables() {
    content.querySelectorAll('table').forEach(table => {
      const wrap = document.createElement('div');
      wrap.className = 'tbl glass';
      table.replaceWith(wrap);
      wrap.appendChild(table);
    });
  }

  function stripContentsBlock() {
    const heads = [...content.querySelectorAll('h2')];
    const start = heads.find(h => h.textContent.trim().toLowerCase() === 'contents');
    if (!start) return;
    let n = start.nextElementSibling;
    start.remove();
    while (n && n.tagName !== 'H2') { const next = n.nextElementSibling; n.remove(); n = next; }
  }

  // Terminal-session split, icon copy buttons and syntax colouring — shared
  // with the static pages via window.OwlaitCode (see assets/main.js).
  function processCodeBlocks() {
    content.querySelectorAll('pre').forEach(pre => {
      const cls = pre.querySelector('code')?.className || '';
      const lang = cls.match(/language-(\S+)/)?.[1];
      window.OwlaitCode.enhancePre(pre, lang);
    });
  }

  function rewriteLinks() {
    content.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      const m = href.match(/^([\w-]+)\.md(#.*)?$/);
      if (m && byFile[m[1] + '.md']) {
        a.href = `/owlg/docs/${byFile[m[1] + '.md'].slug}/${m[2] || ''}`;
      } else if (href.startsWith('../')) {
        a.href = 'https://github.com/fakmalpradana/owlait-owlg/blob/main/' + href.slice(3);
        a.target = '_blank'; a.rel = 'noopener';
      }
    });
  }

  function buildToc() {
    if (!toc) return;
    const heads = [...content.querySelectorAll('h2, h3')];
    toc.innerHTML = '<div class="toc-label">On this page</div>' +
      heads.map(h => `<a href="#${h.id}" class="lvl${h.tagName[1]}">${h.textContent}</a>`).join('');
    const links = [...toc.querySelectorAll('a')];
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const link = toc.querySelector(`a[href="#${e.target.id}"]`);
        if (link && e.isIntersecting) { links.forEach(l => l.classList.remove('on')); link.classList.add('on'); }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    heads.forEach(h => io.observe(h));
  }

  function scrollToFragment() {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }
}
