/**
 * Learning Insights Engine - ComplianceIQ
 * AI-powered analysis and intelligent recommendations
 */

export interface AssessmentInsight {
  id: string;
  type: 'gap_analysis' | 'pattern_recognition' | 'risk_assessment' | 'opportunity_identification' | 'trend_analysis';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  category: string;
  affectedAreas: string[];
  evidence: string[];
  recommendations: Recommendation[];
  metadata: any;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  estimatedTime: string;
  estimatedCost: string;
  requiredResources: string[];
  implementationSteps: string[];
  successMetrics: string[];
  relatedRegulations: string[];
  relatedSections: string[];
}

export interface GapAnalysis {
  sectionId: string;
  sectionTitle: string;
  currentScore: number;
  targetScore: number;
  gapSize: number;
  gapPercentage: number;
  rootCauses: string[];
  impactAssessment: string;
  remediationPriority: number;
  estimatedEffort: string;
  relatedQuestions: string[];
}

export interface PatternAnalysis {
  patternType: 'compliance_trend' | 'collaboration_pattern' | 'risk_pattern' | 'success_pattern';
  pattern: string;
  frequency: number;
  confidence: number;
  affectedPersonas: string[];
  affectedCompanies: string[];
  implications: string[];
  recommendations: string[];
}

export interface RiskAssessment {
  riskId: string;
  riskTitle: string;
  riskDescription: string;
  probability: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // calculated from probability and impact
  affectedAreas: string[];
  mitigationStrategies: string[];
  monitoringIndicators: string[];
  escalationTriggers: string[];
}

class LearningInsightsEngine {
  private insights: AssessmentInsight[] = [];
  private patterns: PatternAnalysis[] = [];
  private risks: RiskAssessment[] = [];

  constructor() {
    this.loadInsights();
  }

  // Analyze assessment data and generate insights
  async analyzeAssessmentData(assessmentData: any): Promise<AssessmentInsight[]> {
    const newInsights: AssessmentInsight[] = [];

    // Gap Analysis
    const gapInsights = await this.performGapAnalysis(assessmentData);
    newInsights.push(...gapInsights);

    // Pattern Recognition
    const patternInsights = await this.performPatternAnalysis(assessmentData);
    newInsights.push(...patternInsights);

    // Risk Assessment
    const riskInsights = await this.performRiskAssessment(assessmentData);
    newInsights.push(...riskInsights);

    // Opportunity Identification
    const opportunityInsights = await this.performOpportunityAnalysis(assessmentData);
    newInsights.push(...opportunityInsights);

    // Trend Analysis
    const trendInsights = await this.performTrendAnalysis(assessmentData);
    newInsights.push(...trendInsights);

    // Store insights
    this.insights.push(...newInsights);
    this.saveInsights();

    return newInsights;
  }

  // Perform gap analysis
  private async performGapAnalysis(assessmentData: any): Promise<AssessmentInsight[]> {
    const insights: AssessmentInsight[] = [];
    const gaps = this.identifyComplianceGaps(assessmentData);

    for (const gap of gaps) {
      const insight: AssessmentInsight = {
        id: `gap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'gap_analysis',
        title: `Compliance Gap in ${gap.sectionTitle}`,
        description: `Significant gap identified in ${gap.sectionTitle} with ${gap.gapPercentage}% below target score.`,
        severity: gap.gapPercentage > 50 ? 'critical' : gap.gapPercentage > 30 ? 'high' : 'medium',
        confidence: 85,
        category: 'compliance',
        affectedAreas: [gap.sectionId],
        evidence: [
          `Current score: ${gap.currentScore}%`,
          `Target score: ${gap.targetScore}%`,
          `Gap size: ${gap.gapSize} points`,
        ],
        recommendations: this.generateGapRecommendations(gap),
        metadata: { gap },
        createdAt: new Date().toISOString(),
      };
      insights.push(insight);
    }

    return insights;
  }

  // Perform pattern analysis
  private async performPatternAnalysis(assessmentData: any): Promise<AssessmentInsight[]> {
    const insights: AssessmentInsight[] = [];
    const patterns = this.identifyPatterns(assessmentData);

    for (const pattern of patterns) {
      const insight: AssessmentInsight = {
        id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'pattern_recognition',
        title: `Pattern Identified: ${pattern.pattern}`,
        description: `Recurring pattern detected with ${pattern.frequency} occurrences and ${pattern.confidence}% confidence.`,
        severity: pattern.confidence > 80 ? 'high' : 'medium',
        confidence: pattern.confidence,
        category: 'pattern',
        affectedAreas: pattern.affectedPersonas,
        evidence: [
          `Frequency: ${pattern.frequency} occurrences`,
          `Confidence: ${pattern.confidence}%`,
          `Affected personas: ${pattern.affectedPersonas.join(', ')}`,
        ],
        recommendations: this.generatePatternRecommendations(pattern),
        metadata: { pattern },
        createdAt: new Date().toISOString(),
      };
      insights.push(insight);
    }

    return insights;
  }

  // Perform risk assessment
  private async performRiskAssessment(assessmentData: any): Promise<AssessmentInsight[]> {
    const insights: AssessmentInsight[] = [];
    const risks = this.identifyRisks(assessmentData);

    for (const risk of risks) {
      const insight: AssessmentInsight = {
        id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'risk_assessment',
        title: `Risk Identified: ${risk.riskTitle}`,
        description: `${risk.riskDescription} with ${risk.probability}% probability and ${risk.impact} impact.`,
        severity: risk.impact === 'critical' ? 'critical' : risk.impact === 'high' ? 'high' : 'medium',
        confidence: 90,
        category: 'risk',
        affectedAreas: risk.affectedAreas,
        evidence: [
          `Probability: ${risk.probability}%`,
          `Impact: ${risk.impact}`,
          `Risk score: ${risk.riskScore}`,
        ],
        recommendations: this.generateRiskRecommendations(risk),
        metadata: { risk },
        createdAt: new Date().toISOString(),
      };
      insights.push(insight);
    }

    return insights;
  }

  // Perform opportunity analysis
  private async performOpportunityAnalysis(assessmentData: any): Promise<AssessmentInsight[]> {
    const insights: AssessmentInsight[] = [];
    const opportunities = this.identifyOpportunities(assessmentData);

    for (const opportunity of opportunities) {
      const insight: AssessmentInsight = {
        id: `opportunity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'opportunity_identification',
        title: `Opportunity: ${opportunity.title}`,
        description: opportunity.description,
        severity: 'low',
        confidence: 75,
        category: 'opportunity',
        affectedAreas: opportunity.affectedAreas,
        evidence: opportunity.evidence,
        recommendations: opportunity.recommendations,
        metadata: { opportunity },
        createdAt: new Date().toISOString(),
      };
      insights.push(insight);
    }

    return insights;
  }

  // Perform trend analysis
  private async performTrendAnalysis(assessmentData: any): Promise<AssessmentInsight[]> {
    const insights: AssessmentInsight[] = [];
    const trends = this.identifyTrends(assessmentData);

    for (const trend of trends) {
      const insight: AssessmentInsight = {
        id: `trend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'trend_analysis',
        title: `Trend Analysis: ${trend.title}`,
        description: trend.description,
        severity: trend.severity,
        confidence: trend.confidence,
        category: 'trend',
        affectedAreas: trend.affectedAreas,
        evidence: trend.evidence,
        recommendations: trend.recommendations,
        metadata: { trend },
        createdAt: new Date().toISOString(),
      };
      insights.push(insight);
    }

    return insights;
  }

  // Identify compliance gaps
  private identifyComplianceGaps(assessmentData: any): GapAnalysis[] {
    const gaps: GapAnalysis[] = [];

    // Analyze section performance
    if (assessmentData.sections?.sectionPerformance) {
      for (const section of assessmentData.sections.sectionPerformance) {
        const targetScore = section.isCritical ? 95 : 85;
        const gapSize = targetScore - section.averageScore;
        
        if (gapSize > 10) { // Only flag significant gaps
          gaps.push({
            sectionId: section.sectionId,
            sectionTitle: section.sectionTitle,
            currentScore: section.averageScore,
            targetScore,
            gapSize,
            gapPercentage: Math.round((gapSize / targetScore) * 100),
            rootCauses: this.identifyRootCauses(section),
            impactAssessment: this.assessGapImpact(section, gapSize),
            remediationPriority: this.calculateRemediationPriority(section, gapSize),
            estimatedEffort: this.estimateRemediationEffort(section, gapSize),
            relatedQuestions: this.getRelatedQuestions(section.sectionId),
          });
        }
      }
    }

    return gaps.sort((a, b) => b.remediationPriority - a.remediationPriority);
  }

  // Identify patterns in assessment data
  private identifyPatterns(assessmentData: any): PatternAnalysis[] {
    const patterns: PatternAnalysis[] = [];

    // Pattern 1: Persona performance patterns
    if (assessmentData.personas?.personaPerformance) {
      const lowPerformers = assessmentData.personas.personaPerformance.filter((p: any) => p.averageScore < 70);
      if (lowPerformers.length > 0) {
        patterns.push({
          patternType: 'compliance_trend',
          pattern: 'Consistent low performance in specific personas',
          frequency: lowPerformers.length,
          confidence: 85,
          affectedPersonas: lowPerformers.map((p: any) => p.persona),
          affectedCompanies: [],
          implications: ['Training needs identified', 'Process improvement required'],
          recommendations: ['Implement persona-specific training', 'Review assessment questions'],
        });
      }
    }

    // Pattern 2: Collaboration patterns
    if (assessmentData.sections?.collaborationMetrics) {
      const collaborationData = assessmentData.sections.collaborationMetrics;
      if (collaborationData.collaborationEfficiency < 70) {
        patterns.push({
          patternType: 'collaboration_pattern',
          pattern: 'Low collaboration efficiency across sections',
          frequency: 1,
          confidence: 80,
          affectedPersonas: [],
          affectedCompanies: [],
          implications: ['Cross-functional communication issues', 'Process bottlenecks'],
          recommendations: ['Improve collaboration tools', 'Establish regular sync meetings'],
        });
      }
    }

    return patterns;
  }

  // Identify risks
  private identifyRisks(assessmentData: any): RiskAssessment[] {
    const risks: RiskAssessment[] = [];

    // Risk 1: Low production readiness
    if (assessmentData.overview?.productionReadyRate < 80) {
      risks.push({
        riskId: 'low_production_readiness',
        riskTitle: 'Low Production Readiness Rate',
        riskDescription: 'Production readiness rate is below acceptable threshold, indicating potential compliance issues.',
        probability: 85,
        impact: 'high',
        riskScore: 85,
        affectedAreas: ['production', 'compliance'],
        mitigationStrategies: [
          'Focus on critical section completion',
          'Implement additional quality checks',
          'Provide targeted training',
        ],
        monitoringIndicators: ['Production readiness rate', 'Critical section completion'],
        escalationTriggers: ['Rate drops below 70%', 'Critical sections incomplete'],
      });
    }

    // Risk 2: High critical gaps
    if (assessmentData.scoring?.criticalGaps?.length > 5) {
      risks.push({
        riskId: 'high_critical_gaps',
        riskTitle: 'Multiple Critical Compliance Gaps',
        riskDescription: 'Multiple critical compliance gaps identified, indicating systemic issues.',
        probability: 75,
        impact: 'critical',
        riskScore: 90,
        affectedAreas: ['compliance', 'regulatory'],
        mitigationStrategies: [
          'Prioritize critical gap remediation',
          'Implement additional oversight',
          'Engage regulatory experts',
        ],
        monitoringIndicators: ['Critical gap count', 'Gap severity scores'],
        escalationTriggers: ['More than 5 critical gaps', 'Gap severity increases'],
      });
    }

    return risks;
  }

  // Identify opportunities
  private identifyOpportunities(assessmentData: any): any[] {
    const opportunities: any[] = [];

    // Opportunity 1: High-performing personas
    if (assessmentData.personas?.personaPerformance) {
      const highPerformers = assessmentData.personas.personaPerformance.filter((p: any) => p.averageScore > 90);
      if (highPerformers.length > 0) {
        opportunities.push({
          title: 'Leverage High-Performing Personas',
          description: 'High-performing personas can mentor and train other personas to improve overall performance.',
          affectedAreas: highPerformers.map((p: any) => p.persona),
          evidence: [
            `${highPerformers.length} personas scoring above 90%`,
            'Opportunity for knowledge transfer',
          ],
          recommendations: [
            'Create mentorship programs',
            'Develop best practice sharing sessions',
            'Implement cross-training initiatives',
          ],
        });
      }
    }

    return opportunities;
  }

  // Identify trends
  private identifyTrends(assessmentData: any): any[] {
    const trends: any[] = [];

    // Trend 1: Score improvement
    if (assessmentData.scoring?.scoreTrends) {
      const recentTrends = assessmentData.scoring.scoreTrends.slice(-3);
      if (recentTrends.length >= 2) {
        const improvement = recentTrends[recentTrends.length - 1].averageScore - recentTrends[0].averageScore;
        if (improvement > 5) {
          trends.push({
            title: 'Positive Score Trend',
            description: `Assessment scores have improved by ${improvement}% over recent period.`,
            severity: 'low',
            confidence: 90,
            affectedAreas: ['overall'],
            evidence: [
              `Improvement: ${improvement}%`,
              `Recent trend: ${recentTrends.map((t: any) => t.averageScore).join(' → ')}`,
            ],
            recommendations: [
              'Maintain current improvement strategies',
              'Document successful practices',
              'Scale improvements to other areas',
            ],
          });
        }
      }
    }

    return trends;
  }

  // Generate recommendations for gaps
  private generateGapRecommendations(gap: GapAnalysis): Recommendation[] {
    const recommendations: Recommendation[] = [];

    recommendations.push({
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Improve ${gap.sectionTitle} Performance`,
      description: `Address the ${gap.gapPercentage}% gap in ${gap.sectionTitle} to meet compliance requirements.`,
      priority: gap.remediationPriority > 8 ? 'critical' : gap.remediationPriority > 6 ? 'high' : 'medium',
      effort: gap.estimatedEffort as 'low' | 'medium' | 'high',
      impact: gap.gapPercentage > 50 ? 'high' : 'medium',
      estimatedTime: this.estimateTime(gap.gapSize),
      estimatedCost: this.estimateCost(gap.gapSize),
      requiredResources: this.getRequiredResources(gap.sectionId),
      implementationSteps: this.getImplementationSteps(gap.sectionId),
      successMetrics: [`Achieve ${gap.targetScore}% score in ${gap.sectionTitle}`],
      relatedRegulations: this.getRelatedRegulations(gap.sectionId),
      relatedSections: [gap.sectionId],
    });

    return recommendations;
  }

  // Generate recommendations for patterns
  private generatePatternRecommendations(pattern: PatternAnalysis): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (pattern.patternType === 'compliance_trend') {
      recommendations.push({
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: 'Implement Persona-Specific Training',
        description: 'Address performance gaps in specific personas through targeted training programs.',
        priority: 'high',
        effort: 'medium',
        impact: 'high',
        estimatedTime: '4-6 weeks',
        estimatedCost: '$10,000 - $25,000',
        requiredResources: ['Training team', 'Subject matter experts', 'Learning materials'],
        implementationSteps: [
          'Assess current knowledge gaps',
          'Develop training curriculum',
          'Schedule training sessions',
          'Monitor progress and adjust',
        ],
        successMetrics: ['Improved persona performance scores', 'Reduced knowledge gaps'],
        relatedRegulations: [],
        relatedSections: pattern.affectedPersonas,
      });
    }

    return recommendations;
  }

  // Generate recommendations for risks
  private generateRiskRecommendations(risk: RiskAssessment): Recommendation[] {
    const recommendations: Recommendation[] = [];

    recommendations.push({
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Mitigate ${risk.riskTitle}`,
      description: `Implement mitigation strategies to address the identified risk with ${risk.probability}% probability.`,
      priority: risk.impact === 'critical' ? 'critical' : 'high',
      effort: 'high',
      impact: 'high',
      estimatedTime: '2-4 weeks',
      estimatedCost: '$15,000 - $50,000',
      requiredResources: ['Risk management team', 'Compliance experts', 'Monitoring tools'],
      implementationSteps: risk.mitigationStrategies,
      successMetrics: ['Risk score reduction', 'Monitoring indicator improvements'],
      relatedRegulations: [],
      relatedSections: risk.affectedAreas,
    });

    return recommendations;
  }

  // Helper methods
  private identifyRootCauses(section: any): string[] {
    // Analyze section data to identify root causes
    const causes: string[] = [];
    
    if (section.completionRate < 80) {
      causes.push('Low completion rate');
    }
    if (section.averageScore < 70) {
      causes.push('Insufficient knowledge or training');
    }
    if (section.isCritical && section.averageScore < 90) {
      causes.push('Inadequate focus on critical requirements');
    }
    
    return causes;
  }

  private assessGapImpact(section: any, gapSize: number): string {
    if (section.isCritical) {
      return 'Critical impact on compliance and regulatory requirements';
    } else if (gapSize > 30) {
      return 'Significant impact on overall assessment score';
    } else {
      return 'Moderate impact on assessment performance';
    }
  }

  private calculateRemediationPriority(section: any, gapSize: number): number {
    let priority = 5; // Base priority
    
    if (section.isCritical) priority += 3;
    if (gapSize > 30) priority += 2;
    if (section.completionRate < 70) priority += 1;
    
    return Math.min(priority, 10);
  }

  private estimateRemediationEffort(section: any, gapSize: number): 'low' | 'medium' | 'high' {
    if (gapSize > 40 || section.isCritical) return 'high';
    if (gapSize > 20) return 'medium';
    return 'low';
  }

  private getRelatedQuestions(sectionId: string): string[] {
    // This would query the database for related questions
    return [`Question related to ${sectionId}`];
  }

  private estimateTime(gapSize: number): string {
    if (gapSize > 40) return '8-12 weeks';
    if (gapSize > 20) return '4-6 weeks';
    return '2-4 weeks';
  }

  private estimateCost(gapSize: number): string {
    if (gapSize > 40) return '$25,000 - $50,000';
    if (gapSize > 20) return '$10,000 - $25,000';
    return '$5,000 - $10,000';
  }

  private getRequiredResources(sectionId: string): string[] {
    // This would be based on section requirements
    return ['Subject matter experts', 'Training materials', 'Implementation team'];
  }

  private getImplementationSteps(sectionId: string): string[] {
    return [
      'Assess current state',
      'Develop improvement plan',
      'Implement changes',
      'Monitor progress',
      'Validate results',
    ];
  }

  private getRelatedRegulations(sectionId: string): string[] {
    // This would query regulatory intelligence
    return ['FDA 21 CFR Part 11', 'GDPR Article 25', 'HIPAA Privacy Rule'];
  }

  // Get all insights
  getInsights(): AssessmentInsight[] {
    return [...this.insights];
  }

  // Get insights by type
  getInsightsByType(type: AssessmentInsight['type']): AssessmentInsight[] {
    return this.insights.filter(insight => insight.type === type);
  }

  // Get insights by severity
  getInsightsBySeverity(severity: AssessmentInsight['severity']): AssessmentInsight[] {
    return this.insights.filter(insight => insight.severity === severity);
  }

  // Save insights to localStorage (client-side only)
  private saveInsights(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('complianceiq_insights', JSON.stringify(this.insights));
      }
    } catch (error) {
      console.error('Error saving insights:', error);
    }
  }

  // Load insights from localStorage (client-side only)
  private loadInsights(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('complianceiq_insights');
        if (saved) {
          this.insights = JSON.parse(saved);
        }
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  }
}

// Export singleton instance
export const learningInsightsEngine = new LearningInsightsEngine();

// Utility functions
export const getInsightIcon = (type: AssessmentInsight['type']): string => {
  switch (type) {
    case 'gap_analysis': return '🔍';
    case 'pattern_recognition': return '📊';
    case 'risk_assessment': return '⚠️';
    case 'opportunity_identification': return '💡';
    case 'trend_analysis': return '📈';
    default: return '📋';
  }
};

export const getSeverityColor = (severity: AssessmentInsight['severity']): string => {
  switch (severity) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getPriorityColor = (priority: Recommendation['priority']): string => {
  switch (priority) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
};
