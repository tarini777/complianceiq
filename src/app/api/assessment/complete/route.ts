/**
 * Assessment Completion API - ComplianceIQ
 * Handles assessment completion, versioning, and document management
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


const prisma = new PrismaClient();

// Complete an assessment and create a version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      assessmentId,
      personaId,
      subPersonaId,
      responses,
      completionRate,
      totalScore,
      maxPossibleScore,
      criticalBlockers,
      completedSections,
      totalSections,
      createdBy,
      versionName,
      description
    } = body;

    // Validate required fields
    if (!assessmentId || !createdBy || !responses) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current assessment
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId }
    });

    if (!assessment) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Generate next version number
    const existingVersions = await prisma.assessmentVersion.findMany({
      where: { assessmentId },
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    const nextVersion = existingVersions.length > 0 
      ? `${parseFloat(existingVersions[0].version) + 0.1}`.slice(0, 3)
      : '1.0';

    // Create assessment version
    const version = await prisma.assessmentVersion.create({
      data: {
        assessmentId,
        version: nextVersion,
        versionName: versionName || `Assessment v${nextVersion}`,
        description: description || `Assessment completion on ${new Date().toISOString()}`,
        status: 'completed',
        completionRate: completionRate || 0,
        totalScore: totalScore || 0,
        maxPossibleScore: maxPossibleScore || 0,
        criticalBlockers: criticalBlockers || 0,
        completedSections: completedSections || 0,
        totalSections: totalSections || 0,
        createdBy,
        completedAt: new Date()
      }
    });

    // Create assessment responses
    const responsePromises = Object.entries(responses).map(([questionId, responseValue]) =>
      prisma.assessmentResponse.create({
        data: {
          versionId: version.id,
          questionId,
          responseValue: responseValue as any,
          points: 0, // Will be calculated based on response
          isCompleted: true,
          completedAt: new Date(),
          createdBy
        }
      })
    );

    await Promise.all(responsePromises);

    // Update assessment status
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: 'completed',
        currentScore: totalScore || 0,
        completedAt: new Date(),
        completedBy: createdBy,
        version: nextVersion
      }
    });

    // Create audit log entry
    await prisma.assessmentAuditLog.create({
      data: {
        assessmentId,
        versionId: version.id,
        action: 'completed',
        description: `Assessment completed with ${completionRate}% completion rate`,
        performedBy: createdBy,
        metadata: {
          personaId,
          subPersonaId,
          totalScore,
          criticalBlockers,
          completedSections
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        version,
        assessment: {
          ...assessment,
          status: 'completed',
          currentScore: totalScore || 0,
          completedAt: new Date(),
          completedBy: createdBy,
          version: nextVersion
        }
      }
    });

  } catch (error) {
    console.error('Error completing assessment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete assessment' },
      { status: 500 }
    );
  }
}

// Get assessment versions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    const versions = await prisma.assessmentVersion.findMany({
      where: { assessmentId },
      orderBy: { createdAt: 'desc' },
      include: {
        responses: {
          select: {
            id: true,
            questionId: true,
            isCompleted: true,
            completedAt: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: versions
    });

  } catch (error) {
    console.error('Error fetching assessment versions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assessment versions' },
      { status: 500 }
    );
  }
}
