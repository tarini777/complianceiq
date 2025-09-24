/**
 * Move Hardcoded Sections to Database
 * This script moves all hardcoded section references from APIs to the database
 * for better maintainability and consistency.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedHardcodedSections() {
  console.log('🌱 Moving hardcoded sections to database...');

  try {
    // 1. Update sections with category and criticality information
    await updateSectionsWithCategories();
    
    console.log('✅ All hardcoded sections moved to database successfully!');

  } catch (error) {
    console.error('❌ Error moving hardcoded sections:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function updateSectionsWithCategories() {
  console.log('📋 Updating sections with categories and criticality...');
  
  // Define section categories and criticality
  const sectionCategories = {
    'data-observability-monitoring': { category: 'critical', priority: 'high' },
    'data-governance': { category: 'critical', priority: 'high' },
    'data-quality-assurance-validation': { category: 'high', priority: 'medium' },
    'ai-model-validation': { category: 'critical', priority: 'high' },
    'data-lineage-provenance-tracking': { category: 'high', priority: 'medium' },
    'fda-ai-governance': { category: 'critical', priority: 'high' },
    'data-security-privacy-protection': { category: 'critical', priority: 'high' },
    'model-deployment': { category: 'high', priority: 'medium' },
    'risk-management': { category: 'critical', priority: 'high' },
    'data-retention-lifecycle-management': { category: 'medium', priority: 'low' },
    'ai-model-validation-testing': { category: 'critical', priority: 'high' },
    'model-performance-monitoring': { category: 'high', priority: 'medium' },
    'model-deployment-versioning': { category: 'high', priority: 'medium' },
    'model-lifecycle-management': { category: 'medium', priority: 'low' },
    'bias-detection-fairness': { category: 'high', priority: 'medium' },
    'model-explainability-interpretability': { category: 'high', priority: 'medium' },
    'model-robustness-adversarial-testing': { category: 'medium', priority: 'low' },
    'model-optimization-performance-tuning': { category: 'medium', priority: 'low' },
    'fda-ai-governance-2025-compliance': { category: 'critical', priority: 'high' },
    'regulatory-documentation-reporting': { category: 'medium', priority: 'low' },
    'clinical-validation-evidence-generation': { category: 'high', priority: 'medium' },
    'post-market-surveillance-monitoring': { category: 'medium', priority: 'low' },
    'regulatory-change-management': { category: 'medium', priority: 'low' },
    'international-regulatory-compliance': { category: 'medium', priority: 'low' },
    'ai-risk-management-mitigation': { category: 'critical', priority: 'high' },
    'ai-incident-response-recovery': { category: 'medium', priority: 'low' },
    'ai-business-continuity-planning': { category: 'medium', priority: 'low' },
    'ai-governance-framework': { category: 'critical', priority: 'high' },
    'ai-ethics-responsible-ai': { category: 'high', priority: 'medium' },
    'stakeholder-engagement-communication': { category: 'low', priority: 'low' }
  };

  let sectionsUpdated = 0;

  for (const [sectionId, categoryInfo] of Object.entries(sectionCategories)) {
    // Update section with category information
    await prisma.assessmentSection.updateMany({
      where: { id: sectionId },
      data: {
        // Store category info in the learningComponentsJson field
        learningComponentsJson: JSON.stringify({
          category: categoryInfo.category,
          priority: categoryInfo.priority,
          isCritical: categoryInfo.category === 'critical',
          remediationPriority: categoryInfo.priority
        })
      }
    });
    
    sectionsUpdated++;
  }

  console.log(`✅ Updated ${sectionsUpdated} sections with categories`);
}

// Note: Section filtering rules and scoring rules will be added in future schema updates

// Run the seed function
seedHardcodedSections()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
