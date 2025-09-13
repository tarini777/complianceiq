import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Compliance mapping API called');
    
    // Create simplified mock data for compliance mapping
    const mockData = {
      assessmentSections: [
        {
          id: 'data-observability',
          name: 'Data Observability & Monitoring',
          description: 'Monitoring and observability of data systems',
          category: 'Data Management',
          questionCount: 10,
          regulatoryRequirements: ['FDA-21-CFR-Part-11', 'GDPR-Article-25'],
          coverage: { total: 100, covered: 75, percentage: 75 },
          status: 'active'
        },
        {
          id: 'data-quality',
          name: 'Data Quality Assurance & Validation',
          description: 'Ensuring data quality and validation processes',
          category: 'Data Management',
          questionCount: 15,
          regulatoryRequirements: ['FDA-21-CFR-Part-11', 'ICH-E6-R2'],
          coverage: { total: 100, covered: 85, percentage: 85 },
          status: 'active'
        },
        {
          id: 'data-lineage',
          name: 'Data Lineage & Provenance Tracking',
          description: 'Tracking data lineage and provenance',
          category: 'Data Management',
          questionCount: 10,
          regulatoryRequirements: ['FDA-21-CFR-Part-11', 'GDPR-Article-25'],
          coverage: { total: 100, covered: 60, percentage: 60 },
          status: 'active'
        },
        {
          id: 'data-governance',
          name: 'Data Governance Framework',
          description: 'Data governance and management framework',
          category: 'Data Management',
          questionCount: 17,
          regulatoryRequirements: ['GDPR-Article-25', 'FDA-21-CFR-Part-11'],
          coverage: { total: 100, covered: 75, percentage: 75 },
          status: 'active'
        },
        {
          id: 'data-security',
          name: 'Data Security & Privacy Protection',
          description: 'Data security and privacy protection measures',
          category: 'Data Management',
          questionCount: 20,
          regulatoryRequirements: ['GDPR-Article-32', 'FDA-21-CFR-Part-11'],
          coverage: { total: 100, covered: 85, percentage: 85 },
          status: 'active'
        },
        {
          id: 'data-retention',
          name: 'Data Retention & Lifecycle Management',
          description: 'Data retention and lifecycle management',
          category: 'Data Management',
          questionCount: 13,
          regulatoryRequirements: ['GDPR-Article-5', 'FDA-21-CFR-Part-11'],
          coverage: { total: 100, covered: 90, percentage: 90 },
          status: 'active'
        },
        {
          id: 'ai-model-validation',
          name: 'AI Model Validation & Testing',
          description: 'Validation and testing of AI models',
          category: 'AI Model Management',
          questionCount: 8,
          regulatoryRequirements: ['FDA-AI-ML-Guidance', 'EU-AI-Act'],
          coverage: { total: 100, covered: 60, percentage: 60 },
          status: 'active'
        },
        {
          id: 'model-performance-monitoring',
          name: 'Model Performance Monitoring',
          description: 'Monitoring AI model performance',
          category: 'AI Model Management',
          questionCount: 6,
          regulatoryRequirements: ['FDA-AI-ML-Guidance', 'EU-AI-Act'],
          coverage: { total: 100, covered: 25, percentage: 25 },
          status: 'active'
        },
        {
          id: 'model-deployment-versioning',
          name: 'Model Deployment & Versioning',
          description: 'AI model deployment and versioning',
          category: 'AI Model Management',
          questionCount: 11,
          regulatoryRequirements: ['FDA-AI-ML-Guidance', 'EU-AI-Act'],
          coverage: { total: 100, covered: 65, percentage: 65 },
          status: 'active'
        },
        {
          id: 'model-lifecycle-management',
          name: 'Model Lifecycle Management',
          description: 'Managing AI model lifecycle',
          category: 'AI Model Management',
          questionCount: 9,
          regulatoryRequirements: ['FDA-AI-ML-Guidance', 'EU-AI-Act'],
          coverage: { total: 100, covered: 55, percentage: 55 },
          status: 'active'
        },
        {
          id: 'bias-detection-fairness',
          name: 'Bias Detection & Fairness',
          description: 'Detecting bias and ensuring fairness in AI',
          category: 'AI Model Management',
          questionCount: 9,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 35, percentage: 35 },
          status: 'active'
        },
        {
          id: 'model-explainability',
          name: 'Model Explainability & Interpretability',
          description: 'AI model explainability and interpretability',
          category: 'AI Model Management',
          questionCount: 6,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 30, percentage: 30 },
          status: 'active'
        },
        {
          id: 'model-robustness',
          name: 'Model Robustness & Adversarial Testing',
          description: 'AI model robustness and adversarial testing',
          category: 'AI Model Management',
          questionCount: 6,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 20, percentage: 20 },
          status: 'active'
        },
        {
          id: 'model-optimization',
          name: 'Model Optimization & Performance Tuning',
          description: 'AI model optimization and performance tuning',
          category: 'AI Model Management',
          questionCount: 16,
          regulatoryRequirements: ['FDA-AI-ML-Guidance', 'EU-AI-Act'],
          coverage: { total: 100, covered: 70, percentage: 70 },
          status: 'active'
        },
        {
          id: 'fda-ai-governance',
          name: 'FDA AI Governance 2025 Compliance',
          description: 'FDA AI governance compliance requirements',
          category: 'Regulatory Compliance',
          questionCount: 12,
          regulatoryRequirements: ['FDA-AI-ML-Guidance', 'FDA-21-CFR-Part-11'],
          coverage: { total: 100, covered: 35, percentage: 35 },
          status: 'active'
        },
        {
          id: 'regulatory-documentation',
          name: 'Regulatory Documentation & Reporting',
          description: 'Regulatory documentation and reporting',
          category: 'Regulatory Compliance',
          questionCount: 15,
          regulatoryRequirements: ['FDA-21-CFR-Part-11', 'ICH-E6-R2'],
          coverage: { total: 100, covered: 70, percentage: 70 },
          status: 'active'
        },
        {
          id: 'clinical-validation',
          name: 'Clinical Validation & Evidence Generation',
          description: 'Clinical validation and evidence generation',
          category: 'Clinical Research',
          questionCount: 12,
          regulatoryRequirements: ['ICH-E6-R2', 'FDA-21-CFR-Part-11'],
          coverage: { total: 100, covered: 65, percentage: 65 },
          status: 'active'
        },
        {
          id: 'post-market-surveillance',
          name: 'Post-Market Surveillance & Monitoring',
          description: 'Post-market surveillance and monitoring',
          category: 'Clinical Research',
          questionCount: 7,
          regulatoryRequirements: ['FDA-21-CFR-Part-11', 'ICH-E6-R2'],
          coverage: { total: 100, covered: 50, percentage: 50 },
          status: 'active'
        },
        {
          id: 'regulatory-change-management',
          name: 'Regulatory Change Management',
          description: 'Managing regulatory changes',
          category: 'Regulatory Compliance',
          questionCount: 17,
          regulatoryRequirements: ['FDA-21-CFR-Part-11', 'EU-AI-Act'],
          coverage: { total: 100, covered: 75, percentage: 75 },
          status: 'active'
        },
        {
          id: 'international-regulatory',
          name: 'International Regulatory Compliance',
          description: 'International regulatory compliance',
          category: 'Regulatory Compliance',
          questionCount: 11,
          regulatoryRequirements: ['EU-AI-Act', 'GDPR', 'FDA-21-CFR-Part-11'],
          coverage: { total: 100, covered: 60, percentage: 60 },
          status: 'active'
        },
        {
          id: 'ai-risk-management',
          name: 'AI Risk Management & Mitigation',
          description: 'AI risk management and mitigation',
          category: 'Risk Management',
          questionCount: 12,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 45, percentage: 45 },
          status: 'active'
        },
        {
          id: 'ai-incident-response',
          name: 'AI Incident Response & Recovery',
          description: 'AI incident response and recovery',
          category: 'Risk Management',
          questionCount: 8,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 30, percentage: 30 },
          status: 'active'
        },
        {
          id: 'ai-business-continuity',
          name: 'AI Business Continuity Planning',
          description: 'AI business continuity planning',
          category: 'Risk Management',
          questionCount: 10,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 70, percentage: 70 },
          status: 'active'
        },
        {
          id: 'ai-governance-framework',
          name: 'AI Governance Framework',
          description: 'AI governance framework',
          category: 'Governance',
          questionCount: 15,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 50, percentage: 50 },
          status: 'active'
        },
        {
          id: 'ai-ethics-responsible',
          name: 'AI Ethics & Responsible AI',
          description: 'AI ethics and responsible AI practices',
          category: 'Governance',
          questionCount: 15,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 75, percentage: 75 },
          status: 'active'
        },
        {
          id: 'stakeholder-engagement',
          name: 'Stakeholder Engagement & Communication',
          description: 'Stakeholder engagement and communication',
          category: 'Governance',
          questionCount: 18,
          regulatoryRequirements: ['EU-AI-Act', 'FDA-AI-ML-Guidance'],
          coverage: { total: 100, covered: 80, percentage: 80 },
          status: 'active'
        }
      ],
      regulatoryRequirements: [
        // FDA Regulations
        {
          id: 'FDA-21-CFR-Part-11',
          title: 'FDA 21 CFR Part 11 - Electronic Records',
          authority: 'FDA',
          jurisdiction: 'United States',
          category: 'Data Privacy',
          effectiveDate: '2023-01-01',
          status: 'Active',
          requirements: ['Electronic signature requirements', 'Audit trail maintenance', 'Data integrity controls'],
          penalties: ['Warning letters', 'Import alerts', 'Product recalls'],
          assessmentSections: ['data-observability', 'data-quality', 'data-security', 'data-retention'],
          coverage: { total: 100, covered: 80, percentage: 80 }
        },
        {
          id: 'FDA-AI-ML-Guidance',
          title: 'FDA AI/ML Software as Medical Device Guidance',
          authority: 'FDA',
          jurisdiction: 'United States',
          category: 'AI/ML',
          effectiveDate: '2024-01-01',
          status: 'Active',
          requirements: ['Model validation protocols', 'Clinical evaluation', 'Risk management', 'Post-market surveillance'],
          penalties: ['Regulatory enforcement actions', 'Market withdrawal'],
          assessmentSections: ['ai-model-validation', 'model-performance-monitoring', 'clinical-validation', 'post-market-surveillance'],
          coverage: { total: 100, covered: 65, percentage: 65 }
        },
        {
          id: 'FDA-GLP',
          title: 'FDA Good Laboratory Practice (GLP) Regulations',
          authority: 'FDA',
          jurisdiction: 'United States',
          category: 'Quality Assurance',
          effectiveDate: '2023-01-01',
          status: 'Active',
          requirements: ['Study protocols', 'Data recording', 'Quality assurance units'],
          penalties: ['Study rejection', 'Regulatory sanctions'],
          assessmentSections: ['data-quality', 'regulatory-documentation', 'clinical-validation'],
          coverage: { total: 100, covered: 75, percentage: 75 }
        },
        // EU Regulations
        {
          id: 'GDPR-Article-25',
          title: 'GDPR Article 25 - Data Protection by Design',
          authority: 'EU Commission',
          jurisdiction: 'European Union',
          category: 'Data Privacy',
          effectiveDate: '2018-05-25',
          status: 'Active',
          requirements: ['Privacy by design principles', 'Data minimization', 'Purpose limitation'],
          penalties: ['Fines up to 4% of annual turnover', 'Data processing bans'],
          assessmentSections: ['data-observability', 'data-security', 'data-governance'],
          coverage: { total: 100, covered: 70, percentage: 70 }
        },
        {
          id: 'EU-AI-Act',
          title: 'EU AI Act - Artificial Intelligence Act',
          authority: 'EU Commission',
          jurisdiction: 'European Union',
          category: 'AI/ML',
          effectiveDate: '2024-08-02',
          status: 'Active',
          requirements: ['Risk management systems', 'Data governance', 'Transparency obligations', 'Human oversight'],
          penalties: ['Fines up to €35M or 7% of annual turnover'],
          assessmentSections: ['ai-model-validation', 'bias-detection-fairness', 'model-explainability', 'ai-risk-management', 'ai-governance-framework'],
          coverage: { total: 100, covered: 45, percentage: 45 }
        },
        {
          id: 'EU-MDR',
          title: 'EU Medical Device Regulation (MDR)',
          authority: 'EU Commission',
          jurisdiction: 'European Union',
          category: 'Medical Devices',
          effectiveDate: '2021-05-26',
          status: 'Active',
          requirements: ['Clinical evaluation', 'Post-market surveillance', 'Quality management systems'],
          penalties: ['Market withdrawal', 'Fines up to €5M'],
          assessmentSections: ['clinical-validation', 'post-market-surveillance', 'regulatory-documentation'],
          coverage: { total: 100, covered: 60, percentage: 60 }
        },
        // ICH Guidelines
        {
          id: 'ICH-E6-R2',
          title: 'ICH E6(R2) - Good Clinical Practice',
          authority: 'ICH',
          jurisdiction: 'Global',
          category: 'Clinical Research',
          effectiveDate: '2016-11-09',
          status: 'Active',
          requirements: ['Protocol compliance', 'Data integrity', 'Adverse event reporting'],
          penalties: ['Study termination', 'Regulatory sanctions'],
          assessmentSections: ['clinical-validation', 'data-quality', 'regulatory-documentation'],
          coverage: { total: 100, covered: 85, percentage: 85 }
        },
        {
          id: 'ICH-E9-R1',
          title: 'ICH E9(R1) - Estimands and Sensitivity Analysis',
          authority: 'ICH',
          jurisdiction: 'Global',
          category: 'Clinical Research',
          effectiveDate: '2019-11-20',
          status: 'Active',
          requirements: ['Estimand definition', 'Sensitivity analyses', 'Missing data handling'],
          penalties: ['Study rejection', 'Regulatory queries'],
          assessmentSections: ['clinical-validation', 'data-quality'],
          coverage: { total: 100, covered: 40, percentage: 40 }
        },
        // WHO Guidelines
        {
          id: 'WHO-GCP',
          title: 'WHO Good Clinical Practice Guidelines',
          authority: 'WHO',
          jurisdiction: 'Global',
          category: 'Clinical Research',
          effectiveDate: '2021-01-01',
          status: 'Active',
          requirements: ['Ethical principles', 'Protocol adherence', 'Data protection'],
          penalties: ['Study suspension', 'Ethics committee sanctions'],
          assessmentSections: ['clinical-validation', 'ai-ethics-responsible', 'stakeholder-engagement'],
          coverage: { total: 100, covered: 70, percentage: 70 }
        },
        // Additional AI/ML Regulations
        {
          id: 'NIST-AI-RMF',
          title: 'NIST AI Risk Management Framework',
          authority: 'NIST',
          jurisdiction: 'United States',
          category: 'AI/ML',
          effectiveDate: '2023-01-26',
          status: 'Active',
          requirements: ['Risk assessment', 'Governance structures', 'Monitoring systems'],
          penalties: ['Contract penalties', 'Reputational damage'],
          assessmentSections: ['ai-risk-management', 'ai-governance-framework', 'model-performance-monitoring'],
          coverage: { total: 100, covered: 35, percentage: 35 }
        },
        {
          id: 'UK-AI-White-Paper',
          title: 'UK AI White Paper - Pro-innovation Approach',
          authority: 'UK Government',
          jurisdiction: 'United Kingdom',
          category: 'AI/ML',
          effectiveDate: '2023-03-29',
          status: 'Active',
          requirements: ['Transparency', 'Fairness', 'Accountability', 'Contestability'],
          penalties: ['Regulatory enforcement', 'Market restrictions'],
          assessmentSections: ['model-explainability', 'bias-detection-fairness', 'ai-ethics-responsible'],
          coverage: { total: 100, covered: 30, percentage: 30 }
        },
        {
          id: 'Canada-AIDA',
          title: 'Canada Artificial Intelligence and Data Act (AIDA)',
          authority: 'Government of Canada',
          jurisdiction: 'Canada',
          category: 'AI/ML',
          effectiveDate: '2024-01-01',
          status: 'Active',
          requirements: ['Risk management', 'Data governance', 'Transparency measures'],
          penalties: ['Fines up to CAD $25M', 'Administrative penalties'],
          assessmentSections: ['ai-risk-management', 'data-governance', 'model-explainability'],
          coverage: { total: 100, covered: 25, percentage: 25 }
        },
        {
          id: 'Singapore-AI-Governance',
          title: 'Singapore AI Governance Framework',
          authority: 'IMDA',
          jurisdiction: 'Singapore',
          category: 'AI/ML',
          effectiveDate: '2023-01-01',
          status: 'Active',
          requirements: ['Ethical AI principles', 'Risk management', 'Human oversight'],
          penalties: ['Regulatory sanctions', 'Business restrictions'],
          assessmentSections: ['ai-ethics-responsible', 'ai-risk-management', 'ai-governance-framework'],
          coverage: { total: 100, covered: 40, percentage: 40 }
        },
        {
          id: 'Japan-AI-Strategy',
          title: 'Japan AI Strategy - Society 5.0',
          authority: 'Japanese Government',
          jurisdiction: 'Japan',
          category: 'AI/ML',
          effectiveDate: '2023-01-01',
          status: 'Active',
          requirements: ['Human-centered AI', 'Fairness and transparency', 'Privacy protection'],
          penalties: ['Regulatory enforcement', 'Market access restrictions'],
          assessmentSections: ['ai-ethics-responsible', 'model-explainability', 'data-security'],
          coverage: { total: 100, covered: 35, percentage: 35 }
        },
        {
          id: 'Australia-AI-Ethics',
          title: 'Australia AI Ethics Framework',
          authority: 'Australian Government',
          jurisdiction: 'Australia',
          category: 'AI/ML',
          effectiveDate: '2023-01-01',
          status: 'Active',
          requirements: ['Human values', 'Fairness', 'Privacy protection', 'Reliability'],
          penalties: ['Regulatory sanctions', 'Consumer protection actions'],
          assessmentSections: ['ai-ethics-responsible', 'bias-detection-fairness', 'data-security'],
          coverage: { total: 100, covered: 30, percentage: 30 }
        }
      ],
      coverageMatrix: {
        'data-observability': {
          'FDA-21-CFR-Part-11': { coverage: 80, questions: ['Q1', 'Q2', 'Q3'], gaps: [] },
          'GDPR-Article-25': { coverage: 70, questions: ['Q4', 'Q5'], gaps: ['Privacy impact assessment'] }
        },
        'data-quality': {
          'FDA-21-CFR-Part-11': { coverage: 85, questions: ['Q6', 'Q7', 'Q8'], gaps: [] },
          'ICH-E6-R2': { coverage: 90, questions: ['Q9', 'Q10'], gaps: [] },
          'FDA-GLP': { coverage: 75, questions: ['Q11', 'Q12'], gaps: ['Quality assurance unit oversight'] }
        },
        'ai-model-validation': {
          'FDA-AI-ML-Guidance': { coverage: 65, questions: ['Q13', 'Q14'], gaps: ['Clinical validation protocol'] },
          'EU-AI-Act': { coverage: 60, questions: ['Q15'], gaps: ['Risk management system'] },
          'NIST-AI-RMF': { coverage: 35, questions: ['Q16'], gaps: ['AI risk assessment framework'] }
        },
        'bias-detection-fairness': {
          'EU-AI-Act': { coverage: 45, questions: ['Q17'], gaps: ['Bias testing protocols'] },
          'UK-AI-White-Paper': { coverage: 30, questions: ['Q18'], gaps: ['Fairness metrics'] },
          'Australia-AI-Ethics': { coverage: 30, questions: ['Q19'], gaps: ['Ethical AI assessment'] }
        },
        'model-explainability': {
          'EU-AI-Act': { coverage: 45, questions: ['Q20'], gaps: ['Explainability standards'] },
          'UK-AI-White-Paper': { coverage: 30, questions: ['Q21'], gaps: ['Transparency requirements'] },
          'Canada-AIDA': { coverage: 25, questions: ['Q22'], gaps: ['Interpretability guidelines'] }
        },
        'ai-risk-management': {
          'EU-AI-Act': { coverage: 45, questions: ['Q23'], gaps: ['Risk management systems'] },
          'NIST-AI-RMF': { coverage: 35, questions: ['Q24'], gaps: ['Risk assessment framework'] },
          'Singapore-AI-Governance': { coverage: 40, questions: ['Q25'], gaps: ['Risk monitoring protocols'] }
        }
      },
      gapAnalysis: {
        uncoveredRequirements: [
          'Clinical validation protocol for AI models',
          'Risk management system implementation',
          'AI risk assessment framework',
          'Bias testing protocols',
          'Explainability standards',
          'Transparency requirements',
          'Interpretability guidelines',
          'Risk monitoring protocols',
          'Quality assurance unit oversight',
          'Privacy impact assessment automation'
        ],
        missingSections: [
          'AI Model Audit Trail Management',
          'Cross-border Data Transfer Compliance',
          'AI Model Version Control',
          'Regulatory Intelligence Monitoring',
          'AI Ethics Review Board'
        ],
        recommendations: [
          'Implement comprehensive clinical validation protocols for AI models',
          'Establish AI risk management systems per EU AI Act requirements',
          'Develop bias testing and fairness assessment protocols',
          'Create model explainability and interpretability standards',
          'Implement automated privacy impact assessments',
          'Establish AI ethics review board for governance',
          'Develop cross-border data transfer compliance procedures',
          'Create AI model version control and audit trail systems',
          'Implement regulatory intelligence monitoring systems',
          'Establish quality assurance unit oversight for AI systems'
        ]
      },
      regulatoryImpactAnalysis: {
        highRiskRegulations: [
          {
            id: 'EU-AI-Act',
            title: 'EU AI Act - Artificial Intelligence Act',
            riskLevel: 'High',
            impactScore: 85,
            complianceDeadline: '2024-08-02',
            penalties: 'Fines up to €35M or 7% of annual turnover',
            affectedSections: ['ai-model-validation', 'bias-detection-fairness', 'model-explainability', 'ai-risk-management'],
            criticalGaps: ['Risk management systems', 'Transparency obligations', 'Human oversight requirements']
          },
          {
            id: 'FDA-AI-ML-Guidance',
            title: 'FDA AI/ML Software as Medical Device Guidance',
            riskLevel: 'High',
            impactScore: 80,
            complianceDeadline: '2024-01-01',
            penalties: 'Regulatory enforcement actions, Market withdrawal',
            affectedSections: ['ai-model-validation', 'model-performance-monitoring', 'clinical-validation'],
            criticalGaps: ['Clinical validation protocols', 'Post-market surveillance systems']
          }
        ],
        mediumRiskRegulations: [
          {
            id: 'GDPR-Article-25',
            title: 'GDPR Article 25 - Data Protection by Design',
            riskLevel: 'Medium',
            impactScore: 65,
            complianceDeadline: '2018-05-25',
            penalties: 'Fines up to 4% of annual turnover',
            affectedSections: ['data-observability', 'data-security', 'data-governance'],
            criticalGaps: ['Privacy by design implementation', 'Data minimization protocols']
          }
        ],
        complianceTimeline: [
          {
            phase: 'Immediate (0-3 months)',
            actions: [
              'Conduct comprehensive regulatory gap analysis',
              'Establish AI governance framework',
              'Implement basic risk management systems'
            ],
            priority: 'Critical'
          },
          {
            phase: 'Short-term (3-6 months)',
            actions: [
              'Develop clinical validation protocols',
              'Implement bias testing frameworks',
              'Create model explainability standards'
            ],
            priority: 'High'
          },
          {
            phase: 'Medium-term (6-12 months)',
            actions: [
              'Establish AI ethics review board',
              'Implement regulatory intelligence monitoring',
              'Develop cross-border compliance procedures'
            ],
            priority: 'Medium'
          }
        ]
      },
      complianceScoring: {
        overallScore: 52,
        scoreBreakdown: {
          dataManagement: 78,
          aiModelManagement: 45,
          regulatoryCompliance: 60,
          clinicalResearch: 58,
          riskManagement: 48,
          governance: 62
        },
        scoreTrends: {
          lastMonth: 48,
          lastQuarter: 42,
          lastYear: 35,
          trend: 'improving'
        },
        benchmarkComparison: {
          industryAverage: 45,
          topPerformers: 78,
          ourPosition: 'above_average'
        }
      },
      stats: {
        totalSections: 26,
        totalRequirements: 15,
        averageCoverage: 52,
        criticalGaps: 10,
        recommendations: 10
      }
    };

    console.log('Returning compliance mapping data');
    return NextResponse.json({
      success: true,
      data: mockData,
      meta: {
        generatedAt: new Date().toISOString(),
        totalSections: mockData.assessmentSections.length,
        totalRequirements: mockData.regulatoryRequirements.length
      }
    });

  } catch (error) {
    console.error('Error in compliance mapping API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch compliance mapping data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}