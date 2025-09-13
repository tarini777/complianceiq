import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAssessments = searchParams.get('includeAssessments') === 'true';
    const isActive = searchParams.get('isActive');

    let whereClause: any = {};

    if (isActive !== null) {
      whereClause.isActive = isActive === 'true';
    }

    const companies = await prisma.tenant.findMany({
      where: whereClause,
      include: {
        assessments: includeAssessments ? {
          include: {
            therapeuticAreas: true,
            aiModelTypes: true,
            deploymentScenarios: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        } : false,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Calculate statistics for each company
    const companiesWithStats = companies.map(company => ({
      ...company,
      stats: {
        totalAssessments: company.assessments?.length || 0,
        activeAssessments: company.assessments?.filter(a => a.status === 'in_progress').length || 0,
        completedAssessments: company.assessments?.filter(a => a.status === 'completed').length || 0,
        averageScore: company.assessments?.length > 0 ? 
          Math.round(company.assessments.reduce((sum, a) => sum + a.currentScore, 0) / company.assessments.length) : 0,
        therapeuticAreas: company.therapeuticFocus?.length || 0,
        aiInitiatives: company.aiInitiatives?.length || 0,
        deploymentScenarios: company.deploymentScenarios?.length || 0,
      },
    }));

    return NextResponse.json({
      success: true,
      data: companiesWithStats,
      count: companies.length,
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch companies',
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
      name, 
      industryType, 
      description, 
      website, 
      subscriptionTier = 'standard',
      therapeuticFocus = [],
      aiInitiatives = [],
      deploymentScenarios = [],
      isActive = true
    } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company name is required',
        },
        { status: 400 }
      );
    }

    const company = await prisma.tenant.create({
      data: {
        name,
        industryType,
        description,
        website,
        subscriptionTier,
        therapeuticFocus,
        aiInitiatives,
        deploymentScenarios,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create company',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
