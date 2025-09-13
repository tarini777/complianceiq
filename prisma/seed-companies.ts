import { PrismaClient } from '@prisma/client';
import { companies } from '../src/data/companies';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding companies...');

  // Create companies
  const createdCompanies = [];
  
  for (const company of companies) {
    const createdCompany = await prisma.tenant.create({
      data: {
        id: company.id,
        name: company.name,
        industryType: company.industryType,
        description: company.description,
        website: company.website,
        subscriptionTier: company.subscriptionTier,
        therapeuticFocus: company.therapeuticFocus,
        aiInitiatives: company.aiInitiatives,
        deploymentScenarios: company.deploymentScenarios,
        isActive: company.isActive,
      },
    });
    
    createdCompanies.push(createdCompany);
    console.log(`✅ Created company: ${company.name}`);
  }

  console.log(`🎉 Successfully seeded ${createdCompanies.length} companies`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding companies:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
