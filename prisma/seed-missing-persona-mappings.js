const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMissingPersonaMappings() {
  console.log('🌱 Seeding missing persona-section mappings...');
  
  try {
    // Get all sections
    const sections = await prisma.assessmentSection.findMany();
    console.log(`Found ${sections.length} sections`);
    
    // Get all personas
    const personas = await prisma.persona.findMany();
    console.log(`Found ${personas.length} personas`);
    
    let mappingsCreated = 0;
    
    // Get all personas with their sub-personas
    const personasWithSubPersonas = await prisma.persona.findMany({
      include: { subPersonas: true }
    });
    
    // Create mappings for personas that don't have any mappings
    for (const persona of personasWithSubPersonas) {
      const existingMappings = await prisma.personaSectionMapping.findMany({
        where: { personaId: persona.id }
      });
      
      if (existingMappings.length === 0) {
        console.log(`Creating mappings for persona: ${persona.name} (${persona.id})`);
        
        // Define which sections each persona should have access to
        let relevantSectionIds = [];
        
        if (persona.id === 'clinical') {
          // Clinical Operations should have access to clinical and regulatory sections
          relevantSectionIds = [
            'clinical-validation-evidence-generation',
            'fda-ai-governance-2025-compliance',
            'regulatory-documentation-reporting',
            'post-market-surveillance-monitoring',
            'international-regulatory-compliance',
            'ai-model-validation-testing',
            'bias-detection-fairness',
            'model-explainability-interpretability',
            'ai-ethics-responsible-ai'
          ];
        } else if (persona.id === 'it-security') {
          // IT & Security should have access to security and infrastructure sections
          relevantSectionIds = [
            'data-security-privacy-protection',
            'data-governance-framework',
            'model-deployment-versioning',
            'ai-incident-response-recovery',
            'ai-business-continuity-planning',
            'data-observability-monitoring',
            'data-quality-assurance-validation'
          ];
        } else if (persona.id === 'manufacturing') {
          // Manufacturing should have access to quality and operational sections
          relevantSectionIds = [
            'data-quality-assurance-validation',
            'model-deployment-versioning',
            'model-performance-monitoring',
            'ai-risk-management-mitigation',
            'ai-business-continuity-planning',
            'stakeholder-engagement-communication'
          ];
        } else if (persona.id === 'research') {
          // Research & Development should have access to research and development sections
          relevantSectionIds = [
            'ai-model-validation-testing',
            'model-optimization-performance-tuning',
            'bias-detection-fairness',
            'model-explainability-interpretability',
            'model-robustness-adversarial-testing',
            'ai-ethics-responsible-ai',
            'data-observability-monitoring',
            'data-quality-assurance-validation'
          ];
        } else if (persona.id === 'admin') {
          // System Administrator should have access to all sections
          relevantSectionIds = sections.map(s => s.id);
        }
        
        // Create mappings for each sub-persona and relevant sections
        for (const subPersona of persona.subPersonas) {
          for (const sectionId of relevantSectionIds) {
            const section = sections.find(s => s.id === sectionId);
            if (section) {
              await prisma.personaSectionMapping.upsert({
                where: {
                  personaId_subPersonaId_sectionId: {
                    personaId: persona.id,
                    subPersonaId: subPersona.id,
                    sectionId: sectionId,
                  },
                },
                update: {},
                create: {
                  personaId: persona.id,
                  subPersonaId: subPersona.id,
                  sectionId: sectionId,
                  accessLevel: 'read_write',
                  responsibilityType: 'contributor',
                  canEdit: true,
                  canApprove: false,
                  canReview: true,
                  isRequired: true,
                  priorityScore: 5,
                },
              });
              mappingsCreated++;
            }
          }
        }
      } else {
        console.log(`Persona ${persona.name} already has ${existingMappings.length} mappings`);
      }
    }
    
    console.log('✅ Missing persona mappings seeding completed!');
    console.log(`   • ${mappingsCreated} new persona-section mappings created`);
    
  } catch (error) {
    console.error('❌ Error seeding missing persona mappings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedMissingPersonaMappings()
  .then(() => {
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });
