/**
 * Contextual Assistant for AskRexi
 * Integrates with Smart Navigation to provide tab-aware contextual assistance
 */

import { smartNavigation } from '../navigation/smartNavigation';

export interface AskRexiContext {
  currentTab: string;
  sourceTab?: string;
  userId?: string;
  assessmentId?: string;
  currentProgress?: number;
  sessionData?: any;
  personalizedContent?: {
    suggestedQuestions: string[];
    recentTopics: string[];
    contextualHints: string[];
  };
}

export interface ContextualEnhancement {
  contextualQuestions: string[];
  personalizedGreeting: string;
  relevantTopics: string[];
  suggestedActions: Array<{
    name: string;
    description: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export class ContextualAssistant {
  private static instance: ContextualAssistant;

  static getInstance(): ContextualAssistant {
    if (!ContextualAssistant.instance) {
      ContextualAssistant.instance = new ContextualAssistant();
    }
    return ContextualAssistant.instance;
  }

  /**
   * Get enhanced context for AskRexi based on current navigation state
   */
  getEnhancedContext(): AskRexiContext {
    const navContext = smartNavigation.getCurrentContext();
    
    if (!navContext) {
      return this.getDefaultContext();
    }

    return {
      currentTab: this.getCurrentTab(),
      sourceTab: navContext.sourceTab,
      userId: navContext.userId,
      assessmentId: navContext.assessmentId,
      currentProgress: navContext.currentProgress,
      sessionData: navContext.sessionData,
      personalizedContent: this.generatePersonalizedContent(navContext)
    };
  }

  /**
   * Generate contextual enhancements based on current context
   */
  generateContextualEnhancement(context: AskRexiContext): ContextualEnhancement {
    const enhancements: ContextualEnhancement = {
      contextualQuestions: [],
      personalizedGreeting: this.generateGreeting(context),
      relevantTopics: [],
      suggestedActions: []
    };

    // Tab-specific contextual questions
    enhancements.contextualQuestions = this.getTabSpecificQuestions(context.currentTab, context);
    
    // Relevant topics based on context
    enhancements.relevantTopics = this.getRelevantTopics(context);
    
    // Suggested actions based on current state
    enhancements.suggestedActions = this.getSuggestedActions(context);

    return enhancements;
  }

  /**
   * Get default context when no navigation context is available
   */
  private getDefaultContext(): AskRexiContext {
    return {
      currentTab: 'askrexi',
      personalizedContent: {
        suggestedQuestions: this.getDefaultQuestions(),
        recentTopics: [],
        contextualHints: []
      }
    };
  }

  /**
   * Get current tab from pathname
   */
  private getCurrentTab(): string {
    if (typeof window === 'undefined') return 'askrexi';
    
    const pathname = window.location.pathname;
    if (pathname === '/') return 'dashboard';
    if (pathname.startsWith('/assessment')) return 'assessment';
    if (pathname.startsWith('/analytics')) return 'analytics';
    if (pathname.startsWith('/regulatory')) return 'regulatory';
    if (pathname.startsWith('/collaboration')) return 'collaboration';
    if (pathname.startsWith('/remediation')) return 'remediation';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'askrexi';
  }

  /**
   * Generate personalized greeting based on context
   */
  private generateGreeting(context: AskRexiContext): string {
    const greetings = {
      dashboard: "Hi! I can help you understand your compliance metrics and guide your next steps.",
      assessment: "Hello! I'm here to assist with your assessment questions and compliance requirements.",
      analytics: "Hi there! I can help you interpret your compliance analytics and identify trends.",
      regulatory: "Hello! I can provide guidance on regulatory updates and compliance requirements.",
      collaboration: "Hi! I can help facilitate team discussions and answer compliance questions.",
      remediation: "Hello! I'm here to help with remediation planning and gap analysis.",
      settings: "Hi! I can assist with system configuration and compliance settings.",
      askrexi: "Hello! I'm AskRexi, your intelligent compliance assistant. How can I help you today?"
    };

    const baseGreeting = greetings[context.currentTab as keyof typeof greetings] || greetings.askrexi;
    
    if (context.assessmentId) {
      return `${baseGreeting} I see you're working on an assessment - I can provide specific guidance for your compliance needs.`;
    }
    
    if (context.sourceTab && context.sourceTab !== context.currentTab) {
      return `${baseGreeting} I noticed you came from ${this.getTabDisplayName(context.sourceTab)} - I can help with related questions.`;
    }

    return baseGreeting;
  }

  /**
   * Get tab-specific contextual questions
   */
  private getTabSpecificQuestions(currentTab: string, context: AskRexiContext): string[] {
    const questionSets = {
      dashboard: [
        "What do these compliance metrics mean for my organization?",
        "How can I improve my assessment completion rate?",
        "What are the critical compliance gaps I should address?",
        "How do I interpret these trend indicators?"
      ],
      assessment: [
        "How do I improve my AI model validation coverage?",
        "What are the critical compliance requirements for my assessment?",
        "What evidence do I need to provide for this section?",
        "How can I resolve these compliance blockers?"
      ],
      analytics: [
        "What do these compliance trends mean for my organization?",
        "How can I improve my assessment completion rate?",
        "What are the key performance indicators I should focus on?",
        "How do I benchmark against industry standards?"
      ],
      regulatory: [
        "How do recent regulatory changes affect my assessments?",
        "What are the latest FDA guidance updates?",
        "How do I stay compliant with new regulations?",
        "What are the implications of this regulatory update?"
      ],
      collaboration: [
        "How can I improve team collaboration on assessments?",
        "What are the best practices for compliance team coordination?",
        "How do I manage assessment reviews effectively?",
        "What tools can help with compliance collaboration?"
      ],
      remediation: [
        "How do I create an effective remediation plan?",
        "What are the priority actions for compliance gaps?",
        "How do I estimate remediation timelines?",
        "What resources do I need for compliance improvements?"
      ]
    };

    const questions = questionSets[currentTab as keyof typeof questionSets] || [];
    
    // Add context-specific questions
    if (context.assessmentId) {
      questions.unshift("What are the next steps for my current assessment?");
    }
    
    if (context.currentProgress && context.currentProgress > 0) {
      questions.unshift(`I'm ${context.currentProgress}% through my assessment - what should I focus on next?`);
    }

    return questions.slice(0, 4); // Limit to 4 questions
  }

  /**
   * Get relevant topics based on context
   */
  private getRelevantTopics(context: AskRexiContext): string[] {
    const topics = [];
    
    if (context.currentTab === 'assessment') {
      topics.push('AI Model Validation', 'Clinical Trial Compliance', 'Data Privacy', 'Quality Assurance');
    } else if (context.currentTab === 'analytics') {
      topics.push('Performance Metrics', 'Trend Analysis', 'Benchmarking', 'Compliance Scoring');
    } else if (context.currentTab === 'regulatory') {
      topics.push('FDA Guidance', 'EMA Regulations', 'ICH Standards', 'Regulatory Updates');
    } else {
      topics.push('Compliance Best Practices', 'Regulatory Intelligence', 'Assessment Guidance', 'Risk Management');
    }

    return topics;
  }

  /**
   * Get suggested actions based on context (PRIORITY FEATURE)
   */
  private getSuggestedActions(context: AskRexiContext): Array<{
    name: string;
    description: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const actions = [];

    // Check if we have valid context for enhanced suggestions
    const hasValidContext = context && (
      context.currentTab || 
      context.assessmentId || 
      context.userId
    );

    if (!hasValidContext) {
      // Graceful degradation - provide fallback actions
      return [
        {
          name: 'Start Assessment',
          description: 'Begin a new compliance assessment',
          action: 'navigate:/assessment',
          priority: 'high' as const
        },
        {
          name: 'Browse Regulations',
          description: 'Explore regulatory intelligence',
          action: 'navigate:/regulatory',
          priority: 'medium' as const
        },
        {
          name: 'View Dashboard',
          description: 'Check your compliance overview',
          action: 'navigate:/dashboard',
          priority: 'medium' as const
        }
      ];
    }

    // HIGH PRIORITY: Assessment-related actions
    if (context.assessmentId) {
      actions.push({
        name: 'Continue Assessment',
        description: 'Resume your current assessment',
        action: 'navigate:/assessment',
        priority: 'high' as const
      });
    }

    // Tab-specific HIGH PRIORITY actions
    switch (context.currentTab) {
      case 'dashboard':
        actions.push({
          name: 'Deep Dive Analysis',
          description: 'Get detailed compliance insights',
          action: 'deep_dive_analysis',
          priority: 'high' as const
        });
        actions.push({
          name: 'Start New Assessment',
          description: 'Begin a new compliance assessment',
          action: 'navigate:/assessment',
          priority: 'medium' as const
        });
        break;
      case 'assessment':
        actions.push({
          name: 'Get Help with Current Section',
          description: 'Assistance with current assessment section',
          action: 'section_help',
          priority: 'high' as const
        });
        actions.push({
          name: 'Review Progress',
          description: 'Check your assessment progress',
          action: 'show_progress',
          priority: 'medium' as const
        });
        break;
      case 'regulatory':
        actions.push({
          name: 'Impact Analysis',
          description: 'Analyze regulatory impact on compliance',
          action: 'impact_analysis',
          priority: 'high' as const
        });
        actions.push({
          name: 'Latest Updates',
          description: 'View recent regulatory changes',
          action: 'latest_updates',
          priority: 'medium' as const
        });
        break;
    }

    if (context.currentTab === 'analytics') {
      actions.push({
        name: 'View Detailed Analytics',
        description: 'Explore comprehensive compliance analytics',
        action: 'navigate:/analytics',
        priority: 'medium' as const
      });
    }

    // Always include general actions
    actions.push({
      name: 'Get Compliance Guidance',
      description: 'Ask about specific compliance requirements',
      action: 'chat:compliance_guidance',
      priority: 'low' as const
    });

    return actions;
  }

  /**
   * Get default questions when no context is available
   */
  private getDefaultQuestions(): string[] {
    return [
      "What are the key FDA AI/ML guidance requirements?",
      "How do I prepare for a compliance assessment?",
      "What are the latest regulatory updates?",
      "How can I improve my compliance score?"
    ];
  }

  /**
   * Generate personalized content based on navigation context
   */
  private generatePersonalizedContent(navContext: any): AskRexiContext['personalizedContent'] {
    return {
      suggestedQuestions: this.getTabSpecificQuestions(this.getCurrentTab(), {
        currentTab: this.getCurrentTab(),
        sourceTab: navContext.sourceTab,
        assessmentId: navContext.assessmentId,
        currentProgress: navContext.currentProgress
      }),
      recentTopics: navContext.sessionData?.recentTopics || [],
      contextualHints: this.getContextualHints(navContext)
    };
  }

  /**
   * Get contextual hints based on navigation context
   */
  private getContextualHints(navContext: any): string[] {
    const hints = [];
    
    if (navContext.sourceTab) {
      hints.push(`You came from ${this.getTabDisplayName(navContext.sourceTab)} - I can help with related questions.`);
    }
    
    if (navContext.assessmentId) {
      hints.push('I can provide specific guidance for your current assessment.');
    }
    
    if (navContext.currentProgress) {
      hints.push(`You're ${navContext.currentProgress}% through your assessment.`);
    }

    return hints;
  }

  /**
   * Get display name for tab
   */
  private getTabDisplayName(tab: string): string {
    const displayNames: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'assessment': 'Assessment',
      'analytics': 'Analytics',
      'regulatory': 'Regulatory Intelligence',
      'collaboration': 'Collaboration',
      'remediation': 'Remediation',
      'settings': 'Settings'
    };
    
    return displayNames[tab] || tab;
  }
}

// Export singleton instance
export const contextualAssistant = ContextualAssistant.getInstance();

// React hook for using contextual assistant
export function useContextualAssistant() {
  const getEnhancedContext = () => {
    return contextualAssistant.getEnhancedContext();
  };

  const getContextualEnhancement = (context: AskRexiContext) => {
    return contextualAssistant.generateContextualEnhancement(context);
  };

  return {
    getEnhancedContext,
    getContextualEnhancement
  };
}
