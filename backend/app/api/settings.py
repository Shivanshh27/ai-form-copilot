from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, AISetting
from app.schemas.schemas import AISettingUpdate, AISettingResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("", response_model=AISettingResponse)
def get_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    setting = db.query(AISetting).filter(AISetting.user_id == current_user.id).first()
    if not setting:
        setting = AISetting(user_id=current_user.id)
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return AISettingResponse.model_validate(setting)

@router.put("", response_model=AISettingResponse)
def update_settings(setting_in: AISettingUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    setting = db.query(AISetting).filter(AISetting.user_id == current_user.id).first()
    if not setting:
        setting = AISetting(user_id=current_user.id)
        db.add(setting)

    for k, v in setting_in.model_dump(exclude_unset=True).items():
        setattr(setting, k, v)

    db.commit()
    db.refresh(setting)
    return AISettingResponse.model_validate(setting)
