/**
 * Notification Bell - ComplianceIQ
 * Header notification indicator with real-time updates
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing } from 'lucide-react';
import { notificationManager } from '@/lib/notifications/notificationSystem';
import NotificationCenter from './NotificationCenter';

const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [hasNewNotifications, setHasNewNotifications] = useState<boolean>(false);

  useEffect(() => {
    // Load initial unread count
    setUnreadCount(notificationManager.getUnreadCount());

    // Subscribe to notification changes
    const unsubscribe = notificationManager.subscribe((notifications) => {
      const newUnreadCount = notifications.filter(n => !n.isRead).length;
      const previousUnreadCount = unreadCount;
      
      setUnreadCount(newUnreadCount);
      
      // Show animation for new notifications
      if (newUnreadCount > previousUnreadCount) {
        setHasNewNotifications(true);
        setTimeout(() => setHasNewNotifications(false), 3000);
      }
    });

    return unsubscribe;
  }, [unreadCount]);

  const handleBellClick = () => {
    setIsNotificationCenterOpen(true);
  };

  const handleCloseNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBellClick}
          className={`relative ${hasNewNotifications ? 'animate-pulse' : ''}`}
        >
          {hasNewNotifications ? (
            <BellRing className="h-5 w-5 text-blue-600" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={handleCloseNotificationCenter}
      />
    </>
  );
};

export default NotificationBell;
