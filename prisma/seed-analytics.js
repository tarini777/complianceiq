/**
 * Seed script for Collaboration Analytics
 * Creates sample analytics data for testing and demonstration
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAnalytics() {
  console.log('🌱 Seeding collaboration analytics...');

  try {
    // Get existing data
    const sessions = await prisma.collaborationSession.findMany({
      include: {
        participants: {
          include: {
            user: true
          }
        }
      }
    });

    const organizations = await prisma.organization.findMany();
    const users = await prisma.user.findMany();

    if (sessions.length === 0 || organizations.length === 0 || users.length === 0) {
      console.log('⚠️ Missing required data. Please run other seed scripts first.');
      return;
    }

    // Create collaboration analytics for each participant
    for (const session of sessions) {
      const organization = organizations[0]; // Use first organization
      
      for (const participant of session.participants) {
        // Create collaboration analytics
        await prisma.collaborationAnalytics.upsert({
          where: {
            sessionId_userId: {
              sessionId: session.id,
              userId: participant.userId
            }
          },
          update: {},
          create: {
            sessionId: session.id,
            userId: participant.userId,
            organizationId: organization.id,
            messagesSent: Math.floor(Math.random() * 50) + 10,
            messagesReceived: Math.floor(Math.random() * 80) + 15,
            responseTime: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
            activeMinutes: Math.floor(Math.random() * 120) + 30,
            threadsCreated: Math.floor(Math.random() * 5),
            reactionsGiven: Math.floor(Math.random() * 20),
            reactionsReceived: Math.floor(Math.random() * 15),
            mentionsSent: Math.floor(Math.random() * 10),
            mentionsReceived: Math.floor(Math.random() * 8),
            assessmentSectionsViewed: Math.floor(Math.random() * 15) + 5,
            assessmentSectionsCompleted: Math.floor(Math.random() * 10) + 2,
            assessmentProgress: Math.random() * 0.8 + 0.2, // 20-100%
            lastActivityAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Last 24 hours
          }
        });

        // Create communication patterns
        await prisma.communicationPattern.upsert({
          where: {
            sessionId_userId: {
              sessionId: session.id,
              userId: participant.userId
            }
          },
          update: {},
          create: {
            sessionId: session.id,
            userId: participant.userId,
            organizationId: organization.id,
            peakActivityHour: Math.floor(Math.random() * 24),
            averageMessageLength: Math.random() * 50 + 20,
            messagesPerHour: Math.random() * 5 + 1,
            responseRate: Math.random() * 0.4 + 0.6, // 60-100%
            mostActiveWith: Math.random() > 0.5 ? session.participants[Math.floor(Math.random() * session.participants.length)]?.userId : null,
            threadParticipation: Math.random() * 0.6 + 0.4, // 40-100%
            mentionFrequency: Math.random() * 0.3 + 0.1, // 10-40%
            activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].slice(0, Math.floor(Math.random() * 3) + 3),
            sessionDuration: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
            breakFrequency: Math.floor(Math.random() * 3) + 1,
            questionRatio: Math.random() * 0.3 + 0.1, // 10-40%
            directiveRatio: Math.random() * 0.2 + 0.05, // 5-25%
            supportiveRatio: Math.random() * 0.4 + 0.2 // 20-60%
          }
        });
      }

      // Create team performance metrics
      await prisma.teamPerformanceMetrics.upsert({
        where: {
          sessionId: session.id
        },
        update: {},
        create: {
          sessionId: session.id,
          organizationId: organization.id,
          totalParticipants: session.participants.length,
          activeParticipants: Math.floor(session.participants.length * (Math.random() * 0.4 + 0.6)), // 60-100%
          averageResponseTime: Math.random() * 300 + 60,
          messageVolume: Math.floor(Math.random() * 200) + 50,
          collaborationScore: Math.random() * 0.4 + 0.6, // 60-100%
          engagementScore: Math.random() * 0.4 + 0.6,
          productivityScore: Math.random() * 0.4 + 0.6,
          communicationClarity: Math.random() * 0.4 + 0.6,
          assessmentCompletionRate: Math.random() * 0.6 + 0.4, // 40-100%
          averageAssessmentScore: Math.random() * 20 + 70, // 70-90%
          timeToCompletion: Math.floor(Math.random() * 120) + 60, // 1-3 hours
          bottleneckSeverity: Math.random() > 0.7 ? Math.random() * 0.6 + 0.4 : null, // 30% chance
          bottleneckType: Math.random() > 0.7 ? ['communication', 'decision', 'technical', 'resource'][Math.floor(Math.random() * 4)] : null,
          bottleneckDescription: Math.random() > 0.7 ? 'Potential collaboration bottleneck detected in team workflow' : null,
          riskScore: Math.random() * 0.3 + 0.1, // 10-40%
          successProbability: Math.random() * 0.3 + 0.7, // 70-100%
          recommendedActions: JSON.stringify([
            'Increase communication frequency',
            'Set clear deadlines',
            'Provide additional resources',
            'Schedule regular check-ins'
          ])
        }
      });
    }

    // Create some predictive insights
    const insightTypes = ['bottleneck', 'risk', 'opportunity', 'performance'];
    const insightCategories = ['communication', 'workflow', 'team', 'assessment'];
    const timeframes = ['immediate', 'short-term', 'long-term'];

    for (let i = 0; i < 10; i++) {
      const session = sessions[Math.floor(Math.random() * sessions.length)];
      const organization = organizations[0];
      const insightType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
      const category = insightCategories[Math.floor(Math.random() * insightCategories.length)];
      const severity = Math.random() * 0.6 + 0.4; // 40-100%
      const confidence = Math.random() * 0.4 + 0.6; // 60-100%

      const insights = {
        bottleneck: {
          title: 'Communication Bottleneck Detected',
          description: 'Team members are experiencing delays in information sharing, leading to slower decision-making processes.',
          recommendation: 'Implement daily stand-up meetings and establish clear communication channels.'
        },
        risk: {
          title: 'Assessment Completion Risk',
          description: 'Current progress indicates potential delays in meeting assessment deadlines.',
          recommendation: 'Reallocate resources and prioritize critical assessment sections.'
        },
        opportunity: {
          title: 'Team Collaboration Optimization',
          description: 'Analysis shows potential for improving team efficiency through better task distribution.',
          recommendation: 'Consider redistributing workload based on individual strengths and availability.'
        },
        performance: {
          title: 'Performance Improvement Opportunity',
          description: 'Team metrics indicate areas where productivity could be enhanced.',
          recommendation: 'Implement performance tracking and provide targeted feedback sessions.'
        }
      };

      const insight = insights[insightType];

      await prisma.predictiveInsight.create({
        data: {
          sessionId: session.id,
          organizationId: organization.id,
          insightType,
          insightCategory: category,
          severity,
          confidence,
          title: insight.title,
          description: insight.description,
          recommendation: insight.recommendation,
          timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
          triggerMetrics: JSON.stringify([
            'response_time_increase',
            'message_volume_decrease',
            'participation_drop'
          ]),
          supportingEvidence: JSON.stringify([
            { metric: 'average_response_time', value: '4.2 minutes', threshold: '3.0 minutes' },
            { metric: 'daily_messages', value: '45', threshold: '60' },
            { metric: 'active_participants', value: '3/5', threshold: '4/5' }
          ])
        }
      });
    }

    console.log('✅ Collaboration analytics seeded successfully!');
    console.log(`   - Created analytics for ${sessions.length} sessions`);
    console.log(`   - Created team performance metrics for ${sessions.length} sessions`);
    console.log(`   - Created 10 predictive insights`);
    console.log(`   - Created communication patterns for all participants`);

  } catch (error) {
    console.error('❌ Error seeding analytics:', error);
    throw error;
  }
}

// Run the seed function
seedAnalytics()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
