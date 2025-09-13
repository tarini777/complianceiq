/**
 * Sentiment Analysis API
 * Handles sentiment analysis for chat messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const messageId = searchParams.get('messageId');

    if (!sessionId && !userId && !messageId) {
      return NextResponse.json(
        { success: false, error: 'At least one filter parameter is required' },
        { status: 400 }
      );
    }

    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    if (userId) where.userId = userId;
    if (messageId) where.messageId = messageId;

    const sentimentAnalysis = await prisma.sentimentAnalysis.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        message: {
          select: {
            id: true,
            content: true,
            createdAt: true
          }
        },
        session: {
          select: {
            id: true,
            sessionName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: sentimentAnalysis
    });

  } catch (error) {
    console.error('Error fetching sentiment analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sentiment analysis' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messageId,
      sessionId,
      userId,
      overallSentiment,
      confidence,
      positiveScore = 0.0,
      negativeScore = 0.0,
      neutralScore = 0.0,
      joyScore = 0.0,
      angerScore = 0.0,
      fearScore = 0.0,
      sadnessScore = 0.0,
      surpriseScore = 0.0,
      urgencyLevel,
      formalityLevel,
      collaborativeTone,
      aiModel = "complianceiq-sentiment-v1",
      analysisVersion = "1.0",
      rawAnalysis
    } = body;

    if (!messageId || !sessionId || !userId || overallSentiment === undefined || confidence === undefined) {
      return NextResponse.json(
        { success: false, error: 'messageId, sessionId, userId, overallSentiment, and confidence are required' },
        { status: 400 }
      );
    }

    // Upsert sentiment analysis
    const sentiment = await prisma.sentimentAnalysis.upsert({
      where: {
        messageId
      },
      update: {
        overallSentiment,
        confidence,
        positiveScore,
        negativeScore,
        neutralScore,
        joyScore,
        angerScore,
        fearScore,
        sadnessScore,
        surpriseScore,
        urgencyLevel,
        formalityLevel,
        collaborativeTone,
        aiModel,
        analysisVersion,
        rawAnalysis: rawAnalysis ? JSON.stringify(rawAnalysis) : null
      },
      create: {
        messageId,
        sessionId,
        userId,
        overallSentiment,
        confidence,
        positiveScore,
        negativeScore,
        neutralScore,
        joyScore,
        angerScore,
        fearScore,
        sadnessScore,
        surpriseScore,
        urgencyLevel,
        formalityLevel,
        collaborativeTone,
        aiModel,
        analysisVersion,
        rawAnalysis: rawAnalysis ? JSON.stringify(rawAnalysis) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        message: {
          select: {
            id: true,
            content: true,
            createdAt: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: sentiment
    });

  } catch (error) {
    console.error('Error creating sentiment analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sentiment analysis' },
      { status: 500 }
    );
  }
}
