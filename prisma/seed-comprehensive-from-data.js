/**
 * Seed Comprehensive Questions from TypeScript Data
 * Uses the existing comprehensive assessment data to seed the database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Import the comprehensive assessment data
const comprehensiveData = require('../src/data/comprehensive-assessment.ts');

async function seedComprehensiveFromData() {
  console.log('🌱 Seeding comprehensive questions from existing data...');

  try {
    // Get all sections from database
    const dbSections = await prisma.assessmentSection.findMany({
      orderBy: { sectionNumber: 'asc' }
    });

    if (dbSections.length === 0) {
      console.log('⚠️ No sections found in database. Please run section seed first.');
      return;
    }

    let totalQuestionsCreated = 0;

    // Create questions for each section based on the comprehensive data
    for (const dbSection of dbSections) {
      // Find matching section in comprehensive data
      const comprehensiveSection = comprehensiveData.assessmentSections.find(
        section => section.id === dbSection.id || 
                   section.name.toLowerCase().includes(dbSection.title.toLowerCase()) ||
                   dbSection.title.toLowerCase().includes(section.name.toLowerCase())
      );

      if (!comprehensiveSection) {
        console.log(`⚠️ No comprehensive data found for section: ${dbSection.title}`);
        continue;
      }

      // Create questions from comprehensive section
      for (const question of comprehensiveSection.questions) {
        await prisma.dynamicQuestion.create({
          data: {
            sectionId: dbSection.id,
            questionText: question.text,
            questionType: question.type,
            validationCriteria: JSON.stringify({
              points: question.points,
              isBlocker: question.isBlocker,
              options: question.options || [],
              evidenceRequired: question.evidenceRequired || [],
              responsibleRoles: question.responsibleRole || []
            }),
            evidenceRequired: question.evidenceRequired || [],
            responsibleRoles: question.responsibleRole || ['compliance-officer']
          }
        });

        totalQuestionsCreated++;
      }

      // Create therapy-specific questions
      for (const [therapyId, therapyQuestions] of Object.entries(comprehensiveSection.therapySpecificQuestions)) {
        for (const question of therapyQuestions) {
          await prisma.dynamicQuestion.create({
            data: {
              sectionId: dbSection.id,
              questionText: question.text,
              questionType: question.type,
              validationCriteria: JSON.stringify({
                points: question.points,
                isBlocker: question.isBlocker,
                options: question.options || [],
                evidenceRequired: question.evidenceRequired || [],
                responsibleRoles: question.responsibleRole || [],
                therapySpecific: therapyId
              }),
              evidenceRequired: question.evidenceRequired || [],
              responsibleRoles: question.responsibleRole || ['compliance-officer'],
              therapySpecificConditions: JSON.stringify({
                therapeuticArea: therapyId,
                required: true
              })
            }
          });

          totalQuestionsCreated++;
        }
      }

      // Create model type-specific questions
      for (const [modelTypeId, modelQuestions] of Object.entries(comprehensiveSection.modelTypeQuestions)) {
        for (const question of modelQuestions) {
          await prisma.dynamicQuestion.create({
            data: {
              sectionId: dbSection.id,
              questionText: question.text,
              questionType: question.type,
              validationCriteria: JSON.stringify({
                points: question.points,
                isBlocker: question.isBlocker,
                options: question.options || [],
                evidenceRequired: question.evidenceRequired || [],
                responsibleRoles: question.responsibleRole || [],
                modelTypeSpecific: modelTypeId
              }),
              evidenceRequired: question.evidenceRequired || [],
              responsibleRoles: question.responsibleRole || ['compliance-officer'],
              aiModelConditions: JSON.stringify({
                aiModelType: modelTypeId,
                required: true
              })
            }
          });

          totalQuestionsCreated++;
        }
      }

      // Create deployment-specific questions
      for (const [deploymentId, deploymentQuestions] of Object.entries(comprehensiveSection.deploymentQuestions)) {
        for (const question of deploymentQuestions) {
          await prisma.dynamicQuestion.create({
            data: {
              sectionId: dbSection.id,
              questionText: question.text,
              questionType: question.type,
              validationCriteria: JSON.stringify({
                points: question.points,
                isBlocker: question.isBlocker,
                options: question.options || [],
                evidenceRequired: question.evidenceRequired || [],
                responsibleRoles: question.responsibleRole || [],
                deploymentSpecific: deploymentId
              }),
              evidenceRequired: question.evidenceRequired || [],
              responsibleRoles: question.responsibleRole || ['compliance-officer'],
              ipConditions: JSON.stringify({
                deploymentScenario: deploymentId,
                required: true
              })
            }
          });

          totalQuestionsCreated++;
        }
      }

      console.log(`✅ Created questions for section: ${dbSection.title}`);
    }

    console.log(`✅ Created ${totalQuestionsCreated} comprehensive questions from existing data`);
    console.log('🎉 Comprehensive questions seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding comprehensive questions:', error);
    throw error;
  }
}

// Run the seed function
seedComprehensiveFromData()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
