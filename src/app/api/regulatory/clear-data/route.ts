import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Clear all existing regulatory intelligence data
    const deleteResult = await prisma.regulatoryIntelligence.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${deleteResult.count} regulatory intelligence records`,
      deletedCount: deleteResult.count
    });

  } catch (error) {
    console.error('Error clearing regulatory data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear regulatory data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
