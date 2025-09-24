/**
 * Chat Threads API
 * Handles CRUD operations for chat threads
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


// GET /api/collaboration/threads - Get threads for a session
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

    const threads = await prisma.chatThread.findMany({
      where: { sessionId },
      include: {
        section: {
          select: {
            id: true,
            title: true,
            sectionNumber: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Get latest message for each thread
    const threadsWithLatestMessage = await Promise.all(
      threads.map(async (thread) => {
        const latestMessage = await prisma.chatMessage.findFirst({
          where: { threadId: thread.id },
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        return {
          ...thread,
          latestMessage
        };
      })
    );

    return NextResponse.json({ success: true, data: threadsWithLatestMessage });
  } catch (error: any) {
    console.error("Error fetching chat threads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chat threads", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/collaboration/threads - Create new thread
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, threadName, sectionId, createdBy } = body;

    if (!sessionId || !threadName || !createdBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sessionId, threadName, createdBy" },
        { status: 400 }
      );
    }

    // Verify user is participant in session
    const participant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId: createdBy,
        status: 'active'
      }
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "User is not an active participant in this session" },
        { status: 403 }
      );
    }

    const thread = await prisma.chatThread.create({
      data: {
        sessionId,
        threadName,
        sectionId,
        createdBy
      },
      include: {
        section: {
          select: {
            id: true,
            title: true,
            sectionNumber: true
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

    // Create system message about new thread
    await prisma.chatMessage.create({
      data: {
        sessionId,
        threadId: thread.id,
        userId: createdBy,
        content: `Thread "${threadName}" created`,
        messageType: 'system'
      }
    });

    return NextResponse.json({ success: true, data: thread }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating chat thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create chat thread", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/collaboration/threads - Update thread
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, threadName, updatedBy } = body;

    if (!threadId || !threadName || !updatedBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: threadId, threadName, updatedBy" },
        { status: 400 }
      );
    }

    // Verify user is participant in session and has permission
    const thread = await prisma.chatThread.findFirst({
      where: { id: threadId },
      include: {
        session: {
          include: {
            participants: {
              where: {
                userId: updatedBy,
                status: 'active',
                role: { in: ['owner', 'editor'] }
              }
            }
          }
        }
      }
    });

    if (!thread || thread.session.participants.length === 0) {
      return NextResponse.json(
        { success: false, error: "Thread not found or insufficient permissions" },
        { status: 404 }
      );
    }

    const updatedThread = await prisma.chatThread.update({
      where: { id: threadId },
      data: { threadName },
      include: {
        section: {
          select: {
            id: true,
            title: true,
            sectionNumber: true
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

    return NextResponse.json({ success: true, data: updatedThread });
  } catch (error: any) {
    console.error("Error updating chat thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update chat thread", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/collaboration/threads - Delete thread
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    const deletedBy = searchParams.get('deletedBy');

    if (!threadId || !deletedBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: threadId, deletedBy" },
        { status: 400 }
      );
    }

    // Verify user has permission to delete thread
    const thread = await prisma.chatThread.findFirst({
      where: { id: threadId },
      include: {
        session: {
          include: {
            participants: {
              where: {
                userId: deletedBy,
                status: 'active',
                role: { in: ['owner', 'editor'] }
              }
            }
          }
        }
      }
    });

    if (!thread || thread.session.participants.length === 0) {
      return NextResponse.json(
        { success: false, error: "Thread not found or insufficient permissions" },
        { status: 404 }
      );
    }

    // Delete thread (messages will be cascade deleted)
    await prisma.chatThread.delete({
      where: { id: threadId }
    });

    return NextResponse.json({ success: true, message: "Thread deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting chat thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete chat thread", details: error.message },
      { status: 500 }
    );
  }
}
