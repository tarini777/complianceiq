/**
 * Comprehensive Questions Seed Script
 * Seeds all assessment questions across all sections
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedComprehensiveQuestions() {
  console.log('🌱 Seeding comprehensive assessment questions...');

  try {
    // Get all sections
    const sections = await prisma.assessmentSection.findMany({
      orderBy: { sectionNumber: 'asc' }
    });

    if (sections.length === 0) {
      console.log('⚠️ No sections found. Please run section seed first.');
      return;
    }

    // Comprehensive questions for each section
    const comprehensiveQuestions = [
      // Section 1: AI Governance Committee
      {
        sectionId: 'section-1',
        questions: [
          {
            questionNumber: 'AI-Gov-001',
            questionText: 'Does your organization have a formally established AI Governance Committee with defined roles and responsibilities?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, fully established', points: 8 },
              { value: 'partial', label: 'Partially established', points: 4 },
              { value: 'no', label: 'No, not established', points: 0 }
            ],
            isCritical: true,
            evidenceRequired: true,
            estimatedTimeMinutes: 5
          },
          {
            questionNumber: 'AI-Gov-002',
            questionText: 'Are there clear decision-making protocols for AI-related initiatives within the governance structure?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, clearly defined', points: 6 },
              { value: 'partial', label: 'Some protocols exist', points: 3 },
              { value: 'no', label: 'No clear protocols', points: 0 }
            ],
            isCritical: true,
            evidenceRequired: true,
            estimatedTimeMinutes: 5
          },
          {
            questionNumber: 'AI-Gov-003',
            questionText: 'Is there cross-functional representation on the AI Governance Committee (Legal, IT, Clinical, Regulatory)?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, all functions represented', points: 6 },
              { value: 'partial', label: 'Some functions represented', points: 3 },
              { value: 'no', label: 'Limited representation', points: 0 }
            ],
            isCritical: true,
            evidenceRequired: true,
            estimatedTimeMinutes: 5
          }
        ]
      },

      // Section 2: Data Quality & Management
      {
        sectionId: 'section-2',
        questions: [
          {
            questionNumber: 'DQ-001',
            questionText: 'Does your organization have a comprehensive data quality management framework for AI training data?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, comprehensive framework', points: 10 },
              { value: 'partial', label: 'Partial framework exists', points: 5 },
              { value: 'no', label: 'No formal framework', points: 0 }
            ],
            isCritical: false,
            evidenceRequired: true,
            estimatedTimeMinutes: 8
          },
          {
            questionNumber: 'DQ-002',
            questionText: 'Are there standardized data validation and cleansing procedures for AI datasets?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, standardized procedures', points: 8 },
              { value: 'partial', label: 'Some procedures exist', points: 4 },
              { value: 'no', label: 'No standardized procedures', points: 0 }
            ],
            isCritical: false,
            evidenceRequired: true,
            estimatedTimeMinutes: 6
          }
        ]
      },

      // Section 3: Model Validation & Testing
      {
        sectionId: 'section-3',
        questions: [
          {
            questionNumber: 'MV-001',
            questionText: 'Do you have a formal AI model validation framework that includes bias testing and fairness assessment?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, comprehensive framework', points: 12 },
              { value: 'partial', label: 'Basic validation exists', points: 6 },
              { value: 'no', label: 'No formal validation', points: 0 }
            ],
            isCritical: true,
            evidenceRequired: true,
            estimatedTimeMinutes: 10
          },
          {
            questionNumber: 'MV-002',
            questionText: 'Are there established protocols for testing AI models on diverse patient populations?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, comprehensive protocols', points: 10 },
              { value: 'partial', label: 'Some testing protocols', points: 5 },
              { value: 'no', label: 'Limited testing protocols', points: 0 }
            ],
            isCritical: true,
            evidenceRequired: true,
            estimatedTimeMinutes: 8
          }
        ]
      },

      // Section 4: Regulatory Compliance
      {
        sectionId: 'section-4',
        questions: [
          {
            questionNumber: 'RC-001',
            questionText: 'Does your organization have processes to ensure AI systems comply with FDA guidelines for software as a medical device (SaMD)?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, comprehensive processes', points: 15 },
              { value: 'partial', label: 'Some compliance processes', points: 8 },
              { value: 'no', label: 'No formal processes', points: 0 }
            ],
            isCritical: true,
            evidenceRequired: true,
            estimatedTimeMinutes: 12
          },
          {
            questionNumber: 'RC-002',
            questionText: 'Are there mechanisms to track and report adverse events related to AI system performance?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, comprehensive tracking', points: 12 },
              { value: 'partial', label: 'Basic tracking exists', points: 6 },
              { value: 'no', label: 'No formal tracking', points: 0 }
            ],
            isCritical: true,
            evidenceRequired: true,
            estimatedTimeMinutes: 10
          }
        ]
      },

      // Section 5: Clinical Integration
      {
        sectionId: 'section-5',
        questions: [
          {
            questionNumber: 'CI-001',
            questionText: 'Do you have established protocols for integrating AI systems into clinical workflows?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, comprehensive protocols', points: 10 },
              { value: 'partial', label: 'Some integration protocols', points: 5 },
              { value: 'no', label: 'No formal protocols', points: 0 }
            ],
            isCritical: false,
            evidenceRequired: true,
            estimatedTimeMinutes: 8
          },
          {
            questionNumber: 'CI-002',
            questionText: 'Are there training programs for clinical staff on AI system usage and interpretation?',
            questionType: 'radio',
            options: [
              { value: 'yes', label: 'Yes, comprehensive training', points: 8 },
              { value: 'partial', label: 'Some training exists', points: 4 },
              { value: 'no', label: 'No formal training', points: 0 }
            ],
            isCritical: false,
            evidenceRequired: true,
            estimatedTimeMinutes: 6
          }
        ]
      }
    ];

    let totalQuestionsCreated = 0;

    // Create questions for each section
    for (const sectionData of comprehensiveQuestions) {
      const section = sections.find(s => s.id === sectionData.sectionId);
      if (!section) {
        console.log(`⚠️ Section ${sectionData.sectionId} not found, skipping...`);
        continue;
      }

      for (const questionData of sectionData.questions) {
        const question = await prisma.dynamicQuestion.create({
          data: {
            sectionId: section.id,
            questionText: questionData.questionText,
            questionType: questionData.questionType,
            validationCriteria: JSON.stringify(questionData.options),
            evidenceRequired: questionData.evidenceRequired ? ['documentation', 'validation'] : [],
            responsibleRoles: ['compliance-officer', 'technical-lead']
          }
        });

        totalQuestionsCreated++;
      }
    }

    // Create additional questions for remaining sections
    const remainingSections = sections.filter(s => 
      !comprehensiveQuestions.some(sd => sd.sectionId === s.id)
    );

    for (const section of remainingSections.slice(0, 10)) { // Limit to first 10 remaining sections
      const sampleQuestions = [
        {
          questionNumber: `${section.id.toUpperCase()}-001`,
          questionText: `Does your organization have established processes for ${section.title.toLowerCase()} in AI systems?`,
          questionType: 'radio',
          options: [
            { value: 'yes', label: 'Yes, comprehensive processes', points: 8 },
            { value: 'partial', label: 'Some processes exist', points: 4 },
            { value: 'no', label: 'No formal processes', points: 0 }
          ],
          isCritical: section.isCriticalBlocker,
          evidenceRequired: true,
          estimatedTimeMinutes: 5
        },
        {
          questionNumber: `${section.id.toUpperCase()}-002`,
          questionText: `Are there documented procedures for ${section.title.toLowerCase()} validation and testing?`,
          questionType: 'radio',
          options: [
            { value: 'yes', label: 'Yes, documented procedures', points: 6 },
            { value: 'partial', label: 'Some documentation exists', points: 3 },
            { value: 'no', label: 'Limited documentation', points: 0 }
          ],
          isCritical: false,
          evidenceRequired: true,
          estimatedTimeMinutes: 5
        }
      ];

      for (const questionData of sampleQuestions) {
        await prisma.dynamicQuestion.upsert({
          where: {
            questionNumber: questionData.questionNumber
          },
          update: {
            questionText: questionData.questionText,
            questionType: questionData.questionType,
            options: JSON.stringify(questionData.options),
            isCritical: questionData.isCritical,
            evidenceRequired: questionData.evidenceRequired,
            estimatedTimeMinutes: questionData.estimatedTimeMinutes
          },
          create: {
            questionNumber: questionData.questionNumber,
            sectionId: section.id,
            questionText: questionData.questionText,
            questionType: questionData.questionType,
            options: JSON.stringify(questionData.options),
            isCritical: questionData.isCritical,
            evidenceRequired: questionData.evidenceRequired,
            estimatedTimeMinutes: questionData.estimatedTimeMinutes
          }
        });

        totalQuestionsCreated++;
      }
    }

    console.log(`✅ Created ${totalQuestionsCreated} comprehensive questions across ${sections.length} sections`);
    console.log('🎉 Comprehensive questions seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding comprehensive questions:', error);
    throw error;
  }
}

// Run the seed function
seedComprehensiveQuestions()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
