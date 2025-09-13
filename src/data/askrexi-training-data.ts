/**
 * AskRexi Training Dataset - ComplianceIQ System
 * Comprehensive Q&A training data for regulatory compliance assistant
 */

export interface TrainingQuestion {
  id: string;
  question: string;
  variations: string[];
  category: 'regulatory' | 'assessment' | 'analytics' | 'general';
  subcategory: string;
  answer: string;
  actionItems: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  sources: string[];
  keywords: string[];
  therapeuticAreas?: string[];
  aiModelTypes?: string[];
  deploymentScenarios?: string[];
  personas?: string[];
  tags: string[];
}

export const ASKREXI_TRAINING_DATA: TrainingQuestion[] = [
  // REGULATORY INTELLIGENCE - FDA Guidelines
  {
    id: 'reg-001',
    question: 'What are the latest FDA guidelines for AI in healthcare?',
    variations: [
      'FDA AI healthcare guidelines',
      'What does FDA say about AI in medical devices?',
      'FDA regulations for artificial intelligence in healthcare',
      'Latest FDA guidance on AI medical applications',
      'FDA requirements for AI in healthcare'
    ],
    category: 'regulatory',
    subcategory: 'FDA Guidelines',
    answer: `The FDA has issued comprehensive guidelines for AI in healthcare through several key documents:

**Key FDA Guidelines:**
• **FDA AI/ML Software as Medical Device Action Plan (2021)** - Framework for regulating AI/ML in medical devices
• **Good Machine Learning Practice (GMLP) for Medical Device Development** - Best practices for AI/ML development
• **Clinical Decision Support Software Guidance** - Requirements for AI-powered clinical decision support tools
• **Software as Medical Device (SaMD) Guidelines** - Regulatory framework for AI software in medical applications

**Core Requirements:**
• **Algorithm Transparency** - Clear documentation of AI model development and validation
• **Clinical Validation** - Rigorous testing in real-world clinical settings
• **Risk Management** - Comprehensive risk assessment and mitigation strategies
• **Data Quality** - High-quality, representative training and validation datasets
• **Continuous Monitoring** - Ongoing performance monitoring and model updates

**Impact on Pharmaceutical AI:**
• AI models used in drug discovery must meet FDA validation standards
• Clinical trial AI tools require premarket approval or clearance
• Real-world evidence from AI systems can support regulatory submissions`,
    actionItems: [
      'Review FDA AI/ML Action Plan for your specific use case',
      'Implement GMLP principles in your AI development process',
      'Conduct clinical validation studies for AI models',
      'Establish continuous monitoring protocols',
      'Document algorithm transparency and explainability'
    ],
    impactLevel: 'high',
    sources: ['FDA AI/ML Action Plan', 'GMLP Guidelines', 'SaMD Framework'],
    keywords: ['FDA', 'AI', 'healthcare', 'medical devices', 'guidelines', 'regulations'],
    therapeuticAreas: ['All'],
    aiModelTypes: ['All'],
    deploymentScenarios: ['Clinical Decision Support', 'Drug Discovery', 'Medical Imaging'],
    personas: ['Regulatory Affairs', 'Clinical', 'Data Science', 'Executive'],
    tags: ['FDA', 'AI Guidelines', 'Medical Devices', 'Healthcare AI']
  },

  {
    id: 'reg-002',
    question: 'What are the EMA requirements for AI in pharmaceutical development?',
    variations: [
      'EMA AI pharmaceutical guidelines',
      'European Medicines Agency AI requirements',
      'EMA regulations for AI in drug development',
      'EU AI guidelines for pharma',
      'EMA guidance on artificial intelligence'
    ],
    category: 'regulatory',
    subcategory: 'EMA Guidelines',
    answer: `The European Medicines Agency (EMA) has established comprehensive requirements for AI in pharmaceutical development:

**Key EMA Guidelines:**
• **EMA Reflection Paper on AI in Medicinal Product Development** - Framework for AI use in drug development
• **ICH E6(R3) Good Clinical Practice** - Updated guidelines including AI considerations
• **EU AI Act** - Comprehensive AI regulation affecting pharmaceutical applications
• **GDPR Compliance** - Data protection requirements for AI systems

**Core Requirements:**
• **Algorithmic Accountability** - Clear responsibility for AI system outcomes
• **Data Governance** - Robust data management and protection protocols
• **Transparency and Explainability** - Ability to explain AI decision-making processes
• **Risk-Based Approach** - Risk assessment based on AI system impact and complexity
• **Human Oversight** - Human-in-the-loop requirements for critical decisions

**Pharmaceutical AI Applications:**
• Drug discovery and development AI tools
• Clinical trial optimization and patient selection
• Pharmacovigilance and safety monitoring
• Manufacturing process optimization
• Real-world evidence generation`,
    actionItems: [
      'Review EMA Reflection Paper on AI in Medicinal Product Development',
      'Ensure GDPR compliance for AI data processing',
      'Implement algorithmic accountability frameworks',
      'Establish human oversight protocols for AI decisions',
      'Conduct risk assessments for AI applications'
    ],
    impactLevel: 'high',
    sources: ['EMA Reflection Paper', 'EU AI Act', 'ICH E6(R3)', 'GDPR'],
    keywords: ['EMA', 'EU', 'AI', 'pharmaceutical', 'drug development', 'regulations'],
    therapeuticAreas: ['All'],
    aiModelTypes: ['All'],
    deploymentScenarios: ['Drug Discovery', 'Clinical Trials', 'Manufacturing', 'Pharmacovigilance'],
    personas: ['Regulatory Affairs', 'Clinical', 'Data Science', 'Executive'],
    tags: ['EMA', 'EU Regulations', 'Pharmaceutical AI', 'Drug Development']
  },

  {
    id: 'reg-003',
    question: 'What are the ICH requirements for AI in clinical trials?',
    variations: [
      'ICH AI clinical trial guidelines',
      'International Council for Harmonisation AI requirements',
      'ICH E6 AI considerations',
      'ICH guidelines for AI in clinical research',
      'ICH standards for artificial intelligence'
    ],
    category: 'regulatory',
    subcategory: 'ICH Guidelines',
    answer: `The International Council for Harmonisation (ICH) has updated its guidelines to address AI in clinical trials:

**Key ICH Guidelines:**
• **ICH E6(R3) Good Clinical Practice** - Updated GCP guidelines with AI considerations
• **ICH E8(R1) General Considerations for Clinical Studies** - AI integration in study design
• **ICH E9(R1) Statistical Principles for Clinical Trials** - AI and machine learning in statistical analysis
• **ICH E17 Multi-Regional Clinical Trials** - AI considerations for global trials

**Core Requirements:**
• **Data Integrity** - Ensuring AI-generated data meets GCP standards
• **Protocol Compliance** - AI systems must align with approved study protocols
• **Quality Assurance** - Comprehensive QA programs for AI systems
• **Documentation** - Detailed documentation of AI system development and validation
• **Risk Management** - Risk assessment and mitigation for AI applications

**AI Applications in Clinical Trials:**
• Patient recruitment and screening
• Protocol optimization and adaptive trial design
• Data collection and monitoring
• Safety signal detection
• Statistical analysis and reporting`,
    actionItems: [
      'Review ICH E6(R3) for AI-specific GCP requirements',
      'Implement data integrity controls for AI systems',
      'Establish QA programs for AI applications',
      'Document AI system validation and performance',
      'Conduct risk assessments for AI in clinical trials'
    ],
    impactLevel: 'high',
    sources: ['ICH E6(R3)', 'ICH E8(R1)', 'ICH E9(R1)', 'ICH E17'],
    keywords: ['ICH', 'clinical trials', 'GCP', 'AI', 'machine learning', 'statistics'],
    therapeuticAreas: ['All'],
    aiModelTypes: ['All'],
    deploymentScenarios: ['Clinical Trials', 'Patient Recruitment', 'Data Analysis'],
    personas: ['Clinical', 'Regulatory Affairs', 'Data Science', 'Statistics'],
    tags: ['ICH', 'Clinical Trials', 'GCP', 'AI Validation']
  },

  // ASSESSMENT SUPPORT - Data Governance
  {
    id: 'assess-001',
    question: 'How do I complete the data governance assessment section?',
    variations: [
      'Data governance section requirements',
      'How to fill out data governance assessment',
      'Data governance compliance checklist',
      'What is needed for data governance section',
      'Data governance assessment guidance'
    ],
    category: 'assessment',
    subcategory: 'Data Governance',
    answer: `The Data Governance section is critical for AI compliance. Here's how to complete it effectively:

**Section Overview:**
The Data Governance section evaluates your organization's data management practices, quality controls, and compliance frameworks that support AI system development and deployment.

**Key Requirements:**
• **Data Quality Framework** - Established processes for data validation, cleaning, and quality assurance
• **Data Lineage Documentation** - Clear tracking of data sources, transformations, and usage
• **Access Controls** - Role-based access management and data security protocols
• **Data Retention Policies** - Defined policies for data storage, archival, and disposal
• **Privacy Compliance** - GDPR, HIPAA, and other privacy regulation compliance

**Evidence Required:**
• Data governance policy documents
• Data quality assessment reports
• Data lineage documentation
• Access control matrices
• Privacy impact assessments
• Data retention schedules
• Training records for data handling staff

**Common Challenges:**
• Incomplete data lineage documentation
• Lack of formal data quality processes
• Insufficient access control documentation
• Missing privacy compliance assessments`,
    actionItems: [
      'Review and update data governance policies',
      'Document complete data lineage for all AI training data',
      'Implement formal data quality assessment processes',
      'Establish role-based access control matrices',
      'Conduct privacy impact assessments for AI systems',
      'Train staff on data governance requirements'
    ],
    impactLevel: 'high',
    sources: ['Data Governance Framework', 'GDPR Guidelines', 'HIPAA Requirements'],
    keywords: ['data governance', 'data quality', 'data lineage', 'access controls', 'privacy'],
    therapeuticAreas: ['All'],
    aiModelTypes: ['All'],
    deploymentScenarios: ['All'],
    personas: ['Data Science', 'IT', 'Compliance', 'Legal'],
    tags: ['Data Governance', 'Data Quality', 'Privacy', 'Compliance']
  },

  {
    id: 'assess-002',
    question: 'What evidence is required for model validation?',
    variations: [
      'Model validation evidence requirements',
      'What documents needed for AI model validation',
      'Model validation documentation checklist',
      'Evidence for AI model validation',
      'Model validation requirements'
    ],
    category: 'assessment',
    subcategory: 'Model Validation',
    answer: `Model validation requires comprehensive evidence to demonstrate AI system reliability and performance:

**Core Validation Evidence:**
• **Model Development Documentation** - Complete documentation of model architecture, training process, and hyperparameters
• **Training Data Documentation** - Data sources, preprocessing steps, and quality assessments
• **Validation Results** - Performance metrics, accuracy measures, and validation test results
• **Bias Assessment** - Fairness analysis and bias mitigation strategies
• **Robustness Testing** - Stress testing and edge case validation results

**Required Documents:**
• Model specification and architecture diagrams
• Training dataset documentation and quality reports
• Validation test plans and results
• Performance benchmarking reports
• Bias and fairness assessment reports
• Robustness and stress testing results
• Model interpretability and explainability documentation
• Validation sign-off from qualified personnel

**Performance Metrics:**
• Accuracy, precision, recall, and F1 scores
• Confusion matrices and ROC curves
• Cross-validation results
• Performance on hold-out test sets
• Real-world performance monitoring data

**Regulatory Considerations:**
• FDA validation requirements for medical AI
• EMA guidelines for AI in pharmaceutical applications
• ICH requirements for AI in clinical trials
• Industry-specific validation standards`,
    actionItems: [
      'Document complete model development process',
      'Conduct comprehensive validation testing',
      'Perform bias and fairness assessments',
      'Implement robustness testing protocols',
      'Establish performance monitoring systems',
      'Obtain validation sign-off from qualified personnel'
    ],
    impactLevel: 'critical',
    sources: ['FDA AI/ML Guidelines', 'EMA Reflection Paper', 'ICH E6(R3)'],
    keywords: ['model validation', 'AI validation', 'performance metrics', 'bias assessment', 'robustness'],
    therapeuticAreas: ['All'],
    aiModelTypes: ['All'],
    deploymentScenarios: ['All'],
    personas: ['Data Science', 'Regulatory Affairs', 'Quality Assurance'],
    tags: ['Model Validation', 'AI Validation', 'Performance Testing', 'Bias Assessment']
  },

  // ANALYTICS & REPORTING
  {
    id: 'analytics-001',
    question: 'What is our current compliance score?',
    variations: [
      'Current compliance score',
      'How are we performing on compliance',
      'Our compliance rating',
      'Compliance score dashboard',
      'Overall compliance performance'
    ],
    category: 'analytics',
    subcategory: 'Compliance Scoring',
    answer: `Your current compliance score provides a comprehensive view of your organization's AI readiness:

**Overall Compliance Score: [Dynamic - Retrieved from Database]**

**Score Breakdown by Category:**
• **Regulatory Compliance**: [Score]% - Adherence to FDA, EMA, and ICH guidelines
• **Data Governance**: [Score]% - Data quality, lineage, and privacy compliance
• **Model Validation**: [Score]% - AI model development and validation practices
• **Risk Management**: [Score]% - Risk assessment and mitigation strategies
• **Quality Assurance**: [Score]% - QA processes and documentation
• **Training & Competency**: [Score]% - Staff training and competency programs

**Key Performance Indicators:**
• **Production Readiness**: [Percentage]% of systems ready for production
• **Critical Blockers**: [Number] critical issues requiring immediate attention
• **Completion Rate**: [Percentage]% of assessment sections completed
• **Trend Analysis**: [Improvement/Decline] over the last [time period]

**Benchmarking:**
• **Industry Average**: [Score]% (Pharmaceutical AI)
• **Top Performers**: [Score]% (90th percentile)
• **Your Ranking**: [Position] out of [Total] organizations

**Priority Areas for Improvement:**
• [Area 1] - [Specific recommendations]
• [Area 2] - [Specific recommendations]
• [Area 3] - [Specific recommendations]`,
    actionItems: [
      'Review detailed score breakdown by category',
      'Address critical blockers immediately',
      'Focus on lowest-scoring areas for improvement',
      'Compare performance against industry benchmarks',
      'Develop improvement action plans for priority areas'
    ],
    impactLevel: 'medium',
    sources: ['ComplianceIQ Analytics Dashboard', 'Assessment Results', 'Industry Benchmarks'],
    keywords: ['compliance score', 'performance', 'benchmarking', 'analytics', 'dashboard'],
    therapeuticAreas: ['All'],
    aiModelTypes: ['All'],
    deploymentScenarios: ['All'],
    personas: ['Executive', 'Compliance', 'Quality Assurance'],
    tags: ['Compliance Score', 'Analytics', 'Performance', 'Benchmarking']
  },

  {
    id: 'analytics-002',
    question: 'How are we performing compared to industry benchmarks?',
    variations: [
      'Industry benchmark comparison',
      'How do we compare to other companies',
      'Benchmark performance analysis',
      'Industry comparison metrics',
      'Competitive analysis results'
    ],
    category: 'analytics',
    subcategory: 'Benchmarking',
    answer: `Your organization's performance compared to industry benchmarks shows:

**Overall Benchmark Comparison:**
• **Your Score**: [Score]% vs **Industry Average**: [Score]%
• **Performance Level**: [Above/Below/At] industry average
• **Industry Ranking**: [Position] out of [Total] organizations
• **Percentile**: [Percentile]th percentile

**Category-by-Category Comparison:**
• **Regulatory Compliance**: [Your Score]% vs [Industry]% - [Above/Below/At] average
• **Data Governance**: [Your Score]% vs [Industry]% - [Above/Below/At] average
• **Model Validation**: [Your Score]% vs [Industry]% - [Above/Below/At] average
• **Risk Management**: [Your Score]% vs [Industry]% - [Above/Below/At] average
• **Quality Assurance**: [Your Score]% vs [Industry]% - [Above/Below/At] average

**Industry Segments:**
• **Large Pharma (>$10B revenue)**: [Average Score]%
• **Mid-size Pharma ($1B-$10B revenue)**: [Average Score]%
• **Biotech/Startup (<$1B revenue)**: [Average Score]%
• **Your Segment**: [Your Score]% vs [Segment Average]%

**Top Performers Analysis:**
• **90th Percentile Score**: [Score]%
• **Key Differentiators**: [Top 3 areas where leaders excel]
• **Best Practices**: [Specific practices from top performers]

**Improvement Opportunities:**
• **Quick Wins**: [Areas where small improvements yield big gains]
• **Strategic Initiatives**: [Long-term improvements for competitive advantage]
• **Resource Allocation**: [Recommended focus areas based on ROI]`,
    actionItems: [
      'Analyze category-by-category benchmark performance',
      'Identify quick wins for immediate improvement',
      'Study best practices from top performers',
      'Develop strategic initiatives for competitive advantage',
      'Allocate resources based on improvement ROI'
    ],
    impactLevel: 'medium',
    sources: ['Industry Benchmark Database', 'ComplianceIQ Analytics', 'Peer Comparison Data'],
    keywords: ['benchmarking', 'industry comparison', 'competitive analysis', 'performance metrics'],
    therapeuticAreas: ['All'],
    aiModelTypes: ['All'],
    deploymentScenarios: ['All'],
    personas: ['Executive', 'Strategy', 'Compliance'],
    tags: ['Benchmarking', 'Industry Comparison', 'Competitive Analysis', 'Performance']
  },

  // Continue with more questions... (This is a sample - the full dataset would have 1000+ questions)
  
  // GENERAL COMPLIANCE
  {
    id: 'general-001',
    question: 'What can AskRexi help me with?',
    variations: [
      'What does AskRexi do?',
      'How can AskRexi assist me?',
      'AskRexi capabilities',
      'What questions can I ask AskRexi?',
      'AskRexi help and support'
    ],
    category: 'general',
    subcategory: 'Capabilities',
    answer: `AskRexi is your intelligent regulatory compliance assistant, designed to help you navigate the complex world of pharmaceutical AI compliance. Here's what I can assist you with:

**Regulatory Intelligence:**
• FDA, EMA, and ICH guidelines and their impact on your organization
• Latest regulatory updates and effective dates
• Therapeutic area-specific compliance requirements
• Regulatory pathway guidance for AI applications

**Assessment Support:**
• Guidance on specific assessment questions and requirements
• Evidence requirements and documentation needs
• Production blocker identification and resolution
• Section-specific compliance guidance and best practices

**Analytics & Reporting:**
• Current compliance scores and performance trends
• Industry benchmark comparisons and competitive analysis
• Gap analysis and improvement recommendations
• Risk assessment and mitigation strategies

**Compliance Guidance:**
• What your organization needs to do to meet requirements
• Actionable steps and implementation roadmaps
• Resource allocation recommendations
• Training and competency development guidance

**Key Features:**
• Context-aware responses based on your company, therapeutic area, and role
• Real-time access to the latest regulatory intelligence
• Structured responses with clear action items and impact levels
• Source citations and links to detailed information
• Related question suggestions for deeper exploration`,
    actionItems: [
      'Ask specific questions about regulations, assessments, or analytics',
      'Use context about your company and therapeutic area for personalized responses',
      'Follow up with related questions to dive deeper into topics',
      'Access source links for detailed regulatory information',
      'Use suggested action items to improve your compliance posture'
    ],
    impactLevel: 'low',
    sources: ['AskRexi User Guide', 'ComplianceIQ Documentation'],
    keywords: ['AskRexi', 'capabilities', 'help', 'assistance', 'support'],
    therapeuticAreas: ['All'],
    aiModelTypes: ['All'],
    deploymentScenarios: ['All'],
    personas: ['All'],
    tags: ['General', 'Help', 'Capabilities', 'Support']
  }
];

// Non-contextual question patterns to filter out
export const NON_CONTEXTUAL_PATTERNS = [
  // Weather
  /weather|temperature|rain|snow|sunny|cloudy|forecast|climate/i,
  
  // Sports
  /football|soccer|basketball|baseball|tennis|golf|sports|game|match|team|player/i,
  
  // Entertainment
  /movie|film|actor|actress|celebrity|music|song|band|concert|entertainment/i,
  
  // News/Politics
  /politics|election|president|government|news|current events|trump|biden/i,
  
  // Personal/Health
  /personal health|medical advice|doctor|symptoms|illness|disease|treatment/i,
  
  // Technology (non-AI)
  /smartphone|phone|computer|laptop|gaming|video game|social media|facebook|twitter/i,
  
  // Travel
  /travel|vacation|hotel|flight|airline|tourism|destination|trip/i,
  
  // Food/Cooking
  /recipe|cooking|food|restaurant|meal|ingredient|kitchen|chef/i,
  
  // Shopping
  /shopping|store|price|buy|purchase|deal|discount|retail/i,
  
  // General Knowledge
  /history|geography|science|math|literature|art|culture|philosophy/i
];

// Contextual keywords that indicate compliance-related questions
export const CONTEXTUAL_KEYWORDS = [
  // Regulatory
  'fda', 'ema', 'ich', 'regulation', 'guideline', 'compliance', 'regulatory',
  'approval', 'submission', 'clinical trial', 'safety', 'efficacy', 'gcp',
  'gmp', 'glp', 'qms', 'risk management', 'pharmacovigilance',
  
  // Assessment
  'assessment', 'question', 'section', 'requirement', 'evidence', 'documentation',
  'validation', 'verification', 'testing', 'protocol', 'sop', 'checklist',
  'audit', 'inspection', 'compliance', 'governance',
  
  // Analytics
  'analytics', 'report', 'performance', 'score', 'trend', 'metric', 'dashboard',
  'insight', 'recommendation', 'benchmark', 'comparison', 'statistics', 'data',
  
  // AI/ML
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'model', 'algorithm',
  'data science', 'predictive', 'analytics', 'automation',
  
  // Pharmaceutical
  'pharmaceutical', 'pharma', 'drug', 'medicine', 'therapeutic', 'clinical',
  'oncology', 'cardiology', 'neurology', 'immunology', 'rare disease',
  
  // Quality/Compliance
  'quality', 'compliance', 'governance', 'risk', 'safety', 'efficacy',
  'validation', 'verification', 'documentation', 'process', 'standard'
];

export default ASKREXI_TRAINING_DATA;
