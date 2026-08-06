import axios from 'axios';
import { Profile, Resume, CustomAnswer, SavedMapping, AISetting, AnalyticsSummary } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('copilot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback initial data in case backend API is connecting
const MOCK_PROFILES: Profile[] = [
  {
    id: 1,
    title: "Software Engineer (Primary)",
    is_default: true,
    full_name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    dob: "1998-05-14",
    gender: "Male",
    street: "742 Evergreen Terrace",
    city: "San Francisco",
    state: "California",
    country: "United States",
    pincode: "94107",
    company: "Apex Tech Labs",
    designation: "Senior Software Engineer",
    experience: "4 Years",
    current_salary: "$140,000 / year",
    expected_salary: "$165,000 / year",
    notice_period: "2 Weeks",
    college: "Stanford University",
    degree: "Bachelor of Science",
    branch: "Computer Science",
    cgpa: "3.85 / 4.0",
    graduation_year: "2021",
    linkedin: "https://linkedin.com/in/alexmorgan-dev",
    github: "https://github.com/alexmorgan-dev",
    portfolio: "https://alexmorgan.dev",
    website: "https://alexmorgan.dev",
    resume_url: "/sample_resume.pdf",
    skills: ["Python", "TypeScript", "React", "FastAPI", "PostgreSQL", "Docker", "AWS", "TailwindCSS"],
    projects: [
      { title: "AI Navigation Engine", description: "Sub-microsecond pathfinding spatial algorithm visualizer", tech: "C++, Node.js" },
      { title: "SleekLink Shortener", description: "Distributed URL shortener with analytics dashboard", tech: "FastAPI, Redis" }
    ],
    certifications: [
      { title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023" }
    ],
    languages: ["English (Native)", "Spanish (Professional)"]
  },
  {
    id: 2,
    title: "Product & Tech Founder",
    is_default: false,
    full_name: "Alex Morgan",
    email: "alex@startupfounder.io",
    phone: "+1 (555) 234-5678",
    company: "Stealth Startup",
    designation: "Co-Founder & CTO",
    experience: "5 Years",
    skills: ["Product Strategy", "System Architecture", "React Native", "AI Prompting"],
    projects: [],
    certifications: [],
    languages: ["English"]
  }
];

export const getProfiles = async (): Promise<Profile[]> => {
  try {
    const res = await apiClient.get('/profiles');
    return res.data;
  } catch (err) {
    return MOCK_PROFILES;
  }
};

export const updateProfile = async (id: number, data: Partial<Profile>): Promise<Profile> => {
  try {
    const res = await apiClient.put(`/profiles/${id}`, data);
    return res.data;
  } catch (err) {
    return { ...MOCK_PROFILES[0], ...data } as Profile;
  }
};

export const createProfile = async (data: Partial<Profile>): Promise<Profile> => {
  try {
    const res = await apiClient.post('/profiles', data);
    return res.data;
  } catch (err) {
    const newProf: Profile = {
      id: Date.now(),
      title: data.title || "New Profile",
      is_default: false,
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      ...data
    };
    return newProf;
  }
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    const res = await apiClient.get('/analytics/summary');
    return res.data;
  } catch (err) {
    return {
      forms_filled: 24,
      fields_filled: 284,
      time_saved_minutes: 71.0,
      profiles_count: 2,
      resumes_count: 1,
      answers_count: 5,
      learned_mappings_count: 8,
      recent_activity: [
        { id: 1, action: "autofill", domain: "greenhouse.io", fields: 16, time: "10 mins ago" },
        { id: 2, action: "autofill", domain: "lever.co", fields: 12, time: "1 hour ago" },
        { id: 3, action: "smart_match", domain: "workday.com", fields: 9, time: "Yesterday" }
      ]
    };
  }
};

export const getAnswers = async (): Promise<CustomAnswer[]> => {
  try {
    const res = await apiClient.get('/answers');
    return res.data;
  } catch (err) {
    return [
      {
        id: 1,
        title: "Tell us about yourself",
        category: "Behavioral",
        tags: ["introduction", "overview"],
        content: "I am a dedicated software engineer with 4+ years of experience building scalable web apps, FastAPI microservices, and modern UI dashboards."
      },
      {
        id: 2,
        title: "Why should we hire you?",
        category: "Value Proposition",
        tags: ["skills", "impact"],
        content: "I combine deep full-stack engineering expertise with rapid execution and clean system design, ensuring fast product iterations with high reliability."
      }
    ];
  }
};

export const getSettings = async (): Promise<AISetting> => {
  try {
    const res = await apiClient.get('/settings');
    return res.data;
  } catch (err) {
    return {
      openai_api_key: "",
      claude_api_key: "",
      gemini_api_key: "",
      enable_ai_filling: true,
      enable_smart_mapping: true,
      auto_save_answers: true,
      auto_upload_resume: true
    };
  }
};

export const updateSettings = async (settings: AISetting): Promise<AISetting> => {
  try {
    const res = await apiClient.put('/settings', settings);
    return res.data;
  } catch (err) {
    return settings;
  }
};
