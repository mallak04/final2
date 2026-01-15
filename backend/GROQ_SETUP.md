# Groq AI Integration Setup Guide

This guide will help you set up the Groq AI service with Llama 3.3 for code analysis.

## Prerequisites

1. **Groq API Key**: Get your free API key from [Groq Console](https://console.groq.com/)
   - Sign up for a free account
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key (you'll only see it once!)

## Installation Steps

### 1. Install Python Dependencies

```bash
cd final2/backend
pip install -r requirements.txt
```

This will install:
- `langchain` - LangChain framework
- `langchain-groq` - Groq integration for LangChain
- `langchain-core` - Core LangChain components

### 2. Configure Environment Variables

Edit your `.env` file in the `backend` directory:

```bash
# Groq API Configuration (Llama 3.3)
GROQ_API_KEY=gsk_your_actual_api_key_here
USE_GROQ_AI=true
```

**Important**: Replace `your_groq_api_key_here` with your actual Groq API key!

### 3. Verify Installation

Start the backend server:

```bash
uvicorn app.main:app --reload
```

You should see in the logs:
```
✓ Using Groq AI Service with Llama 3.3
```

If you see this message, the integration is working!

## How It Works

### Architecture

```
User Code → VS Code Extension → FastAPI Backend → Groq AI Service → Llama 3.3 Model
                                                         ↓
                                                   Structured Output
                                                         ↓
                                        Database (PostgreSQL) ← Parser Service
```

### Structured Output

The Groq service uses LangChain's structured output to ensure responses match your database schema exactly:

```python
{
  "errors": [
    {
      "category": "Syntax Error",
      "count": 2,
      "description": "Missing parentheses in print statement",
      "icon": "X",
      "details": [
        {
          "line": 2,
          "message": "print requires parentheses in Python 3",
          "codeSnippet": "print i",
          "suggestion": "Change to: print(i)"
        }
      ]
    }
  ],
  "corrected_code": "for i in range(10):\n    print(i)",
  "explanations": [
    "In Python 3, print is a function and requires parentheses..."
  ],
  "recommendations": [
    "Use consistent indentation (4 spaces)",
    "Add type hints for better code clarity"
  ]
}
```

### Model Configuration

- **Model**: `llama-3.3-70b-versatile` (Groq's fastest Llama 3.3)
- **Temperature**: 0.3 (lower = more consistent, deterministic)
- **Max Tokens**: 4096 (sufficient for code analysis)

## Features

✅ **Dynamic Error Detection**: Identifies ANY type of error (not restricted to predefined categories)
✅ **Line-by-Line Analysis**: Provides exact line numbers for each error
✅ **Code Snippets**: Shows the problematic code for each error
✅ **Fix Suggestions**: Offers specific suggestions for each error instance
✅ **Corrected Code**: Generates fully corrected version of the code
✅ **Educational Explanations**: Beginner-friendly explanations for each error type
✅ **Best Practice Recommendations**: Suggests improvements for code quality

## Testing

### Test with cURL

```bash
# First, login to get a token
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}' \
  | jq -r '.access_token')

# Then analyze code
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "code": "for i in range(10)\n    print i",
    "language": "python"
  }' | jq
```

### Test via VS Code Extension

1. Open VS Code with the extension installed
2. Create a new Python file with intentional errors:
   ```python
   for i in range(10)
       print i
   ```
3. Save the file (Ctrl+S or Cmd+S)
4. The analysis panel should open automatically
5. View the detected errors, corrected code, and explanations

## Troubleshooting

### "GROQ_API_KEY not found" Error

**Solution**: Make sure your `.env` file has the correct API key:
```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

### "Failed to initialize Groq AI Service" Warning

**Possible causes**:
1. Missing `langchain-groq` package
   - Fix: `pip install langchain-groq`
2. Invalid API key
   - Fix: Check your Groq Console for the correct key
3. Network connectivity issues
   - Fix: Check your internet connection

The system will automatically fall back to the mock AI service if Groq fails.

### Rate Limits

Groq free tier limits:
- **RPM (Requests Per Minute)**: 30
- **RPD (Requests Per Day)**: 14,400
- **TPM (Tokens Per Minute)**: 18,000

If you hit rate limits, the API will return a 429 error. Consider:
- Adding rate limiting in your application
- Upgrading to a paid plan
- Implementing request queuing

## Cost Comparison

Groq pricing (as of 2025):
- **Free Tier**: 14,400 requests/day
- **Pay-as-you-go**: Very affordable (check current pricing)

Groq is significantly cheaper and faster than OpenAI GPT models while providing excellent code analysis quality.

## Advanced Configuration

### Changing the Model

Edit `groq_ai_service.py`:

```python
self.llm = ChatGroq(
    model="llama-3.1-70b-versatile",  # Or other available models
    api_key=self.api_key,
    temperature=0.3,
    max_tokens=4096
)
```

Available models:
- `llama-3.3-70b-versatile` (Recommended - fastest)
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`
- `gemma-7b-it`

### Adjusting Temperature

- Lower (0.1-0.3): More deterministic, consistent responses
- Medium (0.4-0.7): Balanced creativity and consistency
- Higher (0.8-1.0): More creative, varied responses

For code analysis, we recommend keeping it at 0.3 or lower.

## Switching Back to Mock Service

To temporarily use the mock service (for testing or development):

Edit `.env`:
```bash
USE_GROQ_AI=false
```

Or remove/comment out the line entirely:
```bash
# USE_GROQ_AI=true
```

## Support

- **Groq Documentation**: https://console.groq.com/docs
- **LangChain Documentation**: https://python.langchain.com/docs/get_started/introduction
- **Project Issues**: Check your project repository for issues and support

---

**Ready to go!** 🚀 Your code analysis system is now powered by Groq's Llama 3.3!
