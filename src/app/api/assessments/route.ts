import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {};
    
    if (companyId) {
      where.tenantId = companyId;
    } else {
      // Default to Gilead Sciences
      where.tenant = {
        name: 'Gilead Sciences'
      };
    }
    
    if (status) {
      where.status = status;
    }

    // Get assessments with their related data
    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        tenant: true,
        therapeuticAreas: true,
        aiModelTypes: true,
        deploymentScenarios: true,
        learningInsights: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json({
      success: true,
      data: assessments,
      summary: {
        totalAssessments: assessments.length,
        completedAssessments: assessments.filter(a => a.status === 'completed').length,
        inProgressAssessments: assessments.filter(a => a.status === 'in_progress').length,
        failedAssessments: assessments.filter(a => a.status === 'failed').length,
        averageScore: Math.round(assessments.reduce((sum, a) => sum + a.currentScore, 0) / assessments.length) || 0
      }
    });

  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch assessments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
