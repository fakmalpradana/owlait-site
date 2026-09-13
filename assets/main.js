// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// install tabs
document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => {
  document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x === b));
  document.querySelectorAll('[data-pane]').forEach(p => p.classList.toggle('on', p.dataset.pane === b.dataset.tab));
});

// copy buttons
document.querySelectorAll('.copy').forEach(b => b.onclick = async () => {
  await navigator.clipboard.writeText(b.nextElementSibling.textContent);
  b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1500);
});
