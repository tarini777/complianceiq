/**
 * Individual Session Invitation API
 * Handles individual invitation operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


// DELETE /api/collaboration/invitations/[id] - Cancel invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invitationId = params.id;
    const { searchParams } = new URL(request.url);
    const cancelledBy = searchParams.get('cancelledBy');

    if (!cancelledBy) {
      return NextResponse.json(
        { success: false, error: "cancelledBy is required" },
        { status: 400 }
      );
    }

    // Get invitation and verify permissions
    const invitation = await prisma.sessionInvitation.findFirst({
      where: { id: invitationId },
      include: {
        session: {
          include: {
            participants: {
              where: {
                userId: cancelledBy,
                status: 'active',
                role: { in: ['owner', 'editor'] }
              }
            }
          }
        }
      }
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (invitation.session.participants.length === 0) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions to cancel invitation" },
        { status: 403 }
      );
    }

    // Delete invitation
    await prisma.sessionInvitation.delete({
      where: { id: invitationId }
    });

    return NextResponse.json({ success: true, message: "Invitation cancelled successfully" });
  } catch (error: any) {
    console.error("Error cancelling session invitation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel session invitation", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/collaboration/invitations/[id] - Accept/decline invitation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invitationId = params.id;
    const body = await request.json();
    const { action, userId } = body; // action: 'accept' | 'decline'

    if (!action || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: action, userId" },
        { status: 400 }
      );
    }

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'accept' or 'decline'" },
        { status: 400 }
      );
    }

    // Get invitation
    const invitation = await prisma.sessionInvitation.findFirst({
      where: { id: invitationId }
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: "Invitation is no longer pending" },
        { status: 409 }
      );
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      await prisma.sessionInvitation.update({
        where: { id: invitationId },
        data: { status: 'expired' }
      });

      return NextResponse.json(
        { success: false, error: "Invitation has expired" },
        { status: 410 }
      );
    }

    if (action === 'decline') {
      // Simply update status to declined
      const updatedInvitation = await prisma.sessionInvitation.update({
        where: { id: invitationId },
        data: { status: 'declined' }
      });

      return NextResponse.json({ success: true, data: updatedInvitation });
    }

    // Accept invitation
    if (action === 'accept') {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      // Check if user is already a participant
      const existingParticipant = await prisma.sessionParticipant.findFirst({
        where: {
          sessionId: invitation.sessionId,
          userId
        }
      });

      if (existingParticipant) {
        return NextResponse.json(
          { success: false, error: "User is already a participant in this session" },
          { status: 409 }
        );
      }

      // Add user as participant
      await prisma.sessionParticipant.create({
        data: {
          sessionId: invitation.sessionId,
          userId,
          role: invitation.role,
          status: 'active',
          joinedAt: new Date(),
          lastActive: new Date()
        }
      });

      // Update invitation status
      const updatedInvitation = await prisma.sessionInvitation.update({
        where: { id: invitationId },
        data: { status: 'accepted' }
      });

      // Create system message about new participant
      await prisma.chatMessage.create({
        data: {
          sessionId: invitation.sessionId,
          userId,
          content: `${user.name} joined the session`,
          messageType: 'system'
        }
      });

      return NextResponse.json({ success: true, data: updatedInvitation });
    }
  } catch (error: any) {
    console.error("Error updating session invitation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update session invitation", details: error.message },
      { status: 500 }
    );
  }
}
