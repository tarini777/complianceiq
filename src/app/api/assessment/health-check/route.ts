import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Assessment system health check...');

    // Check if we have basic data
    console.log('Testing database connection...');
    
    let personas = 0;
    let sections = 0;
    let questions = 0;
    let therapeuticAreas = 0;
    let aiModelTypes = 0;
    let deploymentScenarios = 0;

    try {
      personas = await prisma.persona.count();
      console.log('Personas count:', personas);
    } catch (e) {
      console.log('Personas table error:', e);
    }

    try {
      sections = await prisma.assessmentSection.count();
      console.log('Sections count:', sections);
    } catch (e) {
      console.log('Sections table error:', e);
    }

    try {
      questions = await prisma.dynamicQuestion.count();
      console.log('Questions count:', questions);
    } catch (e) {
      console.log('Questions table error:', e);
    }

    try {
      therapeuticAreas = await prisma.therapeuticArea.count();
      console.log('Therapeutic areas count:', therapeuticAreas);
    } catch (e) {
      console.log('Therapeutic areas table error:', e);
    }

    try {
      aiModelTypes = await prisma.aIModelType.count();
      console.log('AI model types count:', aiModelTypes);
    } catch (e) {
      console.log('AI model types table error:', e);
    }

    try {
      deploymentScenarios = await prisma.deploymentScenario.count();
      console.log('Deployment scenarios count:', deploymentScenarios);
    } catch (e) {
      console.log('Deployment scenarios table error:', e);
    }

    const healthStatus = {
      database: 'connected',
      personas,
      sections,
      questions,
      therapeuticAreas,
      aiModelTypes,
      deploymentScenarios,
      hasMinimumData: personas > 0 && sections > 0 && questions > 0,
      timestamp: new Date().toISOString()
    };

    console.log('Health check results:', healthStatus);

    return NextResponse.json({
      success: true,
      data: healthStatus
    });

  } catch (error) {
    console.error('Assessment health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Assessment system health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
