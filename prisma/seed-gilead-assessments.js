const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Gilead company data
const gileadData = {
  name: 'Gilead Sciences',
  industryType: 'Biotechnology',
  description: 'Leading biopharmaceutical company focused on antiviral and oncology therapeutics',
  website: 'https://www.gilead.com',
  subscriptionTier: 'Enterprise',
  therapeuticFocus: ['HIV/AIDS', 'Hepatitis C', 'Oncology', 'COVID-19'],
  aiInitiatives: ['Drug Discovery AI', 'Clinical Trial Optimization', 'Regulatory Compliance AI'],
  deploymentScenarios: ['Clinical Research', 'Manufacturing', 'Regulatory Submissions']
};

// Assessment statuses and their distributions
const assessmentStatuses = [
  { status: 'completed', count: 50, successRate: 0.85 }, // 50% completed with 85% success
  { status: 'in_progress', count: 30, successRate: 0.0 }, // 30% in progress
  { status: 'failed', count: 20, successRate: 0.0 } // 20% failed
];

// Common failure reasons
const failureReasons = [
  'Data Observability Gaps - Insufficient monitoring and tracking of AI model performance in production',
  'FDA AI Governance 2025 Compliance - Missing required AI governance framework documentation',
  'Model Validation Documentation - Incomplete validation protocols for AI/ML models',
  'Data Quality Assurance - Insufficient data quality controls and validation processes',
  'Risk Management Framework - Missing comprehensive AI risk assessment and mitigation strategies',
  'Regulatory Documentation - Incomplete documentation for FDA submission requirements',
  'Clinical Trial AI Integration - Insufficient validation of AI tools used in clinical trials',
  'Data Privacy Compliance - GDPR/HIPAA compliance gaps in AI data processing',
  'Model Interpretability - Lack of explainable AI documentation for regulatory review',
  'Change Control Procedures - Missing formal change management for AI model updates'
];

// Therapeutic areas for Gilead
const therapeuticAreas = [
  'HIV/AIDS Therapeutics',
  'Hepatitis C Treatment',
  'Oncology Drug Development',
  'COVID-19 Therapeutics',
  'Infectious Disease Prevention',
  'Immunotherapy Research'
];

// AI model types
const aiModelTypes = [
  'Drug Discovery ML Models',
  'Clinical Trial Optimization AI',
  'Regulatory Compliance AI',
  'Manufacturing Process AI',
  'Patient Stratification ML',
  'Adverse Event Prediction AI'
];

// Deployment scenarios
const deploymentScenarios = [
  'Clinical Research Environment',
  'Manufacturing Operations',
  'Regulatory Submission Process',
  'Patient Care Applications',
  'Research and Development',
  'Quality Assurance Systems'
];

// Generate random date within last 6 months
function getRandomDate() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
  return new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
}

// Generate assessment name
function generateAssessmentName(index) {
  const prefixes = ['AI Readiness', 'Compliance Assessment', 'Regulatory Review', 'AI Governance', 'Data Quality'];
  const suffixes = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Annual Review', 'Compliance Check'];
  const prefix = prefixes[index % prefixes.length];
  const suffix = suffixes[index % suffixes.length];
  return `${prefix} - ${suffix} #${String(index + 1).padStart(3, '0')}`;
}

// Generate score based on status
function generateScore(status, index) {
  switch (status) {
    case 'completed':
      // 85% success rate for completed assessments
      return Math.random() < 0.85 ? 
        Math.floor(Math.random() * 20) + 80 : // 80-100 for successful
        Math.floor(Math.random() * 30) + 50;  // 50-80 for failed
    case 'in_progress':
      return Math.floor(Math.random() * 40) + 30; // 30-70 for in progress
    case 'failed':
      return Math.floor(Math.random() * 30) + 20; // 20-50 for failed
    default:
      return Math.floor(Math.random() * 50) + 30;
  }
}

// Generate failure reason for failed assessments
function generateFailureReason() {
  return failureReasons[Math.floor(Math.random() * failureReasons.length)];
}

async function seedGileadAssessments() {
  try {
    console.log('🌱 Starting Gilead assessment seeding...');

    // Create or find Gilead tenant
    let gileadTenant = await prisma.tenant.findFirst({
      where: { name: gileadData.name }
    });

    if (!gileadTenant) {
      gileadTenant = await prisma.tenant.create({
        data: gileadData
      });
      console.log('✅ Created Gilead tenant');
    } else {
      console.log('✅ Found existing Gilead tenant');
    }

    // Create therapeutic areas if they don't exist
    const createdTherapeuticAreas = [];
    for (const area of therapeuticAreas) {
      let therapeuticArea = await prisma.therapeuticArea.findFirst({
        where: { name: area }
      });
      
      if (!therapeuticArea) {
        therapeuticArea = await prisma.therapeuticArea.create({
          data: {
            name: area,
            complexityPoints: Math.floor(Math.random() * 20) + 10,
            regulatoryRequirements: {
              fda: true,
              ema: true,
              pmda: Math.random() > 0.5
            }
          }
        });
      }
      createdTherapeuticAreas.push(therapeuticArea);
    }

    // Create AI model types if they don't exist
    const createdAIModelTypes = [];
    for (const modelType of aiModelTypes) {
      let aiModelType = await prisma.aIModelType.findFirst({
        where: { name: modelType }
      });
      
      if (!aiModelType) {
        aiModelType = await prisma.aIModelType.create({
          data: {
            name: modelType,
            complexityPoints: Math.floor(Math.random() * 15) + 10,
            specificRequirements: {
              validation: 'Required',
              documentation: 'Comprehensive',
              monitoring: 'Continuous'
            }
          }
        });
      }
      createdAIModelTypes.push(aiModelType);
    }

    // Create deployment scenarios if they don't exist
    const createdDeploymentScenarios = [];
    for (const scenario of deploymentScenarios) {
      let deploymentScenario = await prisma.deploymentScenario.findFirst({
        where: { name: scenario }
      });
      
      if (!deploymentScenario) {
        deploymentScenario = await prisma.deploymentScenario.create({
          data: {
            name: scenario,
            complexityPoints: Math.floor(Math.random() * 15) + 10,
            regulatoryPathway: 'FDA 510(k)',
            validationRequirements: {
              clinical: true,
              manufacturing: true,
              quality: true
            }
          }
        });
      }
      createdDeploymentScenarios.push(deploymentScenario);
    }

    // Create 100 assessments
    const assessments = [];
    let assessmentIndex = 0;

    for (const statusGroup of assessmentStatuses) {
      for (let i = 0; i < statusGroup.count; i++) {
        const assessmentName = generateAssessmentName(assessmentIndex);
        const currentScore = generateScore(statusGroup.status, assessmentIndex);
        const maxPossibleScore = 100;
        const createdAt = getRandomDate();
        const completedAt = statusGroup.status === 'completed' ? 
          new Date(createdAt.getTime() + Math.random() * (30 * 24 * 60 * 60 * 1000)) : null;

        const assessment = await prisma.assessment.create({
          data: {
            tenantId: gileadTenant.id,
            assessmentName,
            geographicScope: ['US', 'EU', 'APAC'][Math.floor(Math.random() * 3)],
            ipStrategy: ['Proprietary', 'Open Source', 'Hybrid'][Math.floor(Math.random() * 3)],
            currentScore,
            maxPossibleScore,
            status: statusGroup.status,
            version: '1.0',
            completedAt,
            completedBy: statusGroup.status === 'completed' ? 'system@complianceiq.com' : null,
            createdAt,
            updatedAt: createdAt,
            // Connect to therapeutic areas
            therapeuticAreas: {
              connect: [
                { id: createdTherapeuticAreas[Math.floor(Math.random() * createdTherapeuticAreas.length)].id }
              ]
            },
            // Connect to AI model types
            aiModelTypes: {
              connect: [
                { id: createdAIModelTypes[Math.floor(Math.random() * createdAIModelTypes.length)].id }
              ]
            },
            // Connect to deployment scenarios
            deploymentScenarios: {
              connect: [
                { id: createdDeploymentScenarios[Math.floor(Math.random() * createdDeploymentScenarios.length)].id }
              ]
            }
          }
        });

        // Add learning insights for failed assessments
        if (statusGroup.status === 'failed') {
          await prisma.learningInsight.create({
            data: {
              assessmentId: assessment.id,
              insightType: 'failure_analysis',
              insightData: {
                failureReason: generateFailureReason(),
                severity: 'high',
                recommendations: [
                  'Implement comprehensive data observability framework',
                  'Develop FDA AI governance documentation',
                  'Establish model validation protocols',
                  'Create risk management procedures'
                ],
                affectedAreas: ['Data Management', 'AI Governance', 'Regulatory Compliance'],
                nextSteps: [
                  'Schedule compliance review meeting',
                  'Assign dedicated AI governance team',
                  'Develop remediation timeline',
                  'Implement monitoring dashboard'
                ]
              },
              confidenceScore: 0.85
            }
          });
        }

        // Add learning insights for successful assessments
        if (statusGroup.status === 'completed' && currentScore >= 80) {
          await prisma.learningInsight.create({
            data: {
              assessmentId: assessment.id,
              insightType: 'success_analysis',
              insightData: {
                successFactors: [
                  'Strong data governance framework',
                  'Comprehensive AI model validation',
                  'Effective regulatory documentation',
                  'Robust monitoring and observability'
                ],
                bestPractices: [
                  'Regular compliance audits',
                  'Continuous model monitoring',
                  'Stakeholder engagement',
                  'Documentation maintenance'
                ],
                recommendations: [
                  'Share best practices across organization',
                  'Maintain current governance standards',
                  'Continue monitoring and improvement'
                ]
              },
              confidenceScore: 0.90
            }
          });
        }

        assessments.push(assessment);
        assessmentIndex++;
      }
    }

    console.log(`✅ Created ${assessments.length} Gilead assessments:`);
    console.log(`   • ${assessmentStatuses[0].count} completed (${Math.round(assessmentStatuses[0].count * assessmentStatuses[0].successRate)} successful)`);
    console.log(`   • ${assessmentStatuses[1].count} in progress`);
    console.log(`   • ${assessmentStatuses[2].count} failed`);
    console.log(`   • ${therapeuticAreas.length} therapeutic areas`);
    console.log(`   • ${aiModelTypes.length} AI model types`);
    console.log(`   • ${deploymentScenarios.length} deployment scenarios`);

    // Create some collaboration sessions for active assessments
    const inProgressAssessments = assessments.filter(a => a.status === 'in_progress');
    const collaborationSessions = [];

    if (inProgressAssessments.length > 0) {
      // Create organization for collaboration
      let organization = await prisma.organization.findFirst({
        where: { name: 'Gilead Sciences - AI Compliance Team' }
      });

      if (!organization) {
        organization = await prisma.organization.create({
          data: {
            name: 'Gilead Sciences - AI Compliance Team',
            type: 'Internal Team',
            description: 'Internal team responsible for AI compliance and governance'
          }
        });
      }

      // Create a system user for collaboration sessions
      let systemUser = await prisma.user.findFirst({
        where: { email: 'system@complianceiq.com' }
      });

      if (!systemUser) {
        // Create a default role first
        let defaultRole = await prisma.role.findFirst({
          where: { name: 'System Administrator' }
        });

        if (!defaultRole) {
          defaultRole = await prisma.role.create({
            data: {
              name: 'System Administrator',
              description: 'System administrator role for automated processes',
              organizationId: organization.id,
              accessLevel: 'admin'
            }
          });
        }

        systemUser = await prisma.user.create({
          data: {
            email: 'system@complianceiq.com',
            name: 'ComplianceIQ System',
            organizationId: organization.id,
            roleId: defaultRole.id
          }
        });
      }

      for (let i = 0; i < Math.min(10, inProgressAssessments.length); i++) {
        const assessment = inProgressAssessments[i];

        const session = await prisma.collaborationSession.create({
          data: {
            assessmentId: assessment.id,
            organizationId: organization.id,
            sessionName: `Collaboration Session - ${assessment.assessmentName}`,
            description: `Active collaboration session for ${assessment.assessmentName}`,
            status: 'active',
            createdBy: systemUser.id
          }
        });

        collaborationSessions.push(session);
      }
    }

    console.log(`✅ Created ${collaborationSessions.length} collaboration sessions`);

    console.log('🎉 Gilead assessment seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   • Company: ${gileadData.name}`);
    console.log(`   • Total Assessments: ${assessments.length}`);
    console.log(`   • Success Rate: ${Math.round((assessmentStatuses[0].count * assessmentStatuses[0].successRate / assessments.length) * 100)}%`);
    console.log(`   • Active Sessions: ${collaborationSessions.length}`);
    console.log('');
    console.log('🔍 Key Failure Reasons:');
    failureReasons.slice(0, 5).forEach((reason, index) => {
      console.log(`   ${index + 1}. ${reason}`);
    });

  } catch (error) {
    console.error('❌ Error seeding Gilead assessments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedGileadAssessments()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedGileadAssessments };
