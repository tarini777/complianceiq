/**
 * AskRexi Chatbot API - ComplianceIQ System
 * Intelligent regulatory compliance assistant with training data and caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface AskRexiQuery {
  question: string;
  context?: {
    companyId?: string;
    therapeuticArea?: string;
    persona?: string;
    assessmentId?: string;
    conversationHistory?: ConversationMessage[];
    userPreferences?: {
      responseStyle?: 'detailed' | 'concise' | 'conversational';
      expertiseLevel?: 'beginner' | 'intermediate' | 'expert';
      focusAreas?: string[];
    };
  };
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: any;
}

interface AskRexiResponse {
  answer: string;
  category: 'regulatory' | 'assessment' | 'analytics' | 'general';
  sources: {
    type: 'regulation' | 'guidance' | 'analytics' | 'assessment';
    title: string;
    content: string;
    url?: string;
  }[];
  actionItems: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  relatedQuestions: string[];
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: AskRexiQuery = await request.json();
    const { question, context } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Question is required'
      }, { status: 400 });
    }

    const normalizedQuestion = question.trim().toLowerCase();
    
    // Check if question is non-contextual (weather, sports, etc.)
    const isNonContextual = await checkNonContextualQuestion(normalizedQuestion);
    if (isNonContextual) {
      return NextResponse.json({
        success: true,
        data: {
          answer: `I'm AskRexi, your regulatory compliance assistant. I specialize in helping with regulatory intelligence, assessment support, and analytics for pharmaceutical AI compliance. I can't help with ${isNonContextual.category} questions, but I'd be happy to assist you with compliance-related questions!`,
          category: 'general',
          sources: [],
          actionItems: [
            'Ask about FDA, EMA, or ICH regulations',
            'Get guidance on assessment questions',
            'Request analytics and performance insights',
            'Learn about compliance requirements'
          ],
          impactLevel: 'low',
          relatedQuestions: [
            'What are the latest FDA guidelines for AI in healthcare?',
            'How do I complete the data governance assessment section?',
            'What is our current compliance score?',
            'What regulations apply to our therapeutic area?'
          ]
        }
      });
    }

    // Generate question hash for caching
    const questionHash = generateQuestionHash(normalizedQuestion, context);
    
    // Check response cache first
    const cachedResponse = await getCachedResponse(questionHash);
    if (cachedResponse) {
      // Update cache hit count and last accessed
      await updateCacheHit(questionHash);
      
      // Log usage analytics
      await logUsageAnalytics(question, cachedResponse.category, Date.now() - startTime, context);
      
      return NextResponse.json({
        success: true,
        data: cachedResponse,
        cached: true
      });
    }

    // Process the question and generate response
    const response = await processAskRexiQuery(question, context);
    
    // Cache the response
    await cacheResponse(questionHash, question, response);
    
    // Log usage analytics
    await logUsageAnalytics(question, response.category, Date.now() - startTime, context);

    return NextResponse.json({
      success: true,
      data: response,
      cached: false
    });

  } catch (error) {
    console.error('Error processing AskRexi query:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process question',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function processAskRexiQuery(question: string, context?: any): Promise<AskRexiResponse> {
  const normalizedQuestion = question.toLowerCase().trim();
  
  // Analyze conversation context and user intent
  const conversationContext = analyzeConversationContext(question, context);
  const userIntent = analyzeUserIntent(question, conversationContext);
  
  // First, try to find exact or similar matches in training data
  const trainingMatch = await findTrainingDataMatch(normalizedQuestion, context);
  if (trainingMatch) {
    return enhanceResponseWithIntelligence(trainingMatch, userIntent, conversationContext);
  }
  
  // Determine question category with enhanced intelligence
  const category = categorizeQuestionIntelligently(normalizedQuestion, userIntent);
  
  let response: AskRexiResponse;

  switch (category) {
    case 'regulatory':
      response = await handleRegulatoryQueryIntelligently(question, context, userIntent);
      break;
    case 'assessment':
      response = await handleAssessmentQueryIntelligently(question, context, userIntent);
      break;
    case 'analytics':
      response = await handleAnalyticsQueryIntelligently(question, context, userIntent);
      break;
    default:
      response = await handleGeneralQueryIntelligently(question, context, userIntent);
  }

  return enhanceResponseWithIntelligence(response, userIntent, conversationContext);
}

// New helper functions for training data and caching
async function checkNonContextualQuestion(question: string): Promise<{ category: string } | null> {
  // Mock patterns for non-contextual questions
  const patterns = [
    { pattern: 'hello|hi|hey', category: 'greeting' },
    { pattern: 'what is|what are|define', category: 'definition' },
    { pattern: 'how to|how do i', category: 'instruction' },
    { pattern: 'when|where|who', category: 'information' }
  ];
  
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.pattern, 'i');
    if (regex.test(question)) {
      return { category: pattern.category };
    }
  }
  
  return null;
}

function generateQuestionHash(question: string, context?: any): string {
  const contextString = context ? JSON.stringify(context) : '';
  const hashInput = `${question}:${contextString}`;
  return crypto.createHash('sha256').update(hashInput).digest('hex');
}

async function getCachedResponse(questionHash: string): Promise<AskRexiResponse | null> {
  // Mock cache - in a real implementation, this would use Redis or database
  return null;
}

async function cacheResponse(questionHash: string, originalQuestion: string, response: AskRexiResponse): Promise<void> {
  // Mock cache - in a real implementation, this would store in Redis or database
  console.log(`Caching response for question: ${originalQuestion.substring(0, 50)}...`);
}

async function updateCacheHit(questionHash: string): Promise<void> {
  // Mock cache hit update - in a real implementation, this would update cache statistics
  console.log(`Cache hit for question hash: ${questionHash.substring(0, 8)}...`);
}

async function logUsageAnalytics(question: string, category: string, responseTime: number, context?: any): Promise<void> {
  // Mock analytics logging - in a real implementation, this would store analytics data
  console.log(`Analytics: ${category} question (${responseTime}ms): ${question.substring(0, 50)}...`);
}

async function findTrainingDataMatch(question: string, context?: any): Promise<AskRexiResponse | null> {
  // Mock training data - in a real implementation, this would query the training database
  const mockTrainingData = [
    {
      question: "what is ai compliance",
      answer: "AI compliance refers to ensuring that artificial intelligence systems meet regulatory requirements, ethical standards, and industry best practices.",
      category: "definition",
      keywords: ["ai", "compliance", "regulatory"]
    },
    {
      question: "how to validate ai models",
      answer: "AI model validation involves testing model performance, bias detection, explainability assessment, and regulatory compliance verification.",
      category: "process",
      keywords: ["validation", "models", "testing"]
    }
  ];
  
  const lowerQuestion = question.toLowerCase();
  
  // Try exact match
  for (const data of mockTrainingData) {
    if (data.question === lowerQuestion) {
      return {
        answer: data.answer,
        category: data.category as 'regulatory' | 'assessment' | 'analytics' | 'general',
        sources: [{
          type: 'guidance' as const,
          title: 'Training Data',
          content: data.answer,
          url: undefined
        }],
        actionItems: [],
        impactLevel: 'medium' as const,
        relatedQuestions: []
      };
    }
  }
  
  // Try keyword matching
  const keywords = extractKeywords(question);
  for (const data of mockTrainingData) {
    const hasKeywordMatch = keywords.some(keyword => 
      data.keywords.some(dataKeyword => dataKeyword.includes(keyword))
    );
    if (hasKeywordMatch) {
      return {
        answer: data.answer,
        category: data.category as 'regulatory' | 'assessment' | 'analytics' | 'general',
        sources: [{
          type: 'guidance' as const,
          title: 'Training Data',
          content: data.answer,
          url: undefined
        }],
        actionItems: [],
        impactLevel: 'medium' as const,
        relatedQuestions: []
      };
    }
  }
  
  return null;
}

function convertTrainingDataToResponse(trainingData: any): AskRexiResponse {
  return {
    answer: trainingData.answer,
    category: trainingData.category as any,
    sources: trainingData.sources.map((source: string) => ({
      type: 'regulation' as const,
      title: source,
      content: `Information from ${source}`,
      url: `/regulatory/${source.toLowerCase().replace(/\s+/g, '-')}`
    })),
    actionItems: trainingData.actionItems,
    impactLevel: trainingData.impactLevel as any,
    relatedQuestions: generateRelatedQuestions(trainingData.category, trainingData.question)
  };
}

function extractKeywords(question: string): string[] {
  const contextualKeywords = [
    'fda', 'ema', 'ich', 'regulation', 'guideline', 'compliance', 'regulatory',
    'assessment', 'question', 'section', 'requirement', 'evidence', 'documentation',
    'analytics', 'report', 'performance', 'score', 'trend', 'metric', 'dashboard',
    'ai', 'artificial intelligence', 'machine learning', 'model', 'algorithm',
    'pharmaceutical', 'pharma', 'drug', 'medicine', 'therapeutic', 'clinical',
    'quality', 'governance', 'risk', 'safety', 'efficacy', 'validation'
  ];
  
  const questionLower = question.toLowerCase();
  return contextualKeywords.filter(keyword => questionLower.includes(keyword));
}

// Intelligent conversation analysis functions
function analyzeConversationContext(question: string, context?: any): any {
  const conversationHistory = context?.conversationHistory || [];
  const userPreferences = context?.userPreferences || {};
  
  // Analyze recent conversation topics
  const recentTopics = conversationHistory
    .slice(-5) // Last 5 messages
    .map((msg: ConversationMessage) => extractKeywords(msg.content))
    .flat();
  
  // Determine conversation flow
  const isFollowUp = isFollowUpQuestion(question, conversationHistory);
  const isClarification = isClarificationQuestion(question);
  const isUrgent = isUrgentQuestion(question);
  
  return {
    recentTopics,
    isFollowUp,
    isClarification,
    isUrgent,
    userPreferences,
    conversationLength: conversationHistory.length
  };
}

function analyzeUserIntent(question: string, conversationContext: any): any {
  const questionLower = question.toLowerCase();
  
  // Intent patterns
  const intents = {
    seekingInformation: /what|how|when|where|why|which|tell me|explain|describe/i,
    requestingGuidance: /help|guide|assist|support|advice|recommend|suggest/i,
    askingForClarification: /clarify|explain more|what do you mean|can you elaborate/i,
    requestingExamples: /example|sample|show me|demonstrate|illustrate/i,
    comparingOptions: /compare|difference|versus|vs|better|best|which is/i,
    seekingValidation: /correct|right|accurate|valid|proper|appropriate/i,
    requestingAction: /do|create|make|build|implement|start|begin/i,
    expressingConcern: /concern|worry|issue|problem|challenge|difficulty/i
  };
  
  const detectedIntents = Object.entries(intents)
    .filter(([_, pattern]) => pattern.test(question))
    .map(([intent, _]) => intent);
  
  // Determine expertise level from question complexity
  const expertiseLevel = determineExpertiseLevel(question);
  
  // Determine urgency
  const urgency = conversationContext.isUrgent ? 'high' : 
                  /urgent|asap|immediately|quickly|soon/i.test(question) ? 'medium' : 'low';
  
  return {
    intents: detectedIntents,
    expertiseLevel,
    urgency,
    isFollowUp: conversationContext.isFollowUp,
    isClarification: conversationContext.isClarification
  };
}

function isFollowUpQuestion(question: string, history: ConversationMessage[]): boolean {
  if (history.length === 0) return false;
  
  const followUpIndicators = [
    'also', 'additionally', 'furthermore', 'moreover', 'what about', 'how about',
    'can you also', 'in addition', 'besides', 'on top of that', 'and', 'but',
    'however', 'on the other hand', 'alternatively', 'instead'
  ];
  
  const questionLower = question.toLowerCase();
  return followUpIndicators.some(indicator => questionLower.includes(indicator));
}

function isClarificationQuestion(question: string): boolean {
  const clarificationPatterns = [
    /what do you mean/i,
    /can you clarify/i,
    /can you explain/i,
    /i don't understand/i,
    /could you elaborate/i,
    /what does that mean/i,
    /can you be more specific/i
  ];
  
  return clarificationPatterns.some(pattern => pattern.test(question));
}

function isUrgentQuestion(question: string): boolean {
  const urgentPatterns = [
    /urgent|asap|immediately|quickly|emergency|critical|important|deadline/i
  ];
  
  return urgentPatterns.some(pattern => pattern.test(question));
}

function determineExpertiseLevel(question: string): 'beginner' | 'intermediate' | 'expert' {
  const expertTerms = [
    'algorithm', 'architecture', 'implementation', 'optimization', 'scalability',
    'microservices', 'kubernetes', 'docker', 'api', 'endpoint', 'middleware',
    'database', 'schema', 'migration', 'indexing', 'query optimization'
  ];
  
  const beginnerTerms = [
    'what is', 'how do i', 'beginner', 'new to', 'learning', 'tutorial',
    'introduction', 'basics', 'simple', 'easy', 'step by step'
  ];
  
  const questionLower = question.toLowerCase();
  
  const expertCount = expertTerms.filter(term => questionLower.includes(term)).length;
  const beginnerCount = beginnerTerms.filter(term => questionLower.includes(term)).length;
  
  if (expertCount > beginnerCount && expertCount > 0) return 'expert';
  if (beginnerCount > expertCount && beginnerCount > 0) return 'beginner';
  return 'intermediate';
}

function categorizeQuestionIntelligently(question: string, userIntent: any): 'regulatory' | 'assessment' | 'analytics' | 'general' {
  // Enhanced categorization based on intent and context
  const questionLower = question.toLowerCase();
  
  // Regulatory indicators
  if (userIntent.intents.includes('seekingInformation') && 
      (/fda|ema|ich|regulation|guideline|compliance|regulatory|approval|submission/i.test(questionLower))) {
    return 'regulatory';
  }
  
  // Assessment indicators
  if (userIntent.intents.includes('requestingGuidance') && 
      (/assessment|question|section|requirement|evidence|documentation|validation/i.test(questionLower))) {
    return 'assessment';
  }
  
  // Analytics indicators
  if (userIntent.intents.includes('seekingInformation') && 
      (/analytics|report|performance|score|trend|metric|dashboard|data|statistics/i.test(questionLower))) {
    return 'analytics';
  }
  
  // Fallback to original categorization
  return categorizeQuestion(question);
}

function enhanceResponseWithIntelligence(
  response: AskRexiResponse, 
  userIntent: any, 
  conversationContext: any
): AskRexiResponse {
  // Personalize response based on user intent and context
  let enhancedAnswer = response.answer;
  
  // Add conversational elements
  if (userIntent.isFollowUp) {
    enhancedAnswer = `Great follow-up question! ${enhancedAnswer}`;
  }
  
  if (userIntent.isClarification) {
    enhancedAnswer = `Let me clarify that for you. ${enhancedAnswer}`;
  }
  
  if (userIntent.urgency === 'high') {
    enhancedAnswer = `I understand this is urgent. ${enhancedAnswer}`;
  }
  
  // Adjust complexity based on expertise level
  if (userIntent.expertiseLevel === 'beginner') {
    enhancedAnswer = simplifyLanguage(enhancedAnswer);
  } else if (userIntent.expertiseLevel === 'expert') {
    enhancedAnswer = addTechnicalDetails(enhancedAnswer);
  }
  
  // Add contextual follow-up questions
  const contextualFollowUps = generateContextualFollowUps(userIntent, conversationContext);
  
  return {
    ...response,
    answer: enhancedAnswer,
    relatedQuestions: [...response.relatedQuestions, ...contextualFollowUps]
  };
}

function simplifyLanguage(text: string): string {
  // Replace complex terms with simpler explanations
  const simplifications = {
    'regulatory compliance': 'following rules and regulations',
    'pharmaceutical': 'drug and medicine',
    'clinical validation': 'testing in real medical settings',
    'algorithmic transparency': 'being able to explain how the AI works',
    'data governance': 'managing and protecting data properly'
  };
  
  let simplified = text;
  Object.entries(simplifications).forEach(([complex, simple]) => {
    simplified = simplified.replace(new RegExp(complex, 'gi'), simple);
  });
  
  return simplified;
}

function addTechnicalDetails(text: string): string {
  // Add technical depth for expert users
  const technicalAdditions = {
    'FDA guidelines': 'FDA guidelines (21 CFR Part 11, ICH E6(R3))',
    'data quality': 'data quality (completeness, accuracy, consistency, validity)',
    'model validation': 'model validation (cross-validation, hold-out testing, bias assessment)'
  };
  
  let enhanced = text;
  Object.entries(technicalAdditions).forEach(([term, addition]) => {
    enhanced = enhanced.replace(new RegExp(term, 'gi'), addition);
  });
  
  return enhanced;
}

function generateContextualFollowUps(userIntent: any, conversationContext: any): string[] {
  const followUps: string[] = [];
  
  if (userIntent.intents.includes('seekingInformation')) {
    followUps.push('Would you like me to explain any specific aspect in more detail?');
  }
  
  if (userIntent.intents.includes('requestingGuidance')) {
    followUps.push('Do you need help implementing this in your organization?');
  }
  
  if (userIntent.intents.includes('requestingExamples')) {
    followUps.push('Would you like to see a real-world example of this?');
  }
  
  if (conversationContext.recentTopics.length > 0) {
    followUps.push('How does this relate to your previous questions about compliance?');
  }
  
  return followUps;
}

function categorizeQuestion(question: string): 'regulatory' | 'assessment' | 'analytics' | 'general' {
  const regulatoryKeywords = [
    'regulation', 'fda', 'ema', 'ich', 'guideline', 'compliance', 'regulatory',
    'approval', 'submission', 'clinical trial', 'safety', 'efficacy', 'gcp',
    'gmp', 'glp', 'qms', 'risk management', 'pharmacovigilance'
  ];

  const assessmentKeywords = [
    'assessment', 'question', 'section', 'requirement', 'evidence', 'documentation',
    'validation', 'verification', 'testing', 'protocol', 'standard operating procedure',
    'sop', 'checklist', 'audit', 'inspection'
  ];

  const analyticsKeywords = [
    'analytics', 'report', 'performance', 'score', 'trend', 'metric', 'dashboard',
    'insight', 'recommendation', 'benchmark', 'comparison', 'statistics', 'data'
  ];

  const questionLower = question.toLowerCase();

  if (regulatoryKeywords.some(keyword => questionLower.includes(keyword))) {
    return 'regulatory';
  } else if (assessmentKeywords.some(keyword => questionLower.includes(keyword))) {
    return 'assessment';
  } else if (analyticsKeywords.some(keyword => questionLower.includes(keyword))) {
    return 'analytics';
  }

  return 'general';
}

async function handleRegulatoryQueryIntelligently(question: string, context?: any, userIntent?: any): Promise<AskRexiResponse> {
  // Enhanced regulatory query handling with intelligence
  const response = await handleRegulatoryQuery(question, context);
  
  // Add intelligent context based on user intent
  if (userIntent?.intents.includes('requestingExamples')) {
    response.answer += `\n\n**Real-world Example:** Many pharmaceutical companies have successfully implemented these guidelines by establishing cross-functional AI governance teams that include regulatory affairs, data science, and clinical experts working together to ensure compliance.`;
  }
  
  if (userIntent?.intents.includes('expressingConcern')) {
    response.answer += `\n\n**Don't worry** - these guidelines are designed to help you succeed. I can provide step-by-step guidance to address any specific concerns you have.`;
  }
  
  return response;
}

async function handleAssessmentQueryIntelligently(question: string, context?: any, userIntent?: any): Promise<AskRexiResponse> {
  // Enhanced assessment query handling with intelligence
  const response = await handleAssessmentQuery(question, context);
  
  // Add intelligent context based on user intent
  if (userIntent?.intents.includes('requestingGuidance')) {
    response.answer += `\n\n**Pro Tip:** I recommend tackling the most critical sections first, as they often have dependencies that affect other areas. Would you like me to help you prioritize based on your specific situation?`;
  }
  
  if (userIntent?.expertiseLevel === 'beginner') {
    response.answer += `\n\n**Getting Started:** Don't feel overwhelmed! Start with one section at a time, and I'm here to guide you through each step.`;
  }
  
  return response;
}

async function handleAnalyticsQueryIntelligently(question: string, context?: any, userIntent?: any): Promise<AskRexiResponse> {
  // Enhanced analytics query handling with intelligence
  const response = await handleAnalyticsQuery(question, context);
  
  // Add intelligent context based on user intent
  if (userIntent?.intents.includes('comparingOptions')) {
    response.answer += `\n\n**Comparison Insight:** I can help you compare your performance against industry benchmarks and identify specific areas where you're excelling or need improvement.`;
  }
  
  if (userIntent?.intents.includes('seekingValidation')) {
    response.answer += `\n\n**Validation Check:** Your current performance shows you're on the right track. The key is maintaining consistency and addressing any gaps systematically.`;
  }
  
  return response;
}

async function handleGeneralQueryIntelligently(question: string, context?: any, userIntent?: any): Promise<AskRexiResponse> {
  // Enhanced general query handling with intelligence
  const response = await handleGeneralQuery(question, context);
  
  // Add intelligent context based on user intent
  if (userIntent?.intents.includes('requestingGuidance')) {
    response.answer += `\n\n**Personalized Guidance:** Based on your questions, I can see you're interested in compliance. Let me know your specific area of focus, and I'll provide tailored guidance.`;
  }
  
  if (userIntent?.isFollowUp) {
    response.answer += `\n\n**Building on our conversation:** I'm here to help you dive deeper into any topic. What specific aspect would you like to explore further?`;
  }
  
  return response;
}

async function handleRegulatoryQuery(question: string, context?: any): Promise<AskRexiResponse> {
  // Search regulatory intelligence database
  const regulatoryData = await prisma.regulatoryIntelligence.findMany({
    where: {
      status: 'active',
      OR: [
        { title: { contains: question, mode: 'insensitive' } },
        { content: { contains: question, mode: 'insensitive' } },
        { source: { contains: question, mode: 'insensitive' } }
      ]
    },
    orderBy: { lastUpdated: 'desc' },
    take: 5
  });

  // Search guidance content for regulatory citations
  const guidanceData = await prisma.guidanceContent.findMany({
    where: {
      OR: [
        { title: { contains: question, mode: 'insensitive' } },
        { description: { contains: question, mode: 'insensitive' } },
        { regulatoryCitations: { has: question } }
      ]
    },
    include: {
      question: {
        include: {
          section: true
        }
      }
    },
    take: 3
  });

  const sources = [
    ...regulatoryData.map(reg => ({
      type: 'regulation' as const,
      title: reg.title,
      content: reg.content.substring(0, 300) + '...',
      url: `/regulatory/${reg.id}`
    })),
    ...guidanceData.map(guidance => ({
      type: 'guidance' as const,
      title: guidance.title,
      content: guidance.description,
      url: `/assessment/guidance/${guidance.id}`
    }))
  ];

  // Generate intelligent response
  const answer = generateRegulatoryResponse(question, regulatoryData, guidanceData);
  const actionItems = extractActionItems(regulatoryData, guidanceData);
  const impactLevel = determineImpactLevel(regulatoryData);

  return {
    answer,
    category: 'regulatory',
    sources,
    actionItems,
    impactLevel,
    relatedQuestions: generateRelatedQuestions('regulatory', question)
  };
}

async function handleAssessmentQuery(question: string, context?: any): Promise<AskRexiResponse> {
  // Search assessment questions and guidance
  const questions = await prisma.dynamicQuestion.findMany({
    where: {
      OR: [
        { questionText: { contains: question, mode: 'insensitive' } },
        { responsibleRoles: { has: question } },
        { evidenceRequired: { has: question } }
      ]
    },
    include: {
      section: true,
      guidanceContent: true
    },
    take: 5
  });

  const sources = questions.map(q => ({
    type: 'assessment' as const,
    title: q.questionText.substring(0, 100) + '...',
    content: q.guidanceContent[0]?.description || 'Assessment question guidance',
    url: `/assessment/question/${q.id}`
  }));

  const answer = generateAssessmentResponse(question, questions);
  const actionItems = extractAssessmentActionItems(questions);
  const impactLevel = questions.some(q => (q as any).isProductionBlocker) ? 'critical' : 'medium';

  return {
    answer,
    category: 'assessment',
    sources,
    actionItems,
    impactLevel,
    relatedQuestions: generateRelatedQuestions('assessment', question)
  };
}

async function handleAnalyticsQuery(question: string, context?: any): Promise<AskRexiResponse> {
  // Get analytics data based on context
  const assessments = await prisma.assessment.findMany({
    where: context?.companyId ? { tenantId: context.companyId } : {},
    include: {
      tenant: true,
      responses: {
        include: {
          question: {
            include: {
              section: true
            }
          }
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: 10
  });

  const analyticsData = calculateAnalyticsMetrics(assessments);
  
  const sources = [{
    type: 'analytics' as const,
    title: 'Assessment Analytics Dashboard',
    content: `Performance metrics for ${assessments.length} assessments`,
    url: '/analytics'
  }];

  const answer = generateAnalyticsResponse(question, analyticsData);
  const actionItems = generateAnalyticsRecommendations(analyticsData);
  const impactLevel = 'medium';

  return {
    answer,
    category: 'analytics',
    sources,
    actionItems,
    impactLevel,
    relatedQuestions: generateRelatedQuestions('analytics', question)
  };
}

async function handleGeneralQuery(question: string, context?: any): Promise<AskRexiResponse> {
  return {
    answer: `I'm AskRexi, your regulatory compliance assistant. I can help you with regulatory intelligence, assessment guidance, and analytics insights. Could you please be more specific about what you'd like to know?`,
    category: 'general',
    sources: [],
    actionItems: [
      'Ask about specific FDA or EMA regulations',
      'Get guidance on assessment questions',
      'Request analytics and performance insights',
      'Learn about compliance requirements'
    ],
    impactLevel: 'low',
    relatedQuestions: [
      'What are the latest FDA guidelines for AI in healthcare?',
      'How do I complete the data governance assessment section?',
      'What is our current compliance score?',
      'What regulations apply to our therapeutic area?'
    ]
  };
}

// Helper functions
function generateRegulatoryResponse(question: string, regulatoryData: any[], guidanceData: any[]): string {
  if (regulatoryData.length === 0 && guidanceData.length === 0) {
    return `I couldn't find specific regulatory information for "${question}". However, I can help you with general regulatory guidance. Please try asking about specific regulations like FDA guidelines, EMA requirements, or ICH standards.`;
  }

  let response = `Based on your question about "${question}", here's what I found:\n\n`;

  if (regulatoryData.length > 0) {
    response += `**Regulatory Information:**\n`;
    regulatoryData.forEach((reg, index) => {
      response += `• **${reg.title}** (${reg.source})\n`;
      response += `  - Impact Level: ${reg.impactLevel}\n`;
      response += `  - Effective Date: ${reg.effectiveDate ? new Date(reg.effectiveDate).toLocaleDateString() : 'TBD'}\n`;
      response += `  - Therapeutic Areas: ${reg.therapeuticAreas.join(', ')}\n\n`;
    });
  }

  if (guidanceData.length > 0) {
    response += `**Assessment Guidance:**\n`;
    guidanceData.forEach((guidance, index) => {
      response += `• ${guidance.title}\n`;
      response += `  - Section: ${guidance.question.section.title}\n`;
      response += `  - Description: ${guidance.description}\n\n`;
    });
  }

  return response;
}

function generateAssessmentResponse(question: string, questions: any[]): string {
  if (questions.length === 0) {
    return `I couldn't find specific assessment guidance for "${question}". Please try asking about specific assessment sections, questions, or requirements.`;
  }

  let response = `Here's guidance for your assessment question:\n\n`;

  questions.forEach((q, index) => {
    response += `**${q.questionText.substring(0, 100)}...**\n`;
    response += `• Section: ${q.section.title}\n`;
    response += `• Responsible Roles: ${q.responsibleRoles.join(', ')}\n`;
    response += `• Evidence Required: ${q.evidenceRequired.join(', ')}\n`;
    if (q.isProductionBlocker) {
      response += `• ⚠️ **Production Blocker** - Must be completed for production readiness\n`;
    }
    if (q.guidanceContent.length > 0) {
      response += `• Guidance: ${q.guidanceContent[0].description}\n`;
    }
    response += `\n`;
  });

  return response;
}

function generateAnalyticsResponse(question: string, analyticsData: any): string {
  return `Here are your analytics insights:\n\n` +
    `• **Total Assessments**: ${analyticsData.totalAssessments}\n` +
    `• **Average Score**: ${analyticsData.averageScore}%\n` +
    `• **Completion Rate**: ${analyticsData.completionRate}%\n` +
    `• **Production Ready**: ${analyticsData.productionReady}%\n\n` +
    `**Key Trends:**\n` +
    `• Most challenging sections: ${analyticsData.challengingSections.join(', ')}\n` +
    `• Top performing areas: ${analyticsData.topAreas.join(', ')}\n`;
}

function extractActionItems(regulatoryData: any[], guidanceData: any[]): string[] {
  const actionItems: string[] = [];

  regulatoryData.forEach(reg => {
    if (reg.impactLevel === 'high' || reg.impactLevel === 'critical') {
      actionItems.push(`Review and implement ${reg.title} requirements`);
    }
  });

  guidanceData.forEach(guidance => {
    if (guidance.actionSteps && guidance.actionSteps.length > 0) {
      actionItems.push(...guidance.actionSteps);
    }
  });

  return [...new Set(actionItems)]; // Remove duplicates
}

function extractAssessmentActionItems(questions: any[]): string[] {
  const actionItems: string[] = [];

  questions.forEach(q => {
    if (q.evidenceRequired.length > 0) {
      actionItems.push(`Gather evidence: ${q.evidenceRequired.join(', ')}`);
    }
    if (q.isProductionBlocker) {
      actionItems.push(`Complete this production blocker question immediately`);
    }
    if (q.guidanceContent.length > 0 && q.guidanceContent[0].actionSteps) {
      actionItems.push(...q.guidanceContent[0].actionSteps);
    }
  });

  return [...new Set(actionItems)];
}

function generateAnalyticsRecommendations(analyticsData: any): string[] {
  const recommendations: string[] = [];

  if (analyticsData.averageScore < 70) {
    recommendations.push('Focus on improving overall compliance score');
  }
  if (analyticsData.completionRate < 80) {
    recommendations.push('Increase assessment completion rates');
  }
  if (analyticsData.productionReady < 60) {
    recommendations.push('Address production blockers to improve readiness');
  }

  return recommendations;
}

function determineImpactLevel(regulatoryData: any[]): 'low' | 'medium' | 'high' | 'critical' {
  if (regulatoryData.some(reg => reg.impactLevel === 'critical')) return 'critical';
  if (regulatoryData.some(reg => reg.impactLevel === 'high')) return 'high';
  if (regulatoryData.some(reg => reg.impactLevel === 'medium')) return 'medium';
  return 'low';
}

function calculateAnalyticsMetrics(assessments: any[]): any {
  const totalAssessments = assessments.length;
  const completedAssessments = assessments.filter(a => a.status === 'completed').length;
  const averageScore = totalAssessments > 0 ? 
    Math.round(assessments.reduce((sum, a) => sum + a.currentScore, 0) / totalAssessments) : 0;
  const completionRate = totalAssessments > 0 ? 
    Math.round((completedAssessments / totalAssessments) * 100) : 0;
  const productionReady = totalAssessments > 0 ? 
    Math.round((assessments.filter(a => a.currentScore >= 80).length / totalAssessments) * 100) : 0;

  return {
    totalAssessments,
    completedAssessments,
    averageScore,
    completionRate,
    productionReady,
    challengingSections: ['Data Governance', 'Model Validation'],
    topAreas: ['Documentation', 'Risk Management']
  };
}

function generateRelatedQuestions(category: string, originalQuestion: string): string[] {
  const questionMap: Record<string, string[]> = {
    regulatory: [
      'What are the latest FDA guidelines for AI in healthcare?',
      'How do EMA regulations affect our therapeutic area?',
      'What are the ICH requirements for clinical trials?',
      'What is the impact of new GCP guidelines?'
    ],
    assessment: [
      'How do I complete the data governance section?',
      'What evidence is required for model validation?',
      'Which sections are production blockers?',
      'How do I validate our AI model performance?'
    ],
    analytics: [
      'What is our current compliance score?',
      'How are we performing compared to industry benchmarks?',
      'What are our biggest compliance gaps?',
      'Which sections need the most attention?'
    ],
    general: [
      'What can AskRexi help me with?',
      'How do I get started with compliance assessments?',
      'What regulations apply to our company?',
      'How do I access our analytics dashboard?'
    ]
  };

  return questionMap[category] || questionMap.general;
}
