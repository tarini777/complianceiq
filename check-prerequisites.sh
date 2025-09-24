#!/bin/bash

# ComplianceIQ Prerequisites Checker
# This script verifies all required tools and configurations

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 ComplianceIQ Prerequisites Checker${NC}"
echo "================================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Initialize counters
total_checks=0
passed_checks=0

# Check Google Cloud CLI
echo -e "${BLUE}📋 Checking Google Cloud CLI...${NC}"
total_checks=$((total_checks + 1))
if command_exists gcloud; then
    GCLOUD_VERSION=$(gcloud --version 2>/dev/null | head -1)
    print_status 0 "Google Cloud CLI installed: $GCLOUD_VERSION"
    passed_checks=$((passed_checks + 1))
else
    print_status 1 "Google Cloud CLI not installed"
    echo "   Install with: brew install google-cloud-sdk (macOS) or visit https://cloud.google.com/sdk/docs/install"
fi

# Check Docker
echo -e "${BLUE}🐳 Checking Docker...${NC}"
total_checks=$((total_checks + 1))
if command_exists docker; then
    DOCKER_VERSION=$(docker --version 2>/dev/null)
    print_status 0 "Docker installed: $DOCKER_VERSION"
    passed_checks=$((passed_checks + 1))
    
    # Check if Docker daemon is running
    if docker info >/dev/null 2>&1; then
        print_status 0 "Docker daemon is running"
    else
        print_warning "Docker daemon is not running. Please start Docker Desktop."
    fi
else
    print_status 1 "Docker not installed"
    echo "   Install with: brew install --cask docker (macOS) or visit https://docs.docker.com/get-docker/"
fi

# Check Node.js
echo -e "${BLUE}📦 Checking Node.js...${NC}"
total_checks=$((total_checks + 1))
if command_exists node; then
    NODE_VERSION=$(node --version 2>/dev/null)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_status 0 "Node.js installed: $NODE_VERSION (✅ Version 18+)"
        passed_checks=$((passed_checks + 1))
    else
        print_status 1 "Node.js installed: $NODE_VERSION (❌ Version too old, need 18+)"
        echo "   Update with: nvm install 18 && nvm use 18"
    fi
else
    print_status 1 "Node.js not installed"
    echo "   Install with: brew install node (macOS) or visit https://nodejs.org/"
fi

# Check NPM
echo -e "${BLUE}📦 Checking NPM...${NC}"
total_checks=$((total_checks + 1))
if command_exists npm; then
    NPM_VERSION=$(npm --version 2>/dev/null)
    print_status 0 "NPM installed: $NPM_VERSION"
    passed_checks=$((passed_checks + 1))
else
    print_status 1 "NPM not installed"
    echo "   NPM usually comes with Node.js"
fi

# Check Git
echo -e "${BLUE}📝 Checking Git...${NC}"
total_checks=$((total_checks + 1))
if command_exists git; then
    GIT_VERSION=$(git --version 2>/dev/null)
    print_status 0 "Git installed: $GIT_VERSION"
    passed_checks=$((passed_checks + 1))
else
    print_status 1 "Git not installed"
    echo "   Install with: brew install git (macOS) or visit https://git-scm.com/"
fi

# Check GCP Authentication
echo -e "${BLUE}🔐 Checking GCP Authentication...${NC}"
total_checks=$((total_checks + 1))
if command_exists gcloud; then
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>/dev/null)
    if [ -n "$ACTIVE_ACCOUNT" ]; then
        print_status 0 "GCP authenticated as: $ACTIVE_ACCOUNT"
        passed_checks=$((passed_checks + 1))
    else
        print_status 1 "GCP not authenticated"
        echo "   Authenticate with: gcloud auth login"
    fi
else
    print_status 1 "Cannot check GCP authentication (gcloud not installed)"
fi

# Check GCP Project
echo -e "${BLUE}🏗️  Checking GCP Project...${NC}"
total_checks=$((total_checks + 1))
if command_exists gcloud; then
    CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
    if [ -n "$CURRENT_PROJECT" ]; then
        print_status 0 "GCP project set: $CURRENT_PROJECT"
        passed_checks=$((passed_checks + 1))
    else
        print_status 1 "GCP project not set"
        echo "   Set project with: gcloud config set project YOUR_PROJECT_ID"
    fi
else
    print_status 1 "Cannot check GCP project (gcloud not installed)"
fi

# Check Current Directory
echo -e "${BLUE}📁 Checking Project Directory...${NC}"
total_checks=$((total_checks + 1))
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" == *"ComplianceIQ"* ]]; then
    print_status 0 "In ComplianceIQ directory: $CURRENT_DIR"
    passed_checks=$((passed_checks + 1))
else
    print_status 1 "Not in ComplianceIQ directory: $CURRENT_DIR"
    echo "   Navigate to: cd /Users/tarinipersonal/Documents/ComplianceIQ"
fi

# Check Deployment Script
echo -e "${BLUE}🚀 Checking Deployment Script...${NC}"
total_checks=$((total_checks + 1))
if [ -f "deploy-gcp.sh" ]; then
    if [ -x "deploy-gcp.sh" ]; then
        print_status 0 "Deployment script exists and is executable"
        passed_checks=$((passed_checks + 1))
    else
        print_status 1 "Deployment script exists but not executable"
        echo "   Make executable with: chmod +x deploy-gcp.sh"
    fi
else
    print_status 1 "Deployment script not found"
    echo "   Ensure you're in the ComplianceIQ directory"
fi

# Check Package.json
echo -e "${BLUE}📦 Checking Project Files...${NC}"
total_checks=$((total_checks + 1))
if [ -f "package.json" ]; then
    print_status 0 "package.json found"
    passed_checks=$((passed_checks + 1))
else
    print_status 1 "package.json not found"
    echo "   Ensure you're in the correct project directory"
fi

# Summary
echo ""
echo -e "${BLUE}📊 Prerequisites Summary${NC}"
echo "================================================"
echo -e "Total Checks: ${BLUE}$total_checks${NC}"
echo -e "Passed: ${GREEN}$passed_checks${NC}"
echo -e "Failed: ${RED}$((total_checks - passed_checks))${NC}"

if [ $passed_checks -eq $total_checks ]; then
    echo ""
    echo -e "${GREEN}🎉 All prerequisites met! You're ready to deploy!${NC}"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Run: ./deploy-gcp.sh"
    echo "2. Monitor the deployment process"
    echo "3. Test your application once deployed"
else
    echo ""
    echo -e "${RED}❌ Some prerequisites are missing. Please fix the issues above before deploying.${NC}"
    echo ""
    echo -e "${YELLOW}Common Solutions:${NC}"
    echo "• Install missing tools using the provided commands"
    echo "• Authenticate with GCP: gcloud auth login"
    echo "• Set GCP project: gcloud config set project YOUR_PROJECT_ID"
    echo "• Navigate to correct directory: cd /Users/tarinipersonal/Documents/ComplianceIQ"
    echo "• Make script executable: chmod +x deploy-gcp.sh"
fi

echo ""
echo -e "${BLUE}For detailed setup instructions, see: LOCAL_DEPLOYMENT_PREREQUISITES.md${NC}"
