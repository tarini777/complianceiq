/**
 * Notification Center - ComplianceIQ
 * Real-time notification management UI
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings,
  X,
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Target
} from 'lucide-react';
import { 
  notificationManager, 
  Notification, 
  getNotificationIcon, 
  getPriorityColor, 
  formatNotificationTime 
} from '@/lib/notifications/notificationSystem';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [preferences, setPreferences] = useState(notificationManager.getPreferences());

  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationManager.getNotifications());

    // Subscribe to notification changes
    const unsubscribe = notificationManager.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });

    return unsubscribe;
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    notificationManager.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationManager.markAllAsRead();
  };

  const handleRemoveNotification = (notificationId: string) => {
    notificationManager.removeNotification(notificationId);
  };

  const handleClearAll = () => {
    notificationManager.clearAllNotifications();
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    notificationManager.updatePreferences(newPreferences);
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.isRead;
      case 'collaboration':
        return notification.type === 'collaboration';
      case 'assignments':
        return notification.type === 'assignment';
      case 'system':
        return notification.type === 'system';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'settings' ? (
              <div className="p-4 space-y-4">
                <h3 className="font-semibold">Notification Preferences</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Collaboration Updates</span>
                    <Button
                      variant={preferences.collaborationUpdates ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('collaborationUpdates', !preferences.collaborationUpdates)}
                    >
                      {preferences.collaborationUpdates ? 'On' : 'Off'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Section Assignments</span>
                    <Button
                      variant={preferences.sectionAssignments ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('sectionAssignments', !preferences.sectionAssignments)}
                    >
                      {preferences.sectionAssignments ? 'On' : 'Off'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deadline Reminders</span>
                    <Button
                      variant={preferences.deadlineReminders ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('deadlineReminders', !preferences.deadlineReminders)}
                    >
                      {preferences.deadlineReminders ? 'On' : 'Off'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Alerts</span>
                    <Button
                      variant={preferences.systemAlerts ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('systemAlerts', !preferences.systemAlerts)}
                    >
                      {preferences.systemAlerts ? 'On' : 'Off'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Achievements</span>
                    <Button
                      variant={preferences.achievements ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('achievements', !preferences.achievements)}
                    >
                      {preferences.achievements ? 'On' : 'Off'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <Button
                      variant={preferences.pushNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('pushNotifications', !preferences.pushNotifications)}
                    >
                      {preferences.pushNotifications ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                      Unread
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="h-full overflow-y-auto">
                    <div className="p-4">
                      {/* Actions */}
                      <div className="mb-4 flex justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                          >
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Mark All Read
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearAll}
                            disabled={notifications.length === 0}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear All
                          </Button>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="space-y-3">
                        {filteredNotifications.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No notifications</p>
                          </div>
                        ) : (
                          filteredNotifications.map((notification) => (
                            <Card
                              key={notification.id}
                              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                                !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-lg">
                                        {getNotificationIcon(notification.type)}
                                      </span>
                                      <h4 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                                        {notification.title}
                                      </h4>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${getPriorityColor(notification.priority)}`}
                                      >
                                        {notification.priority}
                                      </Badge>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2">
                                      {notification.message}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <Clock className="h-3 w-3" />
                                      <span>{formatNotificationTime(notification.timestamp)}</span>
                                      {notification.sectionId && (
                                        <>
                                          <span>•</span>
                                          <span>Section {notification.sectionId}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 ml-2">
                                    {!notification.isRead && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMarkAsRead(notification.id);
                                        }}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveNotification(notification.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                    {notification.actionUrl && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(notification.actionUrl, '_blank');
                                        }}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
