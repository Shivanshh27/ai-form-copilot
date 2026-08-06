import os
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings # Fallback for Pydantic v1

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Form Copilot Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-ai-form-copilot-key-2026-production-ready")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database configuration (Defaults to SQLite for instant local execution, accepts PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./copilot.db")

    # Default LLM configurations
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    CLAUDE_API_KEY: str = os.getenv("CLAUDE_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings()
