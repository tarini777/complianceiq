/**
 * Collaboration Sessions API
 * Handles CRUD operations for collaboration sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/collaboration/sessions - Get all collaboration sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const assessmentId = searchParams.get('assessmentId');
    const includeParticipants = searchParams.get('includeParticipants') === 'true';
    const includeMessages = searchParams.get('includeMessages') === 'true';

    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    if (assessmentId) where.assessmentId = assessmentId;

    const sessions = await prisma.collaborationSession.findMany({
      where,
      include: {
        assessment: {
          select: {
            id: true,
            assessmentName: true,
            status: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        participants: includeParticipants ? {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        } : false,
        messages: includeMessages ? {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        } : false,
        threads: {
          include: {
            section: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
            messages: true,
            threads: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: sessions });
  } catch (error: any) {
    console.error("Error fetching collaboration sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collaboration sessions", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/collaboration/sessions - Create new collaboration session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, organizationId, sessionName, description, createdBy } = body;

    if (!assessmentId || !organizationId || !sessionName || !createdBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: assessmentId, organizationId, sessionName, createdBy" },
        { status: 400 }
      );
    }

    const session = await prisma.collaborationSession.create({
      data: {
        assessmentId,
        organizationId,
        sessionName,
        description,
        createdBy,
        status: 'active'
      },
      include: {
        assessment: {
          select: {
            id: true,
            assessmentName: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Add creator as owner participant
    await prisma.sessionParticipant.create({
      data: {
        sessionId: session.id,
        userId: createdBy,
        role: 'owner',
        status: 'active'
      }
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating collaboration session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create collaboration session", details: error.message },
      { status: 500 }
    );
  }
}
