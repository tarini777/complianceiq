/**
 * Trial Management API - ComplianceIQ
 * Comprehensive trial management for beta testing, pilots, and evaluations
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/response-format';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/trials - Get all trials with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const trialType = searchParams.get('trialType');
    const createdBy = searchParams.get('createdBy');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';

    // Build where clause
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (trialType) whereClause.trialType = trialType;
    if (createdBy) whereClause.createdBy = createdBy;

    // Get trials with related data
    const includeClause: any = {
      _count: {
        select: {
          participants: true,
          sessions: true,
          feedback: true
        }
      }
    };

    if (includeAnalytics) {
      includeClause.analytics = {
        orderBy: { date: 'desc' },
        take: 30 // Last 30 days of analytics
      };
    }

    const [trials, total] = await Promise.all([
      prisma.trial.findMany({
        where: whereClause,
        include: includeClause,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.trial.count({ where: whereClause })
    ]);

    // Calculate additional metrics for each trial
    const trialsWithMetrics = trials.map(trial => ({
      ...trial,
      metrics: {
        totalParticipants: 0, // Will be calculated separately if needed
        totalSessions: 0, // Will be calculated separately if needed
        totalFeedback: 0, // Will be calculated separately if needed
        activeParticipants: 0, // Will be calculated separately if needed
        completedParticipants: 0, // Will be calculated separately if needed
        averageRating: 0, // Will be calculated separately if needed
        completionRate: 0 // Will be calculated separately if needed
      }
    }));

    return successResponse(trialsWithMetrics, 'Trials retrieved successfully', 200, {
      total,
      limit,
      offset,
      hasMore: offset + trials.length < total
    });

  } catch (error) {
    console.error('Error fetching trials:', error);
    return errorResponse(
      'Failed to fetch trials',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/trials - Create a new trial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      trialType,
      startDate,
      endDate,
      maxParticipants,
      features,
      limitations,
      privacyLevel,
      allowSelfRegistration,
      requireApproval,
      sendNotifications,
      trackAnalytics,
      createdBy,
      createdByEmail,
      organizationId,
      tags,
      notes,
      // Trial configuration
      enableCollaboration,
      enableAnalytics,
      enableRealTimeUpdates,
      enableAskRexi,
      enableRemediation,
      allowedPersonas,
      allowedTherapeuticAreas,
      allowedCompanyTypes,
      maxTeamSize,
      welcomeMessage,
      supportContact,
      dataRetentionDays,
      allowDataExport,
      requireDataAgreement,
      emailNotifications,
      inAppNotifications,
      reminderFrequency
    } = body;

    // Validation
    if (!name || !trialType || !createdBy || !createdByEmail) {
      return validationErrorResponse({
        name: name ? [] : ['Trial name is required'],
        trialType: trialType ? [] : ['Trial type is required'],
        createdBy: createdBy ? [] : ['Creator is required'],
        createdByEmail: createdByEmail ? [] : ['Creator email is required']
      });
    }

    // Create trial
    const trial = await prisma.trial.create({
      data: {
        name,
        description,
        trialType,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        maxParticipants,
        features: features || [],
        limitations: limitations || [],
        privacyLevel: privacyLevel || 'private',
        allowSelfRegistration,
        requireApproval,
        sendNotifications,
        createdBy,
        createdByEmail,
        organizationId,
      }
    });

    // Create trial configuration
    await prisma.trialConfiguration.create({
      data: {
        trialId: trial.id,
        enableCollaboration: enableCollaboration !== false,
        enableAnalytics: enableAnalytics !== false,
        enableRealTimeUpdates: enableRealTimeUpdates !== false,
        enableAskRexi: enableAskRexi !== false,
        enableRemediation: enableRemediation !== false,
        allowedPersonas: allowedPersonas || [],
        configurationData: {
          welcomeMessage,
          supportContact,
          dataRetentionDays: dataRetentionDays || 90,
          allowDataExport: allowDataExport || false,
          requireDataAgreement: requireDataAgreement !== false,
          emailNotifications: emailNotifications !== false,
          inAppNotifications: inAppNotifications !== false,
          reminderFrequency: reminderFrequency || 'weekly'
        }
      }
    });

    // Get the complete trial with configuration
    const completeTrial = await prisma.trial.findUnique({
      where: { id: trial.id },
      include: {
        participants: true,
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

    return successResponse(completeTrial, 'Trial created successfully', 201);

  } catch (error) {
    console.error('Error creating trial:', error);
    return errorResponse(
      'Failed to create trial',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    await prisma.$disconnect();
  }
}
