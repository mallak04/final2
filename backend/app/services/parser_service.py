"""
Parser service to extract structured data from AI markdown responses.
"""

import re
from typing import List, Dict, Optional


class ParserService:
    """Parse AI markdown responses into structured data"""

    def parse_ai_response(self, markdown: str) -> Dict:
        """
        Parse AI markdown response into structured format.

        Args:
            markdown: Markdown-formatted AI response

        Returns:
            Dictionary with errors, corrected_code, explanations, recommendations, and language
        """
        code_info = self.extract_code_block_with_language(markdown)

        return {
            "errors": self.extract_errors(markdown),
            "corrected_code": code_info["code"],
            "language": code_info["language"],
            "explanations": self.extract_explanations(markdown),
            "recommendations": self.extract_recommendations(markdown)
        }

    def extract_errors(self, markdown: str) -> List[Dict[str, str]]:
        """
        Extract errors from ## Errors section.

        Expected format:
        ## Errors
        **Error Type**: Description
        **Another Error**: Description

        Returns:
            List of {"type": "Error Type", "message": "Description"}
        """
        errors = []

        # Find the Errors section
        errors_section = self._extract_section(markdown, "Errors")
        if not errors_section:
            return errors

        # Match pattern: **Error Type**: Description
        pattern = r'\*\*([^*]+)\*\*:\s*([^\n]+)'
        matches = re.findall(pattern, errors_section, re.MULTILINE)

        for error_type, message in matches:
            errors.append({
                "type": error_type.strip(),
                "message": message.strip()
            })

        return errors

    def extract_code_block(self, markdown: str) -> str:
        """
        Extract code from ## Corrected Code section.

        Expected format:
        ## Corrected Code
        ```language
        code here
        ```

        Returns:
            Clean code string without markdown formatting
        """
        code_info = self.extract_code_block_with_language(markdown)
        return code_info["code"]

    def extract_code_block_with_language(self, markdown: str) -> Dict[str, str]:
        """
        Extract code and language from ## Corrected Code section.

        Expected format:
        ## Corrected Code
        ```python
        code here
        ```

        Returns:
            Dictionary with "code" and "language" keys
        """
        # Find code block with language specification
        # Pattern matches: ```language\ncode```
        code_pattern = r'```([\w]*)\n(.*?)```'
        code_match = re.search(code_pattern, markdown, re.DOTALL)

        if code_match:
            language = code_match.group(1).strip()
            code = code_match.group(2).strip()
            return {
                "code": code,
                "language": language if language else "unknown"
            }

        # Fallback: try to find Corrected Code section without code block
        corrected_section = self._extract_section(markdown, "Corrected Code")
        if corrected_section:
            # Remove any remaining markdown
            clean = re.sub(r'```[\w]*', '', corrected_section)
            clean = clean.replace('```', '')
            return {
                "code": clean.strip(),
                "language": "unknown"
            }

        return {
            "code": "",
            "language": "unknown"
        }

    def extract_explanations(self, markdown: str) -> List[Dict[str, str]]:
        """
        Extract explanations from ## Explanation section.

        Expected format:
        ## Explanation
        **Error Type**: Detailed explanation
        **Another Error**: Detailed explanation

        Returns:
            List of {"error_type": "Error Type", "explanation": "..."}
        """
        explanations = []

        # Find the Explanation section
        expl_section = self._extract_section(markdown, "Explanation")
        if not expl_section:
            return explanations

        # Match pattern: **Error Type**: Explanation
        pattern = r'\*\*([^*]+)\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)'
        matches = re.findall(pattern, expl_section, re.MULTILINE)

        for error_type, explanation in matches:
            explanations.append({
                "error_type": error_type.strip(),
                "explanation": explanation.strip()
            })

        return explanations

    def _extract_section(self, markdown: str, section_name: str) -> Optional[str]:
        """
        Extract content of a section by name.

        Args:
            markdown: Full markdown text
            section_name: Name of section to extract (e.g., "Errors", "Explanation")

        Returns:
            Section content or None if not found
        """
        # Match: ## Section Name ... until next ## or end of string
        pattern = rf'##\s*{section_name}\s*\n(.*?)(?=##|\Z)'
        match = re.search(pattern, markdown, re.DOTALL | re.IGNORECASE)

        if match:
            return match.group(1).strip()

        return None

    def find_explanation_for_error(self, error_type: str, explanations: List[Dict]) -> str:
        """
        Find explanation for a specific error type.

        Args:
            error_type: The error type to find explanation for
            explanations: List of explanation dictionaries

        Returns:
            Explanation text or default message
        """
        for expl in explanations:
            if expl["error_type"].lower() == error_type.lower():
                return expl["explanation"]

        return "No detailed explanation available."

    def extract_recommendations(self, markdown: str) -> List[str]:
        """
        Extract recommendations from ## Recommendations section.

        Expected format:
        ## Recommendations
        - Recommendation 1
        - Recommendation 2

        Returns:
            List of recommendation strings
        """
        recommendations = []

        # Find the Recommendations section
        rec_section = self._extract_section(markdown, "Recommendations")
        if not rec_section:
            return recommendations

        # Match bullet points (- or * prefix)
        pattern = r'^[-*]\s+(.+)$'
        matches = re.findall(pattern, rec_section, re.MULTILINE)

        for rec in matches:
            recommendations.append(rec.strip())

        return recommendations

    def extract_line_numbers(self, error_message: str) -> Optional[int]:
        """
        Extract line number from error message if present.

        Args:
            error_message: Error message that might contain line number

        Returns:
            Line number or None
        """
        # Match patterns like: "on line 5", "Line 10:", "at line 3"
        patterns = [
            r'line\s+(\d+)',
            r'Line\s+(\d+)',
            r'at\s+line\s+(\d+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, error_message)
            if match:
                return int(match.group(1))

        return None


# Global instance
_parser_service_instance = None


def get_parser_service() -> ParserService:
    """Get singleton parser service instance"""
    global _parser_service_instance
    if _parser_service_instance is None:
        _parser_service_instance = ParserService()
    return _parser_service_instance
