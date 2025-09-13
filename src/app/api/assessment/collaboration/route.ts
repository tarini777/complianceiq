import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');
    const personaId = searchParams.get('personaId');
    const state = searchParams.get('state');

    let whereClause: any = {};

    if (sectionId) {
      whereClause.sectionId = sectionId;
    }

    if (personaId) {
      whereClause.OR = [
        { assignedTo: personaId },
        { reviewedBy: personaId },
        { approvedBy: personaId },
      ];
    }

    if (state) {
      whereClause.currentState = state;
    }

    const collaborationStates = await prisma.sectionCollaborationState.findMany({
      where: whereClause,
      include: {
        section: {
          include: {
            personaMappings: {
              include: {
                persona: true,
                subPersona: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastUpdated: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: collaborationStates,
      count: collaborationStates.length,
    });
  } catch (error) {
    console.error('Error fetching collaboration states:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch collaboration states',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sectionId, 
      currentState, 
      assignedTo, 
      reviewedBy, 
      approvedBy, 
      comments 
    } = body;

    if (!sectionId || !currentState) {
      return NextResponse.json(
        {
          success: false,
          error: 'Section ID and current state are required',
        },
        { status: 400 }
      );
    }

    // Validate state transitions
    const validStates = ['draft', 'in_review', 'approved', 'rejected', 'completed'];
    if (!validStates.includes(currentState)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid collaboration state',
        },
        { status: 400 }
      );
    }

      // Check if collaboration state already exists for this section
      const existingState = await prisma.sectionCollaborationState.findFirst({
        where: { sectionId },
      });

      let collaborationState;

      if (existingState) {
        // Update existing state
        collaborationState = await prisma.sectionCollaborationState.update({
          where: { id: existingState.id },
          data: {
            currentState,
            assignedTo,
            reviewedBy,
            approvedBy,
            comments,
            lastUpdated: new Date(),
          },
          include: {
            section: true,
          },
        });
      } else {
        // Create new collaboration state
        collaborationState = await prisma.sectionCollaborationState.create({
          data: {
            sectionId,
            currentState,
            assignedTo,
            reviewedBy,
            approvedBy,
            comments,
            lastUpdated: new Date(),
          },
          include: {
            section: true,
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: collaborationState,
      });
  } catch (error) {
    console.error('Error updating collaboration state:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update collaboration state',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      currentState, 
      assignedTo, 
      reviewedBy, 
      approvedBy, 
      comments 
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Collaboration state ID is required',
        },
        { status: 400 }
      );
    }

    const updateData: any = {
      lastUpdated: new Date(),
    };

    if (currentState) updateData.currentState = currentState;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (reviewedBy) updateData.reviewedBy = reviewedBy;
    if (approvedBy) updateData.approvedBy = approvedBy;
    if (comments) updateData.comments = comments;

    const collaborationState = await prisma.sectionCollaborationState.update({
      where: { id },
      data: updateData,
      include: {
        section: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: collaborationState,
    });
  } catch (error) {
    console.error('Error updating collaboration state:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update collaboration state',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
