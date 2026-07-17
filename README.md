AI-Powered Applicant Tracking System (ATS)
Overview

The AI-Powered Applicant Tracking System (ATS) is a full-stack web application designed to streamline and automate the recruitment process for both recruiters and job seekers. The system provides separate portals for Candidates and HR/Recruiters, allowing candidates to search and apply for jobs while enabling recruiters to efficiently manage job postings, screen applications, schedule interviews, and track the hiring process.

The platform integrates Artificial Intelligence to analyze resumes, extract candidate information, compare resumes with job descriptions, calculate candidate-job matching scores, identify missing skills, and generate hiring recommendations. This helps recruiters reduce manual screening efforts and make faster, data-driven hiring decisions.

Features
Candidate Portal
User Registration & Login
Profile Management
Resume Upload (PDF/DOCX)
Job Search with Filters
Apply for Jobs
Track Application Status
AI Match Score & Skill Analysis
Notifications
Dashboard
HR / Recruiter Portal
Recruiter Registration & Login
Company Profile Management
Create, Edit & Delete Job Posts
View and Manage Applicants
AI-Based Candidate Ranking
Resume Viewer
Schedule Interviews
Send Email Notifications
Reports & Analytics Dashboard
AI Features
Resume Parsing
Skill Extraction
Experience & Education Analysis
Candidate-Job Matching
AI Match Score Generation
Missing Skills Detection
Candidate Recommendations
Tech Stack
Layer	Technologies
Frontend	React.js, React Router, Axios, CSS/Tailwind CSS
Backend	Node.js, Express.js, JWT, bcrypt, Multer, Nodemailer
Database	MongoDB Atlas, Mongoose
AI Service	Python (FastAPI), spaCy, pdfplumber, PyMuPDF
AI Integration	Google Gemini API / OpenAI API
Cloud Storage	AWS S3
Tools	Git, GitHub, Postman, VS Code
Project Architecture
React.js (Frontend)
        │
        ▼
Node.js + Express.js
        │
 ┌──────┼──────────┐
 │      │          │
 ▼      ▼          ▼
MongoDB AWS S3  Python FastAPI
                    │
        Resume Parsing & AI Matching
                    │
          Gemini / OpenAI API
Project Objectives
Simplify the recruitment process.
Automate resume screening using AI.
Improve candidate-job matching.
Reduce recruiter workload.
Provide a modern and user-friendly hiring platform.
Demonstrate a production-ready full-stack application using modern web technologies.
Future Enhancements
Real-time notifications with Socket.IO
Video interview integration
AI-generated interview questions
Resume builder
Advanced analytics dashboard
Multi-company support
Role-based Admin Panel
Dark Mode
Docker deployment
CI/CD pipeline
License

This project is developed for educational and portfolio purposes. It demonstrates modern full-stack web development with AI integration and follows industry-standard architecture and best practices.
