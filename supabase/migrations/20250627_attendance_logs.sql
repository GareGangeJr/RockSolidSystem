create table if not exists attendance_logs (
  id bigint generated always as identity primary key,
  employee_id bigint not null references employees(id) on delete cascade,
  log_type text not null check (log_type in ('time_in', 'time_out')),
  logged_at timestamptz not null default now()
);

create index if not exists attendance_logs_employee_id_idx on attendance_logs (employee_id);
create index if not exists attendance_logs_logged_at_idx on attendance_logs (logged_at desc);

alter table attendance_logs enable row level security;

create policy "attendance_select_authenticated"
  on attendance_logs for select
  to authenticated
  using (true);
