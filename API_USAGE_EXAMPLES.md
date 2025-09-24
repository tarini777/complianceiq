# ComplianceIQ API Usage Examples

## Quick Start

### 1. Authentication

#### Using API Key
```bash
curl -X GET "http://localhost:3001/api/docs" \
  -H "X-API-Key: your-api-key-here"
```

#### Using Bearer Token
```bash
curl -X GET "http://localhost:3001/api/docs" \
  -H "Authorization: Bearer your-jwt-token-here"
```

### 2. Get Available Personas
```bash
curl -X GET "http://localhost:3001/api/assessment/personas?includeSubPersonas=true" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"
```

### 3. Load Dynamic Assessment
```bash
curl -X POST "http://localhost:3001/api/assessment/dynamic-load" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": "data_science",
    "subPersonaId": "ml_engineer",
    "therapeuticAreaId": "oncology",
    "companyId": "company_123",
    "assessmentType": "comprehensive"
  }'
```

### 4. Chat with AskRexi AI
```bash
curl -X POST "http://localhost:3001/api/askrexi" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the FDA requirements for AI validation?",
    "context": {
      "persona": "regulatory_affairs",
      "company": "pharma_company"
    }
  }'
```

### 5. Get Assessment Progress
```bash
curl -X GET "http://localhost:3001/api/assessment/progress?personaId=data_science&subPersonaId=ml_engineer" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"
```

### 6. Save Assessment Response
```bash
curl -X POST "http://localhost:3001/api/assessment/progress" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": "data_science",
    "subPersonaId": "ml_engineer",
    "sectionId": "fda_credibility",
    "questionId": "q001",
    "response": "yes",
    "points": 5
  }'
```

### 7. Get Regulatory Updates
```bash
curl -X GET "http://localhost:3001/api/regulatory/updates?source=fda&limit=10" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"
```

### 8. Get Analytics
```bash
curl -X GET "http://localhost:3001/api/analytics/assessment?assessmentId=assessment_123" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"
```

## JavaScript/TypeScript SDK Usage

### Install SDK
```bash
npm install @complianceiq/api-client
```

### Basic Usage
```typescript
import { ComplianceIQClient } from '@complianceiq/api-client';

const client = new ComplianceIQClient({
  baseUrl: 'http://localhost:3001',
  apiKey: 'your-api-key-here'
});

// Get personas
const personas = await client.getPersonas(true);

// Load dynamic assessment
const assessment = await client.loadDynamicAssessment({
  personaId: 'data_science',
  subPersonaId: 'ml_engineer',
  therapeuticAreaId: 'oncology'
});

// Chat with AskRexi
const response = await client.chatWithAskRexi({
  message: 'What are the key compliance requirements?',
  context: {
    persona: 'regulatory_affairs'
  }
});

// Save progress
await client.saveAssessmentProgress({
  personaId: 'data_science',
  sectionId: 'fda_credibility',
  questionId: 'q001',
  response: 'yes',
  points: 5
});
```

## Python SDK Usage

### Install SDK
```bash
pip install complianceiq-api
```

### Basic Usage
```python
from complianceiq import ComplianceIQClient

client = ComplianceIQClient(
    base_url="http://localhost:3001",
    api_key="your-api-key-here"
)

# Get personas
personas = client.get_personas(include_sub_personas=True)

# Load dynamic assessment
assessment = client.load_dynamic_assessment({
    "personaId": "data_science",
    "subPersonaId": "ml_engineer",
    "therapeuticAreaId": "oncology"
})

# Chat with AskRexi
response = client.chat_with_askrexi({
    "message": "What are the key compliance requirements?",
    "context": {
        "persona": "regulatory_affairs"
    }
})

# Save progress
client.save_assessment_progress({
    "personaId": "data_science",
    "sectionId": "fda_credibility",
    "questionId": "q001",
    "response": "yes",
    "points": 5
})
```

## Integration Examples

### 1. Custom Assessment Application
```typescript
// Custom assessment application using ComplianceIQ API
class CustomAssessmentApp {
  private client: ComplianceIQClient;

  constructor() {
    this.client = new ComplianceIQClient({
      baseUrl: 'http://localhost:3001',
      apiKey: process.env.COMPLIANCEIQ_API_KEY
    });
  }

  async startAssessment(personaId: string, companyId: string) {
    // Load dynamic assessment
    const assessment = await this.client.loadDynamicAssessment({
      personaId,
      companyId,
      assessmentType: 'comprehensive'
    });

    // Get available sections
    const sections = await this.client.getSections({
      personaId,
      includeQuestions: true
    });

    return { assessment, sections };
  }

  async submitResponse(sectionId: string, questionId: string, response: any) {
    return this.client.saveAssessmentProgress({
      personaId: 'current_user',
      sectionId,
      questionId,
      response: response.value,
      points: response.points
    });
  }

  async getAIRecommendations(question: string) {
    return this.client.chatWithAskRexi({
      message: question,
      context: {
        persona: 'current_persona',
        company: 'current_company'
      }
    });
  }
}
```

### 2. Regulatory Monitoring Dashboard
```typescript
// Regulatory monitoring dashboard
class RegulatoryDashboard {
  private client: ComplianceIQClient;

  constructor() {
    this.client = new ComplianceIQClient({
      baseUrl: 'http://localhost:3001',
      bearerToken: process.env.COMPLIANCEIQ_TOKEN
    });
  }

  async getRegulatoryUpdates() {
    // Get updates from all sources
    const updates = await this.client.getRegulatoryUpdates({
      limit: 50
    });

    // Group by source
    const groupedUpdates = updates.data.reduce((acc, update) => {
      if (!acc[update.source]) {
        acc[update.source] = [];
      }
      acc[update.source].push(update);
      return acc;
    }, {});

    return groupedUpdates;
  }

  async getComplianceStatus(companyId: string) {
    // Get current compliance status
    const analytics = await this.client.getAssessmentAnalytics();
    const insights = await this.client.getPredictiveInsights(companyId);

    return {
      currentStatus: analytics.data,
      predictions: insights.data
    };
  }
}
```

### 3. Automated Compliance Workflow
```python
# Automated compliance workflow
import asyncio
from complianceiq import ComplianceIQClient

class AutomatedComplianceWorkflow:
    def __init__(self):
        self.client = ComplianceIQClient(
            base_url="http://localhost:3001",
            api_key=os.getenv("COMPLIANCEIQ_API_KEY")
        )

    async def run_compliance_check(self, company_id: str):
        # 1. Get current assessment status
        progress = await self.client.get_assessment_progress(
            persona_id="admin"
        )
        
        # 2. Check for incomplete sections
        incomplete_sections = [
            section for section in progress.data["sections"]
            if section["completion_rate"] < 100
        ]
        
        # 3. Get AI recommendations for incomplete sections
        recommendations = []
        for section in incomplete_sections:
            ai_response = await self.client.chat_with_askrexi({
                "message": f"How to complete {section['title']} section?",
                "context": {
                    "section_id": section["section_id"],
                    "company_id": company_id
                }
            })
            recommendations.append({
                "section": section["title"],
                "recommendation": ai_response.data["response"]
            })
        
        # 4. Generate compliance report
        report = {
            "company_id": company_id,
            "overall_completion": progress.data["assessment"]["overallCompletionRate"],
            "incomplete_sections": len(incomplete_sections),
            "recommendations": recommendations,
            "generated_at": progress.data["lastUpdated"]
        }
        
        return report

# Usage
workflow = AutomatedComplianceWorkflow()
report = await workflow.run_compliance_check("company_123")
print(f"Compliance Report: {report}")
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "errors": {
      "personaId": ["Persona ID is required"],
      "companyId": ["Company ID is invalid"]
    }
  },
  "metadata": {
    "timestamp": "2025-01-12T00:00:00.000Z",
    "requestId": "req_123456789",
    "version": "1.0"
  }
}
```

### Common Error Codes
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `422` - Validation Error (invalid data format)
- `429` - Rate Limit Exceeded (too many requests)
- `500` - Internal Server Error (server issue)

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **GET requests**: 100 requests per minute
- **POST/PUT requests**: 50 requests per minute
- **DELETE requests**: 25 requests per minute

When rate limits are exceeded, you'll receive a `429` status code with details about when you can retry.

## Webhook Integration

You can set up webhooks to receive real-time notifications:

```bash
curl -X POST "http://localhost:3001/api/webhooks" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/complianceiq",
    "events": ["assessment.completed", "regulatory.update"],
    "secret": "your-webhook-secret"
  }'
```

## Testing the API

### Health Check
```bash
curl -X GET "http://localhost:3001/api/monitoring/health"
```

### API Documentation
```bash
curl -X GET "http://localhost:3001/api/docs"
```

### System Configuration
```bash
curl -X GET "http://localhost:3001/api/system-config"
```
