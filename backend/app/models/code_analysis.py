from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class CodeAnalysis(Base):
    __tablename__ = "code_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)

    # Input data
    code_content = Column(Text, nullable=False)
    language = Column(String(50), nullable=False)

    # AI response data
    ai_raw_response = Column(Text, nullable=True)
    corrected_code = Column(Text, nullable=True)
    errors = Column(JSON, nullable=True)  # Dynamic list of errors
    explanations = Column(JSON, nullable=True)  # List of explanations
    recommendations = Column(Text, nullable=True)

    # Analytics data
    total_errors = Column(Integer, default=0)
    processing_time_ms = Column(Integer, nullable=True)

    # Legacy fields for backward compatibility (deprecated)
    bracket_errors = Column(Integer, default=0)
    comma_errors = Column(Integer, default=0)
    indentation_errors = Column(Integer, default=0)
    case_spelling_errors = Column(Integer, default=0)
    colon_errors = Column(Integer, default=0)
    other_errors = Column(Integer, default=0)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to user
    user = relationship("User", back_populates="analyses")
