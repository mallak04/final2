"""
AI code analysis routes.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.services.analysis_service import get_analysis_service

router = APIRouter(prefix="/api", tags=["ai-analysis"])


class AnalyzeRequest(BaseModel):
    """Request schema for code analysis"""
    code: str
    language: Optional[str] = "auto"


@router.post("/analyze")
async def analyze_code(
    request: AnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze code with AI model.

    **Language Detection**: The AI automatically detects the programming language
    from the corrected code block. You can optionally provide a language hint,
    but it will be auto-detected from the AI response.

    **Workflow**:
    1. Receives code from frontend (language is optional)
    2. Calls AI model to analyze the code
    3. Parses AI response and extracts language from code block
    4. Saves analysis to database with detected language
    5. Returns formatted response for frontend

    **Request Body**:
    ```json
    {
        "code": "for i in range(10)\\n    print(i)",
        "language": "python"  // Optional, will be auto-detected from AI response
    }
    ```

    **Response**:
    ```json
    {
        "id": "uuid",
        "correctedCode": "corrected code here",
        "corrections": ["list", "of", "changes"],
        "errors": [
            {
                "category": "Error Type",
                "count": 1,
                "description": "Error description",
                "icon": "icon",
                "details": [...]
            }
        ],
        "recommendations": ["recommendation1", "recommendation2"]
    }
    ```

    Args:
        request: Code and optional language hint
        current_user: Authenticated user from JWT token
        db: Database session

    Returns:
        Analysis result with corrected code, errors, and recommendations

    Raises:
        400: If code is empty
        500: If analysis fails
    """
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    try:
        # Use analysis service to handle the complete workflow
        # Language will be auto-detected from AI response
        analysis_service = get_analysis_service()
        result = await analysis_service.analyze_and_save(
            user_id=current_user.id,
            code=request.code,
            language=request.language or "auto",
            db=db
        )

        return result

    except Exception as e:
        # Log error in production
        print(f"Analysis error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze code. Please try again."
        )
