import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    console.log('Assessments API called (simplified for build compatibility)');
    
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Return mock assessments data to avoid Prisma dependency during Vercel build
    const mockAssessments = [
      {
        id: 'assessment-1',
        assessmentName: 'AI Governance Compliance Assessment',
        status: status || 'completed',
        currentScore: 85,
        maxPossibleScore: 100,
        completionRate: 92,
        criticalBlockers: 1,
        completedSections: 8,
        totalSections: 10,
        personaId: 'data-scientist',
        subPersonaId: 'senior-data-scientist',
        tenantId: companyId || 'gilead-sciences',
        version: '1.2',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tenant: {
          id: companyId || 'gilead-sciences',
          name: 'Gilead Sciences',
          industryType: 'Pharmaceutical',
          therapeuticFocus: ['oncology', 'infectious_disease']
        },
        therapeuticAreas: [
          { id: 'ta-1', name: 'Oncology', code: 'ONC' },
          { id: 'ta-2', name: 'Infectious Disease', code: 'INF' }
        ],
        aiModelTypes: [
          { id: 'amt-1', name: 'Diagnostic AI', description: 'AI models for medical diagnosis' },
          { id: 'amt-2', name: 'Predictive Analytics', description: 'AI models for outcome prediction' }
        ],
        deploymentScenarios: [
          { id: 'ds-1', name: 'Clinical Decision Support', description: 'AI-assisted clinical decision making' },
          { id: 'ds-2', name: 'Research & Development', description: 'AI in drug discovery and development' }
        ],
        learningInsights: [
          {
            id: 'li-1',
            insight: 'Strong data governance framework implementation',
            category: 'strength',
            confidence: 0.9,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'li-2',
            insight: 'Model validation processes need improvement',
            category: 'improvement',
            confidence: 0.8,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'assessment-2',
        assessmentName: 'Regulatory Compliance Review',
        status: 'in_progress',
        currentScore: 72,
        maxPossibleScore: 100,
        completionRate: 78,
        criticalBlockers: 3,
        completedSections: 6,
        totalSections: 10,
        personaId: 'regulatory-specialist',
        subPersonaId: 'senior-regulatory',
        tenantId: companyId || 'gilead-sciences',
        version: '1.0',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        tenant: {
          id: companyId || 'gilead-sciences',
          name: 'Gilead Sciences',
          industryType: 'Pharmaceutical',
          therapeuticFocus: ['oncology', 'infectious_disease']
        },
        therapeuticAreas: [
          { id: 'ta-1', name: 'Oncology', code: 'ONC' }
        ],
        aiModelTypes: [
          { id: 'amt-1', name: 'Diagnostic AI', description: 'AI models for medical diagnosis' }
        ],
        deploymentScenarios: [
          { id: 'ds-1', name: 'Clinical Decision Support', description: 'AI-assisted clinical decision making' }
        ],
        learningInsights: [
          {
            id: 'li-3',
            insight: 'Regulatory documentation gaps identified',
            category: 'risk',
            confidence: 0.85,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'assessment-3',
        assessmentName: 'Data Quality Assessment',
        status: 'failed',
        currentScore: 45,
        maxPossibleScore: 100,
        completionRate: 60,
        criticalBlockers: 5,
        completedSections: 4,
        totalSections: 10,
        personaId: 'data-engineer',
        subPersonaId: 'senior-data-engineer',
        tenantId: companyId || 'gilead-sciences',
        version: '1.0',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        tenant: {
          id: companyId || 'gilead-sciences',
          name: 'Gilead Sciences',
          industryType: 'Pharmaceutical',
          therapeuticFocus: ['oncology', 'infectious_disease']
        },
        therapeuticAreas: [
          { id: 'ta-2', name: 'Infectious Disease', code: 'INF' }
        ],
        aiModelTypes: [
          { id: 'amt-2', name: 'Predictive Analytics', description: 'AI models for outcome prediction' }
        ],
        deploymentScenarios: [
          { id: 'ds-2', name: 'Research & Development', description: 'AI in drug discovery and development' }
        ],
        learningInsights: [
          {
            id: 'li-4',
            insight: 'Critical data quality issues preventing completion',
            category: 'blocker',
            confidence: 0.95,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];

    // Filter mock data based on query parameters
    let filteredAssessments = mockAssessments;
    
    if (status) {
      filteredAssessments = filteredAssessments.filter(a => a.status === status);
    }
    
    // Apply limit
    filteredAssessments = filteredAssessments.slice(0, limit);

    const summary = {
      totalAssessments: filteredAssessments.length,
      completedAssessments: filteredAssessments.filter(a => a.status === 'completed').length,
      inProgressAssessments: filteredAssessments.filter(a => a.status === 'in_progress').length,
      failedAssessments: filteredAssessments.filter(a => a.status === 'failed').length,
      averageScore: Math.round(filteredAssessments.reduce((sum, a) => sum + a.currentScore, 0) / filteredAssessments.length) || 0
    };

    return NextResponse.json({
      success: true,
      data: filteredAssessments,
      summary,
      message: 'Assessments loaded (simplified for deployment compatibility)'
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
