import "./InterviewInsights.css";

import {
  FaChartLine,
  FaUsers,
  FaClock,
  FaRobot,
  FaArrowUp,
} from "react-icons/fa";

function InterviewInsights() {

  const insights = [

    {
      title: "Interview Success",
      value: "87%",
      icon: <FaChartLine />,
      color: "blue",
      progress: 87
    },

    {
      title: "Candidate Satisfaction",
      value: "4.8",
      icon: <FaUsers />,
      color: "green",
      progress: 96
    },

    {
      title: "Average Duration",
      value: "42 min",
      icon: <FaClock />,
      color: "orange",
      progress: 70
    },

    {
      title: "AI Confidence",
      value: "94%",
      icon: <FaRobot />,
      color: "purple",
      progress: 94
    }

  ];

  return (

    <div className="insights-wrapper">

      <div className="insights-title">

        <h2>Interview Insights</h2>

        <p>
          AI-powered recruitment analytics and interview performance
        </p>

      </div>

      <div className="insights-grid">

        {insights.map((item,index)=>(

          <div className="insight-card" key={index}>

            <div className={`icon ${item.color}`}>
              {item.icon}
            </div>

            <h3>{item.value}</h3>

            <p>{item.title}</p>

            <div className="progress">

              <div
                className={`progress-fill ${item.color}`}
                style={{width:`${item.progress}%`}}
              ></div>

            </div>

          </div>

        ))}

      </div>

      <div className="ai-summary">

        <div className="summary-left">

          <div className="summary-icon">
            <FaRobot />
          </div>

          <div>

            <h3>AI Recommendation</h3>

            <p>

              Candidate quality has improved by
              <strong> 14%</strong> compared with last month.
              Consider scheduling additional technical interviews
              between 10 AM and 1 PM to increase completion rates.

            </p>

          </div>

        </div>

        <button>

          <FaArrowUp />

          View Report

        </button>

      </div>

    </div>

  );

}

export default InterviewInsights;