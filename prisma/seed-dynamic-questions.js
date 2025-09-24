const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding dynamic questions with therapy-specific conditions...');

  try {
    // Create dynamic questions with therapy-specific conditions
    const dynamicQuestions = [
      {
        id: 'oncology-data-governance-1',
        questionText: 'Do you have specialized data governance protocols for oncology patient data, including genetic sequencing and biomarker information?',
        sectionId: 'data-governance',
        questionType: 'multiple-choice',
        complexityPoints: 8,
        therapySpecificConditions: {
          therapeuticAreas: ['oncology', 'oncology-pediatric'],
          conditions: {
            requiresGeneticData: true,
            requiresBiomarkerData: true,
            dataSensitivity: 'high'
          }
        },
        aiModelConditions: {
          modelTypes: ['deep-learning', 'neural-network', 'transformer'],
          conditions: {
            requiresExplainability: true,
            requiresClinicalValidation: true
          }
        }
      },
      {
        id: 'rare-disease-validation-1',
        questionText: 'How do you validate AI models for rare disease applications where patient populations are extremely limited?',
        sectionId: 'ai-model-validation',
        questionType: 'multiple-choice',
        complexityPoints: 12,
        therapySpecificConditions: {
          therapeuticAreas: ['rare-disease', 'rare-genetic'],
          conditions: {
            patientPopulationSize: 'small',
            requiresSpecialValidation: true,
            regulatoryPathway: 'orphan-drug'
          }
        },
        aiModelConditions: {
          modelTypes: ['machine-learning', 'deep-learning'],
          conditions: {
            requiresSmallDatasetHandling: true,
            requiresTransferLearning: true
          }
        }
      },
      {
        id: 'pediatric-fda-compliance-1',
        questionText: 'Are your AI models compliant with FDA pediatric study requirements and age-appropriate dosing algorithms?',
        sectionId: 'fda-ai-governance',
        questionType: 'multiple-choice',
        complexityPoints: 15,
        therapySpecificConditions: {
          therapeuticAreas: ['pediatrics', 'oncology-pediatric'],
          conditions: {
            ageGroup: 'pediatric',
            requiresPediatricStudies: true,
            dosingComplexity: 'high'
          }
        },
        aiModelConditions: {
          modelTypes: ['machine-learning', 'deep-learning', 'neural-network'],
          conditions: {
            requiresAgeAdjustment: true,
            requiresPediatricValidation: true
          }
        }
      },
      {
        id: 'infectious-disease-quality-1',
        questionText: 'Do you have real-time data quality monitoring for infectious disease surveillance and outbreak prediction models?',
        sectionId: 'data-quality',
        questionType: 'multiple-choice',
        complexityPoints: 10,
        therapySpecificConditions: {
          therapeuticAreas: ['infectious-disease', 'infectious-emerging'],
          conditions: {
            requiresRealTimeData: true,
            dataVelocity: 'high',
            requiresEpidemiologicalData: true
          }
        },
        aiModelConditions: {
          modelTypes: ['time-series', 'deep-learning', 'transformer'],
          conditions: {
            requiresRealTimeProcessing: true,
            requiresTemporalAnalysis: true
          }
        }
      },
      {
        id: 'precision-medicine-deployment-1',
        questionText: 'How do you deploy AI models for precision medicine applications that require patient-specific genomic analysis?',
        sectionId: 'model-deployment',
        questionType: 'multiple-choice',
        complexityPoints: 14,
        therapySpecificConditions: {
          therapeuticAreas: ['precision-medicine', 'oncology'],
          conditions: {
            requiresGenomicData: true,
            requiresPersonalizedTreatment: true,
            dataComplexity: 'very-high'
          }
        },
        aiModelConditions: {
          modelTypes: ['deep-learning', 'neural-network', 'transformer'],
          conditions: {
            requiresGenomicAnalysis: true,
            requiresPersonalization: true
          }
        }
      },
      {
        id: 'cardiovascular-risk-1',
        questionText: 'Do you have AI risk management protocols for cardiovascular AI models that could impact patient safety in real-time monitoring?',
        sectionId: 'risk-management',
        questionType: 'multiple-choice',
        complexityPoints: 11,
        therapySpecificConditions: {
          therapeuticAreas: ['cardiovascular'],
          conditions: {
            requiresRealTimeMonitoring: true,
            safetyCritical: true,
            requiresContinuousValidation: true
          }
        },
        aiModelConditions: {
          modelTypes: ['machine-learning', 'deep-learning', 'time-series'],
          conditions: {
            requiresRealTimeSafetyChecks: true,
            requiresContinuousMonitoring: true
          }
        }
      }
    ];

    for (const question of dynamicQuestions) {
      await prisma.dynamicQuestion.upsert({
        where: { id: question.id },
        update: {},
        create: {
          id: question.id,
          questionText: question.questionText,
          sectionId: question.sectionId,
          questionType: question.questionType,
          complexityPoints: question.complexityPoints,
          therapySpecificConditions: question.therapySpecificConditions,
          aiModelConditions: question.aiModelConditions
        }
      });
    }

    // Create persona-section mappings for dynamic filtering
    console.log('👥 Creating persona-section mappings...');
    const personaMappings = [
      // Executive Leadership - focuses on strategic compliance
      { personaId: 'executive', sectionId: 'fda-ai-governance', isRequired: true, weight: 10 },
      { personaId: 'executive', sectionId: 'risk-management', isRequired: true, weight: 9 },
      { personaId: 'executive', sectionId: 'data-governance', isRequired: false, weight: 6 },

      // Data Science & AI Team - technical implementation
      { personaId: 'data-science', sectionId: 'ai-model-validation', isRequired: true, weight: 10 },
      { personaId: 'data-science', sectionId: 'model-deployment', isRequired: true, weight: 9 },
      { personaId: 'data-science', sectionId: 'data-quality', isRequired: true, weight: 8 },
      { personaId: 'data-science', sectionId: 'data-governance', isRequired: false, weight: 7 },

      // Regulatory Affairs - compliance focus
      { personaId: 'regulatory', sectionId: 'fda-ai-governance', isRequired: true, weight: 10 },
      { personaId: 'regulatory', sectionId: 'ai-model-validation', isRequired: true, weight: 9 },
      { personaId: 'regulatory', sectionId: 'risk-management', isRequired: false, weight: 7 },

      // Quality Assurance - validation and monitoring
      { personaId: 'quality', sectionId: 'ai-model-validation', isRequired: true, weight: 10 },
      { personaId: 'quality', sectionId: 'data-quality', isRequired: true, weight: 9 },
      { personaId: 'quality', sectionId: 'model-deployment', isRequired: true, weight: 8 },

      // Legal & Compliance - risk and governance
      { personaId: 'legal', sectionId: 'fda-ai-governance', isRequired: true, weight: 10 },
      { personaId: 'legal', sectionId: 'risk-management', isRequired: true, weight: 9 },
      { personaId: 'legal', sectionId: 'data-governance', isRequired: false, weight: 7 }
    ];

    for (const mapping of personaMappings) {
      await prisma.personaSectionMapping.upsert({
        where: { 
          personaId_sectionId: {
            personaId: mapping.personaId,
            sectionId: mapping.sectionId
          }
        },
        update: {},
        create: mapping
      });
    }

    // Create therapy-specific question conditions
    console.log('🧬 Creating therapy-specific question conditions...');
    const therapyConditions = [
      {
        questionId: 'oncology-data-governance-1',
        therapeuticAreaId: 'oncology',
        isRequired: true,
        conditions: {
          requiresGeneticData: true,
          requiresBiomarkerData: true,
          dataSensitivity: 'high'
        }
      },
      {
        questionId: 'oncology-data-governance-1',
        therapeuticAreaId: 'oncology-pediatric',
        isRequired: true,
        conditions: {
          requiresGeneticData: true,
          requiresBiomarkerData: true,
          dataSensitivity: 'high',
          ageGroup: 'pediatric'
        }
      },
      {
        questionId: 'rare-disease-validation-1',
        therapeuticAreaId: 'rare-disease',
        isRequired: true,
        conditions: {
          patientPopulationSize: 'small',
          requiresSpecialValidation: true
        }
      },
      {
        questionId: 'rare-disease-validation-1',
        therapeuticAreaId: 'rare-genetic',
        isRequired: true,
        conditions: {
          patientPopulationSize: 'very-small',
          requiresSpecialValidation: true,
          requiresGeneticAnalysis: true
        }
      },
      {
        questionId: 'pediatric-fda-compliance-1',
        therapeuticAreaId: 'pediatrics',
        isRequired: true,
        conditions: {
          ageGroup: 'pediatric',
          requiresPediatricStudies: true
        }
      },
      {
        questionId: 'infectious-disease-quality-1',
        therapeuticAreaId: 'infectious-disease',
        isRequired: true,
        conditions: {
          requiresRealTimeData: true,
          dataVelocity: 'high'
        }
      },
      {
        questionId: 'precision-medicine-deployment-1',
        therapeuticAreaId: 'precision-medicine',
        isRequired: true,
        conditions: {
          requiresGenomicData: true,
          requiresPersonalizedTreatment: true
        }
      },
      {
        questionId: 'cardiovascular-risk-1',
        therapeuticAreaId: 'cardiovascular',
        isRequired: true,
        conditions: {
          requiresRealTimeMonitoring: true,
          safetyCritical: true
        }
      }
    ];

    for (const condition of therapyConditions) {
      await prisma.therapyQuestionCondition.upsert({
        where: { 
          questionId_therapeuticAreaId: {
            questionId: condition.questionId,
            therapeuticAreaId: condition.therapeuticAreaId
          }
        },
        update: {},
        create: condition
      });
    }

    console.log('✅ Dynamic questions and conditions seeding completed!');
    console.log('📊 Summary:');
    console.log(`   • ${dynamicQuestions.length} dynamic questions created`);
    console.log(`   • ${personaMappings.length} persona-section mappings created`);
    console.log(`   • ${therapyConditions.length} therapy-specific conditions created`);
    console.log('');
    console.log('🎯 Dynamic Question Loading System:');
    console.log('   ✅ Company → Therapeutic Areas → Persona → Sub-Persona → AI Model → Questions');
    console.log('   ✅ Therapy-specific question filtering');
    console.log('   ✅ AI model type-specific overlays');
    console.log('   ✅ Persona-based section prioritization');

  } catch (error) {
    console.error('❌ Error seeding dynamic questions:', error);
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
