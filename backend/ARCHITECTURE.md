# Backend Architecture Documentation

## Overview
A FastAPI-based backend for a code learning platform that analyzes student code using an AI model. The AI identifies ANY type of error (not restricted to predefined categories), provides corrected code, and tracks error trends over time.

## Core Concept

### AI Model Behavior
Your AI team's model:
- **Input**: Natural language prompt with code (e.g., "Explain the error in this code snippet: [code]")
- **Output**: Structured markdown with dynamic error types, corrected code, and explanations

**Example AI Response**:
```markdown
## Errors
**Indentation Error**: The for loop body should be indented.
**Missing Colon**: The if statement on line 3 is missing a colon.
**Undefined Variable**: Variable 'count' is used before declaration on line 5.

## Corrected Code
​```python
for i in range(10):
    if i > 5:
        count = 0
        print(i)
​```

## Explanation
**Indentation**: The print(i) should be indented under the for loop.
**Missing Colon**: Python requires a colon after if conditions.
**Undefined Variable**: Variables must be declared before use. Added count = 0.
```

### Key Difference from Traditional Systems
- ❌ NOT restricted to: brackets, commas, indentation, etc.
- ✅ AI can identify ANY error type: logic errors, undefined variables, wrong algorithm, poor naming, etc.
- ✅ Errors are stored dynamically
- ✅ Progress page shows TOP K most frequent error types for each user

## System Architecture

```
Frontend                Backend                    AI Model
   │                       │                          │
   │  POST /api/analyze    │                          │
   ├──────────────────────>│ Prepare prompt           │
   │                       ├─────────────────────────>│
   │                       │  "Explain error in..."   │
   │                       │                          │
   │                       │<─────────────────────────┤
   │                       │  Markdown response       │
   │                       │                          │
   │                       │ Parse Response:          │
   │                       │ - Extract errors         │
   │                       │ - Extract corrected code │
   │                       │ - Extract explanations   │
   │                       │                          │
   │                       │ Save to Database:        │
   │                       │ - User ID                │
   │                       │ - Original code          │
   │                       │ - AI raw response        │
   │                       │ - Parsed errors (JSON)   │
   │                       │ - Corrected code         │
   │                       │                          │
   │<──────────────────────┤ Return formatted         │
   │  { correctedCode,     │  response                │
   │    errors[...],       │                          │
   │    recommendations }  │                          │
```

## Database Models

### User Model
```python
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=uuid4)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    # Relationship
    analyses = relationship("CodeAnalysis", back_populates="user")
```

### CodeAnalysis Model (Updated)
```python
class CodeAnalysis(Base):
    __tablename__ = "code_analyses"

    id = Column(String, primary_key=True, default=uuid4)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)

    # Input data
    code_content = Column(Text, nullable=False)
    language = Column(String(50), nullable=False)

    # AI response (raw)
    ai_raw_response = Column(Text, nullable=True)

    # Parsed data
    corrected_code = Column(Text, nullable=True)
    errors = Column(JSON, nullable=True)  # Dynamic list of errors
    # Format: [
    #   {"type": "Indentation Error", "message": "...", "line": 1},
    #   {"type": "Undefined Variable", "message": "...", "line": 5},
    #   ...
    # ]

    explanations = Column(JSON, nullable=True)  # List of explanations
    recommendations = Column(Text, nullable=True)

    # Metadata
    total_errors = Column(Integer, default=0)  # Count of errors
    processing_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship
    user = relationship("User", back_populates="analyses")
```

### Error Tracking (Aggregated View)
For analytics, we'll compute error frequency dynamically via queries:

```sql
-- Top K error types for a user
SELECT
    json_array_elements(errors)->>'type' as error_type,
    COUNT(*) as frequency
FROM code_analyses
WHERE user_id = 'user-uuid'
GROUP BY error_type
ORDER BY frequency DESC
LIMIT 10;  -- TOP K
```

## API Endpoints

### Authentication
```
POST   /api/auth/register
  Body: { username, email, password, full_name? }
  Response: { id, username, email, created_at }

POST   /api/auth/login
  Body: { username, password }
  Response: { access_token, token_type, user: {...} }

GET    /api/auth/me
  Headers: Authorization: Bearer <token>
  Response: { id, username, email, full_name }
```

### Code Analysis
```
POST   /api/analyze
  Headers: Authorization: Bearer <token>
  Body: { code: string, language: string }
  Response: {
    id: string,                     # Analysis ID
    correctedCode: string,
    corrections: string[],          # Snippets for underlining
    errors: [
      {
        category: string,           # Error type from AI
        count: number,              # Count within this analysis
        description: string,
        icon: string,
        details: [
          {
            line: number,
            message: string,
            codeSnippet: string,
            correction: string,
            explanation: string
          }
        ]
      }
    ],
    recommendations: string[]
  }
```

### Analytics & Progress
```
GET    /api/analysis/history/{user_id}?limit=10
  Response: [{
    id, date, language, total_errors, code_preview
  }]

GET    /api/analysis/progress/{user_id}
  Response: [
    { date: "2024-01", errors: 15 },
    { date: "2024-02", errors: 10 },
    ...
  ]

GET    /api/analysis/breakdown/{user_id}?top_k=10
  Response: [
    {
      error_type: "Indentation Error",
      count: 25,
      percentage: 35.7
    },
    {
      error_type: "Undefined Variable",
      count: 18,
      percentage: 25.7
    },
    ...
  ]

GET    /api/analysis/user-stats/{user_id}
  Response: {
    total_analyses: number,
    errors_fixed: number,
    day_streak: number,
    most_common_error: string
  }
```

## Key Components

### 1. AI Service (Mock for Now)

```python
# app/services/ai_service.py

class AIService:
    async def analyze_code(self, code: str, language: str) -> str:
        """
        Calls AI model and returns markdown response.
        Currently mocked for development.
        """
        # TODO: Replace with actual AI API call
        prompt = f"Explain the error in this {language} code snippet:\n\n{code}"

        # MOCK RESPONSE (for now)
        return """
## Errors
**Indentation Error**: Line 2 is not properly indented.
**Undefined Variable**: Variable 'result' used before assignment on line 4.

## Corrected Code
```python
def calculate():
    result = 0
    for i in range(10):
        result += i
    return result
```

## Explanation
**Indentation**: Python requires consistent indentation. Line 2 must align with the function body.
**Undefined Variable**: Always initialize variables before using them.
        """

        # FUTURE: Real implementation
        # response = await http_client.post(
        #     AI_MODEL_ENDPOINT,
        #     json={"prompt": prompt},
        #     headers={"Authorization": f"Bearer {AI_API_KEY}"}
        # )
        # return response.json()["response"]
```

### 2. Parser Service

```python
# app/services/parser_service.py

import re
from typing import List, Dict

class ParserService:
    def parse_ai_response(self, markdown: str) -> Dict:
        """
        Parses AI markdown response into structured data.

        Returns:
        {
            "errors": [
                {"type": "Error Name", "message": "description"},
                ...
            ],
            "corrected_code": "...",
            "explanations": [
                {"error_type": "Error Name", "explanation": "..."},
                ...
            ]
        }
        """
        errors = self._extract_errors(markdown)
        corrected_code = self._extract_code_block(markdown)
        explanations = self._extract_explanations(markdown)

        return {
            "errors": errors,
            "corrected_code": corrected_code,
            "explanations": explanations
        }

    def _extract_errors(self, markdown: str) -> List[Dict]:
        """Extract errors from ## Errors section"""
        errors = []
        errors_section = re.search(r'## Errors\s+(.*?)\s+##', markdown, re.DOTALL)
        if errors_section:
            error_text = errors_section.group(1)
            # Match: **Error Type**: Description
            pattern = r'\*\*([^*]+)\*\*:\s*([^\n]+)'
            matches = re.findall(pattern, error_text)
            for error_type, message in matches:
                errors.append({
                    "type": error_type.strip(),
                    "message": message.strip()
                })
        return errors

    def _extract_code_block(self, markdown: str) -> str:
        """Extract code from ```language ... ``` block"""
        code_match = re.search(r'```[\w]*\n(.*?)```', markdown, re.DOTALL)
        if code_match:
            return code_match.group(1).strip()
        return ""

    def _extract_explanations(self, markdown: str) -> List[Dict]:
        """Extract explanations from ## Explanation section"""
        explanations = []
        expl_section = re.search(r'## Explanation\s+(.*)', markdown, re.DOTALL)
        if expl_section:
            expl_text = expl_section.group(1)
            pattern = r'\*\*([^*]+)\*\*:\s*([^\n]+)'
            matches = re.findall(pattern, expl_text)
            for error_type, explanation in matches:
                explanations.append({
                    "error_type": error_type.strip(),
                    "explanation": explanation.strip()
                })
        return explanations
```

### 3. Analysis Service

```python
# app/services/analysis_service.py

from typing import Dict
from sqlalchemy.orm import Session
from app.models.code_analysis import CodeAnalysis
from app.services.ai_service import AIService
from app.services.parser_service import ParserService

class AnalysisService:
    def __init__(self):
        self.ai_service = AIService()
        self.parser = ParserService()

    async def analyze_and_save(
        self,
        user_id: str,
        code: str,
        language: str,
        db: Session
    ) -> Dict:
        """
        Complete analysis flow:
        1. Call AI model
        2. Parse response
        3. Save to database
        4. Return formatted response for frontend
        """
        # Step 1: Get AI response
        ai_response = await self.ai_service.analyze_code(code, language)

        # Step 2: Parse response
        parsed = self.parser.parse_ai_response(ai_response)

        # Step 3: Save to database
        analysis = CodeAnalysis(
            user_id=user_id,
            code_content=code,
            language=language,
            ai_raw_response=ai_response,
            corrected_code=parsed["corrected_code"],
            errors=parsed["errors"],  # Store as JSON
            explanations=parsed["explanations"],
            total_errors=len(parsed["errors"])
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        # Step 4: Format response for frontend
        return self._format_for_frontend(analysis, parsed)

    def _format_for_frontend(self, analysis: CodeAnalysis, parsed: Dict) -> Dict:
        """
        Transform database model into frontend-expected format
        """
        # Group errors by type (in case same error appears multiple times)
        error_groups = {}
        for error in parsed["errors"]:
            error_type = error["type"]
            if error_type not in error_groups:
                error_groups[error_type] = {
                    "category": error_type,
                    "count": 0,
                    "description": error["message"],
                    "icon": "❌",  # Default icon
                    "details": []
                }
            error_groups[error_type]["count"] += 1
            error_groups[error_type]["details"].append({
                "line": 0,  # TODO: Extract line numbers if AI provides them
                "message": error["message"],
                "codeSnippet": "",  # TODO: Extract relevant code snippet
                "correction": "",    # TODO: Match from explanations
                "explanation": self._find_explanation(error_type, parsed["explanations"])
            })

        return {
            "id": analysis.id,
            "correctedCode": analysis.corrected_code,
            "corrections": self._extract_corrections(analysis.corrected_code, analysis.code_content),
            "errors": list(error_groups.values()),
            "recommendations": self._generate_recommendations(parsed["errors"])
        }

    def _find_explanation(self, error_type: str, explanations: List[Dict]) -> str:
        for expl in explanations:
            if expl["error_type"] == error_type:
                return expl["explanation"]
        return "No detailed explanation available."

    def _extract_corrections(self, corrected: str, original: str) -> List[str]:
        """
        Simple diff to find what changed (for frontend underlining).
        This is a basic implementation - can be improved.
        """
        # TODO: Implement proper diff algorithm
        return []  # Placeholder

    def _generate_recommendations(self, errors: List[Dict]) -> List[str]:
        """Generate learning recommendations based on errors"""
        recommendations = []
        error_types = set(e["type"] for e in errors)

        # Simple rule-based recommendations
        if "Indentation Error" in error_types:
            recommendations.append("Review Python indentation rules - use 4 spaces per level")
        if "Undefined Variable" in error_types:
            recommendations.append("Always declare variables before using them")
        if any("syntax" in e["type"].lower() for e in errors):
            recommendations.append("Review basic syntax rules for this language")

        return recommendations or ["Keep practicing! Your code is improving."]
```

### 4. Analytics Queries

```python
# app/services/analytics_service.py

from sqlalchemy import func, desc
from sqlalchemy.dialects.postgresql import JSONB
from typing import List, Dict

class AnalyticsService:
    def get_top_errors(self, user_id: str, top_k: int, db: Session) -> List[Dict]:
        """
        Get TOP K most frequent error types for a user.
        Uses PostgreSQL JSON functions to query error types.
        """
        # This query extracts error types from JSON and counts them
        query = """
        SELECT
            error->>'type' as error_type,
            COUNT(*) as count
        FROM
            code_analyses,
            json_array_elements(errors::json) as error
        WHERE
            user_id = :user_id
        GROUP BY error_type
        ORDER BY count DESC
        LIMIT :top_k
        """

        result = db.execute(query, {"user_id": user_id, "top_k": top_k})
        rows = result.fetchall()

        total = sum(row[1] for row in rows)
        return [
            {
                "error_type": row[0],
                "count": row[1],
                "percentage": round((row[1] / total) * 100, 1) if total > 0 else 0
            }
            for row in rows
        ]

    def get_monthly_progress(self, user_id: str, db: Session) -> List[Dict]:
        """
        Get error count per month for progress chart.
        """
        result = db.query(
            func.to_char(CodeAnalysis.created_at, 'YYYY-MM').label('month'),
            func.sum(CodeAnalysis.total_errors).label('total')
        ).filter(
            CodeAnalysis.user_id == user_id
        ).group_by('month').order_by('month').all()

        return [
            {"date": row.month, "errors": row.total}
            for row in result
        ]
```

## Frontend Integration

### Analysis Page Flow
1. User clicks "Analyze Code" button
2. Frontend calls `POST /api/analyze` with code and language
3. Backend:
   - Authenticates user via JWT
   - Calls AI model
   - Parses response
   - Saves to database
   - Returns formatted errors
4. Frontend displays:
   - **Corrected Code** section with underlined corrections
   - **Error Analysis** cards - dynamically created based on AI response
   - **Recommendations** section

### Progress Page Flow
1. User visits Progress page
2. Frontend calls `/api/analysis/breakdown/{user_id}?top_k=10`
3. Backend queries database for TOP 10 error types
4. Frontend displays:
   - Chart showing error frequency over time
   - Bar chart of TOP K error types
   - User stats (total analyses, errors fixed, streak)

## Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/code_analysis_db

# JWT
SECRET_KEY=your-secret-key-min-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200  # 30 days

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# AI Model (when available)
AI_MODEL_ENDPOINT=http://ai-service:8001/analyze
AI_MODEL_API_KEY=your-ai-api-key
AI_TIMEOUT_SECONDS=10
```

## AI Team Integration

### What Your AI Team Needs to Do

1. **Expose API Endpoint**:
   ```
   POST /analyze
   Headers: Authorization: Bearer <api-key>
   Body: { "prompt": "Explain the error in this python code:\n\n<code>" }
   ```

2. **Return Markdown Format**:
   ```markdown
   ## Errors
   **[Error Type]**: [Description]
   **[Error Type]**: [Description]

   ## Corrected Code
   ```language
   [corrected code]
   ```

   ## Explanation
   **[Error Type]**: [Detailed explanation]
   ```

3. **Share with Backend Team**:
   - API endpoint URL
   - Authentication method
   - Expected response time
   - Rate limits

### Backend Will Handle
- Parsing markdown
- Extracting structured data
- Storing in database
- Error tracking and analytics
- Formatting for frontend

## Security

1. ✅ JWT authentication for all protected routes
2. ✅ Password hashing with bcrypt
3. ✅ SQL injection prevention (SQLAlchemy ORM)
4. ✅ Input validation (Pydantic schemas)
5. ✅ CORS configured for frontend only
6. ✅ No sensitive data in logs
7. ✅ Environment variables for secrets

## Performance

1. **Database Indexes**:
   - `user_id` for fast user queries
   - `created_at` for timeline queries
   - `username`, `email` for authentication

2. **Async Operations**:
   - AI calls are async (don't block server)
   - Database operations use async SQLAlchemy

3. **JSON Queries**:
   - PostgreSQL JSONB for efficient error queries
   - Indexed JSON fields for analytics

## Testing

```python
# Test AI parsing
def test_parse_ai_response():
    markdown = """
    ## Errors
    **Syntax Error**: Missing parenthesis
    ## Corrected Code
    ```python
    print("hello")
    ```
    """
    parsed = parser.parse_ai_response(markdown)
    assert len(parsed["errors"]) == 1
    assert parsed["errors"][0]["type"] == "Syntax Error"

# Test analysis endpoint
async def test_analyze_endpoint():
    response = client.post(
        "/api/analyze",
        headers={"Authorization": f"Bearer {token}"},
        json={"code": "print 'hello'", "language": "python"}
    )
    assert response.status_code == 200
    assert "correctedCode" in response.json()
```

## Deployment

### Development
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Production
- PostgreSQL database
- HTTPS only
- Gunicorn + Uvicorn workers
- Environment variables from secure vault
- Rate limiting
- Monitoring and logging
- Database backups

## Summary

✅ **Flexible Error System**: AI can return ANY error type, not restricted to predefined categories
✅ **Dynamic Storage**: Errors stored as JSON, no schema limitations
✅ **TOP K Analytics**: Progress page shows most frequent error types
✅ **Easy AI Integration**: Ready for your AI team's model
✅ **Secure Authentication**: JWT-based auth system
✅ **Scalable Architecture**: Clean separation of concerns

This architecture supports your AI model's flexibility while providing robust tracking and analytics!
