export interface User {
  id: number;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Profile {
  id: number;
  user_id?: number;
  title: string;
  is_default: boolean;
  full_name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  company?: string;
  designation?: string;
  experience?: string;
  current_salary?: string;
  expected_salary?: string;
  notice_period?: string;
  college?: string;
  degree?: string;
  branch?: string;
  cgpa?: string;
  graduation_year?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
  resume_url?: string;
  skills: string[];
  projects: Array<{ title: string; description: string; tech?: string }>;
  certifications: Array<{ title: string; issuer?: string; year?: string }>;
  languages: string[];
}

export interface Resume {
  id: number;
  filename: string;
  file_path: string;
  parsed_data: {
    summary?: string;
    skills?: string[];
    projects?: Array<any>;
    experience?: Array<any>;
    education?: Array<any>;
    achievements?: string[];
  };
  uploaded_at: string;
}

export interface CustomAnswer {
  id: number;
  title: string;
  category: string;
  tags: string[];
  content: string;
  created_at?: string;
}

export interface SavedMapping {
  id: number;
  field_identifier: string;
  field_label: string;
  mapped_profile_key: string;
  custom_value?: string;
  usage_count: number;
  updated_at: string;
}

export interface AISetting {
  id?: number;
  openai_api_key?: string;
  claude_api_key?: string;
  gemini_api_key?: string;
  enable_ai_filling: boolean;
  enable_smart_mapping: boolean;
  auto_save_answers: boolean;
  auto_upload_resume: boolean;
}

export interface AnalyticsSummary {
  forms_filled: number;
  fields_filled: number;
  time_saved_minutes: number;
  profiles_count: number;
  resumes_count: number;
  answers_count: number;
  learned_mappings_count: number;
  recent_activity: Array<{
    id: number;
    action: string;
    domain: string;
    fields: number;
    time: string;
  }>;
}
