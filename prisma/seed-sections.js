const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding assessment sections...');

  try {
    const sections = [
      {
        id: 'data-governance',
        title: 'Data Governance Framework',
        sectionNumber: 1,
        basePoints: 15,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },
      {
        id: 'ai-model-validation',
        title: 'AI Model Validation & Testing',
        sectionNumber: 2,
        basePoints: 20,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'fda-ai-governance',
        title: 'FDA AI Governance 2025 Compliance',
        sectionNumber: 3,
        basePoints: 25,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'data-quality',
        title: 'Data Quality Assurance & Validation',
        sectionNumber: 4,
        basePoints: 18,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },
      {
        id: 'model-deployment',
        title: 'Model Deployment & Versioning',
        sectionNumber: 5,
        basePoints: 16,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },
      {
        id: 'risk-management',
        title: 'AI Risk Management & Mitigation',
        sectionNumber: 6,
        basePoints: 22,
        isCriticalBlocker: true,
        sectionType: 'safety'
      }
    ];

    for (const section of sections) {
      await prisma.assessmentSection.upsert({
        where: { id: section.id },
        update: {},
        create: section
      });
    }

    console.log('✅ Assessment sections seeding completed!');
    console.log(`   • ${sections.length} sections created`);

  } catch (error) {
    console.error('❌ Error seeding sections:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
