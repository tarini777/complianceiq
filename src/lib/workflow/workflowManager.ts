/**
 * Workflow Management System - ComplianceIQ
 * Advanced workflow management with state transitions and automation
 */

import { SectionCollaborationState as CollaborationState } from '@prisma/client';

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTrigger {
  type: 'state_change' | 'time_based' | 'condition_met' | 'user_action';
  config: any;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value: any;
}

export interface WorkflowAction {
  type: 'assign' | 'notify' | 'escalate' | 'auto_approve' | 'send_email' | 'create_task';
  config: any;
}

export interface WorkflowExecution {
  id: string;
  ruleId: string;
  sectionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  error?: string;
  results: any[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'collaboration' | 'approval' | 'escalation' | 'notification' | 'automation';
  rules: Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt'>[];
  isDefault: boolean;
}

class WorkflowManager {
  private rules: WorkflowRule[] = [];
  private executions: WorkflowExecution[] = [];
  private templates: WorkflowTemplate[] = [];
  private listeners: ((execution: WorkflowExecution) => void)[] = [];

  constructor() {
    this.loadDefaultTemplates();
    this.loadRules();
  }

  // Load default workflow templates
  private loadDefaultTemplates() {
    this.templates = [
      {
        id: 'standard_collaboration',
        name: 'Standard Collaboration Workflow',
        description: 'Standard workflow for section collaboration',
        category: 'collaboration',
        isDefault: true,
        rules: [
          {
            name: 'Auto-assign to creator',
            description: 'Automatically assign section to the user who created it',
            trigger: {
              type: 'state_change',
              config: { fromState: null, toState: 'draft' }
            },
            conditions: [],
            actions: [
              {
                type: 'assign',
                config: { assignTo: 'creator' }
              }
            ],
            isActive: true,
            priority: 1
          },
          {
            name: 'Notify on state change',
            description: 'Notify relevant users when section state changes',
            trigger: {
              type: 'state_change',
              config: {}
            },
            conditions: [],
            actions: [
              {
                type: 'notify',
                config: { 
                  recipients: ['assigned_to', 'reviewer', 'approver'],
                  message: 'Section state has changed to {{newState}}'
                }
              }
            ],
            isActive: true,
            priority: 2
          },
          {
            name: 'Escalate overdue sections',
            description: 'Escalate sections that have been in review for too long',
            trigger: {
              type: 'time_based',
              config: { interval: '24h' }
            },
            conditions: [
              {
                field: 'currentState',
                operator: 'equals',
                value: 'in_review'
              },
              {
                field: 'lastUpdated',
                operator: 'less_than',
                value: '24h'
              }
            ],
            actions: [
              {
                type: 'escalate',
                config: { 
                  escalateTo: 'manager',
                  message: 'Section has been in review for over 24 hours'
                }
              }
            ],
            isActive: true,
            priority: 3
          }
        ]
      },
      {
        id: 'approval_workflow',
        name: 'Approval Workflow',
        description: 'Workflow for section approval process',
        category: 'approval',
        isDefault: true,
        rules: [
          {
            name: 'Auto-approve low-risk sections',
            description: 'Automatically approve sections with low risk scores',
            trigger: {
              type: 'condition_met',
              config: {}
            },
            conditions: [
              {
                field: 'riskScore',
                operator: 'less_than',
                value: 3
              },
              {
                field: 'currentState',
                operator: 'equals',
                value: 'in_review'
              }
            ],
            actions: [
              {
                type: 'auto_approve',
                config: { 
                  reason: 'Low risk score - auto-approved',
                  notifyUsers: true
                }
              }
            ],
            isActive: true,
            priority: 1
          },
          {
            name: 'Require manager approval for high-risk',
            description: 'Require manager approval for high-risk sections',
            trigger: {
              type: 'state_change',
              config: { toState: 'in_review' }
            },
            conditions: [
              {
                field: 'riskScore',
                operator: 'greater_than',
                value: 7
              }
            ],
            actions: [
              {
                type: 'assign',
                config: { 
                  assignTo: 'manager',
                  message: 'High-risk section requires manager approval'
                }
              }
            ],
            isActive: true,
            priority: 2
          }
        ]
      },
      {
        id: 'notification_workflow',
        name: 'Notification Workflow',
        description: 'Comprehensive notification system',
        category: 'notification',
        isDefault: true,
        rules: [
          {
            name: 'Deadline reminders',
            description: 'Send reminders for upcoming deadlines',
            trigger: {
              type: 'time_based',
              config: { interval: '1d' }
            },
            conditions: [
              {
                field: 'deadline',
                operator: 'less_than',
                value: '7d'
              }
            ],
            actions: [
              {
                type: 'notify',
                config: { 
                  recipients: ['assigned_to'],
                  message: 'Deadline approaching: {{daysRemaining}} days remaining',
                  priority: 'high'
                }
              }
            ],
            isActive: true,
            priority: 1
          },
          {
            name: 'Weekly progress report',
            description: 'Send weekly progress reports to managers',
            trigger: {
              type: 'time_based',
              config: { interval: '7d', dayOfWeek: 1 }
            },
            conditions: [],
            actions: [
              {
                type: 'send_email',
                config: { 
                  recipients: ['managers'],
                  template: 'weekly_progress_report',
                  includeMetrics: true
                }
              }
            ],
            isActive: true,
            priority: 2
          }
        ]
      }
    ];
  }

  // Load workflow rules
  private loadRules() {
    try {
      const saved = localStorage.getItem('complianceiq_workflow_rules');
      if (saved) {
        this.rules = JSON.parse(saved);
      } else {
        // Load default rules from templates
        this.templates.forEach(template => {
          template.rules.forEach(rule => {
            this.rules.push({
              ...rule,
              id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          });
        });
        this.saveRules();
      }
    } catch (error) {
      console.error('Error loading workflow rules:', error);
    }
  }

  // Save workflow rules
  private saveRules() {
    try {
      localStorage.setItem('complianceiq_workflow_rules', JSON.stringify(this.rules));
    } catch (error) {
      console.error('Error saving workflow rules:', error);
    }
  }

  // Execute workflow rules for a given context
  async executeWorkflows(context: {
    sectionId: string;
    currentState?: string;
    newState?: string;
    assignedTo?: string;
    data?: any;
  }): Promise<WorkflowExecution[]> {
    const executions: WorkflowExecution[] = [];

    for (const rule of this.rules.filter(r => r.isActive).sort((a, b) => a.priority - b.priority)) {
      if (await this.evaluateRule(rule, context)) {
        const execution = await this.executeRule(rule, context);
        executions.push(execution);
      }
    }

    return executions;
  }

  // Evaluate if a rule should be triggered
  private async evaluateRule(rule: WorkflowRule, context: any): Promise<boolean> {
    // Check trigger
    if (!this.evaluateTrigger(rule.trigger, context)) {
      return false;
    }

    // Check conditions
    for (const condition of rule.conditions) {
      if (!this.evaluateCondition(condition, context)) {
        return false;
      }
    }

    return true;
  }

  // Evaluate trigger conditions
  private evaluateTrigger(trigger: WorkflowTrigger, context: any): boolean {
    switch (trigger.type) {
      case 'state_change':
        return context.newState === trigger.config.toState;
      case 'time_based':
        // This would be handled by a scheduler in production
        return true;
      case 'condition_met':
        return true;
      case 'user_action':
        return context.action === trigger.config.action;
      default:
        return false;
    }
  }

  // Evaluate condition
  private evaluateCondition(condition: WorkflowCondition, context: any): boolean {
    const fieldValue = this.getFieldValue(condition.field, context);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'greater_than':
        return fieldValue > condition.value;
      case 'less_than':
        return fieldValue < condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      default:
        return false;
    }
  }

  // Get field value from context
  private getFieldValue(field: string, context: any): any {
    const parts = field.split('.');
    let value = context;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }

  // Execute a workflow rule
  private async executeRule(rule: WorkflowRule, context: any): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      sectionId: context.sectionId,
      status: 'running',
      startedAt: new Date().toISOString(),
      results: []
    };

    try {
      for (const action of rule.actions) {
        const result = await this.executeAction(action, context);
        execution.results.push(result);
      }

      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.completedAt = new Date().toISOString();
    }

    this.executions.push(execution);
    this.notifyListeners(execution);

    return execution;
  }

  // Execute a workflow action
  private async executeAction(action: WorkflowAction, context: any): Promise<any> {
    switch (action.type) {
      case 'assign':
        return this.executeAssignAction(action, context);
      case 'notify':
        return this.executeNotifyAction(action, context);
      case 'escalate':
        return this.executeEscalateAction(action, context);
      case 'auto_approve':
        return this.executeAutoApproveAction(action, context);
      case 'send_email':
        return this.executeSendEmailAction(action, context);
      case 'create_task':
        return this.executeCreateTaskAction(action, context);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  // Execute assign action
  private async executeAssignAction(action: WorkflowAction, context: any): Promise<any> {
    console.log('Executing assign action:', action.config);
    // In production, this would call the API to assign the section
    return { type: 'assign', result: 'assigned' };
  }

  // Execute notify action
  private async executeNotifyAction(action: WorkflowAction, context: any): Promise<any> {
    console.log('Executing notify action:', action.config);
    // In production, this would send notifications
    return { type: 'notify', result: 'notified' };
  }

  // Execute escalate action
  private async executeEscalateAction(action: WorkflowAction, context: any): Promise<any> {
    console.log('Executing escalate action:', action.config);
    // In production, this would escalate to a manager
    return { type: 'escalate', result: 'escalated' };
  }

  // Execute auto-approve action
  private async executeAutoApproveAction(action: WorkflowAction, context: any): Promise<any> {
    console.log('Executing auto-approve action:', action.config);
    // In production, this would auto-approve the section
    return { type: 'auto_approve', result: 'approved' };
  }

  // Execute send email action
  private async executeSendEmailAction(action: WorkflowAction, context: any): Promise<any> {
    console.log('Executing send email action:', action.config);
    // In production, this would send emails
    return { type: 'send_email', result: 'email_sent' };
  }

  // Execute create task action
  private async executeCreateTaskAction(action: WorkflowAction, context: any): Promise<any> {
    console.log('Executing create task action:', action.config);
    // In production, this would create tasks
    return { type: 'create_task', result: 'task_created' };
  }

  // Get workflow templates
  getTemplates(): WorkflowTemplate[] {
    return [...this.templates];
  }

  // Get workflow rules
  getRules(): WorkflowRule[] {
    return [...this.rules];
  }

  // Get workflow executions
  getExecutions(): WorkflowExecution[] {
    return [...this.executions];
  }

  // Add a new workflow rule
  addRule(rule: Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt'>): WorkflowRule {
    const newRule: WorkflowRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.rules.push(newRule);
    this.saveRules();
    return newRule;
  }

  // Update a workflow rule
  updateRule(ruleId: string, updates: Partial<WorkflowRule>): WorkflowRule | null {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index >= 0) {
      this.rules[index] = {
        ...this.rules[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveRules();
      return this.rules[index];
    }
    return null;
  }

  // Delete a workflow rule
  deleteRule(ruleId: string): boolean {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index >= 0) {
      this.rules.splice(index, 1);
      this.saveRules();
      return true;
    }
    return false;
  }

  // Subscribe to workflow executions
  subscribe(listener: (execution: WorkflowExecution) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index >= 0) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify listeners
  private notifyListeners(execution: WorkflowExecution) {
    this.listeners.forEach(listener => {
      try {
        listener(execution);
      } catch (error) {
        console.error('Error in workflow listener:', error);
      }
    });
  }
}

// Export singleton instance
export const workflowManager = new WorkflowManager();

// Utility functions
export const createWorkflowRule = (
  name: string,
  description: string,
  trigger: WorkflowTrigger,
  conditions: WorkflowCondition[] = [],
  actions: WorkflowAction[] = []
): Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt'> => ({
  name,
  description,
  trigger,
  conditions,
  actions,
  isActive: true,
  priority: 1
});

export const createWorkflowCondition = (
  field: string,
  operator: WorkflowCondition['operator'],
  value: any
): WorkflowCondition => ({
  field,
  operator,
  value
});

export const createWorkflowAction = (
  type: WorkflowAction['type'],
  config: any
): WorkflowAction => ({
  type,
  config
});
