# Lakeside Harmony Massage Therapy — Premium Portfolio Demo

A polished, client-ready static site for a fictional premium massage therapy studio located on Lake Cumberland in Jamestown, Kentucky.

**Built as a portfolio showcase by Bluegrass Digital Forge • Powered by Grok Build**

This is a **fictional business** for demonstration and portfolio purposes only.

## Key Upgrades (Ultimate Portfolio Edition)
- **Blazing images**: 42 optimized WebP variants (8-88KB) + responsive srcset + <picture> everywhere. All original JPGs kept as fallback. Perfect LCP.
- **Mobile-first**: 48px+ touch targets, fast buttery menu, smooth scrolling, no layout shift (width/height), Core Web Vitals ready.
- **Premium aesthetic**: Warm trustworthy Lake Cumberland palette, elegant typography, subtle micro-animations, serene experience.
- **Enhanced UX**: Improved gallery lightbox with arrows + keyboard + touch nav. Premium booking form fake-success flow with beautiful confirmation. Subtle auto testimonials carousel (swipe + pause + dots).
- **PWA**: Offline-first with full site cached, proper PNG icons, v3 SW. Works beautifully offline.
- **SEO powerhouse**: Rich JSON-LD (LocalBusiness + Person), strong meta/OG, preloads, semantic.
- **Bluegrass branding**: Very prominent "Demo by Bluegrass Digital Forge • Built with Grok Build • Fictional business for portfolio purposes only. Not a real clinic."
- **100% fictional**: Sarah "Sage" Thompson, Jamestown KY, Lake Cumberland — perfect graduate LMT dream portfolio.

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
