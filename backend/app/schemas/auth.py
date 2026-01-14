"""
Authentication-related Pydantic schemas.
"""

from pydantic import BaseModel
from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    """Schema for login request"""
    username: str
    password: str


class TokenResponse(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
