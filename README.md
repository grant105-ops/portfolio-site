# Grant Swift · Engineering Portfolio Website

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.
Open a file in a text editor, save, refresh the browser. That is the whole workflow.

---

## Files

```
index.html              home page
projects/*.html         one file per project
404.html                not-found page
assets/css/site.css     all styling, tokens at the top
assets/js/site.js       scroll reveals, counters, sticky nav (the site works without it)
assets/img/             every image, pre-generated at 4 sizes in AVIF and WebP
assets/*.pdf            resume and portfolio PDF
render.yaml             Render deploy config
sitemap.xml, robots.txt for search engines
```

---

## Preview it locally

Double-click `index.html`. That is it.

If you want the more accurate version (some browsers are stricter about local files),
run this in the folder and open http://localhost:8000:

```
python -m http.server
```

---

## Deploy to Render

You already have a Render account. Static Sites are free, served from a CDN, and
they do **not** spin down like free web services do.

1. Put this folder in a GitHub repo (see below).
2. In Render: **New → Static Site** → connect the repo.
3. Settings:
   - **Build Command:** leave empty (or `true`)
   - **Publish Directory:** `.`
4. Create. Every `git push` redeploys automatically.

If Render asks about a Blueprint, `render.yaml` in this folder already has the
right settings including cache headers.

### Getting the repo up the first time

```
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/grant105-ops/portfolio-site.git
git push -u origin main
```

Create the empty repo on GitHub first, without a README.

### Free domain

Render gives you `something.onrender.com` for free. For something that looks better
on a resume, `is-a.dev` gives developers a free subdomain like `grantswift.is-a.dev`:

1. Fork https://github.com/is-a-dev/register
2. Add `domains/grantswift.json` with a CNAME record pointing at your
   `*.onrender.com` address
3. Open a pull request. Approval usually takes a day or two.
4. In Render: **Settings → Custom Domains** → add `grantswift.is-a.dev`.
   TLS is issued automatically and free.

After the domain is live, update the `SITE_URL` occurrences in the HTML
(`<link rel="canonical">` and the `og:` tags) plus `sitemap.xml` and `robots.txt`.

---

## Adding a new project

1. **Copy a project file.** `projects/formula-sae.html` is the most complete example.
   Save it as `projects/your-project.html`.

2. **Add the images.** Drop the originals somewhere, then resize them yourself or
   ask Claude to run them through the pipeline. Each image needs to end up in
   `assets/img/` as `name-480.webp`, `name-800.webp`, `name-1200.webp` and the
   matching `.avif` files. If that is annoying, a single `.jpg` works too, just
   replace the whole `<picture>` block with `<img src="assets/img/name.jpg" alt="...">`.

3. **Edit the text.** Everything is plain HTML. The pieces you will reuse:

   ```html
   <!-- section heading -->
   <div class="eyebrow rv">Section label</div>
   <h2 class="h2 rv d1">The headline.</h2>
   <div class="drawline"></div>

   <!-- three cards -->
   <div class="g3">
     <div class="card rv"><span class="n">01</span>
       <h4 class="h4">Title</h4><p>Body copy.</p></div>
   </div>

   <!-- stat strip -->
   <div class="stats rv">
     <div class="stat"><span class="v">6</span><div class="k">Design revisions</div></div>
   </div>

   <!-- animated counter instead of a static number -->
   <span class="v" data-count="1000" data-suffix="+">0</span>

   <!-- pull quote -->
   <div class="callout"><p>The one line you want someone to remember.</p></div>
   ```

   `rv` fades an element in on scroll. `d1` through `d5` stagger it.

4. **Link it from the home page.** In `index.html`, find the `<div class="plist">`
   block, copy one `<a class="pitem">` and change the number, title, blurb, tags,
   image and href.

5. **Add it to `sitemap.xml`.**

---

## Changing the look

Everything visual comes from the tokens at the top of `assets/css/site.css`:

```css
--bg:     #08090B;   /* page background */
--ink:    #EEF1F5;   /* main text */
--accent: #34E5A0;   /* the green: headings, rules, buttons, active states */
```

Change `--accent` and the whole site restyles. Colours have been checked for
contrast against the background, so if you go much darker on the greys check that
body text still reads.

---

## Notes on how it is built

- **Images.** Every photo exists as AVIF and WebP at four widths. The browser picks
  the smallest one that fits the slot, so a phone never downloads a 1800px file.
  Each one also has a tiny blurred placeholder inlined in the HTML so nothing
  flashes grey on load.
- **No layout shift.** Every `<img>` carries explicit width and height, so the page
  never jumps while images arrive. Measured CLS is 0.
- **Works without JavaScript.** The reveal animations are gated behind a `js` class
  that an inline script sets. If the script is blocked, the page renders fully,
  just static.
- **Respects reduced motion.** If a visitor has that OS setting on, all animation
  and parallax turn off.
- **Photo grading.** The phone photos were shot under different light. They are all
  run through the same grade (shadows lifted, contrast up, saturation down) so the
  site reads as one set instead of a camera roll.

---

## The PDF still matters

`assets/Grant_Swift_Portfolio.pdf` is linked from the header and footer. The site is
the front door; the PDF is what a recruiter attaches to an application and forwards
around. Keep both current.
