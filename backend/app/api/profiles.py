from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Profile
from app.schemas.schemas import ProfileCreate, ProfileUpdate, ProfileResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/profiles", tags=["Profiles"])

@router.get("", response_model=List[ProfileResponse])
def get_profiles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profiles = db.query(Profile).filter(Profile.user_id == current_user.id).all()
    if not profiles:
        # Auto-create initial default profile if none exists
        default_prof = Profile(
            user_id=current_user.id,
            title="Software Engineer",
            is_default=True,
            full_name=current_user.full_name,
            email=current_user.email,
            skills=["Python", "TypeScript", "React", "FastAPI"],
            experience="3 Years",
            education="B.Tech Computer Science"
        )
        db.add(default_prof)
        db.commit()
        db.refresh(default_prof)
        return [ProfileResponse.model_validate(default_prof)]
    return [ProfileResponse.model_validate(p) for p in profiles]

@router.post("", response_model=ProfileResponse)
def create_profile(profile_in: ProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if profile_in.is_default:
        db.query(Profile).filter(Profile.user_id == current_user.id).update({"is_default": False})

    profile = Profile(
        user_id=current_user.id,
        **profile_in.model_dump()
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return ProfileResponse.model_validate(profile)

@router.get("/{profile_id}", response_model=ProfileResponse)
def get_profile(profile_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id, Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse.model_validate(profile)

@router.put("/{profile_id}", response_model=ProfileResponse)
def update_profile(profile_id: int, profile_in: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id, Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if profile_in.is_default:
        db.query(Profile).filter(Profile.user_id == current_user.id).update({"is_default": False})

    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return ProfileResponse.model_validate(profile)

@router.delete("/{profile_id}")
def delete_profile(profile_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id, Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.delete(profile)
    db.commit()
    return {"message": "Profile deleted successfully"}

@router.post("/{profile_id}/set-default", response_model=ProfileResponse)
def set_default_profile(profile_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Profile).filter(Profile.user_id == current_user.id).update({"is_default": False})
    profile = db.query(Profile).filter(Profile.id == profile_id, Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.is_default = True
    db.commit()
    db.refresh(profile)
    return ProfileResponse.model_validate(profile)
