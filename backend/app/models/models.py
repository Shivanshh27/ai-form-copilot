import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profiles = relationship("Profile", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    answers = relationship("CustomAnswer", back_populates="user", cascade="all, delete-orphan")
    mappings = relationship("SavedMapping", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("AISetting", back_populates="user", uselist=False, cascade="all, delete-orphan")
    logs = relationship("AILog", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False, default="Default Profile") # e.g. Software Engineer, Product Manager
    is_default = Column(Boolean, default=False)

    # Personal Information
    full_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)

    # Address
    street = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    pincode = Column(String, nullable=True)

    # Professional
    company = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    experience = Column(String, nullable=True) # e.g. "3 years"
    current_salary = Column(String, nullable=True)
    expected_salary = Column(String, nullable=True)
    notice_period = Column(String, nullable=True)

    # Education
    college = Column(String, nullable=True)
    degree = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    cgpa = Column(String, nullable=True)
    graduation_year = Column(String, nullable=True)

    # Links
    linkedin = Column(String, nullable=True)
    github = Column(String, nullable=True)
    portfolio = Column(String, nullable=True)
    website = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)

    # Structured lists stored as JSON arrays
    skills = Column(JSON, default=list)        # ["Python", "React", "FastAPI"]
    projects = Column(JSON, default=list)      # [{"title": "", "description": "", "tech": ""}]
    certifications = Column(JSON, default=list)# [{"title": "", "issuer": "", "year": ""}]
    languages = Column(JSON, default=list)     # ["English", "Spanish"]

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profiles")
    resumes = relationship("Resume", back_populates="profile")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    parsed_data = Column(JSON, default=dict) # Extracted skills, projects, experience, achievements
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    profile = relationship("Profile", back_populates="resumes")

class CustomAnswer(Base):
    __tablename__ = "custom_answers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False) # e.g. "Tell me about yourself"
    category = Column(String, default="General") # e.g. Leadership, Behavioral, Technical
    tags = Column(JSON, default=list)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="answers")

class SavedMapping(Base):
    __tablename__ = "saved_mappings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    field_identifier = Column(String, index=True, nullable=False) # field label / id / name / xpath hash
    field_label = Column(String, nullable=False)
    mapped_profile_key = Column(String, nullable=False) # e.g. "github", "expected_salary", or custom answer ID
    custom_value = Column(Text, nullable=True) # User override value
    usage_count = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="mappings")

class AISetting(Base):
    __tablename__ = "ai_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    openai_api_key = Column(String, default="")
    claude_api_key = Column(String, default="")
    gemini_api_key = Column(String, default="")
    enable_ai_filling = Column(Boolean, default=True)
    enable_smart_mapping = Column(Boolean, default=True)
    auto_save_answers = Column(Boolean, default=True)
    auto_upload_resume = Column(Boolean, default=True)

    user = relationship("User", back_populates="settings")

class AILog(Base):
    __tablename__ = "ai_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action_type = Column(String, nullable=False) # "autofill", "smart_match", "generate_answer", "parse_resume"
    domain = Column(String, nullable=True) # e.g. "greenhouse.io", "workday.com"
    fields_filled = Column(Integer, default=0)
    time_saved_seconds = Column(Integer, default=30)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="logs")
