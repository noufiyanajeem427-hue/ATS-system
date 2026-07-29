import re

SKILLS = [
    "Python",
    "Java",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "MySQL",
    "HTML",
    "CSS",
    "Bootstrap",
    "Django",
    "Flask",
    "Git",
    "GitHub",
    "REST API",
    "Machine Learning",
    "Data Analysis",
    "Excel",
    "Power BI",
    "Communication",
    "Leadership",
    "Problem Solving"
]


def extract_skills(text):

    skills_found = []

    text = text.lower()

    for skill in SKILLS:
        if re.search(r"\b" + re.escape(skill.lower()) + r"\b", text):
            skills_found.append(skill)

    return skills_found