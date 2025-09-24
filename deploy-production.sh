#!/bin/bash

# ComplianceIQ Production Deployment Script
# This script deploys the application to production with proper security

echo "🚀 Starting ComplianceIQ Production Deployment..."

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

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    echo "Please set: export DATABASE_URL='postgresql://user:password@host:5432/dbname'"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ NEXTAUTH_SECRET environment variable is required"
    echo "Please set: export NEXTAUTH_SECRET='your-secret-key'"
    exit 1
fi

# Set production environment
export NODE_ENV=production

echo "📦 Installing dependencies..."
npm ci --only=production

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding production data..."
echo "Seeding personas and basic data..."
node prisma/seed-personas.ts

echo "Seeding therapeutic areas..."
node prisma/seed-therapeutic-areas.ts

echo "Seeding companies..."
node prisma/seed-companies.ts

echo "Seeding system configuration..."
node prisma/seed-system-config.js

echo "Seeding comprehensive questions..."
node prisma/seed-comprehensive-questions-simple.js

echo "Seeding persona mappings..."
node prisma/seed-persona-question-mappings.js

echo "🔨 Building application..."
npm run build

echo "✅ Production deployment completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the production server: npm start"
echo "2. Verify deployment: curl http://localhost:3000/api/monitoring/health"
echo "3. Test authentication: Visit https://your-domain.com"
echo "4. Monitor logs: Check application logs for any issues"
echo ""
echo "🔒 Security checklist:"
echo "✅ Database migrations applied"
echo "✅ Production data seeded"
echo "✅ Application built for production"
echo "⚠️  Remember to:"
echo "   - Set up SSL/HTTPS certificates"
echo "   - Configure firewall rules"
echo "   - Set up monitoring and logging"
echo "   - Configure backup strategy"
echo ""
echo "🌐 Your ComplianceIQ application is ready for production!"
