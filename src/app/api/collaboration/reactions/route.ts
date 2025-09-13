/**
 * Message Reactions API
 * Handles emoji reactions on chat messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/collaboration/reactions - Add or remove reaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, userId, emoji } = body;

    if (!messageId || !userId || !emoji) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: messageId, userId, emoji" },
        { status: 400 }
      );
    }

    // Check if reaction already exists
    const existingReaction = await prisma.messageReaction.findFirst({
      where: {
        messageId,
        userId,
        emoji
      }
    });

    if (existingReaction) {
      // Remove reaction (toggle off)
      await prisma.messageReaction.delete({
        where: {
          messageId_userId_emoji: {
            messageId,
            userId,
            emoji
          }
        }
      });

      return NextResponse.json({ success: true, action: 'removed', data: null });
    } else {
      // Add reaction
      const reaction = await prisma.messageReaction.create({
        data: {
          messageId,
          userId,
          emoji
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return NextResponse.json({ success: true, action: 'added', data: reaction });
    }
  } catch (error: any) {
    console.error("Error managing message reaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to manage message reaction", details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/collaboration/reactions - Get reactions for a message
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: "messageId is required" },
        { status: 400 }
      );
    }

    const reactions = await prisma.messageReaction.findMany({
      where: { messageId },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group reactions by emoji
    const groupedReactions = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = {
          emoji: reaction.emoji,
          count: 0,
          users: []
        };
      }
      acc[reaction.emoji].count++;
      acc[reaction.emoji].users.push(reaction.user);
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ success: true, data: Object.values(groupedReactions) });
  } catch (error: any) {
    console.error("Error fetching message reactions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch message reactions", details: error.message },
      { status: 500 }
    );
  }
}
