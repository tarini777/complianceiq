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
        description: 'Strategic compliance oversight and decision-making'
      },
      {
        id: 'data-science',
        name: 'Data Science & AI Team',
        description: 'Technical implementation and AI model development'
      },
      {
        id: 'regulatory',
        name: 'Regulatory Affairs',
        description: 'Regulatory compliance expertise'
      },
      {
        id: 'quality',
        name: 'Quality Assurance',
        description: 'Quality management systems'
      },
      {
        id: 'legal',
        name: 'Legal & Compliance',
        description: 'Legal framework compliance'
      },
      {
        id: 'clinical',
        name: 'Clinical Operations',
        description: 'Clinical trial compliance'
      },
      {
        id: 'it-security',
        name: 'IT & Security',
        description: 'Technical infrastructure compliance'
      },
      {
        id: 'manufacturing',
        name: 'Manufacturing',
        description: 'Production compliance standards'
      },
      {
        id: 'research',
        name: 'Research & Development',
        description: 'R&D compliance protocols'
      }
    ];

    for (const persona of personas) {
      await prisma.persona.upsert({
        where: { id: persona.id },
        update: {},
        create: persona
      });
    }

    // 2. Create Sub-Personas
    console.log('👤 Creating sub-personas...');
    const subPersonas = [
      { id: 'chief-executive-officer', name: 'Chief Executive Officer', description: 'Overall strategic oversight', expertiseLevel: 'executive', personaId: 'executive' },
      { id: 'chief-medical-officer', name: 'Chief Medical Officer', description: 'Medical and clinical oversight', expertiseLevel: 'expert', personaId: 'executive' },
      { id: 'chief-technology-officer', name: 'Chief Technology Officer', description: 'Technology strategy and implementation', expertiseLevel: 'expert', personaId: 'executive' },
      { id: 'data-scientist', name: 'Data Scientist', description: 'AI model development and validation', expertiseLevel: 'expert', personaId: 'data-science' },
      { id: 'ml-engineer', name: 'ML Engineer', description: 'Machine learning infrastructure', expertiseLevel: 'expert', personaId: 'data-science' },
      { id: 'data-engineer', name: 'Data Engineer', description: 'Data pipeline and infrastructure', expertiseLevel: 'expert', personaId: 'data-science' },
      { id: 'regulatory-affairs-manager', name: 'Regulatory Affairs Manager', description: 'Regulatory strategy and submissions', expertiseLevel: 'expert', personaId: 'regulatory' },
      { id: 'compliance-officer', name: 'Compliance Officer', description: 'Compliance monitoring and reporting', expertiseLevel: 'expert', personaId: 'regulatory' },
      { id: 'qa-manager', name: 'QA Manager', description: 'Quality system oversight', expertiseLevel: 'expert', personaId: 'quality' },
      { id: 'validation-specialist', name: 'Validation Specialist', description: 'Process and system validation', expertiseLevel: 'expert', personaId: 'quality' },
      { id: 'legal-counsel', name: 'Legal Counsel', description: 'Legal compliance and risk management', expertiseLevel: 'expert', personaId: 'legal' },
      { id: 'privacy-officer', name: 'Privacy Officer', description: 'Data privacy and protection', expertiseLevel: 'expert', personaId: 'legal' }
    ];

    for (const subPersona of subPersonas) {
      await prisma.subPersona.upsert({
        where: { id: subPersona.id },
        update: {},
        create: subPersona
      });
    }

    // 3. Create Therapeutic Areas
    console.log('🏥 Creating therapeutic areas...');
    const therapeuticAreas = [
      { id: 'oncology', name: 'Oncology', complexityPoints: 15 },
      { id: 'infectious-disease', name: 'Infectious Disease', complexityPoints: 10 },
      { id: 'immunology', name: 'Immunology', complexityPoints: 14 },
      { id: 'rare-disease', name: 'Rare Disease', complexityPoints: 20 },
      { id: 'cardiovascular', name: 'Cardiovascular', complexityPoints: 12 },
      { id: 'neurology', name: 'Neurology', complexityPoints: 18 },
      { id: 'dermatology', name: 'Dermatology', complexityPoints: 8 },
      { id: 'gastroenterology', name: 'Gastroenterology', complexityPoints: 11 },
      { id: 'respiratory', name: 'Respiratory', complexityPoints: 9 },
      { id: 'endocrinology', name: 'Endocrinology', complexityPoints: 13 },
      { id: 'hematology', name: 'Hematology', complexityPoints: 16 },
      { id: 'nephrology', name: 'Nephrology', complexityPoints: 14 },
      { id: 'rheumatology', name: 'Rheumatology', complexityPoints: 12 },
      { id: 'ophthalmology', name: 'Ophthalmology', complexityPoints: 10 },
      { id: 'psychiatry', name: 'Psychiatry', complexityPoints: 17 },
      { id: 'pediatrics', name: 'Pediatrics', complexityPoints: 19 },
      { id: 'geriatrics', name: 'Geriatrics', complexityPoints: 15 },
      { id: 'oncology-pediatric', name: 'Pediatric Oncology', complexityPoints: 22 },
      { id: 'rare-genetic', name: 'Rare Genetic Disorders', complexityPoints: 25 },
      { id: 'autoimmune', name: 'Autoimmune Diseases', complexityPoints: 16 },
      { id: 'metabolic', name: 'Metabolic Disorders', complexityPoints: 18 },
      { id: 'neuromuscular', name: 'Neuromuscular Disorders', complexityPoints: 20 },
      { id: 'infectious-emerging', name: 'Emerging Infectious Diseases', complexityPoints: 12 },
      { id: 'precision-medicine', name: 'Precision Medicine', complexityPoints: 21 }
    ];

    for (const area of therapeuticAreas) {
      await prisma.therapeuticArea.upsert({
        where: { id: area.id },
        update: {},
        create: area
      });
    }

    // 4. Create AI Model Types
    console.log('🤖 Creating AI model types...');
    const aiModelTypes = [
      { id: 'clinical-decision-support', name: 'Clinical Decision Support', complexityPoints: 15 },
      { id: 'drug-discovery', name: 'Drug Discovery AI', complexityPoints: 20 },
      { id: 'manufacturing-process', name: 'Manufacturing Process AI', complexityPoints: 12 },
      { id: 'patient-monitoring', name: 'Patient Monitoring AI', complexityPoints: 18 },
      { id: 'regulatory-compliance', name: 'Regulatory Compliance AI', complexityPoints: 16 },
      { id: 'quality-control', name: 'Quality Control AI', complexityPoints: 14 },
      { id: 'predictive-analytics', name: 'Predictive Analytics', complexityPoints: 13 },
      { id: 'natural-language-processing', name: 'Natural Language Processing', complexityPoints: 17 },
      { id: 'computer-vision', name: 'Computer Vision', complexityPoints: 19 },
      { id: 'recommendation-system', name: 'Recommendation System', complexityPoints: 11 },
      { id: 'anomaly-detection', name: 'Anomaly Detection', complexityPoints: 15 },
      { id: 'time-series-forecasting', name: 'Time Series Forecasting', complexityPoints: 16 },
      { id: 'genomic-analysis', name: 'Genomic Analysis AI', complexityPoints: 22 },
      { id: 'biomarker-discovery', name: 'Biomarker Discovery AI', complexityPoints: 21 }
    ];

    for (const modelType of aiModelTypes) {
      await prisma.aIModelType.upsert({
        where: { id: modelType.id },
        update: {},
        create: modelType
      });
    }

    // 5. Create Deployment Scenarios
    console.log('🚀 Creating deployment scenarios...');
    const deploymentScenarios = [
      { id: 'clinical-research', name: 'Clinical Research Environment', complexityPoints: 15 },
      { id: 'manufacturing-facility', name: 'Manufacturing Facility', complexityPoints: 12 },
      { id: 'healthcare-provider', name: 'Healthcare Provider System', complexityPoints: 18 },
      { id: 'regulatory-submission', name: 'Regulatory Submission Platform', complexityPoints: 20 },
      { id: 'post-market-surveillance', name: 'Post-Market Surveillance System', complexityPoints: 16 },
      { id: 'research-laboratory', name: 'Research Laboratory', complexityPoints: 14 },
      { id: 'cloud-platform', name: 'Cloud Platform', complexityPoints: 10 },
      { id: 'edge-device', name: 'Edge Device', complexityPoints: 17 },
      { id: 'hybrid-cloud', name: 'Hybrid Cloud', complexityPoints: 19 },
      { id: 'multi-site', name: 'Multi-Site Deployment', complexityPoints: 21 },
      { id: 'real-time-processing', name: 'Real-Time Processing', complexityPoints: 16 },
      { id: 'batch-processing', name: 'Batch Processing', complexityPoints: 11 },
      { id: 'mobile-application', name: 'Mobile Application', complexityPoints: 13 }
    ];

    for (const scenario of deploymentScenarios) {
      await prisma.deploymentScenario.upsert({
        where: { id: scenario.id },
        update: {},
        create: scenario
      });
    }

    // 6. Create Sections
    console.log('📋 Creating assessment sections...');
    const sections = [
      {
        id: 'data-governance',
        name: 'Data Governance Framework',
        title: 'Data Governance Framework',
        description: 'Comprehensive data governance policies and procedures',
        category: 'Data Management',
        weight: 15,
        sectionNumber: 1
      },
      {
        id: 'ai-model-validation',
        name: 'AI Model Validation & Testing',
        title: 'AI Model Validation & Testing',
        description: 'AI model validation, testing, and performance monitoring',
        category: 'AI Model Management',
        weight: 20,
        sectionNumber: 2
      },
      {
        id: 'fda-ai-governance',
        name: 'FDA AI Governance 2025 Compliance',
        description: 'Compliance with FDA AI Governance Framework 2025',
        category: 'Regulatory Compliance',
        weight: 25,
        sectionNumber: 3
      },
      {
        id: 'data-quality',
        name: 'Data Quality Assurance & Validation',
        description: 'Data quality standards and validation processes',
        category: 'Data Management',
        weight: 18,
        sectionNumber: 4
      },
      {
        id: 'model-deployment',
        name: 'Model Deployment & Versioning',
        description: 'AI model deployment strategies and version control',
        category: 'AI Model Management',
        weight: 16,
        sectionNumber: 5
      },
      {
        id: 'risk-management',
        name: 'AI Risk Management & Mitigation',
        description: 'AI risk assessment and mitigation strategies',
        category: 'Risk Management',
        weight: 22,
        sectionNumber: 6
      },
      {
        id: 'regulatory-documentation',
        name: 'Regulatory Documentation & Reporting',
        description: 'Regulatory documentation and reporting requirements',
        category: 'Regulatory Compliance',
        weight: 19,
        sectionNumber: 7
      },
      {
        id: 'clinical-validation',
        name: 'Clinical Validation & Evidence Generation',
        description: 'Clinical validation processes and evidence generation',
        category: 'Regulatory Compliance',
        weight: 21,
        sectionNumber: 8
      },
      {
        id: 'data-security',
        name: 'Data Security & Privacy Protection',
        description: 'Data security and privacy protection measures',
        category: 'Data Management',
        weight: 17,
        sectionNumber: 9
      },
      {
        id: 'model-monitoring',
        name: 'Model Performance Monitoring',
        description: 'Continuous monitoring of AI model performance',
        category: 'AI Model Management',
        weight: 14,
        sectionNumber: 10
      },
      {
        id: 'bias-detection',
        name: 'Bias Detection & Fairness',
        description: 'AI bias detection and fairness assessment',
        category: 'AI Model Management',
        weight: 16,
        sectionNumber: 11
      },
      {
        id: 'model-explainability',
        name: 'Model Explainability & Interpretability',
        description: 'AI model explainability and interpretability',
        category: 'AI Model Management',
        weight: 15,
        sectionNumber: 12
      },
      {
        id: 'incident-response',
        name: 'AI Incident Response & Recovery',
        description: 'AI incident response and recovery procedures',
        category: 'Risk Management',
        weight: 18,
        sectionNumber: 13
      },
      {
        id: 'stakeholder-engagement',
        name: 'Stakeholder Engagement & Communication',
        description: 'Stakeholder engagement and communication strategies',
        category: 'Governance & Ethics',
        weight: 12,
        sectionNumber: 14
      },
      {
        id: 'ai-ethics',
        name: 'AI Ethics & Responsible AI',
        description: 'AI ethics and responsible AI practices',
        category: 'Governance & Ethics',
        weight: 14,
        sectionNumber: 15
      }
    ];

    for (const section of sections) {
      await prisma.assessmentSection.upsert({
        where: { id: section.id },
        update: {},
        create: section
      });
    }

    // 7. Create Sample Questions
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
      },
      {
        id: 'risk-management-1',
        text: 'Do you have a comprehensive AI risk management framework that identifies, assesses, and mitigates AI-related risks?',
        sectionId: 'risk-management',
        type: 'multiple-choice',
        options: ['Yes, comprehensive framework', 'Basic framework in place', 'Framework under development', 'No framework'],
        weight: 9
      },
      {
        id: 'regulatory-documentation-1',
        text: 'Do you maintain comprehensive documentation for all AI models used in regulatory submissions?',
        sectionId: 'regulatory-documentation',
        type: 'multiple-choice',
        options: ['Yes, comprehensive documentation', 'Basic documentation', 'Documentation in progress', 'No documentation'],
        weight: 8
      },
      {
        id: 'clinical-validation-1',
        text: 'Do you have established processes for clinical validation of AI models used in patient care?',
        sectionId: 'clinical-validation',
        type: 'multiple-choice',
        options: ['Yes, established processes', 'Basic processes', 'Processes under development', 'No processes'],
        weight: 9
      }
    ];

    for (const question of questions) {
      await prisma.question.upsert({
        where: { id: question.id },
        update: {},
        create: question
      });
    }

    // 8. Create Sample Assessments
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
      },
      {
        id: 'assessment-4',
        companyId: 'johnson-johnson',
        companyName: 'Johnson & Johnson',
        personaId: 'quality',
        subPersonaId: 'qa-manager',
        therapeuticAreaId: 'cardiovascular',
        status: 'completed',
        score: 72,
        totalQuestions: 26,
        completedQuestions: 26,
        createdAt: new Date('2024-01-22'),
        completedAt: new Date('2024-01-22')
      },
      {
        id: 'assessment-5',
        companyId: 'merck',
        companyName: 'Merck',
        personaId: 'legal',
        subPersonaId: 'legal-counsel',
        therapeuticAreaId: 'neurology',
        status: 'in-progress',
        score: 58,
        totalQuestions: 32,
        completedQuestions: 18,
        createdAt: new Date('2024-01-25')
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
    console.log(`   • ${subPersonas.length} sub-personas created`);
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
