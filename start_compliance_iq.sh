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

# Function to check and setup database
check_database() {
    echo "🗄️  Checking PostgreSQL database..."
    
    if command -v psql >/dev/null 2>&1; then
        echo "✅ PostgreSQL found"
        
        # Check if database exists
        if psql -lqt | cut -d \| -f 1 | grep -qw complianceiq; then
            echo "✅ Database 'complianceiq' exists"
            
            # Check if database has data
            echo "🔍 Checking database content..."
            PERSONA_COUNT=$(psql -d complianceiq -t -c "SELECT COUNT(*) FROM personas;" 2>/dev/null | tr -d ' ' || echo "0")
            SECTION_COUNT=$(psql -d complianceiq -t -c "SELECT COUNT(*) FROM sections;" 2>/dev/null | tr -d ' ' || echo "0")
            
            if [ "$PERSONA_COUNT" -eq 0 ] || [ "$SECTION_COUNT" -eq 0 ]; then
                echo "⚠️  Database is empty - seeding with data..."
                seed_database
            else
                echo "✅ Database has data: $PERSONA_COUNT personas, $SECTION_COUNT sections"
            fi
        else
            echo "⚠️  Database 'complianceiq' not found"
            echo "   Run: createdb complianceiq"
            return 1
        fi
    else
        echo "⚠️  PostgreSQL not found"
        echo "   Install with: brew install postgresql"
        return 1
    fi
}

# Function to seed database
seed_database() {
    echo "🌱 Seeding database with pharmaceutical compliance data..."
    
    # Run Prisma migrations
    echo "📊 Running database migrations..."
    npx prisma migrate deploy
    
    # Seed system configuration
    echo "⚙️  Seeding system configuration..."
    node prisma/seed-system-config.js
    
    # Seed basic data (try different seed files)
    echo "📋 Seeding assessment data..."
    if [ -f "prisma/seed-questions-direct.js" ]; then
        node prisma/seed-questions-direct.js
    fi
    
    echo "✅ Database seeding completed"
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
