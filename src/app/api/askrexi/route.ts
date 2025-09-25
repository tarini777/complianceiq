/**
 * AskRexi Chatbot API - ComplianceIQ System
 * Simplified version for Vercel deployment compatibility
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Force Node.js runtime and dynamic behavior to avoid static optimization/prerendering at build time
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  category: 'regulatory' | 'assessment' | 'analytics' | 'general' | 'compliance';
  subcategory?: string;
  sources: {
    type: 'regulation' | 'guidance' | 'analytics' | 'assessment' | 'compliance';
    title: string;
    content: string;
    url?: string;
  }[];
  actionItems: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  relatedQuestions: string[];
  confidence?: number;
  agentUsed?: string;
  subAgentUsed?: string;
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

    // Process the question with simplified response
    const response = await processQuestionSimple(question, context);
    
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

// Simplified question processing for build compatibility
async function processQuestionSimple(question: string, context?: any): Promise<AskRexiResponse> {
  const normalizedQuestion = question.toLowerCase().trim();
  
  // Simple keyword-based categorization
  let category = 'general';
  if (normalizedQuestion.includes('fda') || normalizedQuestion.includes('ema') || normalizedQuestion.includes('regulatory')) {
    category = 'regulatory';
  } else if (normalizedQuestion.includes('assessment') || normalizedQuestion.includes('question')) {
    category = 'assessment';
  } else if (normalizedQuestion.includes('analytics') || normalizedQuestion.includes('score') || normalizedQuestion.includes('performance')) {
    category = 'analytics';
  }

  // Generate a simple response based on category
  let answer = "I'm AskRexi, your regulatory compliance assistant. I can help you with regulatory guidance, assessment questions, and compliance analytics.";
  
  if (category === 'regulatory') {
    answer = "For regulatory guidance, I can help you understand FDA, EMA, and ICH requirements for pharmaceutical AI compliance. What specific regulatory question do you have?";
  } else if (category === 'assessment') {
    answer = "I can help you with assessment questions and provide guidance on completing your compliance evaluation. What assessment area would you like help with?";
  } else if (category === 'analytics') {
    answer = "I can provide insights on your compliance analytics, performance metrics, and recommendations for improvement. What analytics would you like to explore?";
  }

  return {
    answer,
    category,
    sources: [],
    actionItems: [
      'Ask about specific regulations',
      'Get assessment guidance',
      'Request compliance insights'
    ],
    impactLevel: 'medium',
    relatedQuestions: [
      'What are the latest FDA guidelines?',
      'How do I complete the assessment?',
      'What is our compliance score?'
    ]
  };
}

// Simple helper functions
async function checkNonContextualQuestion(question: string): Promise<{ category: string } | null> {
  const questionLower = question.toLowerCase();
  
  // Check if it's a compliance-related question first
  const complianceKeywords = [
    'fda', 'ema', 'ich', 'regulation', 'guideline', 'compliance', 'regulatory',
    'assessment', 'question', 'section', 'requirement', 'evidence', 'documentation',
    'analytics', 'report', 'performance', 'score', 'trend', 'metric', 'dashboard',
    'ai', 'artificial intelligence', 'machine learning', 'model', 'algorithm',
    'pharmaceutical', 'pharma', 'drug', 'medicine', 'therapeutic', 'clinical',
    'quality', 'governance', 'risk', 'safety', 'efficacy', 'validation'
  ];
  
  // If it contains compliance keywords, it's contextual
  if (complianceKeywords.some(keyword => questionLower.includes(keyword))) {
    return null;
  }
  
  // Only check for non-contextual patterns if no compliance keywords found
  const patterns = [
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
  ];
  
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.pattern, 'i');
    if (regex.test(questionLower)) {
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