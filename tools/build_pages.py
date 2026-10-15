#!/usr/bin/env python3
"""Builds the site's inner pages (about, support, privacy, the shared-link page) from one layout,
so their header and footer match the home page. Run from the repo root: python3 tools/build_pages.py"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UPDATED_FA, UPDATED_EN = "۲۱ مهر ۱۴۰۵", "13 October 2026"

HEAD = """<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta name="theme-color" content="#0d1630">
<meta property="og:site_name" content="Ganjineh · گنجینه">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="https://ganjinehparsi.com/assets/og.jpg">
<meta name="twitter:card" content="summary_large_image">
{canonical}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@700&family=Playfair+Display:wght@600&family=Vazirmatn:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
<script src="/assets/app.js" defer></script>
</head>
<body>
<header class="top">
  <div class="wrap top-inner">
    <a class="brand" href="/"><img src="/assets/apple-touch-icon.png" alt=""><span class="fa">گنجینه</span><span class="en">GANJINEH</span></a>
    <nav class="nav" data-nav>
      <a href="/#features"><span class="only-fa">ویژگی‌ها</span><span class="only-en">Features</span></a>
      <a href="/#screens"><span class="only-fa">تصویرها</span><span class="only-en">Screenshots</span></a>
      <a href="/#download"><span class="only-fa">دریافت</span><span class="only-en">Download</span></a>
      <a href="/about"><span class="only-fa">درباره</span><span class="only-en">About</span></a>
      <a href="/support"><span class="only-fa">پشتیبانی</span><span class="only-en">Support</span></a>
    </nav>
    <button class="menu-btn" data-menu aria-label="Menu">☰</button>
    <a href="#" class="lang-toggle" data-lang-toggle>English</a>
  </div>
</header>
"""

FOOT = """
<div class="border-band"></div>
<footer data-footer></footer>
</body>
</html>
"""


def page(title_fa, title_en, sub_fa, sub_en, body):
    return f"""<main>
  <div class="page-hero carpet">
    <h1><span class="only-fa">{title_fa}</span><span class="only-en">{title_en}</span></h1>
    <p><span class="only-fa">{sub_fa}</span><span class="only-en">{sub_en}</span></p>
  </div>
  <div class="border-band"></div>
  <div class="wrap narrow">
    <article class="prose">
{body}
    </article>
  </div>
</main>"""


def both(fa, en, tag="p"):
    return f'<{tag} class="only-fa">{fa}</{tag}><{tag} class="only-en" dir="ltr">{en}</{tag}>'


PRIVACY = page(
    "حریم خصوصی", "Privacy Policy",
    f"آخرین به‌روزرسانی: {UPDATED_FA}", f"Last updated: {UPDATED_EN}",
    "\n".join([
        both("گنجینه برای خواندن شعر ساخته شده، نه برای جمع کردن داده. این صفحه دقیق می‌گوید برنامهٔ گنجینه (آیفون، آیپد، مک و اپل‌واچ) و این وب‌سایت با اطلاعات شما چه می‌کنند.",
             "Ganjineh is made for reading poetry, not for collecting data. This page explains exactly what the Ganjineh app (iPhone, iPad, Mac and Apple Watch) and this website do with your information."),
        both("خلاصه", "In short", "h2"),
        '<ul class="only-fa"><li>حساب کاربری، تبلیغ، ردیابی و ابزار تحلیل در کار نیست.</li><li>نشان‌ها، یادداشت‌ها، تاریخچه و تنظیمات فقط روی دستگاه خودتان می‌مانند.</li><li>ما هیچ دادهٔ شخصی‌ای جمع نمی‌کنیم، نمی‌فروشیم و با کسی در میان نمی‌گذاریم.</li></ul>'
        '<ul class="only-en" dir="ltr"><li>No accounts, no ads, no tracking and no analytics.</li><li>Bookmarks, notes, history and settings stay on your own device.</li><li>We do not collect, sell or share any personal data.</li></ul>',
        both("آنچه روی دستگاه شما ذخیره می‌شود", "What is stored on your device", "h2"),
        both("بیت‌ها و شعرهای نشان‌کرده و یادداشت‌هایتان، تاریخچهٔ خواندن، تنظیمات (زبان، اندازهٔ قلم و…) و نسخه‌ای از شعرهایی که خوانده‌اید برای خواندن بدون اینترنت. این داده‌ها از دستگاه شما خارج نمی‌شوند و با پاک کردن برنامه پاک می‌شوند.",
             "Your bookmarked couplets and poems with your notes, reading history, settings (language, text size and so on) and a copy of poems you have read, for reading offline. This data never leaves your device and is removed when you delete the app."),
        both("ارتباط با گنجور", "Connection to Ganjoor", "h2"),
        both('متن شعرها، معنی بیت‌ها، تصویر سخنوران و خوانش‌های صوتی مستقیم از <a href="https://ganjoor.net">گنجور</a> (api.ganjoor.net) دریافت می‌شوند. مانند هر وب‌سایتی، سرور گنجور نشانی IP دستگاه شما را هنگام این درخواست‌ها می‌بیند. گنجینه هیچ اطلاعات شخصی یا شناسه‌ای همراه این درخواست‌ها نمی‌فرستد. عبارت‌هایی که جستجو می‌کنید برای یافتن نتیجه به گنجور فرستاده می‌شوند.',
             'Poem texts, couplet meanings, poet portraits and audio recitations are fetched directly from <a href="https://ganjoor.net">Ganjoor</a> (api.ganjoor.net). Like any website, Ganjoor\'s server sees your device\'s IP address when it answers these requests. Ganjineh sends no personal information or identifiers with them. Words you search for are sent to Ganjoor to find results.'),
        both("اپل‌واچ", "Apple Watch", "h2"),
        both("برنامهٔ ساعت فقط غزل روز را از گنجور می‌گیرد و چیزی ذخیره یا ارسال نمی‌کند.",
             "The watch app only fetches the ghazal of the day from Ganjoor; it stores and sends nothing else."),
        both("این وب‌سایت", "This website", "h2"),
        both("ganjinehparsi.com روی GitHub Pages میزبانی می‌شود و قلم‌ها را از Google Fonts بارگیری می‌کند؛ این سرویس‌ها مانند هر میزبانی نشانی IP بازدیدکننده را می‌بینند. وب‌سایت کوکی ندارد؛ فقط زبان انتخابی شما در مرورگرتان (localStorage) نگه داشته می‌شود.",
             "ganjinehparsi.com is hosted on GitHub Pages and loads fonts from Google Fonts; like any host, these services see visitors' IP addresses. The site sets no cookies; it only remembers your chosen language in your browser (localStorage)."),
        both("کودکان", "Children", "h2"),
        both("گنجینه برای همهٔ سنین مناسب است و از هیچ‌کس، از جمله کودکان، اطلاعات شخصی نمی‌گیرد.",
             "Ganjineh is suitable for all ages and collects no personal information from anyone, including children."),
        both("تغییرات", "Changes", "h2"),
        both("اگر این سیاست تغییر کند، نسخهٔ تازه با تاریخ جدید در همین صفحه منتشر می‌شود.",
             "If this policy changes, the new version will be posted on this page with a new date."),
        both("تماس", "Contact", "h2"),
        both('پرسشی دربارهٔ حریم خصوصی دارید؟ از <a href="/support">صفحهٔ پشتیبانی</a> با ما در تماس باشید.',
             'Questions about privacy? Reach us through the <a href="/support">support page</a>.'),
    ]),
)

SUPPORT = page(
    "پشتیبانی", "Support",
    "پرسشی دارید یا چیزی درست کار نمی‌کند؟ اینجاییم.", "A question, or something not working? We're here.",
    "\n".join([
        both("تماس با ما", "Contact us", "h2"),
        both("سریع‌ترین راه، ثبت گزارش در گیت‌هاب است؛ لطفاً دستگاه، نسخهٔ سیستم‌عامل و کاری که کردید را بنویسید.",
             "The quickest way is to open an issue on GitHub; please include your device, system version and what you did."),
        '<p class="links"><a class="chip" data-link="issues" href="https://github.com/alireza12t/ganjinehparsi.com/issues" target="_blank" rel="noopener"><span class="only-fa">گزارش مشکل یا پیشنهاد</span><span class="only-en">Report a problem or suggest an idea</span></a>'
        '<a class="chip" data-link="linktree" href="https://alireza12t.github.io/links/" target="_blank" rel="noopener"><span class="only-fa">راه‌های دیگر تماس</span><span class="only-en">Other ways to reach me</span></a></p>',
        both("پرسش‌های رایج", "Frequently asked questions", "h2"),
        """<div class="only-fa">
<details><summary>برنامه را چطور به انگلیسی ببرم؟</summary><p>در «کتابخانهٔ من» ← تنظیمات، زبان را English بگذارید و برنامه را دوباره باز کنید. شعرها همیشه پارسی می‌مانند.</p></details>
<details><summary>بدون اینترنت هم کار می‌کند؟</summary><p>شعرهایی که یک بار باز کرده‌اید و نشان‌هایتان بدون اینترنت در دسترس‌اند. برای شعرهای تازه، جستجو و خوانش‌های صوتی اینترنت لازم است.</p></details>
<details><summary>معنی بیت‌ها از کجا می‌آید؟</summary><p>از گنجور. برخی معنی‌ها را گنجور با هوش مصنوعی نوشته است؛ گنجینه این‌ها را با برچسب مشخص می‌کند.</p></details>
<details><summary>پیوندی که برایم فرستادند در برنامه باز نمی‌شود.</summary><p>مطمئن شوید آخرین نسخهٔ گنجینه را دارید. پیوندهای ganjinehparsi.com را در پیام‌ها یا یادداشت‌ها لمس کنید؛ اگر نشانی را در نوار سافاری تایپ کنید، وب‌سایت باز می‌شود. می‌توانید در صفحهٔ وب دکمهٔ «باز کردن» را بزنید.</p></details>
<details><summary>برنامهٔ اپل‌واچ را چطور نصب کنم؟</summary><p>برنامهٔ ساعت همراه برنامهٔ آیفون می‌آید. در برنامهٔ Watch آیفون، بخش «برنامه‌های موجود»، گنجینه را نصب کنید.</p></details>
<details><summary>مک می‌گوید برنامه را نمی‌تواند باز کند.</summary><p>نسخهٔ DMG امضا و از سوی اپل تأیید (notarize) شده است. اگر پیامی دیدید، فایل را دوباره از همین سایت دانلود کنید یا نسخهٔ مک اپ‌استور را نصب کنید.</p></details>
<details><summary>داده‌هایم را چطور پاک کنم؟</summary><p>همه‌چیز فقط روی دستگاه شماست؛ با پاک کردن برنامه همهٔ داده‌ها پاک می‌شوند. جزئیات در <a href="/privacy">حریم خصوصی</a>.</p></details>
</div>
<div class="only-en" dir="ltr">
<details><summary>How do I switch the app to English?</summary><p>Go to My Library → Settings, set the language to English and reopen the app. Poems always stay in Persian.</p></details>
<details><summary>Does it work offline?</summary><p>Poems you have opened and your bookmarks work offline. New poems, search and recitations need an internet connection.</p></details>
<details><summary>Where do couplet meanings come from?</summary><p>From Ganjoor. Some meanings were written by AI on Ganjoor; Ganjineh labels those clearly.</p></details>
<details><summary>A link someone sent me doesn't open in the app.</summary><p>Make sure you have the latest Ganjineh. Tap ganjinehparsi.com links in Messages or Notes; typing the address into Safari's address bar opens the website instead. You can also tap “Open” on the web page.</p></details>
<details><summary>How do I install the Apple Watch app?</summary><p>It comes with the iPhone app. Open the Watch app on your iPhone and install Ganjineh under Available Apps.</p></details>
<details><summary>My Mac says it can't open the app.</summary><p>The DMG is signed and notarized by Apple. If you see a warning, download it again from this site, or install it from the Mac App Store.</p></details>
<details><summary>How do I delete my data?</summary><p>Everything lives only on your device; deleting the app removes it all. See the <a href="/privacy">Privacy Policy</a>.</p></details>
</div>""",
        both("سپاس از گنجور", "Thanks to Ganjoor", "h2"),
        both('شعرها و خوانش‌ها از <a href="https://ganjoor.net">گنجور</a> می‌آیند. برای اصلاح متن یک شعر، آن را در خود گنجور گزارش کنید تا همه از آن بهره ببرند.',
             'Poems and recitations come from <a href="https://ganjoor.net">Ganjoor</a>. To correct a poem\'s text, report it on Ganjoor itself so everyone benefits.'),
    ]),
)

ABOUT = page(
    "دربارهٔ گنجینه", "About Ganjineh",
    "گنجینه‌ی شعر پارسی، با جامهٔ فرش و کاشی", "The treasury of Persian poetry, dressed in carpet and tile",
    "\n".join([
        both("گنجینه برای کسانی است که شعر پارسی را دوست دارند و می‌خواهند آن را زیبا، آرام و بی‌مزاحمت بخوانند و بشنوند — در آیفون، آیپد، مک و اپل‌واچ.",
             "Ganjineh is for anyone who loves Persian poetry and wants to read and hear it beautifully, calmly and without distraction — on iPhone, iPad, Mac and Apple Watch."),
        both("چرا گنجینه؟", "Why Ganjineh?", "h2"),
        both('<a href="https://ganjoor.net">گنجور</a> بزرگ‌ترین و ارزشمندترین کتابخانهٔ آزاد شعر فارسی است. گنجینه بر پایهٔ همان گنجینه ساخته شده تا تجربه‌ای بومی و امروزی برای دستگاه‌های اپل بسازد: خوانش‌هایی که بیت را هنگام خواندن طلایی می‌کنند، معنی هر بیت در یک لمس، فال حافظ، کتابخانهٔ شخصی با یادداشت، خواندن بدون اینترنت و همرسانی بیت‌ها با پیوندهایی که مستقیم در برنامه باز می‌شوند.',
             '<a href="https://ganjoor.net">Ganjoor</a> is the largest and most valuable free library of Persian poetry. Ganjineh builds on that treasury to offer a native, modern experience for Apple devices: recitations that light up each couplet as it is read, the meaning of every couplet one tap away, the Fal of Hafez, a personal library with notes, offline reading, and couplets you can share with links that open straight in the app.'),
        both("طراحی", "Design", "h2"),
        both("نشان گنجینه ترنج یک فرش ایرانی است: نام «گنجینه» به خط نستعلیق در میان ترنجی لاجوردی، بته‌جقه‌ای بر فراز آن، و سی‌وسه‌پل اصفهان در پایین، بر زمینهٔ لاکی فرش. رنگ‌ها — لاجوردی، لاکی، شیری و طلایی — از همان فرش آمده‌اند.",
             "Ganjineh's emblem is the medallion of a Persian carpet: the name گنجینه in Nastaliq inside an indigo toranj, a boteh crowning it and Esfahan's Si-o-se-pol bridge below, on a madder-red field. The colours — indigo, madder, ivory and gold — come from that carpet."),
        both("سازنده", "The maker", "h2"),
        both("گنجینه را علیرضا طغیانی، برنامه‌نویس مستقل iOS و macOS، ساخته است. برنامه بی‌تبلیغ است و هیچ داده‌ای از شما جمع نمی‌کند.",
             "Ganjineh is made by Alireza Toghiani, an independent iOS and macOS developer. The app has no ads and collects no data about you."),
        '<div class="links" data-creator-links></div>',
        both("سپاس‌گزاری", "Credits", "h2"),
        both('متن شعرها، معنی بیت‌ها، تصویرها و خوانش‌ها از <a href="https://ganjoor.net">گنجور</a> و همکاران و خوانندگان آن است؛ نام هر خواننده کنار خوانشش آمده است. گنجینه برنامه‌ای مستقل است و وابسته به گنجور نیست.',
             'Poem texts, couplet meanings, portraits and recitations come from <a href="https://ganjoor.net">Ganjoor</a>, its contributors and reciters; each reciter is credited beside their recitation. Ganjineh is independent and not affiliated with Ganjoor.'),
    ]),
)


DONATE = page(
    "حمایت از گنجینه", "Support Ganjineh",
    "گنجینه رایگان و بی‌تبلیغ است و با کمک شما ادامه می‌یابد.", "Ganjineh is free and ad-free, and grows with your help.",
    "\n".join([
        both("گنجینه را یک برنامه‌نویس مستقل در وقت آزادش می‌سازد. بی‌تبلیغ است، داده‌ای جمع نمی‌کند و همیشه رایگان می‌ماند. اگر گنجینه لحظه‌ای از روزتان را زیباتر کرده، این راه‌ها به ادامهٔ آن کمک می‌کنند:",
             "Ganjineh is built by an independent developer in their spare time. It has no ads, collects no data and will stay free. If it has made a moment of your day more beautiful, here is how you can help it continue:"),
        '<div hidden data-donate><h2 class="only-fa">حمایت مالی</h2><h2 class="only-en">Donate</h2>' + both("هر مبلغی، هر چقدر کوچک، صرف نگهداری و افزودن ویژگی‌های تازه می‌شود.", "Any amount, however small, goes into keeping Ganjineh running and adding new features.") +
        '<p><a class="btn btn-gold" href="#" target="_blank" rel="noopener"><span class="only-fa">حمایت مالی</span><span class="only-en">Donate</span></a></p></div>',
        both("به گنجینه امتیاز دهید", "Rate Ganjineh", "h2"),
        both("یک امتیاز یا نقد کوتاه در اپ‌استور به دیگران کمک می‌کند گنجینه را پیدا کنند.",
             "A rating or short review on the App Store helps others discover Ganjineh."),
        '<p><a class="badge" data-link="appStore" href="https://apps.apple.com/us/app/ganjineh/id6822480269"><img src="/assets/download-on-the-app-store.svg" alt="App Store" style="height:46px"></a></p>',
        both("با دوستانتان همرسانی کنید", "Share it with friends", "h2"),
        both("بیتی را از گنجینه برای کسی بفرستید، یا نشانی ganjinehparsi.com را با دوستداران شعر در میان بگذارید.",
             "Send someone a couplet from Ganjineh, or share ganjinehparsi.com with fellow poetry lovers."),
        both("دنبال کنید", "Follow along", "h2"),
        both("تازه‌های گنجینه و برنامه‌های دیگر را در این صفحه‌ها ببینید:", "News about Ganjineh and other apps:"),
        '<div class="links" data-creator-links></div>',
        both("از گنجور حمایت کنید", "Support Ganjoor too", "h2"),
        both('گنجینه بدون <a href="https://ganjoor.net">گنجور</a> و داوطلبانش ممکن نبود. اگر می‌توانید، از گنجور هم پشتیبانی کنید.',
             'Ganjineh would not exist without <a href="https://ganjoor.net">Ganjoor</a> and its volunteers. If you can, support Ganjoor as well.'),
    ]),
)

LINK_PAGE = """<main class="poem-page carpet">
  <div class="wrap" data-route></div>
</main>"""

PAGES = {
    "privacy.html": ("حریم خصوصی · Privacy Policy — گنجینه", "Ganjineh collects no personal data. Privacy policy for the Ganjineh app and website.", "https://ganjinehparsi.com/privacy", PRIVACY),
    "support.html": ("پشتیبانی · Support — گنجینه", "Help, contact and frequently asked questions for Ganjineh.", "https://ganjinehparsi.com/support", SUPPORT),
    "about.html": ("درباره · About — گنجینه", "About Ganjineh, the treasury of Persian poetry for iPhone, iPad, Mac and Apple Watch.", "https://ganjinehparsi.com/about", ABOUT),
    "donate.html": ("حمایت از گنجینه · Support Ganjineh", "Ways to support Ganjineh, the free and ad-free Persian poetry app.", "https://ganjinehparsi.com/donate", DONATE),
    "404.html": ("گنجینه · Ganjineh", "گنجینه‌ی شعر پارسی · The treasury of Persian poetry", None, LINK_PAGE),
}

for name, (title, description, canonical, body) in PAGES.items():
    head = HEAD.format(title=title, description=description,
                       canonical=f'<link rel="canonical" href="{canonical}">\n' if canonical else "")
    (ROOT / name).write_text(head + body + FOOT, encoding="utf-8")
    print("wrote", name)
