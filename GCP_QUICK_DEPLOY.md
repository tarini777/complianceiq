# 🚀 ComplianceIQ GCP Quick Deploy

## ⚡ One-Command Deployment

```bash
# Make script executable and run
chmod +x deploy-gcp.sh && ./deploy-gcp.sh
```

## 📋 Pre-Flight Checklist

- [ ] GCP account with billing enabled
- [ ] Google Cloud CLI installed (`gcloud --version`)
- [ ] Docker installed (`docker --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Authenticated with GCP (`gcloud auth login`)

## 🎯 What Gets Deployed

| Service | Purpose | Cost (Est.) |
|---------|---------|-------------|
| **Cloud Run** | Next.js Application | $20-80/month |
| **Cloud SQL** | PostgreSQL Database | $15-50/month |
| **Redis** | Caching & Sessions | $10-30/month |
| **Cloud Storage** | File Storage | $5-20/month |
| **Monitoring** | Logs & Metrics | $5-15/month |
| **Total** | **Production Ready** | **$55-195/month** |

## 🔧 Manual Steps (If Needed)

### 1. Enable Billing
```bash
# Go to: https://console.cloud.google.com/billing
# Link your billing account to the project
```

### 2. Run Database Migrations
```bash
# After deployment, run:
npx prisma migrate deploy
```

### 3. Test Your Application
```bash
# Get your service URL
gcloud run services describe complianceiq --region=us-central1 --format="value(status.url)"

# Test health endpoint
curl https://YOUR_SERVICE_URL/api/health
```

## 🆘 Quick Troubleshooting

### Service Not Starting?
```bash
# Check logs
gcloud run services logs read complianceiq --region=us-central1
```

### Database Connection Issues?
```bash
# Check database status
gcloud sql instances describe complianceiq-db
```

### High Costs?
```bash
# Check resource usage
gcloud monitoring metrics list --filter="resource.type=cloud_run_revision"
```

## 📊 Monitor Your Deployment

### View Dashboard
```bash
# Open monitoring dashboard
open https://console.cloud.google.com/monitoring/dashboards
```

### Check Costs
```bash
# View billing
open https://console.cloud.google.com/billing
```

## 🎉 Success!

Your ComplianceIQ application is now live at:
**`https://complianceiq-prod-xxxxx-uc.a.run.app`**

### Next Steps:
1. ✅ Test all endpoints
2. ✅ Configure custom domain (optional)
3. ✅ Set up monitoring alerts
4. ✅ Plan backup strategy
5. ✅ Train your team

---

**Need Help?** Check the full [GCP Deployment Guide](./GCP_DEPLOYMENT_GUIDE.md) for detailed instructions and troubleshooting.
