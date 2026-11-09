/* ============================================================
   PoodiCraft — site interactions (home page + portfolio page)
   ============================================================ */

// ---- Videos -----------------------------------------------------
// סרטון בכל שורה: קודם הכתובת (או המזהה) מיוטיוב, רווח, ואז שם הסרטון.
// אפשר להדביק כתובת מלאה, גם עם &t=... — הכל מסתדר לבד.
// שורה ריקה או שורה שמתחילה ב-// מתעלמים ממנה. הסדר כאן = הסדר באתר.
const VIDEOS_TEXT = `
uPQi3wbNjps&t=6s        ישראל פארטי עונה 4 - פרק 1 | ההתחלה
ZP-nAIoxpPU             סרטון המועמדות שלי לנייטפול!
D0rElH9-f1s&t=124s      לא תאמינו מה קרה בעולם ההישרדות שלי!
_TXyBGNtEBY&t=6s        סקיי מיינס | פרק 2 | פיקקס נדרייט | חלק ראשון
newda64qUIA&t=206s      אייפיקסל אלווין
SGtp7aUL7as&t=13s       וואן בלוק | פרק 2 | בית - קומה ראשונה
BJ5RZMPSNBQ&t=16s       וואן בלוק | פרק 1
QeW8tXkGk1o&t=15s       סקיי מיינס | פרק 1 | דיימונד פיקקס - חלק 1
`;
const EMPTY_SLOTS = 3; // כמה משבצות ריקות להציג כשאין סרטונים

// ---- המילה המתחלפת בכותרת בעמוד הבית -----------------------------
const ROTATING_WORDS = ['מיינקראפט', 'הישרדות', 'וואן בלוק', 'סקיי מיינס', 'הייפיקסל', 'שורטס'];

// Turns the text above into { id, start, title } items.
// Accepts a bare id, "id&t=30s", youtube.com/watch?v=…, youtu.be/…, shorts/…, embed/…
function parseVideos(text) {
  const out = [];
  text.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('//')) return;
    const m = line.match(/^(\S+)\s*(.*)$/);
    if (!m) return;
    const raw = m[1], title = m[2].trim();
    const idMatch = raw.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|^)([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/);
    if (!idMatch) return;
    const t = raw.match(/[?&]t=(\d+)/) || raw.match(/[?&]t=(\d+)s/);
    out.push({ id: idMatch[1], start: t ? +t[1] : 0, title });
  });
  return out;
}
const VIDEOS = parseVideos(VIDEOS_TEXT);

// ---- Discord ----------------------------------------------------
const DISCORD_USERNAME = 'PoodiCraft';
const DISCORD_INVITE   = 'https://discord.gg/zBKxaYnAXy';   // קישור ההזמנה לשרת (כמו שמופיע בערוץ)
const DISCORD_NOTE     = 'אנא פתחו טיקט בשרת הדיסקורד ואענה לכם בהקדם האפשרי.';

(function renderVideos() {
  const grid = document.getElementById('videosGrid');
  if (!grid) return;

  const playIcon = '<span><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg></span>';

  if (VIDEOS.length === 0) {
    for (let i = 0; i < EMPTY_SLOTS; i++) {
      const fig = document.createElement('figure');
      fig.className = 'video-item reveal';
      fig.style.setProperty('--d', (i * 0.05) + 's');
      fig.innerHTML = `
        <div class="thumb-frame empty">
          <span class="thumb-placeholder">הוסיפו סרטון<small>script.js → VIDEOS</small></span>
        </div>`;
      grid.appendChild(fig);
    }
    return;
  }

  VIDEOS.forEach((v, i) => {
    const a = document.createElement('a');
    a.className = 'video-item reveal';
    a.href = `https://www.youtube.com/watch?v=${v.id}` + (v.start ? `&t=${v.start}s` : '');
    a.target = '_blank';
    a.rel = 'noopener';
    a.style.setProperty('--d', (i * 0.05) + 's');
    a.innerHTML = `
      <div class="thumb-frame">
        <img src="https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg" alt="${v.title || ''}" loading="lazy"
             onload="if (this.naturalWidth < 200 && !this.dataset.hq) { this.dataset.hq = 1; this.src = 'https://i.ytimg.com/vi/${v.id}/hqdefault.jpg'; }"
             onerror="if (!this.dataset.hq) { this.dataset.hq = 1; this.src = 'https://i.ytimg.com/vi/${v.id}/hqdefault.jpg'; } else { this.parentNode.classList.add('empty'); }">
        <span class="thumb-placeholder">אין תמונה<small>${v.id}</small></span>
        <div class="play">${playIcon}</div>
      </div>
      ${v.title ? `<p class="video-title">${v.title}</p>` : ''}`;
    grid.appendChild(a);
  });
})();

// ---- Intro animation (home page; only when arriving from outside the site) ----
(function intro() {
  const el = document.getElementById('intro');
  if (!el) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let internal = false;                       // came from another page of this site?
  try {
    internal = !!document.referrer && new URL(document.referrer).host === location.host;
  } catch (e) {}

  if (reduced || internal) { el.remove(); return; }

  // the little blocks that build up behind the logo
  const holder = document.getElementById('introBlocks');
  const N = 3;                                  // ring reaches from -3 to +3
  for (let gy = -N; gy <= N; gy++) {
    for (let gx = -N; gx <= N; gx++) {
      if (Math.max(Math.abs(gx), Math.abs(gy)) !== N) continue;   // outer ring only
      const b = document.createElement('span');
      b.className = 'intro-block';
      b.style.setProperty('--x', gx);
      b.style.setProperty('--y', gy);
      b.style.setProperty('--d', (Math.random() * 0.45).toFixed(2) + 's');
      b.style.setProperty('--fx', (Math.random() * 2 - 1).toFixed(2));
      b.style.setProperty('--fy', (Math.random() * 2 - 1).toFixed(2));
      b.style.setProperty('--r', (Math.random() * 90 - 45).toFixed(0) + 'deg');
      holder.appendChild(b);
    }
  }

  document.body.classList.add('intro-locked');
  let done = false;
  const end = () => {
    if (done) return;
    done = true;
    el.classList.add('done');
    document.body.classList.remove('intro-locked');
    setTimeout(() => el.remove(), 900);
  };
  const timer = setTimeout(end, 2600);
  const skip = () => { clearTimeout(timer); end(); };
  el.addEventListener('click', skip, { once: true });
  window.addEventListener('keydown', skip, { once: true });
  window.addEventListener('wheel', skip, { once: true, passive: true });
})();

// ---- Hero: rotating keyword -------------------------------------
(function heroRotate() {
  const el = document.getElementById('heroRotate');
  if (!el || !ROTATING_WORDS.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % ROTATING_WORDS.length;
    el.classList.add('out');
    setTimeout(() => {
      el.textContent = ROTATING_WORDS[i];
      el.classList.remove('out');
    }, 280);
  }, 2600);
})();

// ---- Hero: "latest video" card ----------------------------------
(function heroLatest() {
  const card = document.getElementById('heroLatest');
  if (!card || !VIDEOS.length) return;
  const v = VIDEOS[0];
  card.href = `https://www.youtube.com/watch?v=${v.id}` + (v.start ? `&t=${v.start}s` : '');
  card.target = '_blank';
  card.rel = 'noopener';
  const img = card.querySelector('img');
  img.src = `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`;
  img.alt = v.title || '';
  card.querySelector('.hero-latest-title').textContent = v.title || 'צפייה בסרטון';
  card.hidden = false;
})();

// ---- Floating pixel cubes in the background --------------------
(function spawnCubes() {
  const container = document.getElementById('cubes');
  if (!container) return;
  const count = window.innerWidth < 720 ? 12 : 22;
  for (let i = 0; i < count; i++) {
    const cube = document.createElement('span');
    cube.className = 'cube';
    const size = 8 + Math.random() * 18;
    cube.style.setProperty('--s', size + 'px');
    cube.style.setProperty('--t', (14 + Math.random() * 16) + 's');
    cube.style.setProperty('--delay', (-Math.random() * 30) + 's');
    cube.style.left = Math.random() * 100 + '%';
    container.appendChild(cube);
  }
})();

// ---- Sticky nav style on scroll ---------------------------------
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile menu ------------------------------------------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  })
);

// ---- Scroll reveal ----------------------------------------------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => io.observe(el));

// ---- Cards: 3D tilt + mouse glow (gallery, videos, channel card) ------
document.querySelectorAll('.gallery-item, .video-item, .project-item, .channel-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- Portfolio hero cards: subtle parallax with mouse -----------
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer: fine)').matches) {
  const cards = heroVisual.querySelectorAll('.float-card');
  if (cards.length) {
    window.addEventListener('mousemove', (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5);
      const dy = (e.clientY / window.innerHeight - 0.5);
      cards.forEach((c, i) => {
        const depth = (i + 1) * 6;
        c.style.translate = `${dx * depth}px ${dy * depth}px`;
      });
    }, { passive: true });
  }
}

// ---- Lightbox for thumbnails (portfolio + project + game pages) ----
const lightbox = document.getElementById('lightbox');
let openLightbox = null;
if (lightbox) {
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  openLightbox = (src, alt = '') => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-item .thumb-frame, .float-card .thumb-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      if (frame.classList.contains('empty')) return; // nothing to show yet
      const img = frame.querySelector('img');
      openLightbox(img.src, img.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

// ---- Game page gallery: hide the section when no screenshot exists ----
(function gameGallery() {
  const grid = document.querySelector('.game-gallery');
  if (!grid) return;
  const section = grid.closest('section');
  const check = () => { if (!grid.querySelector('figure')) section.style.display = 'none'; };
  grid.querySelectorAll('img').forEach(img => img.addEventListener('error', () => setTimeout(check, 0)));
  setTimeout(check, 0);
})();

// ---- Screenshot viewer (project pages) ---------------------------
// Big stage + thumbnails. Thumbnails whose image is missing drop out on their own.
(function screenshotViewer() {
  const viewer = document.querySelector('.shots-viewer');
  if (!viewer) return;
  const stage = viewer.querySelector('.shots-stage');
  const mainFrame = viewer.querySelector('.shots-main');
  const mainImg = mainFrame.querySelector('img');
  const counter = viewer.querySelector('.shots-counter');
  const thumbsWrap = viewer.querySelector('.shots-thumbs');
  let thumbs = [...viewer.querySelectorAll('.shots-thumb')];
  let index = 0;

  function refresh() {
    thumbs = [...viewer.querySelectorAll('.shots-thumb')];
    viewer.classList.toggle('none', thumbs.length === 0);
    viewer.classList.toggle('single', thumbs.length === 1);
    if (thumbs.length === 0) { mainFrame.classList.add('empty'); return; }
    if (index >= thumbs.length) index = 0;
    show(index, false);
  }

  function show(i, animate = true) {
    index = (i + thumbs.length) % thumbs.length;
    const src = thumbs[index].dataset.src;
    thumbs.forEach((t, k) => t.classList.toggle('active', k === index));
    if (counter) counter.textContent = `${index + 1} / ${thumbs.length}`;
    mainFrame.classList.remove('empty');
    if (!animate) { mainImg.src = src; return; }
    stage.classList.add('fade');
    setTimeout(() => {
      mainImg.onload = () => stage.classList.remove('fade');
      mainImg.src = src;
    }, 200);
  }

  // tall (phone) screenshots get a portrait-shaped frame
  let shapeSet = false;
  function setShape(img) {
    if (shapeSet || !img.naturalWidth) return;
    shapeSet = true;
    viewer.classList.toggle('portrait', img.naturalHeight > img.naturalWidth);
  }

  // drop thumbnails whose file doesn't exist (whether it failed before or after we got here)
  thumbs.forEach(t => {
    const img = t.querySelector('img');
    const drop = () => { t.remove(); refresh(); };
    if (img.complete) { img.naturalWidth === 0 ? drop() : setShape(img); }
    else { img.addEventListener('error', drop); img.addEventListener('load', () => setShape(img), { once: true }); }
  });

  thumbsWrap.addEventListener('click', (e) => {
    const t = e.target.closest('.shots-thumb');
    if (t) show(thumbs.indexOf(t));
  });
  viewer.querySelector('.shots-arrow.prev').addEventListener('click', () => show(index - 1));
  viewer.querySelector('.shots-arrow.next').addEventListener('click', () => show(index + 1));
  mainFrame.addEventListener('click', () => {
    if (!mainFrame.classList.contains('empty') && openLightbox) openLightbox(mainImg.src);
  });

  // keyboard (when the lightbox is closed) — in RTL, "back" is the right arrow
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('open')) return;
    if (thumbs.length < 2) return;
    if (e.key === 'ArrowRight') show(index - 1);
    if (e.key === 'ArrowLeft') show(index + 1);
  });

  // swipe
  let startX = null;
  stage.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (startX === null || thumbs.length < 2) return;
    const dx = e.clientX - startX; startX = null;
    if (Math.abs(dx) > 40) show(dx > 0 ? index - 1 : index + 1);   // RTL: drag right = previous
  });

  refresh();
})();

// ---- Discord: small window with "copy username" / "my server" --------
const discordBtn = document.getElementById('discordBtn');
if (discordBtn) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'discordModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'discordModalTitle');
  modal.innerHTML = `
    <div class="modal-card">
      <button type="button" class="modal-close" aria-label="סגירה">&times;</button>
      <div class="modal-icon"><svg  viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.2a18.3 18.3 0 0 0-5.6 0L8.6 3a19.7 19.7 0 0 0-4.9 1.5C.6 9.1-.3 13.6.1 18a19.9 19.9 0 0 0 6 3l1.3-2a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4a12.9 12.9 0 0 1-2 1l1.3 2a19.8 19.8 0 0 0 6-3c.5-5.1-.8-9.6-3.6-13.6zM8 15.3c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.5 8 10.5s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4z"/></svg></div>
      <h3 id="discordModalTitle">דיסקורד</h3>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" id="copyDiscordBtn">
          העתקת שם משתמש — <span dir="ltr">${DISCORD_USERNAME}</span>
          <span class="copied">הועתק!</span>
        </button>
        <a class="btn btn-primary" id="discordServerBtn" href="${DISCORD_INVITE || '#'}" ${DISCORD_INVITE ? 'target="_blank" rel="noopener"' : ''}>
          לשרת הדיסקורד שלי
        </a>
        <p class="modal-note">${DISCORD_NOTE}</p>
        ${DISCORD_INVITE ? '' : '<p class="modal-hint">קישור השרת עוד לא הוגדר — מלאו את DISCORD_INVITE בתחילת script.js</p>'}
      </div>
    </div>`;
  document.body.appendChild(modal);

  const openModal = () => { modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  discordBtn.addEventListener('click', openModal);
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  const copyBtn = modal.querySelector('#copyDiscordBtn');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(DISCORD_USERNAME); } catch (e) {}
    copyBtn.classList.add('show-copied');
    setTimeout(() => copyBtn.classList.remove('show-copied'), 1400);
  });
  if (!DISCORD_INVITE) {
    modal.querySelector('#discordServerBtn').addEventListener('click', (e) => e.preventDefault());
  }
}

// ---- Footer year ------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();
