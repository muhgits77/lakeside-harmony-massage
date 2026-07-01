# Lakeside Harmony Massage Therapy — Premium Portfolio Demo

A polished, client-ready static site for a fictional premium massage therapy studio located on Lake Cumberland in Jamestown, Kentucky.

**Built as a portfolio showcase by Bluegrass Digital Forge • Powered by Grok Build**

This is a **fictional business** for demonstration and portfolio purposes only.

## Key Upgrades (Premium Polish)
- **Reliable images**: All 8 images guaranteed via proper relative paths, eager/lazy loading, no broken WebP references, aggressive Service Worker precaching.
- **Hero**: Dramatically improved visual presence with refined gradients, typography, and Lake Cumberland serenity.
- **Animations & UX**: Subtle premium CSS transitions, IntersectionObserver scroll reveals, enhanced service card hovers (lift + micro details), polished mobile menu (animated slide + icon toggle).
- **Footer**: Clearly states “Demo by Bluegrass Digital Forge • Built with Grok Build • Fictional business for portfolio purposes only.”
- **PWA & Performance**: v2 Service Worker with image-first caching, fast cache strategies, improved manifest, vercel headers for long-lived static assets.
- **Accessibility**: Focus trapping, keyboard support, data-attribute driven interactions.
- **Kentucky wellness vibe**: Warm trustworthy palette (Lake blue, sage green, earth clay, cream) preserved and elevated.

## Local Setup (Ready to Run)

From the project folder:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .

# or any static server
```

Open http://localhost:8080 — fully functional offline-ready PWA.
```

## Deploy (GitHub + Vercel)

Run these commands from the repository root (replace placeholders where noted):

```bash
# initialize git and create first commit
git init
git add .
git commit -m "Initial demo site commit"

# create a GitHub repo (replace USER/REPO)
gh repo create YOUR_USERNAME/lakeside-harmony --public --source=. --remote=origin --push

# Deploy to Vercel (assuming you have Vercel CLI installed)
npx vercel --prod
```

See the **Deployment** section below for exact terminal commands with explanations.

---

## Deployment (exact commands)

1) Initialize, commit, and push to GitHub (replace `YOUR_USERNAME` and `REPO`):

```bash
git init
git branch -M main
git add .
git commit -m "Initial demo site by Bluegrass Digital Forge"
git remote add origin https://github.com/YOUR_USERNAME/REPO.git
git push -u origin main
```

2) Deploy to Vercel (recommended):

```bash
# one-time setup (if you don't have the CLI):
npx vercel login

# from the project folder:
npx vercel --prod
```

Vercel will detect a static project and publish a production URL.

## Credits & Attribution
- Design & development by **Bluegrass Digital Forge**
- Built with **Grok Build**
- Fictional business for portfolio purposes only. All content, testimonials, and imagery are illustrative.

**Warm, trustworthy local Kentucky Lake Cumberland wellness aesthetic** maintained for consistency across Bluegrass projects.
