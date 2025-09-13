import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/system-config - Get system configuration
export async function GET(request: NextRequest) {
  try {
    // Provide default system configuration
    const defaultConfig = {
      collaboration_enabled: {
        value: 'false',
        description: 'Enable or disable team collaboration features',
        category: 'features'
      },
      collaboration_require_roles: {
        value: 'false',
        description: 'Require user role management for collaboration',
        category: 'features'
      },
      assessment_mode: {
        value: 'standard',
        description: 'Default assessment mode',
        category: 'assessment'
      },
      default_organization: {
        value: 'ComplianceIQ',
        description: 'Default organization name',
        category: 'general'
      },
      max_team_size: {
        value: '10',
        description: 'Maximum team size for collaboration',
        category: 'features'
      },
      auto_save_interval: {
        value: '30',
        description: 'Auto-save interval in seconds',
        category: 'general'
      }
    };

    return NextResponse.json({
      success: true,
      data: defaultConfig
    });

  } catch (error) {
    console.error('Error fetching system config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch system configuration' },
      { status: 500 }
    );
  }
}

// POST /api/system-config - Update system configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: key, value' },
        { status: 400 }
      );
    }

    // For now, just return success since we're using default config
    // In a real implementation, this would update a database or config store
    console.log(`Config update: ${key} = ${value}`);

    return NextResponse.json({
      success: true,
      data: { key, value, updated: true }
    });

  } catch (error) {
    console.error('Error updating system config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update system configuration' },
      { status: 500 }
    );
  }
}
