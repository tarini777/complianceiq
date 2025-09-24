/**
 * Collaboration Analytics API
 * Handles analytics data for collaboration sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const organizationId = searchParams.get('organizationId');
    const userId = searchParams.get('userId');

    if (!sessionId && !organizationId && !userId) {
      return NextResponse.json(
        { success: false, error: 'At least one filter parameter is required' },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {};
    if (sessionId) where.sessionId = sessionId;
    if (organizationId) where.organizationId = organizationId;
    if (userId) where.userId = userId;

    const analytics = await prisma.collaborationAnalytics.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        session: {
          select: {
            id: true,
            sessionName: true,
            status: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        lastActivityAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching collaboration analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collaboration analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      organizationId,
      messagesSent = 0,
      messagesReceived = 0,
      responseTime,
      activeMinutes = 0,
      threadsCreated = 0,
      reactionsGiven = 0,
      reactionsReceived = 0,
      mentionsSent = 0,
      mentionsReceived = 0,
      assessmentSectionsViewed = 0,
      assessmentSectionsCompleted = 0,
      assessmentProgress = 0.0
    } = body;

    if (!sessionId || !userId || !organizationId) {
      return NextResponse.json(
        { success: false, error: 'sessionId, userId, and organizationId are required' },
        { status: 400 }
      );
    }

    // Upsert analytics record
    const analytics = await prisma.collaborationAnalytics.upsert({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      },
      update: {
        messagesSent: { increment: messagesSent },
        messagesReceived: { increment: messagesReceived },
        responseTime,
        activeMinutes: { increment: activeMinutes },
        threadsCreated: { increment: threadsCreated },
        reactionsGiven: { increment: reactionsGiven },
        reactionsReceived: { increment: reactionsReceived },
        mentionsSent: { increment: mentionsSent },
        mentionsReceived: { increment: mentionsReceived },
        assessmentSectionsViewed: { increment: assessmentSectionsViewed },
        assessmentSectionsCompleted: { increment: assessmentSectionsCompleted },
        assessmentProgress,
        lastActivityAt: new Date()
      },
      create: {
        sessionId,
        userId,
        organizationId,
        messagesSent,
        messagesReceived,
        responseTime,
        activeMinutes,
        threadsCreated,
        reactionsGiven,
        reactionsReceived,
        mentionsSent,
        mentionsReceived,
        assessmentSectionsViewed,
        assessmentSectionsCompleted,
        assessmentProgress
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        session: {
          select: {
            id: true,
            sessionName: true,
            status: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error updating collaboration analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update collaboration analytics' },
      { status: 500 }
    );
  }
}
