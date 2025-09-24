const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding complete assessment sections (30 sections)...');

  try {
    const sections = [
      // Data Management Sections
      {
        id: 'data-observability-monitoring',
        title: 'Data Observability & Monitoring',
        sectionNumber: 1,
        basePoints: 15,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },
      {
        id: 'data-quality-assurance-validation',
        title: 'Data Quality Assurance & Validation',
        sectionNumber: 2,
        basePoints: 18,
        isCriticalBlocker: true,
        sectionType: 'standard'
      },
      {
        id: 'data-lineage-provenance-tracking',
        title: 'Data Lineage & Provenance Tracking',
        sectionNumber: 3,
        basePoints: 12,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },
      {
        id: 'data-governance-framework',
        title: 'Data Governance Framework',
        sectionNumber: 4,
        basePoints: 20,
        isCriticalBlocker: true,
        sectionType: 'standard'
      },
      {
        id: 'data-security-privacy-protection',
        title: 'Data Security & Privacy Protection',
        sectionNumber: 5,
        basePoints: 22,
        isCriticalBlocker: true,
        sectionType: 'safety'
      },
      {
        id: 'data-retention-lifecycle-management',
        title: 'Data Retention & Lifecycle Management',
        sectionNumber: 6,
        basePoints: 14,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },

      // AI Model Management Sections
      {
        id: 'ai-model-validation-testing',
        title: 'AI Model Validation & Testing',
        sectionNumber: 7,
        basePoints: 25,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'model-performance-monitoring',
        title: 'Model Performance Monitoring',
        sectionNumber: 8,
        basePoints: 16,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },
      {
        id: 'model-deployment-versioning',
        title: 'Model Deployment & Versioning',
        sectionNumber: 9,
        basePoints: 18,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },
      {
        id: 'model-lifecycle-management',
        title: 'Model Lifecycle Management',
        sectionNumber: 10,
        basePoints: 15,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },
      {
        id: 'bias-detection-fairness',
        title: 'Bias Detection & Fairness',
        sectionNumber: 11,
        basePoints: 20,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'model-explainability-interpretability',
        title: 'Model Explainability & Interpretability',
        sectionNumber: 12,
        basePoints: 17,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'model-robustness-adversarial-testing',
        title: 'Model Robustness & Adversarial Testing',
        sectionNumber: 13,
        basePoints: 19,
        isCriticalBlocker: true,
        sectionType: 'safety'
      },
      {
        id: 'model-optimization-performance-tuning',
        title: 'Model Optimization & Performance Tuning',
        sectionNumber: 14,
        basePoints: 13,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },

      // Regulatory Compliance Sections
      {
        id: 'fda-ai-governance-2025-compliance',
        title: 'FDA AI Governance 2025 Compliance',
        sectionNumber: 15,
        basePoints: 30,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'regulatory-documentation-reporting',
        title: 'Regulatory Documentation & Reporting',
        sectionNumber: 16,
        basePoints: 16,
        isCriticalBlocker: false,
        sectionType: 'regulatory'
      },
      {
        id: 'clinical-validation-evidence-generation',
        title: 'Clinical Validation & Evidence Generation',
        sectionNumber: 17,
        basePoints: 24,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'post-market-surveillance-monitoring',
        title: 'Post-Market Surveillance & Monitoring',
        sectionNumber: 18,
        basePoints: 18,
        isCriticalBlocker: false,
        sectionType: 'regulatory'
      },
      {
        id: 'regulatory-change-management',
        title: 'Regulatory Change Management',
        sectionNumber: 19,
        basePoints: 14,
        isCriticalBlocker: false,
        sectionType: 'regulatory'
      },
      {
        id: 'international-regulatory-compliance',
        title: 'International Regulatory Compliance',
        sectionNumber: 20,
        basePoints: 21,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },

      // Risk Management Sections
      {
        id: 'ai-risk-management-mitigation',
        title: 'AI Risk Management & Mitigation',
        sectionNumber: 21,
        basePoints: 26,
        isCriticalBlocker: true,
        sectionType: 'safety'
      },
      {
        id: 'ai-incident-response-recovery',
        title: 'AI Incident Response & Recovery',
        sectionNumber: 22,
        basePoints: 20,
        isCriticalBlocker: true,
        sectionType: 'safety'
      },
      {
        id: 'ai-business-continuity-planning',
        title: 'AI Business Continuity Planning',
        sectionNumber: 23,
        basePoints: 15,
        isCriticalBlocker: false,
        sectionType: 'standard'
      },

      // Governance & Ethics Sections
      {
        id: 'ai-governance-framework',
        title: 'AI Governance Framework',
        sectionNumber: 24,
        basePoints: 22,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'ai-ethics-responsible-ai',
        title: 'AI Ethics & Responsible AI',
        sectionNumber: 25,
        basePoints: 19,
        isCriticalBlocker: true,
        sectionType: 'regulatory'
      },
      {
        id: 'stakeholder-engagement-communication',
        title: 'Stakeholder Engagement & Communication',
        sectionNumber: 26,
        basePoints: 12,
        isCriticalBlocker: false,
        sectionType: 'standard'
      }
    ];

    for (const section of sections) {
      await prisma.assessmentSection.upsert({
        where: { id: section.id },
        update: {},
        create: section
      });
    }

    console.log('✅ Complete assessment sections seeding completed!');
    console.log(`   • ${sections.length} comprehensive sections created`);
    console.log('');
    console.log('📊 Section Categories:');
    console.log('   • Data Management: 6 sections');
    console.log('   • AI Model Management: 8 sections');
    console.log('   • Regulatory Compliance: 6 sections');
    console.log('   • Risk Management: 3 sections');
    console.log('   • Governance & Ethics: 3 sections');
    console.log('');
    console.log('🎯 Critical Blocker Sections (Production Blockers):');
    console.log('   • Data Quality Assurance & Validation');
    console.log('   • Data Governance Framework');
    console.log('   • Data Security & Privacy Protection');
    console.log('   • AI Model Validation & Testing');
    console.log('   • Bias Detection & Fairness');
    console.log('   • Model Explainability & Interpretability');
    console.log('   • Model Robustness & Adversarial Testing');
    console.log('   • FDA AI Governance 2025 Compliance');
    console.log('   • Clinical Validation & Evidence Generation');
    console.log('   • International Regulatory Compliance');
    console.log('   • AI Risk Management & Mitigation');
    console.log('   • AI Incident Response & Recovery');
    console.log('   • AI Governance Framework');
    console.log('   • AI Ethics & Responsible AI');

  } catch (error) {
    console.error('❌ Error seeding complete sections:', error);
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
