from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, SavedMapping
from app.schemas.schemas import SavedMappingCreate, SavedMappingResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/mappings", tags=["Saved Mappings"])

@router.get("", response_model=List[SavedMappingResponse])
def get_mappings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mappings = db.query(SavedMapping).filter(SavedMapping.user_id == current_user.id).all()
    return [SavedMappingResponse.model_validate(m) for m in mappings]

@router.post("", response_model=SavedMappingResponse)
def save_mapping(mapping_in: SavedMappingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(SavedMapping).filter(
        SavedMapping.user_id == current_user.id,
        SavedMapping.field_identifier == mapping_in.field_identifier
    ).first()

    if existing:
        existing.field_label = mapping_in.field_label
        existing.mapped_profile_key = mapping_in.mapped_profile_key
        existing.custom_value = mapping_in.custom_value
        existing.usage_count += 1
        db.commit()
        db.refresh(existing)
        return SavedMappingResponse.model_validate(existing)

    mapping = SavedMapping(user_id=current_user.id, **mapping_in.model_dump())
    db.add(mapping)
    db.commit()
    db.refresh(mapping)
    return SavedMappingResponse.model_validate(mapping)

@router.delete("/{mapping_id}")
def delete_mapping(mapping_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mapping = db.query(SavedMapping).filter(SavedMapping.id == mapping_id, SavedMapping.user_id == current_user.id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")
    db.delete(mapping)
    db.commit()
    return {"message": "Mapping deleted"}
