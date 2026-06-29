-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

alter table job_orders
  add column if not exists commercial_registration text,
  add column if not exists company_address text,
  add column if not exists company_contact text,
  add column if not exists job_order_date date,
  add column if not exists visa_number text,
  add column if not exists visa_date date,
  add column if not exists visa_category text,
  add column if not exists contract_period text,
  add column if not exists work_site text,
  add column if not exists working_hours text,
  add column if not exists benefits_and_terms text;
