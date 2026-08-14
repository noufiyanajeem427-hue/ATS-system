def generate_suggestions(weaknesses):

    suggestions = []

    for item in weaknesses:
        suggestions.append(f"Consider learning {item}")

    return suggestions