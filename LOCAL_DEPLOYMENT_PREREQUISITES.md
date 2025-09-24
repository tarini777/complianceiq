# 🖥️ Local Terminal Deployment Prerequisites

## 📋 Complete Prerequisites Checklist

### ✅ **1. Google Cloud Platform Account**
- [ ] **GCP Account**: Create at [console.cloud.google.com](https://console.cloud.google.com)
- [ ] **Billing Enabled**: Link a credit card to your GCP project
- [ ] **Project Created**: Create a new project or use existing one
- [ ] **Project ID**: Note your project ID (e.g., `complianceiq-prod`)

### ✅ **2. Google Cloud CLI Installation**

#### **macOS Installation:**
```bash
# Option A: Using Homebrew (Recommended)
brew install google-cloud-sdk

# Option B: Using installer
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Verify installation
gcloud --version
```

#### **Windows Installation:**
```bash
# Download and run the installer
# Visit: https://cloud.google.com/sdk/docs/install-sdk#windows

# Or use Chocolatey
choco install gcloudsdk

# Verify installation
gcloud --version
```

#### **Linux Installation:**
```bash
# Add the Cloud SDK distribution URI
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# Import the Google Cloud Platform public key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

# Update and install
sudo apt-get update && sudo apt-get install google-cloud-cli

# Verify installation
gcloud --version
```

### ✅ **3. Docker Installation**

#### **macOS Installation:**
```bash
# Option A: Using Homebrew
brew install --cask docker

# Option B: Download Docker Desktop
# Visit: https://www.docker.com/products/docker-desktop/

# Start Docker Desktop and verify
docker --version
docker run hello-world
```

#### **Windows Installation:**
```bash
# Download Docker Desktop for Windows
# Visit: https://www.docker.com/products/docker-desktop/

# Install and start Docker Desktop
# Verify installation
docker --version
docker run hello-world
```

#### **Linux Installation:**
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker run hello-world
```

### ✅ **4. Node.js Installation**

#### **macOS Installation:**
```bash
# Option A: Using Homebrew
brew install node

# Option B: Using Node Version Manager (Recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

#### **Windows Installation:**
```bash
# Download Node.js installer
# Visit: https://nodejs.org/
# Download LTS version (18.x or higher)

# Or use Chocolatey
choco install nodejs

# Verify installation
node --version
npm --version
```

#### **Linux Installation:**
```bash
# Using Node Version Manager (Recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Or using package manager
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### ✅ **5. Git Installation**

#### **macOS Installation:**
```bash
# Git is usually pre-installed, but if not:
brew install git

# Verify installation
git --version
```

#### **Windows Installation:**
```bash
# Download Git for Windows
# Visit: https://git-scm.com/download/win

# Or use Chocolatey
choco install git

# Verify installation
git --version
```

#### **Linux Installation:**
```bash
# Install Git
sudo apt-get install git

# Verify installation
git --version
```

## 🔧 **Step-by-Step Setup Process**

### **Step 1: Verify All Prerequisites**
```bash
# Check all required tools
echo "=== Prerequisites Check ==="
echo "Google Cloud CLI: $(gcloud --version | head -1)"
echo "Docker: $(docker --version)"
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "Git: $(git --version)"
```

### **Step 2: Authenticate with Google Cloud**
```bash
# Login to Google Cloud
gcloud auth login

# This will open a browser window for authentication
# Follow the prompts to complete authentication

# Verify authentication
gcloud auth list
```

### **Step 3: Set Up Your GCP Project**
```bash
# Create a new project (replace with your desired project ID)
gcloud projects create complianceiq-prod --name="ComplianceIQ Production"

# Set the project as default
gcloud config set project complianceiq-prod

# Verify project is set
gcloud config get-value project
```

### **Step 4: Enable Billing**
```bash
# This must be done in the GCP Console
echo "Please enable billing:"
echo "1. Go to: https://console.cloud.google.com/billing"
echo "2. Select your project: complianceiq-prod"
echo "3. Link a billing account"
echo "4. Verify billing is enabled"
```

### **Step 5: Prepare Your Local Environment**
```bash
# Navigate to your project directory
cd /Users/tarinipersonal/Documents/ComplianceIQ

# Verify you're in the right directory
pwd
ls -la

# Check if deployment script exists
ls -la deploy-gcp.sh
```

### **Step 6: Configure Deployment Script**
```bash
# Edit the deployment script to use your project ID
nano deploy-gcp.sh

# Find this line and update with your project ID:
# PROJECT_ID="complianceiq-prod"
# Change to: PROJECT_ID="your-actual-project-id"
```

### **Step 7: Test Prerequisites**
```bash
# Test Google Cloud CLI
gcloud auth list
gcloud config list

# Test Docker
docker run hello-world

# Test Node.js
node --version
npm --version

# Test Git
git --version
```

## 🚨 **Common Issues and Solutions**

### **Issue 1: Google Cloud CLI Not Found**
```bash
# Solution: Add to PATH
echo 'export PATH=$PATH:/usr/local/google-cloud-sdk/bin' >> ~/.bashrc
source ~/.bashrc

# Or reinstall
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### **Issue 2: Docker Permission Denied**
```bash
# Solution: Add user to docker group (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Or start Docker Desktop (macOS/Windows)
```

### **Issue 3: Node.js Version Too Old**
```bash
# Solution: Update Node.js
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### **Issue 4: Authentication Issues**
```bash
# Solution: Re-authenticate
gcloud auth login
gcloud auth application-default login

# Verify authentication
gcloud auth list
```

### **Issue 5: Project Not Found**
```bash
# Solution: Create project or check project ID
gcloud projects list
gcloud projects create your-project-id
gcloud config set project your-project-id
```

## 📋 **Pre-Deployment Checklist**

Before running the deployment script, verify:

- [ ] **Google Cloud CLI**: `gcloud --version` shows version 400.0.0+
- [ ] **Docker**: `docker --version` shows Docker version 20.0+
- [ ] **Node.js**: `node --version` shows v18.0.0+
- [ ] **NPM**: `npm --version` shows 8.0.0+
- [ ] **Git**: `git --version` shows git version 2.30+
- [ ] **Authentication**: `gcloud auth list` shows active account
- [ ] **Project**: `gcloud config get-value project` shows your project ID
- [ ] **Billing**: Billing is enabled in GCP Console
- [ ] **Script**: `deploy-gcp.sh` exists and is executable
- [ ] **Directory**: You're in the ComplianceIQ project directory

## 🚀 **Ready to Deploy!**

Once all prerequisites are met:

```bash
# Make script executable
chmod +x deploy-gcp.sh

# Run deployment
./deploy-gcp.sh
```

## 📞 **Need Help?**

### **Installation Issues:**
- **Google Cloud CLI**: [Installation Guide](https://cloud.google.com/sdk/docs/install)
- **Docker**: [Installation Guide](https://docs.docker.com/get-docker/)
- **Node.js**: [Download Page](https://nodejs.org/)

### **Authentication Issues:**
- **GCP Authentication**: [Auth Guide](https://cloud.google.com/sdk/docs/authorizing)
- **Project Setup**: [Project Guide](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

### **Billing Issues:**
- **Enable Billing**: [Billing Guide](https://cloud.google.com/billing/docs/how-to/modify-project)

---

## ✅ **Quick Verification Command**

Run this command to verify all prerequisites:

```bash
echo "=== Prerequisites Verification ==="
echo "Google Cloud CLI: $(gcloud --version 2>/dev/null | head -1 || echo 'NOT INSTALLED')"
echo "Docker: $(docker --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "Node.js: $(node --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "NPM: $(npm --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "Git: $(git --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "GCP Auth: $(gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>/dev/null || echo 'NOT AUTHENTICATED')"
echo "GCP Project: $(gcloud config get-value project 2>/dev/null || echo 'NOT SET')"
echo "Current Directory: $(pwd)"
echo "Deployment Script: $(ls -la deploy-gcp.sh 2>/dev/null || echo 'NOT FOUND')"
```

If all items show proper values (not "NOT INSTALLED" or "NOT AUTHENTICATED"), you're ready to deploy! 🚀
