# Deploying to Cloudflare Pages

Since we are using Expo, we can export the app as a **Static Site** and deploy it to Cloudflare Pages.

## 1. Build the Web App Locally
Run this command in the `investing` folder:
```bash
npx expo export:web
```
This will create a `dist` folder containing your web app.

## 2. Deploy to Cloudflare Pages

### Option A: Manual Upload (Easiest)
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** > **Pages** > **Create a project**.
3. Choose **Direct Upload**.
4. Drag and drop the `dist` folder you just created.

### Option B: Using Wrangler (CLI)
If you have a Cloudflare account, you can deploy directly from your terminal:
```bash
npx wrangler pages deploy dist
```

## 3. Automated Deployment (GitHub)
The best way is to connect your GitHub repository to Cloudflare Pages:
1. Push your code to GitHub.
2. In Cloudflare Pages, choose **Connect to Git**.
3. Set the **Build Command** to: `npx expo export:web`
4. Set the **Build Output Directory** to: `dist`

## Features on Web
- Works exactly like the mobile app.
- Responsive design (works on mobile browsers and desktop).
- Live Crypto data via API.
