import re


def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group() if match else ""


def extract_phone(text):
    match = re.search(r'(\+91[- ]?)?[6-9]\d{9}', text)
    return match.group() if match else ""


def extract_linkedin(text):
    match = re.search(r'(https?://)?(www\.)?linkedin\.com/\S+', text)
    return match.group() if match else ""


def extract_github(text):
    match = re.search(r'(https?://)?(www\.)?github\.com/\S+', text)
    return match.group() if match else ""


def extract_name(text):
    lines = text.split("\n")

    for line in lines:
        line = line.strip()

        if (
            len(line.split()) >= 2
            and len(line.split()) <= 4
            and "resume" not in line.lower()
            and "email" not in line.lower()
            and "phone" not in line.lower()
        ):
            return line

    return ""

def extract_info(text):

    return {
    "name": extract_name(text).title(),
    "email": extract_email(text),
    "phone": extract_phone(text),
    "linkedin": extract_linkedin(text),
    "github": extract_github(text),
    "education": extract_education(text)
}

def extract_education(text):

    education = []

    lines = text.split("\n")

    education_started = False

    for line in lines:

        line = line.strip()

        # Start reading after EDUCATION heading
        if line.upper() == "EDUCATION":
            education_started = True
            continue

        # Stop when PROJECTS section starts
        if education_started and line.upper() == "PROJECTS":
            break

        if not education_started:
            continue

        if "MCA" in line:
            education.append({
                "degree": "MCA",
                "details": line
            })

        elif "BCA" in line:
            education.append({
                "degree": "BCA",
                "details": line
            })

        elif "B.Tech" in line or "BTech" in line:
            education.append({
                "degree": "B.Tech",
                "details": line
            })

        elif "M.Tech" in line or "MTech" in line:
            education.append({
                "degree": "M.Tech",
                "details": line
            })

    return education