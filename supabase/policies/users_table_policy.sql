-- Enable RLS on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for deleting users
CREATE POLICY "Enable delete for authenticated users" ON "public"."users"
FOR DELETE USING (
  auth.role() = 'authenticated'
);

-- Policy for viewing users
CREATE POLICY "Enable read access for authenticated users" ON "public"."users"
FOR SELECT USING (
  auth.role() = 'authenticated'
);