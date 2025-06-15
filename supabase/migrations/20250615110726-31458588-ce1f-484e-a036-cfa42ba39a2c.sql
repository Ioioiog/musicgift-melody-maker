
-- Rename the suno_prompts table to music_prompts for obfuscation
ALTER TABLE public.suno_prompts RENAME TO music_prompts;

-- Update any indexes that reference the old table name
-- (This will automatically rename indexes that were created with the table)

-- Update any existing RLS policies if they exist
-- (Policies are automatically transferred with the table rename)
