/**
 * Session Invitations API
 * Handles invitation management for collaboration sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


// GET /api/collaboration/invitations - Get invitations for a session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      );
    }

    const invitations = await prisma.sessionInvitation.findMany({
      where: { sessionId },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: invitations });
  } catch (error: any) {
    console.error("Error fetching session invitations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session invitations", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/collaboration/invitations - Create new invitation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, email, role, invitedBy } = body;

    if (!sessionId || !email || !role || !invitedBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sessionId, email, role, invitedBy" },
        { status: 400 }
      );
    }

    // Verify the person inviting has permission (owner or editor)
    const requesterParticipant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId: invitedBy,
        status: 'active',
        role: { in: ['owner', 'editor'] }
      }
    });

    if (!requesterParticipant) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions to send invitations" },
        { status: 403 }
      );
    }

    // Check if user is already a participant
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      const existingParticipant = await prisma.sessionParticipant.findFirst({
        where: {
          sessionId,
          userId: existingUser.id
        }
      });

      if (existingParticipant) {
        return NextResponse.json(
          { success: false, error: "User is already a participant in this session" },
          { status: 409 }
        );
      }
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.sessionInvitation.findFirst({
      where: {
        sessionId,
        email,
        status: 'pending'
      }
    });

    if (existingInvitation) {
      return NextResponse.json(
        { success: false, error: "Invitation already sent to this email address" },
        { status: 409 }
      );
    }

    // Create invitation (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.sessionInvitation.create({
      data: {
        sessionId,
        email,
        role,
        invitedBy,
        status: 'pending',
        expiresAt
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // TODO: Send email notification here
    // For now, we'll just log it
    console.log(`Invitation sent to ${email} for session ${sessionId}`);

    return NextResponse.json({ success: true, data: invitation }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating session invitation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create session invitation", details: error.message },
      { status: 500 }
    );
  }
}
