export type Applicant = {
  id: number
  created_at: string
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  position_applied: string | null
  second_choice_position: string | null
  applicant_type: string | null
  status: string | null
  notes: string | null
  contact_number: string | null
  active_cellphone: string | null
  email: string | null
  date_applied: string | null
  preferred_branch: string | null
  country_applying_for: string | null
  current_address: string | null
  provincial_address: string | null
  date_of_birth: string | null
  age: number | null
  place_of_birth: string | null
  religion: string | null
  civil_status: string | null
  gender: string | null
  height_cm: string | null
  weight_kg: string | null
  work_experiences: WorkExperience[] | null
  facebook_account?: string | null
  mother_full_name?: string | null
  mother_contact?: string | null
  father_full_name?: string | null
  father_contact?: string | null
  spouse_name?: string | null
  spouse_age?: number | null
  spouse_contact?: string | null
  number_of_children?: number | null
  children_ages?: string | null
  children_caretaker?: string | null
  emergency_contact_name?: string | null
  emergency_contact_relationship?: string | null
  emergency_contact_number?: string | null
  emergency_contact_address?: string | null
  beneficiary1_name?: string | null
  beneficiary1_dob?: string | null
  beneficiary1_age?: number | null
  beneficiary1_relationship?: string | null
  beneficiary1_contact?: string | null
  beneficiary2_name?: string | null
  beneficiary2_dob?: string | null
  beneficiary2_age?: number | null
  beneficiary2_relationship?: string | null
  beneficiary2_contact?: string | null
  elementary_school?: string | null
  elementary_address?: string | null
  elementary_year_graduated?: string | null
  high_school?: string | null
  high_school_address?: string | null
  high_school_year_graduated?: string | null
  vocational_course?: string | null
  vocational_school?: string | null
  vocational_year_graduated?: string | null
  college_course?: string | null
  college_school?: string | null
  college_year_graduated?: string | null
  english_level?: string | null
  arabic_level?: string | null
  passport_number?: string | null
  passport_date_issued?: string | null
  passport_date_expired?: string | null
  passport_place_issued?: string | null
  interview_remarks?: string | null
  interviewer_name?: string | null
  date_interviewed?: string | null
  years_of_exp?: number | null
  skills?: string | null
}

export type WorkExperience = {
  country?: string
  company?: string
  position?: string
  date_started?: string
  date_ended?: string
}

export type Employee = {
  id: number
  employee_number: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  position: string | null
  department: string | null
  employment_status: string | null
  employment_type: string | null
  contact_number: string | null
  email: string | null
  date_hired: string | null
  date_of_birth: string | null
  gender: string | null
  civil_status: string | null
  current_address: string | null
  auth_user_id: string | null
  sss_number: string | null
  philhealth_number: string | null
  pagibig_number: string | null
  tin_number: string | null
  basic_salary: string | null
  allowances: string | null
  emergency_contact_name: string | null
  emergency_contact_relationship: string | null
  emergency_contact_number: string | null
  contract_start_date: string | null
  contract_end_date: string | null
  notes: string | null
}

export type JobOrder = {
  id: number
  created_at: string
  company: string | null
  country: string | null
  job_title: string | null
  no_workers: number | null
  status: string | null
}

export type MonitoringRecord = {
  id: number
  applicant_id: number
  job_order_id: number
  deployment_status: string | null
  deployment_date: string | null
  concern_status: string | null
  expected_return_date: string | null
  applicant?: Pick<Applicant, "id" | "first_name" | "last_name">
  jobOrder?: Pick<JobOrder, "id" | "job_title" | "country">
}
