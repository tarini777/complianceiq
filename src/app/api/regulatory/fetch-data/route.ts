/**
 * Regulatory Data Fetching API
 * Endpoint to trigger automated regulatory data collection
 */

import { NextRequest, NextResponse } from 'next/server';
import { RegulatoryDataFetcher } from '@/lib/regulatory/dataFetcher';
import { getCoverageStats } from '@/lib/regulatory/dataSources';

export async function POST(request: NextRequest) {
  try {
    const { action, sourceId } = await request.json();
    
    const fetcher = new RegulatoryDataFetcher();
    
    if (action === 'fetch-all') {
      // Fetch data from all sources
      const result = await fetcher.fetchAllSources();
      
      return NextResponse.json({
        success: true,
        message: 'Regulatory data fetch completed',
        data: {
          ...result,
          coverage: getCoverageStats()
        }
      });
    } else if (action === 'fetch-source' && sourceId) {
      // Fetch data from specific source
      const sources = await import('@/lib/regulatory/dataSources');
      const source = sources.getSourceById(sourceId);
      
      if (!source) {
        return NextResponse.json({
          success: false,
          error: 'Source not found'
        }, { status: 404 });
      }
      
      await fetcher.fetchSource(source);
      
      return NextResponse.json({
        success: true,
        message: `Data fetched from ${source.name}`,
        data: { source: source.name }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action or missing sourceId'
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error in regulatory data fetch:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'coverage') {
      // Get coverage statistics
      const coverage = getCoverageStats();
      
      return NextResponse.json({
        success: true,
        data: coverage
      });
    } else if (action === 'sources') {
      // Get all data sources
      const sources = await import('@/lib/regulatory/dataSources');
      
      return NextResponse.json({
        success: true,
        data: sources.REGULATORY_DATA_SOURCES
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error in regulatory data API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
