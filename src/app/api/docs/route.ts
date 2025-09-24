import { NextRequest, NextResponse } from 'next/server';
import { successResponse } from '@/lib/api/response-format';

// API Documentation endpoint
export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
  
  const apiDocs = {
    title: 'ComplianceIQ API',
    version: '1.0',
    description: 'Pharmaceutical AI Production Readiness Assessment Platform API',
    baseUrl: `${baseUrl}/api`,
    documentation: `${baseUrl}/api/docs`,
    
    authentication: {
      methods: ['Bearer Token', 'API Key'],
      bearerToken: {
        description: 'JWT token in Authorization header',
        example: 'Authorization: Bearer <your-jwt-token>'
      },
      apiKey: {
        description: 'API key in X-API-Key header',
        example: 'X-API-Key: <your-api-key>'
      }
    },
    
    endpoints: {
      // Assessment APIs
      assessment: {
        personas: {
          url: '/api/assessment/personas',
          methods: ['GET'],
          description: 'Get all personas and sub-personas'
        },
        sections: {
          url: '/api/assessment/sections',
          methods: ['GET'],
          description: 'Get assessment sections with filtering'
        },
        dynamicLoad: {
          url: '/api/assessment/dynamic-load',
          methods: ['POST'],
          description: 'Generate dynamic assessment configuration'
        },
        progress: {
          url: '/api/assessment/progress',
          methods: ['GET', 'POST'],
          description: 'Get and update assessment progress'
        },
        complete: {
          url: '/api/assessment/complete',
          methods: ['GET', 'POST'],
          description: 'Complete assessments and manage versions'
        },
        collaboration: {
          url: '/api/assessment/collaboration',
          methods: ['GET', 'POST'],
          description: 'Manage collaboration states'
        }
      },
      
      // AskRexi AI APIs
      askrexi: {
        chat: {
          url: '/api/askrexi',
          methods: ['POST'],
          description: 'Chat with AskRexi AI assistant'
        },
        training: {
          url: '/api/askrexi/update-training',
          methods: ['POST'],
          description: 'Update AI training data'
        }
      },
      
      // Regulatory Intelligence APIs
      regulatory: {
        updates: {
          url: '/api/regulatory/updates',
          methods: ['GET'],
          description: 'Get real-time regulatory updates'
        },
        fetchData: {
          url: '/api/regulatory/fetch-data',
          methods: ['POST'],
          description: 'Fetch regulatory data from sources'
        },
        complianceMapping: {
          url: '/api/regulatory/compliance-mapping',
          methods: ['GET'],
          description: 'Get compliance mapping data'
        }
      },
      
      // Analytics APIs
      analytics: {
        assessment: {
          url: '/api/analytics/assessment',
          methods: ['GET'],
          description: 'Get assessment analytics'
        },
        predictiveInsights: {
          url: '/api/analytics/predictive-insights',
          methods: ['GET'],
          description: 'Get predictive insights'
        },
        sentiment: {
          url: '/api/analytics/sentiment',
          methods: ['GET'],
          description: 'Get sentiment analysis'
        }
      },
      
      // Collaboration APIs
      collaboration: {
        sessions: {
          url: '/api/collaboration/sessions',
          methods: ['GET', 'POST'],
          description: 'Manage collaboration sessions'
        },
        messages: {
          url: '/api/collaboration/messages',
          methods: ['GET', 'POST'],
          description: 'Real-time messaging'
        },
        threads: {
          url: '/api/collaboration/threads',
          methods: ['GET', 'POST'],
          description: 'Threaded conversations'
        }
      },
      
      // System APIs
      system: {
        health: {
          url: '/api/monitoring/health',
          methods: ['GET'],
          description: 'System health check'
        },
        config: {
          url: '/api/system-config',
          methods: ['GET'],
          description: 'Get system configuration'
        }
      }
    },
    
    examples: {
      getPersonas: {
        url: '/api/assessment/personas?includeSubPersonas=true',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer <token>',
          'Content-Type': 'application/json'
        }
      },
      
      dynamicAssessment: {
        url: '/api/assessment/dynamic-load',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer <token>',
          'Content-Type': 'application/json'
        },
        body: {
          personaId: 'data_science',
          subPersonaId: 'ml_engineer',
          therapeuticAreaId: 'oncology',
          companyId: 'company_123'
        }
      },
      
      askrexiChat: {
        url: '/api/askrexi',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer <token>',
          'Content-Type': 'application/json'
        },
        body: {
          message: 'What are the FDA requirements for AI validation?',
          context: {
            persona: 'regulatory_affairs',
            company: 'pharma_company'
          }
        }
      }
    },
    
    statusCodes: {
      200: 'Success',
      201: 'Created',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      422: 'Validation Error',
      429: 'Rate Limit Exceeded',
      500: 'Internal Server Error'
    },
    
    rateLimits: {
      'GET requests': '100 requests per minute',
      'POST/PUT requests': '50 requests per minute',
      'DELETE requests': '25 requests per minute'
    },
    
    support: {
      documentation: 'https://docs.complianceiq.com/api',
      email: 'api-support@complianceiq.com',
      status: 'https://status.complianceiq.com'
    }
  };

  return successResponse(apiDocs, 'ComplianceIQ API Documentation');
}
