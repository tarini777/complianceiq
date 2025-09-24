const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding persona-section and persona-question mappings...');

  try {
    // Create persona-section mappings
    console.log('📋 Creating persona-section mappings...');
    const personaSectionMappings = [
      // Executive Leadership mappings
      { personaId: 'executive', subPersonaId: 'chief-executive-officer', sectionId: 'fda-ai-governance', isRequired: true, priorityScore: 10 },
      { personaId: 'executive', subPersonaId: 'chief-executive-officer', sectionId: 'risk-management', isRequired: true, priorityScore: 9 },
      { personaId: 'executive', subPersonaId: 'chief-medical-officer', sectionId: 'fda-ai-governance', isRequired: true, priorityScore: 10 },
      { personaId: 'executive', subPersonaId: 'chief-medical-officer', sectionId: 'ai-model-validation', isRequired: true, priorityScore: 8 },
      { personaId: 'executive', subPersonaId: 'chief-technology-officer', sectionId: 'model-deployment', isRequired: true, priorityScore: 9 },
      { personaId: 'executive', subPersonaId: 'chief-technology-officer', sectionId: 'data-governance', isRequired: true, priorityScore: 8 },

      // Data Science & AI Team mappings
      { personaId: 'data-science', subPersonaId: 'data-scientist', sectionId: 'ai-model-validation', isRequired: true, priorityScore: 10 },
      { personaId: 'data-science', subPersonaId: 'data-scientist', sectionId: 'model-deployment', isRequired: true, priorityScore: 9 },
      { personaId: 'data-science', subPersonaId: 'data-scientist', sectionId: 'data-quality', isRequired: true, priorityScore: 8 },
      { personaId: 'data-science', subPersonaId: 'ml-engineer', sectionId: 'model-deployment', isRequired: true, priorityScore: 10 },
      { personaId: 'data-science', subPersonaId: 'ml-engineer', sectionId: 'ai-model-validation', isRequired: true, priorityScore: 9 },
      { personaId: 'data-science', subPersonaId: 'data-engineer', sectionId: 'data-governance', isRequired: true, priorityScore: 10 },
      { personaId: 'data-science', subPersonaId: 'data-engineer', sectionId: 'data-quality', isRequired: true, priorityScore: 9 },

      // Regulatory Affairs mappings
      { personaId: 'regulatory', subPersonaId: 'regulatory-affairs-manager', sectionId: 'fda-ai-governance', isRequired: true, priorityScore: 10 },
      { personaId: 'regulatory', subPersonaId: 'regulatory-affairs-manager', sectionId: 'ai-model-validation', isRequired: true, priorityScore: 9 },
      { personaId: 'regulatory', subPersonaId: 'compliance-officer', sectionId: 'fda-ai-governance', isRequired: true, priorityScore: 10 },
      { personaId: 'regulatory', subPersonaId: 'compliance-officer', sectionId: 'risk-management', isRequired: true, priorityScore: 8 },

      // Quality Assurance mappings
      { personaId: 'quality', subPersonaId: 'qa-manager', sectionId: 'ai-model-validation', isRequired: true, priorityScore: 10 },
      { personaId: 'quality', subPersonaId: 'qa-manager', sectionId: 'data-quality', isRequired: true, priorityScore: 9 },
      { personaId: 'quality', subPersonaId: 'validation-specialist', sectionId: 'ai-model-validation', isRequired: true, priorityScore: 10 },
      { personaId: 'quality', subPersonaId: 'validation-specialist', sectionId: 'model-deployment', isRequired: true, priorityScore: 8 },

      // Legal & Compliance mappings
      { personaId: 'legal', subPersonaId: 'legal-counsel', sectionId: 'fda-ai-governance', isRequired: true, priorityScore: 10 },
      { personaId: 'legal', subPersonaId: 'legal-counsel', sectionId: 'risk-management', isRequired: true, priorityScore: 9 },
      { personaId: 'legal', subPersonaId: 'privacy-officer', sectionId: 'data-governance', isRequired: true, priorityScore: 10 },
      { personaId: 'legal', subPersonaId: 'privacy-officer', sectionId: 'data-quality', isRequired: true, priorityScore: 8 }
    ];

    for (const mapping of personaSectionMappings) {
      await prisma.personaSectionMapping.upsert({
        where: { 
          personaId_subPersonaId_sectionId: {
            personaId: mapping.personaId,
            subPersonaId: mapping.subPersonaId,
            sectionId: mapping.sectionId
          }
        },
        update: {},
        create: {
          personaId: mapping.personaId,
          subPersonaId: mapping.subPersonaId,
          sectionId: mapping.sectionId,
          accessLevel: 'full',
          responsibilityType: 'primary',
          canEdit: true,
          canApprove: false,
          canReview: true,
          isRequired: mapping.isRequired,
          priorityScore: mapping.priorityScore
        }
      });
    }

    // Create persona-question mappings
    console.log('❓ Creating persona-question mappings...');
    const questions = await prisma.dynamicQuestion.findMany();
    const subPersonas = await prisma.subPersona.findMany();

    let questionMappingsCreated = 0;

    for (const question of questions) {
      for (const subPersona of subPersonas) {
        // Check if this sub-persona has access to the question's section
        const sectionMapping = await prisma.personaSectionMapping.findFirst({
          where: {
            subPersonaId: subPersona.id,
            sectionId: question.sectionId
          }
        });

        if (sectionMapping) {
          await prisma.personaQuestionMapping.upsert({
            where: {
              personaId_subPersonaId_questionId: {
                personaId: subPersona.personaId,
                subPersonaId: subPersona.id,
                questionId: question.id
              }
            },
            update: {},
            create: {
              personaId: subPersona.personaId,
              subPersonaId: subPersona.id,
              questionId: question.id,
              isVisible: true,
              expertiseRequired: subPersona.expertiseLevel
            }
          });
          questionMappingsCreated++;
        }
      }
    }

    console.log('✅ Persona mappings seeding completed!');
    console.log(`   • ${personaSectionMappings.length} persona-section mappings created`);
    console.log(`   • ${questionMappingsCreated} persona-question mappings created`);
    console.log('');
    console.log('🎯 Sub-persona filtering now works for:');
    console.log('   • Chief Executive Officer → FDA Governance, Risk Management');
    console.log('   • Data Scientist → AI Model Validation, Model Deployment, Data Quality');
    console.log('   • ML Engineer → Model Deployment, AI Model Validation');
    console.log('   • Regulatory Affairs Manager → FDA Governance, AI Model Validation');
    console.log('   • QA Manager → AI Model Validation, Data Quality');
    console.log('   • Legal Counsel → FDA Governance, Risk Management');
    console.log('   • Privacy Officer → Data Governance, Data Quality');

  } catch (error) {
    console.error('❌ Error seeding persona mappings:', error);
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
