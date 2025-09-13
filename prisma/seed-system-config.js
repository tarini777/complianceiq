const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// System configuration data
const systemConfigs = [
  {
    key: 'collaboration_enabled',
    value: 'true',
    description: 'Enable or disable team collaboration features',
    category: 'features'
  },
  {
    key: 'collaboration_require_roles',
    value: 'true',
    description: 'Require user role management for collaboration',
    category: 'features'
  },
  {
    key: 'assessment_mode',
    value: 'comprehensive',
    description: 'Default assessment mode: simple, comprehensive, or custom',
    category: 'assessment'
  },
  {
    key: 'default_organization',
    value: 'Pharmaceutical Company',
    description: 'Default organization for new assessments',
    category: 'assessment'
  },
  {
    key: 'max_team_size',
    value: '10',
    description: 'Maximum number of team members in collaboration sessions',
    category: 'collaboration'
  },
  {
    key: 'auto_save_interval',
    value: '30',
    description: 'Auto-save interval in seconds',
    category: 'system'
  }
];

async function seedSystemConfig() {
  try {
    console.log('🌱 Seeding system configuration...');
    
    for (const configData of systemConfigs) {
      await prisma.systemConfig.upsert({
        where: { key: configData.key },
        update: configData,
        create: configData
      });
    }
    
    console.log('✅ System configuration seeding completed successfully!');
    
    // Display summary
    const configCount = await prisma.systemConfig.count();
    console.log(`📊 Summary: ${configCount} configuration items created`);
    
  } catch (error) {
    console.error('❌ Error seeding system config:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedSystemConfig()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
