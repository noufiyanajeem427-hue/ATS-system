def extract_projects(text):

    projects = []

    lines = text.split("\n")

    project_section = False

    for line in lines:

        line = line.strip()

        if line.upper() == "PROJECTS":
            project_section = True
            continue

        if project_section and line.upper() == "SKILLS":
            break

        if not project_section:
            continue

        if "|" in line:

            title = line.split("|")[0].strip()

            if title:
                projects.append(title)

    return projects