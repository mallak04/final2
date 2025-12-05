from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
from datetime import datetime
from collections import defaultdict

from app.database import get_db
from app.models.code_analysis import CodeAnalysis
from app.schemas.code_analysis import (
    CodeAnalysisCreate,
    CodeAnalysisResponse,
    ProgressData,
    MonthlyErrorBreakdown,
    HistoryItem
)

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.post("/", response_model=CodeAnalysisResponse)
def create_analysis(analysis: CodeAnalysisCreate, db: Session = Depends(get_db)):
    """Create a new code analysis record"""
    db_analysis = CodeAnalysis(**analysis.model_dump())
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

@router.get("/progress/{user_id}", response_model=List[ProgressData])
def get_progress_data(user_id: str, db: Session = Depends(get_db)):
    """Get monthly progress data for a user"""
    results = db.query(
        func.date_trunc('month', CodeAnalysis.created_at).label('month'),
        func.avg(CodeAnalysis.total_errors).label('avg_errors')
    ).filter(
        CodeAnalysis.user_id == user_id
    ).group_by(
        func.date_trunc('month', CodeAnalysis.created_at)
    ).order_by(
        func.date_trunc('month', CodeAnalysis.created_at)
    ).all()

    return [
        ProgressData(
            date=result.month.strftime('%Y-%m-%d'),
            errors=int(result.avg_errors)
        )
        for result in results
    ]

@router.get("/breakdown/{user_id}", response_model=List[MonthlyErrorBreakdown])
def get_monthly_breakdown(user_id: str, db: Session = Depends(get_db)):
    """Get monthly error breakdown by category for a user"""
    analyses = db.query(CodeAnalysis).filter(
        CodeAnalysis.user_id == user_id
    ).order_by(CodeAnalysis.created_at).all()

    monthly_data = defaultdict(lambda: {
        "Brackets": 0,
        "Commas": 0,
        "Indentation": 0,
        "Case & Spelling": 0,
        "Missing/Wrong Colon": 0,
        "Reversed Words": 0,
    })

    for analysis in analyses:
        month_key = analysis.created_at.strftime('%B %Y')
        monthly_data[month_key]["Brackets"] += analysis.bracket_errors
        monthly_data[month_key]["Commas"] += analysis.comma_errors
        monthly_data[month_key]["Indentation"] += analysis.indentation_errors
        monthly_data[month_key]["Case & Spelling"] += analysis.case_spelling_errors
        monthly_data[month_key]["Missing/Wrong Colon"] += analysis.colon_errors
        monthly_data[month_key]["Reversed Words"] += analysis.reversed_word_errors

    result = []
    for month, categories in monthly_data.items():
        total = sum(categories.values())
        result.append(MonthlyErrorBreakdown(
            month=month,
            categories=categories,
            total=total
        ))

    return result

@router.get("/history/{user_id}", response_model=List[HistoryItem])
def get_analysis_history(user_id: str, limit: int = 10, db: Session = Depends(get_db)):
    """Get analysis history for a user"""
    analyses = db.query(CodeAnalysis).filter(
        CodeAnalysis.user_id == user_id
    ).order_by(CodeAnalysis.created_at.desc()).limit(limit).all()

    return [
        HistoryItem(
            id=analysis.id,
            date=analysis.created_at,
            language=analysis.language,
            total_errors=analysis.total_errors,
            code_preview=analysis.code_content[:30] + "..."
        )
        for analysis in analyses
    ]

@router.get("/{analysis_id}", response_model=CodeAnalysisResponse)
def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
    """Get a specific analysis by ID"""
    analysis = db.query(CodeAnalysis).filter(CodeAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
