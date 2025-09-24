import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


// GET /api/organizations - Get all organizations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRoles = searchParams.get('includeRoles') === 'true';
    const includeUsers = searchParams.get('includeUsers') === 'true';

    const includeClause: any = {};

    if (includeRoles) {
      includeClause.roles = {
        include: {
          permissions: {
            include: {
              permission: true
            }
          },
          features: {
            include: {
              feature: true
            }
          }
        }
      };
    }

    if (includeUsers) {
      includeClause.users = {
        include: {
          role: true
        }
      };
    }

    const organizations = await prisma.organization.findMany({
      where: { isActive: true },
      include: includeClause,
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: organizations,
      count: organizations.length
    });

  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, type' },
        { status: 400 }
      );
    }

    // Check if organization already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { name }
    });

    if (existingOrg) {
      return NextResponse.json(
        { success: false, error: 'Organization with this name already exists' },
        { status: 409 }
      );
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        type,
        description
      }
    });

    return NextResponse.json({
      success: true,
      data: organization
    });

  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}

// PUT /api/organizations - Update organization
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, type, description, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id }
    });

    if (!existingOrg) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== existingOrg.name) {
      const nameExists = await prisma.organization.findUnique({
        where: { name }
      });

      if (nameExists) {
        return NextResponse.json(
          { success: false, error: 'Organization with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update organization
    const organization = await prisma.organization.update({
      where: { id },
      data: {
        name,
        type,
        description,
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: organization
    });

  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations - Delete organization
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id }
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if organization has users
    const userCount = await prisma.user.count({
      where: { organizationId: id }
    });

    if (userCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete organization. ${userCount} users belong to this organization.` },
        { status: 400 }
      );
    }

    // Check if organization has roles
    const roleCount = await prisma.role.count({
      where: { organizationId: id }
    });

    if (roleCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete organization. ${roleCount} roles belong to this organization.` },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.organization.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({
      success: true,
      message: 'Organization deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete organization' },
      { status: 500 }
    );
  }
}
