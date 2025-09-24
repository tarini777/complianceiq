const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Direct ICH E6 GCP question
const ichE6Question = {
  question: "What are the ICH E6 requirements for clinical trials?",
  variations: [
    "What are ICH E6 clinical trial requirements?",
    "ICH E6 Good Clinical Practice requirements",
    "What does ICH E6 require for clinical trials?",
    "ICH E6 GCP guidelines for clinical trials",
    "ICH E6 requirements for clinical studies",
    "What are the ICH E6 guidelines for clinical trials?",
    "Clinical trial requirements per ICH E6",
    "ICH E6 Good Clinical Practice guidelines"
  ],
  category: "regulatory",
  subcategory: "ich",
  answer: "ICH E6 (R2) Good Clinical Practice guidelines require: 1) Protocol compliance and approval by IRB/IEC, 2) Informed consent from all participants, 3) Qualified investigators with adequate resources, 4) Proper documentation and record keeping, 5) Quality assurance and quality control systems, 6) Safety reporting and adverse event management, 7) Data integrity and monitoring, 8) Regulatory compliance and audit readiness. Key focus areas include patient safety, data credibility, and regulatory compliance.",
  actionItems: [
    "Ensure IRB/IEC approval before study initiation",
    "Implement comprehensive informed consent process",
    "Establish qualified investigator oversight",
    "Set up robust documentation systems",
    "Create quality assurance protocols",
    "Implement safety monitoring procedures"
  ],
  impactLevel: "critical",
  sources: ["ICH E6 (R2) Good Clinical Practice", "FDA Guidance for Industry", "EMA Clinical Trials Regulation"],
  keywords: ["ich", "e6", "gcp", "good clinical practice", "clinical trials", "regulatory", "compliance", "protocol", "informed consent", "safety"],
  therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
  aiModelTypes: ["clinical decision support", "predictive analytics", "diagnostic ai"],
  deploymentScenarios: ["clinical trial", "research", "regulatory submission"],
  personas: ["clinical researcher", "regulatory affairs", "quality assurance", "data scientist"],
  tags: ["ich", "e6", "gcp", "clinical trials", "regulatory compliance"]
};

async function seedICH_E6Question() {
  try {
    console.log('🌱 Adding ICH E6 GCP question directly...');
    
    // Delete any existing ICH E6 questions to avoid duplicates
    await prisma.askRexiTrainingData.deleteMany({
      where: {
        question: { contains: 'ICH E6', mode: 'insensitive' }
      }
    });
    
    // Add the ICH E6 question
    await prisma.askRexiTrainingData.create({
      data: {
        question: ichE6Question.question,
        variations: ichE6Question.variations,
        category: ichE6Question.category,
        subcategory: ichE6Question.subcategory,
        answer: ichE6Question.answer,
        actionItems: ichE6Question.actionItems,
        impactLevel: ichE6Question.impactLevel,
        sources: ichE6Question.sources,
        keywords: ichE6Question.keywords,
        therapeuticAreas: ichE6Question.therapeuticAreas,
        aiModelTypes: ichE6Question.aiModelTypes,
        deploymentScenarios: ichE6Question.deploymentScenarios,
        personas: ichE6Question.personas,
        tags: ichE6Question.tags
      }
    });
    
    console.log('✅ ICH E6 GCP question added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding ICH E6 question:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedICH_E6Question()
    .then(() => {
      console.log('✅ ICH E6 question seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ ICH E6 question seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedICH_E6Question };
