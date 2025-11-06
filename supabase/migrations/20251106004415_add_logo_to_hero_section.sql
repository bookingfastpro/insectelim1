/*
  # Add logo URL to hero section settings

  1. Changes
    - Update hero_section setting to include logo_url field
    - This allows admin to upload and change the hero logo from the admin panel

  2. Notes
    - Uses JSONB to store logo_url alongside existing title and subtitle
    - Default value is empty string (can be updated from admin panel)
*/

-- Update the hero_section setting to include logo_url
UPDATE site_settings 
SET value = value || '{"logo_url": ""}'::jsonb
WHERE key = 'hero_section' 
AND NOT (value ? 'logo_url');