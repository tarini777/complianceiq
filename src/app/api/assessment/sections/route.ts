import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId');
    const subPersonaId = searchParams.get('subPersonaId');
    const therapeuticAreaId = searchParams.get('therapeuticAreaId');
    const includeQuestions = searchParams.get('includeQuestions') === 'true';
    const includeCollaboration = searchParams.get('includeCollaboration') === 'true';

    let whereClause: any = {};
    let includeClause: any = {
      personaMappings: {
        include: {
          persona: true,
          subPersona: true,
        },
      },
    };

    // If personaId is provided, filter sections based on persona access
    if (personaId) {
      const persona = await prisma.persona.findUnique({
        where: { id: personaId },
        select: { isAdmin: true },
      });

      if (!persona) {
        return NextResponse.json(
          {
            success: false,
            error: 'Persona not found',
          },
          { status: 404 }
        );
      }

      // Admin gets all sections, others get filtered sections
      if (!persona.isAdmin) {
        whereClause.personaMappings = {
          some: {
            personaId,
            ...(subPersonaId && { subPersonaId }),
          },
        };
      }
    }

    // Add therapeutic area filtering if provided
    if (therapeuticAreaId) {
      whereClause.questions = {
        some: {
          therapyConditions: {
            some: {
              therapeuticAreaId,
            },
          },
        },
      };
    }

    // Include questions if requested
    if (includeQuestions) {
      includeClause.questions = {
        include: {
          personaMappings: {
            where: {
              ...(personaId && { personaId }),
              ...(subPersonaId && { subPersonaId }),
            },
          },
          therapyConditions: {
            include: {
              therapeuticArea: true,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      };
    }

    // Include collaboration states if requested
    if (includeCollaboration) {
      includeClause.collaborationStates = {
        include: {
          assignedTo: true,
          reviewedBy: true,
          approvedBy: true,
        },
      };
    }

    const sections = await prisma.assessmentSection.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: {
        sectionNumber: 'asc',
      },
    });

    // Calculate section statistics
    const sectionStats = sections.map(section => {
      const totalQuestions = section.questions?.length || 0;
      const visibleQuestions = section.questions?.length || 0; // All questions visible by default
      
      return {
        ...section,
        stats: {
          totalQuestions,
          visibleQuestions,
          completionRate: 0, // Will be calculated based on responses
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: sectionStats,
      count: sections.length,
      filters: {
        personaId,
        subPersonaId,
        therapeuticAreaId,
      },
    });
  } catch (error) {
    console.error('Error fetching assessment sections:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch assessment sections',
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
      sectionNumber, 
      title, 
      basePoints, 
      isCriticalBlocker = false,
      description 
    } = body;

    if (!title || !sectionNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Section title and number are required',
        },
        { status: 400 }
      );
    }

    const section = await prisma.assessmentSection.create({
      data: {
        sectionNumber,
        title,
        basePoints,
        isCriticalBlocker,
      },
    });

    return NextResponse.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error('Error creating assessment section:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create assessment section',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
