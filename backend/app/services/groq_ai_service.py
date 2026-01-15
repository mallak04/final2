"""
Groq AI Service with LangChain integration.
Uses llama-3.3-versatile model via Groq API with structured output.
"""

import os
from typing import Dict, List, Optional
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    """Detailed information about a specific error instance"""
    line: int = Field(description="Line number where error occurs")
    message: str = Field(description="Brief description of the error")
    codeSnippet: str = Field(description="The problematic code snippet")
    suggestion: str = Field(description="Suggested fix for this error")


class ErrorCategory(BaseModel):
    """Category of errors with details"""
    category: str = Field(description="Error type/category name (e.g., 'Syntax Error', 'Indentation Error')")
    count: int = Field(description="Number of occurrences of this error type")
    description: str = Field(description="General description of this error category")
    icon: str = Field(description="Icon identifier (use 'X' for errors, '!' for warnings, '?' for suggestions)")
    details: List[ErrorDetail] = Field(description="List of specific error instances with line numbers")


class CodeAnalysisOutput(BaseModel):
    """Structured output format for code analysis"""
    errors: List[ErrorCategory] = Field(description="List of error categories found in the code")
    corrected_code: str = Field(description="The corrected version of the code")
    explanations: List[str] = Field(description="List of explanations for each error category")
    recommendations: List[str] = Field(description="General recommendations to improve code quality")


class GroqAIService:
    """Service for code analysis using Groq API with Llama model via LangChain"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Groq AI service with LangChain.

        Args:
            api_key: Groq API key (or from environment variable GROQ_API_KEY)
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY")

        if not self.api_key:
            raise ValueError("GROQ_API_KEY not provided and not found in environment variables")

        # Initialize Groq LLM with Llama 3.3
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",  # Groq's Llama 3.3 70B model
            api_key=self.api_key,
            temperature=0.3,  # Lower temperature for more consistent code analysis
            max_tokens=4096
        )

        # Create output parser
        self.parser = JsonOutputParser(pydantic_object=CodeAnalysisOutput)

        # Create structured prompt
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self._get_system_prompt()),
            ("user", "Analyze this {language} code:\n\n{code}")
        ])

        # Create the chain
        self.chain = self.prompt | self.llm | self.parser

    def _get_system_prompt(self) -> str:
        """Get the system prompt with output format instructions"""
        return """You are an expert code analyzer. Analyze the provided code and identify ALL errors, issues, and areas for improvement.

Your response MUST be a valid JSON object with this EXACT structure:

{{
  "errors": [
    {{
      "category": "Error category name (e.g., 'Syntax Error', 'Logic Error', 'Indentation Error')",
      "count": number_of_occurrences,
      "description": "Brief description of this error category",
      "icon": "Use 'X' for critical errors, '!' for warnings, '?' for suggestions",
      "details": [
        {{
          "line": line_number,
          "message": "Specific error message",
          "codeSnippet": "The problematic code",
          "suggestion": "How to fix this specific instance"
        }}
      ]
    }}
  ],
  "corrected_code": "Full corrected version of the code",
  "explanations": [
    "Explanation for first error category",
    "Explanation for second error category"
  ],
  "recommendations": [
    "General recommendation 1",
    "General recommendation 2"
  ]
}}

IMPORTANT RULES:
1. Identify ALL types of errors: syntax errors, logic errors, indentation issues, missing colons, type mismatches, undefined variables, etc.
2. For EACH error instance, provide the exact line number, code snippet, and fix suggestion
3. Group similar errors into categories with accurate counts
4. Provide corrected code that fixes ALL identified issues
5. Explanations should be educational and beginner-friendly
6. Recommendations should focus on best practices and code quality improvements
7. Return ONLY valid JSON, no additional text or markdown
8. If the code has no errors, still provide an empty errors array and suggestions for improvement
"""

    async def analyze_code(self, code: str, language: str) -> str:
        """
        Analyze code using Groq API and return markdown-formatted response.

        Args:
            code: Source code to analyze
            language: Programming language (python, javascript, java, etc.)

        Returns:
            Markdown-formatted string compatible with existing parser
        """
        try:
            # Invoke the chain - returns a dict
            result_dict = await self.chain.ainvoke({
                "code": code,
                "language": language
            })

            print(f"DEBUG: Raw result type: {type(result_dict)}")
            print(f"DEBUG: Raw result keys: {result_dict.keys() if isinstance(result_dict, dict) else 'Not a dict'}")

            # Convert dict to Pydantic model for validation
            result = CodeAnalysisOutput(**result_dict)

            print(f"DEBUG: Successfully parsed to CodeAnalysisOutput")
            print(f"DEBUG: Errors count: {len(result.errors)}")

            # Store structured result for direct access
            self._last_structured_result = result

            # Convert structured output to markdown format
            # This ensures compatibility with existing parser_service.py
            markdown = self._convert_to_markdown(result, language)
            return markdown

        except Exception as e:
            # Fallback to simple error response
            print(f"❌ Groq API Error: {str(e)}")
            import traceback
            traceback.print_exc()
            self._last_structured_result = None
            return self._create_fallback_response(code, language, str(e))

    def get_last_structured_result(self):
        """Get the last structured result directly from Groq"""
        return getattr(self, '_last_structured_result', None)

    def _convert_to_markdown(self, result: CodeAnalysisOutput, language: str) -> str:
        """
        Convert structured output to markdown format.
        This maintains compatibility with the existing parser service.
        """
        # Build errors section
        errors_section = "## Errors\n"
        if result.errors:
            for error_cat in result.errors:
                errors_section += f"**{error_cat.category}**: {error_cat.description}\n"
                if error_cat.details:
                    for detail in error_cat.details:
                        errors_section += f"  - Line {detail.line}: {detail.message}\n"
        else:
            errors_section += "No errors found.\n"

        # Build corrected code section
        corrected_section = f"\n## Corrected Code\n```{language}\n{result.corrected_code}\n```\n"

        # Build explanation section with error type prefixes
        explanation_section = "\n## Explanation\n"
        if result.errors:
            for i, error_cat in enumerate(result.errors):
                # Match explanations to error categories
                if i < len(result.explanations):
                    explanation_section += f"**{error_cat.category}**: {result.explanations[i]}\n\n"
        else:
            for explanation in result.explanations:
                explanation_section += f"{explanation}\n\n"

        # Build recommendations section
        recommendations_section = "\n## Recommendations\n"
        for rec in result.recommendations:
            recommendations_section += f"- {rec}\n"

        # Combine all sections
        markdown = f"{errors_section}{corrected_section}{explanation_section}{recommendations_section}"
        return markdown

    def _create_fallback_response(self, code: str, language: str, error_msg: str) -> str:
        """Create a fallback response when Groq API fails"""
        return f"""## Errors
**API Error**: Failed to analyze code - {error_msg}

## Corrected Code
```{language}
{code}
```

## Explanation
The code analysis service encountered an error. Please check your API key and try again.
"""

    def get_structured_result(self, result: CodeAnalysisOutput) -> Dict:
        """
        Convert structured result to dictionary format for direct API response.
        This bypasses markdown conversion for direct database storage.
        """
        return {
            "errors": [
                {
                    "category": err.category,
                    "count": err.count,
                    "description": err.description,
                    "icon": err.icon,
                    "details": [
                        {
                            "line": d.line,
                            "message": d.message,
                            "codeSnippet": d.codeSnippet,
                            "suggestion": d.suggestion
                        } for d in err.details
                    ]
                } for err in result.errors
            ],
            "corrected_code": result.corrected_code,
            "explanations": result.explanations,
            "recommendations": result.recommendations
        }


# Global instance
_groq_service_instance = None


def get_groq_service() -> GroqAIService:
    """Get singleton Groq AI service instance"""
    global _groq_service_instance
    if _groq_service_instance is None:
        _groq_service_instance = GroqAIService()
    return _groq_service_instance
