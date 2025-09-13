import { NextRequest, NextResponse } from 'next/server';
import { AssessmentDataGenerator } from '@/lib/data-pipeline/assessmentDataGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    console.log(`Data pipeline action: ${action}`);

    switch (action) {
      case 'generate-sample-data':
        const result = await AssessmentDataGenerator.generateSampleData();
        return NextResponse.json({
          success: true,
          message: 'Sample data generated successfully',
          data: result
        });

      case 'clear-sample-data':
        await AssessmentDataGenerator.clearSampleData();
        return NextResponse.json({
          success: true,
          message: 'Sample data cleared successfully'
        });

      case 'get-statistics':
        const stats = await AssessmentDataGenerator.getDataStatistics();
        return NextResponse.json({
          success: true,
          data: stats
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Supported actions: generate-sample-data, clear-sample-data, get-statistics'
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Data pipeline error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Data pipeline operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await AssessmentDataGenerator.getDataStatistics();
    
    return NextResponse.json({
      success: true,
      data: stats,
      meta: {
        generatedAt: new Date().toISOString(),
        dataSource: 'database'
      }
    });

  } catch (error) {
    console.error('Error getting data pipeline statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get data pipeline statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
