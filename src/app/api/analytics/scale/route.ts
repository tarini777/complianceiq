import { NextRequest, NextResponse } from 'next/server';
import { calculateScaleScore, generateScaleInsights, getScaleQuestionStats } from '@/lib/assessment/scaleScoring';
import { successResponse, errorResponse } from '@/lib/api/response-format';

export async function POST(request: NextRequest) {
  try {
    const { responses, assessmentId, personaId, sectionId } = await request.json();

    if (!responses) {
      return errorResponse('Responses data is required', 400);
    }

    // Calculate scale analytics
    const scaleAnalytics = calculateScaleScore(responses);
    const insights = generateScaleInsights(scaleAnalytics);
    const stats = getScaleQuestionStats(responses);

    // Generate recommendations based on analytics
    const recommendations = generateRecommendations(scaleAnalytics, insights);

    const analyticsData = {
      scaleAnalytics,
      insights,
      stats,
      recommendations,
      metadata: {
        assessmentId,
        personaId,
        sectionId,
        generatedAt: new Date().toISOString()
      }
    };

    return successResponse(analyticsData, 'Scale analytics generated successfully');

  } catch (error) {
    console.error('Error generating scale analytics:', error);
    return errorResponse(
      'Failed to generate scale analytics',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const personaId = searchParams.get('personaId');
    const sectionId = searchParams.get('sectionId');

    // This would typically fetch from database
    // For now, return sample data
    const sampleAnalytics = {
      scaleAnalytics: {
        averageScore: 3.8,
        totalScore: 19,
        maxPossibleScore: 25,
        percentage: 76,
        scoreDistribution: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 1 },
        improvementAreas: 1,
        completedQuestions: 7,
        totalQuestions: 10
      },
      insights: {
        overallRating: "Good",
        strengths: ["3 question(s) rated as 'Agree'", "1 question(s) rated as 'Strongly Agree'"],
        weaknesses: ["1 question(s) rated as 'Disagree'"],
        recommendations: [
          "Good progress - continue building on strengths",
          "1 area(s) need immediate attention (scores ≤ 2)"
        ]
      },
      metadata: {
        assessmentId,
        personaId,
        sectionId,
        generatedAt: new Date().toISOString()
      }
    };

    return successResponse(sampleAnalytics, 'Scale analytics retrieved successfully');

  } catch (error) {
    console.error('Error retrieving scale analytics:', error);
    return errorResponse(
      'Failed to retrieve scale analytics',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

function generateRecommendations(analytics: any, insights: any) {
  const recommendations = [];

  // Score-based recommendations
  if (analytics.averageScore < 2.5) {
    recommendations.push({
      priority: 'high',
      category: 'overall',
      title: 'Critical Improvement Required',
      description: 'Overall score indicates significant compliance gaps that need immediate attention.',
      actions: [
        'Conduct comprehensive compliance audit',
        'Develop immediate action plan',
        'Engage external compliance consultants'
      ]
    });
  } else if (analytics.averageScore < 3.5) {
    recommendations.push({
      priority: 'medium',
      category: 'overall',
      title: 'Improvement Needed',
      description: 'Focus on areas with low scores to improve overall compliance.',
      actions: [
        'Identify specific improvement areas',
        'Develop targeted training programs',
        'Implement regular progress monitoring'
      ]
    });
  }

  // Improvement areas recommendations
  if (analytics.improvementAreas > 0) {
    recommendations.push({
      priority: 'high',
      category: 'specific',
      title: 'Address Low-Scoring Areas',
      description: `${analytics.improvementAreas} area(s) scored 2 or below and need immediate attention.`,
      actions: [
        'Review specific low-scoring questions',
        'Develop targeted remediation plans',
        'Assign dedicated resources for improvement'
      ]
    });
  }

  // Distribution-based recommendations
  if (analytics.scoreDistribution[1] > 0 || analytics.scoreDistribution[2] > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'distribution',
      title: 'Address Negative Responses',
      description: 'Some areas received low ratings that need attention.',
      actions: [
        'Conduct root cause analysis',
        'Develop specific improvement strategies',
        'Monitor progress regularly'
      ]
    });
  }

  return recommendations;
}
