#!/bin/bash

# ComplianceIQ GCP Deployment Script for Google Cloud Shell
# This script is optimized for running in Google Cloud Shell

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="complianceiq-prod"
REGION="us-central1"
SERVICE_NAME="complianceiq"
DB_INSTANCE_NAME="complianceiq-db"
REDIS_INSTANCE_NAME="complianceiq-redis"
BUCKET_NAME="complianceiq-files-prod"

echo -e "${BLUE}🚀 Starting ComplianceIQ GCP Deployment (Cloud Shell)${NC}"
echo "================================================"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in Cloud Shell
if [[ -z "$CLOUD_SHELL" ]]; then
    print_warning "This script is optimized for Google Cloud Shell"
    print_warning "For local deployment, use: ./deploy-gcp.sh"
fi

# Set project
echo -e "${BLUE}📋 Setting up project...${NC}"
gcloud config set project $PROJECT_ID
print_status "Project set to $PROJECT_ID"

# Enable required APIs
echo -e "${BLUE}🔧 Enabling required APIs...${NC}"
APIS=(
    "run.googleapis.com"
    "sqladmin.googleapis.com"
    "storage.googleapis.com"
    "redis.googleapis.com"
    "containerregistry.googleapis.com"
    "cloudbuild.googleapis.com"
    "secretmanager.googleapis.com"
    "monitoring.googleapis.com"
    "logging.googleapis.com"
)

for api in "${APIS[@]}"; do
    gcloud services enable $api
    print_status "Enabled $api"
done

# Clone repository (if not already present)
if [ ! -d "ComplianceIQ" ]; then
    echo -e "${BLUE}📥 Cloning ComplianceIQ repository...${NC}"
    # Replace with your actual repository URL
    git clone https://github.com/yourusername/ComplianceIQ.git
    cd ComplianceIQ
    print_status "Repository cloned"
else
    cd ComplianceIQ
    print_status "Using existing repository"
fi

# Create Cloud SQL instance
echo -e "${BLUE}🗄️  Setting up Cloud SQL database...${NC}"
if ! gcloud sql instances describe $DB_INSTANCE_NAME --quiet 2>/dev/null; then
    gcloud sql instances create $DB_INSTANCE_NAME \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-type=SSD \
        --storage-size=20GB \
        --backup \
        --enable-ip-alias \
        --authorized-networks=0.0.0.0/0
    
    print_status "Created Cloud SQL instance: $DB_INSTANCE_NAME"
else
    print_status "Cloud SQL instance already exists: $DB_INSTANCE_NAME"
fi

# Create database
echo -e "${BLUE}📊 Creating database...${NC}"
gcloud sql databases create complianceiq --instance=$DB_INSTANCE_NAME --quiet || print_warning "Database may already exist"

# Create database user
echo -e "${BLUE}👤 Creating database user...${NC}"
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create complianceiq-user \
    --instance=$DB_INSTANCE_NAME \
    --password=$DB_PASSWORD \
    --quiet || print_warning "User may already exist"

# Store password in Secret Manager
echo -n "$DB_PASSWORD" | gcloud secrets create db-password --data-file=- --quiet || print_warning "Secret may already exist"
echo -n "complianceiq-user" | gcloud secrets create db-username --data-file=- --quiet || print_warning "Secret may already exist"

print_status "Database setup complete"

# Create Redis instance
echo -e "${BLUE}🔍 Setting up Redis cache...${NC}"
if ! gcloud redis instances describe $REDIS_INSTANCE_NAME --region=$REGION --quiet 2>/dev/null; then
    gcloud redis instances create $REDIS_INSTANCE_NAME \
        --size=1 \
        --region=$REGION \
        --redis-version=redis_6_x \
        --tier=basic
    
    print_status "Created Redis instance: $REDIS_INSTANCE_NAME"
else
    print_status "Redis instance already exists: $REDIS_INSTANCE_NAME"
fi

# Get Redis IP
REDIS_IP=$(gcloud redis instances describe $REDIS_INSTANCE_NAME --region=$REGION --format="value(host)")
print_status "Redis IP: $REDIS_IP"

# Create Cloud Storage bucket
echo -e "${BLUE}📁 Setting up Cloud Storage...${NC}"
if ! gsutil ls gs://$BUCKET_NAME 2>/dev/null; then
    gsutil mb gs://$BUCKET_NAME
    gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
    gsutil mkdir gs://$BUCKET_NAME/assessments
    gsutil mkdir gs://$BUCKET_NAME/evidence
    gsutil mkdir gs://$BUCKET_NAME/documents
    print_status "Created storage bucket: $BUCKET_NAME"
else
    print_status "Storage bucket already exists: $BUCKET_NAME"
fi

# Build and deploy application
echo -e "${BLUE}🚀 Building and deploying application...${NC}"

# Build container image
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

print_status "Container image built successfully"

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 10 \
    --min-instances 1 \
    --set-env-vars NODE_ENV=production \
    --set-env-vars REDIS_URL="redis://$REDIS_IP:6379" \
    --add-cloudsql-instances $PROJECT_ID:$REGION:$DB_INSTANCE_NAME

print_status "Application deployed to Cloud Run"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
print_status "Service URL: $SERVICE_URL"

# Run database migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"
# Create a temporary Cloud Run job for migrations
gcloud run jobs create migrate-db \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
    --region=$REGION \
    --command="npx" \
    --args="prisma,migrate,deploy" \
    --add-cloudsql-instances $PROJECT_ID:$REGION:$DB_INSTANCE_NAME \
    --set-env-vars DATABASE_URL="postgresql://complianceiq-user:$DB_PASSWORD@/complianceiq?host=/cloudsql/$PROJECT_ID:$REGION:$DB_INSTANCE_NAME" \
    --max-retries=3

# Execute the migration job
gcloud run jobs execute migrate-db --region=$REGION --wait

print_status "Database migrations completed"

# Test deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"
sleep 10  # Wait for service to be ready

if curl -f -s "$SERVICE_URL/api/health" > /dev/null; then
    print_status "Health check passed"
else
    print_warning "Health check failed - service may still be starting"
fi

# Display deployment summary
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================================"
echo -e "${BLUE}Service URL:${NC} $SERVICE_URL"
echo -e "${BLUE}Project ID:${NC} $PROJECT_ID"
echo -e "${BLUE}Region:${NC} $REGION"
echo -e "${BLUE}Database:${NC} $DB_INSTANCE_NAME"
echo -e "${BLUE}Redis:${NC} $REDIS_INSTANCE_NAME"
echo -e "${BLUE}Storage:${NC} gs://$BUCKET_NAME"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Test all endpoints"
echo "2. Configure custom domain (optional)"
echo "3. Set up monitoring and alerting"
echo "4. Configure backup schedules"
echo ""
echo -e "${GREEN}Your ComplianceIQ application is now live! 🚀${NC}"
