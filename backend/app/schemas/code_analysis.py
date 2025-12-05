from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CodeAnalysisBase(BaseModel):
    code_content: str
    language: str
    user_id: str
    total_errors: int = 0
    bracket_errors: int = 0
    comma_errors: int = 0
    indentation_errors: int = 0
    case_spelling_errors: int = 0
    colon_errors: int = 0
    reversed_word_errors: int = 0
    recommendations: Optional[str] = None

class CodeAnalysisCreate(CodeAnalysisBase):
    pass

class CodeAnalysisResponse(CodeAnalysisBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProgressData(BaseModel):
    date: str
    errors: int

class MonthlyErrorBreakdown(BaseModel):
    month: str
    categories: dict
    total: int

class HistoryItem(BaseModel):
    id: str
    date: datetime
    language: str
    total_errors: int
    code_preview: str
