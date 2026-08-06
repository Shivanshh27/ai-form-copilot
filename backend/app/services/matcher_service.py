import re
from typing import Dict, Any, List, Optional, Tuple

FIELD_KEYWORDS_MAP = {
    "full_name": ["name", "full name", "applicant name", "candidate name", "your name", "first name", "last name", "your_name", "fullname"],
    "email": ["email", "e-mail", "email address", "contact email", "work email", "personal email", "primary email", "mail"],
    "phone": ["phone", "mobile", "contact number", "cell", "telephone", "phone number", "mobile number", "phone_number"],
    "linkedin": ["linkedin", "linkedin profile", "linkedin url", "linkedin link"],
    "github": ["github", "github profile", "github url", "github link"],
    "portfolio": ["portfolio", "website", "personal website", "portfolio url", "personal link"],
    "resume": ["resume", "cv", "curriculum vitae", "upload resume", "attach resume", "file"],
    "college": ["college", "university", "school", "institution", "institute", "college name"],
    "degree": ["degree", "qualification", "highest degree", "bachelor", "master", "education"],
    "branch": ["branch", "major", "field of study", "specialization", "stream", "department"],
    "cgpa": ["cgpa", "gpa", "percentage", "grade", "marks", "score"],
    "graduation_year": ["graduation year", "passing year", "year of passing", "passout year", "grad year", "end year"],
    "company": ["company", "organization", "employer", "current company", "present employer", "company name"],
    "designation": ["designation", "job title", "role", "current role", "title", "position"],
    "experience": ["experience", "years of experience", "total experience", "work experience", "exp"],
    "current_salary": ["current salary", "current ctc", "present salary", "current pay"],
    "expected_salary": ["expected salary", "expected ctc", "desired salary", "expected pay"],
    "notice_period": ["notice period", "notice", "availability", "how soon can you join", "notice days"],
    "street": ["street", "address line", "street address", "residential address", "home address"],
    "city": ["city", "current city", "town", "location"],
    "state": ["state", "province", "region"],
    "country": ["country", "nation"],
    "pincode": ["pincode", "zip", "zip code", "postal code", "pin code"],
    "dob": ["dob", "date of birth", "birth date", "birthday"],
    "gender": ["gender", "sex"],
    "skills": ["skills", "key skills", "technical skills", "tech stack", "technologies"]
}

def clean_text(text: Optional[str]) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s_]', ' ', text)
    return ' '.join(text.split())

def calculate_field_score(field_info: Dict[str, Any], profile_data: Dict[str, Any]) -> Tuple[Optional[str], float, Optional[str]]:
    """
    Evaluates an extracted DOM field against profile keys using weighted confidence scoring.
    Returns (matched_key, confidence_score, matched_value).
    """
    combined_target_text = clean_text(f"{field_info.get('label', '')} {field_info.get('name', '')} {field_info.get('placeholder', '')} {field_info.get('aria_label', '')} {field_info.get('nearby_text', '')}")
    field_id_clean = clean_text(field_info.get('field_id', ''))
    
    best_key = None
    highest_score = 0.0

    for key, keywords in FIELD_KEYWORDS_MAP.items():
        score = 0.0
        for kw in keywords:
            kw_clean = clean_text(kw)
            # Exact word or label match gives top confidence score
            if f" {kw_clean} " in f" {combined_target_text} " or combined_target_text == kw_clean:
                score = max(score, 0.95)
            elif kw_clean in combined_target_text or kw_clean in field_id_clean:
                score = max(score, 0.80)
            elif any(part == kw_clean for part in combined_target_text.split()):
                score = max(score, 0.70)
        
        if score > highest_score:
            highest_score = score
            best_key = key

    if best_key and highest_score >= 0.65:
        value = profile_data.get(best_key)
        if isinstance(value, list):
            value = ", ".join(map(str, value)) if value else ""
        elif value is not None:
            value = str(value)
        else:
            value = ""
            
        if value:
            return best_key, highest_score, value

    return None, highest_score, None
