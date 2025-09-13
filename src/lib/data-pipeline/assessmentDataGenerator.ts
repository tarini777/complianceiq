import { prisma } from '@/lib/prisma';

export class AssessmentDataGenerator {
  private static readonly SAMPLE_COMPANIES = [
    { name: 'Gilead Sciences', industryType: 'Biotechnology', therapeuticFocus: ['Oncology', 'HIV/AIDS'], aiInitiatives: ['Drug Discovery', 'Clinical Trials'], deploymentScenarios: ['Clinical Decision Support', 'Drug Development'] },
    { name: 'Genentech', industryType: 'Biotechnology', therapeuticFocus: ['Oncology', 'Neurology'], aiInitiatives: ['Medical Imaging', 'Patient Monitoring'], deploymentScenarios: ['Diagnostic Support', 'Treatment Optimization'] },
    { name: 'Exelixis', industryType: 'Pharmaceutical', therapeuticFocus: ['Oncology', 'Immunology'], aiInitiatives: ['Drug Discovery', 'Biomarker Analysis'], deploymentScenarios: ['Research & Development', 'Clinical Trials'] },
    { name: 'AbbVie', industryType: 'Pharmaceutical', therapeuticFocus: ['Immunology', 'Mental Health'], aiInitiatives: ['Patient Care', 'Drug Development'], deploymentScenarios: ['Clinical Decision Support', 'Patient Monitoring'] },
    { name: 'Moderna', industryType: 'Biotechnology', therapeuticFocus: ['Infectious Diseases', 'Oncology'], aiInitiatives: ['mRNA Technology', 'Vaccine Development'], deploymentScenarios: ['Research & Development', 'Manufacturing'] },
    { name: 'Pfizer', industryType: 'Pharmaceutical', therapeuticFocus: ['Cardiology', 'Oncology'], aiInitiatives: ['Drug Discovery', 'Clinical Trials'], deploymentScenarios: ['Clinical Decision Support', 'Drug Development'] },
    { name: 'Merck', industryType: 'Pharmaceutical', therapeuticFocus: ['Oncology', 'Infectious Diseases'], aiInitiatives: ['Medical Imaging', 'Patient Care'], deploymentScenarios: ['Diagnostic Support', 'Treatment Optimization'] },
    { name: 'Johnson & Johnson', industryType: 'Pharmaceutical', therapeuticFocus: ['Immunology', 'Neurology'], aiInitiatives: ['Medical Devices', 'Patient Monitoring'], deploymentScenarios: ['Clinical Decision Support', 'Medical Devices'] }
  ];

  private static readonly ASSESSMENT_TEMPLATES = [
    {
      name: 'AI Readiness Assessment - Oncology Platform',
      geographicScope: 'Global',
      ipStrategy: 'Proprietary',
      maxPossibleScore: 1000,
      status: 'completed' as const,
      currentScore: 87
    },
    {
      name: 'AI Compliance Assessment - Neurology AI',
      geographicScope: 'US/EU',
      ipStrategy: 'Open Source',
      maxPossibleScore: 1000,
      status: 'in_progress' as const,
      currentScore: 65
    },
    {
      name: 'AI Safety Assessment - Drug Discovery',
      geographicScope: 'Global',
      ipStrategy: 'Hybrid',
      maxPossibleScore: 1000,
      status: 'pending' as const,
      currentScore: 0
    },
    {
      name: 'AI Ethics Assessment - Mental Health AI',
      geographicScope: 'US',
      ipStrategy: 'Proprietary',
      maxPossibleScore: 1000,
      status: 'completed' as const,
      currentScore: 92
    },
    {
      name: 'AI Governance Assessment - mRNA Platform',
      geographicScope: 'Global',
      ipStrategy: 'Proprietary',
      maxPossibleScore: 1000,
      status: 'in_progress' as const,
      currentScore: 78
    }
  ];

  static async generateSampleData() {
    console.log('Starting assessment data generation...');

    try {
      // Create sample tenants (companies)
      const tenants = [];
      for (const company of this.SAMPLE_COMPANIES) {
        const tenant = await prisma.tenant.upsert({
          where: { id: company.name.toLowerCase().replace(/\s+/g, '-') },
          update: {},
          create: {
            id: company.name.toLowerCase().replace(/\s+/g, '-'),
            name: company.name,
            industryType: company.industryType,
            description: `${company.name} - Leading ${company.industryType.toLowerCase()} company`,
            website: `https://www.${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
            subscriptionTier: 'Enterprise',
            isActive: true,
            therapeuticFocus: company.therapeuticFocus,
            aiInitiatives: company.aiInitiatives,
            deploymentScenarios: company.deploymentScenarios
          }
        });
        tenants.push(tenant);
      }

      console.log(`Created ${tenants.length} tenants`);

      // Get therapeutic areas and AI model types
      const therapeuticAreas = await prisma.therapeuticArea.findMany();
      const aiModelTypes = await prisma.aIModelType.findMany();
      const deploymentScenarios = await prisma.deploymentScenario.findMany();

      // Create sample assessments
      const assessments = [];
      for (let i = 0; i < tenants.length; i++) {
        const tenant = tenants[i];
        const template = this.ASSESSMENT_TEMPLATES[i % this.ASSESSMENT_TEMPLATES.length];
        
        const assessment = await prisma.assessment.create({
          data: {
            tenantId: tenant.id,
            assessmentName: `${template.name} - ${tenant.name}`,
            geographicScope: template.geographicScope,
            ipStrategy: template.ipStrategy,
            currentScore: template.currentScore,
            maxPossibleScore: template.maxPossibleScore,
            status: template.status,
            version: '1.0',
            completedAt: template.status === 'completed' ? new Date() : null,
            completedBy: template.status === 'completed' ? 'system' : null,
            // Connect related entities
            therapeuticAreas: {
              connect: therapeuticAreas.slice(0, Math.min(2, therapeuticAreas.length)).map(ta => ({ id: ta.id }))
            },
            aiModelTypes: {
              connect: aiModelTypes.slice(0, Math.min(2, aiModelTypes.length)).map(amt => ({ id: amt.id }))
            },
            deploymentScenarios: {
              connect: deploymentScenarios.slice(0, Math.min(2, deploymentScenarios.length)).map(ds => ({ id: ds.id }))
            }
          }
        });
        assessments.push(assessment);
      }

      console.log(`Created ${assessments.length} assessments`);

      // Generate sample user responses for completed and in-progress assessments
      const assessmentSections = await prisma.assessmentSection.findMany({
        include: { questions: true }
      });

      for (const assessment of assessments.filter(a => a.status !== 'pending')) {
        const responseCount = Math.floor(Math.random() * 50) + 20; // 20-70 responses per assessment
        
        for (let i = 0; i < responseCount; i++) {
          const section = assessmentSections[Math.floor(Math.random() * assessmentSections.length)];
          const question = section.questions[Math.floor(Math.random() * section.questions.length)];
          
          if (question) {
            await prisma.userResponse.create({
              data: {
                assessmentId: assessment.id,
                questionId: question.id,
                responseValue: this.generateResponseValue(question.questionType),
                evidenceDocuments: this.generateEvidenceDocuments(),
                completionStatus: Math.random() > 0.3 ? 'completed' : 'in_progress',
                validatedBy: Math.random() > 0.5 ? 'system' : null,
                validationDate: Math.random() > 0.5 ? new Date() : null
              }
            });
          }
        }
      }

      console.log('Assessment data generation completed successfully');
      return {
        tenants: tenants.length,
        assessments: assessments.length,
        responses: await prisma.userResponse.count()
      };

    } catch (error) {
      console.error('Error generating assessment data:', error);
      throw error;
    }
  }

  private static generateResponseValue(questionType: string): any {
    switch (questionType) {
      case 'multiple_choice':
        return { selected: Math.random() > 0.5 ? 'Yes' : 'No' };
      case 'scale':
        return { value: Math.floor(Math.random() * 5) + 1 };
      case 'text':
        return { text: 'Sample response text for compliance assessment' };
      case 'file_upload':
        return { files: ['document1.pdf', 'evidence2.docx'] };
      default:
        return { value: 'Sample response' };
    }
  }

  private static generateEvidenceDocuments(): string[] {
    const documents = [
      'compliance_policy.pdf',
      'risk_assessment.docx',
      'audit_report.pdf',
      'training_certificate.pdf',
      'system_documentation.docx'
    ];
    
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 documents
    return documents.slice(0, count);
  }

  static async clearSampleData() {
    console.log('Clearing sample assessment data...');
    
    try {
      // Delete in correct order due to foreign key constraints
      await prisma.userResponse.deleteMany();
      await prisma.assessment.deleteMany();
      await prisma.tenant.deleteMany();
      
      console.log('Sample data cleared successfully');
    } catch (error) {
      console.error('Error clearing sample data:', error);
      throw error;
    }
  }

  static async getDataStatistics() {
    try {
      const stats = {
        tenants: await prisma.tenant.count(),
        assessments: await prisma.assessment.count(),
        completedAssessments: await prisma.assessment.count({ where: { status: 'completed' } }),
        inProgressAssessments: await prisma.assessment.count({ where: { status: 'in_progress' } }),
        pendingAssessments: await prisma.assessment.count({ where: { status: 'pending' } }),
        userResponses: await prisma.userResponse.count(),
        averageScore: await prisma.assessment.aggregate({
          _avg: { currentScore: true }
        })
      };

      return stats;
    } catch (error) {
      console.error('Error getting data statistics:', error);
      throw error;
    }
  }
}
