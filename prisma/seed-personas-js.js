const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding personas and sub-personas...');

  try {
    // Create main personas
    const personas = [
      {
        id: 'admin',
        name: 'System Administrator',
        description: 'Full system access and comprehensive assessment',
        isAdmin: true
      },
      {
        id: 'executive',
        name: 'Executive Leadership',
        description: 'Strategic oversight and decision making',
        isAdmin: false
      },
      {
        id: 'data-science',
        name: 'Data Science & AI Team',
        description: 'AI/ML model development and validation',
        isAdmin: false
      },
      {
        id: 'regulatory',
        name: 'Regulatory Affairs',
        description: 'Regulatory compliance and submissions',
        isAdmin: false
      },
      {
        id: 'quality',
        name: 'Quality Assurance & Risk',
        description: 'Quality systems and risk management',
        isAdmin: false
      },
      {
        id: 'legal',
        name: 'Legal & Compliance',
        description: 'Legal framework and compliance oversight',
        isAdmin: false
      },
      {
        id: 'clinical',
        name: 'Clinical Operations',
        description: 'Clinical trial compliance and operations',
        isAdmin: false
      },
      {
        id: 'it-security',
        name: 'IT & Security',
        description: 'Technical infrastructure and security compliance',
        isAdmin: false
      },
      {
        id: 'manufacturing',
        name: 'Manufacturing',
        description: 'Production compliance and quality standards',
        isAdmin: false
      },
      {
        id: 'research',
        name: 'Research & Development',
        description: 'R&D compliance protocols and standards',
        isAdmin: false
      }
    ];

    for (const persona of personas) {
      await prisma.persona.upsert({
        where: { id: persona.id },
        update: {},
        create: persona
      });
    }

    // Create sub-personas
    const subPersonas = [
      // Executive sub-personas
      {
        id: 'chief-executive-officer',
        personaId: 'executive',
        name: 'Chief Executive Officer',
        description: 'Overall strategic oversight and decision making',
        expertiseLevel: 'executive'
      },
      {
        id: 'chief-medical-officer',
        personaId: 'executive',
        name: 'Chief Medical Officer',
        description: 'Medical and clinical oversight',
        expertiseLevel: 'expert'
      },
      {
        id: 'chief-technology-officer',
        personaId: 'executive',
        name: 'Chief Technology Officer',
        description: 'Technology strategy and implementation',
        expertiseLevel: 'expert'
      },

      // Data Science sub-personas
      {
        id: 'data-scientist',
        personaId: 'data-science',
        name: 'Data Scientist',
        description: 'AI model development and validation',
        expertiseLevel: 'expert'
      },
      {
        id: 'ml-engineer',
        personaId: 'data-science',
        name: 'ML Engineer',
        description: 'Machine learning infrastructure and deployment',
        expertiseLevel: 'expert'
      },
      {
        id: 'data-engineer',
        personaId: 'data-science',
        name: 'Data Engineer',
        description: 'Data pipeline and infrastructure',
        expertiseLevel: 'expert'
      },

      // Regulatory sub-personas
      {
        id: 'regulatory-affairs-manager',
        personaId: 'regulatory',
        name: 'Regulatory Affairs Manager',
        description: 'Regulatory strategy and submissions',
        expertiseLevel: 'expert'
      },
      {
        id: 'compliance-officer',
        personaId: 'regulatory',
        name: 'Compliance Officer',
        description: 'Compliance monitoring and reporting',
        expertiseLevel: 'expert'
      },

      // Quality sub-personas
      {
        id: 'qa-manager',
        personaId: 'quality',
        name: 'QA Manager',
        description: 'Quality system oversight',
        expertiseLevel: 'expert'
      },
      {
        id: 'validation-specialist',
        personaId: 'quality',
        name: 'Validation Specialist',
        description: 'Process and system validation',
        expertiseLevel: 'expert'
      },

      // Legal sub-personas
      {
        id: 'legal-counsel',
        personaId: 'legal',
        name: 'Legal Counsel',
        description: 'Legal compliance and risk management',
        expertiseLevel: 'expert'
      },
      {
        id: 'privacy-officer',
        personaId: 'legal',
        name: 'Privacy Officer',
        description: 'Data privacy and protection',
        expertiseLevel: 'expert'
      }
    ];

    for (const subPersona of subPersonas) {
      await prisma.subPersona.upsert({
        where: { id: subPersona.id },
        update: {},
        create: subPersona
      });
    }

    console.log('✅ Personas and sub-personas seeding completed!');
    console.log(`   • ${personas.length} main personas created`);
    console.log(`   • ${subPersonas.length} sub-personas created`);
    console.log('');
    console.log('👥 Personas include:');
    console.log('   • Executive Leadership (CEO, CMO, CTO)');
    console.log('   • Data Science & AI Team (Data Scientist, ML Engineer, Data Engineer)');
    console.log('   • Regulatory Affairs (Regulatory Manager, Compliance Officer)');
    console.log('   • Quality Assurance (QA Manager, Validation Specialist)');
    console.log('   • Legal & Compliance (Legal Counsel, Privacy Officer)');
    console.log('   • Clinical Operations, IT & Security, Manufacturing, R&D');

  } catch (error) {
    console.error('❌ Error seeding personas:', error);
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
