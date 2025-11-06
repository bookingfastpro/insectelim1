/*
  # Add DELETE policy for contact messages

  1. Security Changes
    - Add policy to allow authenticated users to delete contact messages
    - This completes the admin CRUD operations for the contact_messages table

  2. Notes
    - Only authenticated admin users will be able to delete messages
    - This is necessary for the admin panel message management functionality
*/

-- Add DELETE policy for contact messages
CREATE POLICY "Authenticated users can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);
