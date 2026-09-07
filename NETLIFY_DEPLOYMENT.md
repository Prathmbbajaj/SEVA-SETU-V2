# 🚀 Deploying Seva Setu (सेवा सेतु) on Netlify via GitHub

This repository is fully configured and ready for automated Continuous Deployment on **Netlify** directly from your **GitHub** repository.

---

## 📋 Pre-Configured Netlify Build Specifications

Because of [`netlify.toml`](./netlify.toml), Netlify will automatically detect and apply all necessary settings:

| Setting | Value | Explanation |
| :--- | :--- | :--- |
| **Build Command** | `npm run build` | Light CI verification step |
| **Publish Directory** | `frontend` | Directory containing `index.html`, `app.js`, `style.css` |
| **Node Version** | `20` (LTS) | Specified via `[build.environment]` |
| **SPA Fallback** | `/* -> /index.html (200)` | Supports deep links & client-side navigation |
| **Security Headers** | Enabled | `X-Frame-Options`, `nosniff`, `Referrer-Policy`, etc. |
| **Asset Caching** | Enabled | 24-hour cache for `*.css` and `*.js` bundles |

---

## ⚡ Step-by-Step: Upload to GitHub & Deploy to Netlify

### Step 1: Commit and Push Changes to GitHub

In your project directory terminal (PowerShell or Bash), run:

```bash
# 1. Check git status to ensure only clean code and configs are staged
git status

# 2. Stage all prepared configuration files (.gitignore protects large files)
git add .

# 3. Commit the changes
git commit -m "feat: prepare project for Netlify production deployment"

# 4. Push to your GitHub repository
git push origin main
```

> [!NOTE]
> **GitHub File Limits Protected**: A comprehensive `.gitignore` is in place. Large demo video files (`.mp4`), python caches (`__pycache__`), and `node_modules/` are automatically excluded to prevent hitting GitHub's 100MB file limit.

---

### Step 2: Connect Repository to Netlify

1. Go to your **[Netlify Dashboard](https://app.netlify.com/)** and log in (using your GitHub account is recommended).
2. Click **"Add new site"** (top right) → select **"Import an existing project"**.
3. Under *Connect to Git provider*, click **GitHub**.
4. Authorize Netlify and choose the repository: **`Prathmbbajaj/Seva-Setu`** (or your active repository fork).
5. In the **Site configuration** screen:
   - **Branch to deploy**: `main`
   - **Base directory**: *(Leave blank — root)*
   - **Build command**: `npm run build` *(Auto-detected from netlify.toml)*
   - **Publish directory**: `frontend` *(Auto-detected from netlify.toml)*
6. Click **"Deploy Seva Setu"**!

Netlify will build and publish your site in less than 30 seconds, generating a production HTTPS URL (e.g. `https://seva-setu-xyz.netlify.app`).

---

### Step 3: Custom Domain & Site Name (Optional)

1. In your site dashboard on Netlify, navigate to **Site configuration** → **Site details**.
2. Click **"Change site name"** to set a memorable name like `seva-setu-coop.netlify.app`.
3. If you have a custom government or organizational domain (e.g., `sevasetu.gov.in`), click **Domain management** → **Add a custom domain**.

---

## ⚙️ How the Architecture Works on Netlify

### 1. Autonomous In-Browser Engine (Default)
When hosted on Netlify, the application runs with full interactivity in **Autonomous Mode**:
- **100% Client-Side Interactive**:
  - OpenStreetMap (Leaflet) proximity radar and worker radius matching
  - Transparent itemized quote calculations (base wage + toolkit wear + transit fare)
  - Rapido-style job broadcast & worker acceptance simulation
  - Dual-OTP flow (`START_OTP` and `END_OTP` with completion photo proof)
  - Interactive payment gateway simulation (UPI QR, Cooperative DCCB Bank transfer)
  - NGO DARPAN 20% subsidy verification form
  - Ministry Cockpit district analytics and verified review moderation
  - Bidirectional English/Hindi translation engine (159 UI keys)
- **Zero Mixed-Content Warnings**: Safe for HTTPS with no insecure HTTP requests.

---

### 2. (Optional) Connecting a Live FastAPI Backend
If you deploy the Python FastAPI backend (`backend/main.py`) to a cloud container service like **[Render.com](https://render.com/)**, **[Railway.app](https://railway.app/)**, or **[Fly.io](https://fly.io/)**:

#### Method A: Netlify API Proxy (Recommended)
Open [`netlify.toml`](./netlify.toml) and uncomment the proxy redirect block:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-sevasetu-backend.onrender.com/api/:splat"
  status = 200
  force = true
```
Push to GitHub, and Netlify will proxy all `/api/...` calls through your Netlify domain, completely eliminating CORS issues!

#### Method B: Browser Console Override (For Testing)
You can point your live Netlify site to any backend directly in the browser DevTools console:
```javascript
// Point to your live backend:
setBackendUrl("https://your-backend-api.onrender.com");

// Revert back to Autonomous Engine:
setBackendUrl(null);
```

---

## 📁 Key Deployment Files

| File | Purpose |
| :--- | :--- |
| [`netlify.toml`](./netlify.toml) | Primary Netlify config: `publish = "frontend"`, Node 20 LTS, SPA routing rules, security headers. |
| [`.gitignore`](./.gitignore) | Blocks large media (`*.mp4`), `node_modules/`, `.venv/`, and pycache to guarantee successful GitHub pushes. |
| [`frontend/_redirects`](./frontend/_redirects) | Fallback SPA rule (`/* /index.html 200`) for folder-based builds. |
| [`frontend/_headers`](./frontend/_headers) | Content security headers and caching policy. |
| [`_redirects`](./_redirects) | Root redirect rules ensuring `/` and assets route properly if deployed from root. |
| [`index.html`](./index.html) | Root fallback page that automatically redirects to `/frontend/`. |
| [`package.json`](./package.json) | Clean build and verification scripts (`npm run build`, `npm run validate`). |
| [`verify_netlify_setup.js`](./verify_netlify_setup.js) | Automated pre-flight check script to test the entire deployment configuration. |
