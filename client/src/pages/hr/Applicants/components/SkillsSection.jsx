import "./SkillsSection.css";

function SkillsSection({ skills }) {
  return (
    <div className="info-card">

      <h3>Technical Skills</h3>

      <div className="skills-container">

        {skills.map((skill, index) => (
          <span key={index} className="skill-chip">
            {skill}
          </span>
        ))}

      </div>

    </div>
  );
}

export default SkillsSection;