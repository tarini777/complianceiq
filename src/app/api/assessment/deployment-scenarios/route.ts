import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('includeDetails') === 'true';

    const deploymentScenarios = await prisma.deploymentScenario.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Format the response
    const formattedData = deploymentScenarios.map(scenario => ({
      id: scenario.id,
      name: scenario.name,
      complexityPoints: scenario.complexityPoints,
      ...(includeDetails && {
        regulatoryPathway: scenario.regulatoryPathway,
        validationRequirements: scenario.validationRequirements
      })
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      count: formattedData.length,
    });
  } catch (error) {
    console.error('Error fetching deployment scenarios:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch deployment scenarios',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
