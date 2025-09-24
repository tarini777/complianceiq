/**
 * Trial Participants API - ComplianceIQ
 * Manage trial participants, invitations, and registration
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/response-format';
import { generateInvitationToken } from '@/lib/trial-management/invitation-utils';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/trials/[trialId]/participants - Get trial participants
export async function GET(
  request: NextRequest,
  { params }: { params: { trialId: string } }
) {
  try {
    const { trialId } = params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeSessions = searchParams.get('includeSessions') === 'true';

    // Build where clause
    const whereClause: any = { trialId };
    if (status) whereClause.status = status;

    // Build include clause
    const includeClause: any = {};
    if (includeSessions) {
      includeClause.sessions = {
        orderBy: { startTime: 'desc' },
        take: 10 // Last 10 sessions
      };
    }

    const [participants, total] = await Promise.all([
      prisma.trialParticipant.findMany({
        where: whereClause,
        include: includeClause,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.trialParticipant.count({ where: whereClause })
    ]);

    return successResponse(participants, 'Participants retrieved successfully', 200, {
      total,
      limit,
      offset,
      hasMore: offset + participants.length < total
    });

  } catch (error) {
    console.error('Error fetching participants:', error);
    return errorResponse(
      'Failed to fetch participants',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/trials/[trialId]/participants - Add participant or send invitation
export async function POST(
  request: NextRequest,
  { params }: { params: { trialId: string } }
) {
  try {
    const { trialId } = params;
    const body = await request.json();
    const {
      email,
      name,
      organization,
      role,
      source,
      referralCode,
      customFields,
      sendInvitation = true,
      invitedBy,
      invitedByEmail
    } = body;

    // Validation
    if (!email) {
      return validationErrorResponse({
        email: ['Email is required']
      });
    }

    // Check if trial exists and get trial details
    const trial = await prisma.trial.findUnique({
      where: { id: trialId },
      include: { configuration: true }
    });

    if (!trial) {
      return errorResponse('Trial not found', 404);
    }

    // Check if participant already exists
    const existingParticipant = await prisma.trialParticipant.findUnique({
      where: {
        trialId_userId: {
          trialId,
          userId: email
        }
      }
    });

    if (existingParticipant) {
      return errorResponse('Participant already exists in this trial', 409);
    }

    // Check trial capacity
    if (trial.maxParticipants && trial.currentParticipants >= trial.maxParticipants) {
      return errorResponse('Trial has reached maximum participant capacity', 400);
    }

    let participant;

    if (sendInvitation && trial.allowSelfRegistration) {
      // Create invitation
      const invitationToken = generateInvitationToken();
      const invitationUrl = `${process.env.NEXTAUTH_URL}/trial/${trialId}/join?token=${invitationToken}`;

      // Create invitation record
      const invitation = await prisma.trialInvitation.create({
        data: {
          trialId,
          email,
          name,
          organization,
          invitationToken,
          invitationUrl,
          invitedBy: invitedBy || trial.createdBy,
          invitedByEmail: invitedByEmail || trial.createdByEmail,
          status: 'sent',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      });

      // Create participant record with invited status
      participant = await prisma.trialParticipant.create({
        data: {
          trialId,
          userId: email, // Use email as userId for now
          email,
          name,
          organization,
          role,
          status: 'invited',
          invitationDate: new Date(),
          source,
          referralCode,
          customFields
        }
      });

      // Send invitation email (this would integrate with your email service)
      await sendInvitationEmail({
        to: email,
        name: name || email,
        trialName: trial.name,
        invitationUrl,
        invitedBy: invitedByEmail || trial.createdByEmail
      });

      // Update trial participant count
      await prisma.trial.update({
        where: { id: trialId },
        data: { currentParticipants: { increment: 1 } }
      });

      return successResponse({
        participant,
        invitation,
        message: 'Invitation sent successfully'
      }, 'Participant invited successfully', 201);

    } else {
      // Create participant directly (for manual addition)
      participant = await prisma.trialParticipant.create({
        data: {
          trialId,
          userId: email, // Use email as userId for now
          email,
          name,
          organization,
          role,
          status: 'registered',
          registrationDate: new Date(),
          source,
          referralCode,
          customFields
        }
      });

      // Update trial participant count
      await prisma.trial.update({
        where: { id: trialId },
        data: { currentParticipants: { increment: 1 } }
      });

      return successResponse(participant, 'Participant added successfully', 201);
    }

  } catch (error) {
    console.error('Error adding participant:', error);
    return errorResponse(
      'Failed to add participant',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to send invitation email
async function sendInvitationEmail({
  to,
  name,
  trialName,
  invitationUrl,
  invitedBy
}: {
  to: string;
  name: string;
  trialName: string;
  invitationUrl: string;
  invitedBy: string;
}) {
  try {
    // This would integrate with your email service (SendGrid, AWS SES, etc.)
    // For now, we'll just log the invitation
    console.log(`📧 Invitation email would be sent to ${to} for trial "${trialName}"`);
    console.log(`🔗 Invitation URL: ${invitationUrl}`);
    console.log(`👤 Invited by: ${invitedBy}`);
    
    // Example integration with email service:
    // await emailService.send({
    //   to,
    //   subject: `You're invited to join ${trialName} trial`,
    //   template: 'trial-invitation',
    //   data: {
    //     name,
    //     trialName,
    //     invitationUrl,
    //     invitedBy
    //   }
    // });
    
  } catch (error) {
    console.error('Error sending invitation email:', error);
    // Don't throw error here to avoid breaking the participant creation
  }
}
