const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedQuestionPersonaMappings() {
  console.log('🌱 Seeding question-persona mappings...');
  
  try {
    // Get all questions
    const questions = await prisma.dynamicQuestion.findMany();
    console.log(`Found ${questions.length} questions`);
    
    // Get all personas with their sub-personas
    const personas = await prisma.persona.findMany({
      include: { subPersonas: true }
    });
    console.log(`Found ${personas.length} personas`);
    
    let mappingsCreated = 0;
    
    // Create mappings for each question to relevant personas
    for (const question of questions) {
      console.log(`Processing question: ${question.id}`);
      
      // Determine which personas should have access to this question based on section
      let relevantPersonaIds = [];
      
      // Map questions to personas based on their section and content
      if (question.sectionId === 'data-observability-monitoring') {
        // Data observability questions should be accessible to data science, IT security, and admin
        relevantPersonaIds = ['data-science', 'it-security', 'admin'];
      } else if (question.sectionId === 'data-quality-assurance-validation') {
        // Data quality questions should be accessible to data science, quality, and admin
        relevantPersonaIds = ['data-science', 'quality', 'admin'];
      } else if (question.sectionId === 'data-lineage-provenance-tracking') {
        // Data lineage questions should be accessible to data science, IT security, and admin
        relevantPersonaIds = ['data-science', 'it-security', 'admin'];
      } else if (question.sectionId === 'data-governance-framework') {
        // Data governance questions should be accessible to data science, legal, IT security, and admin
        relevantPersonaIds = ['data-science', 'legal', 'it-security', 'admin'];
      } else if (question.sectionId === 'data-security-privacy-protection') {
        // Data security questions should be accessible to IT security, legal, and admin
        relevantPersonaIds = ['it-security', 'legal', 'admin'];
      } else if (question.sectionId === 'data-retention-lifecycle-management') {
        // Data retention questions should be accessible to IT security, legal, and admin
        relevantPersonaIds = ['it-security', 'legal', 'admin'];
      } else if (question.sectionId === 'ai-model-validation-testing') {
        // AI model validation questions should be accessible to data science, quality, clinical, and admin
        relevantPersonaIds = ['data-science', 'quality', 'clinical', 'admin'];
      } else if (question.sectionId === 'model-performance-monitoring') {
        // Model performance questions should be accessible to data science, IT security, and admin
        relevantPersonaIds = ['data-science', 'it-security', 'admin'];
      } else if (question.sectionId === 'model-deployment-versioning') {
        // Model deployment questions should be accessible to data science, IT security, manufacturing, and admin
        relevantPersonaIds = ['data-science', 'it-security', 'manufacturing', 'admin'];
      } else if (question.sectionId === 'model-lifecycle-management') {
        // Model lifecycle questions should be accessible to data science, quality, and admin
        relevantPersonaIds = ['data-science', 'quality', 'admin'];
      } else if (question.sectionId === 'bias-detection-fairness') {
        // Bias detection questions should be accessible to data science, research, clinical, and admin
        relevantPersonaIds = ['data-science', 'research', 'clinical', 'admin'];
      } else if (question.sectionId === 'model-explainability-interpretability') {
        // Model explainability questions should be accessible to data science, research, clinical, and admin
        relevantPersonaIds = ['data-science', 'research', 'clinical', 'admin'];
      } else if (question.sectionId === 'model-robustness-adversarial-testing') {
        // Model robustness questions should be accessible to data science, research, and admin
        relevantPersonaIds = ['data-science', 'research', 'admin'];
      } else if (question.sectionId === 'model-optimization-performance-tuning') {
        // Model optimization questions should be accessible to data science, research, and admin
        relevantPersonaIds = ['data-science', 'research', 'admin'];
      } else if (question.sectionId === 'fda-ai-governance-2025-compliance') {
        // FDA governance questions should be accessible to regulatory, clinical, legal, and admin
        relevantPersonaIds = ['regulatory', 'clinical', 'legal', 'admin'];
      } else if (question.sectionId === 'regulatory-documentation-reporting') {
        // Regulatory documentation questions should be accessible to regulatory, clinical, and admin
        relevantPersonaIds = ['regulatory', 'clinical', 'admin'];
      } else if (question.sectionId === 'clinical-validation-evidence-generation') {
        // Clinical validation questions should be accessible to clinical, regulatory, and admin
        relevantPersonaIds = ['clinical', 'regulatory', 'admin'];
      } else if (question.sectionId === 'post-market-surveillance-monitoring') {
        // Post-market surveillance questions should be accessible to clinical, regulatory, and admin
        relevantPersonaIds = ['clinical', 'regulatory', 'admin'];
      } else if (question.sectionId === 'regulatory-change-management') {
        // Regulatory change questions should be accessible to regulatory, legal, and admin
        relevantPersonaIds = ['regulatory', 'legal', 'admin'];
      } else if (question.sectionId === 'international-regulatory-compliance') {
        // International compliance questions should be accessible to regulatory, legal, and admin
        relevantPersonaIds = ['regulatory', 'legal', 'admin'];
      } else if (question.sectionId === 'ai-risk-management-mitigation') {
        // AI risk management questions should be accessible to all personas
        relevantPersonaIds = ['executive', 'data-science', 'regulatory', 'quality', 'legal', 'clinical', 'it-security', 'manufacturing', 'research', 'admin'];
      } else if (question.sectionId === 'ai-incident-response-recovery') {
        // AI incident response questions should be accessible to IT security, legal, and admin
        relevantPersonaIds = ['it-security', 'legal', 'admin'];
      } else if (question.sectionId === 'ai-business-continuity-planning') {
        // Business continuity questions should be accessible to executive, IT security, and admin
        relevantPersonaIds = ['executive', 'it-security', 'admin'];
      } else if (question.sectionId === 'ai-governance-framework') {
        // AI governance questions should be accessible to executive, regulatory, legal, and admin
        relevantPersonaIds = ['executive', 'regulatory', 'legal', 'admin'];
      } else if (question.sectionId === 'ai-ethics-responsible-ai') {
        // AI ethics questions should be accessible to all personas
        relevantPersonaIds = ['executive', 'data-science', 'regulatory', 'quality', 'legal', 'clinical', 'it-security', 'manufacturing', 'research', 'admin'];
      } else if (question.sectionId === 'stakeholder-engagement-communication') {
        // Stakeholder engagement questions should be accessible to executive, regulatory, and admin
        relevantPersonaIds = ['executive', 'regulatory', 'admin'];
      } else {
        // Default: make accessible to admin only
        relevantPersonaIds = ['admin'];
      }
      
      // Create mappings for each relevant persona and their sub-personas
      for (const personaId of relevantPersonaIds) {
        const persona = personas.find(p => p.id === personaId);
        if (persona) {
          for (const subPersona of persona.subPersonas) {
            await prisma.personaQuestionMapping.upsert({
              where: {
                personaId_subPersonaId_questionId: {
                  personaId: persona.id,
                  subPersonaId: subPersona.id,
                  questionId: question.id,
                },
              },
              update: {},
              create: {
                personaId: persona.id,
                subPersonaId: subPersona.id,
                questionId: question.id,
                isVisible: true,
                expertiseRequired: subPersona.expertiseLevel,
              },
            });
            mappingsCreated++;
          }
        }
      }
    }
    
    console.log('✅ Question-persona mappings seeding completed!');
    console.log(`   • ${mappingsCreated} question-persona mappings created`);
    
  } catch (error) {
    console.error('❌ Error seeding question-persona mappings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedQuestionPersonaMappings()
  .then(() => {
    console.log('🎉 Question-persona mappings seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Question-persona mappings seeding failed:', error);
    process.exit(1);
  });
