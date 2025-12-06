# 🚀 Deploy to Vercel

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **"New Project"**
   - Import your GitHub repository `Deepak22903/image-gen`

3. **Configure Environment Variables**
   - In the Vercel import screen, add these environment variables:
     - `CLOUDFLARE_ACCOUNT_ID` = your Cloudflare account ID
     - `CLOUDFLARE_API_TOKEN` = your Cloudflare API token
     - `PORT` = 3000 (optional)

4. **Deploy**
   - Click **"Deploy"**
   - Wait 1-2 minutes for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add CLOUDFLARE_ACCOUNT_ID
   vercel env add CLOUDFLARE_API_TOKEN
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## What I've Configured

✅ Created `vercel.json` - Configures Vercel to run your Node.js server
✅ Your project is ready to deploy as-is
✅ `.gitignore` already excludes `.env` files

## After Deployment

- **Live URL**: Vercel will provide a URL like `https://image-gen-xxx.vercel.app`
- **Auto-Deploy**: Push to `main` branch to auto-redeploy
- **Custom Domain**: Add your own domain in Vercel dashboard

## Troubleshooting

If you see errors:
- Make sure environment variables are set in Vercel dashboard
- Check build logs in Vercel dashboard
- Ensure `package.json` has all dependencies listed

## 📝 Note

Your app uses Express server which works perfectly on Vercel. The `vercel.json` configuration ensures all routes are handled correctly.
