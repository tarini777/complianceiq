const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateQuestions() {
  try {
    console.log('🔄 Starting question migration to 1-5 scale format...');
    
    // Get all existing questions
    const existingQuestions = await prisma.assessmentQuestion.findMany();
    console.log(`📊 Found ${existingQuestions.length} existing questions`);
    
    if (existingQuestions.length === 0) {
      console.log('⚠️  No questions found in database. Creating sample scale questions...');
      
      // Create sample scale questions
      const sampleQuestions = [
        {
          id: 'ai-incident-response-1',
          text: 'How well does your AI incident response process address immunotherapy research specific requirements?',
          type: 'scale_1_5',
          points: 10,
          isBlocker: true,
          category: 'AI Incident Response',
          evidenceRequired: ['Incident response procedures', 'Therapeutic area specific protocols'],
          responsibleRole: ['IT Security', 'Clinical Operations'],
          validationCriteria: {},
          scaleLabels: {
            1: "Not at all",
            2: "Minimally", 
            3: "Somewhat",
            4: "Well",
            5: "Extremely well"
          },
          scaleConfiguration: {
            min: 1,
            max: 5,
            step: 1,
            defaultLabels: false
          },
          assessmentSection: 'AI Incident Response & Recovery',
          source: 'migration'
        },
        {
          id: 'ai-incident-response-2',
          text: 'How confident are you in your immunotherapy research specific validation criteria for AI incident response?',
          type: 'scale_1_5',
          points: 10,
          isBlocker: true,
          category: 'AI Incident Response',
          evidenceRequired: ['Validation criteria documentation', 'Therapeutic area expertise'],
          responsibleRole: ['Clinical Operations', 'Regulatory Affairs'],
          validationCriteria: {},
          scaleLabels: {
            1: "Not confident",
            2: "Slightly confident",
            3: "Moderately confident",
            4: "Very confident",
            5: "Extremely confident"
          },
          scaleConfiguration: {
            min: 1,
            max: 5,
            step: 1,
            defaultLabels: false
          },
          assessmentSection: 'AI Incident Response & Recovery',
          source: 'migration'
        }
      ];
      
      // Insert sample questions
      for (const question of sampleQuestions) {
        await prisma.assessmentQuestion.create({
          data: question
        });
      }
      
      console.log('✅ Created sample scale questions');
      return;
    }
    
    // Convert existing questions to scale format
    console.log('🔄 Converting existing questions to scale format...');
    
    let updatedCount = 0;
    for (const question of existingQuestions) {
      // Generate appropriate scale labels based on question content
      const scaleLabels = generateScaleLabels(question.category, question.text);
      
      await prisma.assessmentQuestion.update({
        where: { id: question.id },
        data: {
          type: 'scale_1_5',
          scaleLabels: scaleLabels,
          scaleConfiguration: {
            min: 1,
            max: 5,
            step: 1,
            defaultLabels: false
          }
        }
      });
      updatedCount++;
    }
    
    console.log(`✅ Migration completed! Updated ${updatedCount} questions to 1-5 scale format`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

function generateScaleLabels(category, questionText) {
  const lowerText = questionText.toLowerCase();
  
  // Agreement-based questions
  if (lowerText.includes('agree') || lowerText.includes('support') || lowerText.includes('endorse')) {
    return {
      1: "Strongly Disagree",
      2: "Disagree",
      3: "Neutral",
      4: "Agree",
      5: "Strongly Agree"
    };
  }
  
  // Confidence-based questions
  if (lowerText.includes('confident') || lowerText.includes('certain') || lowerText.includes('sure')) {
    return {
      1: "Not at all confident",
      2: "Slightly confident",
      3: "Moderately confident",
      4: "Very confident",
      5: "Extremely confident"
    };
  }
  
  // Quality-based questions
  if (lowerText.includes('quality') || lowerText.includes('effective') || lowerText.includes('good')) {
    return {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
  }
  
  // Category-specific labels
  switch (category.toLowerCase()) {
    case 'ai incident response':
    case 'ai governance':
    case 'regulatory compliance':
      return {
        1: "Not implemented",
        2: "Partially implemented",
        3: "Mostly implemented",
        4: "Well implemented",
        5: "Fully implemented"
      };
      
    case 'data privacy':
    case 'security':
      return {
        1: "No controls",
        2: "Basic controls",
        3: "Adequate controls",
        4: "Good controls",
        5: "Excellent controls"
      };
      
    default:
      return {
        1: "Strongly Disagree",
        2: "Disagree",
        3: "Neutral",
        4: "Agree",
        5: "Strongly Agree"
      };
  }
}

migrateQuestions();