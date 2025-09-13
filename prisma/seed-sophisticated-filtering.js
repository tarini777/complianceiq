const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSophisticatedFilteringSystem() {
  console.log('🚀 Seeding sophisticated filtering system for all 26 sections...');

  try {
    // 1. Update all 26 sections with sophisticated filtering structure
    const sections = [
      { id: 'fda-seven-step', number: 1, title: 'FDA Seven-Step Credibility Assessment', type: 'regulatory', validator: 'Regulatory Affairs Director' },
      { id: 'regulatory-compliance', number: 2, title: 'Regulatory Compliance & FDA 2025 Guidance', type: 'regulatory', validator: 'Regulatory Affairs Director' },
      { id: 'governance-committee', number: 3, title: 'AI Governance Committee Structure', type: 'governance', validator: 'AI Governance Director' },
      { id: 'tech-specific-governance', number: 4, title: 'Technology-Specific Governance (ML/DL/NLP)', type: 'governance', validator: 'Technology Governance Director' },
      { id: 'international-standards', number: 5, title: 'International Standards Compliance (IEEE/ISO/NIST)', type: 'regulatory', validator: 'Compliance Director' },
      { id: 'ai-model-validation', number: 6, title: 'AI Model Validation Coverage', type: 'clinical', validator: 'Clinical Development VP' },
      { id: 'data-privacy', number: 7, title: 'Data Privacy Compliance Rate', type: 'safety', validator: 'Data Privacy Officer' },
      { id: 'clinical-protocols', number: 8, title: 'Clinical Trial Protocol Adherence', type: 'clinical', validator: 'Clinical Operations Director' },
      { id: 'quality-assurance', number: 9, title: 'Quality Assurance Score', type: 'safety', validator: 'Quality Assurance Director' },
      { id: 'algorithm-bias', number: 10, title: 'Algorithm Bias Detection Rate', type: 'safety', validator: 'Data Science/AI Head + Pharmacovigilance Director' },
      { id: 'gdpr-compliance', number: 11, title: 'GDPR Compliance Score', type: 'regulatory', validator: 'Legal Counsel + Data Privacy Officer' },
      { id: 'cross-jurisdictional', number: 12, title: 'Cross-Jurisdictional Standards Alignment', type: 'regulatory', validator: 'Regulatory Affairs Director' },
      { id: 'ai-risk-management', number: 13, title: 'AI Risk Management Framework', type: 'safety', validator: 'Risk Management Director' },
      { id: 'ich-gcp', number: 14, title: 'ICH GCP Compliance', type: 'clinical', validator: 'Clinical Operations Director' },
      { id: 'fda-21-cfr-11', number: 15, title: 'FDA 21 CFR Part 11 Compliance', type: 'regulatory', validator: 'Regulatory Affairs Director' },
      { id: 'international-harmonization', number: 16, title: 'International Regulatory Harmonization', type: 'regulatory', validator: 'Regulatory Affairs Director' },
      { id: 'ai-pharmacovigilance', number: 17, title: 'AI Pharmacovigilance & Post-Market Surveillance', type: 'safety', validator: 'Pharmacovigilance Director' },
      { id: 'ai-legal-compliance', number: 18, title: 'AI Legal Compliance & Liability Framework', type: 'regulatory', validator: 'Legal Counsel' },
      { id: 'gmlp-framework', number: 19, title: 'Good Machine Learning Practice (GMLP)', type: 'clinical', validator: 'Data Science/AI Head' },
      { id: 'final-integration', number: 20, title: 'Final Integration & Validation Framework', type: 'clinical', validator: 'Clinical Development VP' },
      { id: 'business-impact', number: 21, title: 'Business Impact & ROI Assessment Framework', type: 'governance', validator: 'Business Development VP' },
      { id: 'third-party-risk', number: 22, title: 'Third-Party AI Risk Assessment Framework', type: 'safety', validator: 'Risk Management Director' },
      { id: 'advanced-data-gov', number: 23, title: 'Advanced Data Governance Framework', type: 'safety', validator: 'Data Governance Director' },
      { id: 'ai-interoperability', number: 24, title: 'AI System Interoperability Framework', type: 'governance', validator: 'Technology Architecture Director' },
      { id: 'context-of-use', number: 25, title: 'Context of Use (COU) Definition', type: 'clinical', validator: 'Medical Affairs VP' },
      { id: 'ai-validation-general', number: 26, title: 'AI Validation (General)', type: 'clinical', validator: 'Clinical Development VP' }
    ];

    // Update sections with sophisticated filtering structure
    for (const section of sections) {
      await prisma.assessmentSection.update({
        where: { id: section.id },
        data: {
          sectionType: section.type,
          productionValidator: section.validator,
          therapyOverlaysJson: {
            oncology: {
              enabled: true,
              complexityMultiplier: 1.2,
              specificRequirements: [
                'Biomarker validation requirements',
                'Tumor classification standards',
                'SEER registry compliance',
                'Oncology endpoint validation'
              ]
            },
            cardiology: {
              enabled: true,
              complexityMultiplier: 1.15,
              specificRequirements: [
                'Cardiovascular endpoint assessment',
                'ECG interpretation standards',
                'AHA/ACC guideline compliance',
                'Cardiac risk stratification'
              ]
            },
            neurology: {
              enabled: true,
              complexityMultiplier: 1.25,
              specificRequirements: [
                'Neurological outcome measures',
                'Brain imaging analysis',
                'Cognitive assessment standards',
                'Movement disorder monitoring'
              ]
            },
            rare_disease: {
              enabled: true,
              complexityMultiplier: 1.3,
              specificRequirements: [
                'Small population modeling',
                'Natural history analysis',
                'Patient registry integration',
                'Rare phenotype validation'
              ]
            }
          },
          aiModelOverlaysJson: {
            traditional_ai: {
              enabled: true,
              complexityMultiplier: 1.0,
              specificRequirements: [
                'Model explainability systems',
                'Statistical validation protocols',
                'Performance monitoring',
                'Feature importance tracking'
              ]
            },
            generative_ai: {
              enabled: true,
              complexityMultiplier: 1.4,
              specificRequirements: [
                'Hallucination detection systems',
                'Content validation protocols',
                'Citation and evidence tracking',
                'Generated content quality assurance'
              ]
            },
            agentic_ai: {
              enabled: true,
              complexityMultiplier: 1.5,
              specificRequirements: [
                'Agent decision audit trails',
                'Multi-agent system governance',
                'Human oversight protocols',
                'Agent coordination safety controls'
              ]
            },
            computer_vision: {
              enabled: true,
              complexityMultiplier: 1.3,
              specificRequirements: [
                'Medical imaging analysis',
                'Pathology interpretation',
                'Radiology workflow integration',
                'Image quality assurance'
              ]
            }
          },
          learningComponentsJson: {
            bottleneckIntelligence: {
              enabled: true,
              components: [
                'Common regulatory bottlenecks',
                'Clinical validation delays',
                'Safety monitoring challenges',
                'Workflow integration issues'
              ]
            },
            resolutionStrategies: {
              enabled: true,
              components: [
                'Synthetic data generation',
                'Federated learning protocols',
                'Adaptive endpoint harmonization',
                'Gradual AI integration'
              ]
            },
            successMetrics: {
              enabled: true,
              components: [
                'Production readiness scores',
                'Validation completion rates',
                'Safety incident reduction',
                'Clinical adoption metrics'
              ]
            }
          }
        }
      });
    }

    console.log('✅ Updated all 26 sections with sophisticated filtering structure');

    // 2. Create therapy-specific overlays for all sections
    const therapeuticAreas = await prisma.therapeuticArea.findMany();
    const therapyOverlays = [];

    for (const section of sections) {
      for (const therapy of therapeuticAreas) {
        const overlayType = therapy.name.toLowerCase().replace(/\s+/g, '_');
        
        therapyOverlays.push({
          therapeuticAreaId: therapy.id,
          sectionId: section.id,
          overlayType: overlayType,
          overlayContent: {
            productionRequirements: [
              `Production-configured for ${therapy.name} requirements`,
              `Validated against ${therapy.name} regulatory standards`,
              `Integrated with ${therapy.name} clinical workflows`
            ],
            specificQuestions: [
              `Are your AI systems production-validated for ${therapy.name} endpoints?`,
              `Is your ${therapy.name} data processing production-compliant?`,
              `Are your ${therapy.name} safety protocols production-deployed?`
            ],
            complexityPoints: Math.floor(therapy.complexityPoints * 0.5)
          },
          complexityPoints: Math.floor(therapy.complexityPoints * 0.5)
        });
      }
    }

    // Bulk create therapy overlays
    for (const overlay of therapyOverlays) {
      await prisma.therapySpecificOverlay.create({
        data: overlay
      });
    }

    console.log(`✅ Created ${therapyOverlays.length} therapy-specific overlays`);

    // 3. Create AI model type-specific overlays for all sections
    const aiModelTypes = await prisma.aIModelType.findMany();
    const aiModelOverlays = [];

    for (const section of sections) {
      for (const aiModel of aiModelTypes) {
        const overlayType = aiModel.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        
        aiModelOverlays.push({
          aiModelTypeId: aiModel.id,
          sectionId: section.id,
          overlayType: overlayType,
          overlayContent: {
            productionRequirements: [
              `Production-configured for ${aiModel.name} deployment`,
              `Validated against ${aiModel.name} safety standards`,
              `Integrated with ${aiModel.name} monitoring systems`
            ],
            specificQuestions: [
              `Are your ${aiModel.name} systems production-ready?`,
              `Is your ${aiModel.name} validation production-compliant?`,
              `Are your ${aiModel.name} safety controls production-deployed?`
            ],
            complexityPoints: Math.floor(aiModel.complexityPoints * 0.3)
          },
          complexityPoints: Math.floor(aiModel.complexityPoints * 0.3)
        });
      }
    }

    // Bulk create AI model overlays
    for (const overlay of aiModelOverlays) {
      await prisma.aIModelSpecificOverlay.create({
        data: overlay
      });
    }

    console.log(`✅ Created ${aiModelOverlays.length} AI model type-specific overlays`);

    // 4. Create deployment scenario-specific overlays for all sections
    const deploymentScenarios = await prisma.deploymentScenario.findMany();
    const deploymentOverlays = [];

    for (const section of sections) {
      for (const scenario of deploymentScenarios) {
        const overlayType = scenario.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        
        deploymentOverlays.push({
          deploymentScenarioId: scenario.id,
          sectionId: section.id,
          overlayType: overlayType,
          overlayContent: {
            productionRequirements: [
              `Production-configured for ${scenario.name} deployment`,
              `Validated against ${scenario.name} regulatory requirements`,
              `Integrated with ${scenario.name} operational workflows`
            ],
            specificQuestions: [
              `Are your systems production-ready for ${scenario.name}?`,
              `Is your ${scenario.name} validation production-compliant?`,
              `Are your ${scenario.name} safety protocols production-deployed?`
            ],
            complexityPoints: Math.floor(scenario.complexityPoints * 0.4)
          },
          complexityPoints: Math.floor(scenario.complexityPoints * 0.4)
        });
      }
    }

    // Bulk create deployment overlays
    for (const overlay of deploymentOverlays) {
      await prisma.deploymentSpecificOverlay.create({
        data: overlay
      });
    }

    console.log(`✅ Created ${deploymentOverlays.length} deployment scenario-specific overlays`);

    // 5. Create learning system components for all sections
    const learningComponents = [];

    for (const section of sections) {
      // Bottleneck Intelligence
      learningComponents.push({
        sectionId: section.id,
        componentType: 'bottleneck_intelligence',
        componentName: `${section.title} Bottleneck Intelligence`,
        componentContent: {
          commonBottlenecks: [
            'Regulatory approval delays',
            'Clinical validation challenges',
            'Safety monitoring gaps',
            'Integration complexity'
          ],
          resolutionStrategies: [
            'Early regulatory engagement',
            'Phased validation approach',
            'Automated safety monitoring',
            'Modular integration design'
          ],
          successMetrics: [
            'Time to production deployment',
            'Validation completion rate',
            'Safety incident reduction',
            'Clinical adoption rate'
          ]
        }
      });

      // Resolution Strategy
      learningComponents.push({
        sectionId: section.id,
        componentType: 'resolution_strategy',
        componentName: `${section.title} Resolution Strategy`,
        componentContent: {
          strategies: [
            'Proactive risk mitigation',
            'Stakeholder alignment',
            'Technology optimization',
            'Process automation'
          ],
          implementationSteps: [
            'Assess current state',
            'Identify gaps',
            'Develop action plan',
            'Execute improvements'
          ],
          successFactors: [
            'Executive sponsorship',
            'Cross-functional collaboration',
            'Continuous monitoring',
            'Adaptive learning'
          ]
        }
      });

      // Success Metrics
      learningComponents.push({
        sectionId: section.id,
        componentType: 'success_metrics',
        componentName: `${section.title} Success Metrics`,
        componentContent: {
          keyMetrics: [
            'Production readiness score',
            'Validation completion rate',
            'Safety compliance rate',
            'Operational efficiency'
          ],
          measurementMethods: [
            'Automated monitoring',
            'Regular assessments',
            'Stakeholder feedback',
            'Performance analytics'
          ],
          targetValues: [
            '>90% production readiness',
            '>95% validation completion',
            '>99% safety compliance',
            '>20% efficiency improvement'
          ]
        }
      });
    }

    // Bulk create learning components
    for (const component of learningComponents) {
      await prisma.learningSystemComponent.create({
        data: component
      });
    }

    console.log(`✅ Created ${learningComponents.length} learning system components`);

    // 6. Create assessment scoring rules for all sections
    const scoringRules = [];

    for (const section of sections) {
      // Base scoring rule
      scoringRules.push({
        sectionId: section.id,
        ruleType: 'base_scoring',
        conditionLogic: {
          conditions: ['section_completed'],
          logic: 'AND'
        },
        points: section.basePoints || 50,
        maxPoints: section.basePoints || 50
      });

      // Therapy overlay scoring
      scoringRules.push({
        sectionId: section.id,
        ruleType: 'therapy_overlay',
        conditionLogic: {
          conditions: ['therapy_specific_requirements_met'],
          logic: 'AND'
        },
        points: 10,
        maxPoints: 20
      });

      // AI model overlay scoring
      scoringRules.push({
        sectionId: section.id,
        ruleType: 'ai_model_overlay',
        conditionLogic: {
          conditions: ['ai_model_requirements_met'],
          logic: 'AND'
        },
        points: 8,
        maxPoints: 15
      });

      // Deployment overlay scoring
      scoringRules.push({
        sectionId: section.id,
        ruleType: 'deployment_overlay',
        conditionLogic: {
          conditions: ['deployment_requirements_met'],
          logic: 'AND'
        },
        points: 6,
        maxPoints: 12
      });

      // Learning component scoring
      scoringRules.push({
        sectionId: section.id,
        ruleType: 'learning_component',
        conditionLogic: {
          conditions: ['learning_components_completed'],
          logic: 'AND'
        },
        points: 5,
        maxPoints: 10
      });
    }

    // Bulk create scoring rules
    for (const rule of scoringRules) {
      await prisma.assessmentScoringRule.create({
        data: rule
      });
    }

    console.log(`✅ Created ${scoringRules.length} assessment scoring rules`);

    console.log('🎉 Sophisticated filtering system seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Updated ${sections.length} sections with filtering structure`);
    console.log(`   - Created ${therapyOverlays.length} therapy-specific overlays`);
    console.log(`   - Created ${aiModelOverlays.length} AI model type-specific overlays`);
    console.log(`   - Created ${deploymentOverlays.length} deployment scenario-specific overlays`);
    console.log(`   - Created ${learningComponents.length} learning system components`);
    console.log(`   - Created ${scoringRules.length} assessment scoring rules`);

  } catch (error) {
    console.error('❌ Error seeding sophisticated filtering system:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedSophisticatedFilteringSystem()
    .then(() => {
      console.log('✅ Sophisticated filtering system seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Sophisticated filtering system seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSophisticatedFilteringSystem };
