/* =========================================
   K-Drama Lovers — Main JS v3
   ========================================= */

/* ---- Loading Screen (first visit ONLY, never again in same session) ---- */
(function () {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  // If already seen this session, skip instantly and remove
  if (sessionStorage.getItem('kdl_loaded')) {
    screen.style.display = 'none';
    screen.remove();
    return;
  }

  // Mark as seen so returning to home won't replay it
  sessionStorage.setItem('kdl_loaded', '1');

  // Animate percentage counter
  const pctEl = screen.querySelector('.ls-pct');
  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(100, pct + Math.ceil(Math.random() * 4 + 1));
    if (pctEl) pctEl.textContent = pct + '%';
    if (pct >= 100) clearInterval(timer);
  }, 40);

  window.addEventListener('load', () => {
    setTimeout(() => {
      screen.classList.add('hidden');
      setTimeout(() => screen.remove(), 900);
    }, 2300);
  });
})();

/* ---- Scroll to Top ---- */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () =>
    scrollTopBtn.classList.toggle('visible', window.scrollY > 280));
  scrollTopBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Scroll Reveal ---- */
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.07, rootMargin: '0px 0px -28px 0px' }
);
function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

/* ---- Active Navbar ---- */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').replace('../', '');
    const hPage = href.split('/').pop().split('?')[0];
    if (page === 'about.html' && hPage === 'about.html') link.classList.add('active');
    if (page === 'contact.html' && hPage === 'contact.html') link.classList.add('active');
    if ((page === 'index.html' || page === '') && (hPage === 'index.html' || href.includes('index.html'))) link.classList.add('active');
  });
}

/* ---- Genre Dropdown: mark active item ---- */
function setActiveGenreDropdown() {
  const params = new URLSearchParams(window.location.search);
  const genre = params.get('genre');
  if (!genre) return;
  document.querySelectorAll('.dropdown-item[data-genre]').forEach(item => {
    if (item.dataset.genre === genre) item.classList.add('active-genre');
  });
  // Mark the Genre toggle as active
  const toggle = document.querySelector('.nav-genre-dropdown .nav-link');
  if (toggle) toggle.classList.add('active');
}

/* ---- Live Search (movies.html) ---- */
function initMovieSearch() {
  const input = document.getElementById('movie-search');
  if (!input) return;
  input.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    let visible = 0;
    document.querySelectorAll('[data-title]').forEach(card => {
      const match = !q
        || card.dataset.title.toLowerCase().includes(q)
        || (card.dataset.genre || '').toLowerCase().includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    const nr = document.getElementById('no-results');
    if (nr) nr.classList.toggle('show', visible === 0 && q.length > 0);
  });
}

/* ---- Filter Tabs (movies.html) ---- */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  if (!tabs.length) return;

  function applyFilter(filter) {
    tabs.forEach(t => t.classList.remove('active'));
    const activeTab = [...tabs].find(t => t.dataset.filter === filter) || tabs[0];
    activeTab.classList.add('active');
    document.querySelectorAll('[data-genre]').forEach(card => {
      card.style.display =
        filter === 'all' || (card.dataset.genre || '').toLowerCase().includes(filter)
          ? '' : 'none';
    });
    const input = document.getElementById('movie-search');
    if (input) input.value = '';
    const nr = document.getElementById('no-results');
    if (nr) nr.classList.remove('show');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function () { applyFilter(this.dataset.filter); });
  });

  // Auto-apply from URL
  const genre = new URLSearchParams(window.location.search).get('genre');
  if (genre) applyFilter(genre);
}

/* ---- Home Search ---- */
function initHomeSearch() {
  const input = document.getElementById('home-search');
  if (!input) return;
  input.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    document.querySelectorAll('.movie-card').forEach(card => {
      const match = !q || (card.dataset.title || '').toLowerCase().includes(q);
      card.style.display = match ? '' : 'none';
    });
    document.querySelectorAll('.genre-section').forEach(sec => {
      const hasVisible = [...sec.querySelectorAll('.movie-card')].some(c => c.style.display !== 'none');
      sec.style.display = hasVisible ? '' : 'none';
    });
  });
}

/* ---- Contact Form ---- */


/* ---- Init on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  setActiveNav();
  setActiveGenreDropdown();
  initMovieSearch();
  initFilterTabs();
  initHomeSearch();
  initContactForm();
});
