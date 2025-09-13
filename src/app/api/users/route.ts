import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users - Get all users with their roles and organizations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const roleId = searchParams.get('roleId');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const whereClause: any = {};
    
    if (organizationId) {
      whereClause.organizationId = organizationId;
    }
    
    if (roleId) {
      whereClause.roleId = roleId;
    }
    
    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        organization: true,
        role: {
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
        }
      },
      orderBy: [
        { organization: { name: 'asc' } },
        { role: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, organizationId, roleId } = body;

    // Validate required fields
    if (!email || !name || !organizationId || !roleId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, name, organizationId, roleId' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if role exists and belongs to the organization
    const role = await prisma.role.findFirst({
      where: { 
        id: roleId,
        organizationId: organizationId
      }
    });

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role not found or does not belong to the specified organization' },
        { status: 404 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        organizationId,
        roleId
      },
      include: {
        organization: true,
        role: {
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
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, name, organizationId, roleId, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Validate organization and role if provided
    if (organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId }
      });

      if (!organization) {
        return NextResponse.json(
          { success: false, error: 'Organization not found' },
          { status: 404 }
        );
      }
    }

    if (roleId) {
      const role = await prisma.role.findFirst({
        where: { 
          id: roleId,
          organizationId: organizationId || existingUser.organizationId
        }
      });

      if (!role) {
        return NextResponse.json(
          { success: false, error: 'Role not found or does not belong to the specified organization' },
          { status: 404 }
        );
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        organizationId,
        roleId,
        isActive
      },
      include: {
        organization: true,
        role: {
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
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
