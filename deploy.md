# Deploy

Follow these exact steps to create a GitHub repository and deploy to Vercel from your terminal.

1) Initialize repo and commit

```bash
git init
git branch -M main
git add .
git commit -m "Initial demo site by Bluegrass Digital Forge"
```

2) Create GitHub repo and push

```bash
# using GitHub CLI (recommended)
gh repo create YOUR_USERNAME/lakeside-harmony --public --source=. --remote=origin --push

# or manually create the repo on github.com and then:
git remote add origin https://github.com/YOUR_USERNAME/REPO.git
git push -u origin main
```

3) Deploy to Vercel

```bash
npx vercel login
npx vercel --prod
```

Vercel will provide a production URL after deployment.
