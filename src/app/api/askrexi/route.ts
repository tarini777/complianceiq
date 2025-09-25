/**
 * AskRexi Chatbot API - ComplianceIQ System
 * Ultra-simplified version for Vercel deployment compatibility
 */

import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime and dynamic behavior to avoid static optimization/prerendering at build time
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AskRexiQuery {
  question: string;
  context?: any;
}

interface AskRexiResponse {
  answer: string;
  category: 'regulatory' | 'assessment' | 'analytics' | 'general' | 'compliance';
  sources: Array<{
    type: 'regulation' | 'guidance' | 'analytics' | 'assessment' | 'compliance';
    title: string;
    content: string;
    url?: string;
  }>;
  actionItems: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  relatedQuestions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: AskRexiQuery = await request.json();
    const { question } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Question is required'
      }, { status: 400 });
    }

    const normalizedQuestion = question.trim().toLowerCase();
    
    // Simple keyword-based categorization
    let category: 'regulatory' | 'assessment' | 'analytics' | 'general' = 'general';
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

    const response: AskRexiResponse = {
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