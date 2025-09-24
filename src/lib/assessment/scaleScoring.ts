import { AssessmentResponse } from '@/types';

// Define ScaleAnalytics interface locally
interface ScaleAnalytics {
  averageScore: number;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  scoreDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  improvementAreas: number;
  completedQuestions: number;
  totalQuestions: number;
}

/**
 * Calculate scale-specific scoring for assessment responses
 */
export function calculateScaleScore(responses: Record<string, AssessmentResponse>): ScaleAnalytics {
  const scaleResponses = Object.values(responses).filter(
    response => typeof response.responseValue === 'number'
  ) as Array<AssessmentResponse & { responseValue: number }>;

  if (scaleResponses.length === 0) {
    return {
      averageScore: 0,
      totalScore: 0,
      maxPossibleScore: 0,
      percentage: 0,
      scoreDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      improvementAreas: 0,
      completedQuestions: 0,
      totalQuestions: Object.keys(responses).length
    };
  }

  const totalScore = scaleResponses.reduce((sum, response) => sum + response.responseValue, 0);
  const maxPossibleScore = scaleResponses.length * 5;
  const averageScore = totalScore / scaleResponses.length;
  const percentage = (totalScore / maxPossibleScore) * 100;

  // Calculate score distribution
  const scoreDistribution = {
    1: scaleResponses.filter(r => r.responseValue === 1).length,
    2: scaleResponses.filter(r => r.responseValue === 2).length,
    3: scaleResponses.filter(r => r.responseValue === 3).length,
    4: scaleResponses.filter(r => r.responseValue === 4).length,
    5: scaleResponses.filter(r => r.responseValue === 5).length
  };

  // Count improvement areas (scores 1-2)
  const improvementAreas = scaleResponses.filter(r => r.responseValue <= 2).length;

  return {
    averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
    totalScore,
    maxPossibleScore,
    percentage: Math.round(percentage * 100) / 100,
    scoreDistribution,
    improvementAreas,
    completedQuestions: scaleResponses.length,
    totalQuestions: Object.keys(responses).length
  };
}

/**
 * Calculate section-specific scale scores
 */
export function calculateSectionScaleScore(
  responses: Record<string, AssessmentResponse>,
  sectionQuestions: string[]
): ScaleAnalytics {
  const sectionResponses = sectionQuestions.reduce((acc, questionId) => {
    if (responses[questionId]) {
      acc[questionId] = responses[questionId];
    }
    return acc;
  }, {} as Record<string, AssessmentResponse>);

  return calculateScaleScore(sectionResponses);
}

/**
 * Generate scale-specific insights and recommendations
 */
export function generateScaleInsights(analytics: ScaleAnalytics) {
  const insights = {
    overallRating: getOverallRating(analytics.averageScore),
    strengths: [] as string[],
    weaknesses: [] as string[],
    recommendations: [] as string[]
  };

  // Analyze score distribution
  const { scoreDistribution } = analytics;
  
  // Identify strengths (high scores)
  if (scoreDistribution[5] > 0) {
    insights.strengths.push(`${scoreDistribution[5]} question(s) rated as "Strongly Agree"`);
  }
  if (scoreDistribution[4] > 0) {
    insights.strengths.push(`${scoreDistribution[4]} question(s) rated as "Agree"`);
  }

  // Identify weaknesses (low scores)
  if (scoreDistribution[1] > 0) {
    insights.weaknesses.push(`${scoreDistribution[1]} question(s) rated as "Strongly Disagree"`);
  }
  if (scoreDistribution[2] > 0) {
    insights.weaknesses.push(`${scoreDistribution[2]} question(s) rated as "Disagree"`);
  }

  // Generate recommendations based on scores
  if (analytics.averageScore < 2.5) {
    insights.recommendations.push("Immediate action required - overall score indicates significant gaps");
  } else if (analytics.averageScore < 3.5) {
    insights.recommendations.push("Improvement needed - focus on areas with low scores");
  } else if (analytics.averageScore < 4.5) {
    insights.recommendations.push("Good progress - continue building on strengths");
  } else {
    insights.recommendations.push("Excellent performance - maintain current practices");
  }

  // Specific recommendations based on improvement areas
  if (analytics.improvementAreas > 0) {
    insights.recommendations.push(
      `${analytics.improvementAreas} area(s) need immediate attention (scores ≤ 2)`
    );
  }

  return insights;
}

/**
 * Get overall rating based on average score
 */
function getOverallRating(averageScore: number): string {
  if (averageScore >= 4.5) return "Excellent";
  if (averageScore >= 3.5) return "Good";
  if (averageScore >= 2.5) return "Fair";
  if (averageScore >= 1.5) return "Poor";
  return "Critical";
}

/**
 * Calculate progress percentage for scale questions
 */
export function calculateScaleProgress(
  responses: Record<string, AssessmentResponse>,
  totalQuestions: number
): number {
  const completedQuestions = Object.values(responses).filter(
    response => response.completionStatus === 'complete' && 
    typeof response.responseValue === 'number'
  ).length;

  return Math.round((completedQuestions / totalQuestions) * 100);
}

/**
 * Get scale question statistics
 */
export function getScaleQuestionStats(responses: Record<string, AssessmentResponse>) {
  const scaleResponses = Object.values(responses).filter(
    response => typeof response.responseValue === 'number'
  ) as Array<AssessmentResponse & { responseValue: number }>;

  return {
    totalScaleQuestions: scaleResponses.length,
    completedScaleQuestions: scaleResponses.filter(r => r.completionStatus === 'complete').length,
    averageResponseTime: calculateAverageResponseTime(scaleResponses),
    mostCommonScore: getMostCommonScore(scaleResponses),
    scoreVariance: calculateScoreVariance(scaleResponses)
  };
}

function calculateAverageResponseTime(responses: Array<AssessmentResponse & { responseValue: number }>): number {
  // This would need timestamp data to calculate properly
  // For now, return a placeholder
  return 0;
}

function getMostCommonScore(responses: Array<AssessmentResponse & { responseValue: number }>): number {
  if (responses.length === 0) return 0;
  
  const scoreCounts = responses.reduce((acc, response) => {
    acc[response.responseValue] = (acc[response.responseValue] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const entries = Object.entries(scoreCounts);
  if (entries.length === 0) return 0;
  
  return parseInt(entries.reduce((a, b) => scoreCounts[parseInt(a[0])] > scoreCounts[parseInt(b[0])] ? a : b)[0]);
}

function calculateScoreVariance(responses: Array<AssessmentResponse & { responseValue: number }>): number {
  if (responses.length === 0) return 0;
  
  const scores = responses.map(r => r.responseValue);
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  
  return Math.round(variance * 100) / 100;
}
