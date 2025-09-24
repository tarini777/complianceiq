const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding complete ComplianceIQ database...');

  try {
    // 1. Create Personas
    console.log('👥 Creating personas...');
    const personas = [
      {
        id: 'executive',
        name: 'Executive Leadership',
        description: 'Strategic compliance oversight and decision-making',
        subPersonas: [
          { id: 'chief-executive-officer', name: 'Chief Executive Officer', description: 'Overall strategic oversight', expertiseLevel: 'executive' },
          { id: 'chief-medical-officer', name: 'Chief Medical Officer', description: 'Medical and clinical oversight', expertiseLevel: 'expert' },
          { id: 'chief-technology-officer', name: 'Chief Technology Officer', description: 'Technology strategy and implementation', expertiseLevel: 'expert' }
        ]
      },
      {
        id: 'data-science',
        name: 'Data Science & AI Team',
        description: 'Technical implementation and AI model development',
        subPersonas: [
          { id: 'data-scientist', name: 'Data Scientist', description: 'AI model development and validation', expertiseLevel: 'expert' },
          { id: 'ml-engineer', name: 'ML Engineer', description: 'Machine learning infrastructure', expertiseLevel: 'expert' },
          { id: 'data-engineer', name: 'Data Engineer', description: 'Data pipeline and infrastructure', expertiseLevel: 'expert' }
        ]
      },
      {
        id: 'regulatory',
        name: 'Regulatory Affairs',
        description: 'Regulatory compliance expertise',
        subPersonas: [
          { id: 'regulatory-affairs-manager', name: 'Regulatory Affairs Manager', description: 'Regulatory strategy and submissions', expertiseLevel: 'expert' },
          { id: 'compliance-officer', name: 'Compliance Officer', description: 'Compliance monitoring and reporting', expertiseLevel: 'expert' }
        ]
      },
      {
        id: 'quality',
        name: 'Quality Assurance',
        description: 'Quality management systems',
        subPersonas: [
          { id: 'qa-manager', name: 'QA Manager', description: 'Quality system oversight', expertiseLevel: 'expert' },
          { id: 'validation-specialist', name: 'Validation Specialist', description: 'Process and system validation', expertiseLevel: 'expert' }
        ]
      },
      {
        id: 'legal',
        name: 'Legal & Compliance',
        description: 'Legal framework compliance',
        subPersonas: [
          { id: 'legal-counsel', name: 'Legal Counsel', description: 'Legal compliance and risk management', expertiseLevel: 'expert' },
          { id: 'privacy-officer', name: 'Privacy Officer', description: 'Data privacy and protection', expertiseLevel: 'expert' }
        ]
      }
    ];

    for (const persona of personas) {
      const createdPersona = await prisma.persona.upsert({
        where: { id: persona.id },
        update: {},
        create: {
          id: persona.id,
          name: persona.name,
          description: persona.description
        }
      });

      // Create sub-personas
      for (const subPersona of persona.subPersonas) {
        await prisma.subPersona.upsert({
          where: { id: subPersona.id },
          update: {},
          create: {
            id: subPersona.id,
            name: subPersona.name,
            description: subPersona.description,
            expertiseLevel: subPersona.expertiseLevel,
            personaId: createdPersona.id
          }
        });
      }
    }

    // 2. Create Therapeutic Areas
    console.log('🏥 Creating therapeutic areas...');
    const therapeuticAreas = [
      { id: 'oncology', name: 'Oncology', complexityPoints: 15 },
      { id: 'infectious-disease', name: 'Infectious Disease', complexityPoints: 10 },
      { id: 'immunology', name: 'Immunology', complexityPoints: 14 },
      { id: 'rare-disease', name: 'Rare Disease', complexityPoints: 20 },
      { id: 'cardiovascular', name: 'Cardiovascular', complexityPoints: 12 },
      { id: 'neurology', name: 'Neurology', complexityPoints: 18 },
      { id: 'dermatology', name: 'Dermatology', complexityPoints: 8 },
      { id: 'gastroenterology', name: 'Gastroenterology', complexityPoints: 11 }
    ];

    for (const area of therapeuticAreas) {
      await prisma.therapeuticArea.upsert({
        where: { id: area.id },
        update: {},
        create: area
      });
    }

    // 3. Create AI Model Types
    console.log('🤖 Creating AI model types...');
    const aiModelTypes = [
      { id: 'clinical-decision-support', name: 'Clinical Decision Support', complexityPoints: 15 },
      { id: 'drug-discovery', name: 'Drug Discovery AI', complexityPoints: 20 },
      { id: 'manufacturing-process', name: 'Manufacturing Process AI', complexityPoints: 12 },
      { id: 'patient-monitoring', name: 'Patient Monitoring AI', complexityPoints: 18 },
      { id: 'regulatory-compliance', name: 'Regulatory Compliance AI', complexityPoints: 16 },
      { id: 'quality-control', name: 'Quality Control AI', complexityPoints: 14 },
      { id: 'predictive-analytics', name: 'Predictive Analytics', complexityPoints: 13 },
      { id: 'natural-language-processing', name: 'Natural Language Processing', complexityPoints: 17 }
    ];

    for (const modelType of aiModelTypes) {
      await prisma.aIModelType.upsert({
        where: { id: modelType.id },
        update: {},
        create: modelType
      });
    }

    // 4. Create Deployment Scenarios
    console.log('🚀 Creating deployment scenarios...');
    const deploymentScenarios = [
      { id: 'clinical-research', name: 'Clinical Research Environment', description: 'AI deployment in clinical research settings' },
      { id: 'manufacturing-facility', name: 'Manufacturing Facility', description: 'AI deployment in manufacturing environments' },
      { id: 'healthcare-provider', name: 'Healthcare Provider System', description: 'AI deployment in healthcare provider systems' },
      { id: 'regulatory-submission', name: 'Regulatory Submission Platform', description: 'AI for regulatory submission processes' },
      { id: 'post-market-surveillance', name: 'Post-Market Surveillance System', description: 'AI for post-market monitoring' },
      { id: 'research-laboratory', name: 'Research Laboratory', description: 'AI deployment in research laboratory settings' },
      { id: 'cloud-platform', name: 'Cloud Platform', description: 'AI deployment on cloud platforms' },
      { id: 'edge-device', name: 'Edge Device', description: 'AI deployment on edge devices' }
    ];

    for (const scenario of deploymentScenarios) {
      await prisma.deploymentScenario.upsert({
        where: { id: scenario.id },
        update: {},
        create: scenario
      });
    }

    // 5. Create Sections
    console.log('📋 Creating assessment sections...');
    const sections = [
      {
        id: 'data-governance',
        name: 'Data Governance Framework',
        description: 'Comprehensive data governance policies and procedures',
        category: 'Data Management',
        weight: 15
      },
      {
        id: 'ai-model-validation',
        name: 'AI Model Validation & Testing',
        description: 'AI model validation, testing, and performance monitoring',
        category: 'AI Model Management',
        weight: 20
      },
      {
        id: 'fda-ai-governance',
        name: 'FDA AI Governance 2025 Compliance',
        description: 'Compliance with FDA AI Governance Framework 2025',
        category: 'Regulatory Compliance',
        weight: 25
      },
      {
        id: 'data-quality',
        name: 'Data Quality Assurance & Validation',
        description: 'Data quality standards and validation processes',
        category: 'Data Management',
        weight: 18
      },
      {
        id: 'model-deployment',
        name: 'Model Deployment & Versioning',
        description: 'AI model deployment strategies and version control',
        category: 'AI Model Management',
        weight: 16
      },
      {
        id: 'risk-management',
        name: 'AI Risk Management & Mitigation',
        description: 'AI risk assessment and mitigation strategies',
        category: 'Risk Management',
        weight: 22
      },
      {
        id: 'regulatory-documentation',
        name: 'Regulatory Documentation & Reporting',
        description: 'Regulatory documentation and reporting requirements',
        category: 'Regulatory Compliance',
        weight: 19
      },
      {
        id: 'clinical-validation',
        name: 'Clinical Validation & Evidence Generation',
        description: 'Clinical validation processes and evidence generation',
        category: 'Regulatory Compliance',
        weight: 21
      }
    ];

    for (const section of sections) {
      await prisma.section.upsert({
        where: { id: section.id },
        update: {},
        create: section
      });
    }

    // 6. Create Sample Questions
    console.log('❓ Creating sample questions...');
    const questions = [
      {
        id: 'data-governance-1',
        text: 'Do you have a comprehensive data governance framework that defines roles, responsibilities, and processes for data management?',
        sectionId: 'data-governance',
        type: 'multiple-choice',
        options: ['Yes, fully implemented', 'Partially implemented', 'In development', 'No'],
        weight: 5
      },
      {
        id: 'ai-model-validation-1',
        text: 'Do you have established procedures for AI model validation, including performance testing and bias assessment?',
        sectionId: 'ai-model-validation',
        type: 'multiple-choice',
        options: ['Yes, comprehensive procedures', 'Basic procedures in place', 'Procedures under development', 'No procedures'],
        weight: 8
      },
      {
        id: 'fda-compliance-1',
        text: 'Are you familiar with the FDA AI Governance Framework 2025 requirements and have you assessed your current compliance status?',
        sectionId: 'fda-ai-governance',
        type: 'multiple-choice',
        options: ['Fully compliant', 'Mostly compliant', 'Partially compliant', 'Not compliant'],
        weight: 10
      },
      {
        id: 'data-quality-1',
        text: 'Do you have automated data quality monitoring and validation processes in place?',
        sectionId: 'data-quality',
        type: 'multiple-choice',
        options: ['Yes, fully automated', 'Partially automated', 'Manual processes', 'No processes'],
        weight: 6
      },
      {
        id: 'model-deployment-1',
        text: 'Do you have a formal AI model deployment and versioning strategy with rollback capabilities?',
        sectionId: 'model-deployment',
        type: 'multiple-choice',
        options: ['Yes, comprehensive strategy', 'Basic strategy in place', 'Strategy under development', 'No strategy'],
        weight: 7
      }
    ];

    for (const question of questions) {
      await prisma.question.upsert({
        where: { id: question.id },
        update: {},
        create: question
      });
    }

    // 7. Create Sample Assessments
    console.log('📊 Creating sample assessments...');
    const assessments = [
      {
        id: 'assessment-1',
        companyId: 'gilead-sciences',
        companyName: 'Gilead Sciences',
        personaId: 'executive',
        subPersonaId: 'chief-medical-officer',
        therapeuticAreaId: 'oncology',
        status: 'completed',
        score: 78,
        totalQuestions: 25,
        completedQuestions: 25,
        createdAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-15')
      },
      {
        id: 'assessment-2',
        companyId: 'pfizer',
        companyName: 'Pfizer',
        personaId: 'data-science',
        subPersonaId: 'data-scientist',
        therapeuticAreaId: 'infectious-disease',
        status: 'in-progress',
        score: 65,
        totalQuestions: 30,
        completedQuestions: 20,
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'assessment-3',
        companyId: 'moderna',
        companyName: 'Moderna',
        personaId: 'regulatory',
        subPersonaId: 'regulatory-affairs-manager',
        therapeuticAreaId: 'immunology',
        status: 'completed',
        score: 85,
        totalQuestions: 28,
        completedQuestions: 28,
        createdAt: new Date('2024-01-18'),
        completedAt: new Date('2024-01-18')
      }
    ];

    for (const assessment of assessments) {
      await prisma.assessment.upsert({
        where: { id: assessment.id },
        update: {},
        create: assessment
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • ${personas.length} personas created`);
    console.log(`   • ${therapeuticAreas.length} therapeutic areas created`);
    console.log(`   • ${aiModelTypes.length} AI model types created`);
    console.log(`   • ${deploymentScenarios.length} deployment scenarios created`);
    console.log(`   • ${sections.length} sections created`);
    console.log(`   • ${questions.length} questions created`);
    console.log(`   • ${assessments.length} sample assessments created`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
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
