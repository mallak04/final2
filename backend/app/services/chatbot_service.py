"""
Chatbot AI Service with LangChain integration for programming assistance.
Uses llama-3.3-versatile model via Groq API with conversation memory.
"""

import os
from typing import List, Dict, Optional
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain.memory import ConversationBufferMemory
from sqlalchemy.orm import Session

from app.models.conversation import Conversation


class ChatbotService:
    """Service for programming-focused chatbot using Groq API with Llama model via LangChain"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Chatbot service with LangChain.

        Args:
            api_key: Groq API key (or from environment variable GROQ_API_KEY)
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY")

        if not self.api_key:
            raise ValueError("GROQ_API_KEY not provided and not found in environment variables")

        # Initialize Groq LLM with Llama 3.3
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=self.api_key,
            temperature=0.7,  # Higher temperature for more creative conversational responses
            max_tokens=2048
        )

        # Create programming-focused system prompt
        self.system_message = SystemMessage(content=self._get_system_prompt())

    def _get_system_prompt(self) -> str:
        """Get the programming-focused system prompt"""
        return """You are ABCode AI, an expert programming assistant specialized in helping developers with code analysis, debugging, and software development.

Your expertise includes:
- Explaining code errors and bugs in detail
- Suggesting code improvements and best practices
- Helping with algorithm design and optimization
- Providing guidance on programming concepts across multiple languages (Python, JavaScript, Java, C++, etc.)
- Debugging assistance and error resolution
- Code refactoring suggestions
- Explaining design patterns and architectural decisions

Guidelines:
1. Always provide clear, concise, and educational explanations
2. When discussing code, use proper formatting with code blocks
3. Break down complex concepts into understandable parts
4. Provide practical examples when relevant
5. Be encouraging and supportive to learners
6. If you don't know something, be honest about it
7. Focus on helping users understand the "why" behind solutions, not just the "how"

You have access to the conversation history, so you can reference previous messages and maintain context throughout the discussion."""

    async def chat(
        self,
        user_id: str,
        message: str,
        db: Session
    ) -> str:
        """
        Process a chat message and return AI response with persistent conversation history.

        Args:
            user_id: ID of the user
            message: User's message
            db: Database session for storing conversation

        Returns:
            AI response string
        """
        try:
            # Load conversation history from database (last 10 messages for context)
            history = db.query(Conversation).filter(
                Conversation.user_id == user_id
            ).order_by(
                Conversation.created_at.desc()
            ).limit(10).all()

            # Reverse to get chronological order
            history = list(reversed(history))

            # Build messages list with system message
            messages = [self.system_message]

            # Add conversation history
            for conv in history:
                if conv.role == "user":
                    messages.append(HumanMessage(content=conv.message))
                elif conv.role == "assistant":
                    messages.append(AIMessage(content=conv.response))

            # Add current user message
            messages.append(HumanMessage(content=message))

            # Get AI response
            response = await self.llm.ainvoke(messages)
            response_text = response.content

            # Store user message in database
            user_conversation = Conversation(
                user_id=user_id,
                message=message,
                response="",  # Empty for user messages
                role="user"
            )
            db.add(user_conversation)

            # Store AI response in database
            ai_conversation = Conversation(
                user_id=user_id,
                message="",  # Empty for AI messages
                response=response_text,
                role="assistant"
            )
            db.add(ai_conversation)
            db.commit()

            return response_text

        except Exception as e:
            print(f"❌ Chatbot Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I encountered an error processing your message. Please try again."

    async def clear_history(self, user_id: str, db: Session) -> bool:
        """
        Clear conversation history for a user.

        Args:
            user_id: ID of the user
            db: Database session

        Returns:
            True if successful
        """
        try:
            db.query(Conversation).filter(
                Conversation.user_id == user_id
            ).delete()
            db.commit()
            return True
        except Exception as e:
            print(f"❌ Error clearing conversation history: {str(e)}")
            db.rollback()
            return False


# Global instance
_chatbot_service_instance = None


def get_chatbot_service() -> ChatbotService:
    """Get singleton Chatbot service instance"""
    global _chatbot_service_instance
    if _chatbot_service_instance is None:
        _chatbot_service_instance = ChatbotService()
    return _chatbot_service_instance
