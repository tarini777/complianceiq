# 🚀 ComplianceIQ GCP Deployment Plan

## 📋 Pre-Deployment Checklist

### ✅ Prerequisites
- [ ] GCP Account with billing enabled
- [ ] Google Cloud CLI installed and configured
- [ ] Docker installed locally
- [ ] Node.js 18+ installed
- [ ] Git repository with ComplianceIQ code
- [ ] Domain name (optional but recommended)

### ✅ Required GCP APIs
- [ ] Cloud Run API
- [ ] Cloud SQL Admin API
- [ ] Cloud Storage API
- [ ] Cloud Memorystore API
- [ ] Container Registry API
- [ ] Cloud Build API
- [ ] Secret Manager API

## 🎯 Phase 1: GCP Project Setup (15 minutes)

### Step 1.1: Create GCP Project
```bash
# Create new project
gcloud projects create complianceiq-prod --name="ComplianceIQ Production"

# Set project as default
gcloud config set project complianceiq-prod

# Enable billing (required for most services)
# Note: Do this in GCP Console -> Billing
```

### Step 1.2: Enable Required APIs
```bash
# Enable all required APIs
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable redis.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

### Step 1.3: Configure Authentication
```bash
# Authenticate with GCP
gcloud auth login

# Set default region and zone
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# Create service account for deployment
gcloud iam service-accounts create complianceiq-deploy \
    --display-name="ComplianceIQ Deployment Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding complianceiq-prod \
    --member="serviceAccount:complianceiq-deploy@complianceiq-prod.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding complianceiq-prod \
    --member="serviceAccount:complianceiq-deploy@complianceiq-prod.iam.gserviceaccount.com" \
    --role="roles/cloudsql.admin"

gcloud projects add-iam-policy-binding complianceiq-prod \
    --member="serviceAccount:complianceiq-deploy@complianceiq-prod.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

## 🗄️ Phase 2: Database Setup (20 minutes)

### Step 2.1: Create Cloud SQL Instance
```bash
# Create PostgreSQL instance
gcloud sql instances create complianceiq-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --storage-type=SSD \
    --storage-size=20GB \
    --backup \
    --enable-ip-alias \
    --authorized-networks=0.0.0.0/0

# Create database
gcloud sql databases create complianceiq --instance=complianceiq-db

# Create database user
gcloud sql users create complianceiq-user \
    --instance=complianceiq-db \
    --password=YOUR_SECURE_PASSWORD_HERE
```

### Step 2.2: Configure Database Connection
```bash
# Get connection name
gcloud sql instances describe complianceiq-db --format="value(connectionName)"

# Store connection details in Secret Manager
echo -n "YOUR_SECURE_PASSWORD_HERE" | gcloud secrets create db-password --data-file=-
echo -n "complianceiq-user" | gcloud secrets create db-username --data-file=-
```

## 🚀 Phase 3: Application Deployment (30 minutes)

### Step 3.1: Prepare Application for Deployment
```bash
# Navigate to project directory
cd /Users/tarinipersonal/Documents/ComplianceIQ

# Create production environment file
cat > .env.production << EOF
# Database Configuration
DATABASE_URL="postgresql://complianceiq-user:YOUR_SECURE_PASSWORD_HERE@/complianceiq?host=/cloudsql/complianceiq-prod:us-central1:complianceiq-db"

# Application Configuration
NEXT_PUBLIC_APP_URL="https://complianceiq-prod-xxxxx-uc.a.run.app"
NODE_ENV="production"

# Redis Configuration (will be added after Redis setup)
REDIS_URL="redis://10.x.x.x:6379"

# Security
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://complianceiq-prod-xxxxx-uc.a.run.app"
EOF
```

### Step 3.2: Create Dockerfile for Cloud Run
```bash
# Create optimized Dockerfile
cat > Dockerfile << 'EOF'
# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF
```

### Step 3.3: Configure Next.js for Cloud Run
```bash
# Update next.config.js for Cloud Run
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Enable standalone output for Cloud Run
  output: 'standalone',
  // Configure for Cloud Run
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
EOF
```

### Step 3.4: Build and Deploy to Cloud Run
```bash
# Build and push container image
gcloud builds submit --tag gcr.io/complianceiq-prod/complianceiq

# Deploy to Cloud Run
gcloud run deploy complianceiq \
    --image gcr.io/complianceiq-prod/complianceiq \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 10 \
    --min-instances 1 \
    --set-env-vars NODE_ENV=production \
    --add-cloudsql-instances complianceiq-prod:us-central1:complianceiq-db
```

## 🔍 Phase 4: Redis Setup (15 minutes)

### Step 4.1: Create Redis Instance
```bash
# Create Redis instance for caching
gcloud redis instances create complianceiq-redis \
    --size=1 \
    --region=us-central1 \
    --redis-version=redis_6_x \
    --tier=basic

# Get Redis IP address
gcloud redis instances describe complianceiq-redis \
    --region=us-central1 \
    --format="value(host)"
```

### Step 4.2: Update Application with Redis
```bash
# Update Cloud Run service with Redis URL
gcloud run services update complianceiq \
    --region=us-central1 \
    --set-env-vars REDIS_URL="redis://REDIS_IP:6379"
```

## 📁 Phase 5: Cloud Storage Setup (10 minutes)

### Step 5.1: Create Storage Bucket
```bash
# Create storage bucket for files
gsutil mb gs://complianceiq-files-prod

# Set bucket permissions
gsutil iam ch allUsers:objectViewer gs://complianceiq-files-prod

# Create folders
gsutil mkdir gs://complianceiq-files-prod/assessments
gsutil mkdir gs://complianceiq-files-prod/evidence
gsutil mkdir gs://complianceiq-files-prod/documents
```

## 🔒 Phase 6: Security & Monitoring (20 minutes)

### Step 6.1: Configure Load Balancer
```bash
# Create load balancer (if using custom domain)
gcloud compute url-maps create complianceiq-lb \
    --default-service complianceiq-backend-service

# Create SSL certificate (if using custom domain)
gcloud compute ssl-certificates create complianceiq-ssl \
    --domains=your-domain.com
```

### Step 6.2: Set up Monitoring
```bash
# Create monitoring dashboard
gcloud monitoring dashboards create --config-from-file=monitoring-dashboard.json

# Set up alerting policies
gcloud alpha monitoring policies create --policy-from-file=alerting-policy.yaml
```

## 🧪 Phase 7: Database Migration & Testing (15 minutes)

### Step 7.1: Run Database Migrations
```bash
# Connect to Cloud Run service
gcloud run services proxy complianceiq --port=8080

# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed database (if needed)
npx prisma db seed
```

### Step 7.2: Test Application
```bash
# Test health endpoint
curl https://complianceiq-prod-xxxxx-uc.a.run.app/api/health

# Test AskRexi endpoint
curl -X POST https://complianceiq-prod-xxxxx-uc.a.run.app/api/askrexi \
    -H "Content-Type: application/json" \
    -d '{"question": "What are FDA requirements for AI in healthcare?"}'
```

## 🎯 Phase 8: Production Optimization (20 minutes)

### Step 8.1: Configure Auto-scaling
```bash
# Update Cloud Run with optimized scaling
gcloud run services update complianceiq \
    --region=us-central1 \
    --min-instances=1 \
    --max-instances=20 \
    --concurrency=100 \
    --cpu-throttling \
    --execution-environment=gen2
```

### Step 8.2: Set up CDN
```bash
# Create Cloud CDN for static assets
gcloud compute backend-buckets create complianceiq-backend-bucket \
    --gcs-bucket-name=complianceiq-files-prod
```

## 📊 Phase 9: Monitoring & Alerting (15 minutes)

### Step 9.1: Create Monitoring Dashboard
```bash
# Create custom monitoring dashboard
gcloud monitoring dashboards create --config-from-file=dashboard-config.json
```

### Step 9.2: Set up Alerts
```bash
# Create alerting policies
gcloud alpha monitoring policies create --policy-from-file=alert-policy.yaml
```

## 🚀 Phase 10: Go Live Checklist (10 minutes)

### Final Verification
- [ ] Application accessible via HTTPS
- [ ] Database connections working
- [ ] Redis caching functional
- [ ] File uploads working
- [ ] AskRexi responses working
- [ ] Real-time collaboration working
- [ ] Monitoring dashboard active
- [ ] Backup strategy in place
- [ ] SSL certificate valid
- [ ] Performance metrics normal

### Post-Deployment Tasks
- [ ] Update DNS records (if using custom domain)
- [ ] Configure backup schedules
- [ ] Set up log retention policies
- [ ] Create disaster recovery plan
- [ ] Document deployment process
- [ ] Train team on monitoring tools

## 🆘 Troubleshooting Guide

### Common Issues & Solutions

#### 1. Database Connection Issues
```bash
# Check Cloud SQL instance status
gcloud sql instances describe complianceiq-db

# Test connection
gcloud sql connect complianceiq-db --user=complianceiq-user --database=complianceiq
```

#### 2. Cloud Run Deployment Issues
```bash
# Check service logs
gcloud run services logs read complianceiq --region=us-central1

# Check service status
gcloud run services describe complianceiq --region=us-central1
```

#### 3. Redis Connection Issues
```bash
# Check Redis instance
gcloud redis instances describe complianceiq-redis --region=us-central1

# Test Redis connection
gcloud redis instances get-auth-string complianceiq-redis --region=us-central1
```

## 💰 Cost Monitoring

### Daily Cost Tracking
- Monitor Cloud Run usage
- Track database connections
- Monitor storage usage
- Review Redis usage

### Cost Optimization Tips
- Use Cloud Run's pay-per-request model
- Implement proper caching strategies
- Optimize database queries
- Use appropriate instance sizes

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly: Review monitoring dashboards
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Review and optimize costs
- [ ] Annually: Security audit and compliance review

### Emergency Contacts
- GCP Support: https://cloud.google.com/support
- Documentation: https://cloud.google.com/docs
- Community: https://cloud.google.com/community

---

## 🎉 Deployment Complete!

Your ComplianceIQ application is now running on Google Cloud Platform with:
- ✅ Auto-scaling Cloud Run service
- ✅ Managed PostgreSQL database
- ✅ Redis caching layer
- ✅ Cloud Storage for files
- ✅ Monitoring and alerting
- ✅ SSL/HTTPS security
- ✅ Global load balancing

**Your application URL:** `https://complianceiq-prod-xxxxx-uc.a.run.app`

**Next Steps:**
1. Configure custom domain (optional)
2. Set up CI/CD pipeline
3. Implement backup strategies
4. Train your team on monitoring tools
5. Plan for scaling as your user base grows
