const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ICH-specific training questions for AskRexi
const ichTrainingQuestions = [
  // ICH E6 (GCP) Guidelines
  {
    question: "What are the ICH requirements for clinical trials?",
    variations: [
      "What are ICH clinical trial requirements?",
      "ICH guidelines for clinical trials",
      "ICH E6 requirements for clinical trials",
      "What does ICH require for clinical studies?",
      "ICH standards for clinical trials",
      "Clinical trial requirements per ICH",
      "What are the ICH guidelines for clinical trials?",
      "ICH requirements for clinical research"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH E6 (R2) Good Clinical Practice guidelines require: 1) Protocol compliance and approval by IRB/IEC, 2) Informed consent from all participants, 3) Qualified investigators with adequate resources, 4) Proper documentation and record keeping, 5) Quality assurance and quality control systems, 6) Safety reporting and adverse event management, 7) Data integrity and monitoring, 8) Regulatory compliance and audit readiness. Key focus areas include patient safety, data credibility, and regulatory compliance.",
    actionItems: [
      "Ensure IRB/IEC approval before study initiation",
      "Implement comprehensive informed consent process",
      "Establish qualified investigator oversight",
      "Set up robust documentation systems",
      "Create quality assurance protocols",
      "Implement safety monitoring procedures"
    ],
    impactLevel: "critical",
    sources: ["ICH E6 (R2) Good Clinical Practice", "FDA Guidance for Industry", "EMA Clinical Trials Regulation"],
    keywords: ["ich", "gcp", "clinical trials", "good clinical practice", "e6", "regulatory", "compliance", "protocol", "informed consent", "safety"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["clinical decision support", "predictive analytics", "diagnostic ai"],
    deploymentScenarios: ["clinical trial", "research", "regulatory submission"],
    personas: ["clinical researcher", "regulatory affairs", "quality assurance", "data scientist"],
    tags: ["ich", "gcp", "clinical trials", "regulatory compliance"]
  },
  
  // ICH E8 (General Considerations for Clinical Studies)
  {
    question: "What are the ICH E8 guidelines for clinical studies?",
    variations: [
      "ICH E8 clinical study guidelines",
      "What does ICH E8 require?",
      "ICH E8 general considerations",
      "Clinical study design per ICH E8",
      "ICH E8 requirements for study design",
      "What are ICH E8 guidelines?",
      "ICH E8 clinical trial design",
      "General considerations ICH E8"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH E8 (R1) provides general considerations for clinical studies including: 1) Study objectives and endpoints definition, 2) Population selection and inclusion/exclusion criteria, 3) Study design methodology and statistical considerations, 4) Safety monitoring and risk management, 5) Data collection and management systems, 6) Quality by design principles, 7) Adaptive trial designs and innovative approaches, 8) Real-world evidence integration. Focuses on efficient, ethical, and scientifically sound study conduct.",
    actionItems: [
      "Define clear study objectives and primary endpoints",
      "Establish robust inclusion/exclusion criteria",
      "Design statistically sound methodology",
      "Implement comprehensive safety monitoring",
      "Set up quality data collection systems",
      "Consider adaptive design approaches"
    ],
    impactLevel: "high",
    sources: ["ICH E8 (R1) General Considerations", "FDA Clinical Trial Guidance", "EMA Clinical Trials Regulation"],
    keywords: ["ich", "e8", "clinical studies", "study design", "endpoints", "methodology", "statistics", "safety", "quality"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["clinical decision support", "predictive analytics", "trial optimization"],
    deploymentScenarios: ["clinical trial", "research", "regulatory submission"],
    personas: ["clinical researcher", "statistician", "regulatory affairs", "data scientist"],
    tags: ["ich", "e8", "clinical studies", "study design", "methodology"]
  },

  // ICH E9 (Statistical Principles)
  {
    question: "What are the ICH E9 statistical principles for clinical trials?",
    variations: [
      "ICH E9 statistical guidelines",
      "Statistical principles ICH E9",
      "What does ICH E9 require for statistics?",
      "ICH E9 clinical trial statistics",
      "Statistical considerations ICH E9",
      "ICH E9 requirements for statistical analysis",
      "Clinical trial statistics per ICH E9",
      "ICH E9 statistical methodology"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH E9 statistical principles require: 1) Pre-specified statistical analysis plans, 2) Appropriate sample size calculations with power analysis, 3) Primary and secondary endpoint definitions, 4) Intention-to-treat analysis principles, 5) Handling of missing data and dropouts, 6) Interim analysis procedures and stopping rules, 7) Multiple comparison adjustments, 8) Safety data analysis and reporting. Ensures statistical rigor and regulatory acceptability.",
    actionItems: [
      "Develop comprehensive statistical analysis plan",
      "Perform appropriate sample size calculations",
      "Define primary and secondary endpoints clearly",
      "Plan intention-to-treat analysis approach",
      "Establish missing data handling procedures",
      "Set up interim analysis and stopping rules"
    ],
    impactLevel: "high",
    sources: ["ICH E9 Statistical Principles", "FDA Statistical Guidance", "EMA Statistical Methodology"],
    keywords: ["ich", "e9", "statistics", "statistical analysis", "sample size", "endpoints", "analysis plan", "missing data"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["predictive analytics", "clinical decision support", "statistical modeling"],
    deploymentScenarios: ["clinical trial", "research", "regulatory submission"],
    personas: ["statistician", "clinical researcher", "data scientist", "regulatory affairs"],
    tags: ["ich", "e9", "statistics", "clinical trials", "statistical analysis"]
  },

  // ICH E10 (Choice of Control Group)
  {
    question: "What are the ICH E10 guidelines for control groups?",
    variations: [
      "ICH E10 control group guidelines",
      "What does ICH E10 require for controls?",
      "ICH E10 choice of control group",
      "Control group selection ICH E10",
      "ICH E10 requirements for control groups",
      "What are ICH E10 control guidelines?",
      "Clinical trial controls per ICH E10",
      "ICH E10 control group considerations"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH E10 provides guidance on choice of control group including: 1) Placebo-controlled trials when ethically acceptable, 2) Active control trials with established efficacy, 3) Dose-response studies for dose selection, 4) Historical controls for rare diseases, 5) No-treatment controls when appropriate, 6) External controls with proper matching, 7) Crossover designs for within-patient comparisons, 8) Add-on studies for combination therapies. Ensures scientifically valid and ethically sound control selection.",
    actionItems: [
      "Evaluate ethical acceptability of placebo controls",
      "Assess active control options with proven efficacy",
      "Consider dose-response study designs",
      "Evaluate historical control feasibility",
      "Plan appropriate randomization strategies",
      "Document control group justification"
    ],
    impactLevel: "medium",
    sources: ["ICH E10 Choice of Control Group", "FDA Clinical Trial Guidance", "EMA Clinical Trials Regulation"],
    keywords: ["ich", "e10", "control group", "placebo", "active control", "dose response", "randomization", "ethics"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["clinical decision support", "predictive analytics", "trial optimization"],
    deploymentScenarios: ["clinical trial", "research", "regulatory submission"],
    personas: ["clinical researcher", "statistician", "regulatory affairs", "ethicist"],
    tags: ["ich", "e10", "control groups", "clinical trials", "study design"]
  },

  // ICH E11 (Pediatric Clinical Trials)
  {
    question: "What are the ICH E11 requirements for pediatric clinical trials?",
    variations: [
      "ICH E11 pediatric trial guidelines",
      "What does ICH E11 require for pediatrics?",
      "ICH E11 pediatric clinical trials",
      "Pediatric trial requirements ICH E11",
      "ICH E11 guidelines for children",
      "What are ICH E11 pediatric requirements?",
      "Clinical trials in children per ICH E11",
      "ICH E11 pediatric study considerations"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH E11 (R1) pediatric clinical trial requirements include: 1) Age-appropriate study design and endpoints, 2) Pediatric formulation considerations, 3) Dose selection and pharmacokinetic studies, 4) Safety monitoring specific to pediatric populations, 5) Ethical considerations and assent procedures, 6) Long-term follow-up for growth and development, 7) Extrapolation from adult data when appropriate, 8) Global harmonization of pediatric requirements. Focuses on safe and effective drug development for children.",
    actionItems: [
      "Design age-appropriate study protocols",
      "Develop pediatric-appropriate formulations",
      "Plan dose-finding studies in pediatric populations",
      "Establish pediatric-specific safety monitoring",
      "Implement assent procedures for children",
      "Plan long-term growth and development follow-up"
    ],
    impactLevel: "high",
    sources: ["ICH E11 (R1) Pediatric Clinical Trials", "FDA Pediatric Guidance", "EMA Pediatric Regulation"],
    keywords: ["ich", "e11", "pediatric", "children", "clinical trials", "formulation", "dose selection", "safety", "ethics"],
    therapeuticAreas: ["pediatric oncology", "pediatric cardiology", "pediatric neurology", "pediatric immunology"],
    aiModelTypes: ["clinical decision support", "predictive analytics", "pediatric modeling"],
    deploymentScenarios: ["clinical trial", "research", "regulatory submission"],
    personas: ["clinical researcher", "pediatrician", "regulatory affairs", "pharmacokineticist"],
    tags: ["ich", "e11", "pediatric", "clinical trials", "children"]
  },

  // ICH E17 (Multi-Regional Clinical Trials)
  {
    question: "What are the ICH E17 guidelines for multi-regional clinical trials?",
    variations: [
      "ICH E17 multi-regional trial guidelines",
      "What does ICH E17 require for MRCTs?",
      "ICH E17 multi-regional clinical trials",
      "Multi-regional trials per ICH E17",
      "ICH E17 MRCT requirements",
      "What are ICH E17 MRCT guidelines?",
      "Global clinical trials ICH E17",
      "ICH E17 international trial design"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH E17 multi-regional clinical trial guidelines include: 1) Regional consistency in study design and endpoints, 2) Appropriate sample size allocation across regions, 3) Regional regulatory requirements harmonization, 4) Ethnic sensitivity assessment and bridging studies, 5) Regional data analysis and reporting, 6) Quality standards across all regions, 7) Risk management and monitoring plans, 8) Post-marketing commitments and pharmacovigilance. Ensures efficient global drug development while meeting regional needs.",
    actionItems: [
      "Harmonize study design across regions",
      "Plan appropriate regional sample sizes",
      "Assess ethnic sensitivity requirements",
      "Establish regional monitoring plans",
      "Develop regional analysis strategies",
      "Plan post-marketing surveillance"
    ],
    impactLevel: "high",
    sources: ["ICH E17 Multi-Regional Clinical Trials", "FDA International Guidance", "EMA Clinical Trials Regulation"],
    keywords: ["ich", "e17", "multi-regional", "mrct", "global", "international", "regional", "ethnic sensitivity"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["clinical decision support", "predictive analytics", "global trial optimization"],
    deploymentScenarios: ["clinical trial", "research", "regulatory submission"],
    personas: ["clinical researcher", "regulatory affairs", "global project manager", "statistician"],
    tags: ["ich", "e17", "multi-regional", "clinical trials", "global"]
  },

  // ICH Q8 (Pharmaceutical Development)
  {
    question: "What are the ICH Q8 pharmaceutical development guidelines?",
    variations: [
      "ICH Q8 pharmaceutical development",
      "What does ICH Q8 require for drug development?",
      "ICH Q8 quality by design",
      "Pharmaceutical development per ICH Q8",
      "ICH Q8 drug development guidelines",
      "What are ICH Q8 development requirements?",
      "Quality by design ICH Q8",
      "ICH Q8 pharmaceutical quality"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH Q8 pharmaceutical development guidelines emphasize: 1) Quality by Design (QbD) principles, 2) Risk assessment and management throughout development, 3) Design space definition for manufacturing parameters, 4) Process analytical technology (PAT) implementation, 5) Continuous improvement and lifecycle management, 6) Enhanced pharmaceutical development reports, 7) Real-time release testing approaches, 8) Regulatory flexibility based on enhanced knowledge. Focuses on building quality into products rather than testing quality in.",
    actionItems: [
      "Implement Quality by Design principles",
      "Conduct comprehensive risk assessments",
      "Define manufacturing design spaces",
      "Implement process analytical technology",
      "Develop enhanced pharmaceutical reports",
      "Establish continuous improvement processes"
    ],
    impactLevel: "high",
    sources: ["ICH Q8 Pharmaceutical Development", "FDA Quality by Design Guidance", "EMA Quality Guidelines"],
    keywords: ["ich", "q8", "pharmaceutical development", "quality by design", "qbd", "risk assessment", "design space", "pat"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["process optimization", "quality analytics", "predictive modeling"],
    deploymentScenarios: ["manufacturing", "quality control", "regulatory submission"],
    personas: ["pharmaceutical scientist", "quality assurance", "regulatory affairs", "manufacturing"],
    tags: ["ich", "q8", "pharmaceutical development", "quality by design"]
  },

  // ICH Q9 (Quality Risk Management)
  {
    question: "What are the ICH Q9 quality risk management principles?",
    variations: [
      "ICH Q9 quality risk management",
      "What does ICH Q9 require for risk management?",
      "ICH Q9 risk assessment guidelines",
      "Quality risk management per ICH Q9",
      "ICH Q9 risk management principles",
      "What are ICH Q9 risk guidelines?",
      "Risk assessment ICH Q9",
      "ICH Q9 quality risk principles"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH Q9 quality risk management principles include: 1) Risk identification, analysis, and evaluation, 2) Risk control and mitigation strategies, 3) Risk communication and review processes, 4) Risk management tools (FMEA, HACCP, HAZOP), 5) Integration with quality systems and processes, 6) Risk-based decision making, 7) Documentation and record keeping, 8) Continuous improvement and monitoring. Provides systematic approach to managing quality risks throughout product lifecycle.",
    actionItems: [
      "Implement systematic risk identification processes",
      "Use appropriate risk assessment tools",
      "Develop risk control strategies",
      "Establish risk communication protocols",
      "Integrate risk management with quality systems",
      "Document all risk management activities"
    ],
    impactLevel: "high",
    sources: ["ICH Q9 Quality Risk Management", "FDA Risk Management Guidance", "EMA Quality Guidelines"],
    keywords: ["ich", "q9", "risk management", "quality risk", "risk assessment", "fmea", "haccp", "hazop"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["risk analytics", "predictive modeling", "quality optimization"],
    deploymentScenarios: ["manufacturing", "quality control", "regulatory submission"],
    personas: ["quality assurance", "risk manager", "regulatory affairs", "pharmaceutical scientist"],
    tags: ["ich", "q9", "risk management", "quality risk"]
  },

  // ICH Q10 (Pharmaceutical Quality System)
  {
    question: "What are the ICH Q10 pharmaceutical quality system requirements?",
    variations: [
      "ICH Q10 pharmaceutical quality system",
      "What does ICH Q10 require for quality systems?",
      "ICH Q10 quality management system",
      "Pharmaceutical quality system per ICH Q10",
      "ICH Q10 quality system guidelines",
      "What are ICH Q10 quality requirements?",
      "Quality management ICH Q10",
      "ICH Q10 quality system principles"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH Q10 pharmaceutical quality system requirements include: 1) Management responsibility and leadership commitment, 2) Quality policy and objectives establishment, 3) Resource management and competency development, 4) Product realization and process management, 5) Measurement, analysis, and improvement processes, 6) Management review and continuous improvement, 7) Change management and control systems, 8) Knowledge management and organizational learning. Provides framework for effective quality management throughout product lifecycle.",
    actionItems: [
      "Establish clear management responsibility",
      "Develop quality policy and objectives",
      "Implement resource management systems",
      "Create product realization processes",
      "Set up measurement and analysis systems",
      "Establish change management procedures"
    ],
    impactLevel: "high",
    sources: ["ICH Q10 Pharmaceutical Quality System", "FDA Quality System Guidance", "EMA Quality Guidelines"],
    keywords: ["ich", "q10", "quality system", "pharmaceutical quality", "management responsibility", "continuous improvement"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["quality analytics", "process optimization", "management systems"],
    deploymentScenarios: ["manufacturing", "quality control", "regulatory submission"],
    personas: ["quality assurance", "quality manager", "regulatory affairs", "operations manager"],
    tags: ["ich", "q10", "quality system", "pharmaceutical quality"]
  },

  // ICH M4 (Common Technical Document)
  {
    question: "What is the ICH M4 Common Technical Document structure?",
    variations: [
      "ICH M4 Common Technical Document",
      "What is ICH M4 CTD structure?",
      "ICH M4 regulatory submission format",
      "Common Technical Document per ICH M4",
      "ICH M4 CTD guidelines",
      "What are ICH M4 submission requirements?",
      "Regulatory submission ICH M4",
      "ICH M4 document organization"
    ],
    category: "regulatory",
    subcategory: "ich",
    answer: "ICH M4 Common Technical Document (CTD) structure includes: 1) Module 1: Regional administrative information, 2) Module 2: Quality, nonclinical, and clinical summaries, 3) Module 3: Quality data (manufacturing, analytical), 4) Module 4: Nonclinical study reports, 5) Module 5: Clinical study reports. Provides harmonized format for regulatory submissions across ICH regions, facilitating simultaneous submissions and regulatory review processes.",
    actionItems: [
      "Organize documents according to CTD structure",
      "Prepare comprehensive quality summaries",
      "Compile nonclinical study reports",
      "Organize clinical study reports",
      "Ensure regional administrative compliance",
      "Validate CTD format and completeness"
    ],
    impactLevel: "critical",
    sources: ["ICH M4 Common Technical Document", "FDA CTD Guidance", "EMA CTD Guidelines"],
    keywords: ["ich", "m4", "ctd", "common technical document", "regulatory submission", "module 1", "module 2", "module 3"],
    therapeuticAreas: ["oncology", "cardiology", "neurology", "immunology", "rare disease"],
    aiModelTypes: ["document management", "regulatory analytics", "submission optimization"],
    deploymentScenarios: ["regulatory submission", "document management", "quality assurance"],
    personas: ["regulatory affairs", "document specialist", "quality assurance", "clinical researcher"],
    tags: ["ich", "m4", "ctd", "regulatory submission"]
  }
];

// Generate additional ICH-related questions with variations
function generateAdditionalICHQuestions() {
  const additionalQuestions = [];
  
  // Add variations for each base question
  ichTrainingQuestions.forEach(baseQuestion => {
    // Generate role-specific variations
    const roles = ['clinical researcher', 'regulatory affairs', 'quality assurance', 'data scientist', 'statistician'];
    roles.forEach(role => {
      additionalQuestions.push({
        ...baseQuestion,
        question: `As a ${role}, ${baseQuestion.question.toLowerCase()}`,
        variations: baseQuestion.variations.map(v => `As a ${role}, ${v.toLowerCase()}`),
        personas: [...(baseQuestion.personas || []), role]
      });
    });
    
    // Generate urgency-based variations
    const urgencyPhrases = ['urgently', 'immediately', 'asap', 'quickly', 'right away'];
    urgencyPhrases.forEach(phrase => {
      additionalQuestions.push({
        ...baseQuestion,
        question: `I need to know ${phrase}: ${baseQuestion.question}`,
        variations: baseQuestion.variations.map(v => `I need to know ${phrase}: ${v}`),
        impactLevel: 'critical'
      });
    });
    
    // Generate scenario-based variations
    const scenarios = [
      'for my upcoming clinical trial',
      'for regulatory submission',
      'for FDA approval',
      'for EMA submission',
      'for our new drug development',
      'for compliance audit'
    ];
    scenarios.forEach(scenario => {
      additionalQuestions.push({
        ...baseQuestion,
        question: `${baseQuestion.question} ${scenario}`,
        variations: baseQuestion.variations.map(v => `${v} ${scenario}`),
        deploymentScenarios: [...(baseQuestion.deploymentScenarios || []), scenario.replace('for ', '').replace(' ', '-')]
      });
    });
  });
  
  return additionalQuestions;
}

// Main seeding function
async function seedICHTrainingData() {
  try {
    console.log('🌱 Starting ICH-specific training data seeding...');
    
    // Generate comprehensive ICH training dataset
    const allICHQuestions = [
      ...ichTrainingQuestions,
      ...generateAdditionalICHQuestions()
    ];
    
    console.log(`📊 Generated ${allICHQuestions.length} ICH training questions`);
    
    // Seed ICH training data
    const batchSize = 50;
    for (let i = 0; i < allICHQuestions.length; i += batchSize) {
      const batch = allICHQuestions.slice(i, i + batchSize);
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
        })),
        skipDuplicates: true
      });
      console.log(`✅ Seeded ICH batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allICHQuestions.length / batchSize)}`);
    }
    
    console.log('🎉 ICH training data seeding completed successfully!');
    console.log(`📊 Total ICH training questions: ${allICHQuestions.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding ICH training data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedICHTrainingData()
    .then(() => {
      console.log('✅ ICH training data seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ ICH training data seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedICHTrainingData };
