const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample questions for key sections...');

  try {
    const questions = [
      // Data Observability & Monitoring
      {
        id: 'data-observability-1',
        questionText: 'Do you have real-time monitoring dashboards for data pipeline health and data quality metrics?',
        sectionId: 'data-observability-monitoring',
        questionType: 'multiple-choice',
        complexityPoints: 8,
        evidenceRequired: ['Monitoring dashboard screenshots', 'Data pipeline documentation'],
        responsibleRoles: ['Data Engineer', 'Data Steward']
      },
      // Data Quality Assurance & Validation
      {
        id: 'data-quality-1',
        questionText: 'Do you have automated data quality validation rules for all critical data elements used in AI models?',
        sectionId: 'data-quality-assurance-validation',
        questionType: 'multiple-choice',
        complexityPoints: 12,
        evidenceRequired: ['Data quality rules documentation', 'Validation test results'],
        responsibleRoles: ['Data Quality Manager', 'Data Steward']
      },
      // Data Governance Framework
      {
        id: 'data-governance-1',
        questionText: 'Do you have a comprehensive data governance framework with defined roles, responsibilities, and processes?',
        sectionId: 'data-governance-framework',
        questionType: 'multiple-choice',
        complexityPoints: 15,
        evidenceRequired: ['Data governance policy', 'Role definitions', 'Process documentation'],
        responsibleRoles: ['Data Steward', 'Privacy Officer']
      },
      // Data Security & Privacy Protection
      {
        id: 'data-security-1',
        questionText: 'Do you have encryption at rest and in transit for all sensitive data used in AI model training and inference?',
        sectionId: 'data-security-privacy-protection',
        questionType: 'multiple-choice',
        complexityPoints: 12,
        evidenceRequired: ['Encryption policies', 'Security audit reports'],
        responsibleRoles: ['Security Officer', 'Privacy Officer']
      },
      // AI Model Validation & Testing
      {
        id: 'ai-model-validation-1',
        questionText: 'Do you have comprehensive model validation procedures including performance testing, bias assessment, and clinical validation?',
        sectionId: 'ai-model-validation-testing',
        questionType: 'multiple-choice',
        complexityPoints: 18,
        evidenceRequired: ['Validation protocols', 'Test results', 'Clinical validation reports'],
        responsibleRoles: ['Data Scientist', 'QA Manager', 'Clinical Operations']
      },
      // Model Performance Monitoring
      {
        id: 'model-monitoring-1',
        questionText: 'Do you have continuous monitoring of AI model performance in production with automated alerting?',
        sectionId: 'model-performance-monitoring',
        questionType: 'multiple-choice',
        complexityPoints: 12,
        evidenceRequired: ['Monitoring setup documentation', 'Alert configuration'],
        responsibleRoles: ['ML Engineer', 'Data Scientist']
      },
      // Model Deployment & Versioning
      {
        id: 'model-deployment-1',
        questionText: 'Do you have a formal AI model deployment strategy with versioning and rollback capabilities?',
        sectionId: 'model-deployment-versioning',
        questionType: 'multiple-choice',
        complexityPoints: 14,
        evidenceRequired: ['Deployment strategy document', 'Versioning procedures'],
        responsibleRoles: ['ML Engineer', 'DevOps Engineer']
      },
      // Bias Detection & Fairness
      {
        id: 'bias-detection-1',
        questionText: 'Do you conduct bias testing and fairness assessment for AI models used in clinical decision-making?',
        sectionId: 'bias-detection-fairness',
        questionType: 'multiple-choice',
        complexityPoints: 16,
        evidenceRequired: ['Bias testing protocols', 'Fairness assessment reports'],
        responsibleRoles: ['Data Scientist', 'Ethics Officer']
      },
      // Model Explainability & Interpretability
      {
        id: 'model-explainability-1',
        questionText: 'Do your AI models provide interpretable explanations for their predictions and decisions?',
        sectionId: 'model-explainability-interpretability',
        questionType: 'multiple-choice',
        complexityPoints: 14,
        evidenceRequired: ['Explainability documentation', 'Interpretability tools'],
        responsibleRoles: ['Data Scientist', 'Clinical Operations']
      },
      // FDA AI Governance 2025 Compliance
      {
        id: 'fda-compliance-1',
        questionText: 'Are you familiar with the FDA AI Governance Framework 2025 requirements and have you assessed your compliance status?',
        sectionId: 'fda-ai-governance-2025-compliance',
        questionType: 'multiple-choice',
        complexityPoints: 20,
        evidenceRequired: ['FDA compliance assessment', 'Governance framework documentation'],
        responsibleRoles: ['Regulatory Affairs Manager', 'Compliance Officer']
      },
      // Clinical Validation & Evidence Generation
      {
        id: 'clinical-validation-1',
        questionText: 'Do you have clinical validation processes for AI models that impact patient care decisions?',
        sectionId: 'clinical-validation-evidence-generation',
        questionType: 'multiple-choice',
        complexityPoints: 16,
        evidenceRequired: ['Clinical validation protocols', 'Evidence generation procedures'],
        responsibleRoles: ['Clinical Operations', 'Medical Affairs']
      },
      // AI Risk Management & Mitigation
      {
        id: 'ai-risk-management-1',
        questionText: 'Do you have a comprehensive AI risk management framework that identifies, assesses, and mitigates AI-related risks?',
        sectionId: 'ai-risk-management-mitigation',
        questionType: 'multiple-choice',
        complexityPoints: 18,
        evidenceRequired: ['Risk management framework', 'Risk assessment reports'],
        responsibleRoles: ['Risk Manager', 'Compliance Officer']
      },
      // AI Ethics & Responsible AI
      {
        id: 'ai-ethics-1',
        questionText: 'Do you have established AI ethics guidelines and responsible AI practices for your organization?',
        sectionId: 'ai-ethics-responsible-ai',
        questionType: 'multiple-choice',
        complexityPoints: 12,
        evidenceRequired: ['AI ethics guidelines', 'Responsible AI framework'],
        responsibleRoles: ['Ethics Officer', 'Legal Counsel']
      }
    ];

    for (const question of questions) {
      await prisma.dynamicQuestion.upsert({
        where: { id: question.id },
        update: {},
        create: {
          id: question.id,
          questionText: question.questionText,
          sectionId: question.sectionId,
          questionType: question.questionType,
          complexityPoints: question.complexityPoints,
          evidenceRequired: question.evidenceRequired,
          responsibleRoles: question.responsibleRoles
        }
      });
    }

    console.log('✅ Sample questions seeding completed!');
    console.log(`   • ${questions.length} sample questions created`);
    console.log('');
    console.log('📊 This represents a sample of your 200+ questions across 30 sections!');

  } catch (error) {
    console.error('❌ Error seeding sample questions:', error);
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
