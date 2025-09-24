/**
 * Move All Hardcoded Content to Database
 * This script moves all hardcoded therapy-specific and AI model-specific configurations
 * from the API code to the database for better maintainability and scalability.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedHardcodedContent() {
  console.log('🌱 Moving hardcoded content to database...');

  try {
    // 1. Create therapy-specific production blocker questions
    await seedTherapySpecificQuestions();
    
    // 2. Create AI model-specific production blocker questions
    await seedAIModelSpecificQuestions();
    
    // 3. Create therapy question conditions mappings
    await seedTherapyQuestionConditions();
    
    // 4. Create therapy-specific overlays
    await seedTherapySpecificOverlays();
    
    // 5. Create AI model-specific overlays
    await seedAIModelSpecificOverlays();
    
    // 6. Create deployment-specific overlays
    await seedDeploymentSpecificOverlays();
    
    console.log('✅ All hardcoded content moved to database successfully!');

  } catch (error) {
    console.error('❌ Error moving hardcoded content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedTherapySpecificQuestions() {
  console.log('📋 Creating therapy-specific production blocker questions...');
  
  // Get all sections
  const sections = await prisma.assessmentSection.findMany();
  
  // Get therapeutic areas
  const therapeuticAreas = await prisma.therapeuticArea.findMany();
  
  const therapyConfigs = {
    'oncology': {
      name: 'Oncology',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your AI outputs production-formatted and validated for FDA Oncology Center of Excellence requirements?',
          points: 4,
          evidenceRequired: ['FDA Oncology Center validation', 'Oncology-specific compliance documentation'],
          responsibleRoles: ['Oncology Medical Director', 'Regulatory Affairs Director'],
          validationCriteria: { therapy: 'oncology', fdaCenter: 'Oncology Center of Excellence' }
        },
        {
          question: '🚨 PRODUCTION BLOCKER: Is your real-world evidence generation production-configured for oncology endpoints (OS, PFS, ORR, biomarkers)?',
          points: 4,
          evidenceRequired: ['Oncology endpoint validation', 'Biomarker qualification documentation'],
          responsibleRoles: ['Oncology Clinical Director', 'Real-World Evidence Manager'],
          validationCriteria: { endpoints: ['OS', 'PFS', 'ORR', 'biomarkers'], validation: 'production-ready' }
        }
      ]
    },
    'cardiology': {
      name: 'Cardiology',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your AI models production-validated for cardiovascular endpoint assessment (MACE, mortality reduction)?',
          points: 4,
          evidenceRequired: ['Cardiovascular endpoint validation', 'MACE assessment documentation'],
          responsibleRoles: ['Cardiology Medical Director', 'Clinical Validation Manager'],
          validationCriteria: { endpoints: ['MACE', 'mortality'], validation: 'production-ready' }
        }
      ]
    },
    'neurology': {
      name: 'Neurology',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your neurological outcome measures production-configured for FDA CNS guidance compliance?',
          points: 4,
          evidenceRequired: ['FDA CNS guidance compliance', 'Neurological outcome validation'],
          responsibleRoles: ['Neurology Medical Director', 'Clinical Validation Manager'],
          validationCriteria: { guidance: 'FDA CNS', validation: 'production-ready' }
        }
      ]
    },
    'rare-disease': {
      name: 'Rare Disease',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your small population AI models production-validated for FDA orphan drug development guidance?',
          points: 4,
          evidenceRequired: ['FDA orphan drug guidance compliance', 'Small population model validation'],
          responsibleRoles: ['Rare Disease Medical Director', 'Clinical Validation Manager'],
          validationCriteria: { guidance: 'FDA orphan drug', validation: 'production-ready' }
        }
      ]
    }
  };

  let questionsCreated = 0;

  for (const section of sections) {
    for (const [therapyKey, therapyConfig] of Object.entries(therapyConfigs)) {
      // Find matching therapeutic area
      const therapeuticArea = therapeuticAreas.find(ta => 
        ta.name.toLowerCase().includes(therapyKey) || 
        therapyKey.includes(ta.name.toLowerCase())
      );
      
      if (!therapeuticArea) continue;

      for (const [index, blocker] of therapyConfig.productionBlockers.entries()) {
        const questionData = {
          sectionId: section.id,
          questionText: blocker.question,
          questionType: 'boolean',
          complexityPoints: blocker.points,
          isProductionBlocker: true,
          category: `${therapyConfig.name}-Specific`,
          evidenceRequired: blocker.evidenceRequired,
          responsibleRoles: blocker.responsibleRoles,
          therapySpecificConditions: {
            therapeuticArea: therapyKey,
            required: true,
            conditionLogic: { type: 'therapy_specific', area: therapyKey }
          },
          validationCriteria: blocker.validationCriteria,
          status: 'approved',
          generatedAt: new Date(),
          approvedBy: 'system',
          approvedAt: new Date()
        };

        await prisma.dynamicQuestion.create({
          data: questionData
        });

        questionsCreated++;
      }
    }
  }

  console.log(`✅ Created ${questionsCreated} therapy-specific production blocker questions`);
}

async function seedAIModelSpecificQuestions() {
  console.log('🤖 Creating AI model-specific production blocker questions...');
  
  // Get all sections
  const sections = await prisma.assessmentSection.findMany();
  
  // Get AI model types
  const aiModelTypes = await prisma.aIModelType.findMany();
  
  const aiModelConfigs = {
    'generative-ai': {
      name: 'Generative AI',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your hallucination detection systems production-deployed for clinical content generation?',
          points: 3,
          evidenceRequired: ['Hallucination detection system', 'Clinical content validation protocols'],
          responsibleRoles: ['AI/ML Engineer', 'Clinical Content Manager'],
          validationCriteria: { detection: 'production-deployed', accuracy: '>95%' }
        }
      ]
    },
    'agentic-ai': {
      name: 'Agentic AI',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your agent decision audit trails production-deployed meeting FDA transparency requirements?',
          points: 4,
          evidenceRequired: ['Agent audit trail system', 'FDA transparency compliance documentation'],
          responsibleRoles: ['AI/ML Engineer', 'Compliance Officer'],
          validationCriteria: { auditTrails: 'production-deployed', fdaCompliance: 'transparency-requirements' }
        }
      ]
    },
    'traditional-ml': {
      name: 'Traditional AI/ML',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your model explainability systems production-deployed for regulatory transparency?',
          points: 3,
          evidenceRequired: ['Model explainability system', 'Regulatory transparency documentation'],
          responsibleRoles: ['AI/ML Engineer', 'Regulatory Affairs Manager'],
          validationCriteria: { explainability: 'production-deployed', transparency: 'regulatory-approved' }
        }
      ]
    }
  };

  let questionsCreated = 0;

  for (const section of sections) {
    for (const [aiModelKey, aiModelConfig] of Object.entries(aiModelConfigs)) {
      // Find matching AI model type
      const aiModelType = aiModelTypes.find(amt => 
        amt.name.toLowerCase().includes(aiModelKey.replace('-', ' ')) ||
        aiModelKey.replace('-', ' ').includes(amt.name.toLowerCase())
      );
      
      if (!aiModelType) continue;

      for (const [index, blocker] of aiModelConfig.productionBlockers.entries()) {
        const questionData = {
          sectionId: section.id,
          questionText: blocker.question,
          questionType: 'boolean',
          complexityPoints: blocker.points,
          isProductionBlocker: true,
          category: `${aiModelConfig.name}-Specific`,
          evidenceRequired: blocker.evidenceRequired,
          responsibleRoles: blocker.responsibleRoles,
          aiModelConditions: {
            aiModelType: aiModelKey,
            required: true,
            conditionLogic: { type: 'ai_model_specific', model: aiModelKey }
          },
          validationCriteria: blocker.validationCriteria,
          status: 'approved',
          generatedAt: new Date(),
          approvedBy: 'system',
          approvedAt: new Date()
        };

        await prisma.dynamicQuestion.create({
          data: questionData
        });

        questionsCreated++;
      }
    }
  }

  console.log(`✅ Created ${questionsCreated} AI model-specific production blocker questions`);
}

async function seedTherapyQuestionConditions() {
  console.log('🔗 Creating therapy question conditions mappings...');
  
  // Get questions with therapy-specific conditions
  const questions = await prisma.dynamicQuestion.findMany({
    where: {
      therapySpecificConditions: {
        not: null
      }
    }
  });
  
  // Get therapeutic areas
  const therapeuticAreas = await prisma.therapeuticArea.findMany();
  
  let conditionsCreated = 0;

  for (const question of questions) {
    const therapyConditions = question.therapySpecificConditions;
    if (therapyConditions && therapyConditions.therapeuticArea) {
      const therapeuticArea = therapeuticAreas.find(ta => 
        ta.name.toLowerCase().includes(therapyConditions.therapeuticArea) ||
        therapyConditions.therapeuticArea.includes(ta.name.toLowerCase())
      );
      
      if (therapeuticArea) {
        await prisma.therapyQuestionCondition.upsert({
          where: {
            questionId_therapeuticAreaId: {
              questionId: question.id,
              therapeuticAreaId: therapeuticArea.id
            }
          },
          update: {
            conditionLogic: therapyConditions.conditionLogic || { type: 'therapy_specific' }
          },
          create: {
            questionId: question.id,
            therapeuticAreaId: therapeuticArea.id,
            conditionLogic: therapyConditions.conditionLogic || { type: 'therapy_specific' }
          }
        });
        conditionsCreated++;
      }
    }
  }

  console.log(`✅ Created ${conditionsCreated} therapy question conditions`);
}

async function seedTherapySpecificOverlays() {
  console.log('🎯 Creating therapy-specific overlays...');
  
  // Get sections and therapeutic areas
  const sections = await prisma.assessmentSection.findMany();
  const therapeuticAreas = await prisma.therapeuticArea.findMany();
  
  let overlaysCreated = 0;

  for (const section of sections) {
    for (const therapeuticArea of therapeuticAreas) {
      const overlayData = {
        sectionId: section.id,
        therapeuticAreaId: therapeuticArea.id,
        overlayType: therapeuticArea.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
        overlayContent: {
          name: `${therapeuticArea.name} - ${section.title}`,
          description: `Therapy-specific overlay for ${therapeuticArea.name} in ${section.title}`,
          specificQuestions: [
            `How does your ${section.title.toLowerCase()} process address ${therapeuticArea.name.toLowerCase()} specific requirements?`,
            `What ${therapeuticArea.name.toLowerCase()} specific validation criteria are applied in ${section.title.toLowerCase()}?`
          ],
          additionalRequirements: [
            `${therapeuticArea.name} specific documentation`,
            `${therapeuticArea.name} regulatory compliance`,
            `${therapeuticArea.name} endpoint validation`
          ]
        },
        complexityPoints: 2,
        isActive: true
      };

      await prisma.therapySpecificOverlay.create({
        data: overlayData
      });
      
      overlaysCreated++;
    }
  }

  console.log(`✅ Created ${overlaysCreated} therapy-specific overlays`);
}

async function seedAIModelSpecificOverlays() {
  console.log('🤖 Creating AI model-specific overlays...');
  
  // Get sections and AI model types
  const sections = await prisma.assessmentSection.findMany();
  const aiModelTypes = await prisma.aIModelType.findMany();
  
  let overlaysCreated = 0;

  for (const section of sections) {
    for (const aiModelType of aiModelTypes) {
      const overlayData = {
        sectionId: section.id,
        aiModelTypeId: aiModelType.id,
        overlayType: aiModelType.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
        overlayContent: {
          name: `${aiModelType.name} - ${section.title}`,
          description: `AI model-specific overlay for ${aiModelType.name} in ${section.title}`,
          specificQuestions: [
            `How does your ${section.title.toLowerCase()} process validate ${aiModelType.name.toLowerCase()}?`,
            `What ${aiModelType.name.toLowerCase()} specific requirements are addressed in ${section.title.toLowerCase()}?`
          ],
          additionalRequirements: [
            `${aiModelType.name} model validation`,
            `${aiModelType.name} performance metrics`,
            `${aiModelType.name} regulatory compliance`
          ]
        },
        complexityPoints: 2,
        isActive: true
      };

      await prisma.aIModelSpecificOverlay.create({
        data: overlayData
      });
      
      overlaysCreated++;
    }
  }

  console.log(`✅ Created ${overlaysCreated} AI model-specific overlays`);
}

async function seedDeploymentSpecificOverlays() {
  console.log('🚀 Creating deployment-specific overlays...');
  
  // Get sections and deployment scenarios
  const sections = await prisma.assessmentSection.findMany();
  const deploymentScenarios = await prisma.deploymentScenario.findMany();
  
  let overlaysCreated = 0;

  for (const section of sections) {
    for (const deploymentScenario of deploymentScenarios) {
      const overlayData = {
        sectionId: section.id,
        deploymentScenarioId: deploymentScenario.id,
        overlayType: deploymentScenario.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
        overlayContent: {
          name: `${deploymentScenario.name} - ${section.title}`,
          description: `Deployment-specific overlay for ${deploymentScenario.name} in ${section.title}`,
          specificQuestions: [
            `How does your ${section.title.toLowerCase()} process support ${deploymentScenario.name.toLowerCase()}?`,
            `What ${deploymentScenario.name.toLowerCase()} specific considerations are addressed in ${section.title.toLowerCase()}?`
          ],
          additionalRequirements: [
            `${deploymentScenario.name} deployment validation`,
            `${deploymentScenario.name} monitoring requirements`,
            `${deploymentScenario.name} compliance standards`
          ]
        },
        complexityPoints: 2,
        isActive: true
      };

      await prisma.deploymentSpecificOverlay.create({
        data: overlayData
      });
      
      overlaysCreated++;
    }
  }

  console.log(`✅ Created ${overlaysCreated} deployment-specific overlays`);
}

// Run the seed function
seedHardcodedContent()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
