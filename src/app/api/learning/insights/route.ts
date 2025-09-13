/**
 * Continuous Learning Insights API
 * Provides AI-powered insights from audit logs and user behavior patterns
 */

import { NextRequest, NextResponse } from 'next/server';
import { continuousLearningEngine } from '@/lib/learning/continuousLearningEngine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'insights';
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log(`Continuous Learning API called with action: ${action}`);

    switch (action) {
      case 'insights':
        // Get recent learning insights
        const recentInsights = continuousLearningEngine.getRecentInsights(limit);
        
        return NextResponse.json({
          success: true,
          data: {
            insights: recentInsights,
            summary: {
              totalInsights: recentInsights.length,
              criticalInsights: recentInsights.filter(i => i.severity === 'critical').length,
              highInsights: recentInsights.filter(i => i.severity === 'high').length,
              mediumInsights: recentInsights.filter(i => i.severity === 'medium').length,
              lowInsights: recentInsights.filter(i => i.severity === 'low').length
            },
            categories: {
              assessment: recentInsights.filter(i => i.category === 'assessment').length,
              user_behavior: recentInsights.filter(i => i.category === 'user_behavior').length,
              system_performance: recentInsights.filter(i => i.category === 'system_performance').length,
              compliance: recentInsights.filter(i => i.category === 'compliance').length
            }
          },
          timestamp: new Date().toISOString()
        });

      case 'cycle':
        // Run a new learning cycle
        console.log('Running new learning cycle...');
        const learningCycle = await continuousLearningEngine.runLearningCycle();
        
        return NextResponse.json({
          success: true,
          data: learningCycle,
          message: `Learning cycle ${learningCycle.status === 'completed' ? 'completed successfully' : 'failed'}`,
          timestamp: new Date().toISOString()
        });

      case 'history':
        // Get learning cycle history
        const learningHistory = continuousLearningEngine.getLearningHistory();
        
        return NextResponse.json({
          success: true,
          data: {
            cycles: learningHistory,
            summary: {
              totalCycles: learningHistory.length,
              completedCycles: learningHistory.filter(c => c.status === 'completed').length,
              failedCycles: learningHistory.filter(c => c.status === 'failed').length,
              totalInsightsGenerated: learningHistory.reduce((sum, c) => sum + c.summary.totalInsights, 0)
            }
          },
          timestamp: new Date().toISOString()
        });

      case 'summary':
        // Get learning summary
        const history = continuousLearningEngine.getLearningHistory();
        const insights = continuousLearningEngine.getRecentInsights(50);
        
        const summary = {
          totalCycles: history.length,
          lastCycle: history[0] || null,
          recentInsights: insights.slice(0, 10),
          topCategories: getTopCategories(insights),
          criticalIssues: insights.filter(i => i.severity === 'critical').length,
          recommendations: getAllRecommendations(insights)
        };
        
        return NextResponse.json({
          success: true,
          data: summary,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter. Supported actions: insights, cycle, history, summary'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in continuous learning API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve learning insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Get top categories from insights
 */
function getTopCategories(insights: any[]): { [key: string]: number } {
  const categories: { [key: string]: number } = {};
  
  if (insights && Array.isArray(insights)) {
    insights.forEach(insight => {
      if (insight.category) {
        categories[insight.category] = (categories[insight.category] || 0) + 1;
      }
    });
  }
  
  return Object.fromEntries(
    Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  );
}

/**
 * Get all recommendations from insights
 */
function getAllRecommendations(insights: any[]): string[] {
  const recommendations = new Set<string>();
  
  if (insights && Array.isArray(insights)) {
    insights.forEach(insight => {
      if (insight.recommendations && Array.isArray(insight.recommendations)) {
        insight.recommendations.forEach((rec: string) => recommendations.add(rec));
      }
    });
  }
  
  return Array.from(recommendations).slice(0, 20);
}
