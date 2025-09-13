import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Comprehensive seed data for persona-driven assessment system
async function seedPersonaDrivenAssessment() {
  console.log('🌱 Seeding persona-driven assessment system...');

  // 1. Create Personas
  const personas = await Promise.all([
    prisma.persona.create({
      data: {
        id: 'admin',
        name: 'System Administrator',
        description: 'Full system access and comprehensive assessment',
        isAdmin: true,
      },
    }),
    prisma.persona.create({
      data: {
        id: 'executive',
        name: 'Executive Leadership',
        description: 'Strategic oversight and decision making',
        isAdmin: false,
      },
    }),
    prisma.persona.create({
      data: {
        id: 'data-science',
        name: 'Data Science & AI Team',
        description: 'AI/ML model development and validation',
        isAdmin: false,
      },
    }),
    prisma.persona.create({
      data: {
        id: 'regulatory',
        name: 'Regulatory Affairs',
        description: 'Regulatory compliance and submissions',
        isAdmin: false,
      },
    }),
    prisma.persona.create({
      data: {
        id: 'quality',
        name: 'Quality Assurance & Risk',
        description: 'Quality systems and risk management',
        isAdmin: false,
      },
    }),
    prisma.persona.create({
      data: {
        id: 'legal',
        name: 'Legal & Privacy',
        description: 'Legal compliance and privacy protection',
        isAdmin: false,
      },
    }),
    prisma.persona.create({
      data: {
        id: 'clinical',
        name: 'Clinical Operations',
        description: 'Clinical trial operations and safety',
        isAdmin: false,
      },
    }),
    prisma.persona.create({
      data: {
        id: 'data-gov',
        name: 'Data & IT Governance',
        description: 'Data governance and IT security',
        isAdmin: false,
      },
    }),
    prisma.persona.create({
      data: {
        id: 'technical',
        name: 'Technical Operations',
        description: 'Technical implementation and operations',
        isAdmin: false,
      },
    }),
  ]);

  console.log(`✅ Created ${personas.length} personas`);

  // 2. Create Sub-Personas
  const subPersonas = await Promise.all([
    // Admin sub-personas
    prisma.subPersona.create({
      data: {
        id: 'admin-full',
        personaId: 'admin',
        name: 'Full Admin Access',
        description: 'Complete system administration and assessment access',
        expertiseLevel: 'expert',
      },
    }),

    // Executive sub-personas
    prisma.subPersona.create({
      data: {
        id: 'ceo',
        personaId: 'executive',
        name: 'Chief Executive Officer',
        description: 'Strategic leadership and decision making',
        expertiseLevel: 'expert',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'cto',
        personaId: 'executive',
        name: 'Chief Technology Officer',
        description: 'Technology strategy and oversight',
        expertiseLevel: 'expert',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'vp-strategy',
        personaId: 'executive',
        name: 'VP Strategy',
        description: 'Strategic planning and business development',
        expertiseLevel: 'intermediate',
      },
    }),

    // Data Science sub-personas
    prisma.subPersona.create({
      data: {
        id: 'data-head',
        personaId: 'data-science',
        name: 'Data Science Head',
        description: 'AI/ML strategy and team leadership',
        expertiseLevel: 'expert',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'ml-engineer',
        personaId: 'data-science',
        name: 'ML Engineer',
        description: 'Machine learning model development',
        expertiseLevel: 'intermediate',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'ai-researcher',
        personaId: 'data-science',
        name: 'AI Researcher',
        description: 'Advanced AI research and development',
        expertiseLevel: 'expert',
      },
    }),

    // Regulatory sub-personas
    prisma.subPersona.create({
      data: {
        id: 'regulatory-director',
        personaId: 'regulatory',
        name: 'Regulatory Affairs Director',
        description: 'Regulatory strategy and compliance oversight',
        expertiseLevel: 'expert',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'international-specialist',
        personaId: 'regulatory',
        name: 'International Regulatory Specialist',
        description: 'Global regulatory compliance',
        expertiseLevel: 'intermediate',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'compliance-officer',
        personaId: 'regulatory',
        name: 'Compliance Officer',
        description: 'Regulatory compliance monitoring',
        expertiseLevel: 'intermediate',
      },
    }),

    // Quality sub-personas
    prisma.subPersona.create({
      data: {
        id: 'qa-director',
        personaId: 'quality',
        name: 'Quality Assurance Director',
        description: 'Quality systems and standards oversight',
        expertiseLevel: 'expert',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'risk-management',
        personaId: 'quality',
        name: 'Risk Management Specialist',
        description: 'Risk assessment and mitigation',
        expertiseLevel: 'intermediate',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'audit-specialist',
        personaId: 'quality',
        name: 'Audit Specialist',
        description: 'Internal and external auditing',
        expertiseLevel: 'intermediate',
      },
    }),

    // Legal sub-personas
    prisma.subPersona.create({
      data: {
        id: 'legal-counsel',
        personaId: 'legal',
        name: 'Legal Counsel',
        description: 'Legal compliance and risk management',
        expertiseLevel: 'expert',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'privacy-officer',
        personaId: 'legal',
        name: 'Privacy Officer',
        description: 'Data privacy and protection',
        expertiseLevel: 'intermediate',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'compliance-legal',
        personaId: 'legal',
        name: 'Compliance Legal Specialist',
        description: 'Legal compliance monitoring',
        expertiseLevel: 'intermediate',
      },
    }),

    // Clinical sub-personas
    prisma.subPersona.create({
      data: {
        id: 'clinical-director',
        personaId: 'clinical',
        name: 'Clinical Operations Director',
        description: 'Clinical trial operations oversight',
        expertiseLevel: 'expert',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'medical-affairs',
        personaId: 'clinical',
        name: 'Medical Affairs Specialist',
        description: 'Medical and scientific affairs',
        expertiseLevel: 'intermediate',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'safety-officer',
        personaId: 'clinical',
        name: 'Safety Officer',
        description: 'Patient safety and pharmacovigilance',
        expertiseLevel: 'intermediate',
      },
    }),

    // Data Governance sub-personas
    prisma.subPersona.create({
      data: {
        id: 'chief-data-officer',
        personaId: 'data-gov',
        name: 'Chief Data Officer',
        description: 'Data strategy and governance oversight',
        expertiseLevel: 'expert',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'data-governance',
        personaId: 'data-gov',
        name: 'Data Governance Specialist',
        description: 'Data governance implementation',
        expertiseLevel: 'intermediate',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'it-security',
        personaId: 'data-gov',
        name: 'IT Security Specialist',
        description: 'Information security and compliance',
        expertiseLevel: 'intermediate',
      },
    }),

    // Technical sub-personas
    prisma.subPersona.create({
      data: {
        id: 'system-integration',
        personaId: 'technical',
        name: 'System Integration Specialist',
        description: 'System integration and architecture',
        expertiseLevel: 'intermediate',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'technical-writer',
        personaId: 'technical',
        name: 'Technical Writer',
        description: 'Technical documentation and procedures',
        expertiseLevel: 'basic',
      },
    }),
    prisma.subPersona.create({
      data: {
        id: 'devops',
        personaId: 'technical',
        name: 'DevOps Engineer',
        description: 'Development operations and deployment',
        expertiseLevel: 'intermediate',
      },
    }),
  ]);

  console.log(`✅ Created ${subPersonas.length} sub-personas`);

  // 3. Create Assessment Sections (26 comprehensive sections based on your list)
  const sections = await Promise.all([
    // 1. FDA Seven-Step Credibility Assessment
    prisma.assessmentSection.create({
      data: {
        id: 'fda-seven-step',
        sectionNumber: 1,
        title: 'FDA Seven-Step Credibility Assessment',
        basePoints: 72,
        isCriticalBlocker: true,
      },
    }),
    
    // 2. Regulatory Compliance & FDA 2025 Guidance
    prisma.assessmentSection.create({
      data: {
        id: 'regulatory-compliance',
        sectionNumber: 2,
        title: 'Regulatory Compliance & FDA 2025 Guidance',
        basePoints: 72,
        isCriticalBlocker: true,
      },
    }),
    
    // 3. AI Governance Committee Structure
    prisma.assessmentSection.create({
      data: {
        id: 'governance-committee',
        sectionNumber: 3,
        title: 'AI Governance Committee Structure',
        basePoints: 78,
        isCriticalBlocker: true,
      },
    }),
    
    // 4. Technology-Specific Governance (ML/DL/NLP)
    prisma.assessmentSection.create({
      data: {
        id: 'tech-specific-governance',
        sectionNumber: 4,
        title: 'Technology-Specific Governance (ML/DL/NLP)',
        basePoints: 82,
        isCriticalBlocker: true,
      },
    }),
    
    // 5. International Standards Compliance (IEEE/ISO/NIST)
    prisma.assessmentSection.create({
      data: {
        id: 'international-standards',
        sectionNumber: 5,
        title: 'International Standards Compliance (IEEE/ISO/NIST)',
        basePoints: 71,
        isCriticalBlocker: true,
      },
    }),
    
    // 6. AI Model Validation Coverage
    prisma.assessmentSection.create({
      data: {
        id: 'ai-model-validation',
        sectionNumber: 6,
        title: 'AI Model Validation Coverage',
        basePoints: 87,
        isCriticalBlocker: true,
      },
    }),
    
    // 7. Data Privacy Compliance Rate
    prisma.assessmentSection.create({
      data: {
        id: 'data-privacy',
        sectionNumber: 7,
        title: 'Data Privacy Compliance Rate',
        basePoints: 94,
        isCriticalBlocker: true,
      },
    }),
    
    // 8. Clinical Trial Protocol Adherence
    prisma.assessmentSection.create({
      data: {
        id: 'clinical-protocols',
        sectionNumber: 8,
        title: 'Clinical Trial Protocol Adherence',
        basePoints: 76,
        isCriticalBlocker: true,
      },
    }),
    
    // 9. Quality Assurance Score
    prisma.assessmentSection.create({
      data: {
        id: 'quality-assurance',
        sectionNumber: 9,
        title: 'Quality Assurance Score',
        basePoints: 89,
        isCriticalBlocker: true,
      },
    }),
    
    // 10. Algorithm Bias Detection Rate
    prisma.assessmentSection.create({
      data: {
        id: 'algorithm-bias',
        sectionNumber: 10,
        title: 'Algorithm Bias Detection Rate',
        basePoints: 92,
        isCriticalBlocker: true,
      },
    }),
    
    // 11. GDPR Compliance Score
    prisma.assessmentSection.create({
      data: {
        id: 'gdpr-compliance',
        sectionNumber: 11,
        title: 'GDPR Compliance Score',
        basePoints: 91,
        isCriticalBlocker: true,
      },
    }),
    
    // 12. Cross-Jurisdictional Standards Alignment
    prisma.assessmentSection.create({
      data: {
        id: 'cross-jurisdictional',
        sectionNumber: 12,
        title: 'Cross-Jurisdictional Standards Alignment',
        basePoints: 69,
        isCriticalBlocker: true,
      },
    }),
    
    // 13. AI Risk Management Framework
    prisma.assessmentSection.create({
      data: {
        id: 'ai-risk-management',
        sectionNumber: 13,
        title: 'AI Risk Management Framework',
        basePoints: 74,
        isCriticalBlocker: true,
      },
    }),
    
    // 14. ICH GCP Compliance
    prisma.assessmentSection.create({
      data: {
        id: 'ich-gcp',
        sectionNumber: 14,
        title: 'ICH GCP Compliance',
        basePoints: 83,
        isCriticalBlocker: true,
      },
    }),
    
    // 15. FDA 21 CFR Part 11 Compliance
    prisma.assessmentSection.create({
      data: {
        id: 'fda-21-cfr-11',
        sectionNumber: 15,
        title: 'FDA 21 CFR Part 11 Compliance',
        basePoints: 96,
        isCriticalBlocker: true,
      },
    }),
    
    // 16. International Regulatory Harmonization
    prisma.assessmentSection.create({
      data: {
        id: 'international-harmonization',
        sectionNumber: 16,
        title: 'International Regulatory Harmonization',
        basePoints: 68,
        isCriticalBlocker: true,
      },
    }),
    
    // 17. AI Pharmacovigilance & Post-Market Surveillance
    prisma.assessmentSection.create({
      data: {
        id: 'ai-pharmacovigilance',
        sectionNumber: 17,
        title: 'AI Pharmacovigilance & Post-Market Surveillance',
        basePoints: 71,
        isCriticalBlocker: true,
      },
    }),
    
    // 18. AI Legal Compliance & Liability Framework
    prisma.assessmentSection.create({
      data: {
        id: 'ai-legal-compliance',
        sectionNumber: 18,
        title: 'AI Legal Compliance & Liability Framework',
        basePoints: 65,
        isCriticalBlocker: true,
      },
    }),
    
    // 19. Good Machine Learning Practice (GMLP)
    prisma.assessmentSection.create({
      data: {
        id: 'gmlp-framework',
        sectionNumber: 19,
        title: 'Good Machine Learning Practice (GMLP)',
        basePoints: 73,
        isCriticalBlocker: true,
      },
    }),
    
    // 20. Final Integration & Validation Framework
    prisma.assessmentSection.create({
      data: {
        id: 'final-integration',
        sectionNumber: 20,
        title: 'Final Integration & Validation Framework',
        basePoints: 76,
        isCriticalBlocker: true,
      },
    }),
    
    // 21. Business Impact & ROI Assessment Framework
    prisma.assessmentSection.create({
      data: {
        id: 'business-impact',
        sectionNumber: 21,
        title: 'Business Impact & ROI Assessment Framework',
        basePoints: 68,
        isCriticalBlocker: true,
      },
    }),
    
    // 22. Third-Party AI Risk Assessment Framework
    prisma.assessmentSection.create({
      data: {
        id: 'third-party-risk',
        sectionNumber: 22,
        title: 'Third-Party AI Risk Assessment Framework',
        basePoints: 72,
        isCriticalBlocker: true,
      },
    }),
    
    // 23. Advanced Data Governance Framework
    prisma.assessmentSection.create({
      data: {
        id: 'advanced-data-gov',
        sectionNumber: 23,
        title: 'Advanced Data Governance Framework',
        basePoints: 74,
        isCriticalBlocker: true,
      },
    }),
    
    // 24. AI System Interoperability Framework
    prisma.assessmentSection.create({
      data: {
        id: 'ai-interoperability',
        sectionNumber: 24,
        title: 'AI System Interoperability Framework',
        basePoints: 70,
        isCriticalBlocker: true,
      },
    }),
    
    // 25. Context of Use (COU) Definition
    prisma.assessmentSection.create({
      data: {
        id: 'context-of-use',
        sectionNumber: 25,
        title: 'Context of Use (COU) Definition',
        basePoints: 69,
        isCriticalBlocker: true,
      },
    }),
    
    // 26. AI Validation (General)
    prisma.assessmentSection.create({
      data: {
        id: 'ai-validation-general',
        sectionNumber: 26,
        title: 'AI Validation (General)',
        basePoints: 75,
        isCriticalBlocker: true,
      },
    }),
  ]);

  console.log(`✅ Created ${sections.length} assessment sections`);

  // 4. Create Persona-Section Mappings
  const personaSectionMappings = [];

  // Admin gets access to ALL sections
  for (const section of sections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'admin',
          subPersonaId: 'admin-full',
          sectionId: section.id,
          accessLevel: 'primary',
          responsibilityType: 'owner',
          canEdit: true,
          canApprove: true,
          canReview: true,
          isRequired: true,
          priorityScore: 3,
          collaborationNotes: 'Full administrative access to all assessment sections',
        },
      })
    );
  }

  // Data Science gets technical sections
  const dataScienceSections = [
    { id: 'ai-model-validation', priority: 3, required: true },
    { id: 'gmlp-framework', priority: 3, required: true },
    { id: 'algorithm-bias', priority: 3, required: true },
    { id: 'ai-interoperability', priority: 2, required: true },
    { id: 'advanced-data-gov', priority: 2, required: true },
    { id: 'tech-specific-governance', priority: 3, required: true },
    { id: 'ai-validation-general', priority: 3, required: true },
    { id: 'final-integration', priority: 2, required: true },
    { id: 'fda-seven-step', priority: 1, required: false },
    { id: 'context-of-use', priority: 2, required: true },
  ];

  for (const sectionMapping of dataScienceSections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'data-science',
          subPersonaId: 'data-head',
          sectionId: sectionMapping.id,
          accessLevel: 'primary',
          responsibilityType: 'owner',
          canEdit: true,
          canApprove: false,
          canReview: true,
          isRequired: sectionMapping.required,
          priorityScore: sectionMapping.priority,
          collaborationNotes: 'Technical lead for AI/ML model development and validation',
        },
      })
    );
  }

  // Regulatory gets regulatory sections
  const regulatorySections = [
    { id: 'fda-seven-step', priority: 3, required: true },
    { id: 'regulatory-compliance', priority: 3, required: true },
    { id: 'international-harmonization', priority: 3, required: true },
    { id: 'ai-legal-compliance', priority: 3, required: true },
    { id: 'ai-pharmacovigilance', priority: 3, required: true },
    { id: 'clinical-protocols', priority: 2, required: true },
    { id: 'ich-gcp', priority: 3, required: true },
    { id: 'fda-21-cfr-11', priority: 3, required: true },
    { id: 'cross-jurisdictional', priority: 2, required: true },
    { id: 'context-of-use', priority: 3, required: true },
  ];

  for (const sectionMapping of regulatorySections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'regulatory',
          subPersonaId: 'regulatory-director',
          sectionId: sectionMapping.id,
          accessLevel: 'primary',
          responsibilityType: 'owner',
          canEdit: true,
          canApprove: true,
          canReview: true,
          isRequired: sectionMapping.required,
          priorityScore: sectionMapping.priority,
          collaborationNotes: 'Regulatory compliance and submission oversight',
        },
      })
    );
  }

  // Executive gets strategic sections
  const executiveSections = [
    { id: 'business-impact', priority: 3, required: true },
    { id: 'governance-committee', priority: 3, required: true },
    { id: 'tech-specific-governance', priority: 3, required: true },
    { id: 'third-party-risk', priority: 2, required: true },
    { id: 'ai-risk-management', priority: 2, required: true },
    { id: 'international-standards', priority: 2, required: false },
    { id: 'final-integration', priority: 2, required: false },
  ];

  for (const sectionMapping of executiveSections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'executive',
          subPersonaId: 'ceo',
          sectionId: sectionMapping.id,
          accessLevel: 'primary',
          responsibilityType: 'approver',
          canEdit: false,
          canApprove: true,
          canReview: true,
          isRequired: sectionMapping.required,
          priorityScore: sectionMapping.priority,
          collaborationNotes: 'Strategic oversight and final approval authority',
        },
      })
    );
  }

  // Legal gets legal sections
  const legalSections = [
    { id: 'ai-legal-compliance', priority: 3, required: true },
    { id: 'data-privacy', priority: 3, required: true },
    { id: 'gdpr-compliance', priority: 3, required: true },
    { id: 'third-party-risk', priority: 3, required: true },
    { id: 'ai-risk-management', priority: 2, required: true },
    { id: 'cross-jurisdictional', priority: 2, required: false },
    { id: 'governance-committee', priority: 2, required: false },
  ];

  for (const sectionMapping of legalSections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'legal',
          subPersonaId: 'legal-counsel',
          sectionId: sectionMapping.id,
          accessLevel: 'primary',
          responsibilityType: 'owner',
          canEdit: true,
          canApprove: true,
          canReview: true,
          isRequired: sectionMapping.required,
          priorityScore: sectionMapping.priority,
          collaborationNotes: 'Legal compliance and risk management oversight',
        },
      })
    );
  }

  // Quality gets quality sections
  const qualitySections = [
    { id: 'quality-assurance', priority: 3, required: true },
    { id: 'algorithm-bias', priority: 3, required: true },
    { id: 'gmlp-framework', priority: 2, required: true },
    { id: 'ai-model-validation', priority: 2, required: true },
    { id: 'final-integration', priority: 2, required: true },
    { id: 'fda-21-cfr-11', priority: 2, required: true },
    { id: 'ai-validation-general', priority: 2, required: true },
  ];

  for (const sectionMapping of qualitySections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'quality',
          subPersonaId: 'qa-director',
          sectionId: sectionMapping.id,
          accessLevel: 'primary',
          responsibilityType: 'owner',
          canEdit: true,
          canApprove: true,
          canReview: true,
          isRequired: sectionMapping.required,
          priorityScore: sectionMapping.priority,
          collaborationNotes: 'Quality systems and standards oversight',
        },
      })
    );
  }

  // Clinical gets clinical sections
  const clinicalSections = [
    { id: 'clinical-protocols', priority: 3, required: true },
    { id: 'ai-pharmacovigilance', priority: 3, required: true },
    { id: 'algorithm-bias', priority: 3, required: true },
    { id: 'ich-gcp', priority: 3, required: true },
    { id: 'context-of-use', priority: 2, required: true },
    { id: 'regulatory-compliance', priority: 1, required: false },
  ];

  for (const sectionMapping of clinicalSections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'clinical',
          subPersonaId: 'clinical-director',
          sectionId: sectionMapping.id,
          accessLevel: 'primary',
          responsibilityType: 'owner',
          canEdit: true,
          canApprove: true,
          canReview: true,
          isRequired: sectionMapping.required,
          priorityScore: sectionMapping.priority,
          collaborationNotes: 'Clinical operations and patient safety oversight',
        },
      })
    );
  }

  // Data Governance gets data sections
  const dataGovSections = [
    { id: 'advanced-data-gov', priority: 3, required: true },
    { id: 'data-privacy', priority: 3, required: true },
    { id: 'gdpr-compliance', priority: 3, required: true },
    { id: 'ai-interoperability', priority: 2, required: true },
    { id: 'international-standards', priority: 2, required: true },
    { id: 'governance-committee', priority: 2, required: false },
  ];

  for (const sectionMapping of dataGovSections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'data-gov',
          subPersonaId: 'chief-data-officer',
          sectionId: sectionMapping.id,
          accessLevel: 'primary',
          responsibilityType: 'owner',
          canEdit: true,
          canApprove: true,
          canReview: true,
          isRequired: sectionMapping.required,
          priorityScore: sectionMapping.priority,
          collaborationNotes: 'Data governance and IT security oversight',
        },
      })
    );
  }

  // Technical gets technical sections
  const technicalSections = [
    { id: 'ai-interoperability', priority: 3, required: true },
    { id: 'final-integration', priority: 3, required: true },
    { id: 'advanced-data-gov', priority: 2, required: true },
    { id: 'tech-specific-governance', priority: 2, required: true },
    { id: 'international-standards', priority: 2, required: true },
    { id: 'ai-validation-general', priority: 2, required: true },
  ];

  for (const sectionMapping of technicalSections) {
    personaSectionMappings.push(
      prisma.personaSectionMapping.create({
        data: {
          personaId: 'technical',
          subPersonaId: 'system-integration',
          sectionId: sectionMapping.id,
          accessLevel: 'primary',
          responsibilityType: 'owner',
          canEdit: true,
          canApprove: false,
          canReview: true,
          isRequired: sectionMapping.required,
          priorityScore: sectionMapping.priority,
          collaborationNotes: 'Technical implementation and operations oversight',
        },
      })
    );
  }

  // Create all persona section mappings
  await Promise.all(personaSectionMappings);

  console.log(`✅ Created ${personaSectionMappings.length} persona-section mappings`);

  // 5. Create Sample Questions (simplified for demo)
  const sampleQuestions = [
    // Regulatory Compliance questions
    prisma.dynamicQuestion.create({
      data: {
        sectionId: 'regulatory-compliance',
        questionText: 'Is your Context of Use (COU) production-defined for each AI model\'s specific regulatory question and decision impact?',
        questionType: 'boolean',
        evidenceRequired: ['COU documentation', 'Regulatory question mapping'],
        responsibleRoles: ['Regulatory Affairs Director', 'Data Science Head'],
      },
    }),
    prisma.dynamicQuestion.create({
      data: {
        sectionId: 'regulatory-compliance',
        questionText: 'Is your seven-step credibility assessment framework production-implemented per FDA January 2025 guidance?',
        questionType: 'boolean',
        evidenceRequired: ['Seven-step framework documentation', 'FDA 2025 guidance compliance'],
        responsibleRoles: ['Regulatory Affairs Director', 'Quality Assurance Director'],
      },
    }),

    // AI Model Validation questions
    prisma.dynamicQuestion.create({
      data: {
        sectionId: 'ai-model-validation',
        questionText: 'Do you have comprehensive model validation protocols for all AI/ML models in production?',
        questionType: 'boolean',
        evidenceRequired: ['Validation protocols', 'Model testing results'],
        responsibleRoles: ['Data Science Head', 'Quality Assurance Manager'],
      },
    }),
    prisma.dynamicQuestion.create({
      data: {
        sectionId: 'ai-model-validation',
        questionText: 'Are your model performance metrics continuously monitored in production?',
        questionType: 'boolean',
        evidenceRequired: ['Monitoring dashboards', 'Performance reports'],
        responsibleRoles: ['ML Engineer', 'DevOps Engineer'],
      },
    }),

    // Business Impact questions
    prisma.dynamicQuestion.create({
      data: {
        sectionId: 'business-impact',
        questionText: 'Have you quantified the business value and ROI of your AI initiatives?',
        questionType: 'boolean',
        evidenceRequired: ['ROI analysis', 'Business case documentation'],
        responsibleRoles: ['CEO', 'CTO', 'VP Strategy'],
      },
    }),
  ];

  await Promise.all(sampleQuestions);

  console.log(`✅ Created ${sampleQuestions.length} sample questions`);

  console.log('🎉 Persona-driven assessment system seeded successfully!');
}

// Run the seed function
seedPersonaDrivenAssessment()
  .catch((e) => {
    console.error('❌ Error seeding persona-driven assessment:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
