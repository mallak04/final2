-- Database Schema for Code Analysis Platform
-- PostgreSQL

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS code_analyses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    full_name VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for users table
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Code analyses table with dynamic error storage
CREATE TABLE code_analyses (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Input data
    code_content TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,

    -- AI response data
    ai_raw_response TEXT,
    corrected_code TEXT,
    errors JSON,  -- Dynamic list of errors from AI
    explanations JSON,  -- List of explanations
    recommendations TEXT,

    -- Analytics data
    total_errors INTEGER DEFAULT 0,
    processing_time_ms INTEGER,

    -- Legacy fields (for backward compatibility, deprecated)
    bracket_errors INTEGER DEFAULT 0,
    comma_errors INTEGER DEFAULT 0,
    indentation_errors INTEGER DEFAULT 0,
    case_spelling_errors INTEGER DEFAULT 0,
    colon_errors INTEGER DEFAULT 0,
    other_errors INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for code_analyses table
CREATE INDEX idx_code_analyses_user_id ON code_analyses(user_id);
CREATE INDEX idx_code_analyses_created_at ON code_analyses(created_at);

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user accounts for authentication';
COMMENT ON TABLE code_analyses IS 'Stores code analysis results from AI with dynamic error types';

COMMENT ON COLUMN code_analyses.errors IS 'JSON array of error objects from AI, format: [{"type": "Error Name", "message": "description"}]';
COMMENT ON COLUMN code_analyses.explanations IS 'JSON array of explanations, format: [{"error_type": "Error Name", "explanation": "detailed explanation"}]';
COMMENT ON COLUMN code_analyses.ai_raw_response IS 'Raw markdown response from AI model for debugging';

-- Example data structure for errors JSON:
-- [
--   {"type": "Indentation Error", "message": "Line 2 is not properly indented"},
--   {"type": "Undefined Variable", "message": "Variable 'result' used before assignment"}
-- ]

-- Example data structure for explanations JSON:
-- [
--   {"error_type": "Indentation Error", "explanation": "Python requires consistent indentation..."},
--   {"error_type": "Undefined Variable", "explanation": "Always initialize variables before using them..."}
-- ]
