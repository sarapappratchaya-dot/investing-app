# GitHub & Cloudflare Pages Setup

I have initialized a Git repository in your `investing` folder. To connect it to GitHub and Cloudflare, follow these final steps:

## 1. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new) named `investing-app`.
2. Run these commands in your terminal:
   ```bash
   cd investing
   git remote add origin https://github.com/YOUR_USERNAME/investing-app.git
   git branch -M main
   git push -u origin main
   ```

## 2. Connect to Cloudflare Pages
1. Go to the [Cloudflare Pages Dashboard](https://dash.cloudflare.com/).
2. Click **Connect to Git**.
3. Select your `investing-app` repository.
4. **Build Settings:**
   - **Framework preset:** `None`
   - **Build command:** `npx expo export -p web`
   - **Build output directory:** `dist`
5. **Environment Variables (Important for Build Fix):**
   - Click **Add variable**.
   - **Variable name:** `NPM_FLAGS`
   - **Value:** `--legacy-peer-deps`
6. Click **Save and Deploy**.

## Why this is better:
- **Automatic Updates:** Every time you change code and push to GitHub, Cloudflare will automatically rebuild and update your website.
- **No More Blank Screens:** Cloudflare will handle the build process itself, ensuring all internal links are perfectly set for their servers.

## Current Project Status
- **Local build tested:** Yes (`dist` folder is ready).
- **Web bundler configured:** Yes (Metro).
- **Git initialized:** Yes.
