import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSubPersonas = searchParams.get('includeSubPersonas') === 'true';

    const personas = await prisma.persona.findMany({
      include: {
        subPersonas: includeSubPersonas,
        _count: {
          select: {
            subPersonas: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: personas,
      count: personas.length,
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch personas',
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
    const { name, description, isAdmin = false } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona name is required',
        },
        { status: 400 }
      );
    }

    const persona = await prisma.persona.create({
      data: {
        name,
        description,
        isAdmin,
      },
    });

    return NextResponse.json({
      success: true,
      data: persona,
    });
  } catch (error) {
    console.error('Error creating persona:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create persona',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
