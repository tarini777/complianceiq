/**
 * Assessment Engine - ComplianceIQ System
 * Dynamic question generation and scoring engine for comprehensive pharmaceutical AI assessment
 * Handles therapy-specific, model-type-specific, and deployment-specific question generation
 */

import {
  AssessmentSection,
  AssessmentQuestion,
  TherapeuticArea,
  AIModelType,
  DeploymentScenario,
  scoringConfiguration
} from '@/data/comprehensive-assessment';

export interface AssessmentConfig {
  therapeuticAreas: string[];
  aiModelTypes: string[];
  deploymentScenarios: string[];
  companyName?: string;
  assessmentDate?: string;
}

export interface GeneratedAssessment {
  sections: GeneratedSection[];
  totalQuestions: number;
  maxScore: number;
  estimatedTime: string;
}

export interface GeneratedSection {
  section: AssessmentSection;
  questions: AssessmentQuestion[];
  sectionScore: number;
  isComplete: boolean;
}

export interface AssessmentResult {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  readinessStatus: string;
  criticalGaps: AssessmentQuestion[];
  recommendations: string[];
  therapyOverlayScore: number;
  modelComplexityScore: number;
  deploymentComplexityScore: number;
  finalScore: number;
}

export class AssessmentEngine {
  private therapeuticAreas: Map<string, TherapeuticArea>;
  private aiModelTypes: Map<string, AIModelType>;
  private deploymentScenarios: Map<string, DeploymentScenario>;

  constructor() {
    this.therapeuticAreas = new Map();
    this.aiModelTypes = new Map();
    this.deploymentScenarios = new Map();
  }

  /**
   * Generate comprehensive assessment based on configuration
   */
  generateAssessment(config: AssessmentConfig): GeneratedAssessment {
    const sections: GeneratedSection[] = [];
    
    // Import assessment data dynamically
    const { assessmentSections, therapeuticAreas, aiModelTypes, deploymentScenarios } = 
      require('@/data/comprehensive-assessment');

    // Build lookup maps
    therapeuticAreas.forEach((area: TherapeuticArea) => {
      this.therapeuticAreas.set(area.id, area);
    });

    aiModelTypes.forEach((model: AIModelType) => {
      this.aiModelTypes.set(model.id, model);
    });

    deploymentScenarios.forEach((scenario: DeploymentScenario) => {
      this.deploymentScenarios.set(scenario.id, scenario);
    });

    // Generate sections with dynamic questions
    assessmentSections.forEach((section: AssessmentSection) => {
      const generatedQuestions = this.generateSectionQuestions(section, config);
      
      sections.push({
        section,
        questions: generatedQuestions,
        sectionScore: this.calculateSectionMaxScore(generatedQuestions),
        isComplete: false
      });
    });

    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
    const maxScore = sections.reduce((sum, section) => sum + section.sectionScore, 0);
    const estimatedTime = this.calculateEstimatedTime(totalQuestions);

    return {
      sections,
      totalQuestions,
      maxScore,
      estimatedTime
    };
  }

  /**
   * Generate questions for a specific section based on configuration
   */
  private generateSectionQuestions(section: AssessmentSection, config: AssessmentConfig): AssessmentQuestion[] {
    let questions: AssessmentQuestion[] = [...section.questions];

    // Add therapy-specific questions
    config.therapeuticAreas.forEach(therapyId => {
      const therapyQuestions = section.therapySpecificQuestions[therapyId];
      if (therapyQuestions) {
        questions = [...questions, ...therapyQuestions];
      }
    });

    // Add AI model type-specific questions
    config.aiModelTypes.forEach(modelId => {
      const modelQuestions = section.modelTypeQuestions[modelId];
      if (modelQuestions) {
        questions = [...questions, ...modelQuestions];
      }
    });

    // Add deployment scenario-specific questions
    config.deploymentScenarios.forEach(scenarioId => {
      const deploymentQuestions = section.deploymentQuestions[scenarioId];
      if (deploymentQuestions) {
        questions = [...questions, ...deploymentQuestions];
      }
    });

    return questions;
  }

  /**
   * Calculate maximum score for a section
   */
  private calculateSectionMaxScore(questions: AssessmentQuestion[]): number {
    return questions.reduce((sum, question) => sum + question.points, 0);
  }

  /**
   * Calculate estimated time for assessment
   */
  private calculateEstimatedTime(totalQuestions: number): string {
    const minutesPerQuestion = 2; // Average time per question
    const totalMinutes = totalQuestions * minutesPerQuestion;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Calculate comprehensive assessment result
   */
  calculateResult(
    responses: Record<string, any>,
    config: AssessmentConfig,
    generatedAssessment: GeneratedAssessment
  ): AssessmentResult {
    let totalScore = 0;
    const criticalGaps: AssessmentQuestion[] = [];

    // Calculate base score from responses
    generatedAssessment.sections.forEach(section => {
      section.questions.forEach(question => {
        const response = responses[question.id];
        if (response && response.completed) {
          totalScore += question.points;
        } else if (question.isBlocker) {
          criticalGaps.push(question);
        }
      });
    });

    // Calculate therapy overlay score
    const therapyOverlayScore = this.calculateTherapyOverlayScore(config.therapeuticAreas);
    
    // Calculate model complexity score
    const modelComplexityScore = this.calculateModelComplexityScore(config.aiModelTypes);
    
    // Calculate deployment complexity score
    const deploymentComplexityScore = this.calculateDeploymentComplexityScore(config.deploymentScenarios);

    // Calculate final score with overlays
    const finalScore = totalScore + therapyOverlayScore + modelComplexityScore + deploymentComplexityScore;
    const maxPossibleScore = scoringConfiguration.maxTotalScore;
    const percentage = Math.round((finalScore / maxPossibleScore) * 100);

    // Determine readiness status
    const readinessStatus = this.determineReadinessStatus(percentage);

    // Generate recommendations
    const recommendations = this.generateRecommendations(criticalGaps, config, percentage);

    return {
      totalScore,
      maxPossibleScore,
      percentage,
      readinessStatus,
      criticalGaps,
      recommendations,
      therapyOverlayScore,
      modelComplexityScore,
      deploymentComplexityScore,
      finalScore
    };
  }

  /**
   * Calculate therapy-specific overlay score
   */
  private calculateTherapyOverlayScore(therapeuticAreas: string[]): number {
    return therapeuticAreas.reduce((sum, therapyId) => {
      const therapy = this.therapeuticAreas.get(therapyId);
      return sum + (therapy?.overlayPoints || 0);
    }, 0);
  }

  /**
   * Calculate AI model complexity score
   */
  private calculateModelComplexityScore(aiModelTypes: string[]): number {
    return aiModelTypes.reduce((sum, modelId) => {
      const model = this.aiModelTypes.get(modelId);
      return sum + (model?.complexityPoints || 0);
    }, 0);
  }

  /**
   * Calculate deployment scenario complexity score
   */
  private calculateDeploymentComplexityScore(deploymentScenarios: string[]): number {
    return deploymentScenarios.reduce((sum, scenarioId) => {
      const scenario = this.deploymentScenarios.get(scenarioId);
      return sum + (scenario?.complexityPoints || 0);
    }, 0);
  }

  /**
   * Determine readiness status based on percentage
   */
  private determineReadinessStatus(percentage: number): string {
    const thresholds = scoringConfiguration.readinessThresholds;
    
    if (percentage >= thresholds.productionReady.percentage) {
      return thresholds.productionReady.status;
    } else if (percentage >= thresholds.conditional.percentage) {
      return thresholds.conditional.status;
    } else if (percentage >= thresholds.preProduction.percentage) {
      return thresholds.preProduction.status;
    } else if (percentage >= thresholds.developmentComplete.percentage) {
      return thresholds.developmentComplete.status;
    } else {
      return thresholds.notReady.status;
    }
  }

  /**
   * Generate intelligent recommendations based on gaps and configuration
   */
  private generateRecommendations(
    criticalGaps: AssessmentQuestion[],
    config: AssessmentConfig,
    percentage: number
  ): string[] {
    const recommendations: string[] = [];

    // Critical blocker recommendations
    if (criticalGaps.length > 0) {
      recommendations.push(`🚨 URGENT: Address ${criticalGaps.length} critical production blockers before deployment`);
      
      criticalGaps.forEach(gap => {
        recommendations.push(`• ${gap.category}: ${gap.text}`);
      });
    }

    // Therapy-specific recommendations
    config.therapeuticAreas.forEach(therapyId => {
      const therapy = this.therapeuticAreas.get(therapyId);
      if (therapy && therapy.complexity === 'Critical') {
        recommendations.push(`📋 ${therapy.name}: Implement specialized ${therapy.name.toLowerCase()} protocols for regulatory compliance`);
      }
    });

    // AI model type recommendations
    config.aiModelTypes.forEach(modelId => {
      const model = this.aiModelTypes.get(modelId);
      if (model && model.complexity === 'Critical') {
        recommendations.push(`🤖 ${model.name}: Deploy enhanced safety controls and monitoring for ${model.name.toLowerCase()} systems`);
      }
    });

    // Deployment scenario recommendations
    config.deploymentScenarios.forEach(scenarioId => {
      const scenario = this.deploymentScenarios.get(scenarioId);
      if (scenario && scenario.complexity === 'High') {
        recommendations.push(`🚀 ${scenario.name}: Implement specialized ${scenario.name.toLowerCase()} protocols and monitoring`);
      }
    });

    // Overall readiness recommendations
    if (percentage < 70) {
      recommendations.push('📊 Overall: Significant infrastructure and compliance gaps require immediate attention');
    } else if (percentage < 90) {
      recommendations.push('📊 Overall: Minor configuration gaps need resolution before production deployment');
    } else {
      recommendations.push('✅ Overall: System ready for production deployment with continuous monitoring');
    }

    return recommendations;
  }

  /**
   * Get bottleneck resolutions for specific configuration
   */
  getBottleneckResolutions(config: AssessmentConfig): Array<{
    bottleneck: string;
    resolution: string;
    priority: string;
    implementation: string;
  }> {
    const resolutions: Array<{
      bottleneck: string;
      resolution: string;
      priority: string;
      implementation: string;
    }> = [];

    const { bottleneckResolutions } = require('@/data/comprehensive-assessment');

    // Add therapy-specific resolutions
    config.therapeuticAreas.forEach(therapyId => {
      const therapyResolutions = bottleneckResolutions[therapyId];
      if (therapyResolutions) {
        resolutions.push(...therapyResolutions);
      }
    });

    // Add AI model type-specific resolutions
    config.aiModelTypes.forEach(modelId => {
      const modelResolutions = bottleneckResolutions[modelId];
      if (modelResolutions) {
        resolutions.push(...modelResolutions);
      }
    });

    return resolutions;
  }

  /**
   * Validate assessment configuration
   */
  validateConfiguration(config: AssessmentConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.therapeuticAreas || config.therapeuticAreas.length === 0) {
      errors.push('At least one therapeutic area must be selected');
    }

    if (!config.aiModelTypes || config.aiModelTypes.length === 0) {
      errors.push('At least one AI model type must be selected');
    }

    if (!config.deploymentScenarios || config.deploymentScenarios.length === 0) {
      errors.push('At least one deployment scenario must be selected');
    }

    // Validate therapeutic areas exist
    config.therapeuticAreas?.forEach(therapyId => {
      if (!this.therapeuticAreas.has(therapyId)) {
        errors.push(`Invalid therapeutic area: ${therapyId}`);
      }
    });

    // Validate AI model types exist
    config.aiModelTypes?.forEach(modelId => {
      if (!this.aiModelTypes.has(modelId)) {
        errors.push(`Invalid AI model type: ${modelId}`);
      }
    });

    // Validate deployment scenarios exist
    config.deploymentScenarios?.forEach(scenarioId => {
      if (!this.deploymentScenarios.has(scenarioId)) {
        errors.push(`Invalid deployment scenario: ${scenarioId}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default AssessmentEngine;
