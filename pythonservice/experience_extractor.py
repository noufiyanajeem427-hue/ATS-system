import re

def extract_experience(text):

    # Detect Fresher
    if re.search(r"\bfresher\b", text, re.IGNORECASE):
        return "Fresher"

    # Detect internship
    if re.search(r"internship|intern", text, re.IGNORECASE):
        return "Internship Experience"

    # Detect experience like:
    # 2 years
    # 3 year
    # 5+ years

    match = re.search(
        r'(\d+)\+?\s*(year|years)',
        text,
        re.IGNORECASE
    )

    if match:
        return match.group()

    return "Not Mentioned"