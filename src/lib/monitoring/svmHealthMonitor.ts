/**
 * SVM-based System Health Monitoring
 * Uses Support Vector Machine approach for real-time system health prediction
 */

export interface SystemMetrics {
  apiResponseTime: number;
  databaseQueryTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
  userSatisfaction: number;
  assessmentCompletionRate: number;
  askRexiResponseTime: number;
  activeUsers: number;
  systemLoad: number;
}

export interface HealthPrediction {
  healthScore: number; // 0-100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  predictions: {
    nextHour: number;
    nextDay: number;
    nextWeek: number;
  };
  recommendations: string[];
  riskFactors: string[];
}

export interface MonitoringData {
  timestamp: Date;
  metrics: SystemMetrics;
  prediction: HealthPrediction;
}

/**
 * Simplified SVM-like approach for system health monitoring
 * Uses weighted scoring and threshold-based classification
 */
export class SVMHealthMonitor {
  private historicalData: MonitoringData[] = [];
  private readonly maxHistorySize = 1000;
  private readonly weights = {
    apiResponseTime: 0.15,
    databaseQueryTime: 0.15,
    memoryUsage: 0.12,
    cpuUsage: 0.12,
    errorRate: 0.20,
    userSatisfaction: 0.10,
    assessmentCompletionRate: 0.08,
    askRexiResponseTime: 0.05,
    activeUsers: 0.03
  };

  private readonly thresholds = {
    excellent: 85,
    good: 70,
    warning: 50,
    critical: 30
  };

  /**
   * Predict system health based on current metrics
   */
  public predictHealth(metrics: SystemMetrics): HealthPrediction {
    // Normalize metrics to 0-100 scale
    const normalizedMetrics = this.normalizeMetrics(metrics);
    
    // Calculate weighted health score
    const healthScore = this.calculateHealthScore(normalizedMetrics);
    
    // Determine status based on thresholds
    const status = this.determineStatus(healthScore);
    
    // Generate predictions for different time horizons
    const predictions = this.generatePredictions(healthScore);
    
    // Generate recommendations based on current state
    const recommendations = this.generateRecommendations(normalizedMetrics, status);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(normalizedMetrics);

    return {
      healthScore,
      status,
      predictions,
      recommendations,
      riskFactors
    };
  }

  /**
   * Add monitoring data to history for trend analysis
   */
  public addDataPoint(metrics: SystemMetrics): MonitoringData {
    const prediction = this.predictHealth(metrics);
    const dataPoint: MonitoringData = {
      timestamp: new Date(),
      metrics,
      prediction
    };

    this.historicalData.push(dataPoint);
    
    // Keep only recent data
    if (this.historicalData.length > this.maxHistorySize) {
      this.historicalData = this.historicalData.slice(-this.maxHistorySize);
    }

    return dataPoint;
  }

  /**
   * Get trend analysis from historical data
   */
  public getTrendAnalysis(hours: number = 24): {
    trend: 'improving' | 'stable' | 'declining';
    trendScore: number;
    keyChanges: string[];
  } {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentData = this.historicalData.filter(
      data => data.timestamp >= cutoffTime
    );

    if (recentData.length < 2) {
      return {
        trend: 'stable',
        trendScore: 0,
        keyChanges: ['Insufficient data for trend analysis']
      };
    }

    // Calculate trend score (positive = improving, negative = declining)
    const trendScore = this.calculateTrendScore(recentData);
    
    // Determine trend direction
    const trend = trendScore > 0.1 ? 'improving' : 
                  trendScore < -0.1 ? 'declining' : 'stable';

    // Identify key changes
    const keyChanges = this.identifyKeyChanges(recentData);

    return { trend, trendScore, keyChanges };
  }

  /**
   * Normalize metrics to 0-100 scale
   */
  private normalizeMetrics(metrics: SystemMetrics): SystemMetrics {
    return {
      apiResponseTime: Math.max(0, 100 - (metrics.apiResponseTime / 10)), // Lower is better
      databaseQueryTime: Math.max(0, 100 - (metrics.databaseQueryTime / 5)), // Lower is better
      memoryUsage: Math.max(0, 100 - (metrics.memoryUsage / 10)), // Lower is better
      cpuUsage: Math.max(0, 100 - (metrics.cpuUsage / 10)), // Lower is better
      errorRate: Math.max(0, 100 - (metrics.errorRate * 100)), // Lower is better
      userSatisfaction: metrics.userSatisfaction, // Higher is better
      assessmentCompletionRate: metrics.assessmentCompletionRate, // Higher is better
      askRexiResponseTime: Math.max(0, 100 - (metrics.askRexiResponseTime / 10)), // Lower is better
      activeUsers: Math.min(100, metrics.activeUsers * 2), // Higher is better (capped at 100)
      systemLoad: Math.max(0, 100 - (metrics.systemLoad / 10)) // Lower is better
    };
  }

  /**
   * Calculate weighted health score
   */
  private calculateHealthScore(normalizedMetrics: SystemMetrics): number {
    let score = 0;
    
    Object.entries(this.weights).forEach(([key, weight]) => {
      const value = normalizedMetrics[key as keyof SystemMetrics];
      score += value * weight;
    });

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Determine status based on health score
   */
  private determineStatus(healthScore: number): 'excellent' | 'good' | 'warning' | 'critical' {
    if (healthScore >= this.thresholds.excellent) return 'excellent';
    if (healthScore >= this.thresholds.good) return 'good';
    if (healthScore >= this.thresholds.warning) return 'warning';
    return 'critical';
  }

  /**
   * Generate predictions for different time horizons
   */
  private generatePredictions(healthScore: number): { nextHour: number; nextDay: number; nextWeek: number } {
    // Simple linear trend prediction based on current score
    const trend = this.getTrendAnalysis(1).trendScore;
    
    return {
      nextHour: Math.round(Math.max(0, Math.min(100, healthScore + trend * 0.1))),
      nextDay: Math.round(Math.max(0, Math.min(100, healthScore + trend * 2))),
      nextWeek: Math.round(Math.max(0, Math.min(100, healthScore + trend * 14)))
    };
  }

  /**
   * Generate recommendations based on current state
   */
  private generateRecommendations(normalizedMetrics: SystemMetrics, status: string): string[] {
    const recommendations: string[] = [];

    if (normalizedMetrics.apiResponseTime < 70) {
      recommendations.push('Optimize API response times - consider caching or query optimization');
    }
    
    if (normalizedMetrics.databaseQueryTime < 70) {
      recommendations.push('Review database queries for performance bottlenecks');
    }
    
    if (normalizedMetrics.memoryUsage < 70) {
      recommendations.push('Monitor memory usage - consider memory optimization');
    }
    
    if (normalizedMetrics.cpuUsage < 70) {
      recommendations.push('High CPU usage detected - check for resource-intensive processes');
    }
    
    if (normalizedMetrics.errorRate < 70) {
      recommendations.push('Error rate is elevated - investigate error logs');
    }
    
    if (normalizedMetrics.userSatisfaction < 70) {
      recommendations.push('User satisfaction is low - gather feedback and improve UX');
    }
    
    if (normalizedMetrics.assessmentCompletionRate < 70) {
      recommendations.push('Assessment completion rate is low - simplify workflow or provide better guidance');
    }
    
    if (normalizedMetrics.askRexiResponseTime < 70) {
      recommendations.push('AskRexi response time is slow - optimize AI processing');
    }

    if (status === 'critical') {
      recommendations.unshift('CRITICAL: Immediate attention required for system stability');
    } else if (status === 'warning') {
      recommendations.unshift('WARNING: Proactive monitoring and optimization recommended');
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  /**
   * Identify risk factors
   */
  private identifyRiskFactors(normalizedMetrics: SystemMetrics): string[] {
    const risks: string[] = [];

    if (normalizedMetrics.apiResponseTime < 50) risks.push('API Performance Degradation');
    if (normalizedMetrics.databaseQueryTime < 50) risks.push('Database Performance Issues');
    if (normalizedMetrics.memoryUsage < 50) risks.push('Memory Pressure');
    if (normalizedMetrics.cpuUsage < 50) risks.push('High CPU Load');
    if (normalizedMetrics.errorRate < 50) risks.push('High Error Rate');
    if (normalizedMetrics.userSatisfaction < 50) risks.push('User Experience Issues');
    if (normalizedMetrics.assessmentCompletionRate < 50) risks.push('Low Engagement');
    if (normalizedMetrics.askRexiResponseTime < 50) risks.push('AI Service Degradation');

    return risks;
  }

  /**
   * Calculate trend score from historical data
   */
  private calculateTrendScore(data: MonitoringData[]): number {
    if (data.length < 2) return 0;

    const recent = data.slice(-Math.min(10, data.length));
    const older = data.slice(0, Math.max(1, data.length - 10));

    const recentAvg = recent.reduce((sum, d) => sum + d.prediction.healthScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.prediction.healthScore, 0) / older.length;

    return (recentAvg - olderAvg) / 100; // Normalize to -1 to 1 range
  }

  /**
   * Identify key changes in recent data
   */
  private identifyKeyChanges(data: MonitoringData[]): string[] {
    const changes: string[] = [];
    
    if (data.length < 2) return ['Insufficient data for change analysis'];

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    const metricsDiff = {
      apiResponseTime: latest.metrics.apiResponseTime - previous.metrics.apiResponseTime,
      databaseQueryTime: latest.metrics.databaseQueryTime - previous.metrics.databaseQueryTime,
      errorRate: latest.metrics.errorRate - previous.metrics.errorRate,
      userSatisfaction: latest.metrics.userSatisfaction - previous.metrics.userSatisfaction,
      assessmentCompletionRate: latest.metrics.assessmentCompletionRate - previous.metrics.assessmentCompletionRate
    };

    if (Math.abs(metricsDiff.apiResponseTime) > 50) {
      changes.push(`API response time ${metricsDiff.apiResponseTime > 0 ? 'increased' : 'decreased'} by ${Math.abs(metricsDiff.apiResponseTime)}ms`);
    }

    if (Math.abs(metricsDiff.databaseQueryTime) > 20) {
      changes.push(`Database query time ${metricsDiff.databaseQueryTime > 0 ? 'increased' : 'decreased'} by ${Math.abs(metricsDiff.databaseQueryTime)}ms`);
    }

    if (Math.abs(metricsDiff.errorRate) > 0.01) {
      changes.push(`Error rate ${metricsDiff.errorRate > 0 ? 'increased' : 'decreased'} by ${(Math.abs(metricsDiff.errorRate) * 100).toFixed(1)}%`);
    }

    if (Math.abs(metricsDiff.userSatisfaction) > 5) {
      changes.push(`User satisfaction ${metricsDiff.userSatisfaction > 0 ? 'improved' : 'declined'} by ${Math.abs(metricsDiff.userSatisfaction)} points`);
    }

    if (Math.abs(metricsDiff.assessmentCompletionRate) > 5) {
      changes.push(`Assessment completion rate ${metricsDiff.assessmentCompletionRate > 0 ? 'increased' : 'decreased'} by ${Math.abs(metricsDiff.assessmentCompletionRate)}%`);
    }

    return changes.length > 0 ? changes : ['No significant changes detected'];
  }

  /**
   * Get current system metrics (mock implementation)
   */
  public async getCurrentMetrics(): Promise<SystemMetrics> {
    // In a real implementation, this would collect actual system metrics
    return {
      apiResponseTime: Math.random() * 200 + 50, // 50-250ms
      databaseQueryTime: Math.random() * 100 + 20, // 20-120ms
      memoryUsage: Math.random() * 80 + 20, // 20-100%
      cpuUsage: Math.random() * 70 + 10, // 10-80%
      errorRate: Math.random() * 0.05, // 0-5%
      userSatisfaction: Math.random() * 30 + 70, // 70-100
      assessmentCompletionRate: Math.random() * 30 + 70, // 70-100%
      askRexiResponseTime: Math.random() * 300 + 100, // 100-400ms
      activeUsers: Math.floor(Math.random() * 50) + 10, // 10-60 users
      systemLoad: Math.random() * 80 + 20 // 20-100%
    };
  }

  /**
   * Get comprehensive health report
   */
  public async getHealthReport(): Promise<{
    current: MonitoringData;
    trend: { trend: string; trendScore: number; keyChanges: string[] };
    historical: MonitoringData[];
  }> {
    const metrics = await this.getCurrentMetrics();
    const current = this.addDataPoint(metrics);
    const trend = this.getTrendAnalysis(24);

    return {
      current,
      trend,
      historical: this.historicalData.slice(-24) // Last 24 data points
    };
  }
}

// Export singleton instance
export const svmHealthMonitor = new SVMHealthMonitor();
