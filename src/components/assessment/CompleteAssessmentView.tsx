/**
 * Complete Assessment View - ComplianceIQ System
 * Displays all questions across all 12 sections for comprehensive evaluation
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Shield,
  Brain,
  Users,
  Settings,
  Database,
  Lock,
  Eye,
  Archive,
  Cog,
  Save,
  Target,
  TrendingUp,
  AlertCircle,
  Info,
  Star,
  Award,
  Zap,
  Clock,
  Globe,
  Scale
} from 'lucide-react';

interface CompleteAssessmentViewProps {
  config: any;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  onSave: () => void;
}

const CompleteAssessmentView: React.FC<CompleteAssessmentViewProps> = ({
  config,
  responses,
  onResponseChange,
  onSave
}) => {
  const [activeSection, setActiveSection] = useState<string>('ai-validation-coverage');

  // Debug: Log responses prop changes
  React.useEffect(() => {
    console.log('CompleteAssessmentView responses prop updated:', responses);
  }, [responses]);

  // Comprehensive assessment sections with all questions
  const assessmentSections = [
    {
      id: 'regulatory-compliance',
      name: 'Regulatory Compliance & FDA 2025 Guidance',
      description: 'FDA Seven-Step Credibility Assessment Framework and Context of Use validation',
      icon: Shield,
      maxScore: 41,
      isCritical: true,
      validator: 'Regulatory Affairs Director + Legal Counsel - FDA Specialist',
      questions: [
        {
          id: 'fda-cred-001',
          text: '🚨 PRODUCTION BLOCKER: Is your Context of Use (COU) production-defined for each AI model\'s specific regulatory question and decision impact?',
          points: 6,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['COU documentation', 'Regulatory question mapping', 'Decision impact analysis'],
          responsibleRole: ['Regulatory Affairs Director', 'Data Science/AI Head']
        },
        {
          id: 'fda-cred-002',
          text: '🚨 PRODUCTION BLOCKER: Is your seven-step credibility assessment framework production-implemented per FDA January 2025 guidance?',
          points: 6,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Seven-step framework documentation', 'FDA 2025 guidance compliance', 'Implementation validation'],
          responsibleRole: ['Regulatory Affairs Director', 'Quality Assurance Director']
        },
        {
          id: 'fda-cred-003',
          text: 'Is your AI model performance benchmarks production-calibrated for the specific regulatory context of use?',
          points: 4,
          isBlocker: false,
          category: 'Performance Calibration',
          evidenceRequired: ['Performance benchmark documentation', 'COU-specific validation', 'Regulatory context mapping'],
          responsibleRole: ['Data Science/AI Head', 'Regulatory Affairs Manager']
        },
        {
          id: 'fda-cred-004',
          text: 'Is your evidence generation strategy production-configured for risk-based credibility validation?',
          points: 4,
          isBlocker: false,
          category: 'Evidence Generation',
          evidenceRequired: ['Evidence generation strategy', 'Risk-based validation protocols', 'Credibility assessment framework'],
          responsibleRole: ['Regulatory Affairs Director', 'Clinical Operations Director']
        },
        {
          id: 'fda-cred-005',
          text: '🚨 PRODUCTION BLOCKER: Is your model uncertainty quantification production-deployed with explicit confidence intervals?',
          points: 5,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Uncertainty quantification system', 'Confidence interval documentation', 'Production deployment validation'],
          responsibleRole: ['Data Science/AI Head', 'Biostatistician']
        },
        {
          id: 'fda-cred-006',
          text: 'Are your credibility thresholds production-established and documented for regulatory submissions?',
          points: 4,
          isBlocker: false,
          category: 'Credibility Thresholds',
          evidenceRequired: ['Credibility threshold documentation', 'Regulatory submission protocols', 'Threshold validation reports'],
          responsibleRole: ['Regulatory Affairs Director', 'Statistical Analysis Manager']
        },
        {
          id: 'fda-cred-007',
          text: 'Is your AI model reproducibility production-validated across different computational environments?',
          points: 4,
          isBlocker: false,
          category: 'Model Reproducibility',
          evidenceRequired: ['Reproducibility validation reports', 'Cross-environment testing', 'Computational environment documentation'],
          responsibleRole: ['Data Science/AI Head', 'MLOps Engineer']
        },
        {
          id: 'cou-def-001',
          text: '🚨 PRODUCTION BLOCKER: Is your AI system\'s regulatory question scope production-defined with precise functional boundaries?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Regulatory question scope documentation', 'Functional boundary definition', 'Scope validation protocols'],
          responsibleRole: ['Regulatory Affairs Director', 'Legal Counsel - FDA Specialist']
        },
        {
          id: 'cou-def-002',
          text: 'Are your AI model performance expectations production-calibrated for each specific context of use?',
          points: 3,
          isBlocker: false,
          category: 'Performance Expectations',
          evidenceRequired: ['Performance expectation documentation', 'COU-specific calibration', 'Expectation validation reports'],
          responsibleRole: ['Data Science/AI Head', 'Regulatory Affairs Manager']
        },
        {
          id: 'cou-def-003',
          text: 'Is your patient safety impact assessment production-quantified for each COU?',
          points: 3,
          isBlocker: false,
          category: 'Patient Safety Impact',
          evidenceRequired: ['Safety impact assessment documentation', 'COU-specific quantification', 'Safety validation protocols'],
          responsibleRole: ['Patient Safety Officer', 'Regulatory Affairs Director']
        },
        {
          id: 'cou-def-004',
          text: 'Are your AI system limitation boundaries production-documented and validated?',
          points: 3,
          isBlocker: false,
          category: 'System Limitations',
          evidenceRequired: ['System limitation documentation', 'Boundary validation protocols', 'Limitation assessment reports'],
          responsibleRole: ['Data Science/AI Head', 'Quality Assurance Director']
        },
        {
          id: 'cou-def-005',
          text: 'Is your context-appropriate validation protocol production-implemented for each use case?',
          points: 3,
          isBlocker: false,
          category: 'Validation Protocol',
          evidenceRequired: ['Context-appropriate validation protocols', 'Use case implementation', 'Protocol validation documentation'],
          responsibleRole: ['Quality Assurance Director', 'Regulatory Affairs Manager']
        }
      ]
    },
    {
      id: 'international-regulatory-harmonization',
      name: 'International Regulatory Harmonization',
      description: 'EMA, PMDA, ICH, NMPA AI/ML guidelines and harmonized requirements',
      icon: Globe,
      maxScore: 32,
      isCritical: true,
      validator: 'Regulatory Affairs Director + International Regulatory Specialist',
      questions: [
        {
          id: 'ema-ai-001',
          text: '🚨 PRODUCTION BLOCKER: Is your EMA AI/ML guideline compliance framework production-implemented per 2024 guidance?',
          points: 6,
          isBlocker: true,
          category: 'EMA AI/ML Guideline Integration',
          evidenceRequired: ['EMA AI/ML guideline compliance documentation', 'Framework implementation evidence', 'Regulatory submission readiness'],
          responsibleRole: ['Regulatory Affairs Director', 'International Regulatory Specialist']
        },
        {
          id: 'ema-ai-002',
          text: 'Are your EMA-specific AI model validation protocols production-configured for European market authorization?',
          points: 4,
          isBlocker: false,
          category: 'EMA AI/ML Guideline Integration',
          evidenceRequired: ['EMA validation protocol documentation', 'European market authorization evidence', 'Protocol implementation records'],
          responsibleRole: ['Regulatory Affairs Director', 'Quality Assurance Manager']
        },
        {
          id: 'ema-ai-003',
          text: 'Is your EMA AI transparency and explainability framework production-deployed with regulatory documentation?',
          points: 4,
          isBlocker: false,
          category: 'EMA AI/ML Guideline Integration',
          evidenceRequired: ['AI transparency framework documentation', 'Explainability implementation evidence', 'Regulatory documentation'],
          responsibleRole: ['Regulatory Affairs Director', 'Data Science Head']
        },
        {
          id: 'pmda-ai-001',
          text: '🚨 PRODUCTION BLOCKER: Is your PMDA AI/ML regulatory framework production-aligned with Japanese pharmaceutical AI guidelines?',
          points: 6,
          isBlocker: true,
          category: 'PMDA AI/ML Guidelines',
          evidenceRequired: ['PMDA AI/ML regulatory framework documentation', 'Japanese guideline compliance evidence', 'Framework alignment validation'],
          responsibleRole: ['International Regulatory Specialist', 'Regulatory Affairs Director']
        },
        {
          id: 'pmda-ai-002',
          text: 'Are your PMDA-specific AI validation requirements production-implemented for Japanese market access?',
          points: 4,
          isBlocker: false,
          category: 'PMDA AI/ML Guidelines',
          evidenceRequired: ['PMDA validation requirements documentation', 'Japanese market access evidence', 'Implementation validation records'],
          responsibleRole: ['International Regulatory Specialist', 'Quality Assurance Manager']
        },
        {
          id: 'ich-ai-001',
          text: 'Is your ICH harmonized AI/ML framework production-configured across US, EU, and Japanese markets?',
          points: 4,
          isBlocker: false,
          category: 'ICH Harmonization',
          evidenceRequired: ['ICH harmonized framework documentation', 'Multi-market compliance evidence', 'Framework configuration validation'],
          responsibleRole: ['Regulatory Affairs Director', 'International Regulatory Specialist']
        },
        {
          id: 'nmpa-ai-001',
          text: 'Is your NMPA AI/ML compliance framework production-aligned with Chinese pharmaceutical AI regulations?',
          points: 4,
          isBlocker: false,
          category: 'NMPA AI Guidelines',
          evidenceRequired: ['NMPA compliance framework documentation', 'Chinese regulation alignment evidence', 'Framework implementation validation'],
          responsibleRole: ['International Regulatory Specialist', 'Regulatory Affairs Manager']
        }
      ]
    },
    {
      id: 'ai-pharmacovigilance-surveillance',
      name: 'AI Pharmacovigilance & Post-Market Surveillance',
      description: 'AI-driven adverse event detection, signal management, and post-market monitoring',
      icon: AlertTriangle,
      maxScore: 28,
      isCritical: true,
      validator: 'Pharmacovigilance Director + AI Safety Specialist',
      questions: [
        {
          id: 'pv-ai-001',
          text: '🚨 PRODUCTION BLOCKER: Is your AI-driven adverse event detection system production-deployed with real-time signal processing capabilities?',
          points: 6,
          isBlocker: true,
          category: 'AI Adverse Event Detection',
          evidenceRequired: ['AI adverse event detection system documentation', 'Real-time signal processing validation', 'System deployment evidence'],
          responsibleRole: ['Pharmacovigilance Director', 'AI Safety Specialist']
        },
        {
          id: 'pv-ai-002',
          text: 'Are your AI-powered signal detection algorithms production-calibrated with 95%+ sensitivity for safety signals?',
          points: 5,
          isBlocker: false,
          category: 'AI Signal Detection',
          evidenceRequired: ['AI signal detection algorithm documentation', 'Sensitivity calibration validation', 'Algorithm performance metrics'],
          responsibleRole: ['Pharmacovigilance Director', 'Data Science/AI Head']
        },
        {
          id: 'pv-ai-003',
          text: 'Is your AI-based risk-benefit assessment framework production-implemented for post-market surveillance?',
          points: 4,
          isBlocker: false,
          category: 'AI Risk-Benefit Assessment',
          evidenceRequired: ['AI risk-benefit assessment framework documentation', 'Post-market surveillance implementation evidence', 'Framework validation reports'],
          responsibleRole: ['Pharmacovigilance Director', 'Risk Management Specialist']
        },
        {
          id: 'pv-ai-004',
          text: 'Are your AI-enhanced case causality assessment tools production-deployed with regulatory compliance?',
          points: 4,
          isBlocker: false,
          category: 'AI Causality Assessment',
          evidenceRequired: ['AI causality assessment tool documentation', 'Regulatory compliance validation', 'Tool deployment evidence'],
          responsibleRole: ['Pharmacovigilance Director', 'Medical Safety Officer']
        },
        {
          id: 'pv-ai-005',
          text: 'Is your AI-powered literature surveillance system production-configured for automated safety signal detection?',
          points: 4,
          isBlocker: false,
          category: 'AI Literature Surveillance',
          evidenceRequired: ['AI literature surveillance system documentation', 'Automated signal detection validation', 'System configuration evidence'],
          responsibleRole: ['Pharmacovigilance Director', 'Information Technology Manager']
        },
        {
          id: 'pv-ai-006',
          text: 'Are your AI-driven post-market study designs production-validated with regulatory acceptance criteria?',
          points: 3,
          isBlocker: false,
          category: 'AI Post-Market Studies',
          evidenceRequired: ['AI post-market study design documentation', 'Regulatory acceptance validation', 'Study design validation reports'],
          responsibleRole: ['Pharmacovigilance Director', 'Clinical Research Manager']
        },
        {
          id: 'pv-ai-007',
          text: 'Is your AI-enhanced regulatory reporting system production-deployed with automated compliance validation?',
          points: 2,
          isBlocker: false,
          category: 'AI Regulatory Reporting',
          evidenceRequired: ['AI regulatory reporting system documentation', 'Automated compliance validation evidence', 'System deployment validation'],
          responsibleRole: ['Pharmacovigilance Director', 'Regulatory Affairs Manager']
        }
      ]
    },
    {
      id: 'ai-validation-coverage',
      name: 'AI Model Validation Coverage',
      description: 'Comprehensive AI model validation across all deployment scenarios',
      icon: Brain,
      maxScore: 30,
      isCritical: true,
      validator: 'Data Science/AI Head + Quality Assurance Director',
      questions: [
        {
          id: 'ai-val-001',
          text: '🚨 PRODUCTION BLOCKER: Are your AI models production-validated with comprehensive test coverage across all therapeutic areas?',
          points: 5,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Model validation documentation', 'Test coverage reports', 'Therapeutic area validation'],
          responsibleRole: ['Data Science/AI Head', 'Quality Assurance Director']
        },
        {
          id: 'ai-val-002',
          text: '🚨 PRODUCTION BLOCKER: Is your model explainability system production-deployed for regulatory transparency?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Explainability system documentation', 'Regulatory transparency validation'],
          responsibleRole: ['Data Science/AI Head', 'Regulatory Affairs Manager']
        },
        {
          id: 'ai-val-003',
          text: '🚨 PRODUCTION BLOCKER: Are your statistical validation protocols production-configured for FDA submission requirements?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Statistical validation protocols', 'FDA submission documentation'],
          responsibleRole: ['Biostatistician', 'Regulatory Affairs Director']
        },
        {
          id: 'ai-val-004',
          text: 'Is your performance monitoring production-configured for post-market surveillance compliance?',
          points: 3,
          isBlocker: false,
          category: 'Performance Monitoring',
          evidenceRequired: ['Performance monitoring system', 'Post-market surveillance protocols'],
          responsibleRole: ['Data Science/AI Head', 'Post-Market Surveillance Manager']
        },
        {
          id: 'ai-val-005',
          text: 'Are your algorithm bias detection systems production-deployed with 95%+ accuracy validation?',
          points: 4,
          isBlocker: false,
          category: 'Bias Detection',
          evidenceRequired: ['Bias detection system documentation', 'Accuracy validation reports'],
          responsibleRole: ['Data Science/AI Head', 'Bias Detection Specialist']
        },
        {
          id: 'ai-val-006',
          text: 'Is your model versioning and lifecycle management production-configured with audit trails?',
          points: 3,
          isBlocker: false,
          category: 'Model Lifecycle',
          evidenceRequired: ['Model versioning documentation', 'Lifecycle management protocols'],
          responsibleRole: ['MLOps Engineer', 'Quality Assurance Manager']
        },
        {
          id: 'ai-val-007',
          text: 'Are your cross-validation protocols production-configured with statistical significance testing?',
          points: 3,
          isBlocker: false,
          category: 'Cross-Validation',
          evidenceRequired: ['Cross-validation protocols', 'Statistical significance documentation'],
          responsibleRole: ['Biostatistician', 'Data Science/AI Head']
        },
        {
          id: 'ai-val-008',
          text: 'Is your model uncertainty quantification production-deployed for clinical decision support?',
          points: 4,
          isBlocker: false,
          category: 'Uncertainty Quantification',
          evidenceRequired: ['Uncertainty quantification system', 'Clinical decision support validation'],
          responsibleRole: ['Data Science/AI Head', 'Clinical Decision Support Manager']
        }
      ]
    },
    {
      id: 'data-privacy-compliance',
      name: 'Data Privacy Compliance Rate',
      description: 'GDPR, HIPAA, and data privacy compliance across all data sources',
      icon: Shield,
      maxScore: 25,
      isCritical: true,
      validator: 'Privacy Officer + Legal Counsel',
      questions: [
        {
          id: 'privacy-001',
          text: '🚨 PRODUCTION BLOCKER: Is your GDPR compliance framework production-deployed across all clinical data sources?',
          points: 5,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['GDPR compliance documentation', 'Data source validation reports'],
          responsibleRole: ['Privacy Officer', 'Legal Counsel']
        },
        {
          id: 'privacy-002',
          text: '🚨 PRODUCTION BLOCKER: Is your HIPAA compliance system production-configured with 99%+ accuracy validation?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['HIPAA compliance system', 'Accuracy validation documentation'],
          responsibleRole: ['Privacy Officer', 'HIPAA Compliance Manager']
        },
        {
          id: 'privacy-003',
          text: '🚨 PRODUCTION BLOCKER: Are your data anonymization protocols production-deployed with privacy-preserving techniques?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Data anonymization protocols', 'Privacy-preserving validation'],
          responsibleRole: ['Privacy Officer', 'Data Protection Engineer']
        },
        {
          id: 'privacy-004',
          text: 'Is your consent management system production-configured for AI model training and deployment?',
          points: 3,
          isBlocker: false,
          category: 'Consent Management',
          evidenceRequired: ['Consent management system', 'AI training consent validation'],
          responsibleRole: ['Privacy Officer', 'Consent Management Specialist']
        },
        {
          id: 'privacy-005',
          text: 'Are your data retention policies production-configured with automated deletion protocols?',
          points: 3,
          isBlocker: false,
          category: 'Data Retention',
          evidenceRequired: ['Data retention policies', 'Automated deletion protocols'],
          responsibleRole: ['Privacy Officer', 'Data Governance Manager']
        },
        {
          id: 'privacy-006',
          text: 'Is your cross-border data transfer compliance production-configured for international deployments?',
          points: 3,
          isBlocker: false,
          category: 'Cross-Border Transfer',
          evidenceRequired: ['Cross-border transfer protocols', 'International compliance validation'],
          responsibleRole: ['Legal Counsel', 'International Compliance Manager']
        },
        {
          id: 'privacy-007',
          text: 'Are your data breach notification procedures production-configured with automated alerting?',
          points: 3,
          isBlocker: false,
          category: 'Breach Notification',
          evidenceRequired: ['Breach notification procedures', 'Automated alerting system'],
          responsibleRole: ['Privacy Officer', 'Security Incident Manager']
        }
      ]
    },
    {
      id: 'clinical-trial-protocol',
      name: 'Clinical Trial Protocol Adherence',
      description: 'ICH GCP compliance and clinical trial protocol adherence',
      icon: Users,
      maxScore: 25,
      isCritical: true,
      validator: 'Clinical Operations Director + Quality Assurance Director',
      questions: [
        {
          id: 'clinical-001',
          text: '🚨 PRODUCTION BLOCKER: Is your ICH GCP compliance system production-deployed across all clinical trial sites?',
          points: 5,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['ICH GCP compliance system', 'Multi-site validation documentation'],
          responsibleRole: ['Clinical Operations Director', 'Quality Assurance Director']
        },
        {
          id: 'clinical-002',
          text: '🚨 PRODUCTION BLOCKER: Are your clinical trial protocol adherence monitoring systems production-configured?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Protocol adherence monitoring', 'Compliance tracking system'],
          responsibleRole: ['Clinical Operations Director', 'Protocol Compliance Manager']
        },
        {
          id: 'clinical-003',
          text: '🚨 PRODUCTION BLOCKER: Is your informed consent management production-configured with electronic signature validation?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Informed consent management', 'Electronic signature validation'],
          responsibleRole: ['Clinical Operations Director', 'Consent Management Specialist']
        },
        {
          id: 'clinical-004',
          text: 'Are your adverse event reporting systems production-configured with real-time monitoring?',
          points: 3,
          isBlocker: false,
          category: 'Adverse Event Reporting',
          evidenceRequired: ['AE reporting systems', 'Real-time monitoring validation'],
          responsibleRole: ['Pharmacovigilance Director', 'AE Reporting Manager']
        },
        {
          id: 'clinical-005',
          text: 'Is your clinical data quality assurance production-configured with automated validation?',
          points: 3,
          isBlocker: false,
          category: 'Data Quality Assurance',
          evidenceRequired: ['Data quality assurance system', 'Automated validation protocols'],
          responsibleRole: ['Clinical Data Manager', 'Data Quality Specialist']
        },
        {
          id: 'clinical-006',
          text: 'Are your site monitoring procedures production-configured with remote monitoring capabilities?',
          points: 3,
          isBlocker: false,
          category: 'Site Monitoring',
          evidenceRequired: ['Site monitoring procedures', 'Remote monitoring validation'],
          responsibleRole: ['Clinical Operations Director', 'Site Monitoring Manager']
        },
        {
          id: 'clinical-007',
          text: 'Is your clinical trial master file production-configured with automated documentation?',
          points: 3,
          isBlocker: false,
          category: 'Trial Master File',
          evidenceRequired: ['TMF management system', 'Automated documentation validation'],
          responsibleRole: ['Clinical Operations Director', 'TMF Manager']
        }
      ]
    },
    {
      id: 'quality-assurance',
      name: 'Quality Assurance Score',
      description: 'FDA 21 CFR Part 11 compliance and quality management systems',
      icon: CheckCircle,
      maxScore: 25,
      isCritical: true,
      validator: 'Quality Assurance Director + IT Compliance Officer',
      questions: [
        {
          id: 'qa-001',
          text: '🚨 PRODUCTION BLOCKER: Is your FDA 21 CFR Part 11 compliance system production-deployed with electronic signature validation?',
          points: 5,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['21 CFR Part 11 compliance system', 'Electronic signature validation'],
          responsibleRole: ['Quality Assurance Director', 'IT Compliance Officer']
        },
        {
          id: 'qa-002',
          text: '🚨 PRODUCTION BLOCKER: Is your ISO 13485 quality management system production-configured for medical devices?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['ISO 13485 QMS documentation', 'Medical device validation'],
          responsibleRole: ['Quality Assurance Director', 'Medical Device Specialist']
        },
        {
          id: 'qa-003',
          text: '🚨 PRODUCTION BLOCKER: Are your change control procedures production-configured with validation protocols?',
          points: 4,
          isBlocker: true,
          category: 'Production Blocker',
          evidenceRequired: ['Change control procedures', 'Validation protocols'],
          responsibleRole: ['Quality Assurance Director', 'Change Control Manager']
        },
        {
          id: 'qa-004',
          text: 'Is your risk management system production-configured with ISO 14971 compliance?',
          points: 3,
          isBlocker: false,
          category: 'Risk Management',
          evidenceRequired: ['Risk management system', 'ISO 14971 compliance documentation'],
          responsibleRole: ['Risk Management Specialist', 'Quality Assurance Manager']
        },
        {
          id: 'qa-005',
          text: 'Are your document control procedures production-automated with version management?',
          points: 3,
          isBlocker: false,
          category: 'Document Control',
          evidenceRequired: ['Document control procedures', 'Version management system'],
          responsibleRole: ['Document Control Manager', 'Quality Assurance Specialist']
        },
        {
          id: 'qa-006',
          text: 'Is your CAPA (Corrective and Preventive Action) system production-configured with tracking?',
          points: 3,
          isBlocker: false,
          category: 'CAPA System',
          evidenceRequired: ['CAPA system documentation', 'Action tracking validation'],
          responsibleRole: ['Quality Assurance Director', 'CAPA Coordinator']
        },
        {
          id: 'qa-007',
          text: 'Are your audit management procedures production-configured with scheduling and tracking?',
          points: 3,
          isBlocker: false,
          category: 'Audit Management',
          evidenceRequired: ['Audit management procedures', 'Scheduling and tracking system'],
          responsibleRole: ['Quality Assurance Director', 'Audit Manager']
        }
      ]
    },
    {
      id: 'ai-legal-compliance-liability',
      name: 'AI Legal Compliance & Liability Framework',
      description: 'AI liability management, intellectual property protection, and legal risk mitigation',
      icon: Scale,
      maxScore: 35,
      isCritical: true,
      validator: 'Legal Counsel + AI Ethics Officer',
      questions: [
        {
          id: 'legal-ai-001',
          text: '🚨 PRODUCTION BLOCKER: Is your AI liability framework production-implemented with comprehensive risk assessment and mitigation strategies?',
          points: 7,
          isBlocker: true,
          category: 'AI Liability Framework',
          evidenceRequired: ['AI liability framework documentation', 'Risk assessment and mitigation strategies', 'Legal compliance validation'],
          responsibleRole: ['Legal Counsel', 'AI Ethics Officer']
        },
        {
          id: 'legal-ai-002',
          text: 'Are your AI intellectual property protections production-deployed with patent and trade secret safeguards?',
          points: 6,
          isBlocker: false,
          category: 'AI Intellectual Property',
          evidenceRequired: ['AI IP protection documentation', 'Patent and trade secret safeguards', 'IP deployment validation'],
          responsibleRole: ['Legal Counsel', 'Intellectual Property Manager']
        },
        {
          id: 'legal-ai-003',
          text: 'Is your AI algorithm transparency framework production-configured with regulatory disclosure requirements?',
          points: 5,
          isBlocker: false,
          category: 'AI Algorithm Transparency',
          evidenceRequired: ['AI transparency framework documentation', 'Regulatory disclosure requirements', 'Framework configuration validation'],
          responsibleRole: ['Legal Counsel', 'Regulatory Affairs Manager']
        },
        {
          id: 'legal-ai-004',
          text: 'Are your AI data governance legal frameworks production-implemented with privacy and security compliance?',
          points: 5,
          isBlocker: false,
          category: 'AI Data Governance',
          evidenceRequired: ['AI data governance legal frameworks', 'Privacy and security compliance validation', 'Framework implementation evidence'],
          responsibleRole: ['Legal Counsel', 'Data Privacy Officer']
        },
        {
          id: 'legal-ai-005',
          text: 'Is your AI bias and discrimination legal framework production-deployed with equal opportunity compliance?',
          points: 4,
          isBlocker: false,
          category: 'AI Bias Legal Framework',
          evidenceRequired: ['AI bias legal framework documentation', 'Equal opportunity compliance validation', 'Framework deployment evidence'],
          responsibleRole: ['Legal Counsel', 'AI Ethics Officer']
        },
        {
          id: 'legal-ai-006',
          text: 'Are your AI clinical decision support legal safeguards production-configured with medical liability protections?',
          points: 4,
          isBlocker: false,
          category: 'AI Clinical Legal Safeguards',
          evidenceRequired: ['AI clinical legal safeguards documentation', 'Medical liability protection validation', 'Safeguard configuration evidence'],
          responsibleRole: ['Legal Counsel', 'Medical Affairs Director']
        },
        {
          id: 'legal-ai-007',
          text: 'Is your AI regulatory compliance monitoring system production-deployed with automated legal risk detection?',
          points: 4,
          isBlocker: false,
          category: 'AI Regulatory Compliance Monitoring',
          evidenceRequired: ['AI regulatory compliance monitoring system', 'Automated legal risk detection validation', 'System deployment evidence'],
          responsibleRole: ['Legal Counsel', 'Compliance Officer']
        }
      ]
    },
    {
      id: 'good-machine-learning-practice',
      name: 'Good Machine Learning Practice (GMLP) Framework',
      description: 'GMLP standards, model governance, and ML lifecycle management',
      icon: Award,
      maxScore: 42,
      isCritical: true,
      validator: 'MLOps Director + AI Governance Officer',
      questions: [
        {
          id: 'gmlp-001',
          text: '🚨 PRODUCTION BLOCKER: Is your GMLP framework production-implemented with comprehensive model governance and lifecycle management?',
          points: 8,
          isBlocker: true,
          category: 'GMLP Framework Implementation',
          evidenceRequired: ['GMLP framework documentation', 'Model governance protocols', 'Lifecycle management validation'],
          responsibleRole: ['MLOps Director', 'AI Governance Officer']
        },
        {
          id: 'gmlp-002',
          text: 'Are your ML model development standards production-configured with GMLP compliance validation?',
          points: 7,
          isBlocker: false,
          category: 'ML Development Standards',
          evidenceRequired: ['ML development standards documentation', 'GMLP compliance validation', 'Standards configuration evidence'],
          responsibleRole: ['MLOps Director', 'Data Science/AI Head']
        },
        {
          id: 'gmlp-003',
          text: 'Is your model validation and testing framework production-deployed with automated GMLP compliance checking?',
          points: 6,
          isBlocker: false,
          category: 'Model Validation Framework',
          evidenceRequired: ['Model validation framework documentation', 'Automated GMLP compliance checking', 'Framework deployment validation'],
          responsibleRole: ['MLOps Director', 'Quality Assurance Manager']
        },
        {
          id: 'gmlp-004',
          text: 'Are your ML data management practices production-implemented with GMLP data governance standards?',
          points: 6,
          isBlocker: false,
          category: 'ML Data Management',
          evidenceRequired: ['ML data management practices documentation', 'GMLP data governance standards', 'Implementation validation'],
          responsibleRole: ['MLOps Director', 'Data Governance Manager']
        },
        {
          id: 'gmlp-005',
          text: 'Is your model monitoring and maintenance system production-configured with GMLP performance tracking?',
          points: 5,
          isBlocker: false,
          category: 'Model Monitoring',
          evidenceRequired: ['Model monitoring system documentation', 'GMLP performance tracking validation', 'System configuration evidence'],
          responsibleRole: ['MLOps Director', 'MLOps Engineer']
        },
        {
          id: 'gmlp-006',
          text: 'Are your ML documentation and reporting standards production-deployed with GMLP compliance documentation?',
          points: 4,
          isBlocker: false,
          category: 'ML Documentation Standards',
          evidenceRequired: ['ML documentation standards documentation', 'GMLP compliance documentation', 'Standards deployment validation'],
          responsibleRole: ['MLOps Director', 'Technical Writer']
        },
        {
          id: 'gmlp-007',
          text: 'Is your ML risk management framework production-implemented with GMLP risk assessment protocols?',
          points: 4,
          isBlocker: false,
          category: 'ML Risk Management',
          evidenceRequired: ['ML risk management framework documentation', 'GMLP risk assessment protocols', 'Framework implementation validation'],
          responsibleRole: ['MLOps Director', 'Risk Management Specialist']
        },
        {
          id: 'gmlp-008',
          text: 'Are your ML team training and competency programs production-configured with GMLP certification requirements?',
          points: 2,
          isBlocker: false,
          category: 'ML Training Programs',
          evidenceRequired: ['ML training programs documentation', 'GMLP certification requirements', 'Program configuration validation'],
          responsibleRole: ['MLOps Director', 'Training Manager']
        }
      ]
    },
    {
      id: 'final-integration-validation',
      name: 'Final Integration & Validation Framework',
      description: 'Comprehensive system integration, validation checklists, and production readiness certification',
      icon: CheckCircle,
      maxScore: 45,
      isCritical: true,
      validator: 'Chief Technology Officer + Quality Assurance Director',
      questions: [
        {
          id: 'integration-001',
          text: '🚨 PRODUCTION BLOCKER: Is your comprehensive system integration framework production-deployed with end-to-end validation protocols?',
          points: 9,
          isBlocker: true,
          category: 'System Integration Framework',
          evidenceRequired: ['System integration framework documentation', 'End-to-end validation protocols', 'Integration deployment validation'],
          responsibleRole: ['Chief Technology Officer', 'System Integration Manager']
        },
        {
          id: 'integration-002',
          text: 'Are your production readiness validation checklists production-implemented with automated compliance verification?',
          points: 8,
          isBlocker: false,
          category: 'Production Readiness Validation',
          evidenceRequired: ['Production readiness validation checklists', 'Automated compliance verification system', 'Validation implementation evidence'],
          responsibleRole: ['Quality Assurance Director', 'Production Readiness Manager']
        },
        {
          id: 'integration-003',
          text: 'Is your cross-functional team coordination framework production-configured with role-based validation workflows?',
          points: 7,
          isBlocker: false,
          category: 'Cross-Functional Coordination',
          evidenceRequired: ['Cross-functional coordination framework documentation', 'Role-based validation workflows', 'Framework configuration validation'],
          responsibleRole: ['Chief Technology Officer', 'Project Management Office']
        },
        {
          id: 'integration-004',
          text: 'Are your regulatory submission preparation protocols production-deployed with comprehensive documentation validation?',
          points: 6,
          isBlocker: false,
          category: 'Regulatory Submission Preparation',
          evidenceRequired: ['Regulatory submission preparation protocols', 'Comprehensive documentation validation', 'Protocol deployment evidence'],
          responsibleRole: ['Regulatory Affairs Director', 'Documentation Manager']
        },
        {
          id: 'integration-005',
          text: 'Is your continuous monitoring and improvement system production-implemented with real-time compliance tracking?',
          points: 6,
          isBlocker: false,
          category: 'Continuous Monitoring System',
          evidenceRequired: ['Continuous monitoring system documentation', 'Real-time compliance tracking validation', 'System implementation evidence'],
          responsibleRole: ['Quality Assurance Director', 'Compliance Monitoring Manager']
        },
        {
          id: 'integration-006',
          text: 'Are your stakeholder communication and reporting frameworks production-configured with automated status updates?',
          points: 5,
          isBlocker: false,
          category: 'Stakeholder Communication',
          evidenceRequired: ['Stakeholder communication frameworks documentation', 'Automated status update validation', 'Framework configuration evidence'],
          responsibleRole: ['Chief Technology Officer', 'Communications Manager']
        },
        {
          id: 'integration-007',
          text: 'Is your risk mitigation and contingency planning framework production-deployed with comprehensive scenario validation?',
          points: 4,
          isBlocker: false,
          category: 'Risk Mitigation Framework',
          evidenceRequired: ['Risk mitigation framework documentation', 'Comprehensive scenario validation', 'Framework deployment evidence'],
          responsibleRole: ['Quality Assurance Director', 'Risk Management Specialist']
        }
      ]
    },
    {
      id: 'ai-governance-committee-structure',
      name: 'AI Governance Committee & Cross-Functional Structure',
      description: 'Dedicated AI governance committee, multidisciplinary collaboration, and decision-making frameworks',
      icon: Users,
      maxScore: 28,
      isCritical: true,
      validator: 'Chief Executive Officer + Chief Technology Officer',
      questions: [
        {
          id: 'gov-committee-001',
          text: '🚨 PRODUCTION BLOCKER: Is your dedicated AI governance committee production-established with clear charter and authority?',
          points: 8,
          isBlocker: true,
          category: 'AI Governance Committee Structure',
          evidenceRequired: ['AI governance committee charter documentation', 'Authority delegation validation', 'Committee establishment evidence'],
          responsibleRole: ['Chief Executive Officer', 'Chief Technology Officer']
        },
        {
          id: 'gov-committee-002',
          text: '🚨 PRODUCTION BLOCKER: Are your AI governance roles and responsibilities production-defined across all therapeutic areas?',
          points: 6,
          isBlocker: true,
          category: 'Role Definition & Responsibility Matrix',
          evidenceRequired: ['AI governance role definitions', 'Responsibility matrix documentation', 'Therapeutic area coverage validation'],
          responsibleRole: ['Chief Executive Officer', 'Program Director']
        },
        {
          id: 'gov-committee-003',
          text: '🚨 PRODUCTION BLOCKER: Is your cross-departmental representation production-configured in AI governance committee?',
          points: 6,
          isBlocker: true,
          category: 'Cross-Departmental Representation',
          evidenceRequired: ['Cross-departmental representation documentation', 'Committee composition validation', 'Representation coverage evidence'],
          responsibleRole: ['Chief Executive Officer', 'HR Director']
        },
        {
          id: 'gov-committee-004',
          text: 'Are your multidisciplinary AI teams production-configured with legal, ethics, IT, and clinical representation?',
          points: 3,
          isBlocker: false,
          category: 'Multidisciplinary Team Structure',
          evidenceRequired: ['Multidisciplinary team composition documentation', 'Team configuration validation', 'Representation coverage evidence'],
          responsibleRole: ['Program Director', 'HR Director']
        },
        {
          id: 'gov-committee-005',
          text: 'Is your data science and regulatory collaboration framework production-implemented for AI decisions?',
          points: 2,
          isBlocker: false,
          category: 'Data Science-Regulatory Collaboration',
          evidenceRequired: ['Collaboration framework documentation', 'AI decision process validation', 'Framework implementation evidence'],
          responsibleRole: ['Data Science/AI Head', 'Regulatory Affairs Director']
        },
        {
          id: 'gov-committee-006',
          text: 'Are your external expert consultation protocols production-established for complex AI governance decisions?',
          points: 2,
          isBlocker: false,
          category: 'External Expert Consultation',
          evidenceRequired: ['External consultation protocol documentation', 'Expert engagement validation', 'Protocol implementation evidence'],
          responsibleRole: ['Program Director', 'External Governance Expert']
        },
        {
          id: 'gov-committee-007',
          text: 'Is your patient advocacy inclusion production-configured in AI development governance?',
          points: 1,
          isBlocker: false,
          category: 'Patient Advocacy Integration',
          evidenceRequired: ['Patient advocacy inclusion documentation', 'AI development governance validation', 'Advocacy integration evidence'],
          responsibleRole: ['Patient Advocacy Director', 'Chief Medical Officer']
        }
      ]
    },
    {
      id: 'ai-technology-specific-governance',
      name: 'AI Technology-Specific Governance Framework',
      description: 'Technology-specific requirements for ML, Deep Learning, NLP, Computer Vision, GANs, and Reinforcement Learning',
      icon: Brain,
      maxScore: 45,
      isCritical: true,
      validator: 'Chief Technology Officer + Data Science/AI Head',
      questions: [
        {
          id: 'ai-tech-001',
          text: '🚨 PRODUCTION BLOCKER: Are your Machine Learning model validation protocols production-deployed with comprehensive testing frameworks?',
          points: 8,
          isBlocker: true,
          category: 'Machine Learning Governance',
          evidenceRequired: ['ML model validation protocols documentation', 'Comprehensive testing framework validation', 'Model deployment evidence'],
          responsibleRole: ['Data Science/AI Head', 'MLOps Engineer']
        },
        {
          id: 'ai-tech-002',
          text: '🚨 PRODUCTION BLOCKER: Are your Deep Learning model interpretability and explainability frameworks production-implemented?',
          points: 8,
          isBlocker: true,
          category: 'Deep Learning Governance',
          evidenceRequired: ['Deep learning interpretability framework documentation', 'Explainability validation reports', 'Model transparency evidence'],
          responsibleRole: ['Deep Learning Specialist', 'Explainable AI Engineer']
        },
        {
          id: 'ai-tech-003',
          text: '🚨 PRODUCTION BLOCKER: Are your Natural Language Processing bias detection and fairness validation systems production-configured?',
          points: 7,
          isBlocker: true,
          category: 'Natural Language Processing Governance',
          evidenceRequired: ['NLP bias detection system documentation', 'Fairness validation protocols', 'Bias mitigation evidence'],
          responsibleRole: ['NLP Engineer', 'Bias Detection Specialist']
        },
        {
          id: 'ai-tech-004',
          text: 'Are your Computer Vision model robustness and adversarial attack resistance production-validated?',
          points: 6,
          isBlocker: false,
          category: 'Computer Vision Governance',
          evidenceRequired: ['Computer vision robustness documentation', 'Adversarial attack resistance validation', 'Model security evidence'],
          responsibleRole: ['Computer Vision Engineer', 'Security Specialist']
        },
        {
          id: 'ai-tech-005',
          text: 'Are your Generative Adversarial Networks (GANs) synthetic data validation and quality assurance protocols production-established?',
          points: 6,
          isBlocker: false,
          category: 'Generative AI Governance',
          evidenceRequired: ['GANs synthetic data validation documentation', 'Quality assurance protocols', 'Synthetic data generation evidence'],
          responsibleRole: ['Generative AI Specialist', 'Data Quality Manager']
        },
        {
          id: 'ai-tech-006',
          text: 'Are your Reinforcement Learning safety constraints and reward function validation frameworks production-implemented?',
          points: 5,
          isBlocker: false,
          category: 'Reinforcement Learning Governance',
          evidenceRequired: ['RL safety constraints documentation', 'Reward function validation protocols', 'Safety framework evidence'],
          responsibleRole: ['Reinforcement Learning Engineer', 'Safety Engineer']
        },
        {
          id: 'ai-tech-007',
          text: 'Are your AI technology-specific monitoring and performance tracking systems production-deployed across all model types?',
          points: 3,
          isBlocker: false,
          category: 'Technology-Specific Monitoring',
          evidenceRequired: ['AI monitoring system documentation', 'Performance tracking validation', 'Technology-specific monitoring evidence'],
          responsibleRole: ['MLOps Engineer', 'Performance Monitoring Specialist']
        },
        {
          id: 'ai-tech-008',
          text: 'Are your AI technology-specific regulatory compliance mappings production-configured for FDA and EMA requirements?',
          points: 2,
          isBlocker: false,
          category: 'Technology-Regulatory Mapping',
          evidenceRequired: ['Technology-regulatory mapping documentation', 'FDA/EMA compliance validation', 'Regulatory mapping evidence'],
          responsibleRole: ['Regulatory Affairs Director', 'Compliance Specialist']
        }
      ]
    },
    {
      id: 'international-standards-compliance-framework',
      name: 'International Standards Compliance Framework',
      description: 'IEEE 7000™, ISO/IEC 42001, NIST AI RMF, and international AI governance standards integration',
      icon: Shield,
      maxScore: 38,
      isCritical: true,
      validator: 'Chief Compliance Officer + Standards Compliance Director',
      questions: [
        {
          id: 'standards-001',
          text: '🚨 PRODUCTION BLOCKER: Are your IEEE 7000™ ethical design processes production-implemented with stakeholder value alignment?',
          points: 8,
          isBlocker: true,
          category: 'IEEE 7000™ Ethical Design',
          evidenceRequired: ['IEEE 7000™ compliance documentation', 'Ethical design process validation', 'Stakeholder value alignment evidence'],
          responsibleRole: ['Chief Ethics Officer', 'IEEE Standards Compliance Specialist']
        },
        {
          id: 'standards-002',
          text: '🚨 PRODUCTION BLOCKER: Are your ISO/IEC 42001 AI management system requirements production-deployed with continuous improvement frameworks?',
          points: 7,
          isBlocker: true,
          category: 'ISO/IEC 42001 AI Management',
          evidenceRequired: ['ISO/IEC 42001 certification documentation', 'AI management system validation', 'Continuous improvement framework evidence'],
          responsibleRole: ['Quality Management Director', 'ISO Compliance Specialist']
        },
        {
          id: 'standards-003',
          text: '🚨 PRODUCTION BLOCKER: Are your NIST AI Risk Management Framework controls production-configured with risk assessment protocols?',
          points: 7,
          isBlocker: true,
          category: 'NIST AI Risk Management',
          evidenceRequired: ['NIST AI RMF compliance documentation', 'Risk management controls validation', 'Risk assessment protocol evidence'],
          responsibleRole: ['Risk Management Director', 'NIST Compliance Specialist']
        },
        {
          id: 'standards-004',
          text: 'Are your international AI governance standards mapping and compliance tracking systems production-established?',
          points: 6,
          isBlocker: false,
          category: 'International Standards Mapping',
          evidenceRequired: ['International standards mapping documentation', 'Compliance tracking system validation', 'Standards mapping evidence'],
          responsibleRole: ['International Compliance Director', 'Standards Mapping Specialist']
        },
        {
          id: 'standards-005',
          text: 'Are your cross-jurisdictional regulatory alignment frameworks production-implemented for global deployment?',
          points: 5,
          isBlocker: false,
          category: 'Cross-Jurisdictional Alignment',
          evidenceRequired: ['Cross-jurisdictional framework documentation', 'Regulatory alignment validation', 'Global deployment evidence'],
          responsibleRole: ['Global Regulatory Affairs Director', 'Cross-Jurisdictional Specialist']
        },
        {
          id: 'standards-006',
          text: 'Are your standards compliance monitoring and reporting systems production-deployed with automated tracking?',
          points: 3,
          isBlocker: false,
          category: 'Standards Compliance Monitoring',
          evidenceRequired: ['Compliance monitoring system documentation', 'Automated tracking validation', 'Reporting system evidence'],
          responsibleRole: ['Compliance Monitoring Manager', 'Automated Tracking Specialist']
        },
        {
          id: 'standards-007',
          text: 'Are your standards training and certification programs production-established for all relevant personnel?',
          points: 2,
          isBlocker: false,
          category: 'Standards Training & Certification',
          evidenceRequired: ['Training program documentation', 'Certification validation', 'Personnel training evidence'],
          responsibleRole: ['Training Director', 'Certification Manager']
        }
      ]
    },
    {
      id: 'business-impact-roi-framework',
      name: 'Business Impact & ROI Assessment Framework',
      description: 'Comprehensive business impact analysis, ROI calculations, and financial risk assessment for pharmaceutical AI investments',
      icon: TrendingUp,
      maxScore: 42,
      isCritical: true,
      validator: 'Chief Financial Officer + Business Development Director',
      questions: [
        {
          id: 'roi-001',
          text: '🚨 PRODUCTION BLOCKER: Is your AI investment ROI calculation framework production-implemented with comprehensive cost-benefit analysis?',
          points: 8,
          isBlocker: true,
          category: 'ROI Framework',
          evidenceRequired: ['ROI calculation framework documentation', 'Cost-benefit analysis templates', 'Financial impact assessment reports'],
          responsibleRole: ['Chief Financial Officer', 'Business Development Director']
        },
        {
          id: 'roi-002',
          text: '🚨 PRODUCTION BLOCKER: Is your regulatory compliance cost avoidance calculation production-configured with fine and penalty risk assessment?',
          points: 7,
          isBlocker: true,
          category: 'Compliance Cost Avoidance',
          evidenceRequired: ['Regulatory fine risk assessment', 'Compliance cost avoidance calculations', 'Penalty mitigation documentation'],
          responsibleRole: ['Chief Compliance Officer', 'Financial Risk Manager']
        },
        {
          id: 'roi-003',
          text: '🚨 PRODUCTION BLOCKER: Is your time-to-market acceleration framework production-deployed with competitive advantage quantification?',
          points: 7,
          isBlocker: true,
          category: 'Time-to-Market Impact',
          evidenceRequired: ['Time-to-market analysis documentation', 'Competitive advantage assessment', 'Market opportunity quantification'],
          responsibleRole: ['Product Development Director', 'Market Access Manager']
        },
        {
          id: 'roi-004',
          text: 'Is your operational efficiency improvement calculation production-implemented with resource optimization metrics?',
          points: 6,
          isBlocker: false,
          category: 'Operational Efficiency',
          evidenceRequired: ['Operational efficiency metrics', 'Resource optimization calculations', 'Process improvement documentation'],
          responsibleRole: ['Operations Director', 'Process Improvement Manager']
        },
        {
          id: 'roi-005',
          text: 'Is your revenue protection and growth impact assessment production-configured with market expansion analysis?',
          points: 5,
          isBlocker: false,
          category: 'Revenue Impact',
          evidenceRequired: ['Revenue protection analysis', 'Market expansion assessment', 'Growth impact calculations'],
          responsibleRole: ['Revenue Manager', 'Business Development Director']
        },
        {
          id: 'roi-006',
          text: 'Is your risk mitigation value calculation production-implemented with liability and reputational risk assessment?',
          points: 4,
          isBlocker: false,
          category: 'Risk Mitigation Value',
          evidenceRequired: ['Risk mitigation calculations', 'Liability assessment documentation', 'Reputational risk analysis'],
          responsibleRole: ['Risk Management Director', 'Legal Counsel']
        },
        {
          id: 'roi-007',
          text: 'Is your competitive advantage quantification framework production-deployed with market positioning analysis?',
          points: 3,
          isBlocker: false,
          category: 'Competitive Advantage',
          evidenceRequired: ['Competitive advantage analysis', 'Market positioning documentation', 'Strategic value assessment'],
          responsibleRole: ['Strategy Director', 'Competitive Intelligence Manager']
        },
        {
          id: 'roi-008',
          text: 'Is your long-term strategic value assessment production-configured with future opportunity evaluation?',
          points: 2,
          isBlocker: false,
          category: 'Strategic Value',
          evidenceRequired: ['Strategic value assessment', 'Future opportunity analysis', 'Long-term impact evaluation'],
          responsibleRole: ['Strategic Planning Director', 'Future Opportunity Manager']
        }
      ]
    },
    {
      id: 'third-party-ai-risk-assessment',
      name: 'Third-Party AI Risk Assessment Framework',
      description: 'Comprehensive third-party AI vendor risk management, supply chain security, and contractual compliance assessment for pharmaceutical AI implementations',
      icon: Shield,
      maxScore: 38,
      isCritical: true,
      validator: 'Chief Risk Officer + Vendor Management Director',
      questions: [
        {
          id: 'third-party-001',
          text: '🚨 PRODUCTION BLOCKER: Is your third-party AI vendor risk assessment framework production-implemented with comprehensive due diligence protocols?',
          points: 7,
          isBlocker: true,
          category: 'Vendor Risk Assessment',
          evidenceRequired: ['Third-party vendor risk assessment framework', 'Due diligence protocols documentation', 'Vendor qualification criteria'],
          responsibleRole: ['Chief Risk Officer', 'Vendor Management Director']
        },
        {
          id: 'third-party-002',
          text: '🚨 PRODUCTION BLOCKER: Is your AI supply chain security validation production-deployed with vendor security compliance monitoring?',
          points: 7,
          isBlocker: true,
          category: 'Supply Chain Security',
          evidenceRequired: ['AI supply chain security validation protocols', 'Vendor security compliance monitoring', 'Supply chain risk assessment documentation'],
          responsibleRole: ['Chief Information Security Officer', 'Supply Chain Risk Manager']
        },
        {
          id: 'third-party-003',
          text: '🚨 PRODUCTION BLOCKER: Is your third-party AI service agreement compliance monitoring production-configured with contractual risk assessment?',
          points: 6,
          isBlocker: true,
          category: 'Contractual Compliance',
          evidenceRequired: ['Third-party AI service agreement templates', 'Contractual compliance monitoring system', 'Risk assessment documentation'],
          responsibleRole: ['Legal Counsel', 'Contract Management Director']
        },
        {
          id: 'third-party-004',
          text: 'Is your AI vendor data protection and privacy compliance assessment production-implemented with GDPR/HIPAA validation?',
          points: 5,
          isBlocker: false,
          category: 'Data Protection Compliance',
          evidenceRequired: ['Vendor data protection assessment protocols', 'Privacy compliance validation documentation', 'GDPR/HIPAA compliance verification'],
          responsibleRole: ['Data Protection Officer', 'Privacy Compliance Manager']
        },
        {
          id: 'third-party-005',
          text: 'Is your third-party AI model validation and testing framework production-deployed with independent verification protocols?',
          points: 4,
          isBlocker: false,
          category: 'Model Validation',
          evidenceRequired: ['Third-party AI model validation protocols', 'Independent testing framework documentation', 'Model verification procedures'],
          responsibleRole: ['AI Validation Director', 'Quality Assurance Manager']
        },
        {
          id: 'third-party-006',
          text: 'Is your AI vendor incident response and breach management framework production-configured with escalation protocols?',
          points: 3,
          isBlocker: false,
          category: 'Incident Response',
          evidenceRequired: ['Vendor incident response protocols', 'Breach management framework documentation', 'Escalation procedures'],
          responsibleRole: ['Incident Response Manager', 'Security Operations Director']
        },
        {
          id: 'third-party-007',
          text: 'Is your third-party AI vendor performance monitoring and SLA management production-implemented with continuous assessment?',
          points: 3,
          isBlocker: false,
          category: 'Performance Monitoring',
          evidenceRequired: ['Vendor performance monitoring protocols', 'SLA management documentation', 'Continuous assessment procedures'],
          responsibleRole: ['Vendor Performance Manager', 'SLA Management Director']
        },
        {
          id: 'third-party-008',
          text: 'Is your AI vendor exit strategy and data migration framework production-deployed with transition risk assessment?',
          points: 3,
          isBlocker: false,
          category: 'Exit Strategy',
          evidenceRequired: ['Vendor exit strategy documentation', 'Data migration framework protocols', 'Transition risk assessment procedures'],
          responsibleRole: ['Vendor Transition Manager', 'Data Migration Director']
        }
      ]
    },
    {
      id: 'advanced-data-governance-framework',
      name: 'Advanced Data Governance Framework',
      description: 'Comprehensive advanced data governance with data lineage tracking, quality management, lifecycle governance, and provenance validation for pharmaceutical AI systems',
      icon: Database,
      maxScore: 40,
      isCritical: true,
      validator: 'Chief Data Officer + Data Governance Director',
      questions: [
        {
          id: 'adv-data-001',
          text: '🚨 PRODUCTION BLOCKER: Is your data lineage and provenance tracking framework production-implemented with comprehensive data flow documentation?',
          points: 7,
          isBlocker: true,
          category: 'Data Lineage & Provenance',
          evidenceRequired: ['Data lineage tracking framework documentation', 'Data provenance validation protocols', 'Data flow documentation'],
          responsibleRole: ['Chief Data Officer', 'Data Lineage Manager']
        },
        {
          id: 'adv-data-002',
          text: '🚨 PRODUCTION BLOCKER: Is your advanced data quality management system production-deployed with automated quality monitoring and validation?',
          points: 7,
          isBlocker: true,
          category: 'Data Quality Management',
          evidenceRequired: ['Advanced data quality management system documentation', 'Automated quality monitoring protocols', 'Data quality validation procedures'],
          responsibleRole: ['Data Quality Director', 'Quality Assurance Manager']
        },
        {
          id: 'adv-data-003',
          text: '🚨 PRODUCTION BLOCKER: Is your data lifecycle governance framework production-configured with comprehensive data retention and disposal protocols?',
          points: 6,
          isBlocker: true,
          category: 'Data Lifecycle Governance',
          evidenceRequired: ['Data lifecycle governance framework documentation', 'Data retention and disposal protocols', 'Lifecycle management procedures'],
          responsibleRole: ['Data Governance Director', 'Data Lifecycle Manager']
        },
        {
          id: 'adv-data-004',
          text: 'Is your data catalog and metadata management system production-implemented with comprehensive data discovery and lineage mapping?',
          points: 5,
          isBlocker: false,
          category: 'Data Catalog & Metadata',
          evidenceRequired: ['Data catalog system documentation', 'Metadata management protocols', 'Data discovery and lineage mapping procedures'],
          responsibleRole: ['Data Catalog Manager', 'Metadata Management Director']
        },
        {
          id: 'adv-data-005',
          text: 'Is your data privacy impact assessment framework production-deployed with comprehensive privacy risk evaluation and mitigation?',
          points: 4,
          isBlocker: false,
          category: 'Privacy Impact Assessment',
          evidenceRequired: ['Data privacy impact assessment framework', 'Privacy risk evaluation protocols', 'Privacy mitigation procedures'],
          responsibleRole: ['Privacy Officer', 'Data Protection Manager']
        },
        {
          id: 'adv-data-006',
          text: 'Is your data access control and authorization framework production-configured with role-based access management and audit trails?',
          points: 3,
          isBlocker: false,
          category: 'Data Access Control',
          evidenceRequired: ['Data access control framework documentation', 'Role-based access management protocols', 'Audit trail procedures'],
          responsibleRole: ['Access Control Manager', 'Security Operations Director']
        },
        {
          id: 'adv-data-007',
          text: 'Is your data integration and interoperability framework production-implemented with standardized data exchange protocols?',
          points: 4,
          isBlocker: false,
          category: 'Data Integration & Interoperability',
          evidenceRequired: ['Data integration framework documentation', 'Interoperability protocols', 'Data exchange standards'],
          responsibleRole: ['Data Integration Director', 'Interoperability Manager']
        },
        {
          id: 'adv-data-008',
          text: 'Is your data governance monitoring and compliance framework production-deployed with continuous governance assessment and reporting?',
          points: 4,
          isBlocker: false,
          category: 'Governance Monitoring & Compliance',
          evidenceRequired: ['Data governance monitoring framework', 'Compliance assessment protocols', 'Governance reporting procedures'],
          responsibleRole: ['Governance Monitoring Director', 'Compliance Assessment Manager']
        }
      ]
    },
    {
      id: 'ai-system-interoperability-framework',
      name: 'AI System Interoperability Framework',
      description: 'Comprehensive AI system interoperability, integration standards, API management, and cross-system communication frameworks for pharmaceutical AI ecosystems',
      icon: Cog,
      maxScore: 35,
      isCritical: true,
      validator: 'Chief Technology Officer + Integration Architecture Director',
      questions: [
        {
          id: 'interop-001',
          text: '🚨 PRODUCTION BLOCKER: Is your AI system interoperability framework production-implemented with standardized integration protocols and cross-system communication standards?',
          points: 6,
          isBlocker: true,
          category: 'System Interoperability',
          evidenceRequired: ['AI system interoperability framework documentation', 'Standardized integration protocols', 'Cross-system communication standards'],
          responsibleRole: ['Chief Technology Officer', 'Integration Architecture Director']
        },
        {
          id: 'interop-002',
          text: '🚨 PRODUCTION BLOCKER: Is your AI API management and governance framework production-deployed with comprehensive API lifecycle management and security protocols?',
          points: 6,
          isBlocker: true,
          category: 'API Management & Governance',
          evidenceRequired: ['AI API management framework documentation', 'API lifecycle management protocols', 'API security and governance standards'],
          responsibleRole: ['API Management Director', 'Security Architecture Manager']
        },
        {
          id: 'interop-003',
          text: '🚨 PRODUCTION BLOCKER: Is your AI system data exchange and transformation framework production-configured with standardized data formats and validation protocols?',
          points: 5,
          isBlocker: true,
          category: 'Data Exchange & Transformation',
          evidenceRequired: ['AI system data exchange framework', 'Standardized data format documentation', 'Data transformation and validation protocols'],
          responsibleRole: ['Data Architecture Director', 'Integration Engineering Manager']
        },
        {
          id: 'interop-004',
          text: 'Is your AI system monitoring and observability framework production-implemented with comprehensive system health monitoring and performance tracking?',
          points: 4,
          isBlocker: false,
          category: 'System Monitoring & Observability',
          evidenceRequired: ['AI system monitoring framework documentation', 'System health monitoring protocols', 'Performance tracking and observability standards'],
          responsibleRole: ['System Monitoring Director', 'Performance Engineering Manager']
        },
        {
          id: 'interop-005',
          text: 'Is your AI system security and access control framework production-deployed with comprehensive authentication and authorization protocols?',
          points: 4,
          isBlocker: false,
          category: 'Security & Access Control',
          evidenceRequired: ['AI system security framework documentation', 'Authentication and authorization protocols', 'Access control and security standards'],
          responsibleRole: ['Security Architecture Director', 'Access Control Manager']
        },
        {
          id: 'interop-006',
          text: 'Is your AI system versioning and compatibility management framework production-configured with backward compatibility and migration protocols?',
          points: 3,
          isBlocker: false,
          category: 'Versioning & Compatibility',
          evidenceRequired: ['AI system versioning framework', 'Backward compatibility protocols', 'Migration and upgrade procedures'],
          responsibleRole: ['System Architecture Director', 'Compatibility Management Manager']
        },
        {
          id: 'interop-007',
          text: 'Is your AI system error handling and resilience framework production-implemented with comprehensive fault tolerance and recovery protocols?',
          points: 3,
          isBlocker: false,
          category: 'Error Handling & Resilience',
          evidenceRequired: ['AI system error handling framework', 'Fault tolerance protocols', 'Recovery and resilience procedures'],
          responsibleRole: ['System Reliability Director', 'Error Handling Manager']
        },
        {
          id: 'interop-008',
          text: 'Is your AI system documentation and knowledge management framework production-deployed with comprehensive integration documentation and developer resources?',
          points: 4,
          isBlocker: false,
          category: 'Documentation & Knowledge Management',
          evidenceRequired: ['AI system documentation framework', 'Integration documentation standards', 'Developer resource and knowledge management protocols'],
          responsibleRole: ['Technical Documentation Director', 'Knowledge Management Manager']
        }
      ]
    },
    {
      id: 'final-integration-validation-framework',
      name: 'Final Integration & Validation Framework',
      description: 'Comprehensive final integration validation, automated testing frameworks, system validation protocols, and end-to-end compliance verification for pharmaceutical AI systems',
      icon: CheckCircle,
      maxScore: 30,
      isCritical: true,
      validator: 'Chief Quality Officer + System Validation Director',
      questions: [
        {
          id: 'final-001',
          text: '🚨 PRODUCTION BLOCKER: Is your automated testing and validation framework production-implemented with comprehensive end-to-end testing protocols and automated compliance verification?',
          points: 6,
          isBlocker: true,
          category: 'Automated Testing & Validation',
          evidenceRequired: ['Automated testing framework documentation', 'End-to-end testing protocols', 'Automated compliance verification systems'],
          responsibleRole: ['Chief Quality Officer', 'System Validation Director']
        },
        {
          id: 'final-002',
          text: '🚨 PRODUCTION BLOCKER: Is your system integration validation framework production-deployed with comprehensive cross-system integration testing and validation protocols?',
          points: 5,
          isBlocker: true,
          category: 'System Integration Validation',
          evidenceRequired: ['System integration validation framework', 'Cross-system integration testing protocols', 'Integration validation documentation'],
          responsibleRole: ['Integration Testing Director', 'System Validation Manager']
        },
        {
          id: 'final-003',
          text: '🚨 PRODUCTION BLOCKER: Is your compliance verification and audit framework production-configured with comprehensive regulatory compliance testing and audit trail validation?',
          points: 5,
          isBlocker: true,
          category: 'Compliance Verification & Audit',
          evidenceRequired: ['Compliance verification framework documentation', 'Regulatory compliance testing protocols', 'Audit trail validation systems'],
          responsibleRole: ['Compliance Verification Director', 'Audit Trail Manager']
        },
        {
          id: 'final-004',
          text: 'Is your performance validation and benchmarking framework production-implemented with comprehensive system performance testing and benchmark validation?',
          points: 4,
          isBlocker: false,
          category: 'Performance Validation & Benchmarking',
          evidenceRequired: ['Performance validation framework documentation', 'System performance testing protocols', 'Benchmark validation procedures'],
          responsibleRole: ['Performance Validation Director', 'Benchmark Testing Manager']
        },
        {
          id: 'final-005',
          text: 'Is your security validation and penetration testing framework production-deployed with comprehensive security testing and vulnerability assessment protocols?',
          points: 4,
          isBlocker: false,
          category: 'Security Validation & Penetration Testing',
          evidenceRequired: ['Security validation framework documentation', 'Penetration testing protocols', 'Vulnerability assessment procedures'],
          responsibleRole: ['Security Validation Director', 'Penetration Testing Manager']
        },
        {
          id: 'final-006',
          text: 'Is your data integrity validation and backup testing framework production-configured with comprehensive data validation and backup verification protocols?',
          points: 3,
          isBlocker: false,
          category: 'Data Integrity & Backup Validation',
          evidenceRequired: ['Data integrity validation framework', 'Backup testing protocols', 'Data validation procedures'],
          responsibleRole: ['Data Integrity Director', 'Backup Validation Manager']
        },
        {
          id: 'final-007',
          text: 'Is your user acceptance testing and training validation framework production-implemented with comprehensive user testing and training verification protocols?',
          points: 3,
          isBlocker: false,
          category: 'User Acceptance & Training Validation',
          evidenceRequired: ['User acceptance testing framework', 'Training validation protocols', 'User testing procedures'],
          responsibleRole: ['User Acceptance Testing Director', 'Training Validation Manager']
        }
      ]
    }
  ];

  const calculateSectionScore = (section: any) => {
    return section.questions.reduce((total: number, question: any) => {
      const response = responses[question.id];
      if (response?.completed && response?.value === 'yes') {
        return total + question.points;
      }
      return total;
    }, 0);
  };

  const calculateTotalScore = () => {
    return assessmentSections.reduce((total, section) => total + calculateSectionScore(section), 0);
  };

  const calculateMaxScore = () => {
    return assessmentSections.reduce((total, section) => total + section.maxScore, 0);
  };

  const getTotalCompletion = () => {
    const totalQuestions = assessmentSections.reduce((total, section) => total + section.questions.length, 0);
    const completedQuestions = assessmentSections.reduce((total, section) => 
      total + section.questions.filter((q: any) => responses[q.id]?.completed).length, 0);
    return Math.round((completedQuestions / totalQuestions) * 100);
  };

  const totalScore = calculateTotalScore();
  const maxScore = calculateMaxScore();
  const completion = getTotalCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-compliance-50 via-white to-compliance-100">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Enhanced Header with Stats */}
        <div className="bg-white rounded-2xl shadow-lg border border-compliance-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-compliance-900 mb-2">
                🎯 Complete Assessment View
              </h1>
              <p className="text-lg text-compliance-600">
                Comprehensive pharmaceutical AI production readiness evaluation
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant="outline" className="bg-compliance-100 text-compliance-800 border-compliance-300">
                  <Target className="h-4 w-4 mr-1" />
                  {assessmentSections.reduce((total, section) => total + section.questions.length, 0)} Questions
                </Badge>
                <Badge variant="outline" className="bg-compliance-100 text-compliance-800 border-compliance-300">
                  <Award className="h-4 w-4 mr-1" />
                  4 Critical Sections
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
              <Button onClick={onSave} size="lg" className="bg-compliance-600 hover:bg-compliance-700 text-white px-6 py-3">
                <Save className="h-5 w-5 mr-2" />
                Save All Responses
              </Button>
              <div className="text-right">
                <div className="text-2xl font-bold text-compliance-900">{completion}%</div>
                <div className="text-sm text-compliance-600">Complete</div>
              </div>
            </div>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-compliance-700">Overall Progress</span>
              <span className="text-sm text-compliance-600">{totalScore}/{maxScore} points</span>
            </div>
            <div className="relative">
              <div className="h-3 bg-compliance-100 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-compliance-500 to-compliance-600 rounded-full h-3 transition-all duration-500" 
                     style={{width: `${completion}%`}}></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-compliance-600">Production Readiness Score</span>
              <span className="font-semibold text-compliance-900">
                {completion >= 90 ? '🚀 Production Ready' : 
                 completion >= 70 ? '⚡ Near Ready' : 
                 completion >= 50 ? '⚠️ Needs Work' : '🚨 Critical Issues'}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Section Overview Cards */}
        <div className="bg-white rounded-2xl shadow-lg border border-compliance-200 p-6">
          <h2 className="text-2xl font-bold text-compliance-900 mb-6 flex items-center">
            <Star className="h-6 w-6 mr-2 text-compliance-600" />
            Assessment Sections Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessmentSections.map((section) => {
              const Icon = section.icon;
              const sectionScore = calculateSectionScore(section);
              const sectionCompletion = Math.round((sectionScore / section.maxScore) * 100);
              const isActive = activeSection === section.id;
              
              return (
                <Card 
                  key={section.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                    isActive ? 'border-compliance-500 shadow-lg bg-compliance-50' : 'border-compliance-200 hover:border-compliance-300'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-compliance-600' : 'bg-compliance-100'}`}>
                        <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-compliance-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-compliance-900 text-sm leading-tight">
                          {section.name}
                        </h3>
                        {section.isCritical && (
                          <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Critical
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-compliance-600">Progress</span>
                        <span className="text-sm font-medium text-compliance-900">{sectionScore}/{section.maxScore}</span>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-compliance-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-compliance-400 to-compliance-600 rounded-full transition-all duration-500"
                            style={{width: `${sectionCompletion}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-compliance-600">{sectionCompletion}% Complete</span>
                        <span className="font-medium text-compliance-900">
                          {sectionCompletion >= 90 ? '✅' : 
                           sectionCompletion >= 70 ? '⚡' : 
                           sectionCompletion >= 50 ? '⚠️' : '🚨'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Assessment Sections */}
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-4">
            {assessmentSections.map((section) => {
              const Icon = section.icon;
              const sectionScore = calculateSectionScore(section);
              const sectionCompletion = Math.round((sectionScore / section.maxScore) * 100);
              
              return (
                <TabsTrigger key={section.id} value={section.id} className="flex flex-col items-center p-4">
                  <Icon className="h-5 w-5 mb-2" />
                  <span className="text-xs text-center font-medium">
                    {section.name.split(' ')[0]}
                  </span>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-xs font-bold">{sectionScore}/{section.maxScore}</span>
                    <span className="text-xs text-gray-500">({sectionCompletion}%)</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {assessmentSections.map((section) => {
            const Icon = section.icon;
            const sectionScore = calculateSectionScore(section);
            
            return (
              <TabsContent key={section.id} value={section.id} className="space-y-6 mt-6">
                <Card className="border-2 border-compliance-200">
                  <CardHeader className="bg-compliance-50">
                    <CardTitle className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-compliance-600" />
                      <span className="text-xl">{section.name}</span>
                      {section.isCritical && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Critical
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-base">{section.description}</CardDescription>
                    <div className="flex items-center space-x-6 text-sm text-compliance-600 mt-4">
                      <span className="flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Validator: {section.validator}
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Max Score: {section.maxScore} points
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Current Score: {sectionScore} points
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    {section.questions.map((question, index) => (
                      <div key={question.id} className="border border-compliance-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="space-y-4">
                          {/* Question Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Question {index + 1}
                                </Badge>
                                <Badge className={`text-xs ${question.isBlocker ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {question.isBlocker ? '🚨 Production Blocker' : question.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs font-semibold">
                                  {question.points} points
                                </Badge>
                              </div>
                              <h3 className="text-lg font-semibold text-compliance-900 leading-relaxed">
                                {question.text}
                              </h3>
                            </div>
                          </div>

                          {/* Evidence Required */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-compliance-700 flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              Evidence Required:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {question.evidenceRequired.map((evidence, idx) => (
                                <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                  {evidence}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Responsible Roles */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-compliance-700 flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              Responsible Roles:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {question.responsibleRole.map((role, idx) => (
                                <Badge key={idx} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Response Options */}
                          <div className="space-y-4 pt-4 border-t border-compliance-200">
                            <h4 className="text-sm font-medium text-compliance-700">Response:</h4>
                            <RadioGroup
                              key={`radio-${question.id}-${responses[question.id]?.value || 'none'}`}
                              value={responses[question.id]?.value || ''}
                              onValueChange={(newValue) => {
                                console.log(`Radio changed for ${question.id}:`, newValue);
                                onResponseChange(question.id, {
                                  value: newValue,
                                  completed: true,
                                  timestamp: new Date().toISOString()
                                });
                              }}
                            >
                              <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                                <RadioGroupItem 
                                  value="yes" 
                                  id={`${question.id}-yes`}
                                />
                                <Label 
                                  htmlFor={`${question.id}-yes`}
                                  className="cursor-pointer flex items-center space-x-2"
                                >
                                  <span className="text-xl">✅</span>
                                  <span className="font-semibold text-green-700 text-lg">
                                    Yes - Fully Implemented
                                  </span>
                                </Label>
                              </div>
                              
                              <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer">
                                <RadioGroupItem 
                                  value="no" 
                                  id={`${question.id}-no`}
                                />
                                <Label 
                                  htmlFor={`${question.id}-no`}
                                  className="cursor-pointer flex items-center space-x-2"
                                >
                                  <span className="text-xl">❌</span>
                                  <span className="font-semibold text-red-700 text-lg">
                                    No - Not Implemented
                                  </span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default CompleteAssessmentView;