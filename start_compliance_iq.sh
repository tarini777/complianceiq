#!/bin/bash

# ComplianceIQ Startup Script
# Starts the complete ComplianceIQ system

echo "🚀 Starting ComplianceIQ - Pharmaceutical AI Readiness Assessment"
echo "================================================================"
echo "📁 System Components:"
echo "  • Next.js Frontend - React + TypeScript + Tailwind"
echo "  • PostgreSQL Database - Prisma ORM"
echo "  • Gemini AI Integration - Intelligent guidance"
echo "================================================================"

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $port is already in use"
        return 1
    else
        return 0
    fi
}

# Function to start frontend
start_frontend() {
    echo "🌐 Starting ComplianceIQ Frontend..."
    cd /Users/tarinipersonal/ComplianceIQ
    
    if check_port 3000; then
        echo "🎨 Starting Next.js frontend on port 3000..."
        npm run dev &
        FRONTEND_PID=$!
        echo "✅ Frontend started with PID: $FRONTEND_PID"
        echo "   UI: http://localhost:3000"
    else
        echo "❌ Frontend port 3000 is busy"
        return 1
    fi
}

# Function to check database
check_database() {
    echo "🗄️  Checking PostgreSQL database..."
    
    if command -v psql >/dev/null 2>&1; then
        echo "✅ PostgreSQL found"
        
        # Check if database exists
        if psql -lqt | cut -d \| -f 1 | grep -qw complianceiq; then
            echo "✅ Database 'complianceiq' exists"
        else
            echo "⚠️  Database 'complianceiq' not found"
            echo "   Run: createdb complianceiq"
        fi
    else
        echo "⚠️  PostgreSQL not found"
        echo "   Install with: brew install postgresql"
    fi
}

# Function to check system status
check_status() {
    echo ""
    echo "🔍 ComplianceIQ System Status:"
    echo "================================================================"
    
    # Check frontend
    if curl -s -I http://localhost:3000/ > /dev/null 2>&1; then
        echo "✅ Frontend UI: Running (http://localhost:3000)"
    else
        echo "❌ Frontend UI: Not responding"
    fi
    
    echo ""
    echo "🎯 ComplianceIQ Ready!"
    echo "================================================================"
    echo "🎨 Frontend UI: http://localhost:3000"
    echo ""
    echo "🛑 To stop services: Ctrl+C"
    echo "================================================================"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down ComplianceIQ..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend stopped"
    fi
    echo "👋 ComplianceIQ shutdown complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main startup sequence
echo "🚀 Initializing ComplianceIQ..."
echo ""

# Check database
check_database
sleep 2

# Start frontend
start_frontend
sleep 3

# Check final status
check_status

# Keep script running
echo "🔄 Monitoring ComplianceIQ services..."
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait
