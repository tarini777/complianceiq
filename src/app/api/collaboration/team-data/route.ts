import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    // Get all assessments with their related data
    const assessments = await prisma.assessment.findMany({
      where: {
        tenant: {
          name: 'Gilead Sciences'
        }
      },
      include: {
        tenant: true,
        learningInsights: true,
        collaborationSessions: {
          include: {
            participants: {
              include: {
                user: true
              }
            },
            messages: {
              take: 5,
              orderBy: {
                createdAt: 'desc'
              },
              include: {
                user: true
              }
            }
          }
        },
        therapeuticAreas: true,
        aiModelTypes: true,
        deploymentScenarios: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get collaboration sessions
    const collaborationSessions = await prisma.collaborationSession.findMany({
      where: {
        organization: {
          name: {
            contains: 'Gilead'
          }
        }
      },
      include: {
        participants: {
          include: {
            user: true
          }
        },
        messages: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: true
          }
        },
        analytics: true,
        teamMetrics: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Get users and organizations
    const users = await prisma.user.findMany({
      where: {
        organization: {
          name: {
            contains: 'Gilead'
          }
        }
      },
      include: {
        role: true,
        organization: true,
        collaborationAnalytics: true
      }
    });

    const organizations = await prisma.organization.findMany({
      where: {
        name: {
          contains: 'Gilead'
        }
      },
      include: {
        users: {
          include: {
            role: true
          }
        },
        roles: true
      }
    });

    // Generate team performance metrics
    const teamPerformance = users.map(user => {
      const userSessions = collaborationSessions.filter(session => 
        session.participants.some(p => p.userId === user.id)
      );

      const completedAssessments = assessments.filter(assessment => 
        assessment.status === 'completed' && 
        assessment.collaborationSessions.some(session => 
          session.participants.some(p => p.userId === user.id)
        )
      );

      const failedAssessments = assessments.filter(assessment => 
        assessment.status === 'failed' && 
        assessment.collaborationSessions.some(session => 
          session.participants.some(p => p.userId === user.id)
        )
      );

      const inProgressAssessments = assessments.filter(assessment => 
        assessment.status === 'in_progress' && 
        assessment.collaborationSessions.some(session => 
          session.participants.some(p => p.userId === user.id)
        )
      );

      const successRate = completedAssessments.length + failedAssessments.length > 0 
        ? Math.round((completedAssessments.length / (completedAssessments.length + failedAssessments.length)) * 100)
        : 0;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name || 'Team Member',
        department: user.organization?.name || 'Gilead Sciences',
        expertise: ['AI Compliance', 'Data Science', 'Regulatory Affairs', 'Quality Assurance'],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`,
        isOnline: Math.random() > 0.3, // Mock online status
        lastActive: user.lastLoginAt || new Date().toISOString(),
        currentTask: inProgressAssessments.length > 0 ? `Working on ${inProgressAssessments[0].assessmentName}` : null,
        performance: {
          completed: completedAssessments.length,
          inProgress: inProgressAssessments.length,
          failed: failedAssessments.length,
          successRate
        },
        collaborationStats: {
          sessionsParticipated: userSessions.length,
          messagesSent: userSessions.reduce((total, session) => 
            total + session.messages.filter(msg => msg.userId === user.id).length, 0
          ),
          averageResponseTime: Math.floor(Math.random() * 120) + 30 // Mock data
        }
      };
    });

    // Generate compliance journey data
    const complianceJourneys = assessments.map(assessment => {
      const insights = assessment.learningInsights || [];
      const failureInsights = insights.filter(insight => 
        insight.insightType === 'failure_analysis'
      );
      const successInsights = insights.filter(insight => 
        insight.insightType === 'success_analysis'
      );

      // Generate timeline based on assessment status and insights
      const timeline = [
        {
          phase: 'Initial Assessment',
          status: 'completed' as const,
          date: assessment.createdAt.toISOString(),
          responsible: 'AI Governance Lead',
          notes: 'Initial compliance assessment completed'
        }
      ];

      if (assessment.status === 'completed') {
        timeline.push(
          {
            phase: 'Data Observability Review',
            status: 'completed' as const,
            date: new Date(assessment.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            responsible: 'Data Scientist',
            notes: 'Data observability framework validated'
          },
          {
            phase: 'FDA AI Governance Compliance',
            status: 'completed' as const,
            date: new Date(assessment.createdAt.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            responsible: 'Regulatory Affairs Manager',
            notes: 'FDA AI governance requirements met'
          },
          {
            phase: 'Model Validation',
            status: 'completed' as const,
            date: new Date(assessment.createdAt.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            responsible: 'Quality Assurance Lead',
            notes: 'Validation protocols approved'
          },
          {
            phase: 'Final Review',
            status: 'completed' as const,
            date: assessment.completedAt?.toISOString() || new Date().toISOString(),
            responsible: 'Compliance Officer',
            notes: 'Final compliance review completed successfully'
          }
        );
      } else if (assessment.status === 'failed') {
        timeline.push(
          {
            phase: 'Data Observability Review',
            status: 'completed' as const,
            date: new Date(assessment.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            responsible: 'Data Scientist',
            notes: 'Insufficient monitoring and tracking capabilities identified'
          },
          {
            phase: 'FDA AI Governance Compliance',
            status: 'completed' as const,
            date: new Date(assessment.createdAt.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            responsible: 'Regulatory Affairs Manager',
            notes: 'Missing required AI governance framework documentation'
          }
        );
      } else if (assessment.status === 'in_progress') {
        timeline.push(
          {
            phase: 'Data Observability Review',
            status: 'completed' as const,
            date: new Date(assessment.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            responsible: 'Data Scientist',
            notes: 'Data observability framework under review'
          },
          {
            phase: 'FDA AI Governance Compliance',
            status: 'completed' as const,
            date: new Date(assessment.createdAt.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            responsible: 'Regulatory Affairs Manager',
            notes: 'AI governance documentation in progress'
          },
          {
            phase: 'Model Validation',
            status: 'completed' as const,
            date: new Date(assessment.createdAt.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            responsible: 'Quality Assurance Lead',
            notes: 'Pending model validation review'
          }
        );
      }

      // Get team members from collaboration sessions
      const teamMembers = assessment.collaborationSessions.flatMap(session => 
        session.participants.map(p => p.userId)
      );

      return {
        id: assessment.id,
        assessmentName: assessment.assessmentName,
        status: assessment.status,
        currentScore: assessment.currentScore,
        maxScore: assessment.maxPossibleScore,
        teamMembers: [...new Set(teamMembers)], // Remove duplicates
        timeline,
        failureReasons: failureInsights.length > 0 ? [
          'Data Observability Gaps - Insufficient monitoring and tracking of AI model performance in production',
          'FDA AI Governance 2025 Compliance - Missing required AI governance framework documentation',
          'Model Validation Documentation - Incomplete validation protocols for AI/ML models'
        ] : undefined,
        successFactors: successInsights.length > 0 ? [
          'Strong data governance framework implementation',
          'Comprehensive AI model validation protocols',
          'Effective regulatory documentation and compliance',
          'Robust monitoring and observability systems'
        ] : undefined,
        regulatoryIntelligence: {
          regulations: ['FDA 21 CFR Part 11', 'FDA AI/ML Software as Medical Device', 'GDPR Article 25'],
          guidance: ['FDA AI/ML Good Machine Learning Practices', 'ICH E6(R2) Good Clinical Practice'],
          bestPractices: ['Model Validation Framework', 'Data Quality Assurance', 'Risk Management'],
          riskFactors: ['Model Drift', 'Data Bias', 'Regulatory Changes', 'Cybersecurity Threats']
        },
        therapeuticAreas: assessment.therapeuticAreas.map(ta => ta.name),
        aiModelTypes: assessment.aiModelTypes.map(amt => amt.name),
        deploymentScenarios: assessment.deploymentScenarios.map(ds => ds.name)
      };
    });

    // Generate regulatory intelligence data
    const regulatoryIntelligence = [
      {
        id: 'reg-1',
        title: 'FDA AI/ML Software as Medical Device - Final Guidance',
        source: 'FDA',
        category: 'regulation',
        relevance: 'high',
        lastUpdated: '2024-01-15',
        content: 'Final guidance on AI/ML software as medical device, including validation requirements and lifecycle management.',
        relatedAssessments: assessments.slice(0, 2).map(a => a.assessmentName),
        impact: 'High impact on AI model validation and documentation requirements'
      },
      {
        id: 'reg-2',
        title: 'Data Observability Best Practices for Pharmaceutical AI',
        source: 'Pharmaceutical AI Consortium',
        category: 'best_practice',
        relevance: 'high',
        lastUpdated: '2024-02-01',
        content: 'Comprehensive guide on implementing data observability frameworks for pharmaceutical AI applications.',
        relatedAssessments: assessments.slice(2, 4).map(a => a.assessmentName),
        impact: 'Critical for addressing data observability gaps in current assessments'
      },
      {
        id: 'reg-3',
        title: 'EU AI Act Compliance Requirements',
        source: 'European Commission',
        category: 'regulation',
        relevance: 'medium',
        lastUpdated: '2024-01-20',
        content: 'New EU AI Act requirements for high-risk AI systems in healthcare and pharmaceutical applications.',
        relatedAssessments: assessments.slice(4, 5).map(a => a.assessmentName),
        impact: 'Medium impact on EU market compliance requirements'
      },
      {
        id: 'reg-4',
        title: 'Risk Alert: Model Drift in Clinical Trial AI',
        source: 'FDA Safety Communication',
        category: 'risk_alert',
        relevance: 'high',
        lastUpdated: '2024-02-10',
        content: 'Safety alert regarding model drift in AI systems used for clinical trial patient stratification.',
        relatedAssessments: assessments.slice(5, 6).map(a => a.assessmentName),
        impact: 'High risk for clinical trial AI applications requiring immediate attention'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        teamMembers: teamPerformance,
        complianceJourneys,
        regulatoryIntelligence,
        collaborationSessions: collaborationSessions.map(session => ({
          id: session.id,
          sessionName: session.sessionName,
          description: session.description,
          status: session.status,
          participants: session.participants.map(p => ({
            id: p.user.id,
            name: p.user.name,
            role: p.role,
            status: p.status
          })),
          messageCount: session.messages.length,
          lastActivity: session.updatedAt,
          analytics: session.analytics,
          teamMetrics: session.teamMetrics
        })),
        organizations,
        summary: {
          totalAssessments: assessments.length,
          completedAssessments: assessments.filter(a => a.status === 'completed').length,
          inProgressAssessments: assessments.filter(a => a.status === 'in_progress').length,
          failedAssessments: assessments.filter(a => a.status === 'failed').length,
          successRate: Math.round((assessments.filter(a => a.status === 'completed').length / assessments.length) * 100),
          activeTeamMembers: teamPerformance.filter(m => m.isOnline).length,
          totalTeamMembers: teamPerformance.length,
          highPriorityAlerts: regulatoryIntelligence.filter(r => r.relevance === 'high').length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching collaboration team data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch collaboration team data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
