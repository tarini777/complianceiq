#!/bin/bash

# ComplianceIQ API-Only Startup Script
# This script starts the application in API-only mode

echo "🚀 Starting ComplianceIQ API-Only Mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Set environment variables for API-only mode
export API_ONLY_MODE=true
export DISABLE_UI=true
export NODE_ENV=production

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building application for API-only mode..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Start the API server
echo "🌐 Starting API server on port 3001..."
echo ""
echo "📚 API Documentation: http://localhost:3001/api/docs"
echo "🔍 Health Check: http://localhost:3001/api/monitoring/health"
echo "📊 System Config: http://localhost:3001/api/system-config"
echo ""
echo "🔑 Authentication Methods:"
echo "   - Bearer Token: Authorization: Bearer <your-jwt-token>"
echo "   - API Key: X-API-Key: <your-api-key>"
echo ""
echo "📋 Available Endpoints:"
echo "   - Assessment APIs: /api/assessment/*"
echo "   - AskRexi AI: /api/askrexi"
echo "   - Regulatory Intelligence: /api/regulatory/*"
echo "   - Analytics: /api/analytics/*"
echo "   - Collaboration: /api/collaboration/*"
echo ""
echo "⚡ API-Only mode is now running!"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the server with API-only configuration
NODE_ENV=production npm start
