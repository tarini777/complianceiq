# ComplianceIQ Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. **Prepare Your Repository**
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel**

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: complianceiq
# - Directory: ./
# - Override settings? No
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. **Set Up Database**

#### Option A: Vercel Postgres (Easiest)
1. In Vercel dashboard → Storage → Create Database
2. Choose "Postgres"
3. Copy the connection string
4. Add as `DATABASE_URL` environment variable

#### Option B: External Database
- **Neon**: https://neon.tech (Free tier available)
- **PlanetScale**: https://planetscale.com
- **Supabase**: https://supabase.com

### 4. **Environment Variables**
Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### 5. **Database Migration**
After deployment, run:
```bash
# In Vercel dashboard → Functions → Create new function
# Or use Vercel CLI:
vercel env pull .env.local
npx prisma db push
npx prisma generate
```

## 🎯 **Expected Results**

After deployment, you'll have:
- ✅ Full ComplianceIQ UI accessible at `https://your-app.vercel.app`
- ✅ All assessment features working
- ✅ AskRexi AI assistant functional
- ✅ Analytics dashboard
- ✅ Real-time collaboration features

## 🔧 **Troubleshooting**

### Common Issues:
1. **Database Connection**: Ensure `DATABASE_URL` is correct
2. **Build Errors**: Check Node.js version (18+)
3. **Prisma Issues**: Run `npx prisma generate` after deployment

### Build Command Override:
If needed, add to Vercel settings:
```bash
Build Command: npm run build
Install Command: npm install
Output Directory: .next
```

## 📊 **Performance Benefits**

Vercel provides:
- ⚡ **Edge Functions** for API routes
- 🌍 **Global CDN** for fast loading
- 🔄 **Automatic deployments** from GitHub
- 📈 **Built-in analytics**
- 🛡️ **DDoS protection**

## 💰 **Cost Estimate**

- **Vercel Pro**: $20/month (recommended for production)
- **Database**: $0-25/month depending on provider
- **Total**: ~$20-45/month for full production setup

## 🚀 **Next Steps After Deployment**

1. **Test all features** in production
2. **Set up custom domain** (optional)
3. **Configure monitoring** and alerts
4. **Set up CI/CD** for automatic deployments
5. **Configure backup strategy** for database

---

**Ready to deploy?** Run `vercel` in your project directory! 🚀
