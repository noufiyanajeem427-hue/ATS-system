import "./AIInsights.css";

import {
  FaBrain,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

function AIInsights() {

  return (

    <div className="ai-card">

      <div className="ai-header">

        <div className="ai-icon">
          <FaBrain />
        </div>

        <div>
          <h2>AI Candidate Analysis</h2>
          <p>AI-powered evaluation summary</p>
        </div>

      </div>

      <div className="score-circle">

        <span>95%</span>

        <small>Match Score</small>

      </div>

      <div className="analysis">

        <div className="analysis-row">

          <span>Technical Skills</span>

          <strong>96%</strong>

        </div>

        <div className="progress">
          <div style={{width:"96%"}}></div>
        </div>

        <div className="analysis-row">

          <span>Communication</span>

          <strong>90%</strong>

        </div>

        <div className="progress">
          <div style={{width:"90%"}}></div>
        </div>

        <div className="analysis-row">

          <span>Experience Match</span>

          <strong>87%</strong>

        </div>

        <div className="progress">
          <div style={{width:"87%"}}></div>
        </div>

      </div>

      <div className="recommendation">

        <FaCheckCircle />

        <div>

          <h4>AI Recommendation</h4>

          <p>
            Highly recommended for Technical Interview.
          </p>

        </div>

      </div>

    </div>

  );

}

export default AIInsights;