/*
  # Fix RLS Policies for site_settings

  1. Changes
    - Drop existing broad policies
    - Create specific policies for SELECT, INSERT, UPDATE, DELETE
    - Ensure authenticated users can read and manage settings
    - Public users can only read settings

  2. Security
    - Authenticated users have full access
    - Public users have read-only access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON site_settings;

-- Allow everyone to view site settings (public access)
CREATE POLICY "Public users can view site settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to view site settings
CREATE POLICY "Authenticated users can view site settings"
  ON site_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert site settings
CREATE POLICY "Authenticated users can insert site settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update site settings
CREATE POLICY "Authenticated users can update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete site settings
CREATE POLICY "Authenticated users can delete site settings"
  ON site_settings
  FOR DELETE
  TO authenticated
  USING (true);
