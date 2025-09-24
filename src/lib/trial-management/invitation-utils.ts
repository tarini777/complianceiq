/**
 * Trial Invitation Utilities - ComplianceIQ
 * Helper functions for managing trial invitations and tokens
 */

import crypto from 'crypto';

/**
 * Generate a secure invitation token
 */
export function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a secure referral code
 */
export function generateReferralCode(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

/**
 * Validate invitation token format
 */
export function isValidInvitationToken(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}

/**
 * Generate trial-specific access URL
 */
export function generateTrialAccessUrl(trialId: string, token?: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const path = token 
    ? `/trial/${trialId}/join?token=${token}`
    : `/trial/${trialId}`;
  return `${baseUrl}${path}`;
}

/**
 * Generate participant dashboard URL
 */
export function generateParticipantDashboardUrl(trialId: string, participantId: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${baseUrl}/trial/${trialId}/dashboard?participant=${participantId}`;
}

/**
 * Generate trial analytics URL for admins
 */
export function generateTrialAnalyticsUrl(trialId: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${baseUrl}/admin/trials/${trialId}/analytics`;
}

/**
 * Calculate invitation expiration date
 */
export function calculateInvitationExpiration(days: number = 7): Date {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  return expirationDate;
}

/**
 * Check if invitation is expired
 */
export function isInvitationExpired(expiredAt: Date | null): boolean {
  if (!expiredAt) return false;
  return new Date() > new Date(expiredAt);
}

/**
 * Generate trial-specific configuration for participants
 */
export function generateTrialConfiguration(trial: any, participant?: any) {
  return {
    trial: {
      id: trial.id,
      name: trial.name,
      type: trial.trialType,
      features: trial.features || [],
      limitations: trial.limitations || [],
      startDate: trial.startDate,
      endDate: trial.endDate
    },
    participant: participant ? {
      id: participant.id,
      email: participant.email,
      name: participant.name,
      persona: participant.persona,
      subPersona: participant.subPersona,
      therapeuticArea: participant.therapeuticArea
    } : null,
    access: {
      allowCollaboration: trial.configuration?.enableCollaboration || false,
      allowAnalytics: trial.configuration?.enableAnalytics || false,
      allowRealTimeUpdates: trial.configuration?.enableRealTimeUpdates || false,
      allowAskRexi: trial.configuration?.enableAskRexi || false,
      allowRemediation: trial.configuration?.enableRemediation || false,
      allowedPersonas: trial.configuration?.allowedPersonas || [],
      allowedTherapeuticAreas: trial.configuration?.allowedTherapeuticAreas || [],
      maxTeamSize: trial.configuration?.maxTeamSize || 10
    },
    ui: {
      customBranding: trial.configuration?.customBranding || null,
      welcomeMessage: trial.configuration?.welcomeMessage || null,
      supportContact: trial.configuration?.supportContact || null
    },
    privacy: {
      dataRetentionDays: trial.configuration?.dataRetentionDays || 90,
      allowDataExport: trial.configuration?.allowDataExport || false,
      requireDataAgreement: trial.configuration?.requireDataAgreement || true
    }
  };
}

/**
 * Generate email templates for trial communications
 */
export const emailTemplates = {
  invitation: {
    subject: (trialName: string) => `You're invited to join ${trialName} trial`,
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You're invited to join ${data.trialName} trial</h2>
        <p>Hello ${data.name},</p>
        <p>You've been invited by ${data.invitedBy} to participate in our ${data.trialName} trial.</p>
        <p>This trial will help you assess your pharmaceutical AI compliance readiness with our advanced platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.invitationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Join Trial
          </a>
        </div>
        <p>If you have any questions, please contact us at ${data.supportContact || 'support@complianceiq.com'}.</p>
        <p>Best regards,<br>The ComplianceIQ Team</p>
      </div>
    `
  },
  reminder: {
    subject: (trialName: string) => `Reminder: Complete your ${trialName} trial`,
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Complete your ${data.trialName} trial</h2>
        <p>Hello ${data.name},</p>
        <p>This is a friendly reminder to complete your assessment in the ${data.trialName} trial.</p>
        <p>Progress: ${data.progress}% completed</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Continue Assessment
          </a>
        </div>
        <p>Need help? Contact us at ${data.supportContact || 'support@complianceiq.com'}.</p>
      </div>
    `
  },
  completion: {
    subject: (trialName: string) => `Congratulations! You've completed ${trialName} trial`,
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations on completing ${data.trialName}!</h2>
        <p>Hello ${data.name},</p>
        <p>Thank you for participating in our ${data.trialName} trial. Your feedback is invaluable to us.</p>
        <p>Your final score: ${data.score}/100</p>
        <p>Completion time: ${data.duration}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resultsUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Results
          </a>
        </div>
        <p>Please take a moment to share your feedback about the trial experience.</p>
      </div>
    `
  }
};

/**
 * Generate trial-specific welcome message
 */
export function generateWelcomeMessage(trial: any, participant?: any): string {
  const defaultMessage = `Welcome to ${trial.name}! This trial will help you assess your pharmaceutical AI compliance readiness.`;
  
  if (trial.configuration?.welcomeMessage) {
    return trial.configuration.welcomeMessage
      .replace('{trialName}', trial.name)
      .replace('{participantName}', participant?.name || 'there')
      .replace('{trialType}', trial.trialType);
  }
  
  return defaultMessage;
}

/**
 * Generate trial summary for reports
 */
export function generateTrialSummary(trial: any, metrics: any): string {
  return `
    Trial: ${trial.name}
    Type: ${trial.trialType}
    Status: ${trial.status}
    Participants: ${metrics.overview?.totalParticipants || 0}
    Completion Rate: ${metrics.overview?.completionRate || 0}%
    Average Rating: ${metrics.overview?.averageRating || 0}/5
    Total Sessions: ${metrics.engagement?.totalSessions || 0}
    Assessments Completed: ${metrics.engagement?.totalAssessmentsCompleted || 0}
  `.trim();
}
