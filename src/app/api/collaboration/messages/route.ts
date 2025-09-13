/**
 * Chat Messages API
 * Handles CRUD operations for chat messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/collaboration/messages - Get messages for a session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const threadId = searchParams.get('threadId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      );
    }

    const where: any = { sessionId };
    if (threadId) where.threadId = threadId;

    const messages = await prisma.chatMessage.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        parentMessage: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Reverse to get chronological order
    messages.reverse();

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chat messages", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/collaboration/messages - Create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, threadId, userId, content, messageType, parentMessageId, fileUrl, fileName, fileSize, mimeType } = body;

    if (!sessionId || !userId || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sessionId, userId, content" },
        { status: 400 }
      );
    }

    // Verify user is participant in session
    const participant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId,
        status: 'active'
      }
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "User is not an active participant in this session" },
        { status: 403 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        threadId,
        userId,
        content,
        messageType: messageType || 'text',
        parentMessageId,
        fileUrl,
        fileName,
        fileSize,
        mimeType
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        parentMessage: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
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
    });

    // Update participant last active
    await prisma.sessionParticipant.update({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      },
      data: {
        lastActive: new Date()
      }
    });

    // Update session updatedAt
    await prisma.collaborationSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating chat message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create chat message", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/collaboration/messages - Update message (edit)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, content, userId } = body;

    if (!messageId || !content || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: messageId, content, userId" },
        { status: 400 }
      );
    }

    // Verify user owns the message
    const existingMessage = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        userId
      }
    });

    if (!existingMessage) {
      return NextResponse.json(
        { success: false, error: "Message not found or user does not have permission to edit" },
        { status: 404 }
      );
    }

    const message = await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date()
      },
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
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    console.error("Error updating chat message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update chat message", details: error.message },
      { status: 500 }
    );
  }
}
