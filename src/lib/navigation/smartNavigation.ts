/**
 * Smart Navigation System - Context-Aware Navigation
 * Implements the enhancement prompt's smart navigation with context preservation
 */

import { useCallback } from 'react';

interface NavigationContext {
  sourceTab: string;
  userId?: string;
  assessmentId?: string;
  currentProgress?: number;
  breadcrumb: string[];
  timestamp: number;
  sessionData?: any;
}

interface TabCustomization {
  highlightedSections?: string[];
  contextualData?: any;
  personalizedContent?: any;
  quickActions?: Array<{
    name: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export class SmartNavigationManager {
  private static instance: SmartNavigationManager;
  private contextHistory: NavigationContext[] = [];

  static getInstance(): SmartNavigationManager {
    if (!SmartNavigationManager.instance) {
      SmartNavigationManager.instance = new SmartNavigationManager();
    }
    return SmartNavigationManager.instance;
  }

  /**
   * Navigate with context preservation
   */
  navigateWithContext(
    fromTab: string, 
    toTab: string, 
    context: Partial<NavigationContext>
  ): void {
    const navigationContext: NavigationContext = {
      sourceTab: fromTab,
      userId: context.userId,
      assessmentId: context.assessmentId,
      currentProgress: context.currentProgress,
      breadcrumb: this.generateBreadcrumb(fromTab, context),
      timestamp: Date.now(),
      sessionData: context.sessionData
    };

    // Store context in session storage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('navContext', JSON.stringify(navigationContext));
      sessionStorage.setItem('navHistory', JSON.stringify([
        ...this.contextHistory.slice(-4), // Keep last 5 entries
        navigationContext
      ]));
    }

    // Update internal history
    this.contextHistory.push(navigationContext);
    if (this.contextHistory.length > 10) {
      this.contextHistory = this.contextHistory.slice(-10);
    }

    console.log('Smart Navigation: Context preserved for', fromTab, '->', toTab, navigationContext);
  }

  /**
   * Restore context when entering a new tab
   */
  restoreContext(currentTab: string): TabCustomization | null {
    if (typeof window === 'undefined') return null;

    try {
      const contextData = sessionStorage.getItem('navContext');
      if (!contextData) return null;

      const context: NavigationContext = JSON.parse(contextData);
      
      // Check if context is still relevant (within 30 minutes)
      const isRecent = Date.now() - context.timestamp < 30 * 60 * 1000;
      if (!isRecent) {
        this.clearContext();
        return null;
      }

      // Customize current tab experience based on context
      const customization = this.customizeTabExperience(currentTab, context);
      
      console.log('Smart Navigation: Context restored for', currentTab, customization);
      return customization;

    } catch (error) {
      console.error('Smart Navigation: Error restoring context', error);
      return null;
    }
  }

  /**
   * Customize tab experience based on context
   */
  private customizeTabExperience(
    currentTab: string, 
    context: NavigationContext
  ): TabCustomization {
    const customization: TabCustomization = {};

    switch (currentTab) {
      case 'dashboard':
        customization.highlightedSections = this.getDashboardHighlights(context);
        customization.contextualData = {
          sourceAssessment: context.assessmentId,
          userProgress: context.currentProgress
        };
        break;

      case 'assessment':
        customization.contextualData = {
          resumeAssessment: context.assessmentId,
          lastProgress: context.currentProgress
        };
        customization.quickActions = [
          {
            name: 'Resume Assessment',
            action: 'resume',
            priority: 'high'
          },
          {
            name: 'View Progress',
            action: 'progress',
            priority: 'medium'
          }
        ];
        break;

      case 'askrexi':
        customization.contextualData = {
          currentContext: context.sourceTab,
          assessmentContext: context.assessmentId,
          userHistory: context.sessionData?.askRexiHistory
        };
        customization.personalizedContent = {
          suggestedQuestions: this.getContextualQuestions(context),
          recentTopics: context.sessionData?.recentTopics || []
        };
        break;

      case 'analytics':
        customization.highlightedSections = this.getAnalyticsHighlights(context);
        customization.contextualData = {
          focusAssessment: context.assessmentId,
          timeRange: this.getRelevantTimeRange(context)
        };
        break;

      case 'regulatory':
        customization.contextualData = {
          relevantRegulations: this.getRelevantRegulations(context),
          complianceGaps: context.sessionData?.complianceGaps
        };
        break;

      case 'collaboration':
        customization.contextualData = {
          activeSessions: context.sessionData?.activeSessions,
          teamContext: context.sessionData?.teamContext
        };
        break;
    }

    return customization;
  }

  /**
   * Generate breadcrumb navigation
   */
  private generateBreadcrumb(fromTab: string, context: Partial<NavigationContext>): string[] {
    const breadcrumb = ['Dashboard'];
    
    if (context.assessmentId) {
      breadcrumb.push('Assessment');
    }
    
    breadcrumb.push(this.getTabDisplayName(fromTab));
    
    return breadcrumb;
  }

  /**
   * Get tab display name
   */
  private getTabDisplayName(tab: string): string {
    const displayNames: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'assessment': 'Assessment',
      'askrexi': 'AskRexi AI',
      'analytics': 'Analytics',
      'regulatory': 'Regulatory Intelligence',
      'collaboration': 'Collaboration',
      'remediation': 'Remediation',
      'settings': 'Settings'
    };
    
    return displayNames[tab] || tab;
  }

  /**
   * Get dashboard highlights based on context
   */
  private getDashboardHighlights(context: NavigationContext): string[] {
    const highlights = [];
    
    if (context.assessmentId) {
      highlights.push('active-assessments');
      highlights.push('workflow-progress');
    }
    
    if (context.sourceTab === 'assessment') {
      highlights.push('completion-metrics');
    }
    
    if (context.sourceTab === 'analytics') {
      highlights.push('trend-analysis');
    }
    
    return highlights;
  }

  /**
   * Get contextual questions for AskRexi
   */
  private getContextualQuestions(context: NavigationContext): string[] {
    const questions = [];
    
    if (context.sourceTab === 'assessment') {
      questions.push('How do I improve my AI model validation coverage?');
      questions.push('What are the critical compliance requirements for my assessment?');
    }
    
    if (context.sourceTab === 'analytics') {
      questions.push('What do these compliance trends mean for my organization?');
      questions.push('How can I improve my assessment completion rate?');
    }
    
    if (context.sourceTab === 'regulatory') {
      questions.push('How do recent regulatory changes affect my assessments?');
      questions.push('What are the latest FDA guidance updates?');
    }
    
    return questions;
  }

  /**
   * Get analytics highlights based on context
   */
  private getAnalyticsHighlights(context: NavigationContext): string[] {
    const highlights = [];
    
    if (context.assessmentId) {
      highlights.push('assessment-details');
      highlights.push('progress-tracking');
    }
    
    if (context.sourceTab === 'dashboard') {
      highlights.push('overview-metrics');
    }
    
    return highlights;
  }

  /**
   * Get relevant time range for analytics
   */
  private getRelevantTimeRange(context: NavigationContext): string {
    // If coming from assessment, focus on recent data
    if (context.sourceTab === 'assessment') {
      return 'last-30-days';
    }
    
    // If coming from dashboard, show broader view
    if (context.sourceTab === 'dashboard') {
      return 'last-quarter';
    }
    
    return 'last-90-days';
  }

  /**
   * Get relevant regulations based on context
   */
  private getRelevantRegulations(context: NavigationContext): string[] {
    // This would integrate with your regulatory data
    const regulations = [];
    
    if (context.assessmentId) {
      regulations.push('FDA AI/ML Guidance');
      regulations.push('Clinical Trial AI Standards');
    }
    
    return regulations;
  }

  /**
   * Clear navigation context
   */
  clearContext(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('navContext');
      sessionStorage.removeItem('navHistory');
    }
    this.contextHistory = [];
  }

  /**
   * Get navigation history
   */
  getNavigationHistory(): NavigationContext[] {
    return [...this.contextHistory];
  }

  /**
   * Get current context
   */
  getCurrentContext(): NavigationContext | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const contextData = sessionStorage.getItem('navContext');
      return contextData ? JSON.parse(contextData) : null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const smartNavigation = SmartNavigationManager.getInstance();

// React hook for using smart navigation
export function useSmartNavigation() {
  const navigateWithContext = useCallback((
    fromTab: string,
    toTab: string,
    context: Partial<NavigationContext>
  ) => {
    smartNavigation.navigateWithContext(fromTab, toTab, context);
  }, []);

  const restoreContext = useCallback((currentTab: string) => {
    return smartNavigation.restoreContext(currentTab);
  }, []);

  const clearContext = useCallback(() => {
    smartNavigation.clearContext();
  }, []);

  const getCurrentContext = useCallback(() => {
    return smartNavigation.getCurrentContext();
  }, []);

  return {
    navigateWithContext,
    restoreContext,
    clearContext,
    getCurrentContext
  };
}
