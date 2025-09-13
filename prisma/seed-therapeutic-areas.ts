import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding therapeutic areas...');

  const therapeuticAreas = [
    {
      id: 'oncology',
      name: 'Oncology',
      complexityPoints: 15,
    },
    {
      id: 'cardiovascular',
      name: 'Cardiovascular',
      complexityPoints: 12,
    },
    {
      id: 'neurology',
      name: 'Neurology',
      complexityPoints: 18,
    },
    {
      id: 'infectious_disease',
      name: 'Infectious Disease',
      complexityPoints: 10,
    },
    {
      id: 'rare_disease',
      name: 'Rare Disease',
      complexityPoints: 20,
    },
    {
      id: 'immunology',
      name: 'Immunology',
      complexityPoints: 14,
    },
    {
      id: 'metabolic',
      name: 'Metabolic Disorders',
      complexityPoints: 13,
    },
    {
      id: 'respiratory',
      name: 'Respiratory',
      complexityPoints: 11,
    },
  ];

  for (const area of therapeuticAreas) {
    await prisma.therapeuticArea.upsert({
      where: { id: area.id },
      update: area,
      create: area,
    });
    console.log(`✅ Created therapeutic area: ${area.name}`);
  }

  console.log('🎉 Successfully seeded therapeutic areas!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding therapeutic areas:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
