/**
 * Predictive Insights API
 * Handles predictive analytics and insights for collaboration sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const organizationId = searchParams.get('organizationId');
    const insightType = searchParams.get('insightType');
    const status = searchParams.get('status') || 'active';

    if (!sessionId && !organizationId) {
      return NextResponse.json(
        { success: false, error: 'sessionId or organizationId is required' },
        { status: 400 }
      );
    }

    const where: any = { status };
    if (sessionId) where.sessionId = sessionId;
    if (organizationId) where.organizationId = organizationId;
    if (insightType) where.insightType = insightType;

    const insights = await prisma.predictiveInsight.findMany({
      where,
      include: {
        session: {
          select: {
            id: true,
            sessionName: true,
            status: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true
          }
        },
        resolver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { severity: 'desc' },
        { confidence: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error('Error fetching predictive insights:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch predictive insights' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      organizationId,
      insightType,
      insightCategory,
      severity,
      confidence,
      title,
      description,
      recommendation,
      expectedImpact,
      timeframe,
      triggerMetrics,
      supportingEvidence
    } = body;

    if (!sessionId || !organizationId || !insightType || !insightCategory || 
        severity === undefined || confidence === undefined || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const insight = await prisma.predictiveInsight.create({
      data: {
        sessionId,
        organizationId,
        insightType,
        insightCategory,
        severity,
        confidence,
        title,
        description,
        recommendation,
        expectedImpact,
        timeframe,
        triggerMetrics: triggerMetrics ? JSON.stringify(triggerMetrics) : null,
        supportingEvidence: supportingEvidence ? JSON.stringify(supportingEvidence) : null
      },
      include: {
        session: {
          select: {
            id: true,
            sessionName: true,
            status: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: insight
    });

  } catch (error) {
    console.error('Error creating predictive insight:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create predictive insight' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      status,
      resolvedBy,
      resolutionNotes
    } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'id and status are required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (status === 'resolved' || status === 'dismissed') {
      updateData.resolvedAt = new Date();
      if (resolvedBy) updateData.resolvedBy = resolvedBy;
      if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
    }

    const insight = await prisma.predictiveInsight.update({
      where: { id },
      data: updateData,
      include: {
        session: {
          select: {
            id: true,
            sessionName: true,
            status: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true
          }
        },
        resolver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: insight
    });

  } catch (error) {
    console.error('Error updating predictive insight:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update predictive insight' },
      { status: 500 }
    );
  }
}
