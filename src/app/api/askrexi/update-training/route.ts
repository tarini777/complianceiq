import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get all regulatory intelligence data from database
    const regulatoryData = await prisma.regulatoryIntelligence.findMany({
      where: { status: 'active' },
      orderBy: { lastUpdated: 'desc' }
    });

    // Create training questions and answers from real regulatory data
    const trainingData = regulatoryData.map(item => {
      const questions = [
        `What is ${item.title}?`,
        `Tell me about ${item.title}`,
        `What are the requirements for ${item.title}?`,
        `How does ${item.title} affect pharmaceutical AI?`,
        `What is the impact of ${item.title}?`,
        `What are the key points of ${item.title}?`,
        `Explain ${item.title}`,
        `What does ${item.title} require?`
      ];

      return questions.map(question => ({
        question,
        answer: `${item.title} (${item.source}): ${item.content}. This guidance was effective as of ${item.effectiveDate?.toISOString().split('T')[0] || 'recent date'}. Impact Level: ${item.impactLevel}.`,
        category: 'regulatory',
        source: item.source,
        regulationId: item.regulationId,
        therapeuticAreas: item.therapeuticAreas,
        aiModelRelevance: item.aiModelRelevance,
        impactLevel: item.impactLevel
      }));
    }).flat();

    // Store training data in database
    for (const trainingItem of trainingData) {
      try {
        await prisma.askRexiTrainingData.create({
          data: {
            question: trainingItem.question,
            variations: [],
            category: trainingItem.category,
            subcategory: trainingItem.source || 'regulatory',
            answer: trainingItem.answer,
            actionItems: [],
            impactLevel: trainingItem.impactLevel,
            sources: [trainingItem.source || 'regulatory'],
            keywords: trainingItem.therapeuticAreas || [],
            therapeuticAreas: trainingItem.therapeuticAreas || [],
            aiModelTypes: trainingItem.aiModelRelevance || [],
            deploymentScenarios: [],
            personas: [],
            tags: [trainingItem.source || 'regulatory', trainingItem.category]
          }
        });
      } catch (error) {
        // Skip if already exists
        console.log(`Skipping duplicate question: ${trainingItem.question}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated AskRexi training data with ${trainingData.length} questions from ${regulatoryData.length} regulatory sources`,
      trainingCount: trainingData.length,
      regulatoryCount: regulatoryData.length
    });

  } catch (error) {
    console.error('Error updating AskRexi training data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update AskRexi training data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
