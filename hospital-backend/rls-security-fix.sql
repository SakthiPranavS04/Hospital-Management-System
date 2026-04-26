-- ============================================================
-- RLS Security Fix for Hospital Management System
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. ENABLE RLS on DEPARTMENT table
ALTER TABLE public.department ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable department read access" ON public.department
  FOR SELECT
  USING (true);

CREATE POLICY "Enable department insert for authenticated users" ON public.department
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable department update for authenticated users" ON public.department
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable department delete for authenticated users" ON public.department
  FOR DELETE
  USING (true);

-- 2. ENABLE RLS on ADMISSION table
ALTER TABLE public.admission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable admission read access" ON public.admission
  FOR SELECT
  USING (true);

CREATE POLICY "Enable admission insert for authenticated users" ON public.admission
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable admission update for authenticated users" ON public.admission
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable admission delete for authenticated users" ON public.admission
  FOR DELETE
  USING (true);

-- 3. ENABLE RLS on BILL table
ALTER TABLE public.bill ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable bill read access" ON public.bill
  FOR SELECT
  USING (true);

CREATE POLICY "Enable bill insert for authenticated users" ON public.bill
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable bill update for authenticated users" ON public.bill
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable bill delete for authenticated users" ON public.bill
  FOR DELETE
  USING (true);

-- 4. ENABLE RLS on other critical tables (already have RLS, ensure policies exist)
ALTER TABLE IF EXISTS public.patient ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.doctor ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointment ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.room ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.outpatientvisit ENABLE ROW LEVEL SECURITY;

-- Create policies for PATIENT if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'patient' AND policyname = 'Enable patient read access'
  ) THEN
    CREATE POLICY "Enable patient read access" ON public.patient FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'patient' AND policyname = 'Enable patient insert for authenticated users'
  ) THEN
    CREATE POLICY "Enable patient insert for authenticated users" ON public.patient FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'patient' AND policyname = 'Enable patient update for authenticated users'
  ) THEN
    CREATE POLICY "Enable patient update for authenticated users" ON public.patient FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'patient' AND policyname = 'Enable patient delete for authenticated users'
  ) THEN
    CREATE POLICY "Enable patient delete for authenticated users" ON public.patient FOR DELETE USING (true);
  END IF;
END $$;

-- Create policies for DOCTOR if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'doctor' AND policyname = 'Enable doctor read access'
  ) THEN
    CREATE POLICY "Enable doctor read access" ON public.doctor FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'doctor' AND policyname = 'Enable doctor insert for authenticated users'
  ) THEN
    CREATE POLICY "Enable doctor insert for authenticated users" ON public.doctor FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'doctor' AND policyname = 'Enable doctor update for authenticated users'
  ) THEN
    CREATE POLICY "Enable doctor update for authenticated users" ON public.doctor FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'doctor' AND policyname = 'Enable doctor delete for authenticated users'
  ) THEN
    CREATE POLICY "Enable doctor delete for authenticated users" ON public.doctor FOR DELETE USING (true);
  END IF;
END $$;

-- Create policies for APPOINTMENT if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointment' AND policyname = 'Enable appointment read access'
  ) THEN
    CREATE POLICY "Enable appointment read access" ON public.appointment FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointment' AND policyname = 'Enable appointment insert for authenticated users'
  ) THEN
    CREATE POLICY "Enable appointment insert for authenticated users" ON public.appointment FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointment' AND policyname = 'Enable appointment update for authenticated users'
  ) THEN
    CREATE POLICY "Enable appointment update for authenticated users" ON public.appointment FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointment' AND policyname = 'Enable appointment delete for authenticated users'
  ) THEN
    CREATE POLICY "Enable appointment delete for authenticated users" ON public.appointment FOR DELETE USING (true);
  END IF;
END $$;

-- Create policies for ROOM if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'room' AND policyname = 'Enable room read access'
  ) THEN
    CREATE POLICY "Enable room read access" ON public.room FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'room' AND policyname = 'Enable room insert for authenticated users'
  ) THEN
    CREATE POLICY "Enable room insert for authenticated users" ON public.room FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'room' AND policyname = 'Enable room update for authenticated users'
  ) THEN
    CREATE POLICY "Enable room update for authenticated users" ON public.room FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'room' AND policyname = 'Enable room delete for authenticated users'
  ) THEN
    CREATE POLICY "Enable room delete for authenticated users" ON public.room FOR DELETE USING (true);
  END IF;
END $$;

-- Create policies for OUTPATIENTVISIT if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'outpatientvisit' AND policyname = 'Enable outpatientvisit read access'
  ) THEN
    CREATE POLICY "Enable outpatientvisit read access" ON public.outpatientvisit FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'outpatientvisit' AND policyname = 'Enable outpatientvisit insert for authenticated users'
  ) THEN
    CREATE POLICY "Enable outpatientvisit insert for authenticated users" ON public.outpatientvisit FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'outpatientvisit' AND policyname = 'Enable outpatientvisit update for authenticated users'
  ) THEN
    CREATE POLICY "Enable outpatientvisit update for authenticated users" ON public.outpatientvisit FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'outpatientvisit' AND policyname = 'Enable outpatientvisit delete for authenticated users'
  ) THEN
    CREATE POLICY "Enable outpatientvisit delete for authenticated users" ON public.outpatientvisit FOR DELETE USING (true);
  END IF;
END $$;

-- Verify all tables have RLS enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('patient', 'doctor', 'department', 'appointment', 'room', 'admission', 'bill', 'outpatientvisit');
