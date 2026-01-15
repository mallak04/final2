"""
Chatbot routes for AI programming assistance.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.utils.dependencies import get_current_user
from app.services.chatbot_service import get_chatbot_service

router = APIRouter(prefix="/api/chat", tags=["chatbot"])


class ChatRequest(BaseModel):
    """Request model for chat message"""
    message: str


class ChatResponse(BaseModel):
    """Response model for chat message"""
    message: str
    response: str


class ConversationMessage(BaseModel):
    """Model for a conversation message in history"""
    id: str
    message: str
    response: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/message", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to the chatbot and get a response.

    Args:
        chat_request: User's message
        current_user: Current authenticated user
        db: Database session

    Returns:
        User message and AI response
    """
    if not chat_request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    try:
        chatbot_service = get_chatbot_service()
        response = await chatbot_service.chat(
            user_id=current_user.id,
            message=chat_request.message,
            db=db
        )

        return ChatResponse(
            message=chat_request.message,
            response=response
        )

    except Exception as e:
        print(f"❌ Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat message"
        )


@router.get("/history", response_model=List[ConversationMessage])
async def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get conversation history for the current user.

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        List of conversation messages
    """
    try:
        conversations = db.query(Conversation).filter(
            Conversation.user_id == current_user.id
        ).order_by(
            Conversation.created_at.asc()
        ).all()

        return conversations

    except Exception as e:
        print(f"❌ Error fetching history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch conversation history"
        )


@router.delete("/history", status_code=status.HTTP_200_OK)
async def clear_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clear conversation history for the current user.

    Args:
        current_user: Current authenticated user
        db: Database session

    Returns:
        Success message
    """
    try:
        chatbot_service = get_chatbot_service()
        success = await chatbot_service.clear_history(
            user_id=current_user.id,
            db=db
        )

        if success:
            return {"message": "Conversation history cleared successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to clear conversation history"
            )

    except Exception as e:
        print(f"❌ Error clearing history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear conversation history"
        )
