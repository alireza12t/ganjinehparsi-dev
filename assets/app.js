// Ganjineh website: today's couplet on the home page, and the pages behind shared links
// (/poem/2130?bayt=4, /poet/2, /book/24, /today, /fal, /search?q=…). On iPhone, iPad and Mac with
// the app installed, those links open Ganjineh directly; everyone else lands here.

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
    root.innerHTML = `<article class="poem-card"><header class="poem-head"><h1>این صفحه پیدا نشد</h1><div class="meta">Page not found</div></header><p style="text-align:center"><a class="btn btn-gold" href="/">صفحهٔ اصلی</a></p></article>`;
  } catch {
    root.innerHTML = `<p class="loading">گنجور پاسخ نداد. کمی بعد دوباره امتحان کنید.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
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
