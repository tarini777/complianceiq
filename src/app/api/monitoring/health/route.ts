/**
 * System Health Monitoring API
 * Provides SVM-based health predictions and monitoring data
 */

import { NextRequest, NextResponse } from 'next/server';
import { svmHealthMonitor } from '@/lib/monitoring/svmHealthMonitor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'report';
    const hours = parseInt(searchParams.get('hours') || '24');

    console.log(`System Health Monitoring API called with action: ${action}`);

    switch (action) {
      case 'report':
        // Get comprehensive health report
        const healthReport = await svmHealthMonitor.getHealthReport();
        
        return NextResponse.json({
          success: true,
          data: {
            ...healthReport,
            summary: {
              currentHealthScore: healthReport.current.prediction.healthScore,
              currentStatus: healthReport.current.prediction.status,
              trend: healthReport.trend.trend,
              trendScore: healthReport.trend.trendScore,
              recommendations: healthReport.current.prediction.recommendations,
              riskFactors: healthReport.current.prediction.riskFactors
            }
          },
          timestamp: new Date().toISOString()
        });

      case 'metrics':
        // Get current metrics only
        const currentMetrics = await svmHealthMonitor.getCurrentMetrics();
        const prediction = svmHealthMonitor.predictHealth(currentMetrics);
        
        return NextResponse.json({
          success: true,
          data: {
            metrics: currentMetrics,
            prediction
          },
          timestamp: new Date().toISOString()
        });

      case 'trend':
        // Get trend analysis
        const trendAnalysis = svmHealthMonitor.getTrendAnalysis(hours);
        
        return NextResponse.json({
          success: true,
          data: {
            trend: trendAnalysis.trend,
            trendScore: trendAnalysis.trendScore,
            keyChanges: trendAnalysis.keyChanges,
            period: `${hours} hours`
          },
          timestamp: new Date().toISOString()
        });

      case 'history':
        // Get historical data
        const report = await svmHealthMonitor.getHealthReport();
        
        return NextResponse.json({
          success: true,
          data: {
            historical: report.historical,
            count: report.historical.length,
            period: 'Last 24 data points'
          },
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter. Supported actions: report, metrics, trend, history'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in health monitoring API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve health monitoring data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.metrics) {
      return NextResponse.json({
        success: false,
        error: 'Metrics data is required'
      }, { status: 400 });
    }

    // Add custom metrics data point
    const dataPoint = svmHealthMonitor.addDataPoint(body.metrics);
    
    return NextResponse.json({
      success: true,
      data: dataPoint,
      message: 'Health monitoring data point added successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error adding health monitoring data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to add health monitoring data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
