import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    console.log('AI Model Types API called (simplified for build compatibility)');
    
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('includeDetails') === 'true';

    // Return mock AI model types data to avoid Prisma dependency during Vercel build
    const formattedData = [
      {
        id: 'mock-ai-1',
        name: 'Traditional AI/ML',
        complexityPoints: 5,
        ...(includeDetails && {
          specificRequirements: ['Data validation protocols', 'Model interpretability'],
          securityConsiderations: ['Data encryption', 'Access controls']
        })
      },
      {
        id: 'mock-ai-2',
        name: 'Large Language Models',
        complexityPoints: 8,
        ...(includeDetails && {
          specificRequirements: ['Bias testing', 'Content filtering'],
          securityConsiderations: ['Prompt injection protection', 'Data privacy']
        })
      },
      {
        id: 'mock-ai-3',
        name: 'Computer Vision',
        complexityPoints: 7,
        ...(includeDetails && {
          specificRequirements: ['Image quality validation', 'Accuracy metrics'],
          securityConsiderations: ['Adversarial attack protection', 'Data anonymization']
        })
      },
      {
        id: 'mock-ai-4',
        name: 'Natural Language Processing',
        complexityPoints: 6,
        ...(includeDetails && {
          specificRequirements: ['Text preprocessing', 'Language detection'],
          securityConsiderations: ['Input sanitization', 'Output filtering']
        })
      }
    ];

    return NextResponse.json({
      success: true,
      data: formattedData,
      count: formattedData.length,
      message: 'AI model types loaded (simplified for deployment compatibility)'
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
  }
}
