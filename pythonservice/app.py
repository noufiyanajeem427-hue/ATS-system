from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_parser import extract_text
from skill_extractor import extract_skills
from job_matcher import calculate_match
from info_extractor import extract_info
from project_extractor import extract_projects
from certification_extractor import extract_certifications
from experience_extractor import extract_experience
from summary_generator import generate_summary
from strength_analyzer import analyze_strengths
from weakness_analyzer import analyze_weaknesses
from suggestion_generator import generate_suggestions
from question_generator import generate_questions
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/")
def home():
    return jsonify({"message": "Python AI Service is Running"})


@app.route("/upload-resume", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)

    file.save(filepath)

    extracted_text = extract_text(filepath)

    skills = extract_skills(extracted_text)

    candidate = extract_info(extracted_text)

    projects = extract_projects(extracted_text)

    certifications = extract_certifications(extracted_text)\

    experience = extract_experience(extracted_text)

    summary = generate_summary(
    candidate,
    skills,
    projects,
    certifications,
    experience
)

    strengths = analyze_strengths(
    skills,
    projects,
    certifications
)
    weaknesses = analyze_weaknesses(skills)

    suggestions = generate_suggestions(weaknesses)

    questions = generate_questions(skills)

    return jsonify({
        "filename": file.filename,
        "candidate": candidate,
        "experience": experience,
        "skills": skills,
        "projects": projects,
        "certifications": certifications,
        "summary": summary,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions,
        "interview_questions": questions,
        "text": extracted_text
    })

@app.route("/match-resume", methods=["POST"])
def match_resume():

    print("FILES:", request.files)
    print("FORM:", request.form)

    if "resume" not in request.files:
        return jsonify({"error": "Resume missing"}), 400

    job_description = request.form.get("job_description")

    if not job_description:
        return jsonify({"error": "Job description missing"}), 400

    file = request.files["resume"]

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    resume_text = extract_text(filepath)

    result = calculate_match(resume_text, job_description)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5001)