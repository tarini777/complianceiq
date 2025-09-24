const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding assessment sections and questions...');

  try {
    // 1. Create Assessment Sections
    console.log('📋 Creating assessment sections...');
    const sections = [
      {
        id: 'data-governance',
        name: 'Data Governance Framework',
        title: 'Data Governance Framework',
        description: 'Comprehensive data governance policies and procedures for pharmaceutical AI systems',
        category: 'Data Management',
        weight: 15,
        sectionNumber: 1,
        basePoints: 15
      },
      {
        id: 'ai-model-validation',
        name: 'AI Model Validation & Testing',
        title: 'AI Model Validation & Testing',
        description: 'AI model validation, testing, and performance monitoring protocols',
        category: 'AI Model Management',
        weight: 20,
        sectionNumber: 2,
        basePoints: 20
      },
      {
        id: 'fda-ai-governance',
        name: 'FDA AI Governance 2025 Compliance',
        title: 'FDA AI Governance 2025 Compliance',
        description: 'Compliance with FDA AI Governance Framework 2025 requirements',
        category: 'Regulatory Compliance',
        weight: 25,
        sectionNumber: 3
      },
      {
        id: 'data-quality',
        name: 'Data Quality Assurance & Validation',
        title: 'Data Quality Assurance & Validation',
        description: 'Data quality standards and validation processes for AI systems',
        category: 'Data Management',
        weight: 18,
        sectionNumber: 4
      },
      {
        id: 'model-deployment',
        name: 'Model Deployment & Versioning',
        title: 'Model Deployment & Versioning',
        description: 'AI model deployment strategies and version control systems',
        category: 'AI Model Management',
        weight: 16,
        sectionNumber: 5
      },
      {
        id: 'risk-management',
        name: 'AI Risk Management & Mitigation',
        title: 'AI Risk Management & Mitigation',
        description: 'AI risk assessment and mitigation strategies',
        category: 'Risk Management',
        weight: 22,
        sectionNumber: 6
      },
      {
        id: 'regulatory-documentation',
        name: 'Regulatory Documentation & Reporting',
        title: 'Regulatory Documentation & Reporting',
        description: 'Regulatory documentation and reporting requirements',
        category: 'Regulatory Compliance',
        weight: 19,
        sectionNumber: 7
      },
      {
        id: 'clinical-validation',
        name: 'Clinical Validation & Evidence Generation',
        title: 'Clinical Validation & Evidence Generation',
        description: 'Clinical validation processes and evidence generation for AI models',
        category: 'Regulatory Compliance',
        weight: 21,
        sectionNumber: 8
      },
      {
        id: 'data-security',
        name: 'Data Security & Privacy Protection',
        title: 'Data Security & Privacy Protection',
        description: 'Data security and privacy protection measures for AI systems',
        category: 'Data Management',
        weight: 17,
        sectionNumber: 9
      },
      {
        id: 'model-monitoring',
        name: 'Model Performance Monitoring',
        title: 'Model Performance Monitoring',
        description: 'Continuous monitoring of AI model performance and drift detection',
        category: 'AI Model Management',
        weight: 14,
        sectionNumber: 10
      },
      {
        id: 'bias-detection',
        name: 'Bias Detection & Fairness',
        title: 'Bias Detection & Fairness',
        description: 'AI bias detection and fairness assessment protocols',
        category: 'AI Model Management',
        weight: 16,
        sectionNumber: 11
      },
      {
        id: 'model-explainability',
        name: 'Model Explainability & Interpretability',
        title: 'Model Explainability & Interpretability',
        description: 'AI model explainability and interpretability requirements',
        category: 'AI Model Management',
        weight: 15,
        sectionNumber: 12
      },
      {
        id: 'incident-response',
        name: 'AI Incident Response & Recovery',
        title: 'AI Incident Response & Recovery',
        description: 'AI incident response and recovery procedures',
        category: 'Risk Management',
        weight: 18,
        sectionNumber: 13
      },
      {
        id: 'stakeholder-engagement',
        name: 'Stakeholder Engagement & Communication',
        title: 'Stakeholder Engagement & Communication',
        description: 'Stakeholder engagement and communication strategies for AI initiatives',
        category: 'Governance & Ethics',
        weight: 12,
        sectionNumber: 14
      },
      {
        id: 'ai-ethics',
        name: 'AI Ethics & Responsible AI',
        title: 'AI Ethics & Responsible AI',
        description: 'AI ethics and responsible AI practices and governance',
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

    // 2. Create Questions for Each Section
    console.log('❓ Creating assessment questions...');
    
    const questions = [
      // Data Governance Questions
      {
        id: 'data-governance-1',
        text: 'Do you have a comprehensive data governance framework that defines roles, responsibilities, and processes for pharmaceutical AI data management?',
        sectionId: 'data-governance',
        type: 'multiple-choice',
        options: ['Yes, fully implemented with documented procedures', 'Partially implemented with basic procedures', 'In development with draft procedures', 'No formal framework exists'],
        weight: 5,
        questionNumber: 1
      },
      {
        id: 'data-governance-2',
        text: 'Are data ownership and stewardship roles clearly defined for all AI-related data assets in your organization?',
        sectionId: 'data-governance',
        type: 'multiple-choice',
        options: ['Yes, clearly defined with assigned stewards', 'Partially defined with some gaps', 'Basic definitions exist', 'No clear ownership defined'],
        weight: 4,
        questionNumber: 2
      },
      {
        id: 'data-governance-3',
        text: 'Do you have established data classification and handling procedures for sensitive pharmaceutical data used in AI models?',
        sectionId: 'data-governance',
        type: 'multiple-choice',
        options: ['Yes, comprehensive classification system', 'Basic classification in place', 'Limited classification procedures', 'No formal classification system'],
        weight: 5,
        questionNumber: 3
      },

      // AI Model Validation Questions
      {
        id: 'ai-model-validation-1',
        text: 'Do you have established procedures for AI model validation, including performance testing, bias assessment, and clinical validation?',
        sectionId: 'ai-model-validation',
        type: 'multiple-choice',
        options: ['Yes, comprehensive validation procedures', 'Basic validation procedures in place', 'Procedures under development', 'No formal validation procedures'],
        weight: 8,
        questionNumber: 1
      },
      {
        id: 'ai-model-validation-2',
        text: 'Are your AI models validated using appropriate datasets that represent the target patient population and clinical scenarios?',
        sectionId: 'ai-model-validation',
        type: 'multiple-choice',
        options: ['Yes, validated with diverse representative datasets', 'Basic validation with limited datasets', 'Validation in progress', 'No formal dataset validation'],
        weight: 7,
        questionNumber: 2
      },
      {
        id: 'ai-model-validation-3',
        text: 'Do you conduct bias testing and fairness assessment for AI models used in clinical decision-making?',
        sectionId: 'ai-model-validation',
        type: 'multiple-choice',
        options: ['Yes, comprehensive bias testing protocols', 'Basic bias testing procedures', 'Limited bias assessment', 'No bias testing conducted'],
        weight: 6,
        questionNumber: 3
      },

      // FDA AI Governance Questions
      {
        id: 'fda-compliance-1',
        text: 'Are you familiar with the FDA AI Governance Framework 2025 requirements and have you assessed your current compliance status?',
        sectionId: 'fda-ai-governance',
        type: 'multiple-choice',
        options: ['Fully compliant with documented evidence', 'Mostly compliant with minor gaps', 'Partially compliant with significant gaps', 'Not compliant or not assessed'],
        weight: 10,
        questionNumber: 1
      },
      {
        id: 'fda-compliance-2',
        text: 'Do you have a documented AI governance framework that addresses FDA requirements for AI/ML in medical devices and drug development?',
        sectionId: 'fda-ai-governance',
        type: 'multiple-choice',
        options: ['Yes, comprehensive FDA-compliant framework', 'Basic framework with FDA considerations', 'Framework under development', 'No FDA-specific framework'],
        weight: 9,
        questionNumber: 2
      },
      {
        id: 'fda-compliance-3',
        text: 'Are your AI models designed with FDA Good Machine Learning Practice (GMLP) principles in mind?',
        sectionId: 'fda-ai-governance',
        type: 'multiple-choice',
        options: ['Yes, fully aligned with GMLP principles', 'Partially aligned with some GMLP elements', 'Basic alignment with GMLP', 'Not aligned with GMLP principles'],
        weight: 8,
        questionNumber: 3
      },

      // Data Quality Questions
      {
        id: 'data-quality-1',
        text: 'Do you have automated data quality monitoring and validation processes in place for AI model training and inference data?',
        sectionId: 'data-quality',
        type: 'multiple-choice',
        options: ['Yes, fully automated with real-time monitoring', 'Partially automated with scheduled checks', 'Manual processes with some automation', 'No automated quality processes'],
        weight: 6,
        questionNumber: 1
      },
      {
        id: 'data-quality-2',
        text: 'Are data quality metrics and thresholds defined for all critical data elements used in your AI models?',
        sectionId: 'data-quality',
        type: 'multiple-choice',
        options: ['Yes, comprehensive metrics for all data elements', 'Basic metrics for critical elements', 'Limited quality metrics defined', 'No formal quality metrics'],
        weight: 5,
        questionNumber: 2
      },
      {
        id: 'data-quality-3',
        text: 'Do you have procedures for handling missing, incomplete, or corrupted data in your AI model pipelines?',
        sectionId: 'data-quality',
        type: 'multiple-choice',
        options: ['Yes, comprehensive data handling procedures', 'Basic procedures for common issues', 'Limited procedures in place', 'No formal data handling procedures'],
        weight: 4,
        questionNumber: 3
      },

      // Model Deployment Questions
      {
        id: 'model-deployment-1',
        text: 'Do you have a formal AI model deployment and versioning strategy with rollback capabilities?',
        sectionId: 'model-deployment',
        type: 'multiple-choice',
        options: ['Yes, comprehensive strategy with automated rollback', 'Basic strategy with manual rollback', 'Strategy under development', 'No formal deployment strategy'],
        weight: 7,
        questionNumber: 1
      },
      {
        id: 'model-deployment-2',
        text: 'Are your AI models deployed using containerization and infrastructure-as-code practices?',
        sectionId: 'model-deployment',
        type: 'multiple-choice',
        options: ['Yes, fully containerized with IaC', 'Partially containerized', 'Basic containerization', 'No containerization or IaC'],
        weight: 6,
        questionNumber: 2
      },
      {
        id: 'model-deployment-3',
        text: 'Do you have A/B testing and gradual rollout capabilities for AI model deployments?',
        sectionId: 'model-deployment',
        type: 'multiple-choice',
        options: ['Yes, comprehensive A/B testing framework', 'Basic A/B testing capabilities', 'Limited testing capabilities', 'No A/B testing framework'],
        weight: 5,
        questionNumber: 3
      },

      // Risk Management Questions
      {
        id: 'risk-management-1',
        text: 'Do you have a comprehensive AI risk management framework that identifies, assesses, and mitigates AI-related risks?',
        sectionId: 'risk-management',
        type: 'multiple-choice',
        options: ['Yes, comprehensive framework with regular assessments', 'Basic framework with periodic assessments', 'Framework under development', 'No formal risk management framework'],
        weight: 9,
        questionNumber: 1
      },
      {
        id: 'risk-management-2',
        text: 'Are AI model failure modes and their potential impact on patient safety documented and monitored?',
        sectionId: 'risk-management',
        type: 'multiple-choice',
        options: ['Yes, comprehensive failure mode analysis', 'Basic failure mode documentation', 'Limited failure mode analysis', 'No formal failure mode analysis'],
        weight: 8,
        questionNumber: 2
      },
      {
        id: 'risk-management-3',
        text: 'Do you have incident response procedures specifically for AI model failures or unexpected behaviors?',
        sectionId: 'risk-management',
        type: 'multiple-choice',
        options: ['Yes, comprehensive AI-specific incident procedures', 'Basic incident procedures with AI considerations', 'General incident procedures', 'No formal incident procedures'],
        weight: 7,
        questionNumber: 3
      }
    ];

    for (const question of questions) {
      await prisma.question.upsert({
        where: { id: question.id },
        update: {},
        create: question
      });
    }

    // 3. Create Persona-Section Mappings
    console.log('👥 Creating persona-section mappings...');
    const personaSectionMappings = [
      // Executive Leadership mappings
      { personaId: 'executive', sectionId: 'fda-ai-governance', isRequired: true, weight: 10 },
      { personaId: 'executive', sectionId: 'risk-management', isRequired: true, weight: 9 },
      { personaId: 'executive', sectionId: 'stakeholder-engagement', isRequired: true, weight: 8 },
      { personaId: 'executive', sectionId: 'ai-ethics', isRequired: true, weight: 7 },
      { personaId: 'executive', sectionId: 'regulatory-documentation', isRequired: false, weight: 6 },

      // Data Science & AI Team mappings
      { personaId: 'data-science', sectionId: 'ai-model-validation', isRequired: true, weight: 10 },
      { personaId: 'data-science', sectionId: 'model-deployment', isRequired: true, weight: 9 },
      { personaId: 'data-science', sectionId: 'model-monitoring', isRequired: true, weight: 8 },
      { personaId: 'data-science', sectionId: 'bias-detection', isRequired: true, weight: 7 },
      { personaId: 'data-science', sectionId: 'model-explainability', isRequired: true, weight: 6 },
      { personaId: 'data-science', sectionId: 'data-governance', isRequired: false, weight: 5 },
      { personaId: 'data-science', sectionId: 'data-quality', isRequired: false, weight: 5 },

      // Regulatory Affairs mappings
      { personaId: 'regulatory', sectionId: 'fda-ai-governance', isRequired: true, weight: 10 },
      { personaId: 'regulatory', sectionId: 'regulatory-documentation', isRequired: true, weight: 9 },
      { personaId: 'regulatory', sectionId: 'clinical-validation', isRequired: true, weight: 8 },
      { personaId: 'regulatory', sectionId: 'risk-management', isRequired: false, weight: 6 },
      { personaId: 'regulatory', sectionId: 'ai-ethics', isRequired: false, weight: 5 },

      // Quality Assurance mappings
      { personaId: 'quality', sectionId: 'ai-model-validation', isRequired: true, weight: 10 },
      { personaId: 'quality', sectionId: 'data-quality', isRequired: true, weight: 9 },
      { personaId: 'quality', sectionId: 'model-monitoring', isRequired: true, weight: 8 },
      { personaId: 'quality', sectionId: 'incident-response', isRequired: true, weight: 7 },
      { personaId: 'quality', sectionId: 'data-governance', isRequired: false, weight: 6 },

      // Legal & Compliance mappings
      { personaId: 'legal', sectionId: 'fda-ai-governance', isRequired: true, weight: 10 },
      { personaId: 'legal', sectionId: 'ai-ethics', isRequired: true, weight: 9 },
      { personaId: 'legal', sectionId: 'data-security', isRequired: true, weight: 8 },
      { personaId: 'legal', sectionId: 'risk-management', isRequired: false, weight: 7 },
      { personaId: 'legal', sectionId: 'regulatory-documentation', isRequired: false, weight: 6 }
    ];

    for (const mapping of personaSectionMappings) {
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

    console.log('✅ Assessment sections and questions seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • ${sections.length} assessment sections created`);
    console.log(`   • ${questions.length} assessment questions created`);
    console.log(`   • ${personaSectionMappings.length} persona-section mappings created`);

  } catch (error) {
    console.error('❌ Error seeding sections and questions:', error);
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
