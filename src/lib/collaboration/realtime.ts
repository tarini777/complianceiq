/**
 * Real-time Collaboration System - ComplianceIQ
 * WebSocket-based real-time collaboration features
 */

import { SectionCollaborationState as CollaborationState } from '@prisma/client';

export interface CollaborationEvent {
  type: 'state_change' | 'comment_added' | 'section_assigned' | 'progress_update' | 'user_joined' | 'user_left';
  sectionId: string;
  personaId: string;
  subPersonaId?: string;
  data: any;
  timestamp: string;
}

export interface CollaborationUser {
  id: string;
  name: string;
  personaId: string;
  subPersonaId?: string;
  isActive: boolean;
  lastSeen: string;
  currentSection?: string;
}

export interface CollaborationRoom {
  sectionId: string;
  users: CollaborationUser[];
  state: CollaborationState | null;
  events: CollaborationEvent[];
}

class CollaborationManager {
  private ws: WebSocket | null = null;
  private rooms: Map<string, CollaborationRoom> = new Map();
  private eventListeners: Map<string, ((event: CollaborationEvent) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // In production, this would connect to your WebSocket server
      // For now, we'll simulate the connection
      console.log('🔌 Connecting to collaboration server...');
      
      // Simulate WebSocket connection
      setTimeout(() => {
        console.log('✅ Connected to collaboration server');
        this.reconnectAttempts = 0;
      }, 1000);
    } catch (error) {
      console.error('❌ Failed to connect to collaboration server:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  // Join a collaboration room for a specific section
  joinRoom(sectionId: string, user: CollaborationUser) {
    console.log(`👤 User ${user.name} joining room ${sectionId}`);
    
    if (!this.rooms.has(sectionId)) {
      this.rooms.set(sectionId, {
        sectionId,
        users: [],
        state: null,
        events: []
      });
    }

    const room = this.rooms.get(sectionId)!;
    const existingUserIndex = room.users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      room.users[existingUserIndex] = { ...user, isActive: true, lastSeen: new Date().toISOString() };
    } else {
      room.users.push({ ...user, isActive: true, lastSeen: new Date().toISOString() });
    }

    // Emit user joined event
    this.emitEvent({
      type: 'user_joined',
      sectionId,
      personaId: user.personaId,
      subPersonaId: user.subPersonaId,
      data: { user },
      timestamp: new Date().toISOString()
    });

    return room;
  }

  // Leave a collaboration room
  leaveRoom(sectionId: string, userId: string) {
    console.log(`👋 User ${userId} leaving room ${sectionId}`);
    
    const room = this.rooms.get(sectionId);
    if (room) {
      const userIndex = room.users.findIndex(u => u.id === userId);
      if (userIndex >= 0) {
        room.users[userIndex] = { ...room.users[userIndex], isActive: false, lastSeen: new Date().toISOString() };
        
        // Emit user left event
        this.emitEvent({
          type: 'user_left',
          sectionId,
          personaId: room.users[userIndex].personaId,
          subPersonaId: room.users[userIndex].subPersonaId,
          data: { userId },
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  // Update collaboration state
  updateState(sectionId: string, state: CollaborationState, personaId: string, subPersonaId?: string) {
    console.log(`🔄 Updating state for section ${sectionId}: ${state.currentState}`);
    
    const room = this.rooms.get(sectionId);
    if (room) {
      room.state = state;
      
      // Emit state change event
      this.emitEvent({
        type: 'state_change',
        sectionId,
        personaId,
        subPersonaId,
        data: { state },
        timestamp: new Date().toISOString()
      });
    }
  }

  // Add a comment to a section
  addComment(sectionId: string, comment: string, personaId: string, subPersonaId?: string) {
    console.log(`💬 Adding comment to section ${sectionId}`);
    
    // Emit comment added event
    this.emitEvent({
      type: 'comment_added',
      sectionId,
      personaId,
      subPersonaId,
      data: { comment },
      timestamp: new Date().toISOString()
    });
  }

  // Update progress for a section
  updateProgress(sectionId: string, progress: any, personaId: string, subPersonaId?: string) {
    console.log(`📊 Updating progress for section ${sectionId}`);
    
    // Emit progress update event
    this.emitEvent({
      type: 'progress_update',
      sectionId,
      personaId,
      subPersonaId,
      data: { progress },
      timestamp: new Date().toISOString()
    });
  }

  // Assign a section to a persona
  assignSection(sectionId: string, assignedToId: string, assignedById: string) {
    console.log(`📋 Assigning section ${sectionId} to ${assignedToId}`);
    
    // Emit section assigned event
    this.emitEvent({
      type: 'section_assigned',
      sectionId,
      personaId: assignedById,
      data: { assignedToId },
      timestamp: new Date().toISOString()
    });
  }

  // Emit an event to all listeners
  private emitEvent(event: CollaborationEvent) {
    const room = this.rooms.get(event.sectionId);
    if (room) {
      room.events.push(event);
      
      // Keep only last 100 events
      if (room.events.length > 100) {
        room.events = room.events.slice(-100);
      }
    }

    // Notify all listeners for this section
    const listeners = this.eventListeners.get(event.sectionId) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  // Subscribe to events for a specific section
  subscribe(sectionId: string, listener: (event: CollaborationEvent) => void) {
    if (!this.eventListeners.has(sectionId)) {
      this.eventListeners.set(sectionId, []);
    }
    
    this.eventListeners.get(sectionId)!.push(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(sectionId);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Get current room state
  getRoom(sectionId: string): CollaborationRoom | null {
    return this.rooms.get(sectionId) || null;
  }

  // Get all active users across all rooms
  getActiveUsers(): CollaborationUser[] {
    const activeUsers: CollaborationUser[] = [];
    
    this.rooms.forEach(room => {
      room.users.forEach(user => {
        if (user.isActive) {
          activeUsers.push(user);
        }
      });
    });
    
    return activeUsers;
  }

  // Get collaboration history for a section
  getHistory(sectionId: string): CollaborationEvent[] {
    const room = this.rooms.get(sectionId);
    return room ? room.events : [];
  }

  // Disconnect from collaboration server
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    // Clear all rooms and listeners
    this.rooms.clear();
    this.eventListeners.clear();
    
    console.log('🔌 Disconnected from collaboration server');
  }
}

// Export singleton instance
export const collaborationManager = new CollaborationManager();

// Utility functions
export const createCollaborationUser = (
  id: string,
  name: string,
  personaId: string,
  subPersonaId?: string
): CollaborationUser => ({
  id,
  name,
  personaId,
  subPersonaId,
  isActive: true,
  lastSeen: new Date().toISOString()
});

export const getCollaborationStatus = (state: string): { color: string; icon: string; label: string } => {
  switch (state) {
    case 'draft':
      return { color: 'bg-gray-100 text-gray-800', icon: '✏️', label: 'Draft' };
    case 'in_review':
      return { color: 'bg-yellow-100 text-yellow-800', icon: '👁️', label: 'In Review' };
    case 'approved':
      return { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Approved' };
    case 'rejected':
      return { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Rejected' };
    case 'completed':
      return { color: 'bg-blue-100 text-blue-800', icon: '🎯', label: 'Completed' };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: '❓', label: 'Unknown' };
  }
};

export const formatCollaborationTime = (timestamp: string): string => {
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
