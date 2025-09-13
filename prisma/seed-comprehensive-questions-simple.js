/**
 * Simple and Elegant Comprehensive Questions Seed
 * Uses the existing comprehensive assessment data structure
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Import the comprehensive assessment data
const fs = require('fs');
const path = require('path');

async function loadComprehensiveData() {
  try {
    // Read and evaluate the TypeScript file
    const filePath = path.join(__dirname, '../src/data/comprehensive-assessment.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the assessmentSections export
    const sectionsMatch = fileContent.match(/export const assessmentSections[^;]*;/s);
    if (!sectionsMatch) {
      throw new Error('Could not find assessmentSections export');
    }
    
    // Convert TypeScript to JavaScript (simple approach)
    let jsContent = sectionsMatch[0]
      .replace(/export const assessmentSections\s*=\s*/, 'module.exports = ')
      .replace(/: boolean/g, ': true')
      .replace(/: 'boolean'/g, ': "boolean"')
      .replace(/: 'text'/g, ': "text"')
      .replace(/: 'radio'/g, ': "radio"')
      .replace(/: 'checkbox'/g, ': "checkbox"')
      .replace(/: 'rating'/g, ': "rating"')
      .replace(/: 'Low'/g, ': "Low"')
      .replace(/: 'Medium'/g, ': "Medium"')
      .replace(/: 'High'/g, ': "High"')
      .replace(/: 'Critical'/g, ': "Critical"')
      .replace(/,\s*];?\s*$/, ']');
    
    // Write temporary file and require it
    const tempFile = path.join(__dirname, 'temp-sections.js');
    fs.writeFileSync(tempFile, jsContent);
    const sections = require(tempFile);
    fs.unlinkSync(tempFile); // Clean up
    
    return sections;
  } catch (error) {
    console.error('Error loading comprehensive data:', error);
    return null;
  }
}

async function seedComprehensiveQuestionsSimple() {
  console.log('🌱 Seeding comprehensive questions (simple approach)...');

  try {
    // Load comprehensive data
    const assessmentSections = await loadComprehensiveData();
    if (!assessmentSections) {
      console.log('❌ Could not load comprehensive assessment data');
      return;
    }

    console.log(`📋 Found ${assessmentSections.length} assessment sections`);

    // Get database sections
    const dbSections = await prisma.assessmentSection.findMany({
      orderBy: { sectionNumber: 'asc' }
    });

    if (dbSections.length === 0) {
      console.log('⚠️ No sections found in database. Please run section seed first.');
      return;
    }

    let totalQuestionsCreated = 0;

    // Create questions for each section
    for (const comprehensiveSection of assessmentSections) {
      // Find matching database section
      const dbSection = dbSections.find(
        section => section.id === comprehensiveSection.id || 
                   section.title.toLowerCase().includes(comprehensiveSection.name.toLowerCase()) ||
                   comprehensiveSection.name.toLowerCase().includes(section.title.toLowerCase())
      );

      if (!dbSection) {
        console.log(`⚠️ No database section found for: ${comprehensiveSection.name}`);
        continue;
      }

      console.log(`📝 Processing section: ${comprehensiveSection.name}`);

      // Create base questions
      for (const question of comprehensiveSection.questions) {
        await prisma.dynamicQuestion.create({
          data: {
            sectionId: dbSection.id,
            questionText: question.text,
            questionType: question.type,
            validationCriteria: JSON.stringify({
              points: question.points,
              isBlocker: question.isBlocker,
              category: question.category,
              evidenceRequired: question.evidenceRequired,
              responsibleRole: question.responsibleRole,
              validationCriteria: question.validationCriteria
            }),
            evidenceRequired: question.evidenceRequired || [],
            responsibleRoles: question.responsibleRole || ['compliance-officer']
          }
        });

        totalQuestionsCreated++;
      }

      // Create therapy-specific questions
      if (comprehensiveSection.therapySpecificQuestions) {
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
                  category: question.category,
                  evidenceRequired: question.evidenceRequired,
                  responsibleRole: question.responsibleRole,
                  validationCriteria: question.validationCriteria,
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
      }

      // Create model type-specific questions
      if (comprehensiveSection.modelTypeQuestions) {
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
                  category: question.category,
                  evidenceRequired: question.evidenceRequired,
                  responsibleRole: question.responsibleRole,
                  validationCriteria: question.validationCriteria,
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
      }

      // Create deployment-specific questions
      if (comprehensiveSection.deploymentQuestions) {
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
                  category: question.category,
                  evidenceRequired: question.evidenceRequired,
                  responsibleRole: question.responsibleRole,
                  validationCriteria: question.validationCriteria,
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
      }

      console.log(`✅ Created questions for: ${comprehensiveSection.name}`);
    }

    console.log(`🎉 Successfully created ${totalQuestionsCreated} comprehensive questions!`);
    console.log(`📊 Questions distributed across ${assessmentSections.length} sections`);

  } catch (error) {
    console.error('❌ Error seeding comprehensive questions:', error);
    throw error;
  }
}

// Run the seed function
seedComprehensiveQuestionsSimple()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
