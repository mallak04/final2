from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.database import engine, Base
from app.routes import analysis, auth, ai, chatbot

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Code Analysis API",
    description="API for AI-powered code analysis and learning progress tracking",
    version="2.0.0"
)

# CORS middleware - Allow VSCode webview origins
# VSCode webviews use vscode-webview:// protocol, so we need to allow all origins
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# For development, allow all origins (includes VSCode webviews)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for VSCode webview compatibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)  # Authentication routes
app.include_router(ai.router)  # AI analysis routes
app.include_router(analysis.router)  # Analysis data & statistics routes
app.include_router(chatbot.router)  # Chatbot routes

@app.get("/")
def read_root():
    return {
        "message": "Code Analysis API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
