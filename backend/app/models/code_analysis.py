from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base
import uuid

class CodeAnalysis(Base):
    __tablename__ = "code_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    code_content = Column(Text, nullable=False)
    language = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    total_errors = Column(Integer, default=0)
    bracket_errors = Column(Integer, default=0)
    comma_errors = Column(Integer, default=0)
    indentation_errors = Column(Integer, default=0)
    case_spelling_errors = Column(Integer, default=0)
    colon_errors = Column(Integer, default=0)
    other_errors = Column(Integer, default=0)
    recommendations = Column(Text, nullable=True)
