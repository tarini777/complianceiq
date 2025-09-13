/**
 * Team Management Component - ComplianceIQ System
 * Manages team members and invitations following ComplianceIQ design standards
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Crown, 
  Edit, 
  Eye, 
  CheckCircle, 
  X, 
  Mail,
  MoreHorizontal,
  Shield,
  UserMinus
} from 'lucide-react';

interface SessionParticipant {
  id: string;
  role: 'owner' | 'editor' | 'viewer' | 'reviewer';
  status: 'active' | 'invited' | 'declined';
  lastActive: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    organization: {
      id: string;
      name: string;
    };
    role: {
      id: string;
      name: string;
      description: string;
    };
  };
}

interface SessionInvitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

interface TeamManagementProps {
  sessionId: string;
  currentUserId: string;
  currentUserRole: 'owner' | 'editor' | 'viewer' | 'reviewer';
  onClose?: () => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  sessionId,
  currentUserId,
  currentUserRole,
  onClose
}) => {
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [invitations, setInvitations] = useState<SessionInvitation[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer' | 'reviewer'>('viewer');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const canManageTeam = currentUserRole === 'owner' || currentUserRole === 'editor';

  useEffect(() => {
    loadTeamData();
  }, [sessionId]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      
      const [participantsRes, invitationsRes] = await Promise.all([
        fetch(`/api/collaboration/participants?sessionId=${sessionId}`),
        fetch(`/api/collaboration/invitations?sessionId=${sessionId}`)
      ]);

      if (participantsRes.ok) {
        const participantsData = await participantsRes.json();
        setParticipants(participantsData.data || []);
      }

      if (invitationsRes.ok) {
        const invitationsData = await invitationsRes.json();
        setInvitations(invitationsData.data || []);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      setActionLoading('invite');
      
      const response = await fetch('/api/collaboration/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          email: inviteEmail.trim(),
          role: inviteRole,
          invitedBy: currentUserId
        }),
      });

      if (response.ok) {
        setInviteEmail('');
        setShowInviteForm(false);
        loadTeamData(); // Refresh data
      }
    } catch (error) {
      console.error('Error inviting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveParticipant = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from this session?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      
      const response = await fetch(`/api/collaboration/participants?sessionId=${sessionId}&userId=${userId}&removedBy=${currentUserId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadTeamData(); // Refresh data
      }
    } catch (error) {
      console.error('Error removing participant:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      setActionLoading(userId);
      
      const response = await fetch('/api/collaboration/participants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId,
          role: newRole,
          updatedBy: currentUserId
        }),
      });

      if (response.ok) {
        loadTeamData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      setActionLoading(invitationId);
      
      const response = await fetch(`/api/collaboration/invitations/${invitationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadTeamData(); // Refresh data
      }
    } catch (error) {
      console.error('Error canceling invitation:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getParticipantStatus = (participant: SessionParticipant) => {
    const lastActive = new Date(participant.lastActive);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffMinutes < 5) return { status: 'online', color: 'bg-green-500', text: 'Online' };
    if (diffMinutes < 60) return { status: 'away', color: 'bg-yellow-500', text: 'Away' };
    return { status: 'offline', color: 'bg-gray-400', text: 'Offline' };
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'editor': return <Edit className="h-4 w-4" />;
      case 'reviewer': return <Shield className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'invited': return 'secondary';
      case 'declined': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-compliance-primary" />
            <span>Team Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-compliance-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-compliance-primary" />
            <span>Team Management</span>
            <Badge variant="outline" className="text-xs">
              {participants.length} members
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {canManageTeam && (
              <Button
                size="sm"
                onClick={() => setShowInviteForm(!showInviteForm)}
                disabled={actionLoading === 'invite'}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {/* Invite Form */}
        {showInviteForm && canManageTeam && (
          <Card className="border-compliance-primary">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Invite Team Member</h3>
              <form onSubmit={handleInviteUser} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-compliance-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-compliance-primary focus:border-transparent"
                  >
                    <option value="viewer">Viewer - Can view and comment</option>
                    <option value="reviewer">Reviewer - Can review and approve</option>
                    <option value="editor">Editor - Can edit and manage</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={actionLoading === 'invite' || !inviteEmail.trim()}
                  >
                    {actionLoading === 'invite' ? 'Sending...' : 'Send Invitation'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Team Members */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Members ({participants.length})</span>
          </h3>
          <div className="space-y-3">
            {participants.map((participant) => {
              const statusInfo = getParticipantStatus(participant);
              const canModify = canManageTeam && participant.user.id !== currentUserId;
              
              return (
                <Card key={participant.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-compliance-primary rounded-full flex items-center justify-center text-white font-medium">
                            {participant.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusInfo.color}`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{participant.user.name}</h4>
                            <Badge variant={getRoleBadgeVariant(participant.role)} className="text-xs">
                              {getRoleIcon(participant.role)}
                              <span className="ml-1">{participant.role}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{participant.user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getStatusBadgeVariant(participant.status)} className="text-xs">
                              {participant.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{statusInfo.text}</span>
                          </div>
                        </div>
                      </div>
                      {canModify && (
                        <div className="flex items-center space-x-2">
                          <select
                            value={participant.role}
                            onChange={(e) => handleUpdateRole(participant.user.id, e.target.value)}
                            disabled={actionLoading === participant.user.id}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="reviewer">Reviewer</option>
                            <option value="editor">Editor</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveParticipant(participant.user.id, participant.user.name)}
                            disabled={actionLoading === participant.user.id}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Pending Invitations ({invitations.length})</span>
            </h3>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="border border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{invitation.email}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getRoleBadgeVariant(invitation.role)} className="text-xs">
                              {invitation.role}
                            </Badge>
                            <Badge variant={getStatusBadgeVariant(invitation.status)} className="text-xs">
                              {invitation.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Invited {new Date(invitation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {canManageTeam && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                          disabled={actionLoading === invitation.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
