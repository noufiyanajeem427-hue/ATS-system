def analyze_strengths(skills, projects, certifications):

    strengths = []

    if len(skills) >= 10:
        strengths.append("Strong Technical Skill Set")

    if "Python" in skills:
        strengths.append("Python Development")

    if "React" in skills:
        strengths.append("Frontend Development")

    if "MongoDB" in skills:
        strengths.append("Database Knowledge")

    if "Machine Learning" in skills:
        strengths.append("Machine Learning")

    if len(projects) >= 2:
        strengths.append("Good Project Experience")

    if len(certifications) >= 3:
        strengths.append("Continuous Learning")

    return strengths