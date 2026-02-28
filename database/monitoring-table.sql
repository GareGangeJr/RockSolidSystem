-- Monitoring table for deployed applicants
-- Run this in your Supabase SQL editor

-- Drop existing table if there are issues
DROP TABLE IF EXISTS monitoring CASCADE;

-- Create monitoring table
CREATE TABLE monitoring (
  id BIGSERIAL PRIMARY KEY,
  applicant_id BIGINT NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  job_order_id BIGINT NOT NULL REFERENCES job_orders(id) ON DELETE CASCADE,
  deployment_status TEXT NOT NULL,
  deployment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  monitoring_notes TEXT,
  last_check_date DATE,
  concerns TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_monitoring_applicant ON monitoring(applicant_id);
CREATE INDEX idx_monitoring_job_order ON monitoring(job_order_id);
CREATE INDEX idx_monitoring_status ON monitoring(deployment_status);

-- Enable Row Level Security (RLS)
ALTER TABLE monitoring ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON monitoring;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON monitoring
  FOR ALL
  USING (true)
  WITH CHECK (true);

