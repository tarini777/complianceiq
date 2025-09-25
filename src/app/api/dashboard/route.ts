import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API called (simplified for build compatibility)');

    // Return mock dashboard data to avoid Prisma dependency during Vercel build
    const dashboardData = {
      overview: {
        totalAssessments: 25,
        totalAssessmentsGrowth: '+12% from last month',
        activeAssessments: 8,
        activeAssessmentsGrowth: '+3 this week',
        avgComplianceScore: '78.5',
        avgComplianceScoreGrowth: '+8% improvement',
        criticalIssues: 3,
        criticalIssuesGrowth: '-2 resolved this week'
      },
      recentAssessments: [
        {
          id: 'mock-1',
          companyName: 'Gilead Sciences',
          assessmentName: 'Gilead AI Compliance Assessment',
          date: '2025-01-20',
          score: 78,
          status: 'in_progress',
          therapeuticAreas: ['HIV/AIDS Therapeutics'],
          aiModelTypes: ['Traditional AI/ML']
        },
        {
          id: 'mock-2',
          companyName: 'Pfizer Inc.',
          assessmentName: 'Pfizer Regulatory Assessment',
          date: '2025-01-18',
          score: 85,
          status: 'completed',
          therapeuticAreas: ['Oncology'],
          aiModelTypes: ['Large Language Models']
        },
        {
          id: 'mock-3',
          companyName: 'Johnson & Johnson',
          assessmentName: 'J&J AI Safety Assessment',
          date: '2025-01-15',
          score: 72,
          status: 'in_progress',
          therapeuticAreas: ['Immunology'],
          aiModelTypes: ['Computer Vision']
        },
        {
          id: 'mock-4',
          companyName: 'Merck & Co.',
          assessmentName: 'Merck Compliance Review',
          date: '2025-01-12',
          score: 91,
          status: 'completed',
          therapeuticAreas: ['Cardiology'],
          aiModelTypes: ['Natural Language Processing']
        }
      ],
      systemMetrics: {
        uptime: '99.8%',
        avgResponseTime: '1.2s',
        activeIssues: 0,
        regulatoryUpdates: 15
      },
      quickActions: [
        { name: 'Start New Assessment', href: '/assessment', icon: 'Plus' },
        { name: 'View Regulatory Updates', href: '/regulatory', icon: 'Shield' },
        { name: 'Generate Compliance Report', href: '/analytics', icon: 'BarChart' },
        { name: 'Manage Companies', href: '/companies', icon: 'Building' }
      ]
    };

    console.log('Dashboard data (mocked for build compatibility):', {
      totalAssessments: dashboardData.overview.totalAssessments,
      activeAssessments: dashboardData.overview.activeAssessments,
      avgComplianceScore: dashboardData.overview.avgComplianceScore,
      criticalIssues: dashboardData.overview.criticalIssues
    });

    return NextResponse.json({
      success: true,
      data: dashboardData,
      meta: {
        generatedAt: new Date().toISOString(),
        dataSource: 'mock',
        totalRecords: 25,
        message: 'Dashboard data loaded (simplified for deployment compatibility)'
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
