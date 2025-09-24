import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId');
    const subPersonaId = searchParams.get('subPersonaId');
    const therapeuticAreaId = searchParams.get('therapeuticAreaId');
    const aiModelTypes = searchParams.get('aiModelTypes')?.split(',') || [];
    const deploymentScenarios = searchParams.get('deploymentScenarios')?.split(',') || [];
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
      therapyOverlays: {
        include: {
          therapeuticArea: true,
        },
      },
      aiModelOverlays: {
        include: {
          aiModelType: true,
        },
      },
      deploymentOverlays: {
        include: {
          deploymentScenario: true,
        },
      },
    };

    // Fetch persona information if personaId is provided
    let persona: any = null;
    if (personaId) {
      persona = await prisma.persona.findUnique({
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

    // Include questions if requested with comprehensive filtering
    if (includeQuestions) {
      includeClause.questions = {
        include: {
          personaMappings: true,
          therapyConditions: {
            include: {
              therapeuticArea: true,
            },
          },
          therapyOverlays: {
            include: {
              therapeuticArea: true,
            },
          },
          aiModelOverlays: {
            include: {
              aiModelType: true,
            },
          },
          deploymentOverlays: {
            include: {
              deploymentScenario: true,
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


    // Apply sophisticated dynamic filtering
    const filteredSections = sections.map((section, index) => {
      if (!section.questions || section.questions.length === 0) {
        return {
          ...section,
          questions: [],
        };
      }

      let filteredQuestions = section.questions;

      // Apply persona-based filtering
      if (personaId && !persona.isAdmin) {
        if (subPersonaId) {
          // If sub-persona is selected: filter by sub-persona's specific expertise
          filteredQuestions = (section.questions as any[]).filter((question: any) => 
            question.personaMappings?.some((mapping: any) => 
              mapping.personaId === personaId && mapping.subPersonaId === subPersonaId
            )
          );
        } else {
          // If no sub-persona: show all questions for the persona (100% access)
          filteredQuestions = (section.questions as any[]).filter((question: any) => 
            question.personaMappings?.some((mapping: any) => 
              mapping.personaId === personaId
            )
          );
        }
      }

      // Apply therapy-specific filtering
      if (therapeuticAreaId) {
        filteredQuestions = (filteredQuestions as any[]).filter((question: any) => {
          // Include questions that are therapy-specific to the selected area
          const hasTherapyCondition = question.therapyConditions?.some((condition: any) => 
            condition.therapeuticAreaId === therapeuticAreaId
          );
          
          // Include questions with therapy-specific overlays
          const hasTherapyOverlay = question.therapyOverlays?.some((overlay: any) => 
            overlay.therapeuticAreaId === therapeuticAreaId
          );
          
          // Include general questions (no therapy conditions)
          const isGeneralQuestion = question.therapyConditions?.length === 0;
          
          return hasTherapyCondition || hasTherapyOverlay || isGeneralQuestion;
        });
      }

      // Apply AI model type-specific filtering
      if (aiModelTypes.length > 0) {
        filteredQuestions = (filteredQuestions as any[]).filter((question: any) => {
          // Include questions that are AI model-specific to the selected types
          const hasAIModelOverlay = question.aiModelOverlays?.some((overlay: any) => 
            aiModelTypes.includes(overlay.aiModelTypeId)
          );
          
          // Include general questions (no AI model conditions)
          const isGeneralQuestion = question.aiModelOverlays?.length === 0;
          
          return hasAIModelOverlay || isGeneralQuestion;
        });
      }

      // Apply deployment scenario-specific filtering
      if (deploymentScenarios.length > 0) {
        filteredQuestions = (filteredQuestions as any[]).filter((question: any) => {
          // Include questions that are deployment-specific to the selected scenarios
          const hasDeploymentOverlay = question.deploymentOverlays?.some((overlay: any) => 
            deploymentScenarios.includes(overlay.deploymentScenarioId)
          );
          
          // Include general questions (no deployment conditions)
          const isGeneralQuestion = question.deploymentOverlays?.length === 0;
          
          return hasDeploymentOverlay || isGeneralQuestion;
        });
      }

      // Generate dynamic therapy-specific questions if therapeutic area is selected
      if (therapeuticAreaId && includeQuestions) {
        const therapySpecificQuestions = generateTherapySpecificQuestions(
          therapeuticAreaId, 
          section.id, 
          aiModelTypes, 
          deploymentScenarios
        );
        filteredQuestions = [...filteredQuestions, ...therapySpecificQuestions];
      }

      // Generate dynamic AI model-specific questions if AI model types are selected
      if (aiModelTypes.length > 0 && includeQuestions) {
        const aiModelSpecificQuestions = generateAIModelSpecificQuestions(
          aiModelTypes, 
          section.id, 
          therapeuticAreaId, 
          deploymentScenarios
        );
        filteredQuestions = [...filteredQuestions, ...aiModelSpecificQuestions];
      }

      return {
        ...section,
        // Override sectionNumber with sequential numbering for filtered results
        sectionNumber: index + 1,
        questions: filteredQuestions,
      };
    });

    // Calculate section statistics with production blocker analysis
    const sectionStats = filteredSections.map(section => {
      const totalQuestions = section.questions?.length || 0;
      const visibleQuestions = section.questions?.length || 0;
      const productionBlockers = section.questions?.filter((q: any) => q.isProductionBlocker).length || 0;
      const criticalQuestions = section.questions?.filter((q: any) => q.isProductionBlocker).length || 0;
      
      return {
        ...section,
        stats: {
          totalQuestions,
          visibleQuestions,
          productionBlockers,
          criticalQuestions,
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
        aiModelTypes,
        deploymentScenarios,
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

// Helper function to generate therapy-specific questions
function generateTherapySpecificQuestions(
  therapeuticAreaId: string, 
  sectionId: string, 
  aiModelTypes: string[], 
  deploymentScenarios: string[]
) {
  const therapySpecificQuestions: any[] = [];
  
  // Get therapy-specific configuration based on therapeutic area
  const therapyConfig = getTherapySpecificConfiguration(therapeuticAreaId);
  
  if (therapyConfig) {
    // Generate production blocker questions for the therapy area
    therapyConfig.productionBlockers.forEach((blocker: any, index: number) => {
      therapySpecificQuestions.push({
        id: `therapy-${therapeuticAreaId}-${sectionId}-${index}`,
        sectionId,
        questionText: blocker.question,
        questionType: 'boolean',
        complexityPoints: blocker.points,
        isProductionBlocker: true,
        category: `${therapyConfig.name}-Specific`,
        evidenceRequired: blocker.evidenceRequired,
        responsibleRoles: blocker.responsibleRoles,
        therapySpecificConditions: {
          therapeuticAreaId,
          conditionLogic: { type: 'therapy_specific', area: therapeuticAreaId }
        },
        aiModelConditions: aiModelTypes.length > 0 ? {
          aiModelTypes,
          conditionLogic: { type: 'ai_model_specific', models: aiModelTypes }
        } : null,
        deploymentConditions: deploymentScenarios.length > 0 ? {
          deploymentScenarios,
          conditionLogic: { type: 'deployment_specific', scenarios: deploymentScenarios }
        } : null,
        validationCriteria: blocker.validationCriteria,
        createdAt: new Date(),
        updatedAt: new Date(),
        personaMappings: [],
        therapyConditions: [],
        therapyOverlays: [],
        aiModelOverlays: [],
        deploymentOverlays: []
      });
    });
  }
  
  return therapySpecificQuestions;
}

// Helper function to generate AI model-specific questions
function generateAIModelSpecificQuestions(
  aiModelTypes: string[], 
  sectionId: string, 
  therapeuticAreaId: string | null, 
  deploymentScenarios: string[]
) {
  const aiModelSpecificQuestions: any[] = [];
  
  aiModelTypes.forEach(aiModelType => {
    const aiModelConfig = getAIModelSpecificConfiguration(aiModelType);
    
    if (aiModelConfig) {
      // Generate production blocker questions for the AI model type
      aiModelConfig.productionBlockers.forEach((blocker: any, index: number) => {
        aiModelSpecificQuestions.push({
          id: `ai-model-${aiModelType}-${sectionId}-${index}`,
          sectionId,
          questionText: blocker.question,
          questionType: 'boolean',
          complexityPoints: blocker.points,
          isProductionBlocker: true,
          category: `${aiModelConfig.name}-Specific`,
          evidenceRequired: blocker.evidenceRequired,
          responsibleRoles: blocker.responsibleRoles,
          aiModelConditions: {
            aiModelType,
            conditionLogic: { type: 'ai_model_specific', model: aiModelType }
          },
          therapySpecificConditions: therapeuticAreaId ? {
            therapeuticAreaId,
            conditionLogic: { type: 'therapy_specific', area: therapeuticAreaId }
          } : null,
          deploymentConditions: deploymentScenarios.length > 0 ? {
            deploymentScenarios,
            conditionLogic: { type: 'deployment_specific', scenarios: deploymentScenarios }
          } : null,
          validationCriteria: blocker.validationCriteria,
          createdAt: new Date(),
          updatedAt: new Date(),
          personaMappings: [],
          therapyConditions: [],
          therapyOverlays: [],
          aiModelOverlays: [],
          deploymentOverlays: []
        });
      });
    }
  });
  
  return aiModelSpecificQuestions;
}

// Helper function to get therapy-specific configuration
function getTherapySpecificConfiguration(therapeuticAreaId: string) {
  const therapyConfigs: { [key: string]: any } = {
    'oncology': {
      name: 'Oncology',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your AI outputs production-formatted and validated for FDA Oncology Center of Excellence requirements?',
          points: 4,
          evidenceRequired: ['FDA Oncology Center validation', 'Oncology-specific compliance documentation'],
          responsibleRoles: ['Oncology Medical Director', 'Regulatory Affairs Director'],
          validationCriteria: { therapy: 'oncology', fdaCenter: 'Oncology Center of Excellence' }
        },
        {
          question: '🚨 PRODUCTION BLOCKER: Is your real-world evidence generation production-configured for oncology endpoints (OS, PFS, ORR, biomarkers)?',
          points: 4,
          evidenceRequired: ['Oncology endpoint validation', 'Biomarker qualification documentation'],
          responsibleRoles: ['Oncology Clinical Director', 'Real-World Evidence Manager'],
          validationCriteria: { endpoints: ['OS', 'PFS', 'ORR', 'biomarkers'], validation: 'production-ready' }
        }
      ]
    },
    'cardiology': {
      name: 'Cardiology',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your AI models production-validated for cardiovascular endpoint assessment (MACE, mortality reduction)?',
          points: 4,
          evidenceRequired: ['Cardiovascular endpoint validation', 'MACE assessment documentation'],
          responsibleRoles: ['Cardiology Medical Director', 'Clinical Validation Manager'],
          validationCriteria: { endpoints: ['MACE', 'mortality'], validation: 'production-ready' }
        }
      ]
    },
    'neurology': {
      name: 'Neurology',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your neurological outcome measures production-configured for FDA CNS guidance compliance?',
          points: 4,
          evidenceRequired: ['FDA CNS guidance compliance', 'Neurological outcome validation'],
          responsibleRoles: ['Neurology Medical Director', 'Clinical Validation Manager'],
          validationCriteria: { guidance: 'FDA CNS', validation: 'production-ready' }
        }
      ]
    },
    'rare-disease': {
      name: 'Rare Disease',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your small population AI models production-validated for FDA orphan drug development guidance?',
          points: 4,
          evidenceRequired: ['FDA orphan drug guidance compliance', 'Small population model validation'],
          responsibleRoles: ['Rare Disease Medical Director', 'Clinical Validation Manager'],
          validationCriteria: { guidance: 'FDA orphan drug', validation: 'production-ready' }
        }
      ]
    }
  };
  
  return therapyConfigs[therapeuticAreaId];
}

// Helper function to get AI model-specific configuration
function getAIModelSpecificConfiguration(aiModelType: string) {
  const aiModelConfigs: { [key: string]: any } = {
    'generative-ai': {
      name: 'Generative AI',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your hallucination detection systems production-deployed for clinical content generation?',
          points: 3,
          evidenceRequired: ['Hallucination detection system', 'Clinical content validation protocols'],
          responsibleRoles: ['AI/ML Engineer', 'Clinical Content Manager'],
          validationCriteria: { detection: 'production-deployed', accuracy: '>95%' }
        }
      ]
    },
    'agentic-ai': {
      name: 'Agentic AI',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your agent decision audit trails production-deployed meeting FDA transparency requirements?',
          points: 4,
          evidenceRequired: ['Agent audit trail system', 'FDA transparency compliance documentation'],
          responsibleRoles: ['AI/ML Engineer', 'Compliance Officer'],
          validationCriteria: { auditTrails: 'production-deployed', fdaCompliance: 'transparency-requirements' }
        }
      ]
    },
    'traditional-ml': {
      name: 'Traditional AI/ML',
      productionBlockers: [
        {
          question: '🚨 PRODUCTION BLOCKER: Are your model explainability systems production-deployed for regulatory transparency?',
          points: 3,
          evidenceRequired: ['Model explainability system', 'Regulatory transparency documentation'],
          responsibleRoles: ['AI/ML Engineer', 'Regulatory Affairs Manager'],
          validationCriteria: { explainability: 'production-deployed', transparency: 'regulatory-approved' }
        }
      ]
    }
  };
  
  return aiModelConfigs[aiModelType];
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
