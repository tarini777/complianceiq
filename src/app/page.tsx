/**
 * ComplianceIQ Landing Page - Simple Standalone App
 * Clear user journey and immediate access to key features
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  Bot, 
  BarChart3, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Target,
  Brain,
  TrendingUp,
  Play,
  BookOpen,
  Settings
} from 'lucide-react';

export default function Home() {
  const [showQuickStart, setShowQuickStart] = useState(false);

  const quickActions = [
    {
      title: 'Start Assessment',
      description: 'Begin your AI compliance journey',
      href: '/assessment',
      icon: FileText,
      color: 'bg-blue-500',
      badge: 'Most Popular'
    },
    {
      title: 'Ask AskRexi',
      description: 'Get instant compliance guidance',
      href: '/askrexi',
      icon: Bot,
      color: 'bg-purple-500',
      badge: 'AI Powered'
    },
    {
      title: 'View Dashboard',
      description: 'See your compliance overview',
      href: '/dashboard',
      icon: BarChart3,
      color: 'bg-green-500',
      badge: 'Analytics'
    },
    {
      title: 'Regulatory Intel',
      description: 'Latest regulatory updates',
      href: '/regulatory',
      icon: Shield,
      color: 'bg-orange-500',
      badge: 'Real-time'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assessment',
      description: 'Intelligent compliance evaluation with AskRexi AI assistant'
    },
    {
      icon: Target,
      title: 'Persona-Based Approach',
      description: 'Tailored assessments for 9 roles and 25 specialized personas'
    },
    {
      icon: Shield,
      title: 'Global Regulatory Coverage',
      description: 'Real-time updates from 17 regulatory bodies worldwide'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-persona review and approval workflows'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">ComplianceIQ</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Pharmaceutical AI Production Readiness Assessment Platform
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Reduce compliance assessment time by <strong>85%</strong>, eliminate regulatory risks, 
            and accelerate AI deployment by <strong>6-12 months</strong> while ensuring 100% regulatory compliance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Features Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose ComplianceIQ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="mr-2 h-5 w-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get up and running with ComplianceIQ in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Configure Assessment</h4>
                  <p className="text-sm text-gray-600">
                    Select your persona, therapeutic area, and AI model type
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Complete Assessment</h4>
                  <p className="text-sm text-gray-600">
                    Answer persona-specific questions with AI guidance
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Get Results</h4>
                  <p className="text-sm text-gray-600">
                    View compliance score, insights, and remediation plans
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/assessment">
                <Button size="lg" className="mr-4">
                  Start Assessment Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Status Badge */}
        <div className="text-center">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            System Operational - Ready for Beta Testing
          </Badge>
        </div>
      </div>
    </div>
  );
}