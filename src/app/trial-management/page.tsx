/**
 * Trial Management Page - ComplianceIQ
 * Main page for managing trials, participants, and analytics
 */

'use client';

import React, { useState, useEffect } from 'react';
import TrialDashboard from '@/components/trial-management/TrialDashboard';
import TrialCreator from '@/components/trial-management/TrialCreator';

interface Trial {
  id: string;
  name: string;
  description: string;
  trialType: string;
  status: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  features: string[];
  limitations: string[];
  privacyLevel: string;
  allowSelfRegistration: boolean;
  requireApproval: boolean;
  sendNotifications: boolean;
  trackAnalytics: boolean;
  createdBy: string;
  createdAt: string;
  metrics: {
    totalParticipants: number;
    activeParticipants: number;
    completedParticipants: number;
    completionRate: number;
    averageRating: number;
    totalSessions: number;
    totalFeedback: number;
  };
}

export default function TrialManagementPage() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);

  // Load trials on component mount
  useEffect(() => {
    loadTrials();
  }, []);

  const loadTrials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trials');
      const result = await response.json();
      
      if (result.success) {
        setTrials(result.data);
      } else {
        console.error('Failed to load trials:', result.error);
      }
    } catch (error) {
      console.error('Error loading trials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrial = async (trialData: any) => {
    try {
      const response = await fetch('/api/trials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trialData),
      });

      const result = await response.json();
      
      if (result.success) {
        setTrials(prev => [result.data, ...prev]);
        setShowCreator(false);
        // Show success message
        alert('Trial created successfully!');
      } else {
        console.error('Failed to create trial:', result.error);
        alert('Failed to create trial. Please try again.');
      }
    } catch (error) {
      console.error('Error creating trial:', error);
      alert('Error creating trial. Please try again.');
    }
  };

  const handleEditTrial = (trial: Trial) => {
    // Navigate to trial edit page or open edit modal
    console.log('Edit trial:', trial);
    // For now, just show an alert
    alert(`Edit trial: ${trial.name}`);
  };

  const handleDeleteTrial = async (trialId: string) => {
    if (confirm('Are you sure you want to delete this trial?')) {
      try {
        const response = await fetch(`/api/trials/${trialId}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        
        if (result.success) {
          setTrials(prev => prev.filter(trial => trial.id !== trialId));
          alert('Trial deleted successfully!');
        } else {
          console.error('Failed to delete trial:', result.error);
          alert('Failed to delete trial. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting trial:', error);
        alert('Error deleting trial. Please try again.');
      }
    }
  };

  const handleTrialSelect = (trial: Trial) => {
    setSelectedTrial(trial);
    // You can navigate to a detailed trial view here
    console.log('Selected trial:', trial);
  };

  if (showCreator) {
    return (
      <TrialCreator
        onSave={handleCreateTrial}
        onCancel={() => setShowCreator(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TrialDashboard
        trials={trials}
        onTrialSelect={handleTrialSelect}
        onCreateTrial={() => setShowCreator(true)}
        onEditTrial={handleEditTrial}
        onDeleteTrial={handleDeleteTrial}
      />
    </div>
  );
}
