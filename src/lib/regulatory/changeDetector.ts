/**
 * Regulatory Change Detector - ComplianceIQ System
 * Detects new regulatory requirements and triggers incremental question generation
 */

import { prisma } from '@/lib/prisma';

export interface RegulatoryChange {
  id: string;
  source: string;
  changeType: 'new_requirement' | 'updated_requirement' | 'new_regulation' | 'updated_regulation';
  title: string;
  description: string;
  effectiveDate: string;
  requirements: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  processed: boolean;
}

export class RegulatoryChangeDetector {
  private lastCheckTime: Date | null = null;

  /**
   * Detect new regulatory changes since last check
   */
  async detectChanges(): Promise<RegulatoryChange[]> {
    const changes: RegulatoryChange[] = [];
    
    try {
      // Get the last check time
      this.lastCheckTime = await this.getLastCheckTime();
      
      // Check for new regulatory intelligence entries
      const newRegulations = await this.checkForNewRegulations();
      changes.push(...newRegulations);
      
      // Check for updated regulations
      const updatedRegulations = await this.checkForUpdatedRegulations();
      changes.push(...updatedRegulations);
      
      // Store the check time
      await this.updateLastCheckTime();
      
    } catch (error) {
      console.error('Error detecting regulatory changes:', error);
    }
    
    return changes;
  }

  /**
   * Check for new regulatory intelligence entries
   */
  private async checkForNewRegulations(): Promise<RegulatoryChange[]> {
    const changes: RegulatoryChange[] = [];
    
    try {
      const newEntries = await prisma.regulatoryIntelligence.findMany({
        where: {
          lastUpdated: {
            gt: this.lastCheckTime || new Date(0)
          }
        },
        orderBy: { lastUpdated: 'desc' }
      });

      for (const entry of newEntries) {
        // Parse requirements from content
        const requirements = this.extractRequirements(entry.content);
        
        for (const requirement of requirements) {
          changes.push({
            id: `new-${entry.id}-${requirement.substring(0, 20)}`,
            source: entry.source,
            changeType: 'new_requirement',
            title: entry.title,
            description: requirement,
            effectiveDate: entry.effectiveDate?.toISOString() || new Date().toISOString(),
            requirements: [requirement],
            impactLevel: this.assessImpactLevel(requirement, 'AI/ML'),
            detectedAt: new Date(),
            processed: false
          });
        }
      }
    } catch (error) {
      console.error('Error checking for new regulations:', error);
    }
    
    return changes;
  }

  /**
   * Check for updated regulations
   */
  private async checkForUpdatedRegulations(): Promise<RegulatoryChange[]> {
    const changes: RegulatoryChange[] = [];
    
    try {
      const updatedEntries = await prisma.regulatoryIntelligence.findMany({
        where: {
          lastUpdated: {
            gt: this.lastCheckTime || new Date(0)
          }
        },
        orderBy: { lastUpdated: 'desc' }
      });

      for (const entry of updatedEntries) {
        changes.push({
          id: `updated-${entry.id}`,
          source: entry.source,
          changeType: 'updated_regulation',
          title: entry.title,
          description: `Updated regulation: ${entry.title}`,
          effectiveDate: entry.effectiveDate?.toISOString() || new Date().toISOString(),
          requirements: this.extractRequirements(entry.content),
          impactLevel: this.assessImpactLevel(entry.content, 'AI/ML'),
          detectedAt: new Date(),
          processed: false
        });
      }
    } catch (error) {
      console.error('Error checking for updated regulations:', error);
    }
    
    return changes;
  }

  /**
   * Extract requirements from regulatory content
   */
  private extractRequirements(content: string): string[] {
    const requirements: string[] = [];
    
    // Look for requirement patterns
    const patterns = [
      /must\s+([^.!?]+)/gi,
      /shall\s+([^.!?]+)/gi,
      /required\s+to\s+([^.!?]+)/gi,
      /compliance\s+with\s+([^.!?]+)/gi,
      /implementation\s+of\s+([^.!?]+)/gi,
      /validation\s+of\s+([^.!?]+)/gi,
      /monitoring\s+of\s+([^.!?]+)/gi,
      /documentation\s+of\s+([^.!?]+)/gi
    ];
    
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        requirements.push(...matches.map(match => match.trim()));
      }
    }
    
    // If no specific requirements found, extract key sentences
    if (requirements.length === 0) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
      requirements.push(...sentences.slice(0, 3)); // Take first 3 meaningful sentences
    }
    
    return requirements.slice(0, 5); // Limit to 5 requirements per regulation
  }

  /**
   * Assess impact level of a requirement
   */
  private assessImpactLevel(content: string, category: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerContent = content.toLowerCase();
    
    // Critical keywords
    if (lowerContent.includes('critical') || lowerContent.includes('mandatory') || 
        lowerContent.includes('required') || lowerContent.includes('must implement')) {
      return 'critical';
    }
    
    // High impact keywords
    if (lowerContent.includes('important') || lowerContent.includes('significant') || 
        lowerContent.includes('compliance') || lowerContent.includes('validation')) {
      return 'high';
    }
    
    // Medium impact keywords
    if (lowerContent.includes('recommended') || lowerContent.includes('should') || 
        lowerContent.includes('consider') || lowerContent.includes('monitoring')) {
      return 'medium';
    }
    
    // Default to low
    return 'low';
  }

  /**
   * Get the last check time from database
   */
  private async getLastCheckTime(): Promise<Date | null> {
    try {
      // This would be stored in a system configuration table
      // For now, we'll use a simple approach - check the last processed change
      const lastChange = await prisma.regulatoryIntelligence.findFirst({
        orderBy: { lastUpdated: 'desc' },
        select: { lastUpdated: true }
      });
      
      return lastChange?.lastUpdated || null;
    } catch (error) {
      console.error('Error getting last check time:', error);
      return null;
    }
  }

  /**
   * Update the last check time
   */
  private async updateLastCheckTime(): Promise<void> {
    try {
      // This would update a system configuration table
      // For now, we'll just log it
      console.log(`Last regulatory change check: ${new Date().toISOString()}`);
    } catch (error) {
      console.error('Error updating last check time:', error);
    }
  }

  /**
   * Mark changes as processed
   */
  async markChangesAsProcessed(changes: RegulatoryChange[]): Promise<void> {
    try {
      // This would update a changes tracking table
      // For now, we'll just log it
      console.log(`Marked ${changes.length} regulatory changes as processed`);
    } catch (error) {
      console.error('Error marking changes as processed:', error);
    }
  }

  /**
   * Get unprocessed changes
   */
  async getUnprocessedChanges(): Promise<RegulatoryChange[]> {
    try {
      // This would query a changes tracking table
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error getting unprocessed changes:', error);
      return [];
    }
  }
}

export default RegulatoryChangeDetector;
