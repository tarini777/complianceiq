/**
 * Trial Creator Component - ComplianceIQ
 * Create and configure new trials with templates and custom settings
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Calendar,
  Users,
  Settings,
  Shield,
  Bell,
  BarChart3,
  Eye,
  EyeOff,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TrialTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  limitations: string[];
  maxParticipants: number;
  duration: number;
  defaultPersonas: string[];
  defaultTherapeuticAreas: string[];
}

interface TrialCreatorProps {
  onSave?: (trial: any) => void;
  onCancel?: () => void;
  templates?: TrialTemplate[];
}

const TrialCreator: React.FC<TrialCreatorProps> = ({
  onSave,
  onCancel,
  templates = []
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedTemplate, setSelectedTemplate] = useState<TrialTemplate | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    trialType: 'beta',
    startDate: '',
    endDate: '',
    maxParticipants: 50,
    
    // Features & Limitations
    features: [] as string[],
    limitations: [] as string[],
    privacyLevel: 'private',
    
    // Registration Settings
    allowSelfRegistration: true,
    requireApproval: false,
    sendNotifications: true,
    trackAnalytics: true,
    
    // Creator Information
    createdBy: '',
    createdByEmail: '',
    organizationId: '',
    tags: [] as string[],
    notes: '',
    
    // Trial Configuration
    enableCollaboration: true,
    enableAnalytics: true,
    enableRealTimeUpdates: true,
    enableAskRexi: true,
    enableRemediation: true,
    allowedPersonas: [] as string[],
    allowedTherapeuticAreas: [] as string[],
    allowedCompanyTypes: [] as string[],
    maxTeamSize: 10,
    welcomeMessage: '',
    supportContact: '',
    dataRetentionDays: 90,
    allowDataExport: false,
    requireDataAgreement: true,
    emailNotifications: true,
    inAppNotifications: true,
    reminderFrequency: 'weekly'
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock templates for demonstration
  const mockTemplates: TrialTemplate[] = [
    {
      id: 'pharma-beta',
      name: 'Pharmaceutical Beta Trial',
      description: 'Standard beta trial for pharmaceutical companies',
      category: 'pharma',
      features: ['assessment', 'analytics', 'collaboration', 'askrexi'],
      limitations: ['limited_support', 'beta_features'],
      maxParticipants: 100,
      duration: 90,
      defaultPersonas: ['data-science', 'regulatory', 'quality'],
      defaultTherapeuticAreas: ['oncology', 'cardiovascular', 'neurology']
    },
    {
      id: 'biotech-pilot',
      name: 'Biotech Pilot Program',
      description: 'Focused pilot for biotech companies',
      category: 'biotech',
      features: ['assessment', 'analytics', 'askrexi'],
      limitations: ['biotech_only', 'limited_collaboration'],
      maxParticipants: 25,
      duration: 60,
      defaultPersonas: ['data-science', 'regulatory'],
      defaultTherapeuticAreas: ['oncology', 'immunology']
    },
    {
      id: 'medical-device-eval',
      name: 'Medical Device Evaluation',
      description: 'Evaluation trial for medical device companies',
      category: 'medical_device',
      features: ['assessment', 'analytics'],
      limitations: ['device_only', 'no_collaboration'],
      maxParticipants: 50,
      duration: 45,
      defaultPersonas: ['regulatory', 'quality', 'clinical'],
      defaultTherapeuticAreas: ['all']
    }
  ];

  const displayTemplates = templates.length > 0 ? templates : mockTemplates;

  const availableFeatures = [
    'assessment',
    'analytics',
    'collaboration',
    'askrexi',
    'remediation',
    'real_time_updates',
    'custom_branding',
    'advanced_reporting'
  ];

  const availableLimitations = [
    'limited_support',
    'beta_features',
    'no_export',
    'limited_collaboration',
    'read_only_analytics',
    'trial_features_only'
  ];

  const trialTypes = [
    { value: 'beta', label: 'Beta Trial', description: 'Beta testing with full features' },
    { value: 'pilot', label: 'Pilot Program', description: 'Limited pilot with specific features' },
    { value: 'evaluation', label: 'Evaluation', description: 'Evaluation trial for assessment' },
    { value: 'demo', label: 'Demo Trial', description: 'Demo with limited functionality' }
  ];

  const privacyLevels = [
    { value: 'public', label: 'Public', description: 'Visible to all users' },
    { value: 'private', label: 'Private', description: 'Invitation only' },
    { value: 'confidential', label: 'Confidential', description: 'Highly restricted access' }
  ];

  const handleTemplateSelect = (template: TrialTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      features: template.features,
      limitations: template.limitations,
      maxParticipants: template.maxParticipants,
      allowedPersonas: template.defaultPersonas,
      allowedTherapeuticAreas: template.defaultTherapeuticAreas
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleLimitationToggle = (limitation: string) => {
    setFormData(prev => ({
      ...prev,
      limitations: prev.limitations.includes(limitation)
        ? prev.limitations.filter(l => l !== limitation)
        : [...prev.limitations, limitation]
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Trial name is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Creator name is required';
    if (!formData.createdByEmail.trim()) newErrors.createdByEmail = 'Creator email is required';
    if (formData.maxParticipants <= 0) newErrors.maxParticipants = 'Max participants must be greater than 0';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const trialData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      currentParticipants: 0,
      status: 'planning'
    };

    onSave?.(trialData);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Trial</h1>
        <p className="text-gray-600 mt-2">
          Set up a new trial for beta testing, pilot programs, or evaluations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Template Selection */}
        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
              <CardDescription>
                Start with a pre-configured template or create from scratch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === null ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTemplate(null)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Custom Trial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600">Create a trial from scratch with custom settings</p>
                  </CardContent>
                </Card>

                {displayTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs">
                          <Users className="mr-1 h-3 w-3" />
                          {template.maxParticipants} participants
                        </div>
                        <div className="flex items-center text-xs">
                          <Calendar className="mr-1 h-3 w-3" />
                          {template.duration} days
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set up the basic details for your trial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Trial Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Pharma AI Compliance Beta"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trialType">Trial Type</Label>
                  <Select value={formData.trialType} onValueChange={(value) => handleInputChange('trialType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {trialTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the purpose and scope of this trial..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                  className={errors.maxParticipants ? 'border-red-500' : ''}
                />
                {errors.maxParticipants && <p className="text-sm text-red-500">{errors.maxParticipants}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacyLevel">Privacy Level</Label>
                <Select value={formData.privacyLevel} onValueChange={(value) => handleInputChange('privacyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {privacyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-gray-500">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Creator Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Creator Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="createdBy">Creator Name *</Label>
                    <Input
                      id="createdBy"
                      value={formData.createdBy}
                      onChange={(e) => handleInputChange('createdBy', e.target.value)}
                      placeholder="Your name"
                      className={errors.createdBy ? 'border-red-500' : ''}
                    />
                    {errors.createdBy && <p className="text-sm text-red-500">{errors.createdBy}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="createdByEmail">Creator Email *</Label>
                    <Input
                      id="createdByEmail"
                      type="email"
                      value={formData.createdByEmail}
                      onChange={(e) => handleInputChange('createdByEmail', e.target.value)}
                      placeholder="your.email@company.com"
                      className={errors.createdByEmail ? 'border-red-500' : ''}
                    />
                    {errors.createdByEmail && <p className="text-sm text-red-500">{errors.createdByEmail}</p>}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes about this trial..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features & Limitations */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Features & Limitations</CardTitle>
              <CardDescription>
                Configure which features are enabled and any limitations for this trial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Enabled Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="flex-1">
                        {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Limitations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableLimitations.map((limitation) => (
                    <div key={limitation} className="flex items-center space-x-3">
                      <Checkbox
                        id={limitation}
                        checked={formData.limitations.includes(limitation)}
                        onCheckedChange={() => handleLimitationToggle(limitation)}
                      />
                      <Label htmlFor={limitation} className="flex-1">
                        {limitation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Registration Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="allowSelfRegistration"
                      checked={formData.allowSelfRegistration}
                      onCheckedChange={(checked) => handleInputChange('allowSelfRegistration', checked)}
                    />
                    <Label htmlFor="allowSelfRegistration">Allow self-registration</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="requireApproval"
                      checked={formData.requireApproval}
                      onCheckedChange={(checked) => handleInputChange('requireApproval', checked)}
                    />
                    <Label htmlFor="requireApproval">Require approval for registration</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="sendNotifications"
                      checked={formData.sendNotifications}
                      onCheckedChange={(checked) => handleInputChange('sendNotifications', checked)}
                    />
                    <Label htmlFor="sendNotifications">Send email notifications</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="trackAnalytics"
                      checked={formData.trackAnalytics}
                      onCheckedChange={(checked) => handleInputChange('trackAnalytics', checked)}
                    />
                    <Label htmlFor="trackAnalytics">Track analytics and usage</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced trial settings and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Access Control */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Access Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="enableCollaboration"
                        checked={formData.enableCollaboration}
                        onCheckedChange={(checked) => handleInputChange('enableCollaboration', checked)}
                      />
                      <Label htmlFor="enableCollaboration">Enable Collaboration</Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="enableAnalytics"
                        checked={formData.enableAnalytics}
                        onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
                      />
                      <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="enableRealTimeUpdates"
                        checked={formData.enableRealTimeUpdates}
                        onCheckedChange={(checked) => handleInputChange('enableRealTimeUpdates', checked)}
                      />
                      <Label htmlFor="enableRealTimeUpdates">Enable Real-time Updates</Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="enableAskRexi"
                        checked={formData.enableAskRexi}
                        onCheckedChange={(checked) => handleInputChange('enableAskRexi', checked)}
                      />
                      <Label htmlFor="enableAskRexi">Enable AskRexi AI Assistant</Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="enableRemediation"
                        checked={formData.enableRemediation}
                        onCheckedChange={(checked) => handleInputChange('enableRemediation', checked)}
                      />
                      <Label htmlFor="enableRemediation">Enable Remediation Plans</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
                      <Input
                        id="maxTeamSize"
                        type="number"
                        value={formData.maxTeamSize}
                        onChange={(e) => handleInputChange('maxTeamSize', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataRetentionDays">Data Retention (Days)</Label>
                      <Input
                        id="dataRetentionDays"
                        type="number"
                        value={formData.dataRetentionDays}
                        onChange={(e) => handleInputChange('dataRetentionDays', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Communication</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={formData.welcomeMessage}
                      onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                      placeholder="Welcome message for trial participants..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportContact">Support Contact</Label>
                    <Input
                      id="supportContact"
                      value={formData.supportContact}
                      onChange={(e) => handleInputChange('supportContact', e.target.value)}
                      placeholder="support@company.com"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                    />
                    <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="inAppNotifications"
                      checked={formData.inAppNotifications}
                      onCheckedChange={(checked) => handleInputChange('inAppNotifications', checked)}
                    />
                    <Label htmlFor="inAppNotifications">Enable In-App Notifications</Label>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Privacy & Data</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="allowDataExport"
                      checked={formData.allowDataExport}
                      onCheckedChange={(checked) => handleInputChange('allowDataExport', checked)}
                    />
                    <Label htmlFor="allowDataExport">Allow Data Export</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="requireDataAgreement"
                      checked={formData.requireDataAgreement}
                      onCheckedChange={(checked) => handleInputChange('requireDataAgreement', checked)}
                    />
                    <Label htmlFor="requireDataAgreement">Require Data Agreement</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <div className="flex items-center space-x-4">
          {selectedTemplate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Using template: {selectedTemplate.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Create Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrialCreator;
