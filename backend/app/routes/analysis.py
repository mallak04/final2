from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
from datetime import datetime
from collections import defaultdict

from app.database import get_db
from app.models.code_analysis import CodeAnalysis
from app.models.user import User
from app.schemas.code_analysis import (
    CodeAnalysisCreate,
    CodeAnalysisResponse,
    ProgressData,
    MonthlyErrorBreakdown,
    HistoryItem,
    UserStats
)
from app.services.analytics_service import get_analytics_service
from app.utils.dependencies import get_current_user

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
    """
    Get monthly error breakdown by category for a user.
    Now uses dynamic error types from AI instead of predefined categories.
    """
    analytics_service = get_analytics_service()
    return analytics_service.get_error_breakdown_by_month(user_id, db)

@router.get("/top-errors/{user_id}")
def get_top_errors(user_id: str, top_k: int = 10, db: Session = Depends(get_db)):
    """
    Get TOP K most frequent error types for a user.

    Args:
        user_id: User ID
        top_k: Number of top errors to return (default 10)
        db: Database session

    Returns:
        List of top error types with counts and percentages
    """
    analytics_service = get_analytics_service()
    return analytics_service.get_top_errors(user_id, top_k, db)

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

@router.get("/user-stats/{user_id}", response_model=UserStats)
def get_user_stats(user_id: str, db: Session = Depends(get_db)):
    """
    Get user profile statistics.
    Now uses dynamic error counting and analytics service.
    """
    analytics_service = get_analytics_service()

    # Get all analyses for the user
    analyses = db.query(CodeAnalysis).filter(
        CodeAnalysis.user_id == user_id
    ).order_by(CodeAnalysis.created_at).all()

    # Calculate total analyses
    total_analyses = len(analyses)

    # Calculate total errors fixed from total_errors field
    errors_fixed = sum(
        analysis.total_errors
        for analysis in analyses
    )

    # Calculate day streak using analytics service
    day_streak = analytics_service.get_user_day_streak(user_id, db)

    return UserStats(
        total_analyses=total_analyses,
        errors_fixed=errors_fixed,
        day_streak=day_streak
    )

@router.get("/progress-metrics/{user_id}")
def get_progress_metrics(user_id: str, db: Session = Depends(get_db)):
    """
    Get progress metrics for user dashboard.

    Returns:
        {
            "improvement": 45.5,  // Percentage (0-100)
            "avg_errors": 3.2,    // Average errors per session
            "best_score": 0       // Lowest error count achieved
        }
    """
    analytics_service = get_analytics_service()
    return analytics_service.get_progress_metrics(user_id, db)

@router.get("/{analysis_id}", response_model=CodeAnalysisResponse)
def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
    """Get a specific analysis by ID"""
    analysis = db.query(CodeAnalysis).filter(CodeAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
