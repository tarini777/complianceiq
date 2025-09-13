/**
 * WebSocket Hook for ComplianceIQ
 * Manages Socket.io connections and real-time events
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

interface UseSocketOptions {
  sessionId?: string;
  userId?: string;
  autoConnect?: boolean;
}

interface Message {
  id: string;
  content: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  reactions?: any[];
}

interface TypingUser {
  userId: string;
  userName: string;
  isTyping: boolean;
}

interface OnlineUser {
  userId: string;
  userName: string;
  status: 'online' | 'away' | 'offline';
}

export const useSocket = ({ sessionId, userId, autoConnect = true }: UseSocketOptions) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect || !userId) return;

    const socketUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.complianceiq.com' 
      : 'http://localhost:3000';

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      query: {
        userId,
        sessionId: sessionId || ''
      }
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      setError('Failed to connect to real-time server');
      setIsConnected(false);
    });

    // Message events
    newSocket.on('messageCreated', (message: Message) => {
      setNewMessage(message);
    });

    newSocket.on('messageUpdated', (message: Message) => {
      // Handle message updates
      console.log('Message updated:', message);
    });

    newSocket.on('messageDeleted', (messageId: string) => {
      // Handle message deletion
      console.log('Message deleted:', messageId);
    });

    newSocket.on('messageReaction', (data: { messageId: string; reaction: any[] }) => {
      // Handle message reactions
      console.log('Message reaction:', data);
    });

    // Presence events
    newSocket.on('userJoined', (data: { userId: string; sessionId: string; user: any }) => {
      console.log('User joined:', data);
      setOnlineUsers(prev => {
        const exists = prev.find(u => u.userId === data.userId);
        if (exists) return prev;
        return [...prev, {
          userId: data.userId,
          userName: data.user.name,
          status: 'online'
        }];
      });
    });

    newSocket.on('userLeft', (data: { userId: string; sessionId: string }) => {
      console.log('User left:', data);
      setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
      setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
    });

    newSocket.on('userPresenceUpdate', (data: { userId: string; status: 'online' | 'away' | 'offline' }) => {
      setOnlineUsers(prev => prev.map(u => 
        u.userId === data.userId ? { ...u, status: data.status } : u
      ));
    });

    // Typing events
    newSocket.on('userTyping', (data: { userId: string; sessionId: string; threadId?: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          const exists = prev.find(u => u.userId === data.userId);
          if (exists) {
            return prev.map(u => 
              u.userId === data.userId ? { ...u, isTyping: true } : u
            );
          }
          return [...prev, {
            userId: data.userId,
            userName: `User ${data.userId}`, // This would be replaced with actual user name
            isTyping: true
          }];
        } else {
          return prev.filter(u => u.userId !== data.userId);
        }
      });
    });

    // Notification events
    newSocket.on('notification', (notification: any) => {
      console.log('Notification received:', notification);
      // Handle notifications (could show toast, update UI, etc.)
    });

    // Error events
    newSocket.on('error', (error: { message: string; code?: string }) => {
      console.error('Socket error:', error);
      setError(error.message);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connect if autoConnect is enabled
    if (autoConnect) {
      newSocket.connect();
    }

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [userId, sessionId, autoConnect]);

  // Join session
  const joinSession = useCallback((sessionId: string, userId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('joinSession', { sessionId, userId });
    }
  }, []);

  // Leave session
  const leaveSession = useCallback((sessionId: string, userId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leaveSession', { sessionId, userId });
    }
  }, []);

  // Send message
  const sendMessage = useCallback((data: { sessionId: string; threadId?: string; content: string; userId: string }) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', data);
    }
  }, []);

  // Start typing
  const startTyping = useCallback((sessionId: string, threadId?: string) => {
    if (socketRef.current && socketRef.current.connected && userId) {
      socketRef.current.emit('typingStart', { sessionId, threadId, userId });
      
      // Clear existing timeout
      const existingTimeout = typingTimeoutRef.current.get(sessionId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
    }
  }, [userId]);

  // Stop typing
  const stopTyping = useCallback((sessionId: string, threadId?: string) => {
    if (socketRef.current && socketRef.current.connected && userId) {
      socketRef.current.emit('typingStop', { sessionId, threadId, userId });
      
      // Clear timeout
      const timeout = typingTimeoutRef.current.get(sessionId);
      if (timeout) {
        clearTimeout(timeout);
        typingTimeoutRef.current.delete(sessionId);
      }
    }
  }, [userId]);

  // Auto-stop typing after 3 seconds
  const handleTypingChange = useCallback((sessionId: string, threadId: string | undefined, isTyping: boolean) => {
    if (isTyping) {
      startTyping(sessionId, threadId);
      
      // Set auto-stop timeout
      const timeout = setTimeout(() => {
        stopTyping(sessionId, threadId);
      }, 3000);
      
      typingTimeoutRef.current.set(sessionId, timeout);
    } else {
      stopTyping(sessionId, threadId);
    }
  }, [startTyping, stopTyping]);

  // React to message
  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    if (socketRef.current && socketRef.current.connected && userId) {
      socketRef.current.emit('reactToMessage', { messageId, emoji, userId });
    }
  }, [userId]);

  // Update presence
  const updatePresence = useCallback((status: 'online' | 'away' | 'offline') => {
    if (socketRef.current && socketRef.current.connected && userId) {
      socketRef.current.emit('updatePresence', { userId, status });
    }
  }, [userId]);

  // Clear new message notification
  const clearNewMessage = useCallback(() => {
    setNewMessage(null);
  }, []);

  return {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    newMessage,
    error,
    joinSession,
    leaveSession,
    sendMessage,
    handleTypingChange,
    reactToMessage,
    updatePresence,
    clearNewMessage
  };
};
