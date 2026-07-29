import "./ProfessionalInfo.css";

import {
  FaBriefcase,
  FaGraduationCap,
  FaClock,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaTools,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";

function ProfessionalInfo() {

  const info = [
    {
      icon: <FaBriefcase />,
      label: "Applied Position",
      value: "Python Developer",
    },
    {
      icon: <FaBuilding />,
      label: "Department",
      value: "Software Development",
    },
    {
      icon: <FaGraduationCap />,
      label: "Education",
      value: "Master of Computer Applications (MCA)",
    },
    {
      icon: <FaClock />,
      label: "Experience",
      value: "Fresher",
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Expected Salary",
      value: "₹4.5 LPA",
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Preferred Location",
      value: "Kochi / Remote",
    },
    {
      icon: <FaCheckCircle />,
      label: "Notice Period",
      value: "Immediate",
    },
    {
      icon: <FaTools />,
      label: "Primary Skills",
      value: "Python, Django, React",
    },
  ];

  return (
    <div className="professional-card">

      <div className="section-header">

        <h2>Professional Information</h2>

        <p>
          Job-related profile details
        </p>

      </div>

      <div className="professional-grid">

        {info.map((item, index) => (

          <div
            className="professional-item"
            key={index}
          >

            <div className="professional-icon">
              {item.icon}
            </div>

            <div>

              <span>{item.label}</span>

              <h4>{item.value}</h4>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ProfessionalInfo;