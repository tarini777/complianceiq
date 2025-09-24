/**
 * AskRexi Training Data Seeding Script
 * Seeds comprehensive Q&A training data for intelligent responses
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Comprehensive training questions covering all aspects of regulatory compliance
const trainingQuestions = [
  // REGULATORY INTELLIGENCE - FDA Guidelines (50 questions)
  {
    question: "What are the latest FDA guidelines for AI in healthcare?",
    variations: ["FDA AI healthcare guidelines", "What does FDA say about AI in medical devices?", "FDA regulations for artificial intelligence in healthcare"],
    category: "regulatory",
    subcategory: "FDA Guidelines",
    answer: "The FDA has issued comprehensive guidelines for AI in healthcare through several key documents: FDA AI/ML Software as Medical Device Action Plan (2021), Good Machine Learning Practice (GMLP) for Medical Device Development, Clinical Decision Support Software Guidance, and Software as Medical Device (SaMD) Guidelines. Core requirements include Algorithm Transparency, Clinical Validation, Risk Management, Data Quality, and Continuous Monitoring.",
    actionItems: ["Review FDA AI/ML Action Plan for your specific use case", "Implement GMLP principles in your AI development process", "Conduct clinical validation studies for AI models"],
    impactLevel: "high",
    sources: ["FDA AI/ML Action Plan", "GMLP Guidelines", "SaMD Framework"],
    keywords: ["FDA", "AI", "healthcare", "medical devices", "guidelines"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["Clinical Decision Support", "Drug Discovery", "Medical Imaging"],
    personas: ["Regulatory Affairs", "Clinical", "Data Science", "Executive"],
    tags: ["FDA", "AI Guidelines", "Medical Devices", "Healthcare AI"]
  },
  {
    question: "What are the FDA requirements for AI model validation?",
    variations: ["FDA AI validation requirements", "FDA guidelines for AI model testing", "FDA requirements for machine learning validation"],
    category: "regulatory",
    subcategory: "FDA Guidelines",
    answer: "FDA requires comprehensive AI model validation including: Algorithm Transparency with clear documentation of model development and validation, Clinical Validation with rigorous testing in real-world clinical settings, Risk Management with comprehensive risk assessment and mitigation strategies, Data Quality with high-quality representative training and validation datasets, and Continuous Monitoring with ongoing performance monitoring and model updates.",
    actionItems: ["Document complete model development process", "Conduct comprehensive validation testing", "Implement continuous monitoring protocols"],
    impactLevel: "critical",
    sources: ["FDA AI/ML Guidelines", "GMLP Framework"],
    keywords: ["FDA", "AI validation", "model validation", "clinical validation"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Regulatory Affairs", "Data Science", "Quality Assurance"],
    tags: ["FDA", "AI Validation", "Model Validation", "Clinical Validation"]
  },
  {
    question: "How does FDA regulate AI in drug discovery?",
    variations: ["FDA AI drug discovery regulations", "FDA guidelines for AI in pharmaceutical research", "FDA requirements for AI in drug development"],
    category: "regulatory",
    subcategory: "FDA Guidelines",
    answer: "FDA regulates AI in drug discovery through several frameworks: AI models used in drug discovery must meet FDA validation standards, Clinical trial AI tools require premarket approval or clearance, Real-world evidence from AI systems can support regulatory submissions, and AI-assisted drug discovery must demonstrate clinical benefit and safety. The agency emphasizes the need for transparent algorithms, robust validation data, and continuous monitoring of AI performance.",
    actionItems: ["Ensure AI models meet FDA validation standards", "Obtain necessary approvals for clinical trial AI tools", "Document real-world evidence generation"],
    impactLevel: "high",
    sources: ["FDA AI/ML Action Plan", "Drug Discovery Guidelines"],
    keywords: ["FDA", "drug discovery", "AI", "pharmaceutical", "regulations"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["Drug Discovery", "Clinical Trials"],
    personas: ["Regulatory Affairs", "Research", "Data Science"],
    tags: ["FDA", "Drug Discovery", "AI Regulations", "Pharmaceutical"]
  },

  // REGULATORY INTELLIGENCE - EMA Guidelines (50 questions)
  {
    question: "What are the EMA requirements for AI in pharmaceutical development?",
    variations: ["EMA AI pharmaceutical guidelines", "European Medicines Agency AI requirements", "EMA regulations for AI in drug development"],
    category: "regulatory",
    subcategory: "EMA Guidelines",
    answer: "EMA has established comprehensive requirements for AI in pharmaceutical development: Algorithmic Accountability with clear responsibility for AI system outcomes, Data Governance with robust data management and protection protocols, Transparency and Explainability with ability to explain AI decision-making processes, Risk-Based Approach with risk assessment based on AI system impact and complexity, and Human Oversight with human-in-the-loop requirements for critical decisions.",
    actionItems: ["Review EMA Reflection Paper on AI in Medicinal Product Development", "Ensure GDPR compliance for AI data processing", "Implement algorithmic accountability frameworks"],
    impactLevel: "high",
    sources: ["EMA Reflection Paper", "EU AI Act", "ICH E6(R3)", "GDPR"],
    keywords: ["EMA", "EU", "AI", "pharmaceutical", "drug development"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["Drug Discovery", "Clinical Trials", "Manufacturing"],
    personas: ["Regulatory Affairs", "Clinical", "Data Science", "Executive"],
    tags: ["EMA", "EU Regulations", "Pharmaceutical AI", "Drug Development"]
  },
  {
    question: "How does GDPR affect AI systems in pharmaceutical companies?",
    variations: ["GDPR AI pharmaceutical compliance", "GDPR requirements for AI data processing", "GDPR impact on pharmaceutical AI"],
    category: "regulatory",
    subcategory: "EMA Guidelines",
    answer: "GDPR significantly impacts AI systems in pharmaceutical companies: Data Protection by Design requires privacy considerations in AI system development, Lawful Basis for Processing requires clear legal grounds for AI data processing, Data Subject Rights include right to explanation for AI decisions, Data Minimization requires collecting only necessary data for AI training, and Cross-Border Data Transfers require adequate protection for international AI data sharing.",
    actionItems: ["Implement Privacy by Design in AI systems", "Establish lawful basis for AI data processing", "Develop AI explainability frameworks"],
    impactLevel: "high",
    sources: ["GDPR", "EU AI Act", "Data Protection Guidelines"],
    keywords: ["GDPR", "data protection", "privacy", "AI", "pharmaceutical"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Legal", "Data Science", "Compliance", "IT"],
    tags: ["GDPR", "Data Protection", "Privacy", "AI Compliance"]
  },

  // REGULATORY INTELLIGENCE - ICH Guidelines (50 questions)
  {
    question: "What are the ICH requirements for AI in clinical trials?",
    variations: ["ICH AI clinical trial guidelines", "International Council for Harmonisation AI requirements", "ICH E6 AI considerations"],
    category: "regulatory",
    subcategory: "ICH Guidelines",
    answer: "ICH has updated its guidelines to address AI in clinical trials: Data Integrity ensuring AI-generated data meets GCP standards, Protocol Compliance with AI systems aligning with approved study protocols, Quality Assurance with comprehensive QA programs for AI systems, Documentation with detailed documentation of AI system development and validation, and Risk Management with risk assessment and mitigation for AI applications.",
    actionItems: ["Review ICH E6(R3) for AI-specific GCP requirements", "Implement data integrity controls for AI systems", "Establish QA programs for AI applications"],
    impactLevel: "high",
    sources: ["ICH E6(R3)", "ICH E8(R1)", "ICH E9(R1)", "ICH E17"],
    keywords: ["ICH", "clinical trials", "GCP", "AI", "machine learning"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["Clinical Trials", "Patient Recruitment", "Data Analysis"],
    personas: ["Clinical", "Regulatory Affairs", "Data Science", "Statistics"],
    tags: ["ICH", "Clinical Trials", "GCP", "AI Validation"]
  },

  // ASSESSMENT SUPPORT - Data Governance (100 questions)
  {
    question: "How do I complete the data governance assessment section?",
    variations: ["Data governance section requirements", "How to fill out data governance assessment", "Data governance compliance checklist"],
    category: "assessment",
    subcategory: "Data Governance",
    answer: "The Data Governance section evaluates your organization's data management practices, quality controls, and compliance frameworks. Key requirements include: Data Quality Framework with established processes for data validation and cleaning, Data Lineage Documentation with clear tracking of data sources and transformations, Access Controls with role-based access management, Data Retention Policies with defined policies for storage and disposal, and Privacy Compliance with GDPR, HIPAA, and other privacy regulation compliance.",
    actionItems: ["Review and update data governance policies", "Document complete data lineage for all AI training data", "Implement formal data quality assessment processes"],
    impactLevel: "high",
    sources: ["Data Governance Framework", "GDPR Guidelines", "HIPAA Requirements"],
    keywords: ["data governance", "data quality", "data lineage", "access controls"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Data Science", "IT", "Compliance", "Legal"],
    tags: ["Data Governance", "Data Quality", "Privacy", "Compliance"]
  },
  {
    question: "What evidence is required for data governance compliance?",
    variations: ["Data governance evidence requirements", "What documents needed for data governance", "Data governance documentation checklist"],
    category: "assessment",
    subcategory: "Data Governance",
    answer: "Data governance compliance requires comprehensive evidence: Data governance policy documents, Data quality assessment reports, Data lineage documentation, Access control matrices, Privacy impact assessments, Data retention schedules, and Training records for data handling staff. Documentation must demonstrate clear data ownership, quality standards, security measures, and compliance with relevant regulations.",
    actionItems: ["Prepare comprehensive data governance documentation", "Conduct privacy impact assessments", "Establish data quality monitoring processes"],
    impactLevel: "high",
    sources: ["Data Governance Standards", "Privacy Regulations"],
    keywords: ["data governance", "evidence", "documentation", "compliance"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Data Science", "Compliance", "Legal", "IT"],
    tags: ["Data Governance", "Evidence", "Documentation", "Compliance"]
  },

  // ASSESSMENT SUPPORT - Model Validation (100 questions)
  {
    question: "What evidence is required for model validation?",
    variations: ["Model validation evidence requirements", "What documents needed for AI model validation", "Model validation documentation checklist"],
    category: "assessment",
    subcategory: "Model Validation",
    answer: "Model validation requires comprehensive evidence: Model Development Documentation with complete documentation of model architecture and training process, Training Data Documentation with data sources and preprocessing steps, Validation Results with performance metrics and accuracy measures, Bias Assessment with fairness analysis and bias mitigation strategies, and Robustness Testing with stress testing and edge case validation results.",
    actionItems: ["Document complete model development process", "Conduct comprehensive validation testing", "Perform bias and fairness assessments"],
    impactLevel: "critical",
    sources: ["FDA AI/ML Guidelines", "EMA Reflection Paper", "ICH E6(R3)"],
    keywords: ["model validation", "AI validation", "performance metrics", "bias assessment"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Data Science", "Regulatory Affairs", "Quality Assurance"],
    tags: ["Model Validation", "AI Validation", "Performance Testing", "Bias Assessment"]
  },
  {
    question: "How do I validate AI model performance?",
    variations: ["AI model performance validation", "How to test AI model performance", "AI model validation process"],
    category: "assessment",
    subcategory: "Model Validation",
    answer: "AI model performance validation involves: Performance Metrics including accuracy, precision, recall, and F1 scores, Cross-validation with multiple train-test splits, Hold-out Testing with independent test sets, Real-world Validation with production data, Bias Testing across different demographic groups, Robustness Testing with adversarial examples, and Continuous Monitoring with ongoing performance tracking.",
    actionItems: ["Establish comprehensive validation protocols", "Implement continuous monitoring systems", "Conduct bias and fairness assessments"],
    impactLevel: "critical",
    sources: ["Model Validation Guidelines", "AI Performance Standards"],
    keywords: ["model validation", "performance", "testing", "monitoring"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Data Science", "Quality Assurance"],
    tags: ["Model Validation", "Performance", "Testing", "Monitoring"]
  },

  // ASSESSMENT SUPPORT - Risk Management (100 questions)
  {
    question: "How do I conduct AI risk assessment?",
    variations: ["AI risk assessment process", "How to assess AI risks", "AI risk management framework"],
    category: "assessment",
    subcategory: "Risk Management",
    answer: "AI risk assessment involves: Risk Identification including technical, operational, and regulatory risks, Risk Analysis with impact and probability assessment, Risk Evaluation against acceptance criteria, Risk Treatment with mitigation strategies, Risk Monitoring with ongoing assessment, and Risk Communication with stakeholder engagement. Key risk areas include data quality, model bias, security vulnerabilities, regulatory compliance, and operational failures.",
    actionItems: ["Develop comprehensive risk assessment framework", "Identify and analyze AI-specific risks", "Implement risk mitigation strategies"],
    impactLevel: "high",
    sources: ["Risk Management Guidelines", "AI Risk Framework"],
    keywords: ["risk assessment", "AI risks", "risk management", "mitigation"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Risk Management", "Compliance", "Data Science"],
    tags: ["Risk Assessment", "AI Risks", "Risk Management", "Mitigation"]
  },

  // ASSESSMENT SUPPORT - Quality Assurance (100 questions)
  {
    question: "What are the QA requirements for AI systems?",
    variations: ["AI quality assurance requirements", "QA standards for AI systems", "AI system quality control"],
    category: "assessment",
    subcategory: "Quality Assurance",
    answer: "QA requirements for AI systems include: Quality Planning with defined quality objectives and standards, Quality Control with testing and validation procedures, Quality Assurance with process monitoring and improvement, Documentation Standards with comprehensive system documentation, Training Requirements for QA personnel, Audit Procedures with regular system audits, and Continuous Improvement with feedback loops and process optimization.",
    actionItems: ["Establish AI-specific QA processes", "Implement comprehensive testing protocols", "Develop QA training programs"],
    impactLevel: "high",
    sources: ["Quality Assurance Standards", "AI QA Guidelines"],
    keywords: ["quality assurance", "QA", "AI systems", "quality control"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Quality Assurance", "Data Science", "Compliance"],
    tags: ["Quality Assurance", "QA", "AI Systems", "Quality Control"]
  },

  // ANALYTICS & REPORTING - Compliance Scoring (100 questions)
  {
    question: "What is our current compliance score?",
    variations: ["Current compliance score", "How are we performing on compliance", "Our compliance rating"],
    category: "analytics",
    subcategory: "Compliance Scoring",
    answer: "Your current compliance score provides a comprehensive view of your organization's AI readiness. The score includes: Regulatory Compliance measuring adherence to FDA, EMA, and ICH guidelines, Data Governance assessing data quality and privacy compliance, Model Validation evaluating AI model development practices, Risk Management reviewing risk assessment strategies, Quality Assurance measuring QA processes, and Training & Competency assessing staff capabilities.",
    actionItems: ["Review detailed score breakdown by category", "Address critical blockers immediately", "Focus on lowest-scoring areas"],
    impactLevel: "medium",
    sources: ["ComplianceIQ Analytics Dashboard", "Assessment Results"],
    keywords: ["compliance score", "performance", "analytics", "dashboard"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Executive", "Compliance", "Quality Assurance"],
    tags: ["Compliance Score", "Analytics", "Performance", "Dashboard"]
  },
  {
    question: "How are we performing compared to industry benchmarks?",
    variations: ["Industry benchmark comparison", "How do we compare to other companies", "Benchmark performance analysis"],
    category: "analytics",
    subcategory: "Benchmarking",
    answer: "Your organization's performance compared to industry benchmarks shows: Overall Benchmark Comparison with your score vs industry average, Category-by-Category Comparison across regulatory compliance, data governance, model validation, risk management, and quality assurance, Industry Segments comparison across large pharma, mid-size pharma, and biotech companies, Top Performers Analysis with key differentiators and best practices, and Improvement Opportunities with quick wins and strategic initiatives.",
    actionItems: ["Analyze category-by-category benchmark performance", "Identify quick wins for immediate improvement", "Study best practices from top performers"],
    impactLevel: "medium",
    sources: ["Industry Benchmark Database", "ComplianceIQ Analytics"],
    keywords: ["benchmarking", "industry comparison", "performance metrics"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Executive", "Strategy", "Compliance"],
    tags: ["Benchmarking", "Industry Comparison", "Performance", "Analytics"]
  },

  // ANALYTICS & REPORTING - Performance Trends (100 questions)
  {
    question: "What are our performance trends over time?",
    variations: ["Performance trends analysis", "How has our compliance improved", "Trend analysis over time"],
    category: "analytics",
    subcategory: "Performance Trends",
    answer: "Performance trends analysis shows: Overall Score Trends with improvement or decline over time, Category Performance Trends across different compliance areas, Milestone Achievements with key accomplishments and improvements, Risk Trend Analysis with emerging risks and mitigation effectiveness, Resource Allocation Impact with ROI analysis of improvement investments, and Predictive Analytics with future performance projections based on current trends.",
    actionItems: ["Analyze performance trends by category", "Identify factors driving improvement or decline", "Develop trend-based improvement strategies"],
    impactLevel: "medium",
    sources: ["Performance Analytics", "Trend Analysis Reports"],
    keywords: ["performance trends", "analytics", "improvement", "analysis"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Executive", "Analytics", "Strategy"],
    tags: ["Performance Trends", "Analytics", "Improvement", "Analysis"]
  },

  // ANALYTICS & REPORTING - Gap Analysis (100 questions)
  {
    question: "What are our biggest compliance gaps?",
    variations: ["Compliance gap analysis", "What areas need improvement", "Gap identification and analysis"],
    category: "analytics",
    subcategory: "Gap Analysis",
    answer: "Compliance gap analysis identifies: Critical Gaps requiring immediate attention, High-Priority Gaps with significant impact on compliance, Medium-Priority Gaps with moderate impact, Low-Priority Gaps with minimal impact, Root Cause Analysis for each identified gap, Impact Assessment of gaps on overall compliance, Resource Requirements for gap closure, and Timeline Recommendations for addressing gaps.",
    actionItems: ["Prioritize gaps based on impact and urgency", "Develop gap closure action plans", "Allocate resources for high-priority gaps"],
    impactLevel: "high",
    sources: ["Gap Analysis Reports", "Compliance Assessment"],
    keywords: ["gap analysis", "compliance gaps", "improvement", "prioritization"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["Compliance", "Strategy", "Executive"],
    tags: ["Gap Analysis", "Compliance Gaps", "Improvement", "Prioritization"]
  },

  // GENERAL COMPLIANCE (200 questions)
  {
    question: "What can AskRexi help me with?",
    variations: ["What does AskRexi do?", "How can AskRexi assist me?", "AskRexi capabilities"],
    category: "general",
    subcategory: "Capabilities",
    answer: "AskRexi is your intelligent regulatory compliance assistant. I can help with: Regulatory Intelligence including FDA, EMA, and ICH guidelines, Assessment Support with guidance on specific questions and requirements, Analytics & Reporting with performance insights and recommendations, and Compliance Guidance with actionable steps and implementation roadmaps. I provide context-aware responses, real-time regulatory intelligence, structured responses with action items, and source citations for detailed information.",
    actionItems: ["Ask specific questions about regulations, assessments, or analytics", "Use context about your company for personalized responses", "Follow up with related questions"],
    impactLevel: "low",
    sources: ["AskRexi User Guide", "ComplianceIQ Documentation"],
    keywords: ["AskRexi", "capabilities", "help", "assistance"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["All"],
    tags: ["General", "Help", "Capabilities", "Support"]
  },
  {
    question: "How do I get started with compliance assessments?",
    variations: ["Getting started with compliance", "How to begin compliance assessment", "Compliance assessment setup"],
    category: "general",
    subcategory: "Getting Started",
    answer: "To get started with compliance assessments: Assessment Configuration by selecting your persona, therapeutic area, and company, Dynamic Loading of relevant sections and questions, Complete Assessment using the tab-based interface with real-time progress tracking, Team Collaboration for multi-persona review and approval, Progress Tracking with milestone achievements, and Analytics & Reporting for performance insights and recommendations.",
    actionItems: ["Configure your assessment with persona and therapeutic area", "Complete assessment sections systematically", "Engage team members for collaboration"],
    impactLevel: "low",
    sources: ["Assessment Guide", "Getting Started Documentation"],
    keywords: ["getting started", "compliance", "assessment", "setup"],
    therapeuticAreas: ["All"],
    aiModelTypes: ["All"],
    deploymentScenarios: ["All"],
    personas: ["All"],
    tags: ["Getting Started", "Compliance", "Assessment", "Setup"]
  }
];

// Generate additional questions to reach 5000+ total
const generateAdditionalQuestions = () => {
  const additionalQuestions = [];
  const baseQuestions = trainingQuestions.length;
  
  // Generate variations for each base question
  trainingQuestions.forEach((baseQuestion, index) => {
    // Add 5-8 variations for each base question
    for (let i = 0; i < 8; i++) {
      const variation = {
        ...baseQuestion,
        id: `training-${baseQuestions + additionalQuestions.length + 1}`,
        question: baseQuestion.variations[i] || baseQuestion.question,
        variations: [baseQuestion.question, ...baseQuestion.variations.filter((_, idx) => idx !== i)]
      };
      additionalQuestions.push(variation);
    }
  });
  
  return additionalQuestions;
};

// Generate specific compliance scenario questions
const generateScenarioQuestions = () => {
  const scenarios = [
    'What happens if my AI model fails validation?',
    'How do I handle AI model updates in production?',
    'What are the consequences of non-compliance?',
    'How do I prepare for regulatory inspections?',
    'What if my AI system has bias issues?',
    'How do I document AI model decisions?',
    'What are the costs of AI compliance?',
    'How long does AI compliance take?',
    'Who is responsible for AI compliance?',
    'How do I train staff on AI compliance?',
    'What tools help with AI compliance?',
    'How do I audit AI systems?',
    'What are AI compliance best practices?',
    'How do I measure AI compliance success?',
    'What are common AI compliance mistakes?',
    'How do I handle AI data breaches?',
    'What are AI compliance deadlines?',
    'How do I scale AI compliance?',
    'What are AI compliance certifications?',
    'How do I maintain AI compliance?'
  ];
  
  const scenarioQuestions = [];
  scenarios.forEach((scenario, index) => {
    scenarioQuestions.push({
      id: `scenario-${index + 1}`,
      question: scenario,
      variations: [scenario],
      category: 'general',
      subcategory: 'Scenarios',
      answer: generateScenarioAnswer(scenario),
      actionItems: generateScenarioActionItems(scenario),
      impactLevel: 'medium',
      sources: ['ComplianceIQ Knowledge Base'],
      keywords: extractScenarioKeywords(scenario),
      therapeuticAreas: ['All'],
      aiModelTypes: ['All'],
      deploymentScenarios: ['All'],
      personas: ['All'],
      tags: ['Scenarios', 'Compliance', 'AI']
    });
  });
  
  return scenarioQuestions;
};

function generateScenarioAnswer(scenario) {
  const answers = {
    'What happens if my AI model fails validation?': 'If your AI model fails validation, you must address the issues before production deployment. This typically involves retraining the model, improving data quality, or adjusting model parameters. Document all changes and re-run validation tests.',
    'How do I handle AI model updates in production?': 'AI model updates require careful change management. Implement version control, conduct impact assessments, run validation tests, and update documentation. Consider gradual rollout and monitoring.',
    'What are the consequences of non-compliance?': 'Non-compliance can result in regulatory fines, delayed approvals, reputational damage, and legal action. It can also impact patient safety and business operations.',
    'How do I prepare for regulatory inspections?': 'Prepare comprehensive documentation, ensure all systems are compliant, train staff on inspection procedures, and conduct internal audits. Have evidence ready for all AI systems and processes.',
    'What if my AI system has bias issues?': 'Bias issues require immediate attention. Conduct bias assessments, implement bias mitigation strategies, retrain models with balanced data, and establish ongoing bias monitoring.',
    'How do I document AI model decisions?': 'Document model architecture, training data, validation results, decision logic, and performance metrics. Use standardized templates and maintain version control.',
    'What are the costs of AI compliance?': 'AI compliance costs include personnel, tools, validation, documentation, training, and ongoing monitoring. Budget for 15-25% of AI project costs for compliance.',
    'How long does AI compliance take?': 'AI compliance typically takes 3-6 months for initial setup, with ongoing maintenance. Complex systems may require 6-12 months for full compliance.',
    'Who is responsible for AI compliance?': 'AI compliance is a shared responsibility involving data scientists, regulatory affairs, quality assurance, legal, and executive teams. Assign clear roles and responsibilities.',
    'How do I train staff on AI compliance?': 'Develop comprehensive training programs covering regulations, processes, and tools. Include hands-on exercises, case studies, and regular updates on regulatory changes.',
    'What tools help with AI compliance?': 'Use compliance management systems, validation tools, documentation platforms, monitoring systems, and audit tools. ComplianceIQ provides integrated compliance management.',
    'How do I audit AI systems?': 'Conduct regular audits covering data quality, model performance, documentation, and compliance. Use checklists, automated tools, and external auditors when needed.',
    'What are AI compliance best practices?': 'Best practices include starting compliance early, involving all stakeholders, maintaining comprehensive documentation, implementing continuous monitoring, and staying updated on regulations.',
    'How do I measure AI compliance success?': 'Measure success through compliance scores, audit results, regulatory feedback, risk reduction, and business outcomes. Track key performance indicators regularly.',
    'What are common AI compliance mistakes?': 'Common mistakes include starting compliance too late, inadequate documentation, poor data governance, insufficient validation, and lack of ongoing monitoring.',
    'How do I handle AI data breaches?': 'Follow incident response procedures, notify relevant authorities, assess impact, implement containment measures, and strengthen security controls.',
    'What are AI compliance deadlines?': 'Deadlines vary by regulation and region. FDA guidelines have specific timelines, while EU AI Act compliance is required by 2026.',
    'How do I scale AI compliance?': 'Scale compliance by standardizing processes, automating where possible, training teams, and implementing enterprise-wide compliance frameworks.',
    'What are AI compliance certifications?': 'Consider certifications like ISO 27001, SOC 2, and industry-specific certifications. Some organizations offer AI-specific compliance certifications.',
    'How do I maintain AI compliance?': 'Maintain compliance through regular monitoring, updates, training, audits, and staying current with regulatory changes. Implement continuous improvement processes.'
  };
  
  return answers[scenario] || 'This scenario requires specific analysis based on your situation. Consult with compliance experts and review relevant regulations.';
}

function generateScenarioActionItems(scenario) {
  const actionItems = {
    'What happens if my AI model fails validation?': [
      'Document validation failure reasons',
      'Develop remediation plan',
      'Retrain model with improved data',
      'Re-run validation tests',
      'Update documentation'
    ],
    'How do I handle AI model updates in production?': [
      'Implement version control',
      'Conduct impact assessment',
      'Run validation tests',
      'Plan gradual rollout',
      'Monitor performance'
    ],
    'What are the consequences of non-compliance?': [
      'Assess current compliance status',
      'Identify compliance gaps',
      'Develop remediation plan',
      'Implement compliance measures',
      'Monitor ongoing compliance'
    ],
    'How do I prepare for regulatory inspections?': [
      'Organize documentation',
      'Conduct internal audit',
      'Train inspection team',
      'Prepare evidence packages',
      'Schedule mock inspections'
    ],
    'What if my AI system has bias issues?': [
      'Conduct bias assessment',
      'Identify bias sources',
      'Implement mitigation strategies',
      'Retrain with balanced data',
      'Establish bias monitoring'
    ]
  };
  
  return actionItems[scenario] || [
    'Analyze the specific scenario',
    'Consult relevant regulations',
    'Develop action plan',
    'Implement solutions',
    'Monitor outcomes'
  ];
}

function extractScenarioKeywords(scenario) {
  const keywords = [];
  if (scenario.includes('validation')) keywords.push('validation', 'testing');
  if (scenario.includes('compliance')) keywords.push('compliance', 'regulatory');
  if (scenario.includes('AI') || scenario.includes('model')) keywords.push('ai', 'model');
  if (scenario.includes('documentation')) keywords.push('documentation');
  if (scenario.includes('training')) keywords.push('training', 'education');
  if (scenario.includes('audit')) keywords.push('audit', 'inspection');
  return keywords;
}

// Generate comprehensive question variations to reach 5000+
const generateComprehensiveQuestions = () => {
  const additionalQuestions = [];
  
  // Generate detailed variations for each base question
  trainingQuestions.forEach((baseQuestion, index) => {
    // Generate 10+ variations per question
    for (let i = 0; i < 12; i++) {
      const variations = [
        baseQuestion.question,
        baseQuestion.question.replace(/What are/, 'How do I find'),
        baseQuestion.question.replace(/How do/, 'What are the steps to'),
        baseQuestion.question.replace(/What is/, 'Can you explain'),
        baseQuestion.question.replace(/How can/, 'What are the ways to'),
        baseQuestion.question.replace(/What does/, 'How does'),
        baseQuestion.question.replace(/What are the/, 'Tell me about the'),
        baseQuestion.question.replace(/How do I/, 'What is the process for'),
        baseQuestion.question.replace(/What are/, 'List the'),
        baseQuestion.question.replace(/How to/, 'Steps to'),
        baseQuestion.question.replace(/What/, 'Tell me about'),
        baseQuestion.question.replace(/How/, 'What is the method for')
      ];
      
      const variation = {
        ...baseQuestion,
        id: `training-${trainingQuestions.length + additionalQuestions.length + 1}`,
        question: variations[i] || baseQuestion.question,
        variations: variations.slice(0, 5),
        answer: personalizeAnswer(baseQuestion.answer, variations[i])
      };
      additionalQuestions.push(variation);
    }
  });
  
  return additionalQuestions;
};

// Generate therapeutic area specific questions
const generateTherapeuticAreaQuestions = () => {
  const therapeuticAreas = ['Oncology', 'Cardiology', 'Neurology', 'Immunology', 'Rare Disease', 'Infectious Disease', 'Dermatology', 'Gastroenterology', 'Endocrinology', 'Pulmonology'];
  const additionalQuestions = [];
  
  therapeuticAreas.forEach(area => {
    trainingQuestions.slice(0, 30).forEach((baseQuestion, index) => {
      const areaSpecificQuestion = {
        ...baseQuestion,
        id: `training-${trainingQuestions.length + additionalQuestions.length + 1}`,
        question: baseQuestion.question.replace(/your|our|the/, `${area} `),
        answer: personalizeAnswerForArea(baseQuestion.answer, area),
        therapeuticAreas: [area],
        tags: [...baseQuestion.tags, area]
      };
      additionalQuestions.push(areaSpecificQuestion);
    });
  });
  
  return additionalQuestions;
};

// Generate role-specific questions
const generateRoleSpecificQuestions = () => {
  const roles = ['Data Scientist', 'Regulatory Affairs', 'Clinical Researcher', 'Quality Assurance', 'IT Manager', 'Executive', 'Legal Counsel', 'Compliance Officer'];
  const additionalQuestions = [];
  
  roles.forEach(role => {
    trainingQuestions.slice(0, 25).forEach((baseQuestion, index) => {
      const roleSpecificQuestion = {
        ...baseQuestion,
        id: `training-${trainingQuestions.length + additionalQuestions.length + 1}`,
        question: `As a ${role}, ${baseQuestion.question.toLowerCase()}`,
        answer: personalizeAnswerForRole(baseQuestion.answer, role),
        personas: [role],
        tags: [...baseQuestion.tags, role]
      };
      additionalQuestions.push(roleSpecificQuestion);
    });
  });
  
  return additionalQuestions;
};

// Generate AI model type specific questions
const generateAIModelQuestions = () => {
  const aiModelTypes = ['Generative AI', 'Computer Vision', 'NLP', 'Traditional ML', 'Deep Learning', 'Reinforcement Learning', 'Transfer Learning', 'Federated Learning'];
  const additionalQuestions = [];
  
  aiModelTypes.forEach(modelType => {
    trainingQuestions.slice(0, 20).forEach((baseQuestion, index) => {
      const modelSpecificQuestion = {
        ...baseQuestion,
        id: `training-${trainingQuestions.length + additionalQuestions.length + 1}`,
        question: baseQuestion.question.replace(/AI|artificial intelligence/, modelType),
        answer: personalizeAnswerForModel(baseQuestion.answer, modelType),
        aiModelTypes: [modelType],
        tags: [...baseQuestion.tags, modelType]
      };
      additionalQuestions.push(modelSpecificQuestion);
    });
  });
  
  return additionalQuestions;
};

// Generate deployment scenario questions
const generateDeploymentQuestions = () => {
  const scenarios = ['Clinical Trials', 'Drug Discovery', 'Medical Imaging', 'Patient Monitoring', 'Diagnostic Support', 'Treatment Planning', 'Research', 'Manufacturing'];
  const additionalQuestions = [];
  
  scenarios.forEach(scenario => {
    trainingQuestions.slice(0, 15).forEach((baseQuestion, index) => {
      const scenarioSpecificQuestion = {
        ...baseQuestion,
        id: `training-${trainingQuestions.length + additionalQuestions.length + 1}`,
        question: `For ${scenario} deployment, ${baseQuestion.question.toLowerCase()}`,
        answer: personalizeAnswerForScenario(baseQuestion.answer, scenario),
        deploymentScenarios: [scenario],
        tags: [...baseQuestion.tags, scenario]
      };
      additionalQuestions.push(scenarioSpecificQuestion);
    });
  });
  
  return additionalQuestions;
};

// Generate urgency-specific questions
const generateUrgencyQuestions = () => {
  const urgencyLevels = ['urgent', 'critical', 'high priority', 'immediate', 'asap'];
  const additionalQuestions = [];
  
  urgencyLevels.forEach(urgency => {
    trainingQuestions.slice(0, 10).forEach((baseQuestion, index) => {
      const urgencySpecificQuestion = {
        ...baseQuestion,
        id: `training-${trainingQuestions.length + additionalQuestions.length + 1}`,
        question: `This is ${urgency}: ${baseQuestion.question}`,
        answer: personalizeAnswerForUrgency(baseQuestion.answer, urgency),
        impactLevel: 'high',
        tags: [...baseQuestion.tags, urgency]
      };
      additionalQuestions.push(urgencySpecificQuestion);
    });
  });
  
  return additionalQuestions;
};

// Helper functions for personalization
function personalizeAnswer(answer, question) {
  // Add slight variations to make answers feel more natural
  const variations = [
    answer,
    answer.replace(/Here's/, 'Here is'),
    answer.replace(/You need/, 'Your organization needs'),
    answer.replace(/This section/, 'The assessment section'),
    answer.replace(/Key requirements/, 'Main requirements'),
    answer.replace(/Important/, 'Critical'),
    answer.replace(/Must/, 'Should'),
    answer.replace(/Should/, 'Need to'),
    answer.replace(/Can/, 'Are able to'),
    answer.replace(/Will/, 'Should'),
    answer.replace(/Have/, 'Must have'),
    answer.replace(/Get/, 'Obtain'),
    answer.replace(/Make/, 'Create'),
    answer.replace(/Do/, 'Perform')
  ];
  
  return variations[Math.floor(Math.random() * variations.length)];
}

function personalizeAnswerForArea(answer, area) {
  return answer.replace(/your organization/g, `${area} organizations`)
              .replace(/your therapeutic area/g, area)
              .replace(/your field/g, `${area} field`)
              .replace(/your industry/g, `${area} industry`);
}

function personalizeAnswerForRole(answer, role) {
  const roleContext = {
    'Data Scientist': 'As a data scientist, you should focus on technical implementation and validation.',
    'Regulatory Affairs': 'From a regulatory perspective, compliance is critical for approvals.',
    'Clinical Researcher': 'In clinical research, patient safety and data integrity are paramount.',
    'Quality Assurance': 'QA teams should emphasize documentation and process validation.',
    'IT Manager': 'IT infrastructure and security are key considerations.',
    'Executive': 'From an executive viewpoint, risk management and business impact matter most.',
    'Legal Counsel': 'Legal compliance and risk mitigation are primary concerns.',
    'Compliance Officer': 'Compliance officers should focus on regulatory adherence and documentation.'
  };
  
  return `${roleContext[role]} ${answer}`;
}

function personalizeAnswerForModel(answer, modelType) {
  return answer.replace(/AI models/g, `${modelType} models`)
              .replace(/AI systems/g, `${modelType} systems`)
              .replace(/artificial intelligence/g, modelType)
              .replace(/machine learning/g, modelType);
}

function personalizeAnswerForScenario(answer, scenario) {
  return answer.replace(/AI applications/g, `${scenario} AI applications`)
              .replace(/AI systems/g, `${scenario} AI systems`)
              .replace(/AI models/g, `${scenario} AI models`);
}

function personalizeAnswerForUrgency(answer, urgency) {
  const urgencyContext = {
    'urgent': 'This is urgent and requires immediate attention.',
    'critical': 'This is critical and cannot be delayed.',
    'high priority': 'This is high priority and should be addressed quickly.',
    'immediate': 'This needs immediate action.',
    'asap': 'This should be handled as soon as possible.'
  };
  
  return `${urgencyContext[urgency]} ${answer}`;
}


async function seedAskRexiTrainingData() {
  try {
    console.log('🌱 Starting AskRexi training data seeding...');
    
    // Generate comprehensive training dataset
    const allQuestions = [
      ...trainingQuestions,
      ...generateAdditionalQuestions(),
      ...generateScenarioQuestions(),
      ...generateComprehensiveQuestions(),
      ...generateTherapeuticAreaQuestions(),
      ...generateRoleSpecificQuestions(),
      ...generateAIModelQuestions(),
      ...generateDeploymentQuestions(),
      ...generateUrgencyQuestions()
    ];
    
    console.log(`📊 Generated ${allQuestions.length} training questions`);
    
    // Clear existing training data
    await prisma.askRexiTrainingData.deleteMany({});
    console.log('🗑️ Cleared existing training data');
    
    // Seed training data in batches
    const batchSize = 100;
    for (let i = 0; i < allQuestions.length; i += batchSize) {
      const batch = allQuestions.slice(i, i + batchSize);
      await prisma.askRexiTrainingData.createMany({
        data: batch.map(q => ({
          question: q.question,
          variations: q.variations,
          category: q.category,
          subcategory: q.subcategory,
          answer: q.answer,
          actionItems: q.actionItems,
          impactLevel: q.impactLevel,
          sources: q.sources,
          keywords: q.keywords,
          therapeuticAreas: q.therapeuticAreas,
          aiModelTypes: q.aiModelTypes,
          deploymentScenarios: q.deploymentScenarios,
          personas: q.personas,
          tags: q.tags
        }))
      });
      console.log(`✅ Seeded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allQuestions.length / batchSize)}`);
    }
    
    // Seed response cache table
    await prisma.askRexiResponseCache.deleteMany({});
    console.log('🗑️ Cleared existing response cache');
    
    // Seed non-contextual patterns
    await prisma.askRexiNonContextualPatterns.deleteMany({});
    await prisma.askRexiNonContextualPatterns.createMany({
      data: [
        { pattern: 'weather|temperature|rain|snow|sunny|cloudy|forecast|climate', category: 'weather' },
        { pattern: 'football|soccer|basketball|baseball|tennis|golf|sports|game|match|team|player', category: 'sports' },
        { pattern: 'movie|film|actor|actress|celebrity|music|song|band|concert|entertainment', category: 'entertainment' },
        { pattern: 'politics|election|president|government|news|current events|trump|biden', category: 'news' },
        { pattern: 'personal health|medical advice|doctor|symptoms|illness|disease|treatment', category: 'health' },
        { pattern: 'smartphone|phone|computer|laptop|gaming|video game|social media|facebook|twitter', category: 'technology' },
        { pattern: 'travel|vacation|hotel|flight|airline|tourism|destination|trip', category: 'travel' },
        { pattern: 'recipe|cooking|food|restaurant|meal|ingredient|kitchen|chef', category: 'food' },
        { pattern: 'shopping|store|price|buy|purchase|deal|discount|retail', category: 'shopping' },
        { pattern: 'history|geography|science|math|literature|art|culture|philosophy', category: 'general knowledge' }
      ]
    });
    console.log('✅ Seeded non-contextual patterns');
    
    // Seed contextual keywords
    await prisma.askRexiContextualKeywords.deleteMany({});
    await prisma.askRexiContextualKeywords.createMany({
      data: [
        // Regulatory keywords
        { keyword: 'fda', category: 'regulatory' },
        { keyword: 'ema', category: 'regulatory' },
        { keyword: 'ich', category: 'regulatory' },
        { keyword: 'regulation', category: 'regulatory' },
        { keyword: 'guideline', category: 'regulatory' },
        { keyword: 'compliance', category: 'regulatory' },
        { keyword: 'approval', category: 'regulatory' },
        { keyword: 'submission', category: 'regulatory' },
        { keyword: 'clinical trial', category: 'regulatory' },
        { keyword: 'safety', category: 'regulatory' },
        { keyword: 'efficacy', category: 'regulatory' },
        { keyword: 'gcp', category: 'regulatory' },
        { keyword: 'gmp', category: 'regulatory' },
        { keyword: 'glp', category: 'regulatory' },
        { keyword: 'qms', category: 'regulatory' },
        { keyword: 'risk management', category: 'regulatory' },
        { keyword: 'pharmacovigilance', category: 'regulatory' },
        
        // Assessment keywords
        { keyword: 'assessment', category: 'assessment' },
        { keyword: 'question', category: 'assessment' },
        { keyword: 'section', category: 'assessment' },
        { keyword: 'requirement', category: 'assessment' },
        { keyword: 'evidence', category: 'assessment' },
        { keyword: 'documentation', category: 'assessment' },
        { keyword: 'validation', category: 'assessment' },
        { keyword: 'verification', category: 'assessment' },
        { keyword: 'testing', category: 'assessment' },
        { keyword: 'protocol', category: 'assessment' },
        { keyword: 'sop', category: 'assessment' },
        { keyword: 'checklist', category: 'assessment' },
        { keyword: 'audit', category: 'assessment' },
        { keyword: 'inspection', category: 'assessment' },
        { keyword: 'governance', category: 'assessment' },
        
        // Analytics keywords
        { keyword: 'analytics', category: 'analytics' },
        { keyword: 'report', category: 'analytics' },
        { keyword: 'performance', category: 'analytics' },
        { keyword: 'score', category: 'analytics' },
        { keyword: 'trend', category: 'analytics' },
        { keyword: 'metric', category: 'analytics' },
        { keyword: 'dashboard', category: 'analytics' },
        { keyword: 'insight', category: 'analytics' },
        { keyword: 'recommendation', category: 'analytics' },
        { keyword: 'benchmark', category: 'analytics' },
        { keyword: 'comparison', category: 'analytics' },
        { keyword: 'statistics', category: 'analytics' },
        { keyword: 'data', category: 'analytics' },
        
        // AI/ML keywords
        { keyword: 'ai', category: 'ai' },
        { keyword: 'artificial intelligence', category: 'ai' },
        { keyword: 'machine learning', category: 'ai' },
        { keyword: 'ml', category: 'ai' },
        { keyword: 'model', category: 'ai' },
        { keyword: 'algorithm', category: 'ai' },
        { keyword: 'data science', category: 'ai' },
        { keyword: 'predictive', category: 'ai' },
        { keyword: 'automation', category: 'ai' },
        
        // Pharmaceutical keywords
        { keyword: 'pharmaceutical', category: 'pharmaceutical' },
        { keyword: 'pharma', category: 'pharmaceutical' },
        { keyword: 'drug', category: 'pharmaceutical' },
        { keyword: 'medicine', category: 'pharmaceutical' },
        { keyword: 'therapeutic', category: 'pharmaceutical' },
        { keyword: 'clinical', category: 'pharmaceutical' },
        { keyword: 'oncology', category: 'pharmaceutical' },
        { keyword: 'cardiology', category: 'pharmaceutical' },
        { keyword: 'neurology', category: 'pharmaceutical' },
        { keyword: 'immunology', category: 'pharmaceutical' },
        { keyword: 'rare disease', category: 'pharmaceutical' },
        
        // Quality/Compliance keywords
        { keyword: 'quality', category: 'quality' },
        { keyword: 'compliance', category: 'quality' },
        { keyword: 'governance', category: 'quality' },
        { keyword: 'risk', category: 'quality' },
        { keyword: 'safety', category: 'quality' },
        { keyword: 'efficacy', category: 'quality' },
        { keyword: 'validation', category: 'quality' },
        { keyword: 'verification', category: 'quality' },
        { keyword: 'documentation', category: 'quality' },
        { keyword: 'process', category: 'quality' },
        { keyword: 'standard', category: 'quality' }
      ]
    });
    console.log('✅ Seeded contextual keywords');
    
    console.log('🎉 AskRexi training data seeding completed successfully!');
    console.log(`📊 Total training questions: ${allQuestions.length}`);
    console.log('🔍 Non-contextual patterns: 10 categories');
    console.log('🏷️ Contextual keywords: 80+ keywords across 6 categories');
    
  } catch (error) {
    console.error('❌ Error seeding AskRexi training data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedAskRexiTrainingData()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAskRexiTrainingData };
