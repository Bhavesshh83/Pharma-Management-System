
-- Add indexes for faster user lookup and authentication queries
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_id_email ON public.profiles(id, email);

-- Update the profiles table to have better constraints and performance
ALTER TABLE public.profiles 
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN role SET NOT NULL;

-- Add a unique constraint on email if it doesn't exist
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Create a function for faster profile creation during registration
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_role TEXT DEFAULT 'user',
  p_phone TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, phone, address)
  VALUES (p_user_id, p_email, p_name, p_role, p_phone, p_address);
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Create a function for faster role checking
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = p_user_id LIMIT 1;
$$;
