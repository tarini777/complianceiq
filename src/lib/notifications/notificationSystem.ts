/**
 * Notification System - ComplianceIQ
 * Real-time notifications for collaboration events
 */

import { CollaborationEvent, CollaborationUser } from '../collaboration/realtime';

export interface Notification {
  id: string;
  type: 'collaboration' | 'assignment' | 'deadline' | 'system' | 'achievement';
  title: string;
  message: string;
  sectionId?: string;
  personaId?: string;
  subPersonaId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  metadata?: any;
}

export interface NotificationPreferences {
  collaborationUpdates: boolean;
  sectionAssignments: boolean;
  deadlineReminders: boolean;
  systemAlerts: boolean;
  achievements: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private preferences: NotificationPreferences = {
    collaborationUpdates: true,
    sectionAssignments: true,
    deadlineReminders: true,
    systemAlerts: true,
    achievements: true,
    emailNotifications: false,
    pushNotifications: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  };

  constructor() {
    this.loadPreferences();
    this.loadNotifications();
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Show browser notification if enabled
    if (this.preferences.pushNotifications && this.shouldShowNotification(newNotification)) {
      this.showBrowserNotification(newNotification);
    }

    return newNotification;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    let hasChanges = false;
    this.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Remove a notification
  removeNotification(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index >= 0) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  // Get notifications by type
  getNotificationsByType(type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }

  // Get notifications for a specific section
  getNotificationsForSection(sectionId: string): Notification[] {
    return this.notifications.filter(n => n.sectionId === sectionId);
  }

  // Get notification count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index >= 0) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Update notification preferences
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
  }

  // Get notification preferences
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Handle collaboration events
  handleCollaborationEvent(event: CollaborationEvent, currentUser: CollaborationUser): void {
    if (!this.preferences.collaborationUpdates) return;

    let notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'> | null = null;

    switch (event.type) {
      case 'state_change':
        if (event.personaId !== currentUser.personaId) {
          notification = {
            type: 'collaboration',
            title: 'Section State Changed',
            message: `Section state changed to ${event.data.state.currentState}`,
            sectionId: event.sectionId,
            personaId: event.personaId,
            subPersonaId: event.subPersonaId,
            priority: 'medium',
            actionUrl: `/assessment-complete?section=${event.sectionId}`
          };
        }
        break;

      case 'comment_added':
        if (event.personaId !== currentUser.personaId) {
          notification = {
            type: 'collaboration',
            title: 'New Comment Added',
            message: `New comment added to section`,
            sectionId: event.sectionId,
            personaId: event.personaId,
            subPersonaId: event.subPersonaId,
            priority: 'low',
            actionUrl: `/assessment-complete?section=${event.sectionId}`
          };
        }
        break;

      case 'section_assigned':
        if (event.data.assignedToId === currentUser.id) {
          notification = {
            type: 'assignment',
            title: 'Section Assigned',
            message: `You have been assigned to a new section`,
            sectionId: event.sectionId,
            personaId: event.personaId,
            priority: 'high',
            actionUrl: `/assessment-complete?section=${event.sectionId}`
          };
        }
        break;

      case 'user_joined':
        if (event.personaId !== currentUser.personaId) {
          notification = {
            type: 'collaboration',
            title: 'User Joined Section',
            message: `${event.data.user.name} joined the section`,
            sectionId: event.sectionId,
            personaId: event.personaId,
            subPersonaId: event.subPersonaId,
            priority: 'low',
            actionUrl: `/assessment-complete?section=${event.sectionId}`
          };
        }
        break;
    }

    if (notification) {
      this.addNotification(notification);
    }
  }

  // Create system notifications
  createSystemNotification(title: string, message: string, priority: Notification['priority'] = 'medium'): void {
    if (!this.preferences.systemAlerts) return;

    this.addNotification({
      type: 'system',
      title,
      message,
      priority
    });
  }

  // Create achievement notification
  createAchievementNotification(title: string, message: string, metadata?: any): void {
    if (!this.preferences.achievements) return;

    this.addNotification({
      type: 'achievement',
      title,
      message,
      priority: 'medium',
      metadata
    });
  }

  // Create deadline reminder
  createDeadlineReminder(sectionId: string, deadline: string, daysRemaining: number): void {
    if (!this.preferences.deadlineReminders) return;

    const priority: Notification['priority'] = daysRemaining <= 1 ? 'urgent' : daysRemaining <= 3 ? 'high' : 'medium';

    this.addNotification({
      type: 'deadline',
      title: 'Deadline Reminder',
      message: `Section deadline in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`,
      sectionId,
      priority,
      actionUrl: `/assessment-complete?section=${sectionId}`,
      metadata: { deadline, daysRemaining }
    });
  }

  // Check if notification should be shown (respects quiet hours)
  private shouldShowNotification(notification: Notification): boolean {
    if (!this.preferences.quietHours.enabled) return true;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const quietStart = this.timeToMinutes(this.preferences.quietHours.start);
    const quietEnd = this.timeToMinutes(this.preferences.quietHours.end);

    // Handle quiet hours that cross midnight
    if (quietStart > quietEnd) {
      return currentTime < quietStart && currentTime > quietEnd;
    } else {
      return currentTime < quietStart || currentTime > quietEnd;
    }
  }

  // Convert time string (HH:MM) to minutes
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener([...this.notifications]);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Save notifications to localStorage
  private saveNotifications(): void {
    try {
      localStorage.setItem('complianceiq_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  // Load notifications from localStorage
  private loadNotifications(): void {
    try {
      const saved = localStorage.getItem('complianceiq_notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  // Save preferences to localStorage
  private savePreferences(): void {
    try {
      localStorage.setItem('complianceiq_notification_preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  }

  // Load preferences from localStorage
  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem('complianceiq_notification_preferences');
      if (saved) {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Utility functions
export const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'collaboration': return '👥';
    case 'assignment': return '📋';
    case 'deadline': return '⏰';
    case 'system': return '🔔';
    case 'achievement': return '🏆';
    default: return '📢';
  }
};

export const getPriorityColor = (priority: Notification['priority']): string => {
  switch (priority) {
    case 'low': return 'text-gray-600';
    case 'medium': return 'text-blue-600';
    case 'high': return 'text-orange-600';
    case 'urgent': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const formatNotificationTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};
