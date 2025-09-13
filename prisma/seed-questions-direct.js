/**
 * Direct Questions Seed - Simple and Elegant
 * Creates all 200+ questions directly based on the comprehensive assessment structure
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedQuestionsDirect() {
  console.log('🌱 Seeding comprehensive questions directly...');

  try {
    // Get database sections
    const dbSections = await prisma.assessmentSection.findMany({
      orderBy: { sectionNumber: 'asc' }
    });

    if (dbSections.length === 0) {
      console.log('⚠️ No sections found in database. Please run section seed first.');
      return;
    }

    console.log(`📋 Found ${dbSections.length} sections in database`);

    let totalQuestionsCreated = 0;

    // Create comprehensive questions for each section
    for (const section of dbSections) {
      console.log(`📝 Creating questions for section: ${section.title}`);

      // Create 5-8 questions per section based on the section title
      const questions = generateQuestionsForSection(section);
      
      for (const questionData of questions) {
        await prisma.dynamicQuestion.create({
          data: {
            sectionId: section.id,
            questionText: questionData.text,
            questionType: questionData.type,
            validationCriteria: JSON.stringify(questionData.validation),
            evidenceRequired: questionData.evidenceRequired,
            responsibleRoles: questionData.responsibleRoles
          }
        });

        totalQuestionsCreated++;
      }

      // Create therapy-specific questions (3 per section)
      const therapyQuestions = generateTherapySpecificQuestions(section);
      for (const questionData of therapyQuestions) {
        await prisma.dynamicQuestion.create({
          data: {
            sectionId: section.id,
            questionText: questionData.text,
            questionType: questionData.type,
            validationCriteria: JSON.stringify(questionData.validation),
            evidenceRequired: questionData.evidenceRequired,
            responsibleRoles: questionData.responsibleRoles,
            therapySpecificConditions: JSON.stringify({
              therapeuticArea: questionData.therapy,
              required: true
            })
          }
        });

        totalQuestionsCreated++;
      }

      // Create AI model type-specific questions (2 per section)
      const modelQuestions = generateModelSpecificQuestions(section);
      for (const questionData of modelQuestions) {
        await prisma.dynamicQuestion.create({
          data: {
            sectionId: section.id,
            questionText: questionData.text,
            questionType: questionData.type,
            validationCriteria: JSON.stringify(questionData.validation),
            evidenceRequired: questionData.evidenceRequired,
            responsibleRoles: questionData.responsibleRoles,
            aiModelConditions: JSON.stringify({
              aiModelType: questionData.modelType,
              required: true
            })
          }
        });

        totalQuestionsCreated++;
      }

      console.log(`✅ Created questions for: ${section.title}`);
    }

    console.log(`🎉 Successfully created ${totalQuestionsCreated} comprehensive questions!`);
    console.log(`📊 Questions distributed across ${dbSections.length} sections`);

  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    throw error;
  }
}

function generateQuestionsForSection(section) {
  const sectionTitle = section.title.toLowerCase();
  
  // Base questions for each section
  if (sectionTitle.includes('governance')) {
    return [
      {
        text: 'Does your organization have a formally established AI Governance Committee with defined roles and responsibilities?',
        type: 'radio',
        validation: {
          points: 8,
          isBlocker: true,
          options: [
            { value: 'yes', label: 'Yes, fully established', points: 8 },
            { value: 'partial', label: 'Partially established', points: 4 },
            { value: 'no', label: 'No, not established', points: 0 }
          ]
        },
        evidenceRequired: ['AI governance committee charter', 'Role definitions', 'Meeting minutes'],
        responsibleRoles: ['Chief Compliance Officer', 'AI Governance Director']
      },
      {
        text: 'Are there clear decision-making protocols for AI-related initiatives within the governance structure?',
        type: 'radio',
        validation: {
          points: 6,
          isBlocker: true,
          options: [
            { value: 'yes', label: 'Yes, clearly defined', points: 6 },
            { value: 'partial', label: 'Some protocols exist', points: 3 },
            { value: 'no', label: 'No clear protocols', points: 0 }
          ]
        },
        evidenceRequired: ['Decision-making protocols', 'Governance documentation'],
        responsibleRoles: ['AI Governance Director', 'Legal Counsel']
      },
      {
        text: 'Is there cross-functional representation on the AI Governance Committee (Legal, IT, Clinical, Regulatory)?',
        type: 'radio',
        validation: {
          points: 6,
          isBlocker: true,
          options: [
            { value: 'yes', label: 'Yes, all functions represented', points: 6 },
            { value: 'partial', label: 'Some functions represented', points: 3 },
            { value: 'no', label: 'Limited representation', points: 0 }
          ]
        },
        evidenceRequired: ['Committee membership list', 'Cross-functional representation documentation'],
        responsibleRoles: ['AI Governance Director', 'HR Director']
      },
      {
        text: 'Are there established escalation procedures for AI-related risks and compliance issues?',
        type: 'radio',
        validation: {
          points: 4,
          isBlocker: false,
          options: [
            { value: 'yes', label: 'Yes, comprehensive procedures', points: 4 },
            { value: 'partial', label: 'Basic procedures exist', points: 2 },
            { value: 'no', label: 'No formal procedures', points: 0 }
          ]
        },
        evidenceRequired: ['Escalation procedures documentation', 'Risk management protocols'],
        responsibleRoles: ['Risk Management Director', 'Compliance Officer']
      },
      {
        text: 'Does the AI Governance Committee meet regularly and maintain documented minutes?',
        type: 'radio',
        validation: {
          points: 4,
          isBlocker: false,
          options: [
            { value: 'yes', label: 'Yes, regular meetings with minutes', points: 4 },
            { value: 'partial', label: 'Some meetings documented', points: 2 },
            { value: 'no', label: 'No regular meetings', points: 0 }
          ]
        },
        evidenceRequired: ['Meeting schedule', 'Meeting minutes', 'Attendance records'],
        responsibleRoles: ['AI Governance Director', 'Committee Secretary']
      }
    ];
  }

  if (sectionTitle.includes('data') || sectionTitle.includes('quality')) {
    return [
      {
        text: 'Does your organization have a comprehensive data quality management framework for AI training data?',
        type: 'radio',
        validation: {
          points: 10,
          isBlocker: false,
          options: [
            { value: 'yes', label: 'Yes, comprehensive framework', points: 10 },
            { value: 'partial', label: 'Partial framework exists', points: 5 },
            { value: 'no', label: 'No formal framework', points: 0 }
          ]
        },
        evidenceRequired: ['Data quality framework documentation', 'Quality metrics', 'Validation procedures'],
        responsibleRoles: ['Data Quality Manager', 'AI/ML Engineer']
      },
      {
        text: 'Are there standardized data validation and cleansing procedures for AI datasets?',
        type: 'radio',
        validation: {
          points: 8,
          isBlocker: false,
          options: [
            { value: 'yes', label: 'Yes, standardized procedures', points: 8 },
            { value: 'partial', label: 'Some procedures exist', points: 4 },
            { value: 'no', label: 'No standardized procedures', points: 0 }
          ]
        },
        evidenceRequired: ['Data validation procedures', 'Cleansing protocols', 'Quality reports'],
        responsibleRoles: ['Data Engineer', 'Quality Assurance Manager']
      },
      {
        text: 'Is there a data lineage tracking system for AI model training data?',
        type: 'radio',
        validation: {
          points: 6,
          isBlocker: false,
          options: [
            { value: 'yes', label: 'Yes, comprehensive tracking', points: 6 },
            { value: 'partial', label: 'Basic tracking exists', points: 3 },
            { value: 'no', label: 'No lineage tracking', points: 0 }
          ]
        },
        evidenceRequired: ['Data lineage documentation', 'Tracking system reports'],
        responsibleRoles: ['Data Architect', 'AI/ML Engineer']
      },
      {
        text: 'Are there data privacy and protection measures in place for AI training datasets?',
        type: 'radio',
        validation: {
          points: 8,
          isBlocker: true,
          options: [
            { value: 'yes', label: 'Yes, comprehensive protection', points: 8 },
            { value: 'partial', label: 'Some protection measures', points: 4 },
            { value: 'no', label: 'Insufficient protection', points: 0 }
          ]
        },
        evidenceRequired: ['Privacy impact assessments', 'Data protection documentation', 'Compliance certificates'],
        responsibleRoles: ['Data Protection Officer', 'Privacy Manager']
      }
    ];
  }

  if (sectionTitle.includes('validation') || sectionTitle.includes('testing')) {
    return [
      {
        text: 'Do you have a formal AI model validation framework that includes bias testing and fairness assessment?',
        type: 'radio',
        validation: {
          points: 12,
          isBlocker: true,
          options: [
            { value: 'yes', label: 'Yes, comprehensive framework', points: 12 },
            { value: 'partial', label: 'Basic validation exists', points: 6 },
            { value: 'no', label: 'No formal validation', points: 0 }
          ]
        },
        evidenceRequired: ['Model validation framework', 'Bias testing results', 'Fairness assessment reports'],
        responsibleRoles: ['AI/ML Engineer', 'Validation Specialist']
      },
      {
        text: 'Are there established protocols for testing AI models on diverse patient populations?',
        type: 'radio',
        validation: {
          points: 10,
          isBlocker: true,
          options: [
            { value: 'yes', label: 'Yes, comprehensive protocols', points: 10 },
            { value: 'partial', label: 'Some testing protocols', points: 5 },
            { value: 'no', label: 'Limited testing protocols', points: 0 }
          ]
        },
        evidenceRequired: ['Testing protocols', 'Diverse population validation', 'Clinical validation reports'],
        responsibleRoles: ['Clinical Validation Manager', 'AI/ML Engineer']
      },
      {
        text: 'Is there a model performance monitoring system in production?',
        type: 'radio',
        validation: {
          points: 8,
          isBlocker: false,
          options: [
            { value: 'yes', label: 'Yes, comprehensive monitoring', points: 8 },
            { value: 'partial', label: 'Basic monitoring exists', points: 4 },
            { value: 'no', label: 'No monitoring system', points: 0 }
          ]
        },
        evidenceRequired: ['Monitoring system documentation', 'Performance reports', 'Alert procedures'],
        responsibleRoles: ['DevOps Engineer', 'AI/ML Engineer']
      },
      {
        text: 'Are there established criteria for model retraining and version control?',
        type: 'radio',
        validation: {
          points: 6,
          isBlocker: false,
          options: [
            { value: 'yes', label: 'Yes, clear criteria and procedures', points: 6 },
            { value: 'partial', label: 'Some criteria exist', points: 3 },
            { value: 'no', label: 'No formal criteria', points: 0 }
          ]
        },
        evidenceRequired: ['Retraining criteria', 'Version control procedures', 'Model lifecycle documentation'],
        responsibleRoles: ['AI/ML Engineer', 'Model Operations Manager']
      }
    ];
  }

  // Default questions for any section
  return [
    {
      text: `Does your organization have established processes for ${section.title.toLowerCase()} in AI systems?`,
      type: 'radio',
      validation: {
        points: 8,
        isBlocker: section.isCriticalBlocker,
        options: [
          { value: 'yes', label: 'Yes, comprehensive processes', points: 8 },
          { value: 'partial', label: 'Some processes exist', points: 4 },
          { value: 'no', label: 'No formal processes', points: 0 }
        ]
      },
      evidenceRequired: ['Process documentation', 'Implementation guidelines'],
      responsibleRoles: ['Compliance Officer', 'Technical Lead']
    },
    {
      text: `Are there documented procedures for ${section.title.toLowerCase()} validation and testing?`,
      type: 'radio',
      validation: {
        points: 6,
        isBlocker: false,
        options: [
          { value: 'yes', label: 'Yes, documented procedures', points: 6 },
          { value: 'partial', label: 'Some documentation exists', points: 3 },
          { value: 'no', label: 'Limited documentation', points: 0 }
        ]
      },
      evidenceRequired: ['Documentation', 'Validation procedures'],
      responsibleRoles: ['Quality Assurance Manager', 'Technical Writer']
    },
    {
      text: `Is there regular monitoring and assessment of ${section.title.toLowerCase()} effectiveness?`,
      type: 'radio',
      validation: {
        points: 4,
        isBlocker: false,
        options: [
          { value: 'yes', label: 'Yes, regular monitoring', points: 4 },
          { value: 'partial', label: 'Some monitoring exists', points: 2 },
          { value: 'no', label: 'No formal monitoring', points: 0 }
        ]
      },
      evidenceRequired: ['Monitoring reports', 'Assessment documentation'],
      responsibleRoles: ['Operations Manager', 'Analytics Team']
    }
  ];
}

function generateTherapySpecificQuestions(section) {
  const therapies = ['oncology', 'cardiology', 'neurology', 'infectious-disease'];
  const questions = [];

  for (const therapy of therapies.slice(0, 3)) { // 3 therapy-specific questions per section
    questions.push({
      text: `Are your AI systems production-validated for ${therapy} specific requirements and regulatory guidelines?`,
      type: 'radio',
      validation: {
        points: 4,
        isBlocker: false,
        options: [
          { value: 'yes', label: 'Yes, fully validated', points: 4 },
          { value: 'partial', label: 'Partial validation', points: 2 },
          { value: 'no', label: 'Not validated', points: 0 }
        ]
      },
      evidenceRequired: [`${therapy} validation documentation`, 'Regulatory compliance reports'],
      responsibleRoles: ['Clinical Director', 'Regulatory Affairs Manager'],
      therapy: therapy
    });
  }

  return questions;
}

function generateModelSpecificQuestions(section) {
  const modelTypes = ['generative-ai', 'agentic-ai', 'computer-vision'];
  const questions = [];

  for (const modelType of modelTypes.slice(0, 2)) { // 2 model-specific questions per section
    questions.push({
      text: `Are your ${modelType} systems production-configured with appropriate safety and compliance measures?`,
      type: 'radio',
      validation: {
        points: 5,
        isBlocker: false,
        options: [
          { value: 'yes', label: 'Yes, comprehensive measures', points: 5 },
          { value: 'partial', label: 'Some measures exist', points: 3 },
          { value: 'no', label: 'Insufficient measures', points: 0 }
        ]
      },
      evidenceRequired: [`${modelType} safety documentation`, 'Compliance measures'],
      responsibleRoles: ['AI/ML Engineer', 'Safety Officer'],
      modelType: modelType
    });
  }

  return questions;
}

// Run the seed function
seedQuestionsDirect()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
