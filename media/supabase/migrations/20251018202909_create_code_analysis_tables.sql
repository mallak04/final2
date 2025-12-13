/*
  # ABCode Database Schema

  1. New Tables
    - `code_analyses`
      - `id` (uuid, primary key) - Unique identifier for each analysis
      - `user_id` (uuid) - Reference to the user who submitted the code
      - `code_content` (text) - The original code that was analyzed
      - `language` (text) - Programming language of the code
      - `created_at` (timestamptz) - When the analysis was performed
      - `total_errors` (integer) - Total number of errors found
      - `bracket_errors` (integer) - Count of bracket-related errors
      - `comma_errors` (integer) - Count of comma-related errors
      - `indentation_errors` (integer) - Count of indentation errors
      - `case_spelling_errors` (integer) - Count of case/spelling errors
      - `colon_errors` (integer) - Count of missing/wrong colon errors
      - `other_errors` (integer) - Count of other errors
      - `recommendations` (text) - AI-generated recommendations for improvement
      
  2. Security
    - Enable RLS on `code_analyses` table
    - Add policy for authenticated users to insert their own analyses
    - Add policy for authenticated users to view their own analyses
    - Add policy for authenticated users to delete their own analyses

  3. Notes
    - This schema supports storing complete code analysis history
    - Error counts are broken down by category for detailed tracking
    - Timestamps enable progress tracking over time
*/

CREATE TABLE IF NOT EXISTS code_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code_content text NOT NULL,
  language text DEFAULT 'javascript',
  created_at timestamptz DEFAULT now(),
  total_errors integer DEFAULT 0,
  bracket_errors integer DEFAULT 0,
  comma_errors integer DEFAULT 0,
  indentation_errors integer DEFAULT 0,
  case_spelling_errors integer DEFAULT 0,
  colon_errors integer DEFAULT 0,
  other_errors integer DEFAULT 0,
  recommendations text DEFAULT ''
);

ALTER TABLE code_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own code analyses"
  ON code_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own code analyses"
  ON code_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own code analyses"
  ON code_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create an index for faster queries by user_id and created_at
CREATE INDEX IF NOT EXISTS idx_code_analyses_user_created 
  ON code_analyses(user_id, created_at DESC);