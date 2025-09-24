/**
 * Session Participants API
 * Handles team member management for collaboration sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


// GET /api/collaboration/participants - Get participants for a session
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

    const participants = await prisma.sessionParticipant.findMany({
      where: { sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            organization: {
              select: {
                id: true,
                name: true
              }
            },
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: [
        { role: 'asc' }, // owners first
        { joinedAt: 'asc' }
      ]
    });

    return NextResponse.json({ success: true, data: participants });
  } catch (error: any) {
    console.error("Error fetching session participants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session participants", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/collaboration/participants - Add participant to session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, role, addedBy } = body;

    if (!sessionId || !userId || !role || !addedBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sessionId, userId, role, addedBy" },
        { status: 400 }
      );
    }

    // Verify the person adding has permission (owner or editor)
    const requesterParticipant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId: addedBy,
        status: 'active',
        role: { in: ['owner', 'editor'] }
      }
    });

    if (!requesterParticipant) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions to add participants" },
        { status: 403 }
      );
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId
      }
    });

    if (existingParticipant) {
      return NextResponse.json(
        { success: false, error: "User is already a participant in this session" },
        { status: 409 }
      );
    }

    const participant = await prisma.sessionParticipant.create({
      data: {
        sessionId,
        userId,
        role,
        status: 'active',
        joinedAt: new Date(),
        lastActive: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            organization: {
              select: {
                id: true,
                name: true
              }
            },
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      }
    });

    // Create system message about new participant
    await prisma.chatMessage.create({
      data: {
        sessionId,
        userId: addedBy,
        content: `${participant.user.name} joined the session`,
        messageType: 'system'
      }
    });

    return NextResponse.json({ success: true, data: participant }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding session participant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add session participant", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/collaboration/participants - Update participant role
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, role, updatedBy } = body;

    if (!sessionId || !userId || !role || !updatedBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sessionId, userId, role, updatedBy" },
        { status: 400 }
      );
    }

    // Verify the person updating has permission (owner only for role changes)
    const requesterParticipant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId: updatedBy,
        status: 'active',
        role: 'owner'
      }
    });

    if (!requesterParticipant) {
      return NextResponse.json(
        { success: false, error: "Only session owners can update participant roles" },
        { status: 403 }
      );
    }

    const participant = await prisma.sessionParticipant.update({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            organization: {
              select: {
                id: true,
                name: true
              }
            },
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      }
    });

    // Create system message about role change
    await prisma.chatMessage.create({
      data: {
        sessionId,
        userId: updatedBy,
        content: `${participant.user.name}'s role changed to ${role}`,
        messageType: 'system'
      }
    });

    return NextResponse.json({ success: true, data: participant });
  } catch (error: any) {
    console.error("Error updating session participant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update session participant", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/collaboration/participants - Remove participant from session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const removedBy = searchParams.get('removedBy');

    if (!sessionId || !userId || !removedBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sessionId, userId, removedBy" },
        { status: 400 }
      );
    }

    // Verify the person removing has permission (owner or editor, or self-removal)
    const requesterParticipant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId: removedBy,
        status: 'active',
        role: { in: ['owner', 'editor'] }
      }
    });

    const isSelfRemoval = removedBy === userId;

    if (!requesterParticipant && !isSelfRemoval) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions to remove participants" },
        { status: 403 }
      );
    }

    // Get participant info before deletion
    const participant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Participant not found" },
        { status: 404 }
      );
    }

    // Delete participant
    await prisma.sessionParticipant.delete({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      }
    });

    // Create system message about participant removal
    await prisma.chatMessage.create({
      data: {
        sessionId,
        userId: removedBy,
        content: `${participant.user.name} left the session`,
        messageType: 'system'
      }
    });

    return NextResponse.json({ success: true, message: "Participant removed successfully" });
  } catch (error: any) {
    console.error("Error removing session participant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove session participant", details: error.message },
      { status: 500 }
    );
  }
}
