from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Profile, SavedMapping, AISetting, AILog
from app.schemas.schemas import AutofillScanRequest, AutofillScanResponse, AutofillFieldMatch, LongAnswerRequest, LongAnswerResponse
from app.services.matcher_service import calculate_field_score
from app.services.ai_service import AIService
from app.api.deps import get_current_user

router = APIRouter(prefix="/autofill", tags=["Autofill Engine"])

@router.post("/scan", response_model=AutofillScanResponse)
def scan_and_match_form(
    payload: AutofillScanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Select active profile
    if payload.profile_id:
        profile = db.query(Profile).filter(Profile.id == payload.profile_id, Profile.user_id == current_user.id).first()
    else:
        profile = db.query(Profile).filter(Profile.user_id == current_user.id, Profile.is_default == True).first()
        if not profile:
            profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()

    if not profile:
        raise HTTPException(status_code=400, detail="No profile found. Please create a profile in dashboard first.")

    profile_dict = {
        "full_name": profile.full_name,
        "email": profile.email,
        "phone": profile.phone,
        "dob": profile.dob,
        "gender": profile.gender,
        "street": profile.street,
        "city": profile.city,
        "state": profile.state,
        "country": profile.country,
        "pincode": profile.pincode,
        "company": profile.company,
        "designation": profile.designation,
        "experience": profile.experience,
        "current_salary": profile.current_salary,
        "expected_salary": profile.expected_salary,
        "notice_period": profile.notice_period,
        "college": profile.college,
        "degree": profile.degree,
        "branch": profile.branch,
        "cgpa": profile.cgpa,
        "graduation_year": profile.graduation_year,
        "linkedin": profile.linkedin,
        "github": profile.github,
        "portfolio": profile.portfolio,
        "website": profile.website,
        "resume": profile.resume_url,
        "skills": profile.skills
    }

    # Fetch user AI settings
    ai_settings = db.query(AISetting).filter(AISetting.user_id == current_user.id).first()
    openai_key = ai_settings.openai_api_key if ai_settings else None
    ai_service = AIService(openai_api_key=openai_key)

    # Fetch user learned custom mappings
    saved_mappings = db.query(SavedMapping).filter(SavedMapping.user_id == current_user.id).all()
    mappings_map = {m.field_identifier: m for m in saved_mappings}

    matches = []

    for field in payload.fields:
        field_id = field.field_id or field.name or field.xpath or field.css_selector or field.label
        if not field_id:
            continue

        # Step 1: Check saved user custom corrections / mappings
        if field_id in mappings_map:
            mapping = mappings_map[field_id]
            val = mapping.custom_value or profile_dict.get(mapping.mapped_profile_key, "")
            if val:
                matches.append(AutofillFieldMatch(
                    field_id=field_id,
                    css_selector=field.css_selector or f"#{field_id}",
                    matched_key=mapping.mapped_profile_key,
                    matched_value=str(val),
                    confidence_score=1.0,
                    is_ai_generated=False
                ))
                continue

        # Step 2: Check Rule-based scoring engine
        field_info = field.model_dump()
        best_key, score, value = calculate_field_score(field_info, profile_dict)

        if best_key and score >= 0.65 and value:
            matches.append(AutofillFieldMatch(
                field_id=field_id,
                css_selector=field.css_selector or f"[name='{field.name}']" or f"#{field.field_id}",
                matched_key=best_key,
                matched_value=value,
                confidence_score=score,
                is_ai_generated=False
            ))
            continue

        # Step 3: Handle long application questions (textarea)
        if field.tag_name == "textarea" or len(field.label) > 30 or any(w in field.label.lower() for w in ["why", "describe", "explain", "motivation", "achievement", "goals"]):
            generated = ai_service.generate_long_answer(field.label or field.placeholder or "Application Question", profile_dict)
            matches.append(AutofillFieldMatch(
                field_id=field_id,
                css_selector=field.css_selector or f"textarea",
                matched_key="ai_long_answer",
                matched_value=generated,
                confidence_score=0.90,
                is_ai_generated=True
            ))
            continue

        # Step 4: AI Smart Semantic Fallback if enabled
        if ai_settings and ai_settings.enable_smart_mapping and openai_key:
            ai_matched_key = ai_service.smart_match_field(field_info, list(profile_dict.keys()))
            if ai_matched_key and profile_dict.get(ai_matched_key):
                matches.append(AutofillFieldMatch(
                    field_id=field_id,
                    css_selector=field.css_selector or f"#{field.field_id}",
                    matched_key=ai_matched_key,
                    matched_value=str(profile_dict[ai_matched_key]),
                    confidence_score=0.85,
                    is_ai_generated=True
                ))

    # Log action for analytics
    domain = payload.page_url.split('/')[2] if payload.page_url and '/' in payload.page_url else "webform"
    log = AILog(
        user_id=current_user.id,
        action_type="autofill",
        domain=domain,
        fields_filled=len(matches),
        time_saved_seconds=len(matches) * 15
    )
    db.add(log)
    db.commit()

    return AutofillScanResponse(
        matches=matches,
        total_fields=len(payload.fields),
        matched_fields_count=len(matches)
    )

@router.post("/generate-answer", response_model=LongAnswerResponse)
def generate_custom_answer(
    payload: LongAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.profile_id:
        profile = db.query(Profile).filter(Profile.id == payload.profile_id, Profile.user_id == current_user.id).first()
    else:
        profile = db.query(Profile).filter(Profile.user_id == current_user.id, Profile.is_default == True).first()

    profile_dict = {}
    if profile:
        profile_dict = {
            "full_name": profile.full_name,
            "designation": profile.designation,
            "company": profile.company,
            "skills": profile.skills,
            "experience": profile.experience,
            "degree": profile.degree,
            "branch": profile.branch,
            "college": profile.college
        }

    ai_settings = db.query(AISetting).filter(AISetting.user_id == current_user.id).first()
    openai_key = ai_settings.openai_api_key if ai_settings else None

    ai_service = AIService(openai_api_key=openai_key)
    answer = ai_service.generate_long_answer(
        question=payload.question,
        profile_data=profile_dict,
        max_words=payload.max_words or 150,
        tone=payload.tone or "Professional"
    )

    return LongAnswerResponse(generated_answer=answer, question=payload.question)
