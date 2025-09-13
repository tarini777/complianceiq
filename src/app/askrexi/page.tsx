/**
 * AskRexi Page - ComplianceIQ System
 * Intelligent regulatory compliance assistant
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  BookOpen, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import AskRexiChat from '@/components/askrexi/AskRexiChat';

const AskRexiPage: React.FC = () => {
  // Simple state without complex contextual features
  const [context] = useState<any>(null);

  const features = [
    {
      icon: BookOpen,
      title: 'Regulatory Intelligence',
      description: 'Get insights on FDA, EMA, ICH guidelines and their impact on your organization',
      examples: [
        'Latest FDA guidelines for AI in healthcare',
        'EMA requirements for your therapeutic area',
        'ICH standards for clinical trials'
      ]
    },
    {
      icon: FileText,
      title: 'Assessment Support',
      description: 'Receive guidance on specific assessment questions and compliance requirements',
      examples: [
        'How to complete data governance sections',
        'Evidence requirements for model validation',
        'Production blocker identification'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Access performance insights, trends, and actionable recommendations',
      examples: [
        'Current compliance scores and trends',
        'Industry benchmark comparisons',
        'Gap analysis and improvement areas'
      ]
    }
  ];

  const capabilities = [
    {
      title: 'Smart Query Processing',
      description: 'Natural language understanding to categorize and process your questions',
      icon: MessageSquare
    },
    {
      title: 'Context-Aware Responses',
      description: 'Provides relevant information based on your company, therapeutic area, and role',
      icon: Users
    },
    {
      title: 'Actionable Guidance',
      description: 'Clear bullet points showing what you need to do to meet compliance requirements',
      icon: Target
    },
    {
      title: 'Real-Time Updates',
      description: 'Access to the latest regulatory intelligence and assessment guidance',
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AskRexi</h1>
              <p className="text-xl text-gray-600">Your Intelligent Regulatory Compliance Assistant</p>
            </div>
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <AskRexiChat 
                className="h-full"
                initialContext={context}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What AskRexi Can Help With
                </h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <feature.icon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                      <div className="space-y-1">
                        {feature.examples.map((example, exIndex) => (
                          <div key={exIndex} className="text-xs text-gray-500 flex items-start gap-1">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Capabilities */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Capabilities
                </h3>
                <div className="space-y-3">
                  {capabilities.map((capability, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1 bg-green-100 rounded">
                        <capability.icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {capability.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {capability.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Tips */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Tips
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Be Specific</p>
                      <p className="text-xs text-gray-600">
                        Ask about specific regulations, sections, or requirements for better results
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Use Context</p>
                      <p className="text-xs text-gray-600">
                        Mention your therapeutic area or company for personalized guidance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Follow Up</p>
                      <p className="text-xs text-gray-600">
                        Ask follow-up questions to dive deeper into any topic
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <Bot className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-800">
              AskRexi is powered by ComplianceIQ's comprehensive regulatory intelligence database
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskRexiPage;
