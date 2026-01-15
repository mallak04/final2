"""
AI Service for code analysis.
Currently uses mock responses for development.
Replace with actual AI API calls when model is ready.
"""

import asyncio
import random
from typing import Dict, Optional


class AIService:
    """Service for interacting with AI code analysis model"""

    def __init__(self, api_endpoint: Optional[str] = None, api_key: Optional[str] = None):
        self.api_endpoint = api_endpoint
        self.api_key = api_key
        self.is_mock = api_endpoint is None

    async def analyze_code(self, code: str, language: str) -> str:
        """
        Analyze code and return AI-generated markdown response.

        Args:
            code: Source code to analyze
            language: Programming language (python, javascript, java, etc.)

        Returns:
            Markdown-formatted string with errors, corrected code, and explanations
        """
        if self.is_mock:
            return await self._mock_analysis(code, language)
        else:
            return await self._real_analysis(code, language)

    async def _mock_analysis(self, code: str, language: str) -> str:
        """
        Mock AI response for development and testing.
        Simulates realistic analysis with various error types.
        """
        # Simulate processing time
        await asyncio.sleep(random.uniform(0.5, 1.5))

        # Detect some common patterns for realistic mock
        has_indentation_issue = "    " not in code and "\t" not in code and "\n" in code
        has_syntax_error = language == "python" and (";" in code or "print " in code)
        has_undefined_var = "=" in code

        errors_section = "## Errors\n"
        explanations_section = "## Explanation\n"

        # Generate dynamic errors based on code analysis
        error_count = 0

        if has_indentation_issue and len(code.split('\n')) > 1:
            error_count += 1
            errors_section += "**Indentation Error**: Code blocks are not properly indented.\n"
            explanations_section += f"**Indentation Error**: In {language}, code blocks must be consistently indented. Use 4 spaces or 1 tab per indentation level.\n"

        if has_syntax_error:
            error_count += 1
            errors_section += "**Syntax Error**: Python uses print() as a function, not a statement. Also, semicolons are not needed.\n"
            explanations_section += "**Syntax Error**: In Python 3, print is a function and requires parentheses. Unlike languages like JavaScript or C, Python doesn't use semicolons to end statements.\n"

        if has_undefined_var and random.random() > 0.5:
            error_count += 1
            errors_section += "**Undefined Variable**: Variable used before assignment.\n"
            explanations_section += "**Undefined Variable**: Always initialize variables before using them. This prevents runtime errors and makes your code more predictable.\n"

        # Add random additional errors for variety
        additional_errors = [
            {
                "name": "Type Mismatch",
                "desc": "Attempting to perform operation on incompatible types.",
                "expl": "Ensure that operations are performed between compatible data types. Use type conversion functions when necessary."
            },
            {
                "name": "Missing Return Statement",
                "desc": "Function should return a value but doesn't.",
                "expl": "Functions that are meant to return values should always have a return statement in all code paths."
            },
            {
                "name": "Logic Error",
                "desc": "The loop condition may cause infinite loop or skip iterations.",
                "expl": "Review loop conditions to ensure they terminate properly and iterate over the correct range."
            },
            {
                "name": "Unused Variable",
                "desc": "Variable declared but never used in the code.",
                "expl": "Remove unused variables to keep code clean and maintain better performance."
            },
            {
                "name": "Missing Colon",
                "desc": "Control structure missing colon at the end.",
                "expl": "In Python, control structures like if, for, while, and function definitions require a colon at the end of the declaration line."
            },
            {
                "name": "Incorrect Operator",
                "desc": "Using assignment operator (=) instead of comparison (==).",
                "expl": "The = operator assigns values, while == compares them. Use the correct operator based on your intention."
            }
        ]

        # Randomly add 1-3 additional errors
        num_additional = min(random.randint(1, 3), len(additional_errors))
        selected_errors = random.sample(additional_errors, num_additional)

        for err in selected_errors:
            error_count += 1
            errors_section += f"**{err['name']}**: {err['desc']}\n"
            explanations_section += f"**{err['name']}**: {err['expl']}\n"

        # If no errors detected, create a minimal response
        if error_count == 0:
            errors_section += "**Best Practices**: Consider adding more comments for better code documentation.\n"
            explanations_section += "**Best Practices**: Well-documented code is easier to maintain and understand by other developers.\n"

        # Generate corrected code (simplified version)
        corrected_code = self._generate_corrected_code(code, language)

        # Combine all sections
        response = f"""{errors_section}
## Corrected Code
```{language}
{corrected_code}
```

{explanations_section}
"""
        return response

    def _generate_corrected_code(self, code: str, language: str) -> str:
        """Generate a corrected version of the code"""
        corrected = code

        # Simple corrections for demo purposes
        if language == "python":
            # Fix print statement
            corrected = corrected.replace("print ", "print(").replace("\n", ")\n", 1)

            # Add basic indentation if missing
            lines = corrected.split('\n')
            corrected_lines = []
            indent_next = False

            for line in lines:
                stripped = line.strip()
                if indent_next and stripped and not line.startswith('    '):
                    corrected_lines.append('    ' + stripped)
                else:
                    corrected_lines.append(line)

                # Increase indent after control structures
                if stripped.endswith(':'):
                    indent_next = True
                elif stripped and not line.startswith(' '):
                    indent_next = False

            corrected = '\n'.join(corrected_lines)

        return corrected.strip()

    async def _real_analysis(self, code: str, language: str) -> str:
        """
        Call actual AI model API.
        TODO: Implement when AI team provides endpoint.
        """
        import aiohttp

        prompt = f"Explain the error in this {language} code snippet:\n\n{code}"

        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.api_endpoint,
                json={"prompt": prompt},
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=aiohttp.ClientTimeout(total=10)
            ) as response:
                if response.status != 200:
                    raise Exception(f"AI API error: {response.status}")

                result = await response.json()
                return result.get("response", "")


# Global instance
_ai_service_instance = None


def get_ai_service() -> AIService:
    """Get singleton AI service instance"""
    import os
    global _ai_service_instance

    if _ai_service_instance is None:
        # Check if Groq AI should be used
        use_groq = os.getenv("USE_GROQ_AI", "false").lower() == "true"

        if use_groq:
            try:
                from app.services.groq_ai_service import get_groq_service
                print("✓ Using Groq AI Service with Llama 3.3")
                return get_groq_service()
            except Exception as e:
                print(f"⚠ Failed to initialize Groq AI Service: {e}")
                print("→ Falling back to mock AI service")

        # Fallback to mock service
        _ai_service_instance = AIService()

    return _ai_service_instance
