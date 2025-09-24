import { NextRequest, NextResponse } from 'next/server';
import { regulatoryTypes } from '@/lib/regulatory/regulatoryTypes';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const jurisdiction = searchParams.get('jurisdiction');
    const impactLevel = searchParams.get('impactLevel');
    const assessmentSection = searchParams.get('assessmentSection');

    let filteredTypes = regulatoryTypes;

    // Apply filters
    if (category && category !== 'all') {
      filteredTypes = filteredTypes.filter(type => type.category === category);
    }

    if (jurisdiction && jurisdiction !== 'all') {
      filteredTypes = filteredTypes.filter(type => type.jurisdiction === jurisdiction);
    }

    if (impactLevel && impactLevel !== 'all') {
      filteredTypes = filteredTypes.filter(type => type.impactLevel === impactLevel);
    }

    if (assessmentSection && assessmentSection !== 'all') {
      filteredTypes = filteredTypes.filter(type => 
        type.affectedSections.includes(assessmentSection)
      );
    }

    // Get summary statistics
    const stats = {
      totalTypes: regulatoryTypes.length,
      byCategory: regulatoryTypes.reduce((acc, type) => {
        acc[type.category] = (acc[type.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byJurisdiction: regulatoryTypes.reduce((acc, type) => {
        acc[type.jurisdiction] = (acc[type.jurisdiction] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byImpactLevel: regulatoryTypes.reduce((acc, type) => {
        acc[type.impactLevel] = (acc[type.impactLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalRegulations: regulatoryTypes.reduce((sum, type) => sum + type.regulations.length, 0),
      totalComplianceRequirements: regulatoryTypes.reduce((sum, type) => sum + type.complianceRequirements.length, 0)
    };

    return NextResponse.json({
      success: true,
      data: filteredTypes,
      meta: {
        filtered: filteredTypes.length,
        total: regulatoryTypes.length,
        stats,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching regulatory types:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch regulatory types',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, assessmentSectionId, questionId } = body;

    if (action === 'get-compliance-requirements') {
      // Get all compliance requirements for a specific assessment section
      const requirements = regulatoryTypes
        .filter(type => type.affectedSections.includes(assessmentSectionId))
        .flatMap(type => type.complianceRequirements)
        .filter(req => req.assessmentSection === assessmentSectionId);

      return NextResponse.json({
        success: true,
        data: requirements,
        meta: {
          assessmentSection: assessmentSectionId,
          totalRequirements: requirements.length,
          criticalRequirements: requirements.filter(r => r.riskLevel === 'Critical').length
        }
      });
    }

    if (action === 'get-question-regulations') {
      // Get all regulations that affect a specific question
      const questionRegulations = regulatoryTypes
        .filter(type => type.affectedQuestions.includes(questionId))
        .map(type => ({
          regulatoryType: type,
          relevantRegulations: type.regulations,
          complianceRequirements: type.complianceRequirements.filter(req => req.questionId === questionId)
        }));

      return NextResponse.json({
        success: true,
        data: questionRegulations,
        meta: {
          questionId,
          totalRegulatoryTypes: questionRegulations.length,
          totalRegulations: questionRegulations.reduce((sum, item) => sum + item.relevantRegulations.length, 0)
        }
      });
    }

    if (action === 'get-compliance-matrix') {
      // Get complete compliance matrix for all assessment sections
      const complianceMatrix = regulatoryTypes.map(type => ({
        regulatoryType: {
          id: type.id,
          name: type.name,
          jurisdiction: type.jurisdiction,
          authority: type.authority,
          category: type.category,
          impactLevel: type.impactLevel
        },
        affectedSections: type.affectedSections.map(sectionId => ({
          sectionId,
          questions: type.affectedQuestions,
          complianceRequirements: type.complianceRequirements.filter(req => req.assessmentSection === sectionId)
        })),
        totalRegulations: type.regulations.length,
        totalRequirements: type.complianceRequirements.length
      }));

      return NextResponse.json({
        success: true,
        data: complianceMatrix,
        meta: {
          totalRegulatoryTypes: complianceMatrix.length,
          totalSections: [...new Set(complianceMatrix.flatMap(item => item.affectedSections.map(s => s.sectionId)))].length,
          totalQuestions: [...new Set(complianceMatrix.flatMap(item => item.affectedSections.flatMap(s => s.questions)))].length
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action specified' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing regulatory types request:', error);
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
