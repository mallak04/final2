-- Migration to rename reversed_word_errors column to other_errors
-- Run this in pgAdmin or via psql

ALTER TABLE code_analyses
RENAME COLUMN reversed_word_errors TO other_errors;

-- Verify the change
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'code_analyses'
ORDER BY ordinal_position;
