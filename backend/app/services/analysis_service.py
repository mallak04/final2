"""
Analysis service - orchestrates AI analysis and data processing.
"""

import time
from typing import Dict, List
from sqlalchemy.orm import Session

from app.services.ai_service import get_ai_service
from app.services.parser_service import get_parser_service
from app.models.code_analysis import CodeAnalysis


class AnalysisService:
    """Service for managing code analysis workflow"""

    def __init__(self):
        self.ai_service = get_ai_service()
        self.parser = get_parser_service()

    async def analyze_and_save(
        self,
        user_id: str,
        code: str,
        language: str,
        db: Session
    ) -> Dict:
        """
        Complete analysis workflow:
        1. Call AI model with code
        2. Parse AI markdown response
        3. Save to database
        4. Format response for frontend

        Args:
            user_id: User performing the analysis
            code: Source code to analyze
            language: Programming language
            db: Database session

        Returns:
            Formatted response for frontend
        """
        # Step 1: Get AI response
        start_time = time.time()
        ai_response = await self.ai_service.analyze_code(code, language)
        processing_time_ms = int((time.time() - start_time) * 1000)

        # Step 2: Check if we have structured output from Groq
        structured_result = None
        if hasattr(self.ai_service, 'get_last_structured_result'):
            structured_result = self.ai_service.get_last_structured_result()

        # Step 2b: Parse response (fallback for non-Groq services)
        parsed = self.parser.parse_ai_response(ai_response)

        # Use detected language from AI if available, otherwise use provided language
        detected_language = parsed.get("language", "unknown")
        final_language = detected_language if detected_language != "unknown" else language

        # Step 3: Save to database
        analysis = CodeAnalysis(
            user_id=user_id,
            code_content=code,
            language=final_language,
            ai_raw_response=ai_response,
            corrected_code=parsed["corrected_code"],
            errors=parsed["errors"],  # Stored as JSON
            explanations=parsed["explanations"],
            recommendations="\n".join(parsed.get("recommendations", [])),  # Store as text
            total_errors=len(parsed["errors"]),
            processing_time_ms=processing_time_ms
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        # Step 4: Format for frontend
        if structured_result:
            return self._format_from_structured(analysis, structured_result, parsed)
        else:
            return self._format_for_frontend(analysis, parsed)

    def _format_for_frontend(self, analysis: CodeAnalysis, parsed: Dict) -> Dict:
        """
        Transform analysis data into frontend-expected format.

        Frontend expects:
        {
            id: string,
            correctedCode: string,
            corrections: string[],  # For underlining
            errors: [
                {
                    category: string,
                    count: number,
                    description: string,
                    icon: string,
                    details: [...]
                }
            ],
            recommendations: string[]
        }
        """
        # Group errors by type (same error type may appear multiple times)
        error_groups = {}

        for idx, error in enumerate(parsed["errors"]):
            error_type = error["type"]

            if error_type not in error_groups:
                error_groups[error_type] = {
                    "category": error_type,
                    "count": 0,
                    "description": error["message"],
                    "icon": self._get_icon_for_error(error_type),
                    "details": []
                }

            # Increment count
            error_groups[error_type]["count"] += 1

            # Extract line number if present
            line_number = self.parser.extract_line_numbers(error["message"])

            # Find explanation for this error
            explanation = self.parser.find_explanation_for_error(
                error_type,
                parsed["explanations"]
            )

            # Add detail entry
            error_groups[error_type]["details"].append({
                "line": line_number or 0,
                "message": error["message"],
                "codeSnippet": self._extract_code_snippet(
                    analysis.code_content,
                    line_number
                ),
                "correction": self._extract_correction_snippet(
                    analysis.corrected_code,
                    line_number
                ),
                "explanation": explanation
            })

        return {
            "id": analysis.id,
            "correctedCode": analysis.corrected_code or analysis.code_content,
            "corrections": self._extract_corrections(
                analysis.corrected_code or analysis.code_content,
                analysis.code_content
            ),
            "errors": list(error_groups.values()),
            "recommendations": parsed.get("recommendations", [])
        }

    def _format_from_structured(self, analysis: CodeAnalysis, structured_result, parsed: Dict) -> Dict:
        """
        Format response using structured Groq output directly.
        This preserves all the detailed information from the AI.
        """
        errors_formatted = []

        for error_cat in structured_result.errors:
            errors_formatted.append({
                "category": error_cat.category,
                "count": error_cat.count,
                "description": error_cat.description,
                "icon": error_cat.icon,
                "details": [
                    {
                        "line": detail.line,
                        "message": detail.message,
                        "codeSnippet": detail.codeSnippet,
                        "correction": detail.suggestion,  # Use suggestion as correction
                        "explanation": detail.suggestion
                    } for detail in error_cat.details
                ]
            })

        return {
            "id": analysis.id,
            "correctedCode": structured_result.corrected_code,
            "corrections": self._extract_corrections(
                structured_result.corrected_code,
                analysis.code_content
            ),
            "errors": errors_formatted,
            "recommendations": structured_result.recommendations
        }

    def _get_icon_for_error(self, error_type: str) -> str:
        """Map error type to icon"""
        error_lower = error_type.lower()

        icon_map = {
            "syntax": "{}",
            "indentation": "->",
            "type": "T",
            "logic": "!",
            "undefined": "?",
            "missing": "+",
            "unused": "-",
            "bracket": "[]",
            "colon": ":",
            "comma": ",",
            "spelling": "Aa"
        }

        for keyword, icon in icon_map.items():
            if keyword in error_lower:
                return icon

        return "X"  # Default icon

    def _extract_code_snippet(self, code: str, line_number: int = None) -> str:
        """Extract relevant code snippet around error line"""
        if not line_number or not code:
            # Return first 50 characters as preview
            return code[:50] + "..." if len(code) > 50 else code

        lines = code.split('\n')
        if line_number > len(lines):
            return lines[0] if lines else ""

        # Return the error line (1-indexed)
        return lines[line_number - 1] if line_number <= len(lines) else ""

    def _extract_correction_snippet(self, corrected_code: str, line_number: int = None) -> str:
        """Extract corrected code snippet"""
        if not corrected_code:
            return ""

        if not line_number:
            return corrected_code[:50] + "..." if len(corrected_code) > 50 else corrected_code

        lines = corrected_code.split('\n')
        if line_number > len(lines):
            return lines[0] if lines else ""

        return lines[line_number - 1] if line_number <= len(lines) else ""

    def _extract_corrections(self, corrected: str, original: str) -> List[str]:
        """
        Extract list of corrections made (for frontend underlining).

        This is a simple word-level diff.
        TODO: Implement more sophisticated diff algorithm.
        """
        if not corrected or corrected == original:
            return []

        # Simple approach: find words that appear in corrected but not in original
        original_words = set(original.split())
        corrected_words = corrected.split()

        corrections = []
        for word in corrected_words:
            if word not in original_words and len(word) > 2:  # Filter short words
                corrections.append(word)

        # Limit to 10 corrections for performance
        return corrections[:10]

    def _generate_recommendations(self, errors: List[Dict]) -> List[str]:
        """
        Generate learning recommendations based on errors found.

        Args:
            errors: List of error dictionaries

        Returns:
            List of recommendation strings
        """
        recommendations = []
        error_types = [e["type"].lower() for e in errors]

        # Rule-based recommendations
        if any("indent" in et for et in error_types):
            recommendations.append(
                "Review indentation rules - consistent spacing is crucial in Python"
            )

        if any("syntax" in et for et in error_types):
            recommendations.append(
                "Study basic syntax rules for your programming language"
            )

        if any("undefined" in et or "variable" in et for et in error_types):
            recommendations.append(
                "Always declare variables before using them"
            )

        if any("type" in et for et in error_types):
            recommendations.append(
                "Pay attention to data types and use appropriate type conversions"
            )

        if any("logic" in et for et in error_types):
            recommendations.append(
                "Test your code with different inputs to catch logic errors early"
            )

        if any("colon" in et for et in error_types):
            recommendations.append(
                "Remember to add colons after control structures (if, for, while, def)"
            )

        if any("bracket" in et or "parenthesis" in et for et in error_types):
            recommendations.append(
                "Use an IDE with bracket matching to avoid mismatched brackets"
            )

        # Add general recommendations if we have few specific ones
        if len(recommendations) < 3:
            general = [
                "Write code incrementally and test frequently",
                "Use descriptive variable names to make code more readable",
                "Add comments to explain complex logic",
                "Read error messages carefully - they often point to the exact problem"
            ]
            recommendations.extend(general[:3 - len(recommendations)])

        # Always provide encouragement
        if len(errors) <= 2:
            recommendations.append("Great job! You're making good progress.")
        elif len(errors) <= 5:
            recommendations.append("Keep practicing - you're improving!")
        else:
            recommendations.append("Don't worry - even experienced programmers make mistakes. Keep learning!")

        return recommendations[:5]  # Limit to 5 recommendations


# Global instance
_analysis_service_instance = None


def get_analysis_service() -> AnalysisService:
    """Get singleton analysis service instance"""
    global _analysis_service_instance
    if _analysis_service_instance is None:
        _analysis_service_instance = AnalysisService()
    return _analysis_service_instance
