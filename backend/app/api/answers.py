from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, CustomAnswer
from app.schemas.schemas import CustomAnswerCreate, CustomAnswerUpdate, CustomAnswerResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/answers", tags=["Custom AI Answers"])

DEFAULT_ANSWERS = [
    {
        "title": "Tell us about yourself",
        "category": "Behavioral",
        "tags": ["introduction", "overview"],
        "content": "I am a dedicated software engineer with strong expertise in full-stack development, modern APIs, and high-performance user interfaces. I excel in collaborative engineering teams and love crafting production-ready features that deliver high user impact."
    },
    {
        "title": "Greatest achievement",
        "category": "Accomplishment",
        "tags": ["projects", "impact"],
        "content": "Architected and launched an end-to-end web system that optimized workflow execution time by over 40%, serving hundreds of active users with 99.9% uptime."
    },
    {
        "title": "Why should we hire you",
        "category": "Value Proposition",
        "tags": ["skills", "fit"],
        "content": "I bring a strong problem-solving mindset, rapid prototyping capability, and deep technical proficiency in React, FastAPI, and scalable system design. I take complete ownership of deliverables from design to deployment."
    }
]

@router.get("", response_model=List[CustomAnswerResponse])
def get_answers(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    answers = db.query(CustomAnswer).filter(CustomAnswer.user_id == current_user.id).all()
    if not answers:
        # Populate default starter answers
        for item in DEFAULT_ANSWERS:
            ans = CustomAnswer(user_id=current_user.id, **item)
            db.add(ans)
        db.commit()
        answers = db.query(CustomAnswer).filter(CustomAnswer.user_id == current_user.id).all()
    return [CustomAnswerResponse.model_validate(a) for a in answers]

@router.post("", response_model=CustomAnswerResponse)
def create_answer(answer_in: CustomAnswerCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ans = CustomAnswer(user_id=current_user.id, **answer_in.model_dump())
    db.add(ans)
    db.commit()
    db.refresh(ans)
    return CustomAnswerResponse.model_validate(ans)

@router.put("/{answer_id}", response_model=CustomAnswerResponse)
def update_answer(answer_id: int, answer_in: CustomAnswerUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ans = db.query(CustomAnswer).filter(CustomAnswer.id == answer_id, CustomAnswer.user_id == current_user.id).first()
    if not ans:
        raise HTTPException(status_code=404, detail="Answer not found")
    for k, v in answer_in.model_dump(exclude_unset=True).items():
        setattr(ans, k, v)
    db.commit()
    db.refresh(ans)
    return CustomAnswerResponse.model_validate(ans)

@router.delete("/{answer_id}")
def delete_answer(answer_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ans = db.query(CustomAnswer).filter(CustomAnswer.id == answer_id, CustomAnswer.user_id == current_user.id).first()
    if not ans:
        raise HTTPException(status_code=404, detail="Answer not found")
    db.delete(ans)
    db.commit()
    return {"message": "Answer deleted"}
