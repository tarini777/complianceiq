/**
 * Seed Persona-Question Mappings
 * Creates mappings between personas/sub-personas and questions
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPersonaQuestionMappings() {
  console.log('🌱 Seeding persona-question mappings...');

  try {
    // Get all personas and sub-personas
    const personas = await prisma.persona.findMany({
      include: { subPersonas: true }
    });

    // Get all questions
    const questions = await prisma.dynamicQuestion.findMany({
      include: { section: true }
    });

    console.log(`📋 Found ${personas.length} personas and ${questions.length} questions`);

    let mappingsCreated = 0;

    for (const persona of personas) {
      for (const subPersona of persona.subPersonas) {
        // Admin gets access to ALL questions
        if (persona.isAdmin) {
          for (const question of questions) {
            await prisma.personaQuestionMapping.create({
              data: {
                personaId: persona.id,
                subPersonaId: subPersona.id,
                questionId: question.id,
                isVisible: true,
                expertiseRequired: 'expert'
              }
            });
            mappingsCreated++;
          }
        } else {
          // Non-admin personas get questions based on their section mappings
          const sectionMappings = await prisma.personaSectionMapping.findMany({
            where: {
              personaId: persona.id,
              subPersonaId: subPersona.id
            },
            include: { section: true }
          });

          // Get questions for sections this persona has access to
          const accessibleSectionIds = sectionMappings.map(m => m.section.id);
          const accessibleQuestions = questions.filter(q => 
            accessibleSectionIds.includes(q.sectionId)
          );

          for (const question of accessibleQuestions) {
            const sectionMapping = sectionMappings.find(m => m.section.id === question.sectionId);
            
            await prisma.personaQuestionMapping.create({
              data: {
                personaId: persona.id,
                subPersonaId: subPersona.id,
                questionId: question.id,
                isVisible: true,
                expertiseRequired: subPersona.expertiseLevel || 'intermediate'
              }
            });
            mappingsCreated++;
          }
        }
      }
    }

    console.log(`🎉 Successfully created ${mappingsCreated} persona-question mappings!`);

  } catch (error) {
    console.error('❌ Error seeding persona-question mappings:', error);
    throw error;
  }
}

// Run the seed function
seedPersonaQuestionMappings()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
