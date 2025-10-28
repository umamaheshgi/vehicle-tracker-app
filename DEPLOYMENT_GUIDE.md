# 🚀 GitHub Pages Deployment Guide

## Vehicle Movement Tracker - Deployment Instructions

This guide will help you deploy the Vehicle Movement Tracker application to GitHub Pages.

---

## 📋 Prerequisites

- GitHub account
- Git installed on your local machine
- Node.js and npm installed

---

## 🔧 Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. **Go to GitHub** and create a new repository:
   - Repository name: `vehicle-tracker-app`
   - Make it **public** (required for free GitHub Pages)
   - Don't initialize with README (we already have one)

2. **Copy the repository URL** (it will look like):
   ```
   https://github.com/YOUR_USERNAME/vehicle-tracker-app.git
   ```

### Step 2: Update Configuration

1. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/vehicle-tracker-app"
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Connect Local Repository to GitHub

Run these commands in the project directory:

```bash
# Add the GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/vehicle-tracker-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Deploy to GitHub Pages

```bash
# Build and deploy in one command
npm run deploy
```

This command will:
- Build the production version (`npm run build`)
- Create a `gh-pages` branch
- Push the built files to GitHub Pages

### Step 5: Configure GitHub Pages (One-time setup)

1. Go to your GitHub repository
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **gh-pages** branch and **/ (root)** folder
6. Click **Save**

### Step 6: Access Your Deployed Application

Your application will be available at:
```
https://YOUR_USERNAME.github.io/vehicle-tracker-app
```

It may take a few minutes for the deployment to be live.

---

## 🔄 Updating Your Deployment

Whenever you make changes to your application:

```bash
# 1. Commit your changes
git add .
git commit -m "Description of your changes"
git push origin main

# 2. Deploy updated version
npm run deploy
```

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production version |
| `npm run deploy` | Build and deploy to GitHub Pages |
| `npm run preview` | Preview built application locally |

---

## 🛠️ Configuration Files

### package.json
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/vehicle-tracker-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/vehicle-tracker-app/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
```

---

## 🚨 Troubleshooting

### Common Issues:

1. **404 Error on GitHub Pages**
   - Check if the repository is public
   - Verify GitHub Pages is configured correctly
   - Ensure the `base` path in `vite.config.ts` matches your repository name

2. **Assets Not Loading**
   - Verify the `base` configuration in `vite.config.ts`
   - Check that the homepage URL in `package.json` is correct

3. **Deployment Fails**
   - Make sure you have permissions to the repository
   - Check if gh-pages package is installed
   - Verify you're in the correct directory

### Manual Deployment Alternative:

If `npm run deploy` fails, you can deploy manually:

```bash
# Build the project
npm run build

# Navigate to dist folder
cd dist

# Initialize git and deploy
git init
git add .
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/YOUR_USERNAME/vehicle-tracker-app.git
git push -f origin gh-pages
```

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ No errors in the deployment command
- ✅ `gh-pages` branch appears in your GitHub repository
- ✅ GitHub Pages shows "Your site is published at..."
- ✅ Application loads correctly at the GitHub Pages URL
- ✅ All features work (map, vehicle movement, controls)

---

## 🔗 Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [gh-pages npm package](https://www.npmjs.com/package/gh-pages)
- [Vite Static Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

---

*Replace `YOUR_USERNAME` with your actual GitHub username throughout this guide.*