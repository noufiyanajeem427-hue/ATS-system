def generate_summary(candidate, skills, projects, certifications, experience):

    name = candidate.get("name", "Candidate")

    education = candidate.get("education", [])

    degree = ""

    if education:
        degree = education[0]["degree"]

    summary = f"{name} "

    if degree:
        summary += f"is a {degree} graduate "

    if experience != "Not Mentioned":
        summary += f"with {experience}. "
    else:
        summary += "with a strong technical background. "

    if skills:
        summary += (
            "Skilled in "
            + ", ".join(skills[:6])
            + ". "
        )

    if projects:
        summary += (
            f"Completed {len(projects)} major project(s), including "
            + ", ".join(projects)
            + ". "
        )

    if certifications:
        summary += (
            f"Holds {len(certifications)} professional certification(s)."
        )

    return summary