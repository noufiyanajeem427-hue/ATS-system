import "./PersonalInfo.css";

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaBirthdayCake,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

function PersonalInfo() {

  const info = [
    {
      icon: <FaUser />,
      label: "Full Name",
      value: "Noufiya Najeem",
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: "noufiya@gmail.com",
    },
    {
      icon: <FaPhoneAlt />,
      label: "Phone",
      value: "+91 9876543210",
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Address",
      value: "Kozhikode, Kerala",
    },
    {
      icon: <FaGlobe />,
      label: "Nationality",
      value: "Indian",
    },
    {
      icon: <FaBirthdayCake />,
      label: "Date of Birth",
      value: "15 Jan 2000",
    },
    {
      icon: <FaLinkedin />,
      label: "LinkedIn",
      value: "linkedin.com/in/noufiya",
    },
    {
      icon: <FaGithub />,
      label: "GitHub",
      value: "github.com/noufiya",
    },
  ];

  return (
    <div className="personal-card">

      <div className="section-header">
        <h2>Personal Information</h2>
        <p>Basic contact and profile details</p>
      </div>

      <div className="personal-grid">

        {info.map((item, index) => (

          <div
            className="personal-item"
            key={index}
          >

            <div className="personal-icon">
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

export default PersonalInfo;