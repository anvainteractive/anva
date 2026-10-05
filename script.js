/* =========================================================
   ANVA — Official Website · script.js
   ========================================================= */


/* #########################################################
   ###                 STATUS CONFIG                     ###
   #########################################################

   Change the status of anything here — nothing else needed.

   Available statuses:
     "operational"   → green   · Operational
     "disruption"    → orange  · Disruption
     "outage"        → red     · Outage
     "maintenance"   → yellow  · Maintenance
     "development"   → blue    · In Development

   Per item:
     name    → shown name
     tag     → small grey text next to the name (optional, "" = none)
     status  → one of the statuses above
     note    → short message under the name (optional, "" = none)

   The big banner on top updates itself automatically.
   If you want your own banner text, fill in BANNER_OVERRIDE.
   ######################################################### */

const STATUS_CONFIG = {

  "Roblox Games": [
    { name: "ANVA Horizon Resort", tag: "",          status: "disruption",  note: "We're aware of the issues and working on a fix." },
    { name: "ANVA",                tag: "Club Game", status: "development", note: "" },
    { name: "Snack World",         tag: "",          status: "development", note: "" },
  ],

  "Discord": [
    { name: "Genius Hub",        tag: "", status: "operational", note: "" },
    { name: "ANVA Main Discord", tag: "", status: "operational", note: "" },
  ],

  "Systems": [
    { name: "ANVA RankHub",                     tag: "", status: "development", note: "" },
    { name: "ANVA Horizon Resort Training Hub", tag: "", status: "development", note: "" },
    { name: "Snack World Training Hub",         tag: "", status: "development", note: "" },
  ],

};

// Optional custom banner. Leave title as "" to use the automatic banner.
const BANNER_OVERRIDE = {
  title: "",
  text:  "",
  status: "disruption"   // colour of the custom banner
};

/* #########################################################
   ###              ANVA HUB · POSTS CONFIG              ###
   #########################################################

   Posts are shown in the same order as listed here
   → put new posts at the TOP.

   Per post:
     id        → unique short name, no spaces (used for share links)
     category  → small label, e.g. "Announcement", "Event", "Update"
     date      → shown date, e.g. "Oct 5, 2026" ("" = none)
     pinned    → true = shows a "Pinned" label
     title     → headline
     text      → list of paragraphs, each in "quotes", separated by commas
     button    → optional button under the text, e.g.
                 { label: "Apply now", url: "https://..." }
                 or null for no button

   Small extras you can use inside text:
     <strong>bold</strong>
     <a href="https://...">link</a>
     <a href="#events" data-tab="events">Events tab</a>   (links to a tab)
   ######################################################### */

const POSTS_CONFIG = [

  {
    id: "halloween-2026",
    category: "Event",
    date: "Oct 5, 2026",
    pinned: false,
    title: "🎃 Halloween is coming to all ANVA games",
    text: [
      "Get ready — we're bringing Halloween events to <strong>all of our games</strong> this year. ANVA Horizon Resort, ANVA and Snack World will all get their own spooky touch.",
      "Keep an eye on the <a href=\"#events\" data-tab=\"events\">Events</a> tab for more info."
    ],
    button: null
  },

  {
    id: "website-launch",
    category: "Announcement",
    date: "Oct 5, 2026",
    pinned: true,
    title: "Our new website is live!",
    text: [
      "Welcome to the brand-new ANVA website. From now on you'll find everything in one place: the latest news right here in the ANVA Hub, live game status, upcoming events and answers to common questions in the Genius Hub.",
      "Thank you for being part of the community — this is just the beginning."
    ],
    button: { label: "Join our Discord", url: "https://discord.gg/VMM2MMKYe4" }
  },

];

/* ############### END OF CONFIG ############### */


const STATUS_TYPES = {
  operational: { label: "Operational",    cls: "ok"    },
  disruption:  { label: "Disruption",     cls: "warn"  },
  outage:      { label: "Outage",         cls: "down"  },
  maintenance: { label: "Maintenance",    cls: "maint" },
  development: { label: "In Development", cls: "dev"   }
};

document.addEventListener("DOMContentLoaded", () => {
  splitLetters(document.querySelector(".loader-wordmark"));
  splitLetters(document.querySelector(".hero-title"));
  renderStatus();
  initStatusTime();
  renderPosts();
  initPosts();
  initLoader();
  initTabs();
  initMobileNav();
  initFaq();
  initCountdown();
  initFx();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- ANVA Hub feed (built from POSTS_CONFIG) ---------- */
const ICON_HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2 0 3.3 1.1 4 2.3h.1c.7-1.2 2-2.3 4-2.3 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21Z"/></svg>';
const ICON_SHARE = '<svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1Z"/></svg>';

function renderPosts() {
  const feed = document.getElementById("feed");
  // Pinned posts first, otherwise keep config order
  const posts = [...POSTS_CONFIG].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (!posts.length) {
    feed.innerHTML = '<p class="feed-empty">No posts yet — check back soon.</p>';
    return;
  }

  feed.innerHTML = posts.map(post => {
    const meta = ["@ANVA", post.category, post.date].filter(Boolean).map(esc).join(" · ");
    const paragraphs = (post.text || []).map(t => `<p>${t}</p>`).join("");
    const button = post.button && post.button.url
      ? `<a class="btn btn-gold post-btn" href="${esc(post.button.url)}" target="_blank" rel="noopener">${esc(post.button.label || "Open")}</a>`
      : "";
    return `
      <article class="post card${post.pinned ? " pinned" : ""}" data-post="${esc(post.id)}">
        ${post.pinned ? '<span class="pin-label">✦ Pinned</span>' : ""}
        <header class="post-head">
          <div class="avatar">A</div>
          <div>
            <strong>ANVA <span class="verified" title="Official">✦</span></strong>
            <span class="post-meta">${meta}</span>
          </div>
        </header>
        <h3 class="post-title">${esc(post.title)}</h3>
        ${paragraphs}
        ${button}
        <footer class="post-actions">
          <button class="action like" aria-pressed="false">${ICON_HEART}<span class="like-label">Like</span> <span class="count">0</span></button>
          <button class="action share">${ICON_SHARE} Share</button>
        </footer>
      </article>`;
  }).join("");
}

/* ---------- Status page (built from STATUS_CONFIG) ---------- */
function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderStatus() {
  const groupsEl = document.getElementById("statusGroups");
  const legendEl = document.getElementById("statusLegend");
  const bannerEl = document.getElementById("statusBanner");
  const allItems = [];

  // Groups
  groupsEl.innerHTML = Object.entries(STATUS_CONFIG).map(([group, items]) => {
    const rows = items.map(item => {
      const type = STATUS_TYPES[item.status] || STATUS_TYPES.operational;
      allItems.push({ ...item, type });
      return `
        <li>
          <div class="status-info">
            <span class="status-name">${esc(item.name)}${item.tag ? ` <small>${esc(item.tag)}</small>` : ""}</span>
            ${item.note ? `<span class="status-note">${esc(item.note)}</span>` : ""}
          </div>
          <span class="badge badge-${type.cls}">${type.label}</span>
        </li>`;
    }).join("");
    return `
      <div class="status-group card">
        <h3 class="status-group-title">${esc(group)}</h3>
        <ul class="status-list">${rows}</ul>
      </div>`;
  }).join("");

  // Legend (only statuses that are actually used)
  const used = [...new Set(allItems.map(i => i.status))].filter(s => STATUS_TYPES[s]);
  legendEl.innerHTML = Object.keys(STATUS_TYPES)
    .filter(s => used.includes(s))
    .map(s => `<span><i class="dot dot-${STATUS_TYPES[s].cls}"></i>${STATUS_TYPES[s].label}</span>`)
    .join("");

  // Banner
  let title, text, cls;
  if (BANNER_OVERRIDE.title) {
    title = BANNER_OVERRIDE.title;
    text = BANNER_OVERRIDE.text;
    cls = (STATUS_TYPES[BANNER_OVERRIDE.status] || STATUS_TYPES.disruption).cls;
  } else {
    const outage = allItems.filter(i => i.status === "outage");
    const disrupted = allItems.filter(i => i.status === "disruption");
    const maint = allItems.filter(i => i.status === "maintenance");
    const names = list => list.map(i => i.name).join(", ");

    if (outage.length) {
      cls = "down";
      title = "Major outage";
      text = `${names(outage)} ${outage.length > 1 ? "are" : "is"} currently down. Our team is working on it.`;
    } else if (disrupted.length) {
      cls = "warn";
      title = "Partial disruption";
      text = `${names(disrupted)} ${disrupted.length > 1 ? "are" : "is"} currently experiencing issues. Our team is working on it.`;
    } else if (maint.length) {
      cls = "maint";
      title = "Scheduled maintenance";
      text = `${names(maint)} ${maint.length > 1 ? "are" : "is"} currently under maintenance.`;
    } else {
      cls = "ok";
      title = "All systems operational";
      text = "Everything is running smoothly.";
    }
  }

  bannerEl.className = `status-banner banner-${cls}`;
  bannerEl.innerHTML = `
    <span class="dot dot-${cls} pulse"></span>
    <div>
      <strong>${esc(title)}</strong>
      ${text ? `<p>${esc(text)}</p>` : ""}
    </div>
    <span class="status-updated" id="statusUpdated"></span>`;
}

/* ---------- Safe localStorage helpers ---------- */
function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) { return fallback; }
}

/* ---------- Loading screen ---------- */
function initLoader() {
  const loader = document.getElementById("loader");
  const fill = document.getElementById("loaderFill");
  const percent = document.getElementById("loaderPercent");
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 14 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add("done");
        document.body.classList.remove("is-loading");
        document.body.classList.add("ready");
        revealPanel(currentTab);
      }, 450);
    }
    fill.style.width = progress + "%";
    percent.textContent = Math.floor(progress) + "%";
  }, 140);
}

/* ---------- Tabs (hash based, so links are shareable) ---------- */
const TABS = ["home", "status", "genius", "events", "hub"];

let currentTab = "home";

function showTab(name) {
  if (!TABS.includes(name)) name = "home";
  currentTab = name;

  document.querySelectorAll("[data-tab-panel]").forEach(panel => {
    panel.classList.toggle("active", panel.dataset.tabPanel === name);
  });
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.tab === name);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  revealPanel(name);
  moveIndicator();
}

function initTabs() {
  document.addEventListener("click", e => {
    const link = e.target.closest("[data-tab]");
    if (!link) return;
    e.preventDefault();
    const name = link.dataset.tab;
    if (location.hash !== "#" + name) history.pushState(null, "", "#" + name);
    showTab(name);
    closeMobileNav();
  });

  window.addEventListener("popstate", () => showTab(location.hash.slice(1).split("/")[0]));

  // Support direct links to a post (#hub/post-id) and to tabs (#status)
  const hash = location.hash.slice(1);
  const [tab, post] = hash.split("/");
  showTab(tab);
  if (post) {
    setTimeout(() => {
      const el = document.querySelector(`[data-post="${post}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 2600);
  }
}

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
}
function closeMobileNav() {
  document.getElementById("navToggle").classList.remove("open");
  document.getElementById("navLinks").classList.remove("open");
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  document.querySelectorAll(".faq-q").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

/* ---------- Halloween countdown ---------- */
function initCountdown() {
  const els = {
    d: document.getElementById("cdDays"),
    h: document.getElementById("cdHours"),
    m: document.getElementById("cdMins"),
    s: document.getElementById("cdSecs")
  };
  const now = new Date();
  let target = new Date(now.getFullYear(), 9, 31, 0, 0, 0); // Oct 31
  if (now > new Date(now.getFullYear(), 10, 1)) target.setFullYear(now.getFullYear() + 1);

  const pad = n => String(n).padStart(2, "0");

  function update() {
    let diff = Math.max(0, target - new Date());
    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000);  diff %= 3600000;
    const m = Math.floor(diff / 60000);    diff %= 60000;
    const s = Math.floor(diff / 1000);
    setDigit(els.d, pad(d));
    setDigit(els.h, pad(h));
    setDigit(els.m, pad(m));
    setDigit(els.s, pad(s));
  }
  update();
  setInterval(update, 1000);
}

/* ---------- ANVA Hub: Like & Share ---------- */
function initPosts() {
  const liked = load("anva-liked", {});

  document.querySelectorAll(".post").forEach(post => {
    const id = post.dataset.post;
    const likeBtn = post.querySelector(".like");
    const count = post.querySelector(".count");
    const shareBtn = post.querySelector(".share");

    const render = () => {
      const isLiked = !!liked[id];
      likeBtn.classList.toggle("liked", isLiked);
      likeBtn.setAttribute("aria-pressed", isLiked);
      post.querySelector(".like-label").textContent = isLiked ? "Liked" : "Like";
      count.textContent = isLiked ? 1 : 0;
    };
    render();

    likeBtn.addEventListener("click", () => {
      liked[id] = !liked[id];
      store("anva-liked", liked);
      render();
      if (liked[id]) burst(likeBtn);
    });

    shareBtn.addEventListener("click", async () => {
      const url = location.origin + location.pathname + "#hub/" + id;
      const title = post.querySelector(".post-title").textContent;

      if (navigator.share) {
        try { await navigator.share({ title: "ANVA — " + title, url }); return; }
        catch (e) { if (e.name === "AbortError") return; }
      }
      try {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard");
      } catch (e) {
        toast("Couldn't copy the link");
      }
    });
  });
}

/* ---------- Status "last checked" time ---------- */
function initStatusTime() {
  const el = document.getElementById("statusUpdated");
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  el.textContent = "Last checked " + time;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}


/* =========================================================
   FX — animations & effects
   ========================================================= */
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function splitLetters(el) {
  if (!el) return;
  const text = el.textContent.trim();
  el.setAttribute("aria-label", text);
  el.innerHTML = [...text].map((ch, i) => `<span aria-hidden="true" style="--i:${i}">${ch}</span>`).join("");
}

function setDigit(el, value) {
  if (el.textContent === value) return;
  el.textContent = value;
  el.classList.remove("tick");
  void el.offsetWidth; // restart animation
  el.classList.add("tick");
}

function burst(btn) {
  const b = document.createElement("span");
  b.className = "burst";
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement("i");
    dot.style.setProperty("--a", i * 45 + "deg");
    b.appendChild(dot);
  }
  btn.appendChild(b);
  setTimeout(() => b.remove(), 700);
}

/* ---------- Scroll reveal ---------- */
let revealObserver;
function revealPanel(name) {
  const panel = document.querySelector(`[data-tab-panel="${name}"]`);
  if (!panel) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || !document.body.classList.contains("ready")) return;
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  }

  const targets = panel.querySelectorAll(
    ".page-head > *, .section-head, .card, .faq-item, .status-banner, .status-legend, .note"
  );
  targets.forEach((el, i) => {
    el.classList.remove("in");
    el.classList.add("reveal");
    el.style.setProperty("--d", Math.min(i, 6) * 80 + "ms");
    revealObserver.unobserve(el);
    revealObserver.observe(el);
  });
}

/* ---------- Nav indicator ---------- */
function moveIndicator() {
  const ind = document.getElementById("navIndicator");
  const active = document.querySelector(".nav-link.active");
  if (!ind || !active) return;
  ind.style.width = active.offsetWidth - 28 + "px";
  ind.style.transform = `translateX(${active.offsetLeft + 14}px)`;
}

function initFx() {
  // Nav shadow + scroll progress
  const nav = document.getElementById("nav");
  const bar = document.getElementById("scrollProgress");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Indicator position (also after fonts load / resize)
  moveIndicator();
  if (document.fonts) document.fonts.ready.then(moveIndicator);
  window.addEventListener("resize", moveIndicator);

  // Card spotlight follows the mouse
  document.addEventListener("pointermove", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });

  // Hero glow parallax
  const hero = document.querySelector(".hero");
  const glow = document.getElementById("heroGlow");
  if (hero && glow && !REDUCED_MOTION) {
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      glow.style.translate = `${x * 60}px ${y * 40}px`;
    });
    hero.addEventListener("pointerleave", () => { glow.style.translate = "0 0"; });
  }

  initParticles();
}

/* ---------- Gold dust particles in the hero ---------- */
function initParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || REDUCED_MOTION) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0;
  const particles = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(initial) {
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: Math.random() * 1.4 + 0.3,
      v: Math.random() * 0.35 + 0.08,
      a: Math.random() * 0.6 + 0.25,
      t: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.2
    };
  }

  function loop() {
    requestAnimationFrame(loop);
    if (!canvas.offsetParent) return;               // hero not visible
    if (canvas.offsetWidth !== w || canvas.offsetHeight !== h) {
      resize();
      particles.length = 0;
      const count = w < 600 ? 30 : 70;
      for (let i = 0; i < count; i++) particles.push(spawn(true));
    }
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.y -= p.v;
      p.t += 0.02;
      p.x += p.drift + Math.sin(p.t) * 0.15;
      if (p.y < -10) { particles[i] = spawn(false); return; }
      const fade = Math.min(1, p.y / (h * 0.35));
      const alpha = p.a * (0.6 + 0.4 * Math.sin(p.t * 2)) * fade;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 200, 150, ${Math.max(0, alpha)})`;
      ctx.shadowColor = "rgba(226, 200, 150, .8)";
      ctx.shadowBlur = p.r * 4;
      ctx.fill();
    });
  }
  loop();
}
