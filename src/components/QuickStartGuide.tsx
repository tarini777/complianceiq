/**
 * Quick Start Guide Component - ComplianceIQ System
 * Interactive guide for new users to get started quickly
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  Bot, 
  BarChart3, 
  Shield,
  Users,
  Target,
  Zap,
  Clock,
  Award,
  Star
} from 'lucide-react';

interface QuickStartGuideProps {
  onComplete?: () => void;
  showProgress?: boolean;
}

const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ 
  onComplete, 
  showProgress = true 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: 'Welcome to ComplianceIQ',
      description: 'Your AI-powered pharmaceutical compliance platform',
      icon: Shield,
      action: 'Get Started',
      href: '/assessment',
      details: [
        'Reduce assessment time by 85%',
        'Eliminate regulatory risks',
        'Accelerate AI deployment by 6-12 months'
      ]
    },
    {
      id: 2,
      title: 'Configure Your Assessment',
      description: 'Select your role and therapeutic area',
      icon: FileText,
      action: 'Start Assessment',
      href: '/assessment',
      details: [
        'Choose from 9 personas and 25 sub-personas',
        'Select therapeutic area (Oncology, Cardiovascular, etc.)',
        'Configure AI model type and deployment scenario'
      ]
    },
    {
      id: 3,
      title: 'Get AI Guidance',
      description: 'Ask AskRexi for instant compliance help',
      icon: Bot,
      action: 'Chat with AskRexi',
      href: '/askrexi',
      details: [
        '1000+ training questions',
        'Real-time regulatory intelligence',
        'Context-aware responses'
      ]
    },
    {
      id: 4,
      title: 'Complete Assessment',
      description: 'Answer persona-specific questions',
      icon: Target,
      action: 'View Results',
      href: '/assessment-complete',
      details: [
        'Dynamic question filtering',
        'Real-time progress tracking',
        'Collaborative review workflows'
      ]
    },
    {
      id: 5,
      title: 'Analyze Results',
      description: 'View compliance insights and recommendations',
      icon: BarChart3,
      action: 'View Analytics',
      href: '/analytics',
      details: [
        'Compliance score breakdown',
        'Critical blocker identification',
        'Remediation recommendations'
      ]
    }
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    if (stepId === steps.length && onComplete) {
      onComplete();
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((completedSteps.length + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-6 w-6 text-primary" />
                <span>Quick Start Guide</span>
              </CardTitle>
              <CardDescription>
                Get up and running with ComplianceIQ in 5 simple steps
              </CardDescription>
            </div>
            {showProgress && (
              <Badge variant="outline" className="text-sm">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            )}
          </div>
          {showProgress && (
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Progress: {Math.round(progress)}%</span>
                <span>{completedSteps.length} completed</span>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Step */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${
                completedSteps.includes(currentStepData.id) 
                  ? 'bg-green-500' 
                  : 'bg-primary'
              } text-white`}>
                <currentStepData.icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <CardDescription className="text-base">
                  {currentStepData.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">What you'll do:</h4>
                <ul className="space-y-2">
                  {currentStepData.details.map((detail, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Link href={currentStepData.href} className="flex-1">
                  <Button className="w-full">
                    {currentStepData.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => handleStepComplete(currentStepData.id)}
                  disabled={completedSteps.includes(currentStepData.id)}
                >
                  {completedSteps.includes(currentStepData.id) ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    'Mark Complete'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">All Steps</CardTitle>
            <CardDescription>
              Click any step to jump to it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentStep === index
                      ? 'bg-primary text-primary-foreground'
                      : completedSteps.includes(step.id)
                      ? 'bg-green-50 border border-green-200'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`p-2 rounded-lg ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-500'
                      : currentStep === index
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-muted'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{step.title}</span>
                      {completedSteps.includes(step.id) && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="mr-1 h-3 w-3" />
                          Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Jump to any feature you need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/assessment">
              <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Assessment</span>
              </Button>
            </Link>
            <Link href="/askrexi">
              <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                <Bot className="h-6 w-6" />
                <span className="text-sm">AskRexi AI</span>
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Button>
            </Link>
            <Link href="/regulatory">
              <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                <Shield className="h-6 w-6" />
                <span className="text-sm">Regulatory</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStartGuide;
