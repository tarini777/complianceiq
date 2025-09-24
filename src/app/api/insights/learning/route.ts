import { NextRequest, NextResponse } from 'next/server';
import { learningInsightsEngine } from '@/lib/insights/learningEngine';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentData, companyId, personaId } = body;

    // Analyze assessment data and generate insights
    const insights = await learningInsightsEngine.analyzeAssessmentData(assessmentData);

    return NextResponse.json({
      success: true,
      data: {
        insights,
        summary: {
          totalInsights: insights.length,
          criticalInsights: insights.filter(i => i.severity === 'critical').length,
          highInsights: insights.filter(i => i.severity === 'high').length,
          mediumInsights: insights.filter(i => i.severity === 'medium').length,
          lowInsights: insights.filter(i => i.severity === 'low').length,
          averageConfidence: Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length) || 0,
        },
        metadata: {
          analyzedAt: new Date().toISOString(),
          companyId,
          personaId,
          totalRecommendations: insights.reduce((sum, i) => sum + i.recommendations.length, 0),
        },
      },
    });
  } catch (error) {
    console.error('Error generating learning insights:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate learning insights',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get insights from the engine
    let insights = learningInsightsEngine.getInsights();

    // Apply filters
    if (type && type !== 'all') {
      insights = insights.filter(insight => insight.type === type);
    }

    if (severity && severity !== 'all') {
      insights = insights.filter(insight => insight.severity === severity);
    }

    // Apply limit
    insights = insights.slice(0, limit);

    // Sort by severity and confidence
    insights.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] || 0;
      const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] || 0;
      
      if (aSeverity !== bSeverity) {
        return bSeverity - aSeverity;
      }
      
      return b.confidence - a.confidence;
    });

    return NextResponse.json({
      success: true,
      data: {
        insights,
        summary: {
          totalInsights: insights.length,
          criticalInsights: insights.filter(i => i.severity === 'critical').length,
          highInsights: insights.filter(i => i.severity === 'high').length,
          mediumInsights: insights.filter(i => i.severity === 'medium').length,
          lowInsights: insights.filter(i => i.severity === 'low').length,
          averageConfidence: Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length) || 0,
        },
        metadata: {
          retrievedAt: new Date().toISOString(),
          filters: { type, severity, limit },
          totalRecommendations: insights.reduce((sum, i) => sum + i.recommendations.length, 0),
        },
      },
    });
  } catch (error) {
    console.error('Error retrieving learning insights:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve learning insights',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
