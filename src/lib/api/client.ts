// ComplianceIQ API Client SDK
export interface APIConfig {
  baseUrl: string;
  apiKey?: string;
  bearerToken?: string;
  timeout?: number;
}

export interface APIError {
  success: false;
  error: string;
  details?: any;
  metadata: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface APISuccess<T> {
  success: true;
  data: T;
  message?: string;
  metadata: {
    timestamp: string;
    requestId: string;
    version: string;
    pagination?: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export type APIResponse<T> = APISuccess<T> | APIError;

export class ComplianceIQClient {
  private config: APIConfig;
  private defaultHeaders: Record<string, string>;

  constructor(config: APIConfig) {
    this.config = {
      timeout: 30000,
      ...config
    };

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-Version': '1.0'
    };

    if (this.config.apiKey) {
      this.defaultHeaders['X-API-Key'] = this.config.apiKey;
    }

    if (this.config.bearerToken) {
      this.defaultHeaders['Authorization'] = `Bearer ${this.config.bearerToken}`;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Assessment APIs
  async getPersonas(includeSubPersonas: boolean = false) {
    return this.request<any[]>(
      `/api/assessment/personas?includeSubPersonas=${includeSubPersonas}`
    );
  }

  async getSections(filters?: {
    personaId?: string;
    subPersonaId?: string;
    therapeuticAreaId?: string;
    includeQuestions?: boolean;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.request<any[]>(`/api/assessment/sections?${params.toString()}`);
  }

  async loadDynamicAssessment(config: {
    personaId: string;
    subPersonaId?: string;
    therapeuticAreaId?: string;
    companyId?: string;
    assessmentType?: string;
  }) {
    return this.request<any>('/api/assessment/dynamic-load', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async getAssessmentProgress(personaId: string, subPersonaId?: string) {
    const params = new URLSearchParams({ personaId });
    if (subPersonaId) {
      params.append('subPersonaId', subPersonaId);
    }
    
    return this.request<any>(`/api/assessment/progress?${params.toString()}`);
  }

  async saveAssessmentProgress(data: {
    personaId: string;
    subPersonaId?: string;
    sectionId: string;
    questionId: string;
    response: any;
    points: number;
  }) {
    return this.request<any>('/api/assessment/progress', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async completeAssessment(data: {
    assessmentId: string;
    personaId: string;
    subPersonaId?: string;
    responses: Record<string, any>;
    completionRate: number;
    totalScore: number;
    versionName?: string;
    description?: string;
  }) {
    return this.request<any>('/api/assessment/complete', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // AskRexi AI APIs
  async chatWithAskRexi(data: {
    message: string;
    context?: {
      persona?: string;
      company?: string;
      assessmentId?: string;
    };
  }) {
    return this.request<any>('/api/askrexi', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Regulatory Intelligence APIs
  async getRegulatoryUpdates(filters?: {
    source?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.request<any[]>(`/api/regulatory/updates?${params.toString()}`);
  }

  async fetchRegulatoryData(sources: string[]) {
    return this.request<any>('/api/regulatory/fetch-data', {
      method: 'POST',
      body: JSON.stringify({ sources })
    });
  }

  // Analytics APIs
  async getAssessmentAnalytics(assessmentId?: string) {
    const params = assessmentId ? `?assessmentId=${assessmentId}` : '';
    return this.request<any>(`/api/analytics/assessment${params}`);
  }

  async getPredictiveInsights(companyId?: string) {
    const params = companyId ? `?companyId=${companyId}` : '';
    return this.request<any>(`/api/analytics/predictive-insights${params}`);
  }

  // Collaboration APIs
  async getCollaborationSessions(filters?: {
    assessmentId?: string;
    personaId?: string;
    status?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.request<any[]>(`/api/collaboration/sessions?${params.toString()}`);
  }

  async createCollaborationSession(data: {
    assessmentId: string;
    name: string;
    description?: string;
    participants: string[];
  }) {
    return this.request<any>('/api/collaboration/sessions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async sendMessage(data: {
    sessionId: string;
    message: string;
    threadId?: string;
    attachments?: any[];
  }) {
    return this.request<any>('/api/collaboration/messages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // System APIs
  async getSystemHealth() {
    return this.request<any>('/api/monitoring/health');
  }

  async getSystemConfig() {
    return this.request<any>('/api/system-config');
  }
}

// Factory function to create client
export function createClient(config: APIConfig): ComplianceIQClient {
  return new ComplianceIQClient(config);
}

// Default client configuration
export const defaultConfig: APIConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000
};
