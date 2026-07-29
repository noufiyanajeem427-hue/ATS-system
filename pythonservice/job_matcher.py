from skill_extractor import extract_skills

def calculate_match(resume_text, job_description):

    resume_skills = extract_skills(resume_text)
    required_skills = extract_skills(job_description)

    matched = list(set(resume_skills) & set(required_skills))
    missing = list(set(required_skills) - set(resume_skills))

    if len(required_skills) == 0:
        score = 0
    else:
        score = round((len(matched) / len(required_skills)) * 100)

    if score >= 80:
        recommendation = "Excellent Match"
    elif score >= 60:
        recommendation = "Good Match"
    elif score >= 40:
        recommendation = "Average Match"
    else:
        recommendation = "Poor Match"

    return {
        "score": score,
        "recommendation": recommendation,
        "matched_skills": matched,
        "missing_skills": missing,
        "required_skills": required_skills,
        "resume_skills": resume_skills
    }