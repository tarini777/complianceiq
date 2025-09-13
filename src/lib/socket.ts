/**
 * WebSocket Server Setup for ComplianceIQ
 * Real-time collaboration and communication infrastructure
 */

import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiResponse } from 'next';
import { prisma } from './prisma';

export interface ServerToClientEvents {
  // Message events
  messageCreated: (message: any) => void;
  messageUpdated: (message: any) => void;
  messageDeleted: (messageId: string) => void;
  messageReaction: (data: { messageId: string; reaction: any }) => void;
  
  // Presence events
  userJoined: (data: { userId: string; sessionId: string; user: any }) => void;
  userLeft: (data: { userId: string; sessionId: string }) => void;
  userTyping: (data: { userId: string; sessionId: string; threadId?: string; isTyping: boolean }) => void;
  userPresenceUpdate: (data: { userId: string; status: 'online' | 'away' | 'offline' }) => void;
  
  // Session events
  sessionUpdated: (session: any) => void;
  participantAdded: (participant: any) => void;
  participantRemoved: (data: { userId: string; sessionId: string }) => void;
  participantRoleUpdated: (data: { userId: string; sessionId: string; newRole: string }) => void;
  
  // Notification events
  notification: (notification: any) => void;
  
  // Error events
  error: (error: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  // Connection events
  joinSession: (data: { sessionId: string; userId: string }) => void;
  leaveSession: (data: { sessionId: string; userId: string }) => void;
  
  // Message events
  sendMessage: (data: { sessionId: string; threadId?: string; content: string; userId: string }) => void;
  editMessage: (data: { messageId: string; content: string; userId: string }) => void;
  deleteMessage: (data: { messageId: string; userId: string }) => void;
  reactToMessage: (data: { messageId: string; emoji: string; userId: string }) => void;
  
  // Presence events
  typingStart: (data: { sessionId: string; threadId?: string; userId: string }) => void;
  typingStop: (data: { sessionId: string; threadId?: string; userId: string }) => void;
  updatePresence: (data: { userId: string; status: 'online' | 'away' | 'offline' }) => void;
  
  // Session events
  updateSession: (data: { sessionId: string; updates: any; userId: string }) => void;
  addParticipant: (data: { sessionId: string; userId: string; addedBy: string }) => void;
  removeParticipant: (data: { sessionId: string; userId: string; removedBy: string }) => void;
  updateParticipantRole: (data: { sessionId: string; userId: string; newRole: string; updatedBy: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  sessionId: string;
  userRole: string;
  lastActivity: Date;
}

class SocketManager {
  private io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  private userSessions: Map<string, Set<string>> = new Map(); // userId -> Set of sessionIds
  private sessionUsers: Map<string, Set<string>> = new Map(); // sessionId -> Set of userIds
  private typingUsers: Map<string, Map<string, Date>> = new Map(); // sessionId -> Map of userId -> timestamp

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://complianceiq.com', 'https://app.complianceiq.com']
          : ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    this.startCleanupInterval();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle session joining
      socket.on('joinSession', async (data) => {
        try {
          await this.handleJoinSession(socket, data);
        } catch (error) {
          socket.emit('error', { message: 'Failed to join session', code: 'JOIN_FAILED' });
        }
      });

      // Handle session leaving
      socket.on('leaveSession', (data) => {
        this.handleLeaveSession(socket, data);
      });

      // Handle message sending
      socket.on('sendMessage', async (data) => {
        try {
          await this.handleSendMessage(socket, data);
        } catch (error) {
          socket.emit('error', { message: 'Failed to send message', code: 'SEND_FAILED' });
        }
      });

      // Handle typing indicators
      socket.on('typingStart', (data) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typingStop', (data) => {
        this.handleTypingStop(socket, data);
      });

      // Handle presence updates
      socket.on('updatePresence', (data) => {
        this.handlePresenceUpdate(socket, data);
      });

      // Handle message reactions
      socket.on('reactToMessage', async (data) => {
        try {
          await this.handleMessageReaction(socket, data);
        } catch (error) {
          socket.emit('error', { message: 'Failed to react to message', code: 'REACTION_FAILED' });
        }
      });

      // Handle participant management
      socket.on('addParticipant', async (data) => {
        try {
          await this.handleAddParticipant(socket, data);
        } catch (error) {
          socket.emit('error', { message: 'Failed to add participant', code: 'ADD_PARTICIPANT_FAILED' });
        }
      });

      socket.on('removeParticipant', async (data) => {
        try {
          await this.handleRemoveParticipant(socket, data);
        } catch (error) {
          socket.emit('error', { message: 'Failed to remove participant', code: 'REMOVE_PARTICIPANT_FAILED' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private async handleJoinSession(socket: any, data: { sessionId: string; userId: string }) {
    const { sessionId, userId } = data;

    // Verify user is participant in session
    const participant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId,
        status: 'active'
      },
      include: {
        user: true
      }
    });

    if (!participant) {
      socket.emit('error', { message: 'User is not a participant in this session', code: 'NOT_PARTICIPANT' });
      return;
    }

    // Join socket room
    socket.join(sessionId);
    socket.data.userId = userId;
    socket.data.sessionId = sessionId;
    socket.data.userRole = participant.role;
    socket.data.lastActivity = new Date();

    // Update user sessions tracking
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);

    if (!this.sessionUsers.has(sessionId)) {
      this.sessionUsers.set(sessionId, new Set());
    }
    this.sessionUsers.get(sessionId)!.add(userId);

    // Update participant last active
    await prisma.sessionParticipant.update({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      },
      data: {
        lastActive: new Date()
      }
    });

    // Notify other users in session
    socket.to(sessionId).emit('userJoined', {
      userId,
      sessionId,
      user: {
        id: participant.user.id,
        name: participant.user.name,
        email: participant.user.email
      }
    });

    console.log(`User ${userId} joined session ${sessionId}`);
  }

  private handleLeaveSession(socket: any, data: { sessionId: string; userId: string }) {
    const { sessionId, userId } = data;

    socket.leave(sessionId);

    // Update tracking
    const userSessions = this.userSessions.get(userId);
    if (userSessions) {
      userSessions.delete(sessionId);
      if (userSessions.size === 0) {
        this.userSessions.delete(userId);
      }
    }

    const sessionUsers = this.sessionUsers.get(sessionId);
    if (sessionUsers) {
      sessionUsers.delete(userId);
      if (sessionUsers.size === 0) {
        this.sessionUsers.delete(sessionId);
        this.typingUsers.delete(sessionId);
      }
    }

    // Notify other users
    socket.to(sessionId).emit('userLeft', { userId, sessionId });

    console.log(`User ${userId} left session ${sessionId}`);
  }

  private async handleSendMessage(socket: any, data: { sessionId: string; threadId?: string; content: string; userId: string }) {
    const { sessionId, threadId, content, userId } = data;

    // Verify user is participant
    const participant = await prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId,
        status: 'active'
      }
    });

    if (!participant) {
      socket.emit('error', { message: 'User is not a participant in this session', code: 'NOT_PARTICIPANT' });
      return;
    }

    // Create message in database
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        threadId,
        userId,
        content,
        messageType: 'text'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Update participant last active
    await prisma.sessionParticipant.update({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      },
      data: {
        lastActive: new Date()
      }
    });

    // Broadcast message to all users in session
    this.io.to(sessionId).emit('messageCreated', message);

    // Send notification to offline users
    await this.sendNotificationToOfflineUsers(sessionId, {
      type: 'new_message',
      message: `${message.user.name}: ${content}`,
      sessionId,
      messageId: message.id
    });

    console.log(`Message sent in session ${sessionId} by user ${userId}`);
  }

  private handleTypingStart(socket: any, data: { sessionId: string; threadId?: string; userId: string }) {
    const { sessionId, threadId, userId } = data;

    if (!this.typingUsers.has(sessionId)) {
      this.typingUsers.set(sessionId, new Map());
    }

    this.typingUsers.get(sessionId)!.set(userId, new Date());

    // Broadcast typing indicator to other users in session
    socket.to(sessionId).emit('userTyping', {
      userId,
      sessionId,
      threadId,
      isTyping: true
    });

    // Auto-stop typing after 3 seconds
    setTimeout(() => {
      this.handleTypingStop(socket, data);
    }, 3000);
  }

  private handleTypingStop(socket: any, data: { sessionId: string; threadId?: string; userId: string }) {
    const { sessionId, threadId, userId } = data;

    const sessionTyping = this.typingUsers.get(sessionId);
    if (sessionTyping) {
      sessionTyping.delete(userId);
    }

    // Broadcast typing stop to other users
    socket.to(sessionId).emit('userTyping', {
      userId,
      sessionId,
      threadId,
      isTyping: false
    });
  }

  private handlePresenceUpdate(socket: any, data: { userId: string; status: 'online' | 'away' | 'offline' }) {
    const { userId, status } = data;

    // Broadcast presence update to all sessions user is in
    const userSessions = this.userSessions.get(userId);
    if (userSessions) {
      userSessions.forEach(sessionId => {
        socket.to(sessionId).emit('userPresenceUpdate', { userId, status });
      });
    }

    console.log(`User ${userId} presence updated to ${status}`);
  }

  private async handleMessageReaction(socket: any, data: { messageId: string; emoji: string; userId: string }) {
    const { messageId, emoji, userId } = data;

    // Check if reaction already exists
    const existingReaction = await prisma.messageReaction.findFirst({
      where: {
        messageId,
        userId,
        emoji
      }
    });

    if (existingReaction) {
      // Remove reaction
      await prisma.messageReaction.delete({
        where: {
          messageId_userId_emoji: {
            messageId,
            userId,
            emoji
          }
        }
      });
    } else {
      // Add reaction
      await prisma.messageReaction.create({
        data: {
          messageId,
          userId,
          emoji
        }
      });
    }

    // Get updated reactions
    const reactions = await prisma.messageReaction.findMany({
      where: { messageId },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Group reactions by emoji
    const groupedReactions = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = {
          emoji: reaction.emoji,
          count: 0,
          users: []
        };
      }
      acc[reaction.emoji].count++;
      acc[reaction.emoji].users.push(reaction.user);
      return acc;
    }, {} as Record<string, any>);

    // Broadcast reaction update
    this.io.emit('messageReaction', {
      messageId,
      reaction: Object.values(groupedReactions)
    });
  }

  private async handleAddParticipant(socket: any, data: { sessionId: string; userId: string; addedBy: string }) {
    // This would integrate with the existing participant management API
    // For now, just broadcast the event
    socket.to(data.sessionId).emit('participantAdded', {
      userId: data.userId,
      sessionId: data.sessionId,
      addedBy: data.addedBy
    });
  }

  private async handleRemoveParticipant(socket: any, data: { sessionId: string; userId: string; removedBy: string }) {
    socket.to(data.sessionId).emit('participantRemoved', {
      userId: data.userId,
      sessionId: data.sessionId,
      removedBy: data.removedBy
    });
  }

  private handleDisconnect(socket: any) {
    const userId = socket.data.userId;
    const sessionId = socket.data.sessionId;

    if (userId && sessionId) {
      // Remove from tracking
      const userSessions = this.userSessions.get(userId);
      if (userSessions) {
        userSessions.delete(sessionId);
        if (userSessions.size === 0) {
          this.userSessions.delete(userId);
        }
      }

      const sessionUsers = this.sessionUsers.get(sessionId);
      if (sessionUsers) {
        sessionUsers.delete(userId);
        if (sessionUsers.size === 0) {
          this.sessionUsers.delete(sessionId);
          this.typingUsers.delete(sessionId);
        }
      }

      // Notify other users
      socket.to(sessionId).emit('userLeft', { userId, sessionId });
    }

    console.log(`User disconnected: ${socket.id}`);
  }

  private async sendNotificationToOfflineUsers(sessionId: string, notification: any) {
    // Get all participants in session
    const participants = await prisma.sessionParticipant.findMany({
      where: {
        sessionId,
        status: 'active'
      },
      include: {
        user: true
      }
    });

    // Find offline participants (not in current session)
    const onlineUsers = this.sessionUsers.get(sessionId) || new Set();
    const offlineParticipants = participants.filter(p => !onlineUsers.has(p.userId));

    // Send notifications to offline users (this would integrate with email/push notification service)
    for (const participant of offlineParticipants) {
      console.log(`Sending notification to offline user ${participant.user.email}:`, notification);
      // Here you would integrate with your notification service
    }
  }

  private startCleanupInterval() {
    // Clean up stale typing indicators every 10 seconds
    setInterval(() => {
      const now = new Date();
      const staleThreshold = 10000; // 10 seconds

      for (const [sessionId, typingMap] of this.typingUsers) {
        for (const [userId, timestamp] of typingMap) {
          if (now.getTime() - timestamp.getTime() > staleThreshold) {
            typingMap.delete(userId);
            
            // Broadcast typing stop
            this.io.to(sessionId).emit('userTyping', {
              userId,
              sessionId,
              isTyping: false
            });
          }
        }

        if (typingMap.size === 0) {
          this.typingUsers.delete(sessionId);
        }
      }
    }, 10000);
  }

  public getIO() {
    return this.io;
  }

  public getOnlineUsers(sessionId: string): string[] {
    return Array.from(this.sessionUsers.get(sessionId) || []);
  }

  public isUserOnline(userId: string): boolean {
    return this.userSessions.has(userId);
  }
}

export default SocketManager;
