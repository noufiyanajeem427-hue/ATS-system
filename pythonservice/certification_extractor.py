def extract_certifications(text):

    certifications = []

    lines = text.split("\n")

    certification_section = False

    for line in lines:

        line = line.strip()

        if line.upper() == "CERTIFICATION":
            certification_section = True
            continue

        if not certification_section:
            continue

        if line.startswith("o"):

            line = line[1:].strip()

            if line:
                certifications.append(line)

    return certifications