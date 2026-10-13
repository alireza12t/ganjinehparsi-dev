# ganjinehparsi.com

Website for **Ganjineh · گنجینه**, the Persian poetry app. Static files served by GitHub Pages.

- `index.html` — home page (Persian, with an English toggle), today's couplet from Ganjoor.
- `404.html` + `assets/app.js` — pages behind shared links: `/poem/2130?bayt=4`, `/poet/2`, `/book/24`,
  `/today`, `/fal`, `/search?q=…`. With the app installed, iOS/macOS open these in Ganjineh instead.
- `.well-known/apple-app-site-association` — tells Apple those paths belong to the app
  (team 58WM5RF23G, bundle id com.alirezatoghiani.ganjineh).
- `CNAME` — the custom domain; `.nojekyll` — lets Pages serve `.well-known`.

Poems come from [Ganjoor](https://ganjoor.net)'s public API.
