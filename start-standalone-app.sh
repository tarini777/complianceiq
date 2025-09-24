#!/bin/bash

# ComplianceIQ Standalone App Startup Script
# This script starts the application in full standalone mode with UI

echo "🚀 Starting ComplianceIQ Standalone App..."

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

# Set environment variables for standalone app mode
export NODE_ENV=development
export STANDALONE_APP_MODE=true

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building application for standalone mode..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Start the standalone app
echo "🌐 Starting ComplianceIQ Standalone App..."
echo ""
echo "🎯 Application Features:"
echo "   📊 Dashboard: http://localhost:3001/"
echo "   📝 Assessment: http://localhost:3001/assessment"
echo "   🤖 AskRexi AI: http://localhost:3001/askrexi"
echo "   📈 Analytics: http://localhost:3001/analytics"
echo "   🛡️ Regulatory: http://localhost:3001/regulatory"
echo "   🤝 Collaboration: http://localhost:3001/collaboration"
echo "   🔧 Settings: http://localhost:3001/settings"
echo ""
echo "📚 API Documentation: http://localhost:3001/api/docs"
echo "🔍 Health Check: http://localhost:3001/api/monitoring/health"
echo ""
echo "✨ Features Available:"
echo "   ✅ AI-Powered Assessment Engine"
echo "   ✅ AskRexi AI Assistant (1000+ training questions)"
echo "   ✅ Real-time Regulatory Intelligence (17 sources)"
echo "   ✅ Persona-Based Assessments (9 personas, 25 sub-personas)"
echo "   ✅ Team Collaboration & Messaging"
echo "   ✅ Advanced Analytics & Insights"
echo "   ✅ Assessment Remediation Engine"
echo "   ✅ Mobile-Responsive Design"
echo ""
echo "🎉 Standalone App is now running!"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
