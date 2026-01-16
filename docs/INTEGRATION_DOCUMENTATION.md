# System Integration & Communication Documentation - ABCode

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Communication Protocols](#communication-protocols)
4. [Integration Layers](#integration-layers)
5. [Data Flow Scenarios](#data-flow-scenarios)
6. [Authentication Flow](#authentication-flow)
7. [Error Handling Strategy](#error-handling-strategy)
8. [Deployment Architecture](#deployment-architecture)

---

## Overview

ABCode is a **multi-layered distributed system** that integrates VS Code editor functionality with web-based UI, a REST API backend, AI processing, and database persistence. This document describes how these components communicate, integrate, and coordinate to deliver a seamless code analysis experience.

### System Components

| Component | Technology | Role |
|-----------|-----------|------|
| **VS Code Extension** | TypeScript, VS Code API | Code capture and webview hosting |
| **Frontend** | React, TypeScript, Tailwind CSS | User interface and client logic |
| **Backend API** | FastAPI, Python | Business logic and API endpoints |
| **AI Service** | Groq Llama 3.3, LangChain | Code analysis and chatbot |
| **Database** | PostgreSQL | Data persistence |

---

## System Architecture

### Complete System Overview

```mermaid
graph TB
    subgraph "VS Code IDE"
        A[Code Editor]
        B[Extension Host]
        C[Extension - extension.ts]
    end

    subgraph "Webview Panel"
        D[Webview Browser]
        E[VS Code API Bridge]
    end

    subgraph "Frontend Application"
        F[React Components]
        G[Service Layer]
        H[State Management]
    end

    subgraph "Backend Server"
        I[FastAPI Routes]
        J[Service Layer]
        K[Database Models]
    end

    subgraph "External Services"
        L[Groq AI API]
    end

    subgraph "Data Store"
        M[(PostgreSQL DB)]
    end

    A -->|Save Event| B
    B -->|File System Watcher| C
    C -->|Create/Manage| D
    D -->|Load HTML/JS| E
    E -->|Initialize| F
    F -->|API Calls| G
    G -->|HTTP/REST| I
    I -->|Business Logic| J
    J -->|AI Processing| L
    J -->|CRUD Operations| K
    K -->|SQL Queries| M
    M -->|Data Results| K
    K -->|Response| J
    J -->|JSON Response| I
    I -->|HTTP Response| G
    G -->|Update State| H
    H -->|Re-render| F
    F -->|Display| D
    C <-->|Message Passing| E

    style A fill:#4db8a8
    style F fill:#5ec5d4
    style I fill:#66c9a4
    style L fill:#a78bfa
    style M fill:#ffc107
```

### Component Layers

```mermaid
graph LR
    A[Presentation Layer] --> B[Application Layer]
    B --> C[Business Logic Layer]
    C --> D[Data Access Layer]
    C --> E[External Services Layer]
    D --> F[Database]

    style A fill:#4db8a8
    style B fill:#5ec5d4
    style C fill:#66c9a4
    style D fill:#a78bfa
    style E fill:#ffc107
```

---

## Communication Protocols

### 1. Extension ↔ Webview Communication

**Protocol**: Message Passing (VS Code API)

**Direction**: Bidirectional

**Transport**: In-memory message queue

#### Extension → Webview

**Method**:
```typescript
webview.postMessage({
  type: 'updateCode',
  code: string,
  language: string,
  fileName: string
});
```

**Webview Listener**:
```javascript
window.addEventListener('message', (event) => {
  const message = event.data;
  if (message.type === 'updateCode') {
    // Handle code update
  }
});
```

**Use Cases**:
- Send code content to frontend
- Notify webview of configuration changes
- Trigger specific actions in UI

---

#### Webview → Extension

**Method**:
```javascript
const vscodeApi = acquireVsCodeApi();
vscodeApi.postMessage({
  type: 'webviewReady'
});
```

**Extension Listener**:
```typescript
webview.onDidReceiveMessage((message) => {
  if (message.type === 'webviewReady') {
    // Handle ready signal
  }
});
```

**Use Cases**:
- Signal webview initialization complete
- Request additional data from extension
- Report errors back to extension

---

### 2. Frontend ↔ Backend Communication

**Protocol**: HTTP/REST over TCP/IP

**Direction**: Request-Response (Client-Server)

**Transport**: Network (localhost in development, remote in production)

**Format**: JSON

#### Request Structure

```http
POST /api/analyze HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "code": "def hello():\n    print('Hello World')",
  "language": "python"
}
```

#### Response Structure

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "uuid",
  "correctedCode": "...",
  "corrections": [...],
  "errors": [...],
  "recommendations": [...]
}
```

---

### 3. Backend ↔ Database Communication

**Protocol**: SQL over TCP/IP

**ORM**: SQLAlchemy

**Transport**: PostgreSQL wire protocol

**Connection String**:
```
postgresql://username:password@localhost:5433/code_analysis_db
```

#### Query Example

**Python (SQLAlchemy)**:
```python
analysis = db.query(CodeAnalysis).filter(
    CodeAnalysis.user_id == user_id
).order_by(
    CodeAnalysis.created_at.desc()
).limit(10).all()
```

**Generated SQL**:
```sql
SELECT * FROM code_analyses
WHERE user_id = 'uuid'
ORDER BY created_at DESC
LIMIT 10;
```

---

### 4. Backend ↔ AI Service Communication

**Protocol**: HTTP/REST (Groq API)

**Direction**: Request-Response

**Transport**: HTTPS over internet

**Authentication**: API Key in headers

#### Request Structure

```http
POST https://api.groq.com/openai/v1/chat/completions HTTP/1.1
Authorization: Bearer <groq_api_key>
Content-Type: application/json

{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert code reviewer..."
    },
    {
      "role": "user",
      "content": "Analyze this code: ..."
    }
  ],
  "temperature": 0.3,
  "max_tokens": 2048
}
```

#### Response Structure

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "chatcmpl-xyz",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "## Errors\n- Syntax Error: ...\n\n## Corrected Code\n..."
      }
    }
  ]
}
```

---

## Integration Layers

### Layer 1: User Interface Layer

**Components**: VS Code Editor + Webview Frontend

**Responsibilities**:
- Capture user interactions
- Display results and feedback
- Manage UI state
- Handle user input validation

**Integration Points**:
- VS Code File System API
- Webview Message API
- Browser Local Storage

---

### Layer 2: Application Layer

**Components**: Frontend Services + Extension Logic

**Responsibilities**:
- Coordinate between UI and backend
- Manage authentication tokens
- Handle API request/response lifecycle
- Format data for display

**Integration Points**:
- HTTP fetch API
- VS Code Extension API
- React hooks and context

---

### Layer 3: Business Logic Layer

**Components**: Backend Services (Analysis, Chatbot, Analytics)

**Responsibilities**:
- Implement core business rules
- Orchestrate workflows
- Process and transform data
- Validate business constraints

**Integration Points**:
- FastAPI route handlers
- Service layer functions
- External AI API calls

---

### Layer 4: Data Access Layer

**Components**: SQLAlchemy Models + Database

**Responsibilities**:
- CRUD operations
- Data persistence
- Query optimization
- Transaction management

**Integration Points**:
- PostgreSQL database
- SQLAlchemy ORM
- Database connection pool

---

### Layer 5: External Services Layer

**Components**: Groq AI API

**Responsibilities**:
- AI model inference
- Natural language processing
- Code analysis generation
- Chatbot response generation

**Integration Points**:
- Groq Cloud API
- LangChain framework
- HTTP client libraries

---

## Data Flow Scenarios

### Scenario 1: Code Analysis End-to-End

```mermaid
sequenceDiagram
    participant User
    participant Editor as VS Code Editor
    participant Ext as Extension
    participant WV as Webview
    participant FE as Frontend
    participant BE as Backend
    participant AI as Groq AI
    participant DB as Database

    User->>Editor: Saves Python file
    Editor->>Ext: onDidSaveTextDocument event
    Ext->>Ext: Extract code, language, filename
    Ext->>WV: postMessage('updateCode')
    WV->>FE: Dispatch event to React
    FE->>FE: Update codeData state
    FE->>FE: Trigger useEffect hook

    FE->>BE: POST /api/analyze + JWT token
    BE->>BE: Validate JWT token
    BE->>BE: Extract user ID from token

    BE->>AI: Send code to Groq API
    AI->>AI: Process with Llama 3.3
    AI-->>BE: Return analysis markdown

    BE->>BE: Parse markdown response
    BE->>BE: Extract errors, corrections, recommendations

    BE->>DB: INSERT CodeAnalysis record
    DB-->>BE: Return analysis ID

    BE->>BE: Format response for frontend
    BE-->>FE: Return JSON response

    FE->>FE: Update analysisResult state
    FE->>WV: Re-render components
    WV->>User: Display results

    style AI fill:#a78bfa
    style DB fill:#ffc107
```

**Timeline**:
1. **T=0ms**: User saves file
2. **T=50ms**: Extension receives event and extracts code
3. **T=100ms**: Webview receives code via message
4. **T=150ms**: Frontend updates state and triggers API call
5. **T=200ms**: Backend receives request and validates token
6. **T=300ms**: Backend sends request to Groq API
7. **T=3000-5000ms**: AI processes code (3-5 seconds)
8. **T=5100ms**: Backend receives AI response
9. **T=5200ms**: Backend parses and stores in database
10. **T=5300ms**: Frontend receives response
11. **T=5350ms**: UI updates with results

**Total Time**: ~5-7 seconds from save to display

---

### Scenario 2: Chatbot Conversation

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant BE as Backend
    participant AI as Groq AI
    participant DB as Database

    User->>FE: Opens Chatbot page

    FE->>BE: GET /api/chat/history + JWT
    BE->>BE: Validate token
    BE->>DB: SELECT conversations WHERE user_id
    DB-->>BE: Return message history
    BE-->>FE: Return conversation array
    FE->>FE: Display past messages

    User->>FE: Types question and submits
    FE->>FE: Add user message to UI
    FE->>FE: Show "AI typing..." indicator

    FE->>BE: POST /api/chat/message + JWT
    BE->>BE: Validate token
    BE->>DB: Load last 10 messages
    DB-->>BE: Return conversation context
    BE->>BE: Build message array

    BE->>AI: Send messages to Groq API
    AI->>AI: Process with Llama 3.3
    AI-->>BE: Return response text

    BE->>DB: INSERT user message
    BE->>DB: INSERT assistant message
    DB-->>BE: Confirm saved

    BE-->>FE: Return response
    FE->>FE: Add AI message to UI
    FE->>FE: Hide typing indicator
    FE->>FE: Auto-scroll to bottom
    FE->>User: Display response

    style AI fill:#a78bfa
    style DB fill:#ffc107
```

---

### Scenario 3: User Registration & Login

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    User->>FE: Fills registration form
    FE->>FE: Validate email format
    FE->>FE: Check all required fields

    FE->>BE: POST /api/auth/register
    BE->>BE: Validate request schema
    BE->>DB: Check username exists
    DB-->>BE: Not found (unique)
    BE->>DB: Check email exists
    DB-->>BE: Not found (unique)

    BE->>BE: Hash password with bcrypt
    BE->>DB: INSERT new user record
    DB-->>BE: Return user ID

    BE-->>FE: Return user data (201 Created)

    FE->>BE: POST /api/auth/login (username, password)
    BE->>DB: SELECT user WHERE username
    DB-->>BE: Return user record
    BE->>BE: Verify password hash
    BE->>BE: Generate JWT token
    BE-->>FE: Return token + user data

    FE->>FE: Store token in localStorage
    FE->>FE: Store user data in localStorage
    FE->>FE: Update isAuthenticated state
    FE->>User: Redirect to dashboard

    style DB fill:#ffc107
```

---

### Scenario 4: Progress Tracking

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    User->>FE: Opens Progress page

    par Fetch progress data
        FE->>BE: GET /api/analysis/progress
        BE->>DB: Query error trends over time
        DB-->>BE: Return time-series data
        BE-->>FE: Return progress array
    and Fetch monthly breakdown
        FE->>BE: GET /api/analysis/breakdown
        BE->>DB: Query error categories for month
        DB-->>BE: Return category counts
        BE-->>FE: Return breakdown array
    and Fetch analysis history
        FE->>BE: GET /api/analysis/history?limit=10
        BE->>DB: Query recent analyses
        DB-->>BE: Return analysis records
        BE-->>FE: Return history array
    end

    FE->>FE: Update state with all data
    FE->>FE: Render charts
    FE->>FE: Display statistics
    FE->>User: Show progress dashboard

    style DB fill:#ffc107
```

**Optimization**: Parallel API calls reduce total loading time from ~300ms to ~100ms

---

## Authentication Flow

### Token-Based Authentication

```mermaid
flowchart TD
    A[User Login] --> B[Send Credentials to Backend]
    B --> C{Valid Credentials?}
    C -->|No| D[Return 401 Error]
    C -->|Yes| E[Generate JWT Token]
    E --> F[Return Token + User Data]
    F --> G[Frontend Stores Token in localStorage]

    G --> H[User Makes API Request]
    H --> I[Attach Token to Authorization Header]
    I --> J[Backend Receives Request]
    J --> K[Extract Token from Header]
    K --> L{Valid Token?}
    L -->|No| M[Return 401 Unauthorized]
    L -->|Yes| N[Decode Token]
    N --> O[Extract User ID from Payload]
    O --> P[Query Database for User]
    P --> Q{User Found & Active?}
    Q -->|No| M
    Q -->|Yes| R[Inject User into Route Handler]
    R --> S[Process Request]
    S --> T[Return Response]

    style E fill:#66c9a4
    style G fill:#5ec5d4
    style R fill:#4db8a8
```

### JWT Token Structure

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "sub": "user_uuid",
  "exp": 1705330800
}
```

**Signature**:
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

---

## Error Handling Strategy

### Error Propagation Chain

```mermaid
flowchart LR
    A[Error Occurs] --> B{Where?}
    B -->|AI Service| C[AI Error Handler]
    B -->|Database| D[DB Error Handler]
    B -->|Backend Logic| E[Service Error Handler]

    C --> F[Log Error]
    D --> F
    E --> F

    F --> G[Transform to HTTP Error]
    G --> H[Return Error Response]
    H --> I[Frontend Error Handler]
    I --> J[Display User-Friendly Message]
    J --> K[Log to Console for Debugging]

    style F fill:#ff6b6b
    style G fill:#ffc107
    style J fill:#4ecdc4
```

### Error Types & Handling

#### 1. **Network Errors**

**Cause**: Connection failure, timeout, DNS resolution

**Frontend Handling**:
```typescript
try {
  const response = await fetch(url);
} catch (error) {
  if (error instanceof TypeError) {
    showError("Network error: Please check your connection");
  }
}
```

**User Feedback**: "Unable to connect to server. Please check your internet connection."

---

#### 2. **Authentication Errors**

**HTTP Status**: 401 Unauthorized

**Backend Response**:
```json
{
  "detail": "Invalid or expired token"
}
```

**Frontend Handling**:
```typescript
if (response.status === 401) {
  clearAuth();
  redirectToLogin();
}
```

**User Feedback**: "Session expired. Please log in again."

---

#### 3. **Validation Errors**

**HTTP Status**: 422 Unprocessable Entity

**Backend Response**:
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

**Frontend Handling**:
```typescript
const errorMessage = error.detail[0].msg;
showFieldError('email', errorMessage);
```

**User Feedback**: "Invalid email address format"

---

#### 4. **AI Service Errors**

**Cause**: API rate limit, model unavailable, timeout

**Backend Handling**:
```python
try:
    response = await groq_service.analyze(code)
except Exception as e:
    logger.error(f"AI service error: {e}")
    raise HTTPException(
        status_code=503,
        detail="AI service temporarily unavailable"
    )
```

**Fallback**: Return mock analysis or cached result

**User Feedback**: "AI service is currently busy. Please try again in a moment."

---

#### 5. **Database Errors**

**Cause**: Connection lost, constraint violation, query timeout

**Backend Handling**:
```python
try:
    db.commit()
except IntegrityError:
    db.rollback()
    raise HTTPException(
        status_code=400,
        detail="Duplicate entry"
    )
```

**User Feedback**: "This username is already taken. Please choose another."

---

## Deployment Architecture

### Development Environment

```mermaid
graph TB
    subgraph "Developer Machine"
        A[VS Code IDE]
        B[Extension Dev Host]
        C[Vite Dev Server :5173]
        D[FastAPI Server :8000]
        E[PostgreSQL :5433]
    end

    A --> B
    B --> C
    C --> D
    D --> E

    style A fill:#4db8a8
    style C fill:#5ec5d4
    style D fill:#66c9a4
    style E fill:#ffc107
```

**Characteristics**:
- All components run on localhost
- Hot reload enabled for frontend
- Auto-restart for backend
- Local database instance
- Development-friendly logging

---

### Production Environment (Proposed)

```mermaid
graph TB
    subgraph "VS Code Marketplace"
        A[Extension Package .vsix]
    end

    subgraph "User's Machine"
        B[VS Code with Extension]
        C[Webview with Built Frontend]
    end

    subgraph "Cloud Server"
        D[Load Balancer]
        E[FastAPI Instance 1]
        F[FastAPI Instance 2]
        G[FastAPI Instance N]
    end

    subgraph "Managed Database"
        H[(PostgreSQL RDS)]
    end

    subgraph "External AI"
        I[Groq Cloud API]
    end

    A --> B
    B --> C
    C -->|HTTPS| D
    D --> E
    D --> F
    D --> G
    E --> H
    F --> H
    G --> H
    E --> I
    F --> I
    G --> I

    style A fill:#4db8a8
    style D fill:#5ec5d4
    style H fill:#ffc107
    style I fill:#a78bfa
```

**Characteristics**:
- Extension distributed via VS Code Marketplace
- Frontend bundled with extension
- Backend hosted on cloud (AWS, Azure, GCP)
- Database managed service (RDS, Cloud SQL)
- HTTPS for all API communication
- Horizontal scaling for backend
- CDN for static assets (if needed)

---

### Deployment Checklist

#### Frontend
- [x] Build React app (`npm run build`)
- [x] Output to `media/dist/`
- [x] Minify and optimize assets
- [x] Generate source maps (optional)

#### Extension
- [x] Compile TypeScript (`npm run compile`)
- [x] Bundle with Webpack
- [x] Package as VSIX (`vsce package`)
- [x] Test in fresh VS Code instance

#### Backend
- [ ] Set environment to production
- [ ] Use strong SECRET_KEY
- [ ] Configure CORS for production domain
- [ ] Set up database migrations (Alembic)
- [ ] Enable HTTPS
- [ ] Configure logging and monitoring
- [ ] Set up health check endpoints
- [ ] Deploy to cloud server (Docker, Kubernetes)

#### Database
- [ ] Provision managed PostgreSQL instance
- [ ] Run schema migrations
- [ ] Set up backups
- [ ] Configure connection pooling
- [ ] Enable SSL connections
- [ ] Create read replicas (if needed)

---

## Performance Optimization

### Caching Strategies

**1. Frontend Caching**:
- Browser cache for static assets (logo, CSS)
- LocalStorage for user data and tokens
- React component memoization with React.memo()

**2. Backend Caching**:
- Redis cache for frequently accessed data
- In-memory cache for AI responses (short TTL)
- Query result caching for analytics

**3. Database Optimization**:
- Indexes on frequently queried columns
- Connection pooling
- Read replicas for analytics queries

---

### Latency Reduction

**Techniques**:
- Parallel API calls in frontend
- Async processing in backend
- CDN for static assets
- Database query optimization
- Compression (gzip) for API responses

**Target Metrics**:
- API response time: < 200ms (excluding AI processing)
- Frontend initial load: < 2s
- Code analysis: < 5s (including AI)
- Chatbot response: < 3s

---

## Monitoring & Observability

### Logging

**Extension Logs**:
- VS Code Output panel
- Console logs for debugging

**Backend Logs**:
- Structured JSON logs
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Centralized logging (ELK stack, CloudWatch)

**Frontend Logs**:
- Browser console (development)
- Error tracking service (Sentry)

---

### Metrics

**Application Metrics**:
- Request count per endpoint
- Response time percentiles (P50, P95, P99)
- Error rate
- Active users
- API call volume

**Infrastructure Metrics**:
- CPU usage
- Memory consumption
- Database connections
- Network I/O

---

## Conclusion

The ABCode system demonstrates a well-architected integration of multiple technologies and communication protocols. The clear separation of concerns, robust error handling, and thoughtful design of communication patterns ensure a reliable, scalable, and maintainable system that delivers intelligent code analysis capabilities seamlessly within the VS Code environment.
