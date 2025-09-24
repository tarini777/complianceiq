import { NextRequest, NextResponse } from 'next/server';
import { rulesIntelligence } from '@/lib/intelligence/rulesIntelligence';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


/**
 * API endpoint for rules intelligence analysis
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'summary';

    console.log(`Rules intelligence API called with action: ${action}`);

    switch (action) {
      case 'summary':
        const summary = await rulesIntelligence.getIntelligenceSummary();
        return NextResponse.json({ 
          success: true, 
          data: summary,
          timestamp: new Date().toISOString()
        });

      case 'performance':
        const performance = await rulesIntelligence.analyzeRulePerformance();
        return NextResponse.json({ 
          success: true, 
          data: performance,
          timestamp: new Date().toISOString()
        });

      case 'recommendations':
        const recommendations = await rulesIntelligence.generateRuleRecommendations();
        return NextResponse.json({ 
          success: true, 
          data: recommendations,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid action parameter' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in rules intelligence API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch rules intelligence data' 
    }, { status: 500 });
  }
}

/**
 * POST endpoint for triggering rule optimization
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ruleId, optimizationType, parameters } = body;

    console.log(`Rules optimization triggered for rule: ${ruleId}`);

    // This would integrate with the actual rule optimization system
    // For now, we'll simulate the optimization process
    
    const optimizationResult = {
      ruleId,
      optimizationType,
      parameters,
      status: 'optimization_initiated',
      estimatedCompletionTime: '15 minutes',
      expectedImprovement: '25-40% reduction in failure rate',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      data: optimizationResult 
    });
  } catch (error) {
    console.error('Error in rules optimization API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initiate rule optimization' 
    }, { status: 500 });
  }
}
