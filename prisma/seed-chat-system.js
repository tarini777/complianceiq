/**
 * Chat System Seed Data
 * Creates sample collaboration sessions, threads, and messages for testing
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding chat system...');

  try {
    // Get existing data
    const organizations = await prisma.organization.findMany();
    const users = await prisma.user.findMany();
    const assessments = await prisma.assessment.findMany();
    const sections = await prisma.assessmentSection.findMany();

    if (organizations.length === 0 || users.length === 0 || assessments.length === 0) {
      console.log('⚠️  Missing required data. Please run other seed scripts first.');
      return;
    }

    const org = organizations[0];
    const creator = users[0];
    const assessment = assessments[0];
    const section = sections[0];

    // Create collaboration sessions
    const sessions = [
      {
        assessmentId: assessment.id,
        organizationId: org.id,
        sessionName: 'AI Governance Committee Review',
        description: 'Cross-functional review of AI governance framework implementation',
        createdBy: creator.id,
        status: 'active'
      },
      {
        assessmentId: assessment.id,
        organizationId: org.id,
        sessionName: 'Regulatory Compliance Discussion',
        description: 'FDA and EMA compliance requirements review',
        createdBy: creator.id,
        status: 'active'
      },
      {
        assessmentId: assessment.id,
        organizationId: org.id,
        sessionName: 'Technical Architecture Review',
        description: 'System architecture and interoperability assessment',
        createdBy: creator.id,
        status: 'paused'
      }
    ];

    const createdSessions = [];
    for (const sessionData of sessions) {
      const session = await prisma.collaborationSession.upsert({
        where: { 
          id: `session-${sessionData.sessionName.toLowerCase().replace(/\s+/g, '-')}`
        },
        update: sessionData,
        create: {
          id: `session-${sessionData.sessionName.toLowerCase().replace(/\s+/g, '-')}`,
          ...sessionData
        }
      });
      createdSessions.push(session);
    }

    // Add participants to sessions
    for (let i = 0; i < createdSessions.length; i++) {
      const session = createdSessions[i];
      const sessionUsers = users.slice(0, Math.min(3, users.length)); // Add first 3 users

      for (let j = 0; j < sessionUsers.length; j++) {
        const user = sessionUsers[j];
        const role = j === 0 ? 'owner' : (j === 1 ? 'editor' : 'viewer');
        
        await prisma.sessionParticipant.upsert({
          where: {
            sessionId_userId: {
              sessionId: session.id,
              userId: user.id
            }
          },
          update: {
            role,
            status: 'active',
            lastActive: new Date()
          },
          create: {
            sessionId: session.id,
            userId: user.id,
            role,
            status: 'active',
            joinedAt: new Date(),
            lastActive: new Date()
          }
        });
      }
    }

    // Create chat threads
    const threads = [
      {
        sessionId: createdSessions[0].id,
        threadName: 'General Discussion',
        createdBy: creator.id
      },
      {
        sessionId: createdSessions[0].id,
        threadName: 'Section 19: AI Governance Committee',
        sectionId: section.id,
        createdBy: creator.id
      },
      {
        sessionId: createdSessions[1].id,
        threadName: 'FDA Requirements',
        createdBy: creator.id
      },
      {
        sessionId: createdSessions[1].id,
        threadName: 'EMA Guidelines',
        createdBy: creator.id
      }
    ];

    const createdThreads = [];
    for (const threadData of threads) {
      const thread = await prisma.chatThread.upsert({
        where: {
          id: `thread-${threadData.threadName.toLowerCase().replace(/\s+/g, '-')}-${threadData.sessionId}`
        },
        update: threadData,
        create: {
          id: `thread-${threadData.threadName.toLowerCase().replace(/\s+/g, '-')}-${threadData.sessionId}`,
          ...threadData
        }
      });
      createdThreads.push(thread);
    }

    // Create sample messages
    const messages = [
      // General discussion messages
      {
        sessionId: createdSessions[0].id,
        threadId: createdThreads[0].id,
        userId: creator.id,
        content: 'Welcome to the AI Governance Committee review session! Let\'s start by discussing our current governance framework.',
        messageType: 'text',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        sessionId: createdSessions[0].id,
        threadId: createdThreads[0].id,
        userId: users[1]?.id || creator.id,
        content: 'Thanks for setting this up! I\'ve reviewed the current framework and have some suggestions for improvement.',
        messageType: 'text',
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000) // 1.5 hours ago
      },
      {
        sessionId: createdSessions[0].id,
        threadId: createdThreads[0].id,
        userId: creator.id,
        content: 'Great! Please share your thoughts. I\'m particularly interested in the cross-functional representation aspect.',
        messageType: 'text',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      // Section-specific messages
      {
        sessionId: createdSessions[0].id,
        threadId: createdThreads[1].id,
        userId: creator.id,
        content: 'Let\'s focus on Section 19 - AI Governance Committee structure. What are the key requirements we need to address?',
        messageType: 'text',
        createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      },
      {
        sessionId: createdSessions[0].id,
        threadId: createdThreads[1].id,
        userId: users[2]?.id || creator.id,
        content: 'Based on the assessment, we need executive leadership, cross-functional teams, and clear role definitions. This is marked as a production blocker.',
        messageType: 'text',
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      // System message
      {
        sessionId: createdSessions[0].id,
        threadId: createdThreads[0].id,
        userId: creator.id,
        content: `${users[1]?.name || 'User'} joined the session`,
        messageType: 'system',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    for (const messageData of messages) {
      await prisma.chatMessage.create({
        data: {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...messageData
        }
      });
    }

    // Create message reactions
    const reactions = [
      {
        messageId: (await prisma.chatMessage.findFirst({ where: { content: { contains: 'Welcome to the AI Governance' } } }))?.id,
        userId: users[1]?.id || creator.id,
        emoji: '👍'
      },
      {
        messageId: (await prisma.chatMessage.findFirst({ where: { content: { contains: 'production blocker' } } }))?.id,
        userId: creator.id,
        emoji: '🚨'
      }
    ];

    for (const reactionData of reactions) {
      if (reactionData.messageId) {
        await prisma.messageReaction.upsert({
          where: {
            messageId_userId_emoji: {
              messageId: reactionData.messageId,
              userId: reactionData.userId,
              emoji: reactionData.emoji
            }
          },
          update: reactionData,
          create: reactionData
        });
      }
    }

    // Create sample invitations
    const invitations = [
      {
        sessionId: createdSessions[0].id,
        email: 'external.expert@consulting.com',
        role: 'reviewer',
        invitedBy: creator.id,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        sessionId: createdSessions[1].id,
        email: 'regulatory.specialist@fda.gov',
        role: 'viewer',
        invitedBy: creator.id,
        status: 'accepted',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const invitationData of invitations) {
      await prisma.sessionInvitation.upsert({
        where: {
          sessionId_email: {
            sessionId: invitationData.sessionId,
            email: invitationData.email
          }
        },
        update: invitationData,
        create: invitationData
      });
    }

    console.log('✅ Chat system seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${createdSessions.length} collaboration sessions created`);
    console.log(`   - ${createdThreads.length} chat threads created`);
    console.log(`   - ${messages.length} messages created`);
    console.log(`   - ${reactions.filter(r => r.messageId).length} reactions created`);
    console.log(`   - ${invitations.length} invitations created`);

  } catch (error) {
    console.error('❌ Error seeding chat system:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Chat system seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
