'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AssessmentConfig as AssessmentConfigType } from '@/types';
import { therapeuticAreas, aiModelTypes, deploymentScenarios, sampleCompanies } from '@/data/sample-data';

interface AssessmentConfigProps {
  onConfigSubmit: (config: AssessmentConfigType) => void;
}

export const AssessmentConfig: React.FC<AssessmentConfigProps> = ({ onConfigSubmit }) => {
  const [config, setConfig] = useState<AssessmentConfigType>({
    selectedPersona: null,
    selectedSubPersona: null,
    therapeuticAreas: [],
    aiModelTypes: [],
    deploymentScenarios: [],
    geographicScope: 'local',
    ipStrategy: 'proprietary',
    regulatoryPathway: '',
    enableCollaboration: false
  });

  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const handleCompanySelect = (companyId: string) => {
    const company = sampleCompanies.find(c => c.id === companyId);
    if (company) {
      setConfig(prev => ({
        ...prev,
        therapeuticAreas: company.therapeuticFocus,
        aiModelTypes: company.aiInitiatives
      }));
      setSelectedCompany(companyId);
    }
  };

  const calculateComplexity = () => {
    const therapyComplexity = config.therapeuticAreas.reduce((sum, areaId) => {
      const area = therapeuticAreas.find(a => a.id === areaId);
      return sum + (area?.complexity || 0);
    }, 0);

    const aiComplexity = config.aiModelTypes.reduce((sum, typeId) => {
      const type = aiModelTypes.find(t => t.id === typeId);
      return sum + (type?.complexity || 0);
    }, 0);

    const deploymentComplexity = config.deploymentScenarios.reduce((sum, scenarioId) => {
      const scenario = deploymentScenarios.find(s => s.id === scenarioId);
      return sum + (scenario?.complexity || 0);
    }, 0);

    return therapyComplexity + aiComplexity + deploymentComplexity;
  };

  const totalComplexity = calculateComplexity();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configure Your AI Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Selection */}
          <div>
            <label className="text-sm font-medium">Quick Setup - Select Company Profile</label>
            <Select value={selectedCompany} onValueChange={handleCompanySelect}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a company profile or configure manually" />
              </SelectTrigger>
              <SelectContent>
                {sampleCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name} - {company.industryType}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Configure Manually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Therapeutic Areas Selection */}
          <div>
            <label className="text-sm font-medium">Therapeutic Areas</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {therapeuticAreas.map((area) => (
                <div key={area.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={area.id}
                    checked={config.therapeuticAreas.includes(area.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig(prev => ({
                          ...prev,
                          therapeuticAreas: [...prev.therapeuticAreas, area.id]
                        }));
                      } else {
                        setConfig(prev => ({
                          ...prev,
                          therapeuticAreas: prev.therapeuticAreas.filter(id => id !== area.id)
                        }));
                      }
                    }}
                  />
                  <label htmlFor={area.id} className="text-sm">
                    {area.name} (+{area.complexity} pts)
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* AI Model Types Selection */}
          <div>
            <label className="text-sm font-medium">AI Model Types</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {aiModelTypes.map((model) => (
                <div key={model.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={model.id}
                    checked={config.aiModelTypes.includes(model.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig(prev => ({
                          ...prev,
                          aiModelTypes: [...prev.aiModelTypes, model.id]
                        }));
                      } else {
                        setConfig(prev => ({
                          ...prev,
                          aiModelTypes: prev.aiModelTypes.filter(id => id !== model.id)
                        }));
                      }
                    }}
                  />
                  <label htmlFor={model.id} className="text-sm">
                    {model.name} (+{model.complexity} pts)
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Scenarios */}
          <div>
            <label className="text-sm font-medium">Deployment Scenarios</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {deploymentScenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={scenario.id}
                    checked={config.deploymentScenarios.includes(scenario.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig(prev => ({
                          ...prev,
                          deploymentScenarios: [...prev.deploymentScenarios, scenario.id]
                        }));
                      } else {
                        setConfig(prev => ({
                          ...prev,
                          deploymentScenarios: prev.deploymentScenarios.filter(id => id !== scenario.id)
                        }));
                      }
                    }}
                  />
                  <label htmlFor={scenario.id} className="text-sm">
                    {scenario.name} (+{scenario.complexity} pts)
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Scope */}
          <div>
            <label className="text-sm font-medium">Geographic Scope</label>
            <Select value={config.geographicScope}             onValueChange={(value) => 
              setConfig(prev => ({ ...prev, geographicScope: value as 'local' | 'global' | 'regional' }))
            }>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local/Regional</SelectItem>
                <SelectItem value="global">Global Multi-Market</SelectItem>
                <SelectItem value="regional">Specific Regional Block</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* IP Strategy */}
          <div>
            <label className="text-sm font-medium">IP Strategy</label>
            <Select value={config.ipStrategy}             onValueChange={(value) => 
              setConfig(prev => ({ ...prev, ipStrategy: value as 'proprietary' | 'licensed' | 'open_source' }))
            }>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proprietary">Proprietary Development</SelectItem>
                <SelectItem value="licensed">Licensed Technology</SelectItem>
                <SelectItem value="open_source">Open Source Components</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Collaboration Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableCollaboration"
              checked={config.enableCollaboration || false}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, enableCollaboration: !!checked }))
              }
            />
            <label htmlFor="enableCollaboration" className="text-sm font-medium">
              Enable Team Collaboration
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Allow multiple team members to collaborate on this assessment with role-based access control
          </p>

          {/* Complexity Score */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Complexity Score:</span>
                <span className="text-2xl font-bold text-blue-600">{totalComplexity} points</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Higher complexity scores indicate more comprehensive assessment requirements
              </p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            onClick={() => onConfigSubmit(config)}
            disabled={config.therapeuticAreas.length === 0 || config.aiModelTypes.length === 0}
            className="w-full"
          >
            Generate Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
