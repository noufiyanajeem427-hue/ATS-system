def analyze_weaknesses(skills):

    weaknesses = []

    required = [
        "Docker",
        "AWS",
        "Kubernetes",
        "CI/CD",
        "Testing"
    ]

    for skill in required:
        if skill not in skills:
            weaknesses.append(skill)

    return weaknesses