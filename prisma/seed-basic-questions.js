const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding basic dynamic questions...');

  try {
    // Create basic questions that will work with the dynamic system
    const questions = [
      {
        id: 'oncology-data-governance-1',
        questionText: 'Do you have specialized data governance protocols for oncology patient data, including genetic sequencing and biomarker information?',
        sectionId: 'data-governance',
        questionType: 'multiple-choice',
        complexityPoints: 8,
        evidenceRequired: ['Data governance policy', 'Genetic data handling procedures'],
        responsibleRoles: ['Data Steward', 'Privacy Officer']
      },
      {
        id: 'rare-disease-validation-1',
        questionText: 'How do you validate AI models for rare disease applications where patient populations are extremely limited?',
        sectionId: 'ai-model-validation',
        questionType: 'multiple-choice',
        complexityPoints: 12,
        evidenceRequired: ['Validation protocol', 'Small dataset handling procedures'],
        responsibleRoles: ['Data Scientist', 'QA Manager']
      },
      {
        id: 'pediatric-fda-compliance-1',
        questionText: 'Are your AI models compliant with FDA pediatric study requirements and age-appropriate dosing algorithms?',
        sectionId: 'fda-ai-governance',
        questionType: 'multiple-choice',
        complexityPoints: 15,
        evidenceRequired: ['FDA compliance documentation', 'Pediatric study protocols'],
        responsibleRoles: ['Regulatory Affairs Manager', 'Clinical Operations']
      },
      {
        id: 'infectious-disease-quality-1',
        questionText: 'Do you have real-time data quality monitoring for infectious disease surveillance and outbreak prediction models?',
        sectionId: 'data-quality',
        questionType: 'multiple-choice',
        complexityPoints: 10,
        evidenceRequired: ['Real-time monitoring procedures', 'Data quality metrics'],
        responsibleRoles: ['Data Engineer', 'Quality Manager']
      },
      {
        id: 'precision-medicine-deployment-1',
        questionText: 'How do you deploy AI models for precision medicine applications that require patient-specific genomic analysis?',
        sectionId: 'model-deployment',
        questionType: 'multiple-choice',
        complexityPoints: 14,
        evidenceRequired: ['Deployment strategy', 'Genomic analysis procedures'],
        responsibleRoles: ['ML Engineer', 'Data Scientist']
      },
      {
        id: 'cardiovascular-risk-1',
        questionText: 'Do you have AI risk management protocols for cardiovascular AI models that could impact patient safety in real-time monitoring?',
        sectionId: 'risk-management',
        questionType: 'multiple-choice',
        complexityPoints: 11,
        evidenceRequired: ['Risk management framework', 'Safety monitoring procedures'],
        responsibleRoles: ['Risk Manager', 'Clinical Operations']
      }
    ];

    for (const question of questions) {
      await prisma.dynamicQuestion.upsert({
        where: { id: question.id },
        update: {},
        create: {
          id: question.id,
          questionText: question.questionText,
          sectionId: question.sectionId,
          questionType: question.questionType,
          complexityPoints: question.complexityPoints,
          evidenceRequired: question.evidenceRequired,
          responsibleRoles: question.responsibleRoles
        }
      });
    }

    console.log('✅ Basic dynamic questions seeding completed!');
    console.log(`   • ${questions.length} dynamic questions created`);
    console.log('');
    console.log('🎯 These questions are designed for:');
    console.log('   • Oncology - genetic data governance');
    console.log('   • Rare Disease - small population validation');
    console.log('   • Pediatrics - FDA compliance');
    console.log('   • Infectious Disease - real-time monitoring');
    console.log('   • Precision Medicine - genomic deployment');
    console.log('   • Cardiovascular - safety-critical risk management');

  } catch (error) {
    console.error('❌ Error seeding basic questions:', error);
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
