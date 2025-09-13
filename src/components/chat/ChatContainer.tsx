/**
 * Chat Container Component - ComplianceIQ System
 * Main chat interface following ComplianceIQ design standards
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSocket } from '@/hooks/useSocket';
import { 
  MessageSquare, 
  Users, 
  Plus, 
  Settings, 
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Search,
  Filter,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Circle,
  Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  messageType: 'text' | 'file' | 'system' | 'mention';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  reactions?: MessageReaction[];
  isEdited?: boolean;
  editedAt?: string;
}

interface MessageReaction {
  emoji: string;
  count: number;
  users: Array<{
    id: string;
    name: string;
  }>;
}

interface ChatThread {
  id: string;
  threadName: string;
  section?: {
    id: string;
    title: string;
    sectionNumber: number;
  };
  latestMessage?: ChatMessage;
  _count: {
    messages: number;
  };
}

interface SessionParticipant {
  id: string;
  role: 'owner' | 'editor' | 'viewer' | 'reviewer';
  status: 'active' | 'invited' | 'declined';
  lastActive: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ChatContainerProps {
  sessionId: string;
  currentUserId: string;
  onClose?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  sessionId,
  currentUserId,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'team' | 'threads'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket integration
  const {
    isConnected,
    onlineUsers,
    typingUsers,
    newMessage: socketNewMessage,
    error: socketError,
    joinSession,
    leaveSession,
    sendMessage: socketSendMessage,
    handleTypingChange,
    reactToMessage,
    updatePresence,
    clearNewMessage
  } = useSocket({
    sessionId,
    userId: currentUserId,
    autoConnect: true
  });

  // Load initial data
  useEffect(() => {
    loadChatData();
  }, [sessionId]);

  // Join WebSocket session when connected
  useEffect(() => {
    if (isConnected && sessionId && currentUserId) {
      joinSession(sessionId, currentUserId);
    }
  }, [isConnected, sessionId, currentUserId, joinSession]);

  // Handle real-time message updates
  useEffect(() => {
    if (socketNewMessage) {
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.find(m => m.id === socketNewMessage.id);
        if (exists) return prev;
        
        // Add new message and sort by timestamp
        const updated = [...prev, socketNewMessage as unknown as ChatMessage];
        return updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
      
      // Clear the new message notification
      clearNewMessage();
      
      // Show notification if enabled
      if (notificationsEnabled && socketNewMessage.user.id !== currentUserId) {
        showNotification(`${socketNewMessage.user.name}: ${socketNewMessage.content}`);
      }
    }
  }, [socketNewMessage, clearNewMessage, notificationsEnabled, currentUserId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = async () => {
    try {
      setLoading(true);
      
      // Load messages, threads, and participants in parallel
      const [messagesRes, threadsRes, participantsRes] = await Promise.all([
        fetch(`/api/collaboration/messages?sessionId=${sessionId}&limit=50`),
        fetch(`/api/collaboration/threads?sessionId=${sessionId}`),
        fetch(`/api/collaboration/participants?sessionId=${sessionId}`)
      ]);

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData.data || []);
      }

      if (threadsRes.ok) {
        const threadsData = await threadsRes.json();
        setThreads(threadsData.data || []);
      }

      if (participantsRes.ok) {
        const participantsData = await participantsRes.json();
        setParticipants(participantsData.data || []);
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Use WebSocket for real-time messaging
      socketSendMessage({
        sessionId,
        threadId: selectedThreadId || undefined,
        content: newMessage.trim(),
        userId: currentUserId
      });

      // Also send via API for persistence (fallback)
      const response = await fetch('/api/collaboration/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          threadId: selectedThreadId,
          userId: currentUserId,
          content: newMessage.trim(),
          messageType: 'text'
        }),
      });

      if (response.ok) {
        setNewMessage('');
        // Messages will be updated via WebSocket, no need to reload
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getParticipantStatus = (participant: SessionParticipant) => {
    const lastActive = new Date(participant.lastActive);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffMinutes < 5) return 'online';
    if (diffMinutes < 60) return 'away';
    return 'offline';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default';
      case 'editor': return 'secondary';
      case 'reviewer': return 'outline';
      default: return 'outline';
    }
  };

  const showNotification = (message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Message', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-compliance-primary" />
            <span>Team Chat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-compliance-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-compliance-primary" />
            <span>Team Chat</span>
            <Badge variant="outline" className="text-xs">
              {participants.length} members
            </Badge>
            <Badge 
              variant={isConnected ? "default" : "destructive"} 
              className="text-xs flex items-center space-x-1"
            >
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
            >
              {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
            <Clock className="h-4 w-4" />
            <span>
              {typingUsers.map(u => u.userName).join(', ')} 
              {typingUsers.length === 1 ? ' is' : ' are'} typing...
            </span>
          </div>
        )}
      </CardHeader>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-gray-50 flex flex-col">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-2">
              <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
              <TabsTrigger value="threads" className="text-xs">Threads</TabsTrigger>
              <TabsTrigger value="team" className="text-xs">Team</TabsTrigger>
            </TabsList>

            {/* Chat Tab - Threads List */}
            <TabsContent value="chat" className="flex-1 p-2 space-y-1">
              <div className="space-y-1">
                <Button
                  variant={selectedThreadId === null ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedThreadId(null)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  General Discussion
                  <Badge variant="outline" className="ml-auto text-xs">
                    {messages.filter(m => !(m as any).threadId).length}
                  </Badge>
                </Button>
                
                {threads.map((thread) => (
                  <Button
                    key={thread.id}
                    variant={selectedThreadId === thread.id ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedThreadId(thread.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium truncate">{thread.threadName}</div>
                      {thread.section && (
                        <div className="text-xs text-gray-500">Section {thread.section.sectionNumber}</div>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {thread._count.messages}
                    </Badge>
                  </Button>
                ))}
              </div>
            </TabsContent>

            {/* Threads Tab */}
            <TabsContent value="threads" className="flex-1 p-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Threads</h3>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {threads.map((thread) => (
                    <div key={thread.id} className="p-2 bg-white rounded border">
                      <div className="text-sm font-medium">{thread.threadName}</div>
                      {thread.section && (
                        <div className="text-xs text-gray-500">Section {thread.section.sectionNumber}</div>
                      )}
                      {thread.latestMessage && (
                        <div className="text-xs text-gray-600 mt-1 truncate">
                          {thread.latestMessage.user.name}: {thread.latestMessage.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="flex-1 p-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Team Members</h3>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {participants.map((participant) => {
                    const status = getParticipantStatus(participant);
                    return (
                      <div key={participant.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                        <div className="relative">
                          <div className="w-8 h-8 bg-compliance-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {participant.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(status)}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{participant.user.name}</div>
                          <div className="flex items-center space-x-1">
                            <Badge variant={getRoleBadgeVariant(participant.role)} className="text-xs">
                              {participant.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter(msg => selectedThreadId ? (msg as any).threadId === selectedThreadId : !(msg as any).threadId)
              .map((message) => (
                <div key={message.id} className={`flex ${message.user.id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.messageType === 'system' 
                      ? 'bg-gray-100 text-gray-600 text-center mx-auto text-sm'
                      : message.user.id === currentUserId
                        ? 'bg-compliance-primary text-white'
                        : 'bg-white border border-gray-200'
                  }`}>
                    {message.messageType !== 'system' && (
                      <div className="text-xs opacity-75 mb-1">
                        {message.user.name}
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                      {message.isEdited && <span className="ml-1">(edited)</span>}
                    </div>
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    // Handle typing indicators
                    if (e.target.value.length > 0) {
                      handleTypingChange(sessionId, selectedThreadId || undefined, true);
                    } else {
                      handleTypingChange(sessionId, selectedThreadId || undefined, false);
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-compliance-primary focus:border-transparent"
                />
              </div>
              <Button variant="ghost" size="sm">
                <Smile className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
