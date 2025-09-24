import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('includeDetails') === 'true';

    const aiModelTypes = await prisma.aIModelType.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Format the response
    const formattedData = aiModelTypes.map(model => ({
      id: model.id,
      name: model.name,
      complexityPoints: model.complexityPoints,
      ...(includeDetails && {
        specificRequirements: model.specificRequirements,
        securityConsiderations: model.securityConsiderations
      })
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      count: formattedData.length,
    });
  } catch (error) {
    console.error('Error fetching AI model types:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch AI model types',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
