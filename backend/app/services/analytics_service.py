"""
Analytics service for computing user statistics and progress metrics.
"""

from sqlalchemy import func, text
from sqlalchemy.orm import Session
from typing import List, Dict

from app.models.code_analysis import CodeAnalysis


class AnalyticsService:
    """Service for analytics and statistics computation"""

    def get_top_errors(self, user_id: str, top_k: int, db: Session) -> List[Dict]:
        """
        Get TOP K most frequent error types for a user.

        Uses PostgreSQL JSON functions to extract and count error types
        from the dynamic errors JSON field.

        Args:
            user_id: User ID to get stats for
            top_k: Number of top errors to return
            db: Database session

        Returns:
            List of dictionaries with error_type, count, and percentage
        """
        # Query to extract error types from JSON array and count them
        query = text("""
            SELECT
                error->>'type' as error_type,
                COUNT(*) as count
            FROM
                code_analyses,
                json_array_elements(CAST(errors AS json)) as error
            WHERE
                user_id = :user_id
                AND errors IS NOT NULL
            GROUP BY error_type
            ORDER BY count DESC
            LIMIT :top_k
        """)

        result = db.execute(query, {"user_id": user_id, "top_k": top_k})
        rows = result.fetchall()

        if not rows:
            return []

        # Calculate total for percentages
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
        Get total errors per month for progress visualization.

        Args:
            user_id: User ID
            db: Database session

        Returns:
            List of {"date": "YYYY-MM", "errors": count}
        """
        result = db.query(
            func.to_char(CodeAnalysis.created_at, 'YYYY-MM').label('month'),
            func.sum(CodeAnalysis.total_errors).label('total')
        ).filter(
            CodeAnalysis.user_id == user_id
        ).group_by('month').order_by('month').all()

        return [
            {"date": row.month, "errors": int(row.total) if row.total else 0}
            for row in result
        ]

    def get_error_breakdown_by_month(self, user_id: str, db: Session) -> List[Dict]:
        """
        Get breakdown of TOP error types grouped by month.

        Args:
            user_id: User ID
            db: Database session

        Returns:
            List of monthly breakdowns with error categories
        """
        # Get all analyses for user
        analyses = db.query(CodeAnalysis).filter(
            CodeAnalysis.user_id == user_id
        ).order_by(CodeAnalysis.created_at).all()

        # Group by month and aggregate error types
        monthly_data = {}

        for analysis in analyses:
            if not analysis.errors:
                continue

            month_key = analysis.created_at.strftime('%B %Y')

            if month_key not in monthly_data:
                monthly_data[month_key] = {}

            # Count each error type
            for error in analysis.errors:
                error_type = error.get("type", "Unknown")
                if error_type not in monthly_data[month_key]:
                    monthly_data[month_key][error_type] = 0
                monthly_data[month_key][error_type] += 1

        # Format for frontend
        result = []
        for month, error_counts in monthly_data.items():
            total = sum(error_counts.values())
            result.append({
                "month": month,
                "categories": error_counts,
                "total": total
            })

        return result

    def get_user_day_streak(self, user_id: str, db: Session) -> int:
        """
        Calculate consecutive days streak for a user.

        Args:
            user_id: User ID
            db: Database session

        Returns:
            Number of consecutive days with at least one analysis
        """
        from datetime import date, timedelta

        # Get unique dates (only date part, not time)
        analyses = db.query(CodeAnalysis).filter(
            CodeAnalysis.user_id == user_id
        ).order_by(CodeAnalysis.created_at).all()

        if not analyses:
            return 0

        # Get unique dates
        analysis_dates = sorted(set(
            analysis.created_at.date() for analysis in analyses
        ), reverse=True)

        # Calculate streak starting from today
        today = date.today()
        streak = 0
        current_date = today

        for analysis_date in analysis_dates:
            # Check if this date is consecutive
            if analysis_date == current_date:
                streak += 1
                current_date -= timedelta(days=1)
            elif analysis_date < current_date:
                # Gap found, break
                break

        return streak

    def get_most_common_error(self, user_id: str, db: Session) -> str:
        """
        Get the most common error type for a user.

        Args:
            user_id: User ID
            db: Database session

        Returns:
            Most common error type name
        """
        top_errors = self.get_top_errors(user_id, 1, db)

        if top_errors:
            return top_errors[0]["error_type"]

        return "No errors yet"

    def get_improvement_rate(self, user_id: str, db: Session) -> float:
        """
        Calculate error reduction rate (improvement percentage).

        Compares first month average vs last month average.

        Args:
            user_id: User ID
            db: Database session

        Returns:
            Improvement percentage (0-100)
        """
        monthly_progress = self.get_monthly_progress(user_id, db)

        if len(monthly_progress) < 2:
            return 0.0

        first_month_errors = monthly_progress[0]["errors"]
        last_month_errors = monthly_progress[-1]["errors"]

        if first_month_errors == 0:
            return 0.0

        # Calculate improvement percentage
        reduction = first_month_errors - last_month_errors
        improvement = (reduction / first_month_errors) * 100

        # Return positive number (0-100), capped at 100
        return max(0.0, min(100.0, improvement))

    def get_average_errors(self, user_id: str, db: Session) -> float:
        """
        Calculate average errors per analysis session.

        Args:
            user_id: User ID
            db: Database session

        Returns:
            Average errors per analysis
        """
        result = db.query(
            func.avg(CodeAnalysis.total_errors).label('avg_errors')
        ).filter(
            CodeAnalysis.user_id == user_id
        ).first()

        if result and result.avg_errors:
            return round(float(result.avg_errors), 1)

        return 0.0

    def get_best_score(self, user_id: str, db: Session) -> int:
        """
        Get the lowest error count (best score) from all analyses.

        Args:
            user_id: User ID
            db: Database session

        Returns:
            Lowest error count
        """
        result = db.query(
            func.min(CodeAnalysis.total_errors).label('min_errors')
        ).filter(
            CodeAnalysis.user_id == user_id
        ).first()

        if result and result.min_errors is not None:
            return int(result.min_errors)

        return 0

    def get_progress_metrics(self, user_id: str, db: Session) -> Dict:
        """
        Get all progress metrics for the user in one call.

        Returns:
            {
                "improvement": float (0-100),
                "avg_errors": float,
                "best_score": int
            }
        """
        return {
            "improvement": self.get_improvement_rate(user_id, db),
            "avg_errors": self.get_average_errors(user_id, db),
            "best_score": self.get_best_score(user_id, db)
        }


# Global instance
_analytics_service_instance = None


def get_analytics_service() -> AnalyticsService:
    """Get singleton analytics service instance"""
    global _analytics_service_instance
    if _analytics_service_instance is None:
        _analytics_service_instance = AnalyticsService()
    return _analytics_service_instance
