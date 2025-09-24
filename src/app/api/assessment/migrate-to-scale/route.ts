import { NextRequest, NextResponse } from 'next/server';
import { migrateAssessmentQuestions, generateMigrationReport, validateScaleQuestion } from '@/lib/assessment/questionMigration';
import { successResponse, errorResponse } from '@/lib/api/response-format';

export async function POST(request: NextRequest) {
  try {
    const { questions, dryRun = false } = await request.json();

    if (!questions || !Array.isArray(questions)) {
      return errorResponse('Questions array is required', 400);
    }

    // Migrate questions to scale format
    const migratedQuestions = migrateAssessmentQuestions(questions);
    
    // Generate migration report
    const report = generateMigrationReport(questions, migratedQuestions);
    
    // Validate migrated questions
    const validationResults = migratedQuestions.map(question => ({
      questionId: question.id,
      validation: validateScaleQuestion(question)
    }));
    
    const response = {
      migratedQuestions: dryRun ? [] : migratedQuestions,
      report,
      validationResults,
      dryRun
    };

    return successResponse(response, 'Questions migrated to scale format successfully');

  } catch (error) {
    console.error('Error migrating questions:', error);
    return errorResponse(
      'Failed to migrate questions',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const personaId = searchParams.get('personaId');

    // This would typically fetch questions from database
    // For now, return sample migration status
    const migrationStatus = {
      assessmentId,
      personaId,
      migrationStatus: 'pending',
      totalQuestions: 25,
      migratedQuestions: 0,
      validationErrors: 0,
      lastMigration: null,
      nextScheduledMigration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return successResponse(migrationStatus, 'Migration status retrieved successfully');

  } catch (error) {
    console.error('Error retrieving migration status:', error);
    return errorResponse(
      'Failed to retrieve migration status',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
