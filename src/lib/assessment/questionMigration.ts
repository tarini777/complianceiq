import { Question, ScaleQuestion } from '@/types';

/**
 * Convert a binary (yes/no) question to a scale question
 */
export function convertBinaryToScale(question: Question): ScaleQuestion {
  return {
    ...question,
    questionType: 'scale_1_5',
    scaleLabels: {
      1: "Strongly Disagree",
      2: "Disagree",
      3: "Neutral",
      4: "Agree",
      5: "Strongly Agree"
    },
    scaleConfiguration: {
      min: 1,
      max: 5,
      step: 1,
      defaultLabels: true
    }
  };
}

/**
 * Convert multiple questions to scale format
 */
export function convertQuestionsToScale(questions: Question[]): ScaleQuestion[] {
  return questions.map(question => {
    if (question.questionType === 'boolean') {
      return convertBinaryToScale(question);
    }
    return question as ScaleQuestion;
  });
}

/**
 * Generate scale labels based on question category
 */
export function generateScaleLabels(category: string, questionText: string) {
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
  
  // Frequency-based questions
  if (lowerText.includes('often') || lowerText.includes('frequent') || lowerText.includes('regular')) {
    return {
      1: "Never",
      2: "Rarely",
      3: "Sometimes",
      4: "Often",
      5: "Always"
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
  
  // Category-specific labels
  switch (category.toLowerCase()) {
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
      
    case 'training':
    case 'adoption':
      return {
        1: "Not at all",
        2: "Minimal",
        3: "Somewhat",
        4: "Mostly",
        5: "Completely"
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

/**
 * Migrate assessment questions from binary to scale format
 */
export function migrateAssessmentQuestions(questions: Question[]): ScaleQuestion[] {
  return questions.map(question => {
    const scaleLabels = generateScaleLabels(question.category, question.text);
    
    return {
      ...question,
      questionType: 'scale_1_5',
      scaleLabels,
      scaleConfiguration: {
        min: 1,
        max: 5,
        step: 1,
        defaultLabels: false
      }
    } as ScaleQuestion;
  });
}

/**
 * Validate scale question configuration
 */
export function validateScaleQuestion(question: ScaleQuestion): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!question.scaleLabels) {
    errors.push('Scale labels are required');
  }
  
  if (!question.scaleConfiguration) {
    errors.push('Scale configuration is required');
  }
  
  // Validate scale labels
  if (question.scaleLabels) {
    const labels = question.scaleLabels;
    for (let i = 1; i <= 5; i++) {
      if (!labels[i as keyof typeof labels]) {
        errors.push(`Scale label for value ${i} is missing`);
      }
    }
  }
  
  // Validate scale configuration
  if (question.scaleConfiguration) {
    const config = question.scaleConfiguration;
    if (config.min < 1 || config.min > 5) {
      errors.push('Scale minimum must be between 1 and 5');
    }
    if (config.max < 1 || config.max > 5) {
      errors.push('Scale maximum must be between 1 and 5');
    }
    if (config.min >= config.max) {
      errors.push('Scale minimum must be less than maximum');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate migration report
 */
export function generateMigrationReport(
  originalQuestions: Question[],
  migratedQuestions: ScaleQuestion[]
): {
  totalQuestions: number;
  migratedQuestions: number;
  validationErrors: number;
  categories: Record<string, number>;
  recommendations: string[];
} {
  const totalQuestions = originalQuestions.length;
  const migratedCount = migratedQuestions.length;
  
  // Count validation errors
  const validationErrors = migratedQuestions.filter(q => !validateScaleQuestion(q).valid).length;
  
  // Count by category
  const categories = migratedQuestions.reduce((acc, question) => {
    acc[question.category] = (acc[question.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (validationErrors > 0) {
    recommendations.push(`${validationErrors} questions have validation errors that need to be fixed`);
  }
  
  if (migratedCount < totalQuestions) {
    recommendations.push(`${totalQuestions - migratedCount} questions were not migrated`);
  }
  
  const highRiskCategories = Object.entries(categories)
    .filter(([_, count]) => count > 10)
    .map(([category, _]) => category);
    
  if (highRiskCategories.length > 0) {
    recommendations.push(`High-volume categories (${highRiskCategories.join(', ')}) should be reviewed for consistency`);
  }
  
  return {
    totalQuestions,
    migratedQuestions: migratedCount,
    validationErrors,
    categories,
    recommendations
  };
}
