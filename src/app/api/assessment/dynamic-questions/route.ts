import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import DynamicQuestionGenerator from '@/lib/assessment/dynamicQuestionGenerator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const assessmentSection = searchParams.get('assessmentSection');

    // Get dynamic questions from database
    const whereClause: any = {};
    
    if (status !== 'all') {
      whereClause.status = status;
    }
    
    if (assessmentSection) {
      whereClause.assessmentSection = assessmentSection;
    }

    const questions = await prisma.dynamicQuestion.findMany({
      where: whereClause,
      orderBy: { id: 'desc' }
    });

    // Get basic statistics
    const totalCount = questions.length;
    const statusCounts = {
      total: totalCount,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    return NextResponse.json({
      success: true,
      data: questions,
      meta: {
        total: questions.length,
        statusCounts,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching dynamic questions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dynamic questions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, questionId, approvedBy, rejectionReason, assessmentSectionId } = body;

    if (action === 'generate') {
      // Generate new questions from regulatory requirements (incremental)
      const generator = new DynamicQuestionGenerator();
      const newQuestions = await generator.generateIncrementalQuestions();

      // Store new questions in database
      const storedQuestions = [];
      for (const question of newQuestions) {
        try {
          const storedQuestion = await prisma.dynamicQuestion.create({
            data: {
              id: question.id,
              questionText: question.text,
              questionType: question.type,
              complexityPoints: question.points,
              isProductionBlocker: question.isBlocker,
              category: question.category || 'General',
              evidenceRequired: question.evidenceRequired,
              responsibleRoles: question.responsibleRole,
              validationCriteria: question.validationCriteria,
              source: question.source,
              status: question.status,
              generatedAt: question.generatedAt,
              assessmentSection: assessmentSectionId || 'auto-generated',
              sectionId: 'regulatory-compliance' // Default section
            }
          });
          storedQuestions.push(storedQuestion);
        } catch (error) {
          console.log(`Question ${question.id} already exists, skipping...`);
        }
      }

      return NextResponse.json({
        success: true,
        data: storedQuestions,
        meta: {
          generated: storedQuestions.length,
          total: newQuestions.length,
          skipped: newQuestions.length - storedQuestions.length
        }
      });
    }

    if (action === 'generate-incremental') {
      // Generate questions only for new regulatory changes
      const { changes } = body;
      const generator = new DynamicQuestionGenerator();
      
      if (changes && changes.length > 0) {
        const newQuestions = await generator.generateQuestionsFromChanges(changes);
        
        // Store new questions in database
        const storedQuestions = [];
        for (const question of newQuestions) {
          try {
            const storedQuestion = await prisma.dynamicQuestion.create({
              data: {
                id: question.id,
                questionText: question.text,
                questionType: question.type,
                complexityPoints: question.points,
                isProductionBlocker: question.isBlocker,
                category: question.category || 'General',
                evidenceRequired: question.evidenceRequired,
                responsibleRoles: question.responsibleRole,
                validationCriteria: question.validationCriteria,
                source: question.source,
                status: question.status,
                generatedAt: question.generatedAt,
                assessmentSection: assessmentSectionId || 'auto-generated',
                sectionId: 'regulatory-compliance'
              }
            });
            storedQuestions.push(storedQuestion);
          } catch (error) {
            console.log(`Question ${question.id} already exists, skipping...`);
          }
        }

        return NextResponse.json({
          success: true,
          data: storedQuestions,
          meta: {
            generated: storedQuestions.length,
            total: newQuestions.length,
            skipped: newQuestions.length - storedQuestions.length,
            changesProcessed: changes.length
          }
        });
      } else {
        return NextResponse.json({
          success: true,
          data: [],
          meta: {
            generated: 0,
            total: 0,
            skipped: 0,
            changesProcessed: 0,
            message: 'No new changes to process'
          }
        });
      }
    }

    if (action === 'approve') {
      if (!questionId || !approvedBy) {
        return NextResponse.json(
          { success: false, error: 'Question ID and approved by are required' },
          { status: 400 }
        );
      }

      const updatedQuestion = await prisma.dynamicQuestion.update({
        where: { id: questionId },
        data: {
          status: 'approved',
          approvedBy,
          approvedAt: new Date()
        }
      });

      // If approved, add to the main assessment questions
      if (updatedQuestion.status === 'approved') {
        await addQuestionToAssessment(updatedQuestion);
      }

      return NextResponse.json({
        success: true,
        data: updatedQuestion,
        message: 'Question approved and added to assessment'
      });
    }

    if (action === 'reject') {
      if (!questionId || !rejectionReason) {
        return NextResponse.json(
          { success: false, error: 'Question ID and rejection reason are required' },
          { status: 400 }
        );
      }

      const updatedQuestion = await prisma.dynamicQuestion.update({
        where: { id: questionId },
        data: {
          status: 'rejected',
          rejectionReason
        }
      });

      return NextResponse.json({
        success: true,
        data: updatedQuestion,
        message: 'Question rejected'
      });
    }

    if (action === 'bulk-approve') {
      const { questionIds, approvedBy } = body;
      
      if (!questionIds || !Array.isArray(questionIds) || !approvedBy) {
        return NextResponse.json(
          { success: false, error: 'Question IDs array and approved by are required' },
          { status: 400 }
        );
      }

      const updatedQuestions = await prisma.dynamicQuestion.updateMany({
        where: { 
          id: { in: questionIds },
          status: 'pending_approval'
        },
        data: {
          status: 'approved',
          approvedBy,
          approvedAt: new Date()
        }
      });

      // Add approved questions to assessment
      const approvedQuestions = await prisma.dynamicQuestion.findMany({
        where: { 
          id: { in: questionIds },
          status: 'approved'
        }
      });

      for (const question of approvedQuestions) {
        await addQuestionToAssessment(question);
      }

      return NextResponse.json({
        success: true,
        data: { count: updatedQuestions.count },
        message: `${updatedQuestions.count} questions approved and added to assessment`
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action specified' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing dynamic questions request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Add approved question to the main assessment system
 */
async function addQuestionToAssessment(question: any) {
  try {
    // Add to assessment questions table
    await prisma.assessmentQuestion.create({
      data: {
        id: question.id,
        text: question.text,
        type: question.type,
        points: question.points,
        isBlocker: question.isBlocker,
        category: question.category || 'General',
        evidenceRequired: question.evidenceRequired,
        responsibleRole: question.responsibleRole,
        validationCriteria: question.validationCriteria,
        assessmentSection: question.assessmentSection,
        source: 'dynamic-generated',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Update AskRexi training data with new question
    await prisma.askRexiTrainingData.create({
      data: {
        question: question.text,
        variations: [question.text],
        category: question.category || 'General',
        subcategory: question.assessmentSection,
        answer: `This question assesses compliance with ${question.source.requirement} as required by ${question.source.authority}. Evidence required: ${question.evidenceRequired.join(', ')}.`,
        actionItems: question.evidenceRequired,
        impactLevel: question.isBlocker ? 'Critical' : 'High',
        sources: [question.source.authority],
        keywords: [question.source.requirement, question.category || 'General'],
        therapeuticAreas: ['General'],
        aiModelTypes: ['General'],
        deploymentScenarios: ['General'],
        personas: question.responsibleRole,
        tags: ['dynamic-generated', question.source.regulatoryType, question.category || 'General']
      }
    });

    console.log(`Question ${question.id} added to assessment and AskRexi training data`);
  } catch (error) {
    console.error(`Error adding question ${question.id} to assessment:`, error);
  }
}
