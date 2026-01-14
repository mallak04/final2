# Backend Implementation Guide

## Overview

This backend is now fully architected and ready for development! Here's what has been implemented:

## What's Complete

### Core Architecture
- **Authentication System**: JWT-based user registration and login
- **AI Service Layer**: Mock AI implementation (ready to swap with real model)
- **Parser Service**: Extracts structured data from AI markdown responses
- **Analysis Service**: Orchestrates the complete analysis workflow
- **Analytics Service**: Computes user statistics and progress metrics
- **Database Models**: User and CodeAnalysis with dynamic error storage

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

#### AI Analysis (`/api`)
- `POST /api/analyze` - Analyze code with AI (Protected)

#### Analytics (`/api/analysis`)
- `GET /api/analysis/progress/{user_id}` - Monthly progress
- `GET /api/analysis/breakdown/{user_id}` - Error breakdown by month
- `GET /api/analysis/top-errors/{user_id}?top_k=10` - Top K errors
- `GET /api/analysis/history/{user_id}` - Analysis history
- `GET /api/analysis/user-stats/{user_id}` - User statistics
- `GET /api/analysis/{analysis_id}` - Get specific analysis

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Edit .env and set your values
# Important: Change SECRET_KEY in production!
```

### 3. Setup Database

#### Option A: PostgreSQL (Recommended)
```bash
# Install PostgreSQL
# Create database
createdb code_analysis_db

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/code_analysis_db

# Run migrations
alembic upgrade head
```

#### Option B: SQLite (Quick Testing)
```python
# In app/database.py, change:
DATABASE_URL = "sqlite:///./code_analysis.db"

# Then run:
alembic upgrade head
```

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --port 8000

# Server will start at http://localhost:8000
```

### 5. Test the API

Visit http://localhost:8000/docs for interactive API documentation (Swagger UI)

## Testing the Flow

### 1. Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "full_name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'
```

Copy the `access_token` from the response.

### 3. Analyze Code
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "code": "for i in range(10)\n  print i",
    "language": "python"
  }'
```

### 4. Get User Stats
```bash
curl http://localhost:8000/api/analysis/user-stats/USER_ID_HERE
```

## Integration with AI Team

### Current State
The AI service (`app/services/ai_service.py`) currently returns **mock responses** for development.

### When AI Team is Ready

1. **Update AI Service Configuration**

Edit `.env`:
```env
AI_MODEL_ENDPOINT=http://your-ai-service:8001/analyze
AI_MODEL_API_KEY=your-api-key-here
```

2. **Update AI Service Code**

In `app/services/ai_service.py`, the `__init__` method will automatically use the real API if `AI_MODEL_ENDPOINT` is set:

```python
# No code changes needed!
# The service automatically switches from mock to real API
# when environment variables are set
```

3. **AI Team Should Provide**

Endpoint that accepts:
```json
POST /analyze
{
  "prompt": "Explain the error in this python code:\n\nfor i in range(10)\n  print i"
}
```

And returns markdown:
```markdown
## Errors
**Indentation Error**: ...
**Missing Colon**: ...

## Corrected Code
```python
for i in range(10):
    print(i)
```

## Explanation
**Indentation Error**: ...
**Missing Colon**: ...
```

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app with all routes
│   ├── database.py             # Database configuration
│   │
│   ├── models/                 # Database models
│   │   ├── user.py            # User model
│   │   └── code_analysis.py   # Code analysis model (supports dynamic errors)
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── user.py
│   │   ├── auth.py
│   │   └── code_analysis.py
│   │
│   ├── routes/                 # API route handlers
│   │   ├── auth.py            # Authentication routes
│   │   ├── ai.py              # AI analysis endpoint
│   │   └── analysis.py        # Analytics routes
│   │
│   ├── services/               # Business logic
│   │   ├── ai_service.py      # AI integration (mock/real)
│   │   ├── parser_service.py  # Parse AI markdown
│   │   ├── analysis_service.py # Analysis workflow
│   │   └── analytics_service.py # Statistics & progress
│   │
│   └── utils/                  # Utilities
│       ├── security.py        # JWT & password hashing
│       └── dependencies.py    # Auth dependencies
│
├── alembic/                    # Database migrations
├── requirements.txt
├── .env.example
├── ARCHITECTURE.md             # Detailed architecture docs
└── IMPLEMENTATION_GUIDE.md     # This file
```

## Key Features

### 1. Dynamic Error System
- Errors are NOT restricted to predefined categories
- AI can return ANY error type
- Stored as JSON in database
- Progress page shows TOP K most frequent errors

### 2. Secure Authentication
- JWT tokens with configurable expiration
- Password hashing with bcrypt
- Protected routes require authentication

### 3. Comprehensive Analytics
- Monthly error trends
- TOP K error types
- Day streak calculation
- Total errors fixed tracking

### 4. Easy AI Integration
- Service layer ready to swap mock with real API
- Parser handles markdown extraction
- Error handling for AI failures

## Database Migrations

### Create New Migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Rollback
```bash
alembic downgrade -1
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| SECRET_KEY | JWT secret key (32+ chars) | - |
| ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration | 43200 (30 days) |
| ALLOWED_ORIGINS | CORS origins (comma-separated) | http://localhost:5173 |
| AI_MODEL_ENDPOINT | AI API endpoint (optional) | None (uses mock) |
| AI_MODEL_API_KEY | AI API key (optional) | - |

## Troubleshooting

### Issue: "Could not validate credentials"
- Check if token is included in Authorization header
- Verify token hasn't expired
- Ensure SECRET_KEY matches between token creation and validation

### Issue: Database connection error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Issue: Import errors
- Activate virtual environment
- Run `pip install -r requirements.txt`
- Check Python version (3.8+)

### Issue: CORS errors from frontend
- Add frontend URL to ALLOWED_ORIGINS in .env
- Restart server after changing .env

## API Documentation

Once server is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Next Steps for Your Team

### Backend Developer
1. Run the server locally
2. Test all endpoints using Swagger UI
3. Review the code structure
4. Customize error messages if needed
5. Add logging for production

### AI Team
1. Review `ARCHITECTURE.md` section "AI Team Integration"
2. Implement markdown response format
3. Expose API endpoint
4. Share endpoint URL with backend team
5. Test integration with sample code snippets

### Frontend Developer
1. Update API calls to include JWT tokens
2. Add login/register pages integration
3. Update analysis page to display dynamic errors
4. Update progress page to show TOP K errors
5. Handle authentication errors (401, 403)

## Production Checklist

Before deploying to production:

- [ ] Change SECRET_KEY to a strong random value
- [ ] Set DEBUG=False in production
- [ ] Use PostgreSQL (not SQLite)
- [ ] Enable HTTPS only
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Use environment variables from secure vault
- [ ] Add monitoring (error tracking, performance)
- [ ] Review and limit CORS origins

## Support

For questions or issues:
1. Check ARCHITECTURE.md for detailed design decisions
2. Review Swagger UI documentation
3. Check the code comments
4. Contact the backend team lead

## Summary

The backend architecture is **complete and ready**! You now have:

- Secure authentication system
- AI-powered code analysis (mock for now, easy to swap)
- Dynamic error tracking (not restricted to categories)
- Comprehensive analytics for progress tracking
- Clean, scalable code structure
- Ready for AI team integration

Happy coding!
