import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/user-roles - Get all user roles with organization and permissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const includeUsers = searchParams.get('includeUsers') === 'true';
    const includePermissions = searchParams.get('includePermissions') === 'true';
    const includeFeatures = searchParams.get('includeFeatures') === 'true';

    const whereClause = organizationId ? { organizationId } : {};
    const includeClause: any = {
      organization: true,
    };

    if (includeUsers) {
      includeClause.users = true;
    }

    if (includePermissions) {
      includeClause.permissions = {
        include: {
          permission: true
        }
      };
    }

    if (includeFeatures) {
      includeClause.features = {
        include: {
          feature: true
        }
      };
    }

    const roles = await prisma.role.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: [
        { organization: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: roles,
      count: roles.length
    });

  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user roles' },
      { status: 500 }
    );
  }
}

// POST /api/user-roles - Create new role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, organizationId, accessLevel, permissions, features } = body;

    // Validate required fields
    if (!name || !organizationId || !accessLevel) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, organizationId, accessLevel' },
        { status: 400 }
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

    // Create role
    const role = await prisma.role.create({
      data: {
        name,
        description,
        organizationId,
        accessLevel
      }
    });

    // Assign permissions if provided
    if (permissions && permissions.length > 0) {
      for (const permName of permissions) {
        const permission = await prisma.permission.findUnique({
          where: { name: permName }
        });

        if (permission) {
          await prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: permission.id
            }
          });
        }
      }
    }

    // Assign features if provided
    if (features && features.length > 0) {
      for (const featureName of features) {
        const feature = await prisma.feature.findUnique({
          where: { name: featureName }
        });

        if (feature) {
          await prisma.roleFeature.create({
            data: {
              roleId: role.id,
              featureId: feature.id
            }
          });
        }
      }
    }

    // Return role with full details
    const roleWithDetails = await prisma.role.findUnique({
      where: { id: role.id },
      include: {
        organization: true,
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
    });

    return NextResponse.json({
      success: true,
      data: roleWithDetails
    });

  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create role' },
      { status: 500 }
    );
  }
}

// PUT /api/user-roles - Update role
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, accessLevel, permissions, features } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Role ID is required' },
        { status: 400 }
      );
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id }
    });

    if (!existingRole) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    // Update role
    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        accessLevel
      }
    });

    // Update permissions if provided
    if (permissions !== undefined) {
      // Remove existing permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId: id }
      });

      // Add new permissions
      if (permissions.length > 0) {
        for (const permName of permissions) {
          const permission = await prisma.permission.findUnique({
            where: { name: permName }
          });

          if (permission) {
            await prisma.rolePermission.create({
              data: {
                roleId: id,
                permissionId: permission.id
              }
            });
          }
        }
      }
    }

    // Update features if provided
    if (features !== undefined) {
      // Remove existing features
      await prisma.roleFeature.deleteMany({
        where: { roleId: id }
      });

      // Add new features
      if (features.length > 0) {
        for (const featureName of features) {
          const feature = await prisma.feature.findUnique({
            where: { name: featureName }
          });

          if (feature) {
            await prisma.roleFeature.create({
              data: {
                roleId: id,
                featureId: feature.id
              }
            });
          }
        }
      }
    }

    // Return updated role with full details
    const roleWithDetails = await prisma.role.findUnique({
      where: { id },
      include: {
        organization: true,
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
    });

    return NextResponse.json({
      success: true,
      data: roleWithDetails
    });

  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE /api/user-roles - Delete role
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Role ID is required' },
        { status: 400 }
      );
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id }
    });

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    // Check if role has users
    const userCount = await prisma.user.count({
      where: { roleId: id }
    });

    if (userCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete role. ${userCount} users are assigned to this role.` },
        { status: 400 }
      );
    }

    // Delete role permissions and features first
    await prisma.rolePermission.deleteMany({
      where: { roleId: id }
    });

    await prisma.roleFeature.deleteMany({
      where: { roleId: id }
    });

    // Delete role
    await prisma.role.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}
