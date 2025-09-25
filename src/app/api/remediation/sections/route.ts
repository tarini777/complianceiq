import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

// Mock sections data for build compatibility
function getAllSections() {
  return [
    {
      id: 'data-governance',
      title: 'Data Governance & Quality',
      category: 'critical',
      isCritical: true
    },
    {
      id: 'model-validation',
      title: 'Model Validation & Testing',
      category: 'high',
      isCritical: true
    },
    {
      id: 'regulatory-compliance',
      title: 'Regulatory Compliance',
      category: 'critical',
      isCritical: true
    },
    {
      id: 'security-privacy',
      title: 'Security & Privacy',
      category: 'high',
      isCritical: false
    },
    {
      id: 'monitoring-observability',
      title: 'Monitoring & Observability',
      category: 'medium',
      isCritical: false
    }
  ];
}

// Helper function to categorize performance
function categorizePerformance(score: number, completionRate: number): string {
  if (score >= 80 && completionRate >= 90) return 'excellent';
  if (score >= 70 && completionRate >= 80) return 'good';
  if (score >= 60 && completionRate >= 70) return 'average';
  if (score >= 40 && completionRate >= 50) return 'needs-improvement';
  return 'critical-gap';
}

// Helper function to generate realistic scores
function generateRealisticScore(sectionId: string, assessments: any[], allSections: any[]): number {
  const sectionAssessments = assessments.filter(a => 
    a.assessmentName.toLowerCase().includes(sectionId.replace('-', ' ')) ||
    a.assessmentName.toLowerCase().includes(sectionId.split('-')[0])
  );
  
  if (sectionAssessments.length === 0) {
    // Generate based on section category
    const section = allSections.find(s => s.id === sectionId);
    const baseScore = section?.category === 'critical' ? 45 : 
                     section?.category === 'high' ? 55 : 
                     section?.category === 'medium' ? 65 : 75;
    return baseScore + Math.floor(Math.random() * 20);
  }
  
  const avgScore = sectionAssessments.reduce((sum, a) => sum + (a.currentScore || 0), 0) / sectionAssessments.length;
  return Math.round(avgScore);
}

// Helper function to generate completion rates
function generateRealisticCompletionRate(sectionId: string, assessments: any[]): number {
  const sectionAssessments = assessments.filter(a => 
    a.assessmentName.toLowerCase().includes(sectionId.replace('-', ' ')) ||
    a.assessmentName.toLowerCase().includes(sectionId.split('-')[0])
  );
  
  if (sectionAssessments.length === 0) {
    return 60 + Math.floor(Math.random() * 30);
  }
  
  const completedCount = sectionAssessments.filter(a => a.status === 'completed').length;
  return Math.round((completedCount / sectionAssessments.length) * 100);
}

// Helper function to count assessments by status
function countAssessmentsByStatus(sectionId: string, assessments: any[], status: string): number {
  return assessments.filter(a => {
    const matchesSection = a.assessmentName.toLowerCase().includes(sectionId.replace('-', ' ')) ||
                          a.assessmentName.toLowerCase().includes(sectionId.split('-')[0]);
    return matchesSection && a.status === status;
  }).length;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Remediation sections API called (simplified for build compatibility)');
    
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');

    // Get all sections (mock data for build compatibility)
    const ALL_SECTIONS = getAllSections();

    if (sectionId) {
      // Return detailed data for a specific section
      const section = ALL_SECTIONS.find(s => s.id === sectionId);
      if (!section) {
        return NextResponse.json(
          { success: false, error: 'Section not found' },
          { status: 404 }
        );
      }

      // Generate mock data for specific section
      const score = 65 + Math.floor(Math.random() * 25);
      const completionRate = 70 + Math.floor(Math.random() * 25);
      const performanceLevel = categorizePerformance(score, completionRate);

      const sectionData = {
        id: section.id,
        title: section.title,
        category: section.category,
        performanceLevel,
        score,
        completionRate,
        totalAssessments: 8,
        assessments: {
          completed: 5,
          inProgress: 2,
          failed: 1,
          pending: 0,
        },
        assessmentsList: [
          {
            id: `assessment-${sectionId}-1`,
            assessmentName: `${section.title} Assessment 1`,
            status: 'completed',
            currentScore: score,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        criticalGaps: generateCriticalGaps(sectionId, []),
        successFactors: generateSuccessFactors(sectionId, performanceLevel),
        regulatoryRequirements: generateRegulatoryRequirements(sectionId),
        teamMembers: generateTeamMembers(sectionId),
        timeline: generateTimeline(sectionId, performanceLevel),
        insights: generateDynamicInsights(sectionId, performanceLevel, [])
      };

      return NextResponse.json({ 
        success: true, 
        data: sectionData,
        message: 'Section data loaded (simplified for deployment compatibility)'
      });
    }

    // Return overview of all sections
    const sectionsOverview = ALL_SECTIONS.map(section => {
      const score = 60 + Math.floor(Math.random() * 30);
      const completionRate = 65 + Math.floor(Math.random() * 30);
      const performanceLevel = categorizePerformance(score, completionRate);

      return {
        id: section.id,
        title: section.title,
        category: section.category,
        performanceLevel,
        score,
        completionRate,
        totalAssessments: 6 + Math.floor(Math.random() * 4),
        assessments: {
          completed: Math.floor(Math.random() * 5) + 3,
          inProgress: Math.floor(Math.random() * 3) + 1,
          failed: Math.floor(Math.random() * 2),
          pending: Math.floor(Math.random() * 2),
        },
        criticalGaps: Math.floor(Math.random() * 3),
        priority: section.category === 'critical' ? 'high' : 
                 section.category === 'high' ? 'medium' : 'low'
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: sectionsOverview,
      message: 'Remediation sections loaded (simplified for deployment compatibility)'
    });
  } catch (error) {
    console.error('Error fetching remediation sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch remediation sections', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper functions for detailed section data
function generateCriticalGaps(sectionId: string, assessments: any[]): any[] {
  const gaps = [];
  const failedAssessments = assessments.filter(a => a.status === 'failed');
  
  if (failedAssessments.length > 0) {
    gaps.push({
      id: `gap-${sectionId}-1`,
      title: `${failedAssessments.length} Failed Assessments`,
      description: `Critical compliance gaps identified in ${sectionId.replace('-', ' ')}`,
      severity: 'high',
      impact: 'compliance',
      affectedAssessments: failedAssessments.map(a => a.id)
    });
  }

  const lowScoreAssessments = assessments.filter(a => a.currentScore < 60);
  if (lowScoreAssessments.length > 0) {
    gaps.push({
      id: `gap-${sectionId}-2`,
      title: 'Low Performance Scores',
      description: `${lowScoreAssessments.length} assessments scoring below 60%`,
      severity: 'medium',
      impact: 'quality',
      affectedAssessments: lowScoreAssessments.map(a => a.id)
    });
  }

  return gaps;
}

function generateSuccessFactors(sectionId: string, performanceLevel: string): any[] {
  const factors = [];
  
  if (performanceLevel === 'excellent') {
    factors.push({
      id: `factor-${sectionId}-1`,
      title: 'Strong Governance Framework',
      description: 'Well-established processes and controls',
      impact: 'positive'
    });
  } else if (performanceLevel === 'critical-gap') {
    factors.push({
      id: `factor-${sectionId}-1`,
      title: 'Immediate Action Required',
      description: 'Critical gaps need urgent attention',
      impact: 'negative'
    });
  }

  return factors;
}

function generateRegulatoryRequirements(sectionId: string): any[] {
  const requirements = [];
  
  if (sectionId.includes('fda') || sectionId.includes('governance')) {
    requirements.push({
      id: `req-${sectionId}-1`,
      title: 'FDA AI Governance 2025',
      citation: 'FDA Guidance on AI/ML in Medical Devices',
      status: 'pending',
      deadline: '2025-12-31',
      description: 'Comprehensive AI governance framework required'
    });
  }

  if (sectionId.includes('data') || sectionId.includes('observability')) {
    requirements.push({
      id: `req-${sectionId}-2`,
      title: 'Data Observability Standards',
      citation: '21 CFR Part 11',
      status: 'in_progress',
      deadline: '2024-06-30',
      description: 'Real-time data monitoring and validation'
    });
  }

  return requirements;
}

function generateTeamMembers(sectionId: string): any[] {
  const teams = {
    'data-governance': ['Data Scientist', 'Data Engineer', 'Compliance Officer'],
    'model-validation': ['ML Engineer', 'QA Engineer', 'Data Scientist'],
    'regulatory-compliance': ['Compliance Officer', 'Legal Counsel', 'Regulatory Affairs'],
    'security': ['Security Engineer', 'Privacy Officer', 'IT Security'],
    'monitoring': ['ML Engineer', 'DevOps Engineer', 'Data Scientist']
  };

  const roles = teams[sectionId as keyof typeof teams] || ['Project Manager', 'Compliance Officer', 'Technical Lead'];

  return roles.map((role, index) => ({
    id: `member-${sectionId}-${index}`,
    name: `Team Member ${index + 1}`,
    role,
    responsibility: `Lead ${role.toLowerCase()} activities`,
    status: index === 0 ? 'active' : 'pending',
    progress: Math.floor(Math.random() * 100)
  }));
}

function generateTimeline(sectionId: string, performanceLevel: string): any[] {
  const phases = [
    {
      id: `phase-${sectionId}-1`,
      title: 'Immediate Actions',
      duration: '0-30 days',
      status: performanceLevel === 'critical-gap' ? 'urgent' : 'pending',
      tasks: ['Assess current state', 'Identify critical gaps', 'Assign team members']
    },
    {
      id: `phase-${sectionId}-2`,
      title: 'Short-term Improvements',
      duration: '1-3 months',
      status: 'planned',
      tasks: ['Implement basic controls', 'Deploy monitoring tools', 'Train team members']
    },
    {
      id: `phase-${sectionId}-3`,
      title: 'Long-term Optimization',
      duration: '3-6 months',
      status: 'planned',
      tasks: ['Advanced automation', 'Continuous monitoring', 'Process optimization']
    }
  ];

  return phases;
}

function generateDynamicInsights(sectionId: string, performanceLevel: string, assessments: any[]): any {
  const insights = {
    keyFindings: [] as string[],
    recommendations: [] as string[],
    riskFactors: [] as string[],
    opportunities: [] as string[]
  };

  if (performanceLevel === 'critical-gap') {
    insights.keyFindings.push(`${assessments.length} assessments require immediate attention`);
    insights.recommendations.push('Implement emergency remediation plan');
    insights.riskFactors.push('High compliance risk');
    insights.opportunities.push('Significant improvement potential');
  } else if (performanceLevel === 'excellent') {
    insights.keyFindings.push('Strong performance across all metrics');
    insights.recommendations.push('Maintain current standards and optimize further');
    insights.riskFactors.push('Low risk profile');
    insights.opportunities.push('Share best practices with other teams');
  }

  return insights;
}
