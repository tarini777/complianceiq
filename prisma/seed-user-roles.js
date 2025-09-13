const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Organizations data
const organizations = [
  {
    name: 'Pharmaceutical Company',
    type: 'pharmaceutical',
    description: 'Pharmaceutical and biotechnology companies conducting compliance assessments'
  },
  {
    name: 'FDA',
    type: 'regulatory',
    description: 'Food and Drug Administration - Regulatory oversight and compliance monitoring'
  },
  {
    name: 'FTC',
    type: 'regulatory', 
    description: 'Federal Trade Commission - Marketing and advertising compliance oversight'
  },
  {
    name: 'Consulting Firm',
    type: 'consulting',
    description: 'Compliance consulting and advisory services'
  },
  {
    name: 'Academic Institution',
    type: 'other',
    description: 'Research institutions and academic organizations'
  }
];

// Permissions data
const permissions = [
  // Assessment permissions
  { name: 'assessment_create', description: 'Create new assessments', category: 'assessment' },
  { name: 'assessment_edit', description: 'Edit existing assessments', category: 'assessment' },
  { name: 'assessment_view', description: 'View assessment details', category: 'assessment' },
  { name: 'assessment_delete', description: 'Delete assessments', category: 'assessment' },
  { name: 'assessment_approve', description: 'Approve assessment completion', category: 'assessment' },
  
  // Collaboration permissions
  { name: 'collaboration_manage', description: 'Manage team collaboration', category: 'collaboration' },
  { name: 'collaboration_assign', description: 'Assign tasks to team members', category: 'collaboration' },
  { name: 'collaboration_review', description: 'Review collaborative work', category: 'collaboration' },
  { name: 'collaboration_comment', description: 'Add comments and feedback', category: 'collaboration' },
  
  // Analytics permissions
  { name: 'analytics_view', description: 'View analytics and reports', category: 'analytics' },
  { name: 'analytics_export', description: 'Export analytics data', category: 'analytics' },
  { name: 'analytics_insights', description: 'Access AI insights and recommendations', category: 'analytics' },
  
  // Admin permissions
  { name: 'user_manage', description: 'Manage users and roles', category: 'admin' },
  { name: 'system_config', description: 'Configure system settings', category: 'admin' },
  { name: 'data_manage', description: 'Manage system data', category: 'admin' },
  
  // Regulatory permissions
  { name: 'regulatory_monitor', description: 'Monitor regulatory compliance', category: 'regulatory' },
  { name: 'regulatory_report', description: 'Generate regulatory reports', category: 'regulatory' },
  { name: 'regulatory_investigate', description: 'Investigate compliance violations', category: 'regulatory' }
];

// Features data
const features = [
  // Core features
  { name: 'Assessment Configuration', description: 'Configure assessment parameters', category: 'core' },
  { name: 'Complete Assessment', description: 'Execute comprehensive assessments', category: 'core' },
  { name: 'Team Collaboration', description: 'Collaborative assessment workflows', category: 'core' },
  
  // Analytics features
  { name: 'Analytics Dashboard', description: 'Comprehensive analytics and reporting', category: 'analytics' },
  { name: 'Assessment Remediation Engine', description: 'AI-powered remediation recommendations', category: 'analytics' },
  { name: 'Regulatory Intelligence', description: 'Regulatory guidance and intelligence', category: 'analytics' },
  
  // Collaboration features
  { name: 'Real-time Collaboration', description: 'Live collaboration and communication', category: 'collaboration' },
  { name: 'Workflow Automation', description: 'Automated workflow management', category: 'collaboration' },
  { name: 'Document Management', description: 'Assessment document management', category: 'collaboration' },
  
  // Integration features
  { name: 'API Access', description: 'Programmatic API access', category: 'integration' },
  { name: 'Data Export', description: 'Export assessment data', category: 'integration' },
  { name: 'Third-party Integration', description: 'External system integration', category: 'integration' }
];

// Roles data with organization mapping
const roles = [
  // Pharmaceutical Company roles
  {
    name: 'Compliance Officer',
    description: 'Full compliance oversight and management',
    organizationName: 'Pharmaceutical Company',
    accessLevel: 'full',
    permissions: [
      'assessment_create', 'assessment_edit', 'assessment_view', 'assessment_approve',
      'collaboration_manage', 'collaboration_assign', 'collaboration_review',
      'analytics_view', 'analytics_export', 'analytics_insights',
      'regulatory_monitor', 'regulatory_report'
    ],
    features: [
      'Assessment Configuration', 'Complete Assessment', 'Team Collaboration',
      'Analytics Dashboard', 'Assessment Remediation Engine', 'Regulatory Intelligence',
      'Real-time Collaboration', 'Workflow Automation', 'Document Management',
      'Data Export'
    ]
  },
  {
    name: 'Legal Team',
    description: 'Legal review and regulatory compliance',
    organizationName: 'Pharmaceutical Company',
    accessLevel: 'full',
    permissions: [
      'assessment_view', 'assessment_approve',
      'collaboration_review', 'collaboration_comment',
      'analytics_view', 'analytics_export',
      'regulatory_monitor', 'regulatory_report', 'regulatory_investigate'
    ],
    features: [
      'Complete Assessment', 'Team Collaboration',
      'Analytics Dashboard', 'Assessment Remediation Engine', 'Regulatory Intelligence',
      'Real-time Collaboration', 'Document Management'
    ]
  },
  {
    name: 'Medical Affairs Team',
    description: 'Medical and clinical content review',
    organizationName: 'Pharmaceutical Company',
    accessLevel: 'full',
    permissions: [
      'assessment_view', 'assessment_approve',
      'collaboration_review', 'collaboration_comment',
      'analytics_view', 'analytics_insights'
    ],
    features: [
      'Complete Assessment', 'Team Collaboration',
      'Analytics Dashboard', 'Assessment Remediation Engine',
      'Real-time Collaboration', 'Document Management'
    ]
  },
  {
    name: 'MLR Team',
    description: 'Medical Legal Regulatory review team',
    organizationName: 'Pharmaceutical Company',
    accessLevel: 'full',
    permissions: [
      'assessment_view', 'assessment_approve',
      'collaboration_manage', 'collaboration_review', 'collaboration_comment',
      'analytics_view', 'analytics_export'
    ],
    features: [
      'Complete Assessment', 'Team Collaboration',
      'Analytics Dashboard', 'Assessment Remediation Engine',
      'Real-time Collaboration', 'Workflow Automation', 'Document Management'
    ]
  },
  {
    name: 'Marketing Team',
    description: 'Marketing content and brand management',
    organizationName: 'Pharmaceutical Company',
    accessLevel: 'limited',
    permissions: [
      'assessment_view',
      'collaboration_comment',
      'analytics_view'
    ],
    features: [
      'Assessment Configuration', 'Complete Assessment',
      'Analytics Dashboard'
    ]
  },
  {
    name: 'IT Team',
    description: 'System administration and technical support',
    organizationName: 'Pharmaceutical Company',
    accessLevel: 'full',
    permissions: [
      'assessment_view',
      'collaboration_manage',
      'analytics_view', 'analytics_export',
      'user_manage', 'system_config', 'data_manage',
      'API Access', 'Third-party Integration'
    ],
    features: [
      'Assessment Configuration', 'Complete Assessment', 'Team Collaboration',
      'Analytics Dashboard', 'Assessment Remediation Engine', 'Regulatory Intelligence',
      'Real-time Collaboration', 'Workflow Automation', 'Document Management',
      'API Access', 'Data Export', 'Third-party Integration'
    ]
  },
  {
    name: 'Senior Management',
    description: 'Executive oversight and strategic decision making',
    organizationName: 'Pharmaceutical Company',
    accessLevel: 'read-only',
    permissions: [
      'assessment_view',
      'analytics_view', 'analytics_export'
    ],
    features: [
      'Analytics Dashboard', 'Assessment Remediation Engine'
    ]
  },
  
  // FDA roles
  {
    name: 'FDA Compliance Officer',
    description: 'FDA regulatory oversight and compliance monitoring',
    organizationName: 'FDA',
    accessLevel: 'full',
    permissions: [
      'assessment_view',
      'analytics_view', 'analytics_export',
      'regulatory_monitor', 'regulatory_report', 'regulatory_investigate'
    ],
    features: [
      'Analytics Dashboard', 'Assessment Remediation Engine', 'Regulatory Intelligence',
      'Data Export'
    ]
  },
  {
    name: 'FDA Investigator',
    description: 'FDA compliance investigation and enforcement',
    organizationName: 'FDA',
    accessLevel: 'full',
    permissions: [
      'assessment_view',
      'analytics_view', 'analytics_export',
      'regulatory_investigate'
    ],
    features: [
      'Analytics Dashboard', 'Assessment Remediation Engine', 'Regulatory Intelligence',
      'Data Export'
    ]
  },
  
  // FTC roles
  {
    name: 'FTC Investigator',
    description: 'FTC marketing and advertising compliance investigation',
    organizationName: 'FTC',
    accessLevel: 'full',
    permissions: [
      'assessment_view',
      'analytics_view', 'analytics_export',
      'regulatory_investigate'
    ],
    features: [
      'Analytics Dashboard', 'Assessment Remediation Engine', 'Regulatory Intelligence',
      'Data Export'
    ]
  },
  {
    name: 'FTC Compliance Officer',
    description: 'FTC compliance monitoring and enforcement',
    organizationName: 'FTC',
    accessLevel: 'full',
    permissions: [
      'assessment_view',
      'analytics_view', 'analytics_export',
      'regulatory_monitor', 'regulatory_report'
    ],
    features: [
      'Analytics Dashboard', 'Assessment Remediation Engine', 'Regulatory Intelligence',
      'Data Export'
    ]
  },
  
  // Consulting roles
  {
    name: 'Compliance Consultant',
    description: 'External compliance consulting and advisory',
    organizationName: 'Consulting Firm',
    accessLevel: 'limited',
    permissions: [
      'assessment_view',
      'collaboration_review', 'collaboration_comment',
      'analytics_view', 'analytics_export'
    ],
    features: [
      'Complete Assessment', 'Team Collaboration',
      'Analytics Dashboard', 'Assessment Remediation Engine',
      'Real-time Collaboration'
    ]
  }
];

async function seedUserRoles() {
  try {
    console.log('🌱 Seeding organizations...');
    
    // Create organizations
    for (const orgData of organizations) {
      await prisma.organization.upsert({
        where: { name: orgData.name },
        update: orgData,
        create: orgData
      });
    }
    
    console.log('🌱 Seeding permissions...');
    
    // Create permissions
    for (const permData of permissions) {
      await prisma.permission.upsert({
        where: { name: permData.name },
        update: permData,
        create: permData
      });
    }
    
    console.log('🌱 Seeding features...');
    
    // Create features
    for (const featureData of features) {
      await prisma.feature.upsert({
        where: { name: featureData.name },
        update: featureData,
        create: featureData
      });
    }
    
    console.log('🌱 Seeding roles...');
    
    // Create roles with permissions and features
    for (const roleData of roles) {
      const organization = await prisma.organization.findUnique({
        where: { name: roleData.organizationName }
      });
      
      if (!organization) {
        console.error(`Organization not found: ${roleData.organizationName}`);
        continue;
      }
      
      const { permissions: rolePermissions, features: roleFeatures, organizationName, ...roleInfo } = roleData;
      
      // Create role
      const role = await prisma.role.upsert({
        where: { name: roleData.name },
        update: {
          ...roleInfo,
          organizationId: organization.id
        },
        create: {
          ...roleInfo,
          organizationId: organization.id
        }
      });
      
      // Assign permissions
      for (const permName of rolePermissions) {
        const permission = await prisma.permission.findUnique({
          where: { name: permName }
        });
        
        if (permission) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id
              }
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: permission.id
            }
          });
        }
      }
      
      // Assign features
      for (const featureName of roleFeatures) {
        const feature = await prisma.feature.findUnique({
          where: { name: featureName }
        });
        
        if (feature) {
          await prisma.roleFeature.upsert({
            where: {
              roleId_featureId: {
                roleId: role.id,
                featureId: feature.id
              }
            },
            update: {},
            create: {
              roleId: role.id,
              featureId: feature.id
            }
          });
        }
      }
    }
    
    console.log('✅ User role management seeding completed successfully!');
    
    // Display summary
    const orgCount = await prisma.organization.count();
    const roleCount = await prisma.role.count();
    const permCount = await prisma.permission.count();
    const featureCount = await prisma.feature.count();
    
    console.log(`📊 Summary:`);
    console.log(`   Organizations: ${orgCount}`);
    console.log(`   Roles: ${roleCount}`);
    console.log(`   Permissions: ${permCount}`);
    console.log(`   Features: ${featureCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding user roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedUserRoles()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
