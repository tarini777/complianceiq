# ComplianceIQ: Real-Time Collaboration API Documentation

## Overview

The ComplianceIQ Real-Time Collaboration API provides comprehensive endpoints for team-based assessment workflows, including chat messaging, team management, and session administration. Built on PostgreSQL for persistence and Next.js API routes for real-time communication.

---

## Authentication

All API endpoints require proper authentication. Include the user ID in request headers or as a parameter where specified.

---

## Base URL

```
https://api.complianceiq.com/api/collaboration
```

---

## 1. Collaboration Sessions

### 1.1 List Sessions

**GET** `/sessions`

Retrieve all collaboration sessions with optional filtering.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | string | No | Filter by organization ID |
| `assessmentId` | string | No | Filter by assessment ID |
| `includeParticipants` | boolean | No | Include participant details |
| `includeMessages` | boolean | No | Include recent messages |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "session-ai-governance-committee-review",
      "assessmentId": "assessment-1",
      "organizationId": "org-123",
      "sessionName": "AI Governance Committee Review",
      "description": "Cross-functional review of AI governance framework",
      "status": "active",
      "createdBy": "user-1",
      "createdAt": "2025-09-12T20:06:31.910Z",
      "updatedAt": "2025-09-12T20:06:31.910Z",
      "assessment": {
        "id": "assessment-1",
        "assessmentName": "AI Governance Assessment",
        "status": "in_progress"
      },
      "organization": {
        "id": "org-123",
        "name": "Pharmaceutical Company"
      },
      "creator": {
        "id": "user-1",
        "name": "John Doe",
        "email": "john.doe@pharma.com"
      },
      "_count": {
        "participants": 3,
        "messages": 6,
        "threads": 2
      }
    }
  ]
}
```

### 1.2 Create Session

**POST** `/sessions`

Create a new collaboration session.

#### Request Body

```json
{
  "assessmentId": "assessment-1",
  "organizationId": "org-123",
  "sessionName": "AI Governance Committee Review",
  "description": "Cross-functional review of AI governance framework",
  "createdBy": "user-1"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "session-ai-governance-committee-review",
    "assessmentId": "assessment-1",
    "organizationId": "org-123",
    "sessionName": "AI Governance Committee Review",
    "description": "Cross-functional review of AI governance framework",
    "status": "active",
    "createdBy": "user-1",
    "createdAt": "2025-09-12T20:06:31.910Z",
    "updatedAt": "2025-09-12T20:06:31.910Z"
  }
}
```

---

## 2. Chat Messages

### 2.1 Get Messages

**GET** `/messages`

Retrieve messages for a session or thread.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID |
| `threadId` | string | No | Filter by thread ID |
| `limit` | number | No | Number of messages (default: 50) |
| `offset` | number | No | Pagination offset (default: 0) |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "msg-123",
      "sessionId": "session-ai-governance-committee-review",
      "threadId": "thread-general-discussion",
      "userId": "user-1",
      "content": "Welcome to the AI Governance Committee review session!",
      "messageType": "text",
      "parentMessageId": null,
      "fileUrl": null,
      "fileName": null,
      "fileSize": null,
      "mimeType": null,
      "isEdited": false,
      "editedAt": null,
      "createdAt": "2025-09-12T20:06:31.919Z",
      "updatedAt": "2025-09-12T20:06:31.920Z",
      "user": {
        "id": "user-1",
        "name": "John Doe",
        "email": "john.doe@pharma.com"
      },
      "reactions": [
        {
          "emoji": "👍",
          "count": 1,
          "users": [
            {
              "id": "user-2",
              "name": "Jane Smith"
            }
          ]
        }
      ]
    }
  ]
}
```

### 2.2 Send Message

**POST** `/messages`

Send a new message to a session or thread.

#### Request Body

```json
{
  "sessionId": "session-ai-governance-committee-review",
  "threadId": "thread-general-discussion",
  "userId": "user-1",
  "content": "Welcome to the AI Governance Committee review session!",
  "messageType": "text",
  "parentMessageId": null
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "msg-123",
    "sessionId": "session-ai-governance-committee-review",
    "threadId": "thread-general-discussion",
    "userId": "user-1",
    "content": "Welcome to the AI Governance Committee review session!",
    "messageType": "text",
    "createdAt": "2025-09-12T20:06:31.919Z",
    "user": {
      "id": "user-1",
      "name": "John Doe",
      "email": "john.doe@pharma.com"
    }
  }
}
```

### 2.3 Edit Message

**PUT** `/messages`

Edit an existing message.

#### Request Body

```json
{
  "messageId": "msg-123",
  "content": "Updated message content",
  "userId": "user-1"
}
```

---

## 3. Team Management

### 3.1 Get Participants

**GET** `/participants`

Get all participants for a collaboration session.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "participant-1",
      "role": "owner",
      "status": "active",
      "joinedAt": "2025-09-12T20:06:31.910Z",
      "lastActive": "2025-09-12T20:06:31.910Z",
      "user": {
        "id": "user-1",
        "name": "John Doe",
        "email": "john.doe@pharma.com",
        "organization": {
          "id": "org-123",
          "name": "Pharmaceutical Company"
        },
        "role": {
          "id": "role-1",
          "name": "Compliance Manager",
          "description": "Manages compliance processes"
        }
      }
    }
  ]
}
```

### 3.2 Add Participant

**POST** `/participants`

Add a new participant to a session.

#### Request Body

```json
{
  "sessionId": "session-ai-governance-committee-review",
  "userId": "user-2",
  "role": "editor",
  "addedBy": "user-1"
}
```

### 3.3 Update Participant Role

**PUT** `/participants`

Update a participant's role in a session.

#### Request Body

```json
{
  "sessionId": "session-ai-governance-committee-review",
  "userId": "user-2",
  "role": "reviewer",
  "updatedBy": "user-1"
}
```

### 3.4 Remove Participant

**DELETE** `/participants`

Remove a participant from a session.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID |
| `userId` | string | Yes | User ID to remove |
| `removedBy` | string | Yes | ID of user performing removal |

---

## 4. Chat Threads

### 4.1 Get Threads

**GET** `/threads`

Get all threads for a collaboration session.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "thread-general-discussion",
      "sessionId": "session-ai-governance-committee-review",
      "threadName": "General Discussion",
      "sectionId": null,
      "createdBy": "user-1",
      "createdAt": "2025-09-12T20:06:31.917Z",
      "updatedAt": "2025-09-12T20:06:31.917Z",
      "section": null,
      "_count": {
        "messages": 5
      },
      "latestMessage": {
        "id": "msg-123",
        "content": "Latest message content",
        "createdAt": "2025-09-12T20:06:31.919Z",
        "user": {
          "id": "user-1",
          "name": "John Doe"
        }
      }
    }
  ]
}
```

### 4.2 Create Thread

**POST** `/threads`

Create a new chat thread.

#### Request Body

```json
{
  "sessionId": "session-ai-governance-committee-review",
  "threadName": "Section 19: AI Governance Committee",
  "sectionId": "section-1",
  "createdBy": "user-1"
}
```

---

## 5. Message Reactions

### 5.1 Add/Remove Reaction

**POST** `/reactions`

Add or remove an emoji reaction to a message.

#### Request Body

```json
{
  "messageId": "msg-123",
  "userId": "user-2",
  "emoji": "👍"
}
```

#### Response

```json
{
  "success": true,
  "action": "added",
  "data": {
    "id": "reaction-1",
    "messageId": "msg-123",
    "userId": "user-2",
    "emoji": "👍",
    "createdAt": "2025-09-12T20:06:31.925Z",
    "user": {
      "id": "user-2",
      "name": "Jane Smith"
    }
  }
}
```

### 5.2 Get Reactions

**GET** `/reactions`

Get all reactions for a message.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messageId` | string | Yes | Message ID |

---

## 6. Session Invitations

### 6.1 Get Invitations

**GET** `/invitations`

Get all invitations for a session.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID |

### 6.2 Send Invitation

**POST** `/invitations`

Send an invitation to join a session.

#### Request Body

```json
{
  "sessionId": "session-ai-governance-committee-review",
  "email": "external.expert@consulting.com",
  "role": "reviewer",
  "invitedBy": "user-1"
}
```

### 6.3 Cancel Invitation

**DELETE** `/invitations/{invitationId}`

Cancel a pending invitation.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cancelledBy` | string | Yes | ID of user cancelling invitation |

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message description",
  "details": "Additional error details"
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request - Missing or invalid parameters
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **409**: Conflict - Resource already exists
- **500**: Internal Server Error

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Messages**: 60 requests per minute per user
- **Sessions**: 10 requests per minute per user
- **Participants**: 30 requests per minute per user

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

---

## WebSocket Events (Future Enhancement)

Real-time updates via WebSocket connections:

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://api.complianceiq.com/collaboration/ws');

// Listen for events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'message.created':
      // New message received
      break;
    case 'participant.joined':
      // New participant joined
      break;
    case 'reaction.added':
      // New reaction added
      break;
  }
};
```
