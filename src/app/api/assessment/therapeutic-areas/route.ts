import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeQuestions = searchParams.get('includeQuestions') === 'true';
    const companyId = searchParams.get('companyId');

    let whereClause: any = {};
    
    // Filter by company if provided
    if (companyId) {
      // Get company's therapeutic focus areas
      const company = await prisma.tenant.findUnique({
        where: { id: companyId },
        select: { therapeuticFocus: true }
      });
      
      if (company && company.therapeuticFocus.length > 0) {
        // Map company focus IDs to therapeutic area names
        const focusMapping: { [key: string]: string } = {
          'infectious_disease': 'Infectious Disease',
          'oncology': 'Oncology',
          'rare_disease': 'Rare Disease',
          'immunology': 'Immunology',
          'cardiology': 'Cardiology',
          'neurology': 'Neurology',
          'dermatology': 'Dermatology',
          'ophthalmology': 'Ophthalmology',
          'endocrinology': 'Endocrinology',
          'gastroenterology': 'Gastroenterology',
          'respiratory': 'Respiratory',
          'mental-health': 'Mental Health',
          'womens-health': 'Women\'s Health',
          'genetic-medicine': 'Genetic Medicine',
          'emergency-medicine': 'Emergency Medicine',
          'pediatrics': 'Pediatrics'
        };
        
        const mappedNames = company.therapeuticFocus
          .map(focus => focusMapping[focus])
          .filter(Boolean);
        
        if (mappedNames.length > 0) {
          whereClause.name = {
            in: mappedNames
          };
        }
      }
    }

    const therapeuticAreas = await prisma.therapeuticArea.findMany({
      where: whereClause,
      include: {
        therapyConditions: includeQuestions ? {
          include: {
            question: {
              include: {
                section: true,
                personaMappings: true,
              },
            },
          },
        } : true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Calculate statistics for each therapeutic area
    const areasWithStats = therapeuticAreas.map(area => ({
      ...area,
      stats: {
        totalQuestions: area.therapyConditions?.length || 0,
        criticalQuestions: 0, // Default since isCritical not in schema
        totalPoints: (area.therapyConditions?.length || 0) * 5, // Default 5 points per question
      },
    }));

    return NextResponse.json({
      success: true,
      data: areasWithStats,
      count: therapeuticAreas.length,
    });
  } catch (error) {
    console.error('Error fetching therapeutic areas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch therapeutic areas',
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
    const { name, description, code, isActive = true } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name is required',
        },
        { status: 400 }
      );
    }

    const therapeuticArea = await prisma.therapeuticArea.create({
      data: {
        name,
        complexityPoints: 10, // Default complexity points
      },
    });

    return NextResponse.json({
      success: true,
      data: therapeuticArea,
    });
  } catch (error) {
    console.error('Error creating therapeutic area:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create therapeutic area',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}