# Uttkarsh Gautam — Portfolio Website

A premium, fully responsive, single-page developer portfolio for **Uttkarsh Gautam**, an
Information Technology student at Rajkiya Engineering College, Ambedkar Nagar (AKTU).

Built **from scratch** with semantic HTML, modern CSS, and vanilla JavaScript — **zero
dependencies, no build step**. Just open `index.html`.

## ✨ Features

- **Premium UI** — glassmorphism, gradient mesh background, soft shadows, modern card layouts
- **Dark / Light mode** toggle (preference saved in `localStorage`)
- **Animated hero** with typing role effect, floating tech chips, and an animated portrait ring
- **Sections**: Hero · About (animated counters) · Education timeline · Skills (progress bars + circular charts + tech cloud) · Projects (filterable) · Experience timeline · Certifications carousel · Achievements · Resume · Testimonials carousel · Contact (validated form + map) · Footer
- **Micro-interactions**: scroll-reveal, 3D tilt cards, magnetic buttons, custom cursor, particle network background, scroll progress bar, back-to-top
- **Accessible & SEO-ready**: semantic markup, meta/Open Graph tags, keyboard-friendly, `prefers-reduced-motion` support
- **Fully responsive** from mobile to 4K

## 📁 Structure

```
.
├── index.html      # All markup & content
├── css/styles.css  # Design system, themes, layout, animations
├── js/main.js      # Interactivity (vanilla JS, no libraries)
└── assets/
    └── Uttkarsh-Gautam-Resume.pdf   # Placeholder résumé (replace with your own)
```

## 🚀 Run locally

No tooling required — open the file directly, or use any static server:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 Deploy with GitHub Pages

1. Push to GitHub (this repo).
2. Go to **Settings → Pages**.
3. Set **Source** to your branch (e.g. `main`) and root (`/`).
4. Your site will be live at `https://<username>.github.io/<repo>/`.

## 🛠️ Customize

- **Text & links**: edit the relevant section in `index.html`.
- **Colors / theme**: tweak the CSS variables at the top of `css/styles.css`.
- **Typing roles**: edit the `roles` array in `js/main.js`.
- **Résumé**: replace `assets/Uttkarsh-Gautam-Resume.pdf` with your real PDF (keep the same name, or update the links).
- **Contact form**: it currently simulates submission client-side. To receive real messages, point the form at a service like [Formspree](https://formspree.io) or your own endpoint (see the comment in `js/main.js`).

## 🧰 Tech

HTML5 · CSS3 (custom properties, grid, flexbox, backdrop-filter) · Vanilla JavaScript (IntersectionObserver, Canvas API) · Google Fonts (Inter, Poppins, JetBrains Mono).

---

Crafted with ♥ — no templates.
