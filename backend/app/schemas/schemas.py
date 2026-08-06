from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Profile Schemas
class ProfileBase(BaseModel):
    title: str = "Default Profile"
    is_default: bool = False
    
    # Personal
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None

    # Address
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None

    # Professional
    company: Optional[str] = None
    designation: Optional[str] = None
    experience: Optional[str] = None
    current_salary: Optional[str] = None
    expected_salary: Optional[str] = None
    notice_period: Optional[str] = None

    # Education
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    cgpa: Optional[str] = None
    graduation_year: Optional[str] = None

    # Links
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    website: Optional[str] = None
    resume_url: Optional[str] = None

    # Lists
    skills: List[str] = []
    projects: List[Dict[str, Any]] = []
    certifications: List[Dict[str, Any]] = []
    languages: List[str] = []

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Resume Schemas
class ResumeResponse(BaseModel):
    id: int
    user_id: int
    profile_id: Optional[int] = None
    filename: str
    file_path: str
    parsed_data: Dict[str, Any]
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Custom Answer Schemas
class CustomAnswerBase(BaseModel):
    title: str
    category: str = "General"
    tags: List[str] = []
    content: str

class CustomAnswerCreate(CustomAnswerBase):
    pass

class CustomAnswerUpdate(CustomAnswerBase):
    pass

class CustomAnswerResponse(CustomAnswerBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Saved Mappings Schemas
class SavedMappingCreate(BaseModel):
    field_identifier: str
    field_label: str
    mapped_profile_key: str
    custom_value: Optional[str] = None

class SavedMappingResponse(BaseModel):
    id: int
    field_identifier: str
    field_label: str
    mapped_profile_key: str
    custom_value: Optional[str] = None
    usage_count: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Settings Schemas
class AISettingBase(BaseModel):
    openai_api_key: Optional[str] = ""
    claude_api_key: Optional[str] = ""
    gemini_api_key: Optional[str] = ""
    enable_ai_filling: bool = True
    enable_smart_mapping: bool = True
    auto_save_answers: bool = True
    auto_upload_resume: bool = True

class AISettingUpdate(AISettingBase):
    pass

class AISettingResponse(AISettingBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Autofill & Form Extraction Request Schemas
class ExtractedField(BaseModel):
    field_id: Optional[str] = ""
    name: Optional[str] = ""
    placeholder: Optional[str] = ""
    aria_label: Optional[str] = ""
    label: str = ""
    parent_label: Optional[str] = ""
    nearby_text: Optional[str] = ""
    input_type: str = "text"
    tag_name: str = "input"
    required: bool = False
    xpath: Optional[str] = ""
    css_selector: Optional[str] = ""

class AutofillScanRequest(BaseModel):
    profile_id: Optional[int] = None
    page_title: Optional[str] = ""
    page_url: Optional[str] = ""
    fields: List[ExtractedField]

class AutofillFieldMatch(BaseModel):
    field_id: str
    css_selector: str
    matched_key: str # e.g. "email", "full_name", "custom_answer_1"
    matched_value: str
    confidence_score: float # 0.0 to 1.0
    is_ai_generated: bool = False

class AutofillScanResponse(BaseModel):
    matches: List[AutofillFieldMatch]
    total_fields: int
    matched_fields_count: int

# Long Answer Generation Request
class LongAnswerRequest(BaseModel):
    profile_id: Optional[int] = None
    question: str
    max_words: Optional[int] = 150
    tone: Optional[str] = "Professional and natural"

class LongAnswerResponse(BaseModel):
    generated_answer: str
    question: str
