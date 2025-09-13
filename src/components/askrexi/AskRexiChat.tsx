/**
 * AskRexi Chat Component - ComplianceIQ System
 * Intelligent regulatory compliance assistant interface
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  FileText,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'regulatory' | 'assessment' | 'analytics' | 'general';
  sources?: {
    type: 'regulation' | 'guidance' | 'analytics' | 'assessment';
    title: string;
    content: string;
    url?: string;
  }[];
  actionItems?: string[];
  impactLevel?: 'low' | 'medium' | 'high' | 'critical';
  relatedQuestions?: string[];
}

interface AskRexiChatProps {
  className?: string;
  initialContext?: {
    companyId?: string;
    therapeuticArea?: string;
    persona?: string;
    assessmentId?: string;
    userPreferences?: {
      responseStyle?: 'detailed' | 'concise' | 'conversational';
      expertiseLevel?: 'beginner' | 'intermediate' | 'expert';
      focusAreas?: string[];
    };
  };
}

const SAMPLE_QUESTIONS = [
  {
    category: 'regulatory',
    icon: BookOpen,
    title: 'Regulatory Intelligence',
    questions: [
      'What are the latest FDA guidelines for AI in healthcare?',
      'How do EMA regulations affect our therapeutic area?',
      'What are the ICH requirements for clinical trials?'
    ]
  },
  {
    category: 'assessment',
    icon: FileText,
    title: 'Assessment Support',
    questions: [
      'How do I complete the data governance section?',
      'What evidence is required for model validation?',
      'Which sections are production blockers?'
    ]
  },
  {
    category: 'analytics',
    icon: BarChart3,
    title: 'Analytics & Reporting',
    questions: [
      'What is our current compliance score?',
      'How are we performing compared to benchmarks?',
      'What are our biggest compliance gaps?'
    ]
  }
];

// Create initial message outside component to prevent re-creation on every render
const createInitialMessage = (): ChatMessage => ({
  id: '1',
  type: 'assistant' as const,
  content: `Hi! I'm **AskRexi**, your intelligent regulatory compliance assistant. I can help you with:

• **Regulatory Intelligence** - FDA, EMA, ICH guidelines and their impact
• **Assessment Support** - Guidance on specific questions and requirements  
• **Analytics & Reporting** - Performance insights and recommendations
• **Compliance Guidance** - What you need to do to meet requirements

What would you like to know?`,
  timestamp: new Date(),
  category: 'general' as const,
  relatedQuestions: [
    'What are the latest FDA guidelines for AI in healthcare?',
    'How do I complete the data governance assessment section?',
    'What is our current compliance score?',
    'What regulations apply to our therapeutic area?'
  ]
});

export const AskRexiChat: React.FC<AskRexiChatProps> = ({ 
  className = '', 
  initialContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createInitialMessage()]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]); // Only depend on messages length, not the entire messages array

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.type === 'user' || msg.type === 'assistant')
        .slice(-10) // Last 10 messages for context
        .map(msg => ({
          role: msg.type,
          content: msg.content,
          timestamp: msg.timestamp
        }));

      const response = await fetch('/api/askrexi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue.trim(),
          context: {
            ...initialContext,
            conversationHistory
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.data.answer,
          timestamp: new Date(),
          category: data.data.category,
          sources: data.data.sources,
          actionItems: data.data.actionItems,
          impactLevel: data.data.impactLevel,
          relatedQuestions: data.data.relatedQuestions
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I apologize, but I encountered an error processing your question. Please try again or rephrase your question.`,
        timestamp: new Date(),
        category: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getImpactIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'regulatory': return <BookOpen className="h-4 w-4" />;
      case 'assessment': return <FileText className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatMessageContent = (content: string) => {
    // Convert markdown-like formatting to JSX
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('• ')) {
          return (
            <div key={index} className="flex items-start gap-2 mb-1">
              <span className="text-blue-500 mt-1">•</span>
              <span className="flex-1">{line.substring(2)}</span>
            </div>
          );
        } else if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={index} className="font-semibold text-gray-900 mb-2">
              {line.substring(2, line.length - 2)}
            </div>
          );
        } else if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        } else {
          return (
            <div key={index} className="mb-2">
              {line}
            </div>
          );
        }
      });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-xl font-bold">AskRexi</div>
            <div className="text-sm text-gray-600 font-normal">
              Your Regulatory Compliance Assistant
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Chat Messages */}
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 border'
                  }`}
                >
                  {/* Message Header */}
                  {message.type === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      {message.category && (
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(message.category)}
                          <span className="ml-1 capitalize">{message.category}</span>
                        </Badge>
                      )}
                      {message.impactLevel && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            message.impactLevel === 'critical' ? 'border-red-500 text-red-700' :
                            message.impactLevel === 'high' ? 'border-orange-500 text-orange-700' :
                            message.impactLevel === 'medium' ? 'border-yellow-500 text-yellow-700' :
                            'border-green-500 text-green-700'
                          }`}
                        >
                          {getImpactIcon(message.impactLevel)}
                          <span className="ml-1 capitalize">{message.impactLevel} Impact</span>
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-auto"
                        onClick={() => copyToClipboard(message.content, message.id)}
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="prose prose-sm max-w-none">
                    {formatMessageContent(message.content)}
                  </div>

                  {/* Action Items */}
                  {message.actionItems && message.actionItems.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Action Items
                      </div>
                      <ul className="space-y-1">
                        {message.actionItems.map((item, index) => (
                          <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Sources
                      </div>
                      <div className="space-y-2">
                        {message.sources.map((source, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {source.type}
                            </Badge>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{source.title}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                {source.content.substring(0, 100)}...
                              </div>
                              {source.url && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={() => window.open(source.url, '_blank')}
                                >
                                  View Details <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Questions */}
                  {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Related Questions
                      </div>
                      <div className="space-y-1">
                        {message.relatedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-auto p-2 text-left justify-start text-xs"
                            onClick={() => handleSampleQuestion(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">AskRexi is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Sample Questions */}
        {messages.length === 1 && (
          <div className="p-6 border-t">
            <div className="text-sm font-medium text-gray-900 mb-3">
              Try asking about:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SAMPLE_QUESTIONS.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <category.icon className="h-4 w-4" />
                    {category.title}
                  </div>
                  <div className="space-y-1">
                    {category.questions.map((question, qIndex) => (
                      <Button
                        key={qIndex}
                        variant="outline"
                        size="sm"
                        className="h-auto p-2 text-left justify-start text-xs w-full"
                        onClick={() => handleSampleQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask AskRexi about regulations, assessments, or analytics..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default AskRexiChat;
