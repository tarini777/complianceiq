/**
 * Enhanced Collaboration Panel - ComplianceIQ
 * Real-time collaboration with live user presence and notifications
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
// Avatar component not available, using simple div instead
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Send,
  RefreshCw,
  UserPlus,
  Eye,
  Edit,
  Shield,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';
import { 
  assessmentApi, 
  CollaborationState 
} from '@/lib/api/assessment';
import { 
  collaborationManager, 
  CollaborationEvent, 
  CollaborationUser, 
  createCollaborationUser,
  getCollaborationStatus,
  formatCollaborationTime
} from '@/lib/collaboration/realtime';
import { notificationManager } from '@/lib/notifications/notificationSystem';

interface EnhancedCollaborationPanelProps {
  sectionId: string;
  personaId: string;
  subPersonaId?: string;
  currentUser: {
    id: string;
    name: string;
    personaId: string;
    subPersonaId?: string;
  };
  onStateChange?: (newState: CollaborationState) => void;
}

const EnhancedCollaborationPanel: React.FC<EnhancedCollaborationPanelProps> = ({
  sectionId,
  personaId,
  subPersonaId,
  currentUser,
  onStateChange
}) => {
  const [collaborationState, setCollaborationState] = useState<CollaborationState | null>(null);
  const [comments, setComments] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [roomUsers, setRoomUsers] = useState<CollaborationUser[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [recentEvents, setRecentEvents] = useState<CollaborationEvent[]>([]);

  // Load collaboration state
  useEffect(() => {
    const loadCollaborationState = async () => {
      try {
        setLoading(true);
        const response = await assessmentApi.getCollaborationStates({
          sectionId
        });

        if (response.success && response.data.length > 0) {
          setCollaborationState(response.data[0]);
        }
      } catch (error) {
        console.error('Error loading collaboration state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCollaborationState();
  }, [sectionId]);

  // Join collaboration room
  useEffect(() => {
    const collaborationUser = createCollaborationUser(
      currentUser.id,
      currentUser.name,
      currentUser.personaId,
      currentUser.subPersonaId
    );

    const room = collaborationManager.joinRoom(sectionId, collaborationUser);
    setRoomUsers(room.users);

    // Subscribe to collaboration events
    const unsubscribe = collaborationManager.subscribe(sectionId, (event) => {
      handleCollaborationEvent(event);
    });

    return () => {
      unsubscribe();
      collaborationManager.leaveRoom(sectionId, currentUser.id);
    };
  }, [sectionId, currentUser]);

  const handleCollaborationEvent = (event: CollaborationEvent) => {
    // Update room users
    const room = collaborationManager.getRoom(sectionId);
    if (room) {
      setRoomUsers(room.users);
    }

    // Add to recent events
    setRecentEvents(prev => [event, ...prev.slice(0, 9)]); // Keep last 10 events

    // Handle specific event types
    switch (event.type) {
      case 'state_change':
        if (event.data.state) {
          setCollaborationState(event.data.state);
          onStateChange?.(event.data.state);
        }
        break;
      case 'comment_added':
        // Refresh collaboration state to get updated comments
        loadCollaborationState();
        break;
    }

    // Send notification
    notificationManager.handleCollaborationEvent(event, {
      id: currentUser.id,
      name: currentUser.name,
      personaId: currentUser.personaId,
      subPersonaId: currentUser.subPersonaId,
      isActive: true,
      lastSeen: new Date().toISOString()
    });
  };

  const loadCollaborationState = async () => {
    try {
      const response = await assessmentApi.getCollaborationStates({
        sectionId
      });

      if (response.success && response.data.length > 0) {
        setCollaborationState(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading collaboration state:', error);
    }
  };

  const handleStateChange = async (newState: string) => {
    try {
      setSaving(true);
      const response = await assessmentApi.updateCollaborationState({
        sectionId,
        currentState: newState,
        assignedTo: personaId,
        comments: comments || undefined
      });

      if (response.success) {
        setCollaborationState(response.data);
        onStateChange?.(response.data);
        setComments('');
        
        // Update collaboration manager
        collaborationManager.updateState(sectionId, response.data, personaId, subPersonaId);
      }
    } catch (error) {
      console.error('Error updating collaboration state:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!comments.trim()) return;

    try {
      setSaving(true);
      const response = await assessmentApi.updateCollaborationState({
        sectionId,
        currentState: collaborationState?.currentState || 'draft',
        assignedTo: personaId,
        comments: comments
      });

      if (response.success) {
        setCollaborationState(response.data);
        setComments('');
        
        // Notify collaboration manager
        collaborationManager.addComment(sectionId, comments, personaId, subPersonaId);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStateColor = (state: string) => {
    const status = getCollaborationStatus(state);
    return status.color;
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'in_review': return <Eye className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      case 'completed': return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const canEdit = collaborationState?.assignedTo === personaId;
  const canReview = collaborationState?.currentState === 'in_review';
  const canApprove = collaborationState?.currentState === 'approved';

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Loading collaboration state...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaboration
            {collaborationState && (
              <Badge className={getStateColor(collaborationState.currentState)}>
                {getStateIcon(collaborationState.currentState)}
                <span className="ml-1 capitalize">{collaborationState.currentState.replace('_', ' ')}</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-xs text-gray-500">
              {roomUsers.filter(u => u.isActive).length} online
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Users */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Active Users</h4>
          <div className="flex flex-wrap gap-2">
            {roomUsers.filter(u => u.isActive).map((user) => (
              <div key={user.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">
                    {user.currentSection === sectionId ? 'Working here' : 'Online'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current State Info */}
        {collaborationState && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Assigned to:</span>
                <div className="text-gray-900">
                  {collaborationState.assignedTo || 'Unassigned'}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Last updated:</span>
                <div className="text-gray-900">
                  {formatCollaborationTime(collaborationState.lastUpdated.toISOString())}
                </div>
              </div>
            </div>

            {collaborationState.reviewedBy && (
              <div>
                <span className="font-medium text-gray-600">Reviewed by:</span>
                <div className="text-gray-900">{collaborationState.reviewedBy}</div>
              </div>
            )}

            {collaborationState.approvedBy && (
              <div>
                <span className="font-medium text-gray-600">Approved by:</span>
                <div className="text-gray-900">{collaborationState.approvedBy}</div>
              </div>
            )}

            {collaborationState.comments && (
              <div>
                <span className="font-medium text-gray-600">Comments:</span>
                <div className="text-gray-900 bg-gray-50 p-2 rounded text-sm">
                  {collaborationState.comments}
                </div>
              </div>
            )}
          </div>
        )}

        {/* State Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Actions</h4>
          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStateChange('in_review')}
                  disabled={saving}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Submit for Review
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStateChange('completed')}
                  disabled={saving}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
              </>
            )}

            {canReview && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStateChange('approved')}
                  disabled={saving}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStateChange('rejected')}
                  disabled={saving}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}

            {!collaborationState && (
              <Button
                size="sm"
                onClick={() => handleStateChange('draft')}
                disabled={saving}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Start Collaboration
              </Button>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Add Comment</h4>
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment or note..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!comments.trim() || saving}
            >
              <Send className="h-4 w-4 mr-1" />
              Add Comment
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        {recentEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {recentEvents.map((event, index) => (
                <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{event.data.user?.name || 'System'}</span>
                    <span>{event.type.replace('_', ' ')}</span>
                    <span className="text-gray-400">
                      {formatCollaborationTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Help */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Collaboration Workflow:</strong>
          <ul className="mt-1 space-y-1">
            <li>• <strong>Draft:</strong> Initial work in progress</li>
            <li>• <strong>In Review:</strong> Submitted for peer review</li>
            <li>• <strong>Approved:</strong> Approved by reviewer</li>
            <li>• <strong>Rejected:</strong> Needs revision</li>
            <li>• <strong>Completed:</strong> Fully validated</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCollaborationPanel;
