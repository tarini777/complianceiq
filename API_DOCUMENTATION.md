# ComplianceIQ Assessment API Documentation

## Overview

The ComplianceIQ Assessment API provides comprehensive endpoints for persona-driven, dynamic assessment loading with cross-collaboration capabilities. The system supports 9 personas (including Admin), 25 sub-personas, and 26 assessment sections with real-time collaboration features.

## Workflow Architecture

### 🧠 Core Brain Layer (Foundation)
**Regulatory Intelligence** - The foundational "brain" that powers everything
- Real-time regulatory updates (FDA, EMA, ICH, WHO)
- Compliance requirements and deadlines
- Enforcement actions and penalties
- Industry best practices

### 🎯 Assessment Layer (Core Process)
1. **Assessment Configuration** → User selects persona, sub-persona, company, therapy
2. **Dynamic Loading** → System loads relevant sections and questions based on persona  
3. **Complete Assessment** → Tab-based interface with real-time progress tracking
4. **Collaboration** → Multi-persona review and approval workflows
5. **Progress Tracking** → Milestone achievements and completion monitoring

### 📊 Intelligence Layer (Analysis & Action)
6. **Analytics & Reporting** → Performance insights and trend analysis
7. **Assessment Remediation Engine** → Gap analysis and improvement plans

### 📁 Document Management System
- **Assessment Versioning** with timestamp tracking
- **Audit Trails** for all assessment activities
- **Document Storage** with version control
- **Compliance Reports** with regulatory evidence

## Base URL
```
/api/assessment
```

## Authentication
All endpoints require proper authentication (to be implemented based on your auth system).

## API Endpoints

### 1. Personas Management

#### GET `/api/assessment/personas`
Get all personas with optional sub-persona inclusion.

**Query Parameters:**
- `includeSubPersonas` (boolean, optional): Include sub-personas in response

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "persona_id",
      "name": "Data Science",
      "description": "AI/ML specialists",
      "isAdmin": false,
      "subPersonas": [...],
      "_count": { "subPersonas": 3 }
    }
  ],
  "count": 9
}
```

#### POST `/api/assessment/personas`
Create a new persona.

**Request Body:**
```json
{
  "name": "New Persona",
  "description": "Description",
  "isAdmin": false
}
```

### 2. Assessment Sections

#### GET `/api/assessment/sections`
Get assessment sections with persona-based filtering.

**Query Parameters:**
- `personaId` (string, optional): Filter sections by persona access
- `subPersonaId` (string, optional): Filter by sub-persona
- `therapeuticAreaId` (string, optional): Filter by therapeutic area
- `includeQuestions` (boolean, optional): Include questions in response
- `includeCollaboration` (boolean, optional): Include collaboration states

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "section_id",
      "sectionNumber": 1,
      "title": "FDA Seven-Step Credibility Assessment",
      "basePoints": 72,
      "isCriticalBlocker": true,
      "questions": [...],
      "collaboration": [...],
      "personaAccess": [...],
      "stats": {
        "totalQuestions": 15,
        "visibleQuestions": 12,
        "completionRate": 0
      }
    }
  ],
  "count": 26,
  "filters": {
    "personaId": "data_science",
    "subPersonaId": null,
    "therapeuticAreaId": null
  }
}
```

### 3. Dynamic Assessment Loading

#### POST `/api/assessment/dynamic-load`
Generate dynamic assessment configuration based on persona and context.

**Request Body:**
```json
{
  "personaId": "data_science",
  "subPersonaId": "ml_engineer",
  "therapeuticAreaId": "oncology",
  "companyId": "company_123",
  "assessmentType": "comprehensive"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "persona": {
      "id": "data_science",
      "name": "Data Science",
      "description": "AI/ML specialists",
      "isAdmin": false,
      "subPersona": {
        "id": "ml_engineer",
        "name": "ML Engineer",
        "description": "Machine learning model development"
      }
    },
    "therapeuticArea": {
      "id": "oncology",
      "name": "Oncology",
      "description": "Cancer treatment and research"
    },
    "assessment": {
      "type": "comprehensive",
      "totalSections": 10,
      "totalQuestions": 150,
      "totalPoints": 750,
      "criticalSections": 8,
      "nonCriticalSections": 2,
      "estimatedTimeMinutes": 300
    },
    "sections": [...]
  },
  "metadata": {
    "generatedAt": "2025-01-12T00:00:00.000Z",
    "version": "1.0",
    "personaType": "standard"
  }
}
```

### 4. Collaboration Management

#### GET `/api/assessment/collaboration`
Get collaboration states for sections.

**Query Parameters:**
- `sectionId` (string, optional): Filter by section
- `personaId` (string, optional): Filter by persona involvement
- `state` (string, optional): Filter by collaboration state

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "collab_id",
      "sectionId": "section_id",
      "currentState": "in_review",
      "assignedTo": {...},
      "reviewedBy": {...},
      "approvedBy": {...},
      "comments": "Review comments",
      "lastUpdated": "2025-01-12T00:00:00.000Z"
    }
  ],
  "count": 5
}
```

#### POST `/api/assessment/collaboration`
Create or update collaboration state.

**Request Body:**
```json
{
  "sectionId": "section_id",
  "currentState": "in_review",
  "assignedToId": "persona_id",
  "reviewedById": "persona_id",
  "approvedById": "persona_id",
  "comments": "Review comments"
}
```

**Valid States:**
- `draft`: Initial state
- `in_review`: Under review
- `approved`: Approved by reviewer
- `rejected`: Rejected, needs revision
- `completed`: Fully completed

### 5. Assessment Progress

#### GET `/api/assessment/progress`
Get assessment progress for a persona.

**Query Parameters:**
- `personaId` (string, required): Persona ID
- `subPersonaId` (string, optional): Sub-persona ID
- `assessmentId` (string, optional): Assessment ID

**Response:**
```json
{
  "success": true,
  "data": {
    "persona": {
      "id": "data_science",
      "name": "Data Science",
      "isAdmin": false,
      "subPersona": {...}
    },
    "assessment": {
      "totalSections": 10,
      "totalQuestions": 150,
      "totalPoints": 750,
      "criticalSections": 8,
      "nonCriticalSections": 2,
      "overallCompletionRate": 65.5,
      "totalEarnedPoints": 490,
      "productionStatus": "not_production_ready",
      "estimatedTimeRemaining": 120
    },
    "sections": [
      {
        "sectionId": "section_id",
        "sectionNumber": 1,
        "title": "FDA Seven-Step Credibility Assessment",
        "isCriticalBlocker": true,
        "totalQuestions": 15,
        "completedQuestions": 10,
        "completionRate": 66.7,
        "basePoints": 72,
        "earnedPoints": 48,
        "collaborationState": "in_review",
        "lastUpdated": "2025-01-12T00:00:00.000Z"
      }
    ],
    "lastUpdated": "2025-01-12T00:00:00.000Z"
  }
}
```

#### POST `/api/assessment/progress`
Save assessment response.

**Request Body:**
```json
{
  "personaId": "data_science",
  "subPersonaId": "ml_engineer",
  "sectionId": "section_id",
  "questionId": "question_id",
  "response": "User response data",
  "points": 5,
  "timestamp": "2025-01-12T00:00:00.000Z"
}
```

### 6. Assessment Completion & Versioning

#### POST `/api/assessment/complete`
Complete an assessment and create a version.

**Request Body:**
```json
{
  "assessmentId": "assessment_123",
  "personaId": "data_science",
  "subPersonaId": "ml_engineer",
  "responses": {
    "question_1": "yes",
    "question_2": "no"
  },
  "completionRate": 85.5,
  "totalScore": 650,
  "maxPossibleScore": 750,
  "criticalBlockers": 2,
  "completedSections": 8,
  "totalSections": 10,
  "createdBy": "user_123",
  "versionName": "Q1 2025 Assessment",
  "description": "Initial compliance assessment"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "version": {
      "id": "version_123",
      "assessmentId": "assessment_123",
      "version": "1.0",
      "versionName": "Q1 2025 Assessment",
      "status": "completed",
      "completionRate": 85.5,
      "totalScore": 650,
      "createdBy": "user_123",
      "completedAt": "2025-01-12T00:00:00.000Z"
    },
    "assessment": {
      "id": "assessment_123",
      "status": "completed",
      "currentScore": 650,
      "completedAt": "2025-01-12T00:00:00.000Z",
      "completedBy": "user_123",
      "version": "1.0"
    }
  }
}
```

#### GET `/api/assessment/complete`
Get assessment versions.

**Query Parameters:**
- `assessmentId` (string, required): Assessment ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "version_123",
      "version": "1.0",
      "versionName": "Q1 2025 Assessment",
      "status": "completed",
      "completionRate": 85.5,
      "totalScore": 650,
      "createdAt": "2025-01-12T00:00:00.000Z",
      "completedAt": "2025-01-12T00:00:00.000Z",
      "responses": [...]
    }
  ]
}
```

### 7. Document Management

#### POST `/api/assessment/documents`
Upload document for assessment.

**Request Body (FormData):**
```
file: [File]
assessmentId: "assessment_123"
documentType: "evidence"
description: "FDA validation documents"
uploadedBy: "user_123"
version: "1.0"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc_123",
    "assessmentId": "assessment_123",
    "documentType": "evidence",
    "fileName": "fda_validation.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "version": "1.0",
    "uploadedBy": "user_123",
    "uploadedAt": "2025-01-12T00:00:00.000Z"
  }
}
```

#### GET `/api/assessment/documents`
Get documents for assessment.

**Query Parameters:**
- `assessmentId` (string, required): Assessment ID
- `documentType` (string, optional): Filter by document type
- `isActive` (boolean, optional): Filter by active status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "doc_123",
      "documentType": "evidence",
      "fileName": "fda_validation.pdf",
      "fileSize": 2048576,
      "mimeType": "application/pdf",
      "version": "1.0",
      "uploadedBy": "user_123",
      "uploadedAt": "2025-01-12T00:00:00.000Z"
    }
  ]
}
```

### 8. Audit Logs

#### GET `/api/assessment/audit`
Get audit logs for assessment.

**Query Parameters:**
- `assessmentId` (string, required): Assessment ID
- `versionId` (string, optional): Filter by version
- `action` (string, optional): Filter by action type
- `performedBy` (string, optional): Filter by user
- `limit` (number, optional): Limit results (default: 50)
- `offset` (number, optional): Offset for pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "audit_123",
      "assessmentId": "assessment_123",
      "versionId": "version_123",
      "action": "completed",
      "description": "Assessment completed with 85.5% completion rate",
      "performedBy": "user_123",
      "performedAt": "2025-01-12T00:00:00.000Z",
      "metadata": {
        "personaId": "data_science",
        "totalScore": 650,
        "criticalBlockers": 2
      }
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### POST `/api/assessment/audit`
Create audit log entry.

**Request Body:**
```json
{
  "assessmentId": "assessment_123",
  "versionId": "version_123",
  "action": "document_uploaded",
  "description": "Evidence document uploaded",
  "performedBy": "user_123",
  "metadata": {
    "fileName": "fda_validation.pdf",
    "fileSize": 2048576
  }
}
```

### 9. Therapeutic Areas

#### GET `/api/assessment/therapeutic-areas`
Get all therapeutic areas.

**Query Parameters:**
- `includeQuestions` (boolean, optional): Include related questions

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "oncology",
      "name": "Oncology",
      "description": "Cancer treatment and research",
      "code": "ONC",
      "isActive": true,
      "stats": {
        "totalQuestions": 45,
        "criticalQuestions": 12,
        "totalPoints": 225
      }
    }
  ],
  "count": 5
}
```

## Persona-Section Mappings

### Admin Persona
- **Access**: ALL 26 sections
- **Permissions**: Full access, can edit, approve, and review all sections
- **Use Case**: Complete oversight and management

### Data Science Persona
- **Sections**: 10 technical sections
- **Focus**: AI/ML validation, algorithm bias, technical governance
- **Key Sections**: AI Model Validation, GMLP Framework, Algorithm Bias Detection

### Regulatory Persona
- **Sections**: 10 regulatory sections
- **Focus**: FDA compliance, international harmonization, legal frameworks
- **Key Sections**: FDA Seven-Step, Regulatory Compliance, ICH GCP

### Executive Persona
- **Sections**: 7 strategic sections
- **Focus**: Business impact, governance, risk management
- **Key Sections**: Business Impact & ROI, Governance Committee, AI Risk Management

### Legal Persona
- **Sections**: 7 legal sections
- **Focus**: Legal compliance, data privacy, liability frameworks
- **Key Sections**: AI Legal Compliance, GDPR Compliance, Third-Party Risk

### Quality Persona
- **Sections**: 7 quality sections
- **Focus**: Quality assurance, validation, compliance
- **Key Sections**: Quality Assurance, FDA 21 CFR Part 11, Final Integration

### Clinical Persona
- **Sections**: 6 clinical sections
- **Focus**: Clinical protocols, pharmacovigilance, patient safety
- **Key Sections**: Clinical Protocols, AI Pharmacovigilance, ICH GCP

### Data Governance Persona
- **Sections**: 6 data sections
- **Focus**: Data governance, privacy, interoperability
- **Key Sections**: Advanced Data Governance, Data Privacy, AI Interoperability

### Technical Persona
- **Sections**: 6 technical sections
- **Focus**: Technical implementation, system integration
- **Key Sections**: AI Interoperability, Final Integration, Technical Governance

## Cross-Collaboration Features

### Workflow States
1. **Draft**: Initial state, assigned to primary persona
2. **In Review**: Under review by secondary persona
3. **Approved**: Approved by reviewer
4. **Rejected**: Needs revision
5. **Completed**: Fully completed and validated

### Collaboration Rules
- **Primary Persona**: Can edit and submit for review
- **Reviewer Persona**: Can review, approve, or reject
- **Approver Persona**: Final approval authority
- **Admin**: Can override any state and assign to any persona

### Real-time Updates
- Collaboration states are updated in real-time
- All personas involved receive notifications
- Progress tracking across all collaboration states

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (missing required parameters)
- `404`: Not Found (persona/section not found)
- `500`: Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **GET requests**: 100 requests per minute
- **POST/PUT requests**: 50 requests per minute

## Versioning

API versioning is handled through headers:
- `API-Version: 1.0` (current version)
- Backward compatibility maintained for at least 2 versions

## SDK Usage

Use the provided TypeScript SDK for easy integration:

```typescript
import { assessmentApi } from '@/lib/api/assessment';

// Load dynamic assessment
const assessment = await assessmentApi.loadDynamicAssessment({
  personaId: 'data_science',
  subPersonaId: 'ml_engineer',
  therapeuticAreaId: 'oncology'
});

// Get progress
const progress = await assessmentApi.getAssessmentProgress({
  personaId: 'data_science'
});

// Update collaboration
await assessmentApi.updateCollaborationState({
  sectionId: 'section_id',
  currentState: 'in_review',
  assignedToId: 'persona_id'
});
```
