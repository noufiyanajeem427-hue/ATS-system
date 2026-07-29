import "./ApplicantDetails.css";

import CandidateProfileCard from "./components/CandidateProfileCard";
import AIInsights from "./components/AIInsights";
import TimelineSection from "./components/TimelineSection";
import PersonalInfo from "./components/PersonalInfo";
import ProfessionalInfo from "./components/ProfessionalInfo";
import ProfessionalJourney from "./components/ProfessionalJourney";
import RecruiterNotes from "./components/RecruiterNotes";
import SkillsSection from "./components/SkillsSection";
import ActionButtons from "./components/ActionButtons";

function ApplicantDetails() {

  const applicant = {
    skills: [
      "Python",
      "Django",
      "React",
      "MongoDB",
      "SQL",
      "Git",
      "REST API",
      "HTML",
      "CSS",
      "JavaScript",
    ],
  };

  return (

    <div className="applicant-details">

      <CandidateProfileCard />

      <div className="top-grid">
        <AIInsights />
        <TimelineSection />
      </div>

      <PersonalInfo />

      <ProfessionalInfo />

      <ProfessionalJourney />

      <div className="bottom-grid">

        <SkillsSection skills={applicant.skills} />

        <RecruiterNotes />

      </div>

      <ActionButtons />

    </div>

  );
}

export default ApplicantDetails;