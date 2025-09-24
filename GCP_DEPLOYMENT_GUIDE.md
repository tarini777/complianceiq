# 🚀 ComplianceIQ GCP Deployment Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)
9. [Cost Optimization](#cost-optimization)
10. [Security Best Practices](#security-best-practices)

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)
```bash
# Clone your repository
git clone <your-repo-url>
cd ComplianceIQ

# Make deployment script executable
chmod +x deploy-gcp.sh

# Run automated deployment
./deploy-gcp.sh
```

### Option 2: Manual Deployment
Follow the detailed steps in [Step-by-Step Deployment](#step-by-step-deployment)

## 📋 Prerequisites

### Required Software
- [ ] **Google Cloud CLI** - [Install Guide](https://cloud.google.com/sdk/docs/install)
- [ ] **Docker** - [Install Guide](https://docs.docker.com/get-docker/)
- [ ] **Node.js 18+** - [Download](https://nodejs.org/)
- [ ] **Git** - [Install Guide](https://git-scm.com/downloads)

### Required Accounts
- [ ] **Google Cloud Platform Account** with billing enabled
- [ ] **Domain name** (optional but recommended)

### Required Permissions
- [ ] **Project Owner** or **Editor** role on GCP project
- [ ] **Billing Account** access

## 🎯 Step-by-Step Deployment

### Phase 1: GCP Project Setup

#### 1.1 Create GCP Project
```bash
# Create new project
gcloud projects create complianceiq-prod --name="ComplianceIQ Production"

# Set as default project
gcloud config set project complianceiq-prod

# Enable billing (required - do this in GCP Console)
# Go to: https://console.cloud.google.com/billing
```

#### 1.2 Enable Required APIs
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

#### 1.3 Configure Authentication
```bash
# Authenticate with GCP
gcloud auth login

# Set default region
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# Create service account
gcloud iam service-accounts create complianceiq-deploy \
    --display-name="ComplianceIQ Deployment Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding complianceiq-prod \
    --member="serviceAccount:complianceiq-deploy@complianceiq-prod.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding complianceiq-prod \
    --member="serviceAccount:complianceiq-deploy@complianceiq-prod.iam.gserviceaccount.com" \
    --role="roles/cloudsql.admin"
```

### Phase 2: Database Setup

#### 2.1 Create Cloud SQL Instance
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

# Create user
gcloud sql users create complianceiq-user \
    --instance=complianceiq-db \
    --password=$(openssl rand -base64 32)
```

#### 2.2 Store Secrets
```bash
# Store database password
echo -n "YOUR_DB_PASSWORD" | gcloud secrets create db-password --data-file=-

# Store username
echo -n "complianceiq-user" | gcloud secrets create db-username --data-file=-
```

### Phase 3: Application Deployment

#### 3.1 Prepare Application
```bash
# Navigate to project directory
cd /Users/tarinipersonal/Documents/ComplianceIQ

# Copy environment template
cp env.gcp.example .env.production

# Edit environment variables
nano .env.production
```

#### 3.2 Build and Deploy
```bash
# Build container image
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

### Phase 4: Redis Setup

#### 4.1 Create Redis Instance
```bash
# Create Redis instance
gcloud redis instances create complianceiq-redis \
    --size=1 \
    --region=us-central1 \
    --redis-version=redis_6_x \
    --tier=basic

# Get Redis IP
REDIS_IP=$(gcloud redis instances describe complianceiq-redis \
    --region=us-central1 --format="value(host)")

# Update Cloud Run with Redis URL
gcloud run services update complianceiq \
    --region=us-central1 \
    --set-env-vars REDIS_URL="redis://$REDIS_IP:6379"
```

### Phase 5: Storage Setup

#### 5.1 Create Storage Bucket
```bash
# Create bucket
gsutil mb gs://complianceiq-files-prod

# Set permissions
gsutil iam ch allUsers:objectViewer gs://complianceiq-files-prod

# Create folders
gsutil mkdir gs://complianceiq-files-prod/assessments
gsutil mkdir gs://complianceiq-files-prod/evidence
gsutil mkdir gs://complianceiq-files-prod/documents
```

## ⚙️ Configuration

### Environment Variables

#### Required Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@/db?host=/cloudsql/project:region:instance"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-app-url.run.app"

# Redis
REDIS_URL="redis://ip:6379"

# Security
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-app-url.run.app"
```

#### Optional Variables
```bash
# Storage
GCS_BUCKET_NAME="complianceiq-files-prod"

# Monitoring
GOOGLE_CLOUD_PROJECT="complianceiq-prod"

# Features
ENABLE_ASKREXI="true"
ENABLE_COLLABORATION="true"
```

### Database Configuration

#### Connection String Format
```
postgresql://username:password@/database?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
```

#### Example
```
postgresql://complianceiq-user:mypassword@/complianceiq?host=/cloudsql/complianceiq-prod:us-central1:complianceiq-db
```

### Redis Configuration

#### Connection URL Format
```
redis://IP_ADDRESS:6379
```

#### Example
```
redis://10.123.456.789:6379
```

## 🧪 Testing

### Health Checks

#### 1. Application Health
```bash
# Test health endpoint
curl https://your-app-url.run.app/api/health

# Expected response
{"status": "healthy", "timestamp": "2024-01-01T00:00:00.000Z"}
```

#### 2. Database Connection
```bash
# Test database connectivity
curl https://your-app-url.run.app/api/db/health

# Expected response
{"database": "connected", "status": "healthy"}
```

#### 3. AskRexi Functionality
```bash
# Test AskRexi endpoint
curl -X POST https://your-app-url.run.app/api/askrexi \
    -H "Content-Type: application/json" \
    -d '{"question": "What are FDA requirements for AI in healthcare?"}'

# Expected response
{
  "response": "FDA requirements for AI in healthcare...",
  "sources": ["FDA Guidance Document"],
  "confidence": 0.95
}
```

### Load Testing

#### Basic Load Test
```bash
# Install Apache Bench
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Run load test
ab -n 100 -c 10 https://your-app-url.run.app/api/health
```

#### Advanced Load Testing
```bash
# Install k6
# macOS: brew install k6
# Ubuntu: sudo apt-get install k6

# Create test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export default function() {
  const response = http.get('https://your-app-url.run.app/api/health');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
EOF

# Run test
k6 run --vus 10 --duration 30s load-test.js
```

## 📊 Monitoring

### Cloud Monitoring Dashboard

#### Create Dashboard
```bash
# Create monitoring dashboard
gcloud monitoring dashboards create --config-from-file=monitoring-dashboard.json
```

#### Key Metrics to Monitor
- **Request Count**: Number of requests per second
- **Response Time**: Average response time
- **Error Rate**: Percentage of failed requests
- **Instance Count**: Number of running instances
- **CPU Usage**: Database CPU utilization
- **Memory Usage**: Database memory utilization

### Alerting

#### Create Alert Policy
```bash
# Create alerting policy
gcloud alpha monitoring policies create --policy-from-file=alert-policy.yaml
```

#### Key Alerts
- **High Error Rate**: > 10 errors per second
- **High Response Time**: > 2 seconds average
- **High CPU Usage**: > 80% database CPU
- **High Memory Usage**: > 90% database memory
- **Service Down**: No requests for 10 minutes

### Logging

#### View Logs
```bash
# View Cloud Run logs
gcloud run services logs read complianceiq --region=us-central1

# View database logs
gcloud sql operations list --instance=complianceiq-db

# View Redis logs
gcloud redis instances describe complianceiq-redis --region=us-central1
```

## 🆘 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

**Problem**: Application can't connect to database
```
Error: connect ECONNREFUSED
```

**Solutions**:
```bash
# Check Cloud SQL instance status
gcloud sql instances describe complianceiq-db

# Test connection
gcloud sql connect complianceiq-db --user=complianceiq-user --database=complianceiq

# Check connection string format
echo $DATABASE_URL
```

**Prevention**:
- Use correct connection string format
- Ensure Cloud SQL instance is running
- Check firewall rules

#### 2. Cloud Run Deployment Issues

**Problem**: Service fails to start
```
Error: Container failed to start
```

**Solutions**:
```bash
# Check service logs
gcloud run services logs read complianceiq --region=us-central1

# Check service configuration
gcloud run services describe complianceiq --region=us-central1

# Redeploy with debug
gcloud run deploy complianceiq --image gcr.io/complianceiq-prod/complianceiq --region=us-central1
```

**Prevention**:
- Test Docker image locally first
- Check environment variables
- Verify port configuration

#### 3. Redis Connection Issues

**Problem**: Redis connection timeout
```
Error: Redis connection timeout
```

**Solutions**:
```bash
# Check Redis instance
gcloud redis instances describe complianceiq-redis --region=us-central1

# Test Redis connection
gcloud redis instances get-auth-string complianceiq-redis --region=us-central1

# Check Redis IP
gcloud redis instances describe complianceiq-redis --region=us-central1 --format="value(host)"
```

**Prevention**:
- Use correct Redis IP address
- Ensure Redis instance is running
- Check VPC configuration

#### 4. Memory Issues

**Problem**: Out of memory errors
```
Error: JavaScript heap out of memory
```

**Solutions**:
```bash
# Increase Cloud Run memory
gcloud run services update complianceiq \
    --region=us-central1 \
    --memory 4Gi

# Check memory usage
gcloud run services describe complianceiq --region=us-central1
```

**Prevention**:
- Monitor memory usage
- Optimize application code
- Use appropriate memory allocation

#### 5. Performance Issues

**Problem**: Slow response times
```
Response time > 5 seconds
```

**Solutions**:
```bash
# Increase CPU allocation
gcloud run services update complianceiq \
    --region=us-central1 \
    --cpu 4

# Enable auto-scaling
gcloud run services update complianceiq \
    --region=us-central1 \
    --max-instances 20
```

**Prevention**:
- Monitor performance metrics
- Optimize database queries
- Use caching effectively

### Debug Commands

#### Application Debugging
```bash
# View real-time logs
gcloud run services logs tail complianceiq --region=us-central1

# Check service status
gcloud run services describe complianceiq --region=us-central1

# Test endpoints
curl -v https://your-app-url.run.app/api/health
```

#### Database Debugging
```bash
# Connect to database
gcloud sql connect complianceiq-db --user=complianceiq-user --database=complianceiq

# Check database status
gcloud sql instances describe complianceiq-db

# View database logs
gcloud sql operations list --instance=complianceiq-db
```

#### Redis Debugging
```bash
# Check Redis status
gcloud redis instances describe complianceiq-redis --region=us-central1

# Test Redis connection
redis-cli -h REDIS_IP -p 6379 ping
```

## 🔧 Maintenance

### Regular Maintenance Tasks

#### Daily
- [ ] Check monitoring dashboards
- [ ] Review error logs
- [ ] Monitor performance metrics

#### Weekly
- [ ] Review cost reports
- [ ] Check backup status
- [ ] Update dependencies

#### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Capacity planning

#### Quarterly
- [ ] Disaster recovery test
- [ ] Compliance review
- [ ] Architecture review

### Backup Strategy

#### Database Backups
```bash
# Automated backups are enabled by default
# Manual backup
gcloud sql backups create --instance=complianceiq-db

# Restore from backup
gcloud sql backups restore BACKUP_ID --instance=complianceiq-db
```

#### Application Backups
```bash
# Backup environment variables
gcloud secrets versions list db-password
gcloud secrets versions list db-username

# Backup configuration
gsutil cp -r gs://complianceiq-files-prod gs://complianceiq-backup-$(date +%Y%m%d)
```

### Updates and Upgrades

#### Application Updates
```bash
# Build new image
gcloud builds submit --tag gcr.io/complianceiq-prod/complianceiq:latest

# Deploy update
gcloud run deploy complianceiq \
    --image gcr.io/complianceiq-prod/complianceiq:latest \
    --region=us-central1
```

#### Database Updates
```bash
# Run migrations
gcloud run jobs create migrate-db \
    --image gcr.io/complianceiq-prod/complianceiq:latest \
    --region=us-central1 \
    --command="npx" \
    --args="prisma,migrate,deploy" \
    --add-cloudsql-instances complianceiq-prod:us-central1:complianceiq-db

# Execute job
gcloud run jobs execute migrate-db --region=us-central1
```

## 💰 Cost Optimization

### Cost Monitoring

#### Daily Cost Tracking
```bash
# View current costs
gcloud billing budgets list --billing-account=BILLING_ACCOUNT_ID

# Set up budget alerts
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="ComplianceIQ Budget" \
    --budget-amount=500USD \
    --threshold-rule=percent=80 \
    --threshold-rule=percent=100
```

### Cost Optimization Strategies

#### 1. Right-size Resources
```bash
# Monitor actual usage
gcloud monitoring metrics list --filter="resource.type=cloud_run_revision"

# Adjust based on usage
gcloud run services update complianceiq \
    --region=us-central1 \
    --memory 1Gi \
    --cpu 1
```

#### 2. Use Preemptible Instances
```bash
# For non-critical workloads
gcloud run deploy complianceiq-batch \
    --image gcr.io/complianceiq-prod/complianceiq:latest \
    --region=us-central1 \
    --cpu-throttling
```

#### 3. Optimize Storage
```bash
# Use appropriate storage classes
gsutil rewrite -s NEARLINE gs://complianceiq-files-prod/old-files/*
gsutil rewrite -s COLDLINE gs://complianceiq-files-prod/archive/*
```

### Cost Breakdown (Estimated)

#### Development Environment (~$50-100/month)
- Cloud Run: $20-40
- Cloud SQL: $15-25
- Cloud Storage: $5-10
- Redis: $10-15
- Monitoring: $5-10

#### Production Environment (~$200-400/month)
- Cloud Run: $80-150
- Cloud SQL: $50-100
- Cloud Storage: $20-40
- Redis: $30-50
- Monitoring: $20-40

## 🔒 Security Best Practices

### Network Security

#### VPC Configuration
```bash
# Create VPC
gcloud compute networks create complianceiq-vpc \
    --subnet-mode=regional

# Create private subnet
gcloud compute networks subnets create complianceiq-subnet \
    --network=complianceiq-vpc \
    --range=10.0.0.0/24 \
    --region=us-central1
```

#### Firewall Rules
```bash
# Allow Cloud Run traffic
gcloud compute firewall-rules create allow-cloud-run \
    --network=complianceiq-vpc \
    --allow=tcp:8080 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=cloud-run
```

### Application Security

#### Environment Variables
```bash
# Use Secret Manager for sensitive data
gcloud secrets create api-key --data-file=api-key.txt

# Reference in Cloud Run
gcloud run services update complianceiq \
    --region=us-central1 \
    --set-secrets API_KEY=api-key:latest
```

#### SSL/TLS Configuration
```bash
# SSL is automatically handled by Cloud Run
# For custom domains, use Cloud Load Balancer
gcloud compute ssl-certificates create complianceiq-ssl \
    --domains=your-domain.com
```

### Data Security

#### Encryption
```bash
# Database encryption (enabled by default)
gcloud sql instances describe complianceiq-db \
    --format="value(settings.dataDiskEncryptionStatus)"

# Storage encryption (enabled by default)
gsutil kms encryption -k projects/complianceiq-prod/locations/us-central1/keyRings/complianceiq-keyring/cryptoKeys/complianceiq-key gs://complianceiq-files-prod
```

#### Access Control
```bash
# Use IAM for access control
gcloud projects add-iam-policy-binding complianceiq-prod \
    --member="user:admin@company.com" \
    --role="roles/editor"

# Create custom roles
gcloud iam roles create complianceiqViewer \
    --project=complianceiq-prod \
    --title="ComplianceIQ Viewer" \
    --description="Can view ComplianceIQ resources" \
    --permissions="run.services.get,run.services.list"
```

## 📞 Support and Resources

### Documentation
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [Cloud Monitoring Documentation](https://cloud.google.com/monitoring/docs)

### Community Support
- [Google Cloud Community](https://cloud.google.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-cloud-platform)
- [Reddit r/googlecloud](https://www.reddit.com/r/googlecloud/)

### Professional Support
- [Google Cloud Support](https://cloud.google.com/support)
- [Google Cloud Professional Services](https://cloud.google.com/professional-services)

---

## 🎉 Deployment Complete!

Your ComplianceIQ application is now successfully deployed on Google Cloud Platform with:

✅ **Auto-scaling Cloud Run service**  
✅ **Managed PostgreSQL database**  
✅ **Redis caching layer**  
✅ **Cloud Storage for files**  
✅ **Comprehensive monitoring**  
✅ **Security best practices**  
✅ **Cost optimization**  

**Your application URL:** `https://complianceiq-prod-xxxxx-uc.a.run.app`

**Next Steps:**
1. Configure custom domain (optional)
2. Set up CI/CD pipeline
3. Implement backup strategies
4. Train your team on monitoring tools
5. Plan for scaling as your user base grows

**Need Help?**
- Check the troubleshooting section above
- Review the monitoring dashboards
- Contact support if issues persist

**Congratulations on your successful deployment! 🚀**
