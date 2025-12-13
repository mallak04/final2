# Code Analysis Backend API

FastAPI backend for code analysis and progress tracking with PostgreSQL database.

## Setup Instructions

### 1. Install PostgreSQL

Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)

### 2. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE code_analysis_db;

# Exit
\q
```

### 3. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/code_analysis_db
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Replace `your_password` with your PostgreSQL password.

### 5. Run the Server

```bash
# From the backend folder
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Create Analysis
`POST /api/analysis/`
- Save a new code analysis

### Get Progress Data
`GET /api/analysis/progress/{user_id}`
- Get monthly progress data for a user

### Get Monthly Breakdown
`GET /api/analysis/breakdown/{user_id}`
- Get error category breakdown by month

### Get History
`GET /api/analysis/history/{user_id}?limit=10`
- Get recent analysis history

### Get Single Analysis
`GET /api/analysis/{analysis_id}`
- Get details of a specific analysis

## Database Schema

The `code_analyses` table stores:
- `id` - Unique identifier
- `user_id` - User identifier
- `code_content` - The analyzed code
- `language` - Programming language
- `created_at` - Timestamp
- `total_errors` - Total error count
- `bracket_errors` - Bracket errors count
- `comma_errors` - Comma errors count
- `indentation_errors` - Indentation errors count
- `case_spelling_errors` - Case/spelling errors count
- `colon_errors` - Colon errors count
- `other_errors` - Other errors count
- `recommendations` - JSON string of recommendations

## Frontend Integration

Update your frontend to call these endpoints:

```typescript
const API_BASE_URL = 'http://localhost:8000';

// Example: Fetch progress data
const response = await fetch(`${API_BASE_URL}/api/analysis/progress/${userId}`);
const progressData = await response.json();
```
