# Lakeside Harmony — Demo Site

Premium demo site for a fictional massage therapy business, Lakeside Harmony. This repository is a lightweight static site built for portfolio and demonstration purposes.

**Screenshot placeholders:** Add screenshots to the `screenshots/` folder and reference them here.

## Features
- Responsive layout (Tailwind via CDN)
- Mobile menu, modals, gallery lightbox
- Accessible focus management for modals
- Smooth scrolling and navbar scroll effects
- Basic PWA support (manifest + service worker)
- Lazy-loading images and WebP suggestions

## Local Setup

1. Open the project folder in your editor.
2. Serve locally (any static server). Example using Python 3 built-in server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or use `npx serve`:

```bash
npx serve .
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

## Credits
Website Demo by Bluegrass Digital Forge • Built with Grok Build • Fictional business for portfolio purposes.
