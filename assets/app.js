// Ganjineh website: today's couplet on the home page, and the pages behind shared links
// (/poem/2130?bayt=4, /poet/2, /book/24, /today, /fal, /search?q=…). On iPhone, iPad and Mac with
// the app installed, those links open Ganjineh directly; everyone else lands here.

// ---- Links: change them here and every page follows. An empty link hides its buttons' target
// (they fall back to the download section) or, for the donation chip, hides it. ----
const LINKS = {
  appStore: "https://apps.apple.com/us/app/ganjineh/id6822480269",
  macAppStore: "",  // same listing (universal purchase); leave empty to reuse appStore
  dmg: "https://github.com/alireza12t/ganjinehparsi.com/releases/latest/download/Ganjineh.dmg",
  donate: "",       // your donation page
  website: "https://alireza12t.github.io",
  linktree: "https://alireza12t.github.io/links/",
  github: "https://github.com/alireza12t",
  instagram: "https://instagram.com/devmvrick",
  youtube: "https://www.youtube.com/@DevMvRick",
  linkedin: "https://www.linkedin.com/in/alireza12t",
  issues: "https://github.com/alireza12t/ganjinehparsi.com/issues",
};

const API = "https://api.ganjoor.net/api/ganjoor";
const APP_SCHEME = "ganjineh://";
const FIRST_HAFEZ_GHAZAL = 2130;
const HAFEZ_GHAZALS = 495;

/** Same pick as the app: one Hafez ghazal per day, counted in the reader's local days since 1 Jan 2000. */
function dailyPoemId(date = new Date()) {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((local - Date.UTC(2000, 0, 1)) / 86400000);
  return FIRST_HAFEZ_GHAZAL + (((days % HAFEZ_GHAZALS) + HAFEZ_GHAZALS) % HAFEZ_GHAZALS);
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const faDigits = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

async function getJSON(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(response.status);
  return response.json();
}

/** Groups verses into couplets: right + left hemistich side by side, others on their own. */
function couplets(verses) {
  const sorted = [...verses].sort((a, b) => a.vOrder - b.vOrder);
  const lines = [];
  for (let i = 0; i < sorted.length; i++) {
    const v = sorted[i], next = sorted[i + 1];
    if ((v.versePosition === 0 && next?.versePosition === 1) || (v.versePosition === 2 && next?.versePosition === 3)) {
      lines.push({ index: v.coupletIndex, verses: [v, next] }); i++;
    } else {
      lines.push({ index: v.coupletIndex, verses: [v] });
    }
  }
  return lines;
}

// ---- Home: today's couplet ----
async function showDaily() {
  const box = document.querySelector("[data-daily]");
  if (!box) return;
  try {
    const id = dailyPoemId();
    const poem = await getJSON(`${API}/poem/${id}?verseDetails=true`);
    const first = couplets(poem.verses ?? [])[0];
    box.querySelector(".couplet").innerHTML = first.verses.map((v) => `<span class="m">${esc(v.text)}</span>`).join("");
    box.querySelector(".source").innerHTML = `حافظ · ${esc(poem.title)} — <a href="/poem/${id}">خواندن همهٔ غزل</a>`;
  } catch {
    box.querySelector(".couplet").textContent = "اَلا یا اَیُّهَا السّاقی اَدِرْ کَأساً و ناوِلْها";
  }
}

// ---- Shared-link pages ----
function openAppBar(appURL, label) {
  return `
    <div class="open-app">
      <div><div class="t">${label}</div><div class="s">Open in the Ganjineh app · در برنامهٔ گنجینه باز کنید</div></div>
      <a class="btn btn-gold" href="${appURL}">باز کردن</a>
    </div>`;
}

async function renderPoem(root, id, bayt) {
  const poem = await getJSON(`${API}/poem/${id}?catInfo=true&verseDetails=true`);
  const lines = couplets(poem.verses ?? []);
  const focus = bayt ? bayt - 1 : null;
  const poet = poem.category?.poet?.nickname || poem.category?.poet?.name || (poem.fullTitle || "").split("»")[0].trim();
  document.title = `${poem.title} · ${poet} — گنجینه`;
  root.innerHTML = `
    <article class="poem-card">
      <header class="poem-head">
        <div class="poet">${esc(poet)}</div>
        <h1>${esc(poem.title)}</h1>
        <div class="meta">${esc(poem.fullTitle)}</div>
      </header>
      <div class="ornament"></div>
      <div class="verses">
        ${lines.map((line) => {
          const [m1, m2] = line.verses;
          const cls = m2 ? "beyt" : "beyt single";
          const focused = focus !== null && line.index === focus ? " focus" : "";
          return `<div class="${cls}${focused}" id="b${(line.index ?? -1) + 1}">
              <span class="m1">${esc(m1.text)}</span>${m2 ? `<span class="m2">${esc(m2.text)}</span>` : ""}
            </div>`;
        }).join("")}
      </div>
      <p class="credit">متن از <a href="https://ganjoor.net${esc(poem.fullUrl)}">گنجور</a> · Text from Ganjoor</p>
    </article>
    ${openAppBar(`${APP_SCHEME}poem/${id}${bayt ? `?bayt=${bayt}` : ""}`, esc(poem.title))}`;
  if (focus !== null) document.getElementById(`b${focus + 1}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
}

async function renderPoet(root, id) {
  const page = await getJSON(`${API}/poet/${id}`);
  const poet = page.poet;
  document.title = `${poet.nickname || poet.name} — گنجینه`;
  root.innerHTML = `
    <article class="poem-card">
      <header class="poem-head">
        <img src="https://api.ganjoor.net${esc(poet.imageUrl)}" alt="" style="width:110px;height:110px;border-radius:50%;margin:0 auto 10px;border:3px solid var(--gold);object-fit:cover">
        <h1>${esc(poet.nickname || poet.name)}</h1>
        <div class="meta">${esc(poet.name)}</div>
      </header>
      <div class="ornament"></div>
      <p>${esc((poet.description || "").slice(0, 600))}${(poet.description || "").length > 600 ? "…" : ""}</p>
      <ul>${(page.cat?.children ?? []).map((c) => `<li><a href="/book/${c.id}">${esc(c.title)}</a></li>`).join("")}</ul>
      <p class="credit">از <a href="https://ganjoor.net${esc(poet.fullUrl)}">گنجور</a></p>
    </article>
    ${openAppBar(`${APP_SCHEME}poet/${id}`, esc(poet.nickname || poet.name))}`;
}

async function renderBook(root, id) {
  const page = await getJSON(`${API}/cat/${id}?poems=true`);
  const cat = page.cat;
  document.title = `${cat.title} — گنجینه`;
  root.innerHTML = `
    <article class="poem-card">
      <header class="poem-head">
        <div class="poet">${esc(page.poet?.nickname || "")}</div>
        <h1>${esc(cat.title)}</h1>
      </header>
      <div class="ornament"></div>
      <ul>
        ${(cat.children ?? []).map((c) => `<li><a href="/book/${c.id}">${esc(c.title)}</a></li>`).join("")}
        ${(cat.poems ?? []).slice(0, 300).map((p) => `<li><a href="/poem/${p.id}">${esc(p.title)}</a> — <span style="color:var(--ink-soft)">${esc(p.excerpt || "")}</span></li>`).join("")}
      </ul>
    </article>
    ${openAppBar(`${APP_SCHEME}book/${id}`, esc(cat.title))}`;
}

async function renderSearch(root, term) {
  const results = await getJSON(`${API}/poems/search?term=${encodeURIComponent(term)}&PageNumber=1&PageSize=30`);
  document.title = `${term} — جستجو در گنجینه`;
  root.innerHTML = `
    <article class="poem-card">
      <header class="poem-head"><h1>${esc(term)}</h1><div class="meta">نتیجه‌های جستجو</div></header>
      <div class="ornament"></div>
      <ul>${results.map((p) => `<li><a href="/poem/${p.id}">${esc(p.fullTitle)}</a></li>`).join("")}</ul>
    </article>
    ${openAppBar(`${APP_SCHEME}search?q=${encodeURIComponent(term)}`, esc(term))}`;
}

/** A shared collection: /c?n=name&i=2130.4,2131 (poem, or poem.couplet 1-based). */
async function renderCollection(root, name, items) {
  const entries = items.split(",").map((s) => s.split(".").map((n) => parseInt(n, 10))).filter(([id]) => id > 0).slice(0, 200);
  document.title = `${name || "گزیده"} — گنجینه`;
  const cards = await Promise.all(entries.map(async ([id, bayt]) => {
    try {
      const poem = await getJSON(`${API}/poem/${id}?catInfo=true&verseDetails=true`);
      const lines = couplets(poem.verses ?? []);
      const line = bayt ? lines.find((l) => l.index === bayt - 1) : lines[0];
      const poet = poem.category?.poet?.nickname || (poem.fullTitle || "").split("»")[0].trim();
      const href = `/poem/${id}${bayt ? `?bayt=${bayt}` : ""}`;
      return `<a class="beyt" href="${href}" style="text-decoration:none;color:inherit;display:block">
          ${(line?.verses ?? []).map((v) => `<span style="display:block;text-align:center">${esc(v.text)}</span>`).join("")}
          <span style="display:block;text-align:center;font-size:14px;color:var(--gold)">${esc(poet)} · ${esc(poem.title)}</span>
        </a>`;
    } catch { return ""; }
  }));
  root.innerHTML = `
    <article class="poem-card">
      <header class="poem-head"><div class="poet">گزیده</div><h1>${esc(name || "گزیدهٔ همرسانی‌شده")}</h1>
      <div class="meta">${faDigits(entries.length)} شعر و بیت</div></header>
      <div class="ornament"></div>
      <div class="verses">${cards.join('<div class="ornament" style="width:80px;margin:14px auto"></div>')}</div>
    </article>
    ${openAppBar(`${APP_SCHEME}c?n=${encodeURIComponent(name)}&i=${encodeURIComponent(items)}`, esc(name || "گزیده"))}`;
}

async function route() {
  const root = document.querySelector("[data-route]");
  if (!root) return;
  const parts = location.pathname.split("/").filter(Boolean);
  const query = new URLSearchParams(location.search);
  const [kind, rawId] = parts;
  const id = parseInt(rawId, 10);
  root.innerHTML = `<p class="loading">در حال آوردن از گنجور…</p>`;
  try {
    if (kind === "poem" && id) return await renderPoem(root, id, parseInt(query.get("bayt"), 10) || null);
    if (kind === "poet" && id) return await renderPoet(root, id);
    if ((kind === "book" || kind === "cat") && id) return await renderBook(root, id);
    if (kind === "today") return await renderPoem(root, dailyPoemId(), null);
    if (kind === "fal") {
      const fal = await getJSON(`${API}/hafez/faal`);
      return await renderPoem(root, fal.id, null);
    }
    if (kind === "search" && query.get("q")) return await renderSearch(root, query.get("q"));
    if (kind === "c" && query.get("i")) return await renderCollection(root, query.get("n") || "", query.get("i"));
    root.innerHTML = `<article class="poem-card"><header class="poem-head"><h1>این صفحه پیدا نشد</h1><div class="meta">Page not found</div></header><p style="text-align:center"><a class="btn btn-gold" href="/">صفحهٔ اصلی</a></p></article>`;
  } catch {
    root.innerHTML = `<p class="loading">گنجور پاسخ نداد. کمی بعد دوباره امتحان کنید.</p>`;
  }
}

// ---- Shared pieces ----
const ICONS = {
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7 1 .7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h2.9v1.7c.4-.8 1.4-1.9 3.3-1.9 3.4 0 4 2.2 4 5.1V21h-3v-6.2c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H9z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>',
};

function creatorLinks() {
  return [
    LINKS.donate && `<a class="chip donate" href="${LINKS.donate}" target="_blank" rel="noopener">${ICONS.heart}<span class="only-fa">حمایت مالی</span><span class="only-en">Donate</span></a>`,
    `<a class="chip" href="${LINKS.website}" target="_blank" rel="noopener">${ICONS.globe}<span class="only-fa">وب‌سایت</span><span class="only-en">Website</span></a>`,
    `<a class="chip" href="${LINKS.linktree}" target="_blank" rel="noopener">${ICONS.link}<span class="only-fa">همهٔ پیوندها</span><span class="only-en">All links</span></a>`,
    `<a class="chip" href="${LINKS.instagram}" target="_blank" rel="noopener">${ICONS.instagram}Instagram</a>`,
    `<a class="chip" href="${LINKS.github}" target="_blank" rel="noopener">${ICONS.github}GitHub</a>`,
    `<a class="chip" href="${LINKS.youtube}" target="_blank" rel="noopener">${ICONS.youtube}YouTube</a>`,
    `<a class="chip" href="${LINKS.linkedin}" target="_blank" rel="noopener">${ICONS.linkedin}LinkedIn</a>`,
  ].filter(Boolean).join("");
}

function footer() {
  const store = LINKS.appStore || "/#download";
  return `
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="foot-brand"><img src="/assets/apple-touch-icon.png" alt=""><span>گنجینه</span></div>
        <p class="only-fa">گنجینه‌ی شعر پارسی برای آیفون، آیپد، مک و اپل‌واچ.</p>
        <p class="only-en">The treasury of Persian poetry for iPhone, iPad, Mac and Apple Watch.</p>
      </div>
      <div>
        <h4><span class="only-fa">گنجینه</span><span class="only-en">Ganjineh</span></h4>
        <ul>
          <li><a href="${store}"><span class="only-fa">اپ‌استور</span><span class="only-en">App Store</span></a></li>
          ${LINKS.dmg ? `<li><a href="${LINKS.dmg}"><span class="only-fa">دانلود برای مک</span><span class="only-en">Download for Mac</span></a></li>` : ""}
          <li><a href="/today"><span class="only-fa">غزل امروز</span><span class="only-en">Today's ghazal</span></a></li>
          <li><a href="/fal"><span class="only-fa">فال حافظ</span><span class="only-en">Fal of Hafez</span></a></li>
        </ul>
      </div>
      <div>
        <h4><span class="only-fa">اطلاعات</span><span class="only-en">Info</span></h4>
        <ul>
          <li><a href="/about"><span class="only-fa">درباره</span><span class="only-en">About</span></a></li>
          <li><a href="/support"><span class="only-fa">پشتیبانی</span><span class="only-en">Support</span></a></li>
          <li><a href="/privacy"><span class="only-fa">حریم خصوصی</span><span class="only-en">Privacy Policy</span></a></li>
          <li><a href="/donate"><span class="only-fa">حمایت از گنجینه</span><span class="only-en">Support Ganjineh</span></a></li>
        </ul>
      </div>
      <div>
        <h4><span class="only-fa">سازنده</span><span class="only-en">Developer</span></h4>
        <ul>
          <li><a href="${LINKS.website}" target="_blank" rel="noopener"><span class="only-fa">وب‌سایت</span><span class="only-en">Website</span></a></li>
          <li><a href="${LINKS.linktree}" target="_blank" rel="noopener"><span class="only-fa">همهٔ پیوندها</span><span class="only-en">All links</span></a></li>
          <li><a href="${LINKS.instagram}" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="${LINKS.github}" target="_blank" rel="noopener">GitHub</a></li>
          <li><a href="${LINKS.youtube}" target="_blank" rel="noopener">YouTube</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span class="only-fa">متن‌ها، معنی بیت‌ها و خوانش‌ها از <a href="https://ganjoor.net">گنجور</a>. گنجینه برنامه‌ای مستقل است و وابسته به گنجور نیست.</span>
      <span class="only-en">Poems, meanings and recitations from <a href="https://ganjoor.net">Ganjoor</a>. Ganjineh is independent and not affiliated with Ganjoor.</span>
      <span>© ${new Date().getFullYear()} Alireza Toghiani · Apple, iPhone, iPad, Mac and Apple Watch are trademarks of Apple Inc.</span>
    </div>
  </div>`;
}

function wireLinks() {
  const map = { ...LINKS, macAppStore: LINKS.macAppStore || LINKS.appStore };
  document.querySelectorAll("[data-link]").forEach((a) => {
    const url = map[a.dataset.link];
    if (url) a.href = url;
    else if (a.hasAttribute("data-optional")) a.remove();
  });
  const creator = document.querySelector("[data-creator-links]");
  if (creator) creator.innerHTML = creatorLinks();
  document.querySelectorAll("[data-donate]").forEach((el) => {
    if (LINKS.donate) { el.hidden = false; el.querySelector("a").href = LINKS.donate; }
  });
  const foot = document.querySelector("[data-footer]");
  if (foot) foot.innerHTML = footer();
}

function wireTabs() {
  const tabs = document.querySelectorAll("[data-tab]");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    document.querySelectorAll("[data-gallery]").forEach((g) => g.classList.toggle("active", g.dataset.gallery === tab.dataset.tab));
  }));
  const menu = document.querySelector("[data-menu]"), nav = document.querySelector("[data-nav]");
  menu?.addEventListener("click", () => nav?.classList.toggle("open"));
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
}

document.addEventListener("DOMContentLoaded", () => {
  wireLinks();
  wireTabs();
  showDaily();
  route();
  const toggle = document.querySelector("[data-lang-toggle]");
  toggle?.addEventListener("click", (event) => {
    event.preventDefault();
    const html = document.documentElement;
    const english = html.lang === "fa";
    html.lang = english ? "en" : "fa";
    html.dir = english ? "ltr" : "rtl";
    toggle.textContent = english ? "فارسی" : "English";
    try { localStorage.setItem("lang", html.lang); } catch {}
  });
  try {
    if (localStorage.getItem("lang") === "en") toggle?.click();
  } catch {}
});
