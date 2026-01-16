# ABCode Setup & Installation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Database Setup](#database-setup)
5. [Backend Configuration](#backend-configuration)
6. [Frontend Setup](#frontend-setup)
7. [Extension Setup](#extension-setup)
8. [Running the Application](#running-the-application)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

| Software | Minimum Version | Download Link | Purpose |
|----------|----------------|---------------|---------|
| **Node.js** | 18.x or higher | https://nodejs.org/ | Frontend and extension development |
| **npm** | 9.x or higher | Included with Node.js | Package manager |
| **Python** | 3.9 or higher | https://www.python.org/ | Backend development |
| **pip** | 21.x or higher | Included with Python | Python package manager |
| **PostgreSQL** | 13.x or higher | https://www.postgresql.org/ | Database |
| **VS Code** | 1.105.0 or higher | https://code.visualstudio.com/ | Extension host |
| **Git** | 2.x or higher | https://git-scm.com/ | Version control |

### Optional Software

| Software | Purpose |
|----------|---------|
| **pgAdmin** | PostgreSQL GUI management tool |
| **Postman** | API testing |
| **Python Virtual Environment** | Isolate Python dependencies |

### Verify Installations

Run the following commands to verify installations:

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check npm version
npm --version
# Expected: 9.0.0 or higher

# Check Python version
python --version
# Expected: Python 3.9.0 or higher

# Check pip version
pip --version
# Expected: pip 21.0 or higher

# Check PostgreSQL version
psql --version
# Expected: psql (PostgreSQL) 13.0 or higher

# Check Git version
git --version
# Expected: git version 2.0.0 or higher
```

---

## Project Overview

The ABCode project consists of three main components:

```
final2/
├── backend/           # FastAPI server
├── media/            # React frontend
└── src/              # VS Code extension
```

### Component Dependencies

```mermaid
graph TD
    A[VS Code Extension] --> B[Frontend React App]
    B --> C[Backend FastAPI]
    C --> D[PostgreSQL Database]
    C --> E[Groq AI API]

    style A fill:#4db8a8
    style B fill:#5ec5d4
    style C fill:#66c9a4
    style D fill:#ffc107
    style E fill:#a78bfa
```

---

## Step-by-Step Installation

### Step 1: Clone the Repository

```bash
# Clone the project from GitHub
git clone https://github.com/yourusername/abcode-extension.git

# Navigate to project directory
cd abcode-extension

# Check project structure
ls -la
```

**Expected Output**:
```
backend/
media/
src/
dist/
package.json
tsconfig.json
webpack.config.js
README.md
```

---

### Step 2: Install Global Dependencies (Optional but Recommended)

```bash
# Install TypeScript globally
npm install -g typescript

# Install ts-node globally (for running TypeScript directly)
npm install -g ts-node

# Install VS Code Extension CLI
npm install -g @vscode/vsce
```

---

## Database Setup

### Step 1: Start PostgreSQL Service

#### On Windows:
```bash
# Open Services app (Win + R, type "services.msc")
# Find "PostgreSQL" service and start it

# Or use command line (as Administrator)
net start postgresql-x64-[version]
```

#### On macOS:
```bash
# Using Homebrew
brew services start postgresql@13

# Or manually
pg_ctl -D /usr/local/var/postgres start
```

#### On Linux:
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Auto-start on boot
```

---

### Step 2: Create Database

**Option A: Using psql Command Line**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE code_analysis_db;

# Verify database creation
\l

# Exit psql
\q
```

**Option B: Using pgAdmin**

1. Open pgAdmin
2. Right-click "Databases"
3. Select "Create" → "Database"
4. Enter name: `code_analysis_db`
5. Click "Save"

---

### Step 3: Run Database Schema

**Option 1: Automatic (SQLAlchemy will create tables)**

The backend automatically creates tables when you first run it. Skip to backend setup.

**Option 2: Manual (Using provided schema.sql)**

```bash
# Navigate to backend directory
cd backend

# Run schema file (if provided)
psql -U postgres -d code_analysis_db -f schema.sql
```

---

### Step 4: Verify Database Setup

```bash
# Connect to database
psql -U postgres -d code_analysis_db

# List tables
\dt

# Expected output: users, code_analyses, conversations

# Check table structure
\d users
\d code_analyses
\d conversations

# Exit
\q
```

---

## Backend Configuration

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

---

### Step 2: Create Python Virtual Environment (Recommended)

**On Windows:**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

**On macOS/Linux:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# You should see (venv) in your terminal prompt
```

---

### Step 3: Install Python Dependencies

```bash
# Ensure you're in backend directory with venv activated
pip install -r requirements.txt

# This installs:
# - FastAPI, Uvicorn (web framework)
# - SQLAlchemy, psycopg2 (database)
# - python-jose, passlib (authentication)
# - LangChain, langchain-groq (AI integration)
# - And more...
```

**Expected Output**:
```
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 ...
```

**Verify Installation**:
```bash
pip list

# Should show all packages from requirements.txt
```

---

### Step 4: Configure Environment Variables

**Create `.env` file** in the `backend/` directory:

```bash
# Create .env file
touch .env

# Or on Windows
type nul > .env
```

**Edit `.env` file** with the following content:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5433/code_analysis_db

# JWT Authentication
SECRET_KEY=your-secret-key-here-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here
USE_GROQ_AI=true
```

---

### Step 5: Configure Database Connection

**Update `DATABASE_URL` in `.env`:**

```env
DATABASE_URL=postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

**Example configurations:**

**Default PostgreSQL (Port 5432):**
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/code_analysis_db
```

**Custom Port (e.g., 5433):**
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5433/code_analysis_db
```

**Tips:**
- Replace `your_password` with your PostgreSQL password
- Default username is usually `postgres`
- Default port is `5432` (adjust if different)
- Hostname is `localhost` for local development

---

### Step 6: Generate Secret Key

**Generate a secure random key for JWT authentication:**

**Using Python:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Expected Output (example):**
```
a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890
```

**Copy this key and paste it in `.env` as `SECRET_KEY`**

---

### Step 7: Obtain Groq API Key

**Get your free Groq API key:**

1. Visit https://console.groq.com/
2. Create an account (free)
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the generated key (starts with `gsk_`)
6. Paste it in `.env` as `GROQ_API_KEY`

**Example:**
```env
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

**Free Tier Limits:**
- 30 requests per minute
- ~14,400 requests per day
- Sufficient for development and testing

---

### Step 8: Verify Backend Configuration

**Check `.env` file has all required values:**

```bash
# Display .env content (Unix/macOS/Linux)
cat .env

# Or on Windows
type .env
```

**Checklist:**
- ✅ `DATABASE_URL` matches your PostgreSQL setup
- ✅ `SECRET_KEY` is at least 32 characters
- ✅ `GROQ_API_KEY` is present and starts with `gsk_`
- ✅ `USE_GROQ_AI` is set to `true`

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
# From project root
cd media
```

---

### Step 2: Install Node Dependencies

```bash
# Install all dependencies from package.json
npm install

# This installs:
# - React, React-DOM
# - Vite (build tool)
# - TypeScript
# - Tailwind CSS
# - Framer Motion (animations)
# - Lucide React (icons)
# - And more...
```

**Expected Output**:
```
added 250 packages, and audited 251 packages in 30s
```

**Verify Installation**:
```bash
# Check node_modules directory exists
ls node_modules

# Verify package installation
npm list --depth=0
```

---

### Step 3: Build Frontend

```bash
# Build production-ready frontend
npm run build

# This creates optimized bundle in dist/ folder
```

**Expected Output**:
```
vite v5.4.21 building for production...
✓ 1873 modules transformed.
dist/index.html                  0.76 kB │ gzip:   0.43 kB
dist/assets/index-H0XLaP1-.css  40.23 kB │ gzip:   6.94 kB
dist/assets/index-QLyjJWIB.js  341.15 kB │ gzip: 101.61 kB
✓ built in 4.49s
```

**Verify Build**:
```bash
# Check dist directory exists
ls dist

# Expected files:
# - index.html
# - assets/
# - logo.svg
# - analysis.svg
```

---

### Step 4: Test Frontend in Development Mode (Optional)

```bash
# Run Vite dev server
npm run dev

# Expected output:
# VITE v5.4.21  ready in 500 ms
# ➜  Local:   http://localhost:5173/
```

**Open browser** to `http://localhost:5173/` to test frontend independently.

**Press `Ctrl + C`** to stop dev server when done testing.

---

## Extension Setup

### Step 1: Navigate to Extension Root

```bash
# From project root (where package.json for extension exists)
cd ..
# You should be in final2/ directory
```

---

### Step 2: Install Extension Dependencies

```bash
# Install TypeScript, Webpack, VS Code types, etc.
npm install
```

**Expected Output**:
```
added 150 packages, and audited 151 packages in 20s
```

---

### Step 3: Compile Extension

```bash
# Compile TypeScript to JavaScript
npm run compile

# This runs: webpack
```

**Expected Output**:
```
asset extension.js 9.65 KiB [emitted] (name: main)
./src/extension.ts 7.79 KiB [built]
webpack 5.102.1 compiled successfully in 1490 ms
```

**Verify Compilation**:
```bash
# Check dist directory
ls dist

# Expected: extension.js
```

---

### Step 4: Verify Extension Configuration

**Check `package.json` has correct configuration:**

```json
{
  "name": "abcode-extension",
  "main": "./dist/extension.js",
  "activationEvents": ["onStartupFinished"],
  "contributes": {
    "commands": [
      {
        "command": "abcode.openDashboard",
        "title": "Run Python and Open Dashboard"
      }
    ]
  }
}
```

---

## Running the Application

### Complete Startup Sequence

Follow these steps **in order** to run the complete application:

---

### Step 1: Start PostgreSQL Database

**Ensure PostgreSQL is running:**

```bash
# Windows
net start postgresql-x64-[version]

# macOS
brew services start postgresql@13

# Linux
sudo systemctl start postgresql
```

**Verify:**
```bash
psql -U postgres -c "SELECT version();"
```

---

### Step 2: Start Backend Server

**Open a new terminal and navigate to backend:**

```bash
cd backend

# Activate virtual environment (if using)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify Backend:**
- Open browser to http://localhost:8000/docs
- You should see FastAPI interactive documentation (Swagger UI)

**Keep this terminal running!**

---

### Step 3: Open VS Code with Extension

**Option A: Run Extension in Development Host**

1. Open VS Code
2. Open the project folder: `File > Open Folder` → Select `final2/`
3. Press `F5` (or `Run > Start Debugging`)
4. A new VS Code window opens (Extension Development Host)
5. The extension is now active in this window

**Option B: Install Extension Locally (Packaged)**

```bash
# Package extension as .vsix
npm run package
vsce package

# Install the .vsix file
code --install-extension abcode-extension-0.0.1.vsix
```

---

### Step 4: Test the Extension

**In the Extension Development Host window:**

1. Create a new Python file: `File > New File` → Select "Python"
2. Write some code with intentional errors:

```python
def calculate_sum(a, b)
  return a + b

print(calculate_sum(5 10))
```

3. Save the file (`Ctrl + S` or `Cmd + S`)
4. **Dashboard should automatically open** in a webview panel
5. You should see the login page

---

### Step 5: Create Account and Test

**In the webview:**

1. Click "Sign Up" tab
2. Enter username, email, password
3. Click "Create Account"
4. You should be automatically logged in
5. The Analysis page should display your code
6. Wait 5-7 seconds for AI analysis to complete
7. View corrected code, errors, and recommendations

**Test other pages:**
- Click "Chatbot" icon → Ask a programming question
- Click "Progress" icon → View your analysis history
- Click "Profile" icon → View your profile and settings

---

## Troubleshooting

### Common Issues and Solutions

---

### Issue 1: PostgreSQL Connection Error

**Error:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solutions:**

1. **Check PostgreSQL is running:**
   ```bash
   # Windows
   services.msc
   # Look for PostgreSQL service

   # macOS/Linux
   sudo systemctl status postgresql
   ```

2. **Verify connection details in `.env`:**
   - Check username, password, host, port, database name
   - Try connecting manually with psql:
   ```bash
   psql -U postgres -d code_analysis_db
   ```

3. **Check port number:**
   - Default is 5432
   - If custom, update `.env` accordingly

4. **Firewall issues:**
   - Ensure port 5432 (or custom) is not blocked
   - Add PostgreSQL to firewall exceptions

---

### Issue 2: Backend Server Won't Start

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solutions:**

1. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

2. **Reinstall dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Check Python version:**
   ```bash
   python --version
   # Must be 3.9 or higher
   ```

---

### Issue 3: Groq API Key Invalid

**Error:**
```
groq.error.AuthenticationError: Invalid API key
```

**Solutions:**

1. **Verify API key in `.env`:**
   - Check for typos
   - Ensure no spaces or quotes around key
   - Key should start with `gsk_`

2. **Regenerate API key:**
   - Visit https://console.groq.com/
   - Create a new API key
   - Update `.env` file

3. **Check API key is active:**
   - Groq keys can expire or be deactivated
   - Verify in Groq console

---

### Issue 4: Frontend Not Building

**Error:**
```
ENOENT: no such file or directory
```

**Solutions:**

1. **Ensure you're in the correct directory:**
   ```bash
   cd media
   pwd  # Should show .../final2/media
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

---

### Issue 5: Extension Not Loading in VS Code

**Solutions:**

1. **Check extension compiled:**
   ```bash
   ls dist/extension.js
   # File should exist
   ```

2. **Recompile extension:**
   ```bash
   npm run compile
   ```

3. **Reload Extension Development Host:**
   - Press `Ctrl + R` (or `Cmd + R`) in Extension Development Host
   - Or close and press `F5` again

4. **Check VS Code version:**
   ```bash
   code --version
   # Must be 1.105.0 or higher
   ```

---

### Issue 6: Webview Shows Blank Page

**Solutions:**

1. **Ensure frontend is built:**
   ```bash
   cd media
   npm run build
   ls dist  # Should contain index.html and assets/
   ```

2. **Check browser console in webview:**
   - Right-click in webview → "Inspect"
   - Check Console tab for errors

3. **Verify paths in extension.ts:**
   - Ensure `media/dist` path is correct
   - Check `localResourceRoots` configuration

---

### Issue 7: API Requests Failing

**Error in browser console:**
```
Failed to fetch: net::ERR_CONNECTION_REFUSED
```

**Solutions:**

1. **Ensure backend is running:**
   - Check terminal running `uvicorn`
   - Should show "Application startup complete"

2. **Check backend URL:**
   - Default: http://localhost:8000
   - Verify in frontend service files

3. **CORS issues:**
   - Ensure `ALLOWED_ORIGINS` in backend `.env` includes frontend origin
   - Default: `http://localhost:5173,http://localhost:3000`

4. **Test backend directly:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"healthy"}
   ```

---

### Issue 8: Authentication Errors

**Error:**
```
401 Unauthorized: Invalid or expired token
```

**Solutions:**

1. **Clear browser storage:**
   - Right-click in webview → Inspect → Application tab
   - Clear Local Storage

2. **Logout and login again:**
   - Click Profile → Sign Out
   - Login with credentials

3. **Check SECRET_KEY in `.env`:**
   - Must be consistent across restarts
   - At least 32 characters long

---

## Deployment

### Production Deployment Checklist

#### Backend Deployment

**1. Prepare Environment:**
```bash
# Generate strong secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Update .env with production values
DATABASE_URL=postgresql://user:pass@production-host:5432/dbname
SECRET_KEY=production-secret-key-64-characters
ALLOWED_ORIGINS=https://yourdomain.com
```

**2. Deploy to Cloud:**

**Option A: Docker**
```bash
# Create Dockerfile in backend/
# Build image
docker build -t abcode-backend .

# Run container
docker run -p 8000:8000 --env-file .env abcode-backend
```

**Option B: Cloud Platform (Heroku, AWS, Azure, GCP)**
- Follow platform-specific deployment guides
- Ensure environment variables are set
- Use managed PostgreSQL (RDS, Cloud SQL, etc.)

---

#### Frontend Deployment

**Frontend is bundled with extension**, so no separate deployment needed.

---

#### Extension Distribution

**1. Package Extension:**
```bash
# Ensure frontend is built
cd media && npm run build && cd ..

# Compile extension
npm run compile

# Package as .vsix
vsce package
```

**2. Distribute:**

**Option A: VS Code Marketplace**
- Create publisher account
- Upload .vsix file
- Follow Microsoft's publishing guidelines

**Option B: Manual Distribution**
- Share .vsix file directly
- Users install with: `code --install-extension abcode-extension-0.0.1.vsix`

---

## Quick Reference

### Common Commands

```bash
# Start PostgreSQL
# Windows: net start postgresql-x64-[version]
# macOS: brew services start postgresql@13
# Linux: sudo systemctl start postgresql

# Start Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload

# Build Frontend
cd media
npm run build

# Compile Extension
cd ..
npm run compile

# Run Extension
# Press F5 in VS Code
```

---

### Directory Structure Reference

```
final2/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── database.py             # Database configuration
│   │   ├── models/                 # SQLAlchemy models
│   │   ├── routes/                 # API endpoints
│   │   ├── services/               # Business logic
│   │   └── utils/                  # Helper functions
│   ├── .env                        # Environment variables
│   ├── requirements.txt            # Python dependencies
│   └── venv/                       # Virtual environment
│
├── media/
│   ├── src/
│   │   ├── pages/                  # React pages
│   │   ├── components/             # React components
│   │   ├── services/               # API services
│   │   ├── App.tsx                 # Main app
│   │   └── main.tsx                # Entry point
│   ├── dist/                       # Built frontend (generated)
│   ├── package.json                # Node dependencies
│   └── vite.config.ts              # Vite configuration
│
├── src/
│   └── extension.ts                # Extension entry point
│
├── dist/
│   └── extension.js                # Compiled extension (generated)
│
├── package.json                    # Extension manifest
├── webpack.config.js               # Webpack config
└── tsconfig.json                   # TypeScript config
```

---

## Additional Resources

### Documentation
- [Frontend Documentation](FRONTEND_DOCUMENTATION.md)
- [Backend Documentation](BACKEND_DOCUMENTATION.md)
- [Extension Documentation](EXTENSION_DOCUMENTATION.md)
- [Integration Documentation](INTEGRATION_DOCUMENTATION.md)

### External Resources
- **FastAPI:** https://fastapi.tiangolo.com/
- **React:** https://react.dev/
- **VS Code Extension API:** https://code.visualstudio.com/api
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Groq API:** https://console.groq.com/docs
- **LangChain:** https://python.langchain.com/

---

## Support & Contributing

### Getting Help
- Check troubleshooting section above
- Review documentation files
- Open an issue on GitHub

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Create Pull Request

---

## License

[Specify your license here]

---

## Acknowledgments

- **Groq** for providing fast AI inference
- **FastAPI** for excellent web framework
- **React** and **Vite** for frontend tooling
- **VS Code** for extension platform
- All open-source contributors

---

**Congratulations!** 🎉 You've successfully set up the ABCode extension. Start analyzing your Python code with AI-powered insights!
