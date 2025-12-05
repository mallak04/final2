# Backend Setup Guide

## Complete Setup Instructions

### Step 1: Install PostgreSQL

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is `5432`

### Step 2: Create the Database

Open Command Prompt or PowerShell and run:

```bash
# Login to PostgreSQL (will ask for password)
psql -U postgres

# Once logged in, create the database
CREATE DATABASE code_analysis_db;

# Verify it was created
\l

# Exit
\q
```

### Step 3: Install Python Dependencies

```bash
# Navigate to backend folder
cd C:\Users\U\Desktop\project 1\final2\backend

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Create a file named `.env` in the `backend` folder with this content:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/code_analysis_db
SECRET_KEY=my-secret-key-123
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Important:** Replace `YOUR_PASSWORD_HERE` with the password you set during PostgreSQL installation.

### Step 5: Run the Backend Server

```bash
# From the backend folder
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 6: Test the API

Open your browser and go to:
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

You should see the interactive API documentation (Swagger UI).

### Step 7: Test with Frontend

The frontend is already configured to connect to the backend at `http://localhost:8000`.

To use the API in your frontend:

```typescript
import { fetchProgressData, saveCodeAnalysis } from '../services/apiService';

// Example: Fetch progress data
const userId = "user123";
const progressData = await fetchProgressData(userId);
console.log(progressData);

// Example: Save analysis
await saveCodeAnalysis({
  user_id: "user123",
  code_content: "function test() { ... }",
  language: "JavaScript",
  total_errors: 5,
  bracket_errors: 2,
  comma_errors: 1,
  indentation_errors: 0,
  case_spelling_errors: 1,
  colon_errors: 1,
  reversed_word_errors: 0,
  recommendations: "Use semicolons consistently"
});
```

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify password in `.env` file
- Make sure database exists: `psql -U postgres -c "\l"`

### Port Already in Use
- Change port: `uvicorn app.main:app --reload --port 8001`
- Update frontend API URL accordingly

### CORS Errors
- Make sure frontend URL is in `ALLOWED_ORIGINS` in `.env`
- Restart the backend after changing `.env`

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database connection setup
│   ├── models/
│   │   ├── __init__.py
│   │   └── code_analysis.py # Database models (SQLAlchemy)
│   ├── routes/
│   │   ├── __init__.py
│   │   └── analysis.py      # API endpoints
│   └── schemas/
│       ├── __init__.py
│       └── code_analysis.py # Request/Response schemas (Pydantic)
├── .env                     # Environment variables (create this)
├── .env.example             # Example environment file
├── .gitignore
├── requirements.txt         # Python dependencies
├── README.md
└── SETUP_GUIDE.md          # This file
```

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/` | Create new analysis |
| GET | `/api/analysis/progress/{user_id}` | Get monthly progress |
| GET | `/api/analysis/breakdown/{user_id}` | Get error breakdown |
| GET | `/api/analysis/history/{user_id}` | Get analysis history |
| GET | `/api/analysis/{analysis_id}` | Get specific analysis |
| GET | `/health` | Health check |
| GET | `/docs` | API documentation |

## Next Steps

1. Run the backend server
2. Test endpoints in the API docs (http://localhost:8000/docs)
3. Update your frontend to use the API instead of mock data
4. Start analyzing code and watch the data save to PostgreSQL!
