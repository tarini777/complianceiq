import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Simple assessment progress API called');
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId');

    if (!personaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona ID is required',
        },
        { status: 400 }
      );
    }

    // Get basic persona info
    const persona = await prisma.persona.findUnique({
      where: { id: personaId },
      include: {
        subPersonas: true,
      },
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

    // Get basic sections count
    const totalSections = await prisma.assessmentSection.count();
    
    // Get basic questions count
    const totalQuestions = await prisma.dynamicQuestion.count();

    // Create a simple progress response
    const progressData = {
      persona: {
        id: persona.id,
        name: persona.name,
        description: persona.description,
        subPersonas: persona.subPersonas.map(sp => ({
          id: sp.id,
          name: sp.name,
          description: sp.description
        }))
      },
      statistics: {
        totalSections,
        totalQuestions,
        completedSections: 0, // Placeholder
        completedQuestions: 0, // Placeholder
        overallProgress: 0 // Placeholder
      },
      sections: [] // Simplified - no complex queries
    };

    console.log('Simple progress data generated successfully');

    return NextResponse.json({
      success: true,
      data: progressData,
      meta: {
        generatedAt: new Date().toISOString(),
        version: 'simplified'
      }
    });

  } catch (error) {
    console.error('Simple assessment progress error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch assessment progress',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
