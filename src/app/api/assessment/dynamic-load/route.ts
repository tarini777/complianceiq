import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    const body = await request.json();
    const { 
      personaId, 
      subPersonaId, 
      therapeuticAreaId, 
      companyId,
      aiModelTypes = [], // Array of AI model architecture IDs
      deploymentScenarios = [], // Array of deployment scenario IDs
      assessmentType = 'comprehensive' 
    } = body;

    console.log(`[${requestId}] Dynamic assessment request:`, {
      personaId,
      subPersonaId,
      therapeuticAreaId,
      companyId,
      aiModelTypes,
      deploymentScenarios,
      assessmentType,
      timestamp: new Date().toISOString()
    });

    // Enhanced validation
    if (!personaId) {
      console.log(`[${requestId}] Validation failed: Persona ID is required`);
      return NextResponse.json(
        {
          success: false,
          error: 'Persona ID is required',
          requestId
        },
        { status: 400 }
      );
    }

    // Get persona details with enhanced logging
    console.log(`[${requestId}] Fetching persona: ${personaId}`);
    const persona = await prisma.persona.findUnique({
      where: { id: personaId },
      include: {
        subPersonas: true, // Always get all sub-personas for validation
      },
    });

    if (!persona) {
      console.log(`[${requestId}] Persona not found: ${personaId}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Persona not found',
          requestId
        },
        { status: 404 }
      );
    }

    // Enhanced sub-persona validation
    if (subPersonaId) {
      const subPersona = persona.subPersonas?.find(sp => sp.id === subPersonaId);
      if (!subPersona) {
        console.log(`[${requestId}] Sub-persona not found: ${subPersonaId} for persona: ${personaId}`);
        return NextResponse.json(
          {
            success: false,
            error: `Sub-persona '${subPersonaId}' not found for persona '${persona.name}'`,
            availableSubPersonas: persona.subPersonas?.map(sp => ({
              id: sp.id,
              name: sp.name
            })) || [],
            requestId
          },
          { status: 404 }
        );
      }
      console.log(`[${requestId}] Validated sub-persona: ${subPersona.name} (${subPersona.expertiseLevel})`);
    }

    // Get therapeutic area if provided
    let therapeuticArea = null;
    if (therapeuticAreaId) {
      console.log(`[${requestId}] Fetching therapeutic area: ${therapeuticAreaId}`);
      therapeuticArea = await prisma.therapeuticArea.findUnique({
        where: { id: therapeuticAreaId },
      });
      if (therapeuticArea) {
        console.log(`[${requestId}] Found therapeutic area: ${therapeuticArea.name}`);
      } else {
        console.log(`[${requestId}] Therapeutic area not found: ${therapeuticAreaId}`);
      }
    }

    // Get company if provided
    let company = null;
    if (companyId) {
      console.log(`[${requestId}] Fetching company: ${companyId}`);
      company = await prisma.tenant.findUnique({
        where: { id: companyId },
      });
      if (company) {
        console.log(`[${requestId}] Found company: ${company.name}`);
      } else {
        console.log(`[${requestId}] Company not found: ${companyId}`);
      }
    }

    // Get AI model types if provided
    let aiModelTypesData: any[] = [];
    if (aiModelTypes && aiModelTypes.length > 0) {
      console.log(`[${requestId}] Fetching AI model types: ${aiModelTypes.join(', ')}`);
      aiModelTypesData = await prisma.aIModelType.findMany({
        where: { id: { in: aiModelTypes } }
      });
      console.log(`[${requestId}] Found ${aiModelTypesData.length} AI model types`);
    }

    // Get deployment scenarios if provided
    let deploymentScenariosData: any[] = [];
    if (deploymentScenarios && deploymentScenarios.length > 0) {
      console.log(`[${requestId}] Fetching deployment scenarios: ${deploymentScenarios.join(', ')}`);
      deploymentScenariosData = await prisma.deploymentScenario.findMany({
        where: { id: { in: deploymentScenarios } }
      });
      console.log(`[${requestId}] Found ${deploymentScenariosData.length} deployment scenarios`);
    }

    // Build dynamic assessment configuration with sophisticated filtering
    console.log(`[${requestId}] Building assessment configuration for persona: ${personaId}, subPersona: ${subPersonaId || 'none'}`);
    
    let whereClause: any = {};
    let includeClause: any = {
      personaMappings: {
        where: {
          personaId,
          ...(subPersonaId && { subPersonaId }),
        },
      },
      questions: {
        include: {
          therapyConditions: {
            include: {
              therapeuticArea: true,
            },
          },
          filteringRules: true,
          therapyOverlays: true,
          aiModelOverlays: true,
          deploymentOverlays: true,
        },
      },
      collaborationStates: true,
      therapyOverlays: true,
      aiModelOverlays: true,
      deploymentOverlays: true,
      learningComponents: true,
      scoringRules: true,
    };

    // Filter sections by persona mappings for all users
    whereClause.personaMappings = {
      some: {
        personaId,
        ...(subPersonaId && { subPersonaId }),
      },
    };

    console.log(`[${requestId}] Querying sections with sophisticated filtering:`, JSON.stringify(whereClause, null, 2));
    
    const sections = await prisma.assessmentSection.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: {
        sectionNumber: 'asc',
      },
    });

    console.log(`[${requestId}] Found ${sections.length} sections for persona mapping`);

    // Apply sophisticated filtering logic
    const filteredSections = sections.map(section => {
      // Apply therapy-specific filtering
      let filteredQuestions: any[] = section.questions || [];
      
      if (therapeuticAreaId) {
        // Filter questions based on therapy-specific conditions
        filteredQuestions = filteredQuestions.filter((question: any) => {
          // Check if question has therapy-specific conditions
          if (question.therapyConditions && question.therapyConditions.length > 0) {
            return question.therapyConditions.some((condition: any) => 
              condition.therapeuticAreaId === therapeuticAreaId
            );
          }
          // Only include questions that are specifically relevant to the therapeutic area
          // Generic questions without therapy conditions should not appear
          return false;
        });
        
        // Add therapy-specific overlay questions
        const therapyOverlays = section.therapyOverlays?.filter((overlay: any) => 
          overlay.therapeuticAreaId === therapeuticAreaId
        ) || [];
        
        if (therapyOverlays.length > 0) {
          // Add therapy-specific questions from overlays
          therapyOverlays.forEach((overlay: any) => {
            if (overlay.overlayContent?.specificQuestions) {
              overlay.overlayContent.specificQuestions.forEach((questionText: string, index: number) => {
                filteredQuestions.push({
                  id: `therapy-overlay-${overlay.id}-${index}`,
                  questionText: questionText,
                  questionType: 'checkbox',
                  isProductionBlocker: false,
                  productionValidator: section.productionValidator,
                  therapyOverlaysJson: overlay.overlayContent,
                  complexityPoints: overlay.complexityPoints,
                  evidenceRequired: [],
                  responsibleRoles: [section.productionValidator || 'Clinical Expert'],
                });
              });
            }
          });
        }
      }

      // Apply AI model type-specific filtering
      if (aiModelTypes && aiModelTypes.length > 0) {
        const aiModelOverlays = section.aiModelOverlays?.filter((overlay: any) => 
          aiModelTypes.includes(overlay.aiModelTypeId)
        ) || [];
        
        if (aiModelOverlays.length > 0) {
          aiModelOverlays.forEach((overlay: any) => {
            if (overlay.overlayContent?.specificQuestions) {
              overlay.overlayContent.specificQuestions.forEach((questionText: string, index: number) => {
                filteredQuestions.push({
                  id: `ai-model-overlay-${overlay.id}-${index}`,
                  questionText: questionText,
                  questionType: 'checkbox',
                  isProductionBlocker: false,
                  productionValidator: section.productionValidator,
                  aiModelOverlaysJson: overlay.overlayContent,
                  complexityPoints: overlay.complexityPoints,
                  evidenceRequired: [],
                  responsibleRoles: [section.productionValidator || 'AI Expert'],
                });
              });
            }
          });
        }
      }

      // Apply deployment scenario-specific filtering
      if (deploymentScenarios && deploymentScenarios.length > 0) {
        const deploymentOverlays = section.deploymentOverlays?.filter((overlay: any) => 
          deploymentScenarios.includes(overlay.deploymentScenarioId)
        ) || [];
        
        if (deploymentOverlays.length > 0) {
          deploymentOverlays.forEach((overlay: any) => {
            if (overlay.overlayContent?.specificQuestions) {
              overlay.overlayContent.specificQuestions.forEach((questionText: string, index: number) => {
                filteredQuestions.push({
                  id: `deployment-overlay-${overlay.id}-${index}`,
                  questionText: questionText,
                  questionType: 'checkbox',
                  isProductionBlocker: false,
                  productionValidator: section.productionValidator,
                  deploymentOverlaysJson: overlay.overlayContent,
                  complexityPoints: overlay.complexityPoints,
                  evidenceRequired: [],
                  responsibleRoles: [section.productionValidator || 'Operations Expert'],
                });
              });
            }
          });
        }
      }

      return {
        ...section,
        questions: filteredQuestions,
        // Calculate enhanced scoring with overlays
        enhancedPoints: section.basePoints + 
          (section.therapyOverlays?.reduce((sum: number, overlay: any) => sum + overlay.complexityPoints, 0) || 0) + 
          (section.aiModelOverlays?.reduce((sum: number, overlay: any) => sum + overlay.complexityPoints, 0) || 0) + 
          (section.deploymentOverlays?.reduce((sum: number, overlay: any) => sum + overlay.complexityPoints, 0) || 0)
      };
    });

    // Calculate assessment statistics with sophisticated filtering
    const totalSections = filteredSections.length;
    const totalQuestions = filteredSections.reduce((sum, section) => 
      sum + (section.questions?.length || 0), 0
    );
    const totalPoints = filteredSections.reduce((sum, section) => 
      sum + (section.enhancedPoints || section.basePoints), 0
    );
    const criticalSections = filteredSections.filter(s => s.isCriticalBlocker);
    const nonCriticalSections = filteredSections.filter(s => !s.isCriticalBlocker);
    
    // Count production blockers
    const productionBlockers = filteredSections.reduce((sum, section) => 
      sum + (section.questions?.filter(q => q.isProductionBlocker).length || 0), 0
    );

    console.log(`[${requestId}] Assessment statistics:`, {
      totalSections,
      totalQuestions,
      totalPoints,
      criticalSections: criticalSections.length,
      nonCriticalSections: nonCriticalSections.length,
      productionBlockers
    });

    // Build response data
    const assessmentData = {
      persona: {
        id: persona.id,
        name: persona.name,
        description: persona.description,
        isAdmin: persona.isAdmin,
        subPersona: subPersonaId ? persona.subPersonas?.find(sp => sp.id === subPersonaId) : null,
      },
      therapeuticArea,
      company,
      aiModelTypes: aiModelTypesData,
      deploymentScenarios: deploymentScenariosData,
      assessment: {
        type: assessmentType,
        totalSections,
        totalQuestions,
        totalPoints,
        criticalSections: criticalSections.length,
        nonCriticalSections: nonCriticalSections.length,
        productionBlockers,
        estimatedTimeMinutes: Math.ceil(totalQuestions * 2), // 2 minutes per question estimate
        filteringApplied: {
          therapeuticArea: !!therapeuticAreaId,
          aiModelTypes: aiModelTypes.length > 0,
          deploymentScenarios: deploymentScenarios.length > 0,
          company: !!companyId
        }
      },
      sections: filteredSections.map(section => ({
        id: section.id,
        sectionNumber: section.sectionNumber,
        title: section.title,
        basePoints: section.basePoints,
        isCriticalBlocker: section.isCriticalBlocker,
        questions: (section.questions as any[])?.map((question: any, index: number) => ({
          id: question.id,
          questionNumber: index + 1, // Generate question number based on position
          questionText: question.questionText,
          questionType: question.questionType,
          points: question.complexityPoints || 5,
          isCritical: question.isProductionBlocker || false,
          isVisible: true, // Default since not in schema
          expertiseRequired: 'intermediate', // Default since not in schema
          therapyConditions: question.therapySpecificConditions,
          evidenceRequired: question.evidenceRequired || [],
          responsibleRoles: question.responsibleRoles || [],
          productionValidator: question.productionValidator,
          therapyOverlays: question.therapyOverlaysJson,
          aiModelOverlays: question.aiModelOverlaysJson,
          deploymentOverlays: question.deploymentOverlaysJson,
        })) || [],
        collaboration: (section as any).collaborationStates || [],
        personaAccess: (section as any).personaMappings || [],
        sectionType: section.sectionType,
        productionValidator: section.productionValidator,
        therapyOverlays: (section as any).therapyOverlays || [],
        aiModelOverlays: (section as any).aiModelOverlays || [],
        deploymentOverlays: (section as any).deploymentOverlays || [],
        learningComponents: (section as any).learningComponents || [],
        scoringRules: (section as any).scoringRules || [],
        enhancedPoints: section.enhancedPoints || section.basePoints,
        stats: {
          totalQuestions: section.questions?.length || 0,
          visibleQuestions: section.questions?.length || 0, // All questions are visible by default
          completionRate: 0, // Would be calculated from actual responses
          productionBlockers: section.questions?.filter(q => q.isProductionBlocker).length || 0,
        },
      })),
    };

    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] Assessment generated successfully in ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      data: assessmentData,
      requestId,
      processingTimeMs: processingTime
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[${requestId}] Error generating dynamic assessment (${processingTime}ms):`, error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate dynamic assessment',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId,
        processingTimeMs: processingTime
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}