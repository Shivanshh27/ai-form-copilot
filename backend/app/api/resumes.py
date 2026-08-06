import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Resume, Profile, AISetting
from app.schemas.schemas import ResumeResponse
from app.services.ai_service import AIService
from app.api.deps import get_current_user

router = APIRouter(prefix="/resumes", tags=["Resumes"])

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    profile_id: Optional[int] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported")

    content = await file.read()
    file_id = str(uuid.uuid4())
    saved_filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    ai_settings = db.query(AISetting).filter(AISetting.user_id == current_user.id).first()
    openai_key = ai_settings.openai_api_key if ai_settings else None

    ai_service = AIService(openai_api_key=openai_key)
    parsed_data = ai_service.parse_pdf_resume(content)

    resume = Resume(
        user_id=current_user.id,
        profile_id=profile_id,
        filename=file.filename,
        file_path=file_path,
        parsed_data=parsed_data
    )
    db.add(resume)

    # Sync skills & projects into targeted profile if requested
    if profile_id:
        profile = db.query(Profile).filter(Profile.id == profile_id, Profile.user_id == current_user.id).first()
        if profile:
            extracted_skills = parsed_data.get("skills", [])
            existing_skills = profile.skills or []
            combined_skills = list(set(existing_skills + extracted_skills))
            profile.skills = combined_skills
            profile.resume_url = file_path

    db.commit()
    db.refresh(resume)
    return ResumeResponse.model_validate(resume)

@router.get("", response_model=List[ResumeResponse])
def get_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return [ResumeResponse.model_validate(r) for r in resumes]

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return ResumeResponse.model_validate(resume)
