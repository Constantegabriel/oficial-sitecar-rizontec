
-- Create functions to check and create tables if they don't exist

-- Function to create cars table
CREATE OR REPLACE FUNCTION create_cars_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'cars'
  ) THEN
    -- Create the cars table
    CREATE TABLE public.cars (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      price NUMERIC NOT NULL,
      km INTEGER NOT NULL,
      color TEXT NOT NULL,
      description TEXT,
      images TEXT[],
      featured BOOLEAN DEFAULT false,
      on_sale BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'available',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Set up RLS
    ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow public read access" 
      ON public.cars FOR SELECT 
      USING (true);

    CREATE POLICY "Allow authenticated users full access" 
      ON public.cars 
      USING (auth.role() = 'authenticated');
      
    -- Create index
    CREATE INDEX idx_cars_status ON public.cars(status);
  END IF;
END;
$$;

-- Function to create transactions table
CREATE OR REPLACE FUNCTION create_transactions_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'transactions'
  ) THEN
    -- Create the transactions table
    CREATE TABLE public.transactions (
      id TEXT PRIMARY KEY,
      car_id TEXT REFERENCES public.cars(id),
      type TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      date TIMESTAMPTZ DEFAULT now(),
      notes TEXT
    );

    -- Set up RLS
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow authenticated users full access" 
      ON public.transactions 
      USING (auth.role() = 'authenticated');
      
    -- Create index
    CREATE INDEX idx_transactions_car_id ON public.transactions(car_id);
  END IF;
END;
$$;

-- Create a function to check if both tables exist
CREATE OR REPLACE FUNCTION check_tables_exist()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'cars_exists', EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = 'cars'
    ),
    'transactions_exists', EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = 'transactions'
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
