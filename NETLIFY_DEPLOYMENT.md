# 🚀 Deploying SahakarSeva on Netlify

This repository is fully configured and ready for one-click deployment on **Netlify**.

---

## ⚡ Option 1: Instant Drag & Drop (Zero Setup, 30 Seconds)

You don't even need a Git repository or command line to deploy!

1. Log into your **[Netlify Dashboard](https://app.netlify.com/)**.
2. Go to the **Sites** tab and scroll down to the **"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"** area (or go directly to **[app.netlify.com/drop](https://app.netlify.com/drop)**).
3. Drag and drop either:
   - The **`frontend`** folder directly (**Recommended**), OR
   - The entire **`Seva Setu App`** project folder (our root redirect fallback will route it automatically).
4. Netlify will instantly provision your live HTTPS URL (e.g. `https://sahakarseva-xyz.netlify.app`)!

---

## 🔗 Option 2: Continuous Deployment via GitHub (Recommended)

When you push your code to GitHub, Netlify can automatically build and update your site on every commit:

1. Push this project to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: configure netlify production deployment"
   git push origin main
   ```
2. In your **Netlify Dashboard**, click **"Add new site"** → **"Import an existing project"**.
3. Choose **GitHub** and select your repository.
4. Netlify will **automatically detect `netlify.toml`**:
   - **Base directory**: `.` (Root)
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend`
5. Click **"Deploy site"**. Your site is now live with automated CI/CD!

---

## 💻 Option 3: Deploy via Netlify CLI

If you prefer using the terminal:

```bash
# 1. Install Netlify CLI globally or use npx
npx netlify-cli login

# 2. Deploy a preview draft
npx netlify-cli deploy --dir=frontend

# 3. Deploy to production
npx netlify-cli deploy --prod --dir=frontend
```

---

## ⚙️ How the Architecture Works on Netlify

### 1. Autonomous In-Browser Engine (Default)
When hosted on Netlify, the application runs in **Autonomous Mode** (`Autonomous Engine` badge).
- **100% Client-Side Interactive**: Complete quote calculation, OpenStreetMap Leaflet proximity radar, Rapido-style job broadcast, Dual-OTP settlement, NGO subsidies, and Ministry analytics work out of the box without needing any external server.
- **Zero Mixed-Content Warnings**: Safe for HTTPS with no insecure HTTP requests.

### 2. (Optional) Connecting a Live FastAPI Backend
If you deploy your Python FastAPI backend (`backend/main.py`) to a cloud provider like **[Render.com](https://render.com/)**, **[Railway.app](https://railway.app/)**, or **[Fly.io](https://fly.io/)**:

#### Method A: Netlify API Proxy (Recommended)
Open `netlify.toml` and uncomment the proxy rule:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-app.onrender.com/api/:splat"
  status = 200
  force = true
```
This proxies all `/api/...` calls through your Netlify domain, eliminating CORS and mixed-content issues.

#### Method B: Browser Runtime Override
You can test with any backend URL directly in the live browser console without redeploying:
```javascript
// In browser DevTools Console:
setBackendUrl("https://your-backend-app.onrender.com");

// To revert back to autonomous engine:
setBackendUrl(null);
```

---

## 📁 Deployment Files Reference

| File | Role |
| :--- | :--- |
| [`netlify.toml`](./netlify.toml) | Primary Netlify CI/CD config specifying `publish = "frontend"`, SPA redirects, and security headers. |
| [`frontend/_redirects`](./frontend/_redirects) | Fallback SPA routing rule (`/* /index.html 200`) for direct folder uploads. |
| [`frontend/_headers`](./frontend/_headers) | Security & caching headers for static assets. |
| [`index.html`](./index.html) | Root fallback redirect in case the root directory is dragged into Netlify Drop. |
| [`_redirects`](./_redirects) | Root redirect rules for transparent routing. |
| [`package.json`](./package.json) | Build scripts for Netlify CI compatibility. |
