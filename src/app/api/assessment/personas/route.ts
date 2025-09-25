import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSubPersonas = searchParams.get('includeSubPersonas') === 'true';

    // Simplified personas data for deployment compatibility
    const personas = [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full system access and oversight capabilities',
        role: 'administrator',
        permissions: ['read', 'write', 'delete', 'admin'],
        isActive: true,
        subPersonas: includeSubPersonas ? [
          {
            id: 'admin-compliance',
            name: 'Compliance Administrator',
            description: 'Specialized compliance oversight role'
          }
        ] : [],
        _count: {
          subPersonas: includeSubPersonas ? 1 : 0
        }
      },
      {
        id: 'data-science',
        name: 'Data Scientist',
        description: 'AI/ML model development and validation',
        role: 'data_scientist',
        permissions: ['read', 'write'],
        isActive: true,
        subPersonas: includeSubPersonas ? [
          {
            id: 'data-science-ml',
            name: 'ML Engineer',
            description: 'Machine learning model development'
          }
        ] : [],
        _count: {
          subPersonas: includeSubPersonas ? 1 : 0
        }
      },
      {
        id: 'regulatory',
        name: 'Regulatory Affairs',
        description: 'Regulatory compliance and oversight',
        role: 'regulatory',
        permissions: ['read', 'write'],
        isActive: true,
        subPersonas: includeSubPersonas ? [
          {
            id: 'regulatory-fda',
            name: 'FDA Specialist',
            description: 'FDA regulatory compliance specialist'
          }
        ] : [],
        _count: {
          subPersonas: includeSubPersonas ? 1 : 0
        }
      }
    ];

    return NextResponse.json({
      success: true,
      data: personas,
      count: personas.length,
      note: 'Using simplified personas data for deployment compatibility'
    });

  } catch (error) {
    console.error('Error fetching personas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch personas',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}