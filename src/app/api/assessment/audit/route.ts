/**
 * Assessment Audit Log API - ComplianceIQ
 * Handles audit trail and activity tracking for assessments
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get audit logs for assessment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const versionId = searchParams.get('versionId');
    const action = searchParams.get('action');
    const performedBy = searchParams.get('performedBy');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    const where: any = { assessmentId };
    
    if (versionId) {
      where.versionId = versionId;
    }
    
    if (action) {
      where.action = action;
    }
    
    if (performedBy) {
      where.performedBy = performedBy;
    }

    const [auditLogs, totalCount] = await Promise.all([
      prisma.assessmentAuditLog.findMany({
        where,
        orderBy: { performedAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.assessmentAuditLog.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: auditLogs,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// Create audit log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      assessmentId,
      versionId,
      action,
      description,
      performedBy,
      metadata
    } = body;

    if (!assessmentId || !action || !performedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const auditLog = await prisma.assessmentAuditLog.create({
      data: {
        assessmentId,
        versionId,
        action,
        description: description || `${action} performed`,
        performedBy,
        metadata
      }
    });

    return NextResponse.json({
      success: true,
      data: auditLog
    });

  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
