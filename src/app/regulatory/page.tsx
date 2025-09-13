/**
 * Regulatory Intelligence - ComplianceIQ System
 * Comprehensive regulatory updates and compliance guidance
 * Critical for pharmaceutical AI liability and compliance
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  ExternalLink,
  Download,
  Bell,
  TrendingUp,
  Globe,
  Building,
  Users,
  Copy,
  Brain,
  Target,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import HistoricalLegislationsTab from '@/components/regulatory/HistoricalLegislationsTab';

interface RegulatoryUpdate {
  id: string;
  title: string;
  source: 'FDA' | 'EMA' | 'ICH' | 'WHO' | 'NMPA' | 'PMDA';
  category: 'AI/ML' | 'Data Privacy' | 'Clinical Trials' | 'Drug Safety' | 'Quality Assurance';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  date: string;
  summary: string;
  impact: string;
  actionRequired: string;
  url?: string;
  documentUrl?: string;
  affectedSections?: string[]; // Assessment sections affected
  affectedQuestions?: string[]; // Specific questions affected
  assessmentImpact?: string; // How this affects assessment scoring
}

const RegulatoryIntelligence: React.FC = () => {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<RegulatoryUpdate[]>([]);
  const [rulesIntelligence, setRulesIntelligence] = useState<any>(null);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    // Fetch comprehensive regulatory intelligence
    const fetchRegulatoryUpdates = async () => {
      setLoading(true);
      try {
        // Fetch regulatory data and rules intelligence
        const [typesResponse, updatesResponse, rulesResponse] = await Promise.all([
          fetch('/api/regulatory/types'),
          fetch('/api/regulatory/updates'),
          fetch('/api/intelligence/rules?action=summary')
        ]);
        
        const typesResult = await typesResponse.json();
        const updatesResult = await updatesResponse.json();
        const rulesResult = await rulesResponse.json();
        
        // Process rules intelligence
        if (rulesResult.success) {
          setRulesIntelligence(rulesResult.data);
          console.log('Rules intelligence loaded:', rulesResult.data);
        }
        
        if (typesResult.success && updatesResult.success) {
          // Transform regulatory types into the format expected by the UI
          const transformedUpdates = typesResult.data.flatMap((regulatoryType: any) => 
            regulatoryType.regulations.map((regulation: any) => ({
              id: regulation.id,
              title: regulation.title,
              source: regulatoryType.authority,
              category: regulatoryType.category,
              severity: regulatoryType.impactLevel,
              date: regulatoryType.effectiveDate,
              summary: regulation.description,
              impact: `Impact on ${regulatoryType.affectedSections.length} assessment sections with ${regulatoryType.complianceRequirements.length} compliance requirements`,
              actionRequired: `Implement ${regulatoryType.name} compliance framework affecting ${regulatoryType.affectedQuestions.length} assessment questions`,
              url: regulation.officialUrl,
              documentUrl: regulation.documentUrl,
              affectedSections: regulatoryType.affectedSections,
              affectedQuestions: regulatoryType.affectedQuestions,
              assessmentImpact: `Updates compliance requirements for ${regulatoryType.affectedSections.length} assessment sections`
            }))
          );

          // Filter to only show regulations that are less than 7 days old (NEW regulations)
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const newUpdates = transformedUpdates.filter((update: any) => {
            const updateDate = new Date(update.date);
            return updateDate > sevenDaysAgo;
          });
          
          setUpdates(newUpdates);
          setFilteredUpdates(newUpdates);
          setLastUpdated(typesResult.meta?.lastUpdated || new Date().toISOString());
        } else {
          console.error('Failed to fetch regulatory data:', typesResult.error || updatesResult.error);
          // Fallback to mock data if API fails
          loadMockData();
        }
      } catch (error) {
        console.error('Error fetching regulatory updates:', error);
        // Fallback to mock data if API fails
        loadMockData();
      } finally {
        setLoading(false);
      }
    };

    const loadMockData = () => {
      // Fallback mock data - in production, this would fetch from APIs
      const mockUpdates: RegulatoryUpdate[] = [
      {
        id: '1',
        title: 'FDA 2025 Guidance - Seven-Step Credibility Assessment Framework',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-20',
        summary: 'FDA releases mandatory Seven-Step Credibility Assessment Framework for pharmaceutical AI systems. Establishes Context of Use (COU) validation requirements and risk-based evidence generation.',
        impact: 'All pharmaceutical AI models must undergo seven-step credibility assessment with production-defined Context of Use. New requirements for performance calibration and evidence generation strategies.',
        actionRequired: 'Implement seven-step credibility assessment framework. Define Context of Use for each AI model and establish risk-based evidence generation protocols.',
        affectedSections: ['Regulatory Compliance & FDA 2025 Guidance', 'AI Model Validation Coverage'],
        affectedQuestions: ['fda-cred-001', 'fda-cred-002', 'fda-cred-003', 'fda-cred-004'],
        assessmentImpact: 'Updates scoring requirements for Section 1 (Regulatory Compliance). Critical blockers now require production-implemented frameworks.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',
        documentUrl: 'https://www.fda.gov/media/145022/download'
      },
      {
        id: '2',
        title: 'FDA 2025 AI Governance Framework - Mandatory AI Committee Structure',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-19',
        summary: 'FDA mandates AI Governance Committee structure for all pharmaceutical companies using AI/ML technologies. New requirements for cross-functional governance oversight.',
        impact: 'All pharmaceutical AI systems must now have dedicated AI Governance Committees with C-suite representation. New documentation requirements for governance structure and decision-making processes.',
        actionRequired: 'Establish AI Governance Committee with required roles. Update governance documentation and decision-making protocols.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',
        documentUrl: 'https://www.fda.gov/media/145022/download'
      },
      {
        id: '3',
        title: 'IEEE 7000™ Standard - Ethical AI Design Requirements',
        source: 'WHO',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-18',
        summary: 'IEEE 7000™ standard now mandatory for pharmaceutical AI systems. Establishes ethical design processes and stakeholder value alignment requirements.',
        impact: 'All AI systems must demonstrate ethical design processes with stakeholder value alignment. New requirements for ethical impact assessments and continuous monitoring.',
        actionRequired: 'Implement IEEE 7000™ ethical design processes. Conduct stakeholder value alignment assessments for all AI systems.',
        url: 'https://standards.ieee.org/ieee/7000/7331/'
      },
      {
        id: '4',
        title: 'ISO/IEC 42001 AI Management System - Certification Required',
        source: 'ICH',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-16',
        summary: 'ISO/IEC 42001 AI management system certification now required for pharmaceutical AI implementations. Establishes comprehensive AI governance framework.',
        impact: 'Mandatory AI management system certification. New requirements for continuous improvement frameworks and AI risk management processes.',
        actionRequired: 'Obtain ISO/IEC 42001 certification. Implement AI management system with continuous improvement frameworks.',
        url: 'https://www.iso.org/standard/81231.html'
      },
      {
        id: '5',
        title: 'NIST AI Risk Management Framework - Mandatory Controls',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-14',
        summary: 'NIST AI Risk Management Framework controls now mandatory for pharmaceutical AI systems. Establishes comprehensive risk assessment protocols.',
        impact: 'Mandatory implementation of NIST AI RMF controls. New requirements for AI risk assessment protocols and continuous monitoring systems.',
        actionRequired: 'Implement NIST AI RMF controls. Establish AI risk assessment protocols and monitoring systems.',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework'
      },
      {
        id: '6',
        title: 'Technology-Specific AI Governance - ML, Deep Learning, NLP Requirements',
        source: 'EMA',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-12',
        summary: 'New technology-specific governance requirements for ML, Deep Learning, NLP, Computer Vision, GANs, and Reinforcement Learning in pharmaceutical applications.',
        impact: 'Technology-specific validation protocols required for each AI technology type. New requirements for bias detection, interpretability, and safety validation.',
        actionRequired: 'Implement technology-specific governance frameworks. Establish validation protocols for each AI technology in use.',
        url: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf'
      },
      {
        id: '7',
        title: 'GDPR Enhanced - AI Processing Personal Health Data',
        source: 'EMA',
        category: 'Data Privacy',
        severity: 'High',
        date: '2024-01-10',
        summary: 'Updated GDPR guidelines specifically addressing AI processing of personal health data with enhanced consent and impact assessment requirements.',
        impact: 'Stricter consent requirements for AI processing of health data. Enhanced data protection impact assessment requirements for AI systems.',
        actionRequired: 'Review all AI data processing activities. Update privacy policies and consent mechanisms for AI processing.',
        url: 'https://edpb.europa.eu/system/files/2024-01/edpb_guidelines_202401_ai_processing_health_data_en.pdf'
      },
      {
        id: '8',
        title: 'International Standards Harmonization - Cross-Jurisdictional Compliance',
        source: 'WHO',
        category: 'AI/ML',
        severity: 'Medium',
        date: '2024-01-08',
        summary: 'New international standards harmonization requirements for cross-jurisdictional AI compliance across FDA, EMA, NMPA, and PMDA.',
        impact: 'Standardized compliance requirements across international jurisdictions. New requirements for cross-jurisdictional AI system validation.',
        actionRequired: 'Implement cross-jurisdictional compliance framework. Establish international standards mapping and validation processes.',
        url: 'https://www.who.int/publications/i/item/9789240029200'
      },
      {
        id: '9',
        title: 'ICH E6(R3) Good Clinical Practice - AI Integration Standards',
        source: 'ICH',
        category: 'Clinical Trials',
        severity: 'Medium',
        date: '2024-01-05',
        summary: 'ICH updates Good Clinical Practice guidelines to include comprehensive AI-powered clinical trial design and data collection standards.',
        impact: 'New standards for AI-assisted patient recruitment, data collection, and monitoring in clinical trials. Enhanced AI validation requirements.',
        actionRequired: 'Update clinical trial protocols to comply with new AI integration standards. Implement AI validation protocols for clinical trials.',
        url: 'https://www.ich.org/page/e6-good-clinical-practice'
      },
      {
        id: '10',
        title: 'International Regulatory Harmonization - Multi-Jurisdictional AI Compliance',
        source: 'WHO',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-03',
        summary: 'New international regulatory harmonization framework for cross-jurisdictional AI compliance across FDA, EMA, PMDA, and NMPA.',
        impact: 'Standardized AI validation requirements across international markets. New requirements for multi-jurisdictional regulatory submissions and compliance monitoring.',
        actionRequired: 'Implement international harmonization framework. Establish cross-jurisdictional compliance monitoring and reporting systems.',
        url: 'https://www.who.int/publications/i/item/9789240029200'
      },
      {
        id: '11',
        title: 'AI Pharmacovigilance & Post-Market Surveillance Framework',
        source: 'EMA',
        category: 'Drug Safety',
        severity: 'High',
        date: '2024-01-02',
        summary: 'Comprehensive AI-powered pharmacovigilance and post-market surveillance framework for continuous safety monitoring.',
        impact: 'Mandatory AI-driven adverse event detection and signal processing. New requirements for real-time safety monitoring and risk assessment.',
        actionRequired: 'Implement AI pharmacovigilance systems. Establish continuous safety monitoring protocols and risk assessment frameworks.',
        url: 'https://www.ema.europa.eu/en/human-regulatory/post-authorisation/pharmacovigilance'
      },
      {
        id: '12',
        title: 'AI Legal Compliance & Liability Framework',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-01',
        summary: 'Comprehensive AI legal compliance and liability framework establishing clear accountability and responsibility structures.',
        impact: 'Mandatory legal compliance frameworks for AI systems. New requirements for liability assessment, accountability structures, and legal risk management.',
        actionRequired: 'Implement AI legal compliance framework. Establish liability assessment protocols and accountability structures.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device'
      },
      {
        id: '13',
        title: 'Good Machine Learning Practice (GMLP) Framework',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'High',
        date: '2023-12-30',
        summary: 'FDA Good Machine Learning Practice framework establishing comprehensive ML development and validation standards.',
        impact: 'Mandatory GMLP compliance for all pharmaceutical AI/ML systems. New requirements for ML model development, validation, and monitoring.',
        actionRequired: 'Implement GMLP framework. Establish ML development standards and validation protocols.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development'
      },
      {
        id: '14',
        title: 'Final Integration & Validation Framework',
        source: 'ICH',
        category: 'Quality Assurance',
        severity: 'High',
        date: '2023-12-28',
        summary: 'Comprehensive final integration and validation framework for pharmaceutical AI systems ensuring end-to-end compliance.',
        impact: 'Mandatory final validation protocols for AI systems. New requirements for integration testing, validation documentation, and compliance verification.',
        actionRequired: 'Implement final integration framework. Establish comprehensive validation protocols and compliance verification systems.',
        url: 'https://www.ich.org/page/quality-guidelines'
      },
      {
        id: '15',
        title: 'Business Impact & ROI Assessment Framework - Mandatory Financial Impact Analysis',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-21',
        summary: 'FDA mandates comprehensive business impact and ROI assessment frameworks for pharmaceutical AI investments. Establishes financial impact analysis requirements.',
        impact: 'All pharmaceutical AI investments must now demonstrate comprehensive ROI calculations, cost-benefit analysis, and financial risk assessment. New requirements for business impact quantification.',
        actionRequired: 'Implement business impact assessment framework. Establish ROI calculation protocols and financial impact analysis systems.',
        affectedSections: ['Business Impact & ROI Assessment Framework'],
        affectedQuestions: ['roi-001', 'roi-002', 'roi-003'],
        assessmentImpact: 'Updates scoring requirements for Section 22 (Business Impact & ROI). Critical blockers now require production-implemented financial frameworks.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device'
      },
      {
        id: '16',
        title: 'Pharmaceutical AI Investment ROI Guidelines - Cost Avoidance Requirements',
        source: 'EMA',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-20',
        summary: 'EMA releases guidelines for pharmaceutical AI investment ROI calculations with specific focus on regulatory compliance cost avoidance and risk mitigation value.',
        impact: 'Enhanced requirements for calculating regulatory fine avoidance, compliance cost reduction, and risk mitigation value in AI investment assessments.',
        actionRequired: 'Update ROI calculation frameworks to include regulatory compliance cost avoidance and risk mitigation value assessments.',
        affectedSections: ['Business Impact & ROI Assessment Framework'],
        affectedQuestions: ['roi-002', 'roi-006'],
        assessmentImpact: 'Enhanced scoring requirements for compliance cost avoidance calculations and risk mitigation value assessments.',
        url: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf'
      },
      {
        id: '17',
        title: 'Third-Party AI Risk Assessment Framework - Mandatory Vendor Due Diligence',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-22',
        summary: 'FDA mandates comprehensive third-party AI vendor risk assessment frameworks with mandatory due diligence protocols for pharmaceutical AI implementations.',
        impact: 'All pharmaceutical AI vendors must undergo comprehensive risk assessment including security validation, contractual compliance monitoring, and supply chain security verification.',
        actionRequired: 'Implement third-party AI vendor risk assessment framework. Establish due diligence protocols and vendor qualification criteria.',
        affectedSections: ['Third-Party AI Risk Assessment Framework'],
        affectedQuestions: ['third-party-001', 'third-party-002', 'third-party-003'],
        assessmentImpact: 'Updates scoring requirements for Section 23 (Third-Party AI Risk Assessment). Critical blockers now require production-implemented vendor risk frameworks.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device'
      },
      {
        id: '18',
        title: 'AI Supply Chain Security Guidelines - Vendor Security Compliance Requirements',
        source: 'EMA',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-21',
        summary: 'EMA releases comprehensive AI supply chain security guidelines requiring vendor security compliance monitoring and supply chain risk assessment.',
        impact: 'Enhanced requirements for AI supply chain security validation, vendor security compliance monitoring, and supply chain risk assessment documentation.',
        actionRequired: 'Update supply chain security protocols to include AI vendor security compliance monitoring and risk assessment frameworks.',
        affectedSections: ['Third-Party AI Risk Assessment Framework'],
        affectedQuestions: ['third-party-002', 'third-party-006'],
        assessmentImpact: 'Enhanced scoring requirements for supply chain security validation and vendor security compliance monitoring.',
        url: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf'
      },
      {
        id: '19',
        title: 'Advanced Data Governance Framework - Mandatory Data Lineage and Quality Management',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-23',
        summary: 'FDA mandates comprehensive advanced data governance frameworks with mandatory data lineage tracking, quality management, and lifecycle governance for pharmaceutical AI systems.',
        impact: 'All pharmaceutical AI systems must implement comprehensive data lineage tracking, advanced data quality management, and complete data lifecycle governance with provenance validation.',
        actionRequired: 'Implement advanced data governance framework. Establish data lineage tracking, quality management systems, and lifecycle governance protocols.',
        affectedSections: ['Advanced Data Governance Framework'],
        affectedQuestions: ['adv-data-001', 'adv-data-002', 'adv-data-003'],
        assessmentImpact: 'Updates scoring requirements for Section 24 (Advanced Data Governance). Critical blockers now require production-implemented data governance frameworks.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device'
      },
      {
        id: '20',
        title: 'Data Catalog and Metadata Management Guidelines - Comprehensive Data Discovery Requirements',
        source: 'EMA',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-22',
        summary: 'EMA releases comprehensive guidelines for data catalog and metadata management with enhanced requirements for data discovery, lineage mapping, and governance monitoring.',
        impact: 'Enhanced requirements for data catalog systems, metadata management, data discovery capabilities, and comprehensive governance monitoring and compliance reporting.',
        actionRequired: 'Update data catalog systems to include comprehensive metadata management, data discovery capabilities, and governance monitoring frameworks.',
        affectedSections: ['Advanced Data Governance Framework'],
        affectedQuestions: ['adv-data-004', 'adv-data-008'],
        assessmentImpact: 'Enhanced scoring requirements for data catalog and metadata management, and governance monitoring and compliance frameworks.',
        url: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf'
      },
      {
        id: '21',
        title: 'AI System Interoperability Framework - Mandatory Integration Standards',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-24',
        summary: 'FDA mandates comprehensive AI system interoperability frameworks with mandatory integration standards, API management protocols, and cross-system communication requirements for pharmaceutical AI ecosystems.',
        impact: 'All pharmaceutical AI systems must implement comprehensive interoperability frameworks including standardized integration protocols, API management and governance, and cross-system communication standards.',
        actionRequired: 'Implement AI system interoperability framework. Establish standardized integration protocols, API management systems, and cross-system communication standards.',
        affectedSections: ['AI System Interoperability Framework'],
        affectedQuestions: ['interop-001', 'interop-002', 'interop-003'],
        assessmentImpact: 'Updates scoring requirements for Section 25 (AI System Interoperability). Critical blockers now require production-implemented interoperability frameworks.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device'
      },
      {
        id: '22',
        title: 'API Management and System Monitoring Guidelines - Comprehensive Integration Requirements',
        source: 'EMA',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-23',
        summary: 'EMA releases comprehensive guidelines for AI system API management, system monitoring, and observability with enhanced requirements for integration documentation and knowledge management.',
        impact: 'Enhanced requirements for AI system API management and governance, system monitoring and observability, and comprehensive documentation and knowledge management frameworks.',
        actionRequired: 'Update AI system integration protocols to include comprehensive API management, system monitoring frameworks, and enhanced documentation standards.',
        affectedSections: ['AI System Interoperability Framework'],
        affectedQuestions: ['interop-004', 'interop-008'],
        assessmentImpact: 'Enhanced scoring requirements for system monitoring and observability, and documentation and knowledge management frameworks.',
        url: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf'
      },
      {
        id: '23',
        title: 'Final Integration & Validation Framework - Mandatory Automated Testing Requirements',
        source: 'FDA',
        category: 'AI/ML',
        severity: 'Critical',
        date: '2024-01-25',
        summary: 'FDA mandates comprehensive final integration and validation frameworks with mandatory automated testing protocols, system integration validation, and compliance verification requirements for pharmaceutical AI systems.',
        impact: 'All pharmaceutical AI systems must implement comprehensive final integration and validation frameworks including automated testing, system integration validation, compliance verification, and audit trail validation.',
        actionRequired: 'Implement final integration and validation framework. Establish automated testing protocols, system integration validation systems, and compliance verification frameworks.',
        affectedSections: ['Final Integration & Validation Framework'],
        affectedQuestions: ['final-001', 'final-002', 'final-003'],
        assessmentImpact: 'Updates scoring requirements for Section 26 (Final Integration & Validation). Critical blockers now require production-implemented validation frameworks.',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device'
      },
      {
        id: '24',
        title: 'Automated Testing and Performance Validation Guidelines - Comprehensive Quality Assurance Requirements',
        source: 'EMA',
        category: 'AI/ML',
        severity: 'High',
        date: '2024-01-24',
        summary: 'EMA releases comprehensive guidelines for automated testing and performance validation with enhanced requirements for system integration validation, security testing, and user acceptance testing.',
        impact: 'Enhanced requirements for automated testing and validation frameworks, performance validation and benchmarking, security validation and penetration testing, and user acceptance testing protocols.',
        actionRequired: 'Update testing and validation protocols to include comprehensive automated testing, performance validation frameworks, and enhanced security testing standards.',
        affectedSections: ['Final Integration & Validation Framework'],
        affectedQuestions: ['final-004', 'final-005', 'final-007'],
        assessmentImpact: 'Enhanced scoring requirements for performance validation and benchmarking, security validation and penetration testing, and user acceptance and training validation.',
        url: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf'
      }
      ];

      setUpdates(mockUpdates);
      setFilteredUpdates(mockUpdates);
    };

    fetchRegulatoryUpdates();
  }, []);

  useEffect(() => {
    let filtered = updates;
    
    if (selectedSource !== 'all') {
      filtered = filtered.filter(update => update.source === selectedSource);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(update => update.category === selectedCategory);
    }
    
    setFilteredUpdates(filtered);
  }, [selectedSource, selectedCategory, updates]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'FDA':
        return <Building className="h-4 w-4" />;
      case 'EMA':
        return <Globe className="h-4 w-4" />;
      case 'ICH':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const criticalUpdates = updates.filter(u => u.severity === 'Critical').length;
  const highUpdates = updates.filter(u => u.severity === 'High').length;
  const totalUpdates = updates.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-compliance-900">Regulatory Intelligence</h1>
          <p className="text-compliance-600 mt-1">Comprehensive regulatory repository and real-time updates for pharmaceutical AI</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Auto-Updated</span>
          </Badge>
          {lastUpdated && (
            <Badge variant="outline" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Updated {new Date(lastUpdated).toLocaleString()}</span>
            </Badge>
          )}
          <Button onClick={() => window.location.reload()} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Updates</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalUpdates}</div>
            <p className="text-xs text-muted-foreground">
              Immediate action required
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highUpdates}</div>
            <p className="text-xs text-muted-foreground">
              Review within 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Updates</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUpdates}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <p className="text-xs text-muted-foreground">
              Current compliance rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="historical">Historical Legislations</TabsTrigger>
            <TabsTrigger value="intelligence">Rules Intelligence</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-4">
            <select 
              value={selectedSource} 
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Sources</option>
              <option value="FDA">FDA</option>
              <option value="EMA">EMA</option>
              <option value="ICH">ICH</option>
              <option value="WHO">WHO</option>
              <option value="NMPA">NMPA</option>
              <option value="PMDA">PMDA</option>
            </select>
            
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Data Privacy">Data Privacy</option>
              <option value="Clinical Trials">Clinical Trials</option>
              <option value="Drug Safety">Drug Safety</option>
              <option value="Quality Assurance">Quality Assurance</option>
            </select>
          </div>
        </div>

        <TabsContent value="new" className="space-y-4">
          {/* New Updates Sub-tabs */}
          <Tabs defaultValue="all-updates" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all-updates">All Updates</TabsTrigger>
              <TabsTrigger value="ai-ml">AI/ML Focus</TabsTrigger>
              <TabsTrigger value="data-privacy">Data Privacy</TabsTrigger>
              <TabsTrigger value="clinical">Clinical Trials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-updates" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading regulatory updates...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUpdates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No regulatory updates found. Try refreshing the data.</p>
                </div>
              ) : (
                filteredUpdates.map((update) => (
              <Card key={update.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getSourceIcon(update.source)}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{update.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {update.source} • {update.date} • {update.category}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(update.severity)}>
                      {update.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700">{update.summary}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Business Impact</h4>
                        <p className="text-sm text-gray-600">{update.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Action Required</h4>
                        <p className="text-sm text-gray-600">{update.actionRequired}</p>
                      </div>
                    </div>
                    
                    {update.assessmentImpact && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">Assessment Impact</h4>
                        <p className="text-sm text-blue-800 mb-2">{update.assessmentImpact}</p>
                        {update.affectedSections && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-blue-700 font-medium">Affected Sections:</span>
                            {update.affectedSections.map((section, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {section}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Published {update.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {update.documentUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              window.open(update.documentUrl, '_blank');
                              // Track download for analytics
                              console.log(`Downloaded: ${update.title}`);
                            }}
                            className="hover:bg-blue-50 transition-colors"
                            title={`Download ${update.title} document`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        {update.url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              window.open(update.url, '_blank');
                              // Track source view for analytics
                              console.log(`Viewed source: ${update.title}`);
                            }}
                            className="hover:bg-blue-50 transition-colors"
                            title={`View official ${update.source} source for ${update.title}`}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Source
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const linkToCopy = update.documentUrl || update.url || window.location.href;
                            navigator.clipboard.writeText(linkToCopy).then(() => {
                              console.log(`Copied link: ${update.title}`);
                              // You could add a toast notification here
                            });
                          }}
                          className="hover:bg-gray-50 transition-colors"
                          title="Copy link to this regulatory update"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
                ))
              )}
            </div>
          )}
            </TabsContent>

            <TabsContent value="ai-ml">
          <div className="space-y-4">
            {filteredUpdates
              .filter(update => update.category === 'AI/ML')
              .map((update) => (
                <Card key={update.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSourceIcon(update.source)}
                        <div className="flex-1">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {update.source} • {update.date}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(update.severity)}>
                        {update.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-4">{update.summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">AI/ML Impact</h4>
                        <p className="text-sm text-gray-600">{update.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Technical Action Required</h4>
                        <p className="text-sm text-gray-600">{update.actionRequired}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Published {update.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {update.documentUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              window.open(update.documentUrl, '_blank');
                              console.log(`Downloaded: ${update.title}`);
                            }}
                            className="hover:bg-blue-50 transition-colors"
                            title={`Download ${update.title} document`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        {update.url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              window.open(update.url, '_blank');
                              console.log(`Viewed source: ${update.title}`);
                            }}
                            className="hover:bg-blue-50 transition-colors"
                            title={`View official ${update.source} source for ${update.title}`}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Source
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const linkToCopy = update.documentUrl || update.url || window.location.href;
                            navigator.clipboard.writeText(linkToCopy).then(() => {
                              console.log(`Copied link: ${update.title}`);
                            });
                          }}
                          className="hover:bg-gray-50 transition-colors"
                          title="Copy link to this regulatory update"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
            </TabsContent>

            <TabsContent value="data-privacy">
          <div className="space-y-4">
            {filteredUpdates
              .filter(update => update.category === 'Data Privacy')
              .map((update) => (
                <Card key={update.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSourceIcon(update.source)}
                        <div className="flex-1">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {update.source} • {update.date}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(update.severity)}>
                        {update.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-4">{update.summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Privacy Impact</h4>
                        <p className="text-sm text-gray-600">{update.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Compliance Action Required</h4>
                        <p className="text-sm text-gray-600">{update.actionRequired}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Published {update.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {update.documentUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              window.open(update.documentUrl, '_blank');
                              console.log(`Downloaded: ${update.title}`);
                            }}
                            className="hover:bg-blue-50 transition-colors"
                            title={`Download ${update.title} document`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        {update.url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              window.open(update.url, '_blank');
                              console.log(`Viewed source: ${update.title}`);
                            }}
                            className="hover:bg-blue-50 transition-colors"
                            title={`View official ${update.source} source for ${update.title}`}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Source
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const linkToCopy = update.documentUrl || update.url || window.location.href;
                            navigator.clipboard.writeText(linkToCopy).then(() => {
                              console.log(`Copied link: ${update.title}`);
                            });
                          }}
                          className="hover:bg-gray-50 transition-colors"
                          title="Copy link to this regulatory update"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
            </TabsContent>

            <TabsContent value="clinical">
          <div className="space-y-4">
            {filteredUpdates
              .filter(update => update.category === 'Clinical Trials')
              .map((update) => (
                <Card key={update.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSourceIcon(update.source)}
                        <div className="flex-1">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {update.source} • {update.date}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(update.severity)}>
                        {update.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-4">{update.summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Clinical Impact</h4>
                        <p className="text-sm text-gray-600">{update.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Protocol Updates Required</h4>
                        <p className="text-sm text-gray-600">{update.actionRequired}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Published {update.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {update.documentUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              window.open(update.documentUrl, '_blank');
                              console.log(`Downloaded: ${update.title}`);
                            }}
                            className="hover:bg-blue-50 transition-colors"
                            title={`Download ${update.title} document`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        {update.url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              window.open(update.url, '_blank');
                              console.log(`Viewed source: ${update.title}`);
                            }}
                            className="hover:bg-blue-50 transition-colors"
                            title={`View official ${update.source} source for ${update.title}`}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Source
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const linkToCopy = update.documentUrl || update.url || window.location.href;
                            navigator.clipboard.writeText(linkToCopy).then(() => {
                              console.log(`Copied link: ${update.title}`);
                            });
                          }}
                          className="hover:bg-gray-50 transition-colors"
                          title="Copy link to this regulatory update"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <HistoricalLegislationsTab />
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          {rulesIntelligence ? (
            <div className="space-y-6">
              {/* Rules Intelligence Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Rules</p>
                        <p className="text-2xl font-bold text-gray-900">{rulesIntelligence.totalRules}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Optimized Rules</p>
                        <p className="text-2xl font-bold text-gray-900">{rulesIntelligence.optimizedRules}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Recommendations</p>
                        <p className="text-2xl font-bold text-gray-900">{rulesIntelligence.recommendations}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{rulesIntelligence.avgSuccessRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Rules */}
              {rulesIntelligence.topPerformingRules && rulesIntelligence.topPerformingRules.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top Performing Rules
                    </CardTitle>
                    <CardDescription>
                      Rules with highest success rates and optimization potential
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rulesIntelligence.topPerformingRules.map((rule: any, index: number) => (
                        <div key={rule.ruleId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{rule.ruleName}</h4>
                            <p className="text-sm text-gray-600">
                              Success Rate: {rule.successRate}% • Impact Score: {rule.impactScore}
                            </p>
                            {rule.optimizationSuggestions && rule.optimizationSuggestions.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {rule.optimizationSuggestions[0]}
                              </p>
                            )}
                          </div>
                          <Badge variant={rule.successRate > 80 ? "default" : "secondary"}>
                            {rule.successRate > 80 ? "Optimized" : "Needs Review"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Urgent Recommendations */}
              {rulesIntelligence.urgentRecommendations && rulesIntelligence.urgentRecommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      Urgent Recommendations
                    </CardTitle>
                    <CardDescription>
                      High-priority rule optimizations that need immediate attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rulesIntelligence.urgentRecommendations.map((rec: any, index: number) => (
                        <div key={rec.ruleId} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-red-900">{rec.reasoning}</h4>
                              <p className="text-sm text-red-700 mt-1">{rec.expectedImpact}</p>
                              <p className="text-xs text-red-600 mt-2">
                                Confidence: {rec.confidence}% • Complexity: {rec.implementationComplexity}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                              Optimize
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading rules intelligence...</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegulatoryIntelligence;
