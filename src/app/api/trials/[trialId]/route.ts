/**
 * Individual Trial Management API - ComplianceIQ
 * Get, update, and delete specific trials
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse, notFoundErrorResponse } from '@/lib/api/response-format';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/trials/[trialId] - Get specific trial with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { trialId: string } }
) {
  try {
    const { trialId } = params;
    const { searchParams } = new URL(request.url);
    const includeParticipants = searchParams.get('includeParticipants') === 'true';
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';
    const includeFeedback = searchParams.get('includeFeedback') === 'true';

    // Build include clause
    const includeClause: any = {
      configuration: true,
      _count: {
        select: {
          participants: true,
          sessions: true,
          feedback: true
        }
      }
    };

    if (includeParticipants) {
      includeClause.participants = {
        orderBy: { createdAt: 'desc' }
      };
    }

    if (includeAnalytics) {
      includeClause.analytics = {
        orderBy: { date: 'desc' },
        take: 90 // Last 90 days
      };
    }

    if (includeFeedback) {
      includeClause.feedback = {
        orderBy: { createdAt: 'desc' },
        take: 50 // Last 50 feedback items
      };
    }

    const trial = await prisma.trial.findUnique({
      where: { id: trialId },
      include: includeClause
    });

    if (!trial) {
      return notFoundErrorResponse('Trial not found');
    }

    // Calculate comprehensive metrics
    const metrics = await calculateTrialMetrics(trialId);
    const trialWithMetrics = {
      ...trial,
      metrics
    };

    return successResponse(trialWithMetrics, 'Trial retrieved successfully');

  } catch (error) {
    console.error('Error fetching trial:', error);
    return errorResponse(
      'Failed to fetch trial',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/trials/[trialId] - Update trial
export async function PUT(
  request: NextRequest,
  { params }: { params: { trialId: string } }
) {
  try {
    const { trialId } = params;
    const body = await request.json();

    // Check if trial exists
    const existingTrial = await prisma.trial.findUnique({
      where: { id: trialId }
    });

    if (!existingTrial) {
      return notFoundErrorResponse('Trial not found');
    }

    // Update trial
    const updatedTrial = await prisma.trial.update({
      where: { id: trialId },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        configuration: true,
        _count: {
          select: {
            participants: true,
            sessions: true,
            feedback: true
          }
        }
      }
    });

    return successResponse(updatedTrial, 'Trial updated successfully');

  } catch (error) {
    console.error('Error updating trial:', error);
    return errorResponse(
      'Failed to update trial',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/trials/[trialId] - Delete trial (soft delete by setting status)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { trialId: string } }
) {
  try {
    const { trialId } = params;

    // Check if trial exists
    const existingTrial = await prisma.trial.findUnique({
      where: { id: trialId }
    });

    if (!existingTrial) {
      return notFoundErrorResponse('Trial not found');
    }

    // Soft delete by setting status to cancelled
    const deletedTrial = await prisma.trial.update({
      where: { id: trialId },
      data: {
        status: 'cancelled',
        updatedAt: new Date()
      }
    });

    return successResponse(deletedTrial, 'Trial cancelled successfully');

  } catch (error) {
    console.error('Error deleting trial:', error);
    return errorResponse(
      'Failed to delete trial',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to calculate trial metrics
async function calculateTrialMetrics(trialId: string) {
  try {
    const [
      participants,
      sessions,
      feedback,
      analytics
    ] = await Promise.all([
      prisma.trialParticipant.findMany({
        where: { trialId },
        select: {
          status: true,
          overallRating: true,
          likelihoodToRecommend: true,
          sessionsCount: true,
          assessmentsCompleted: true,
          timeSpent: true,
          registrationDate: true,
          lastAccessDate: true
        }
      }),
      prisma.trialSession.findMany({
        where: { trialId },
        select: {
          duration: true,
          pagesVisited: true,
          featuresUsed: true,
          loadTime: true,
          errorCount: true,
          startTime: true
        }
      }),
      prisma.trialFeedback.findMany({
        where: { trialId },
        select: {
          rating: true,
          priority: true,
          status: true,
          feedbackType: true
        }
      }),
      prisma.trialAnalytics.findMany({
        where: { trialId },
        orderBy: { date: 'desc' },
        take: 30
      })
    ]);

    // Calculate metrics
    const totalParticipants = participants.length;
    const activeParticipants = participants.filter(p => p.status === 'active').length;
    const completedParticipants = participants.filter(p => p.status === 'completed').length;
    
    const averageRating = participants.length > 0
      ? participants
          .filter(p => p.overallRating)
          .reduce((sum, p) => sum + (p.overallRating || 0), 0) / 
        participants.filter(p => p.overallRating).length || 0
      : 0;

    const averageNPS = participants.length > 0
      ? participants
          .filter(p => p.likelihoodToRecommend)
          .reduce((sum, p) => sum + (p.likelihoodToRecommend || 0), 0) / 
        participants.filter(p => p.likelihoodToRecommend).length || 0
      : 0;

    const totalSessions = sessions.length;
    const averageSessionDuration = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length
      : 0;

    const totalAssessmentsCompleted = participants.reduce((sum, p) => sum + p.assessmentsCompleted, 0);
    const totalTimeSpent = participants.reduce((sum, p) => sum + p.timeSpent, 0);

    // Feature usage analysis
    const featureUsage = sessions.reduce((acc, session) => {
      session.featuresUsed.forEach(feature => {
        acc[feature] = (acc[feature] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Feedback analysis
    const feedbackByType = feedback.reduce((acc, f) => {
      acc[f.feedbackType] = (acc[f.feedbackType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const criticalIssues = feedback.filter(f => f.priority === 'critical' && f.status !== 'resolved').length;

    // Engagement trends (last 7 days)
    const last7Days = analytics.slice(0, 7);
    const engagementTrend = last7Days.length > 1
      ? (last7Days[0]?.activeUsers || 0) - (last7Days[last7Days.length - 1]?.activeUsers || 0) / last7Days.length
      : 0;

    return {
      overview: {
        totalParticipants,
        activeParticipants,
        completedParticipants,
        completionRate: totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0,
        averageRating: Math.round(averageRating * 10) / 10,
        averageNPS: Math.round(averageNPS * 10) / 10
      },
      engagement: {
        totalSessions,
        averageSessionDuration: Math.round(averageSessionDuration),
        totalAssessmentsCompleted,
        totalTimeSpent,
        engagementTrend: Math.round(engagementTrend * 10) / 10
      },
      features: {
        featureUsage,
        topFeatures: Object.entries(featureUsage)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([feature, count]) => ({ feature, count }))
      },
      feedback: {
        totalFeedback: feedback.length,
        feedbackByType,
        criticalIssues,
        resolvedIssues: feedback.filter(f => f.status === 'resolved').length,
        averageFeedbackRating: feedback.length > 0
          ? feedback
              .filter(f => f.rating)
              .reduce((sum, f) => sum + (f.rating || 0), 0) / 
            feedback.filter(f => f.rating).length || 0
          : 0
      },
      performance: {
        averageLoadTime: sessions.length > 0
          ? sessions.reduce((sum, s) => sum + (s.loadTime || 0), 0) / sessions.length
          : 0,
        totalErrors: sessions.reduce((sum, s) => sum + s.errorCount, 0),
        errorRate: sessions.length > 0
          ? (sessions.reduce((sum, s) => sum + s.errorCount, 0) / sessions.length) * 100
          : 0
      }
    };
  } catch (error) {
    console.error('Error calculating trial metrics:', error);
    return {};
  }
}
