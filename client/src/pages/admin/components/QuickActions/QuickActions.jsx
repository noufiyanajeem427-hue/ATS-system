import "./QuickActions.css";

import {
  FaPlus,
  FaBriefcase,
  FaUserTie,
  FaChartLine,
  FaChartBar,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function QuickActions() {

  const navigate = useNavigate();

  const actions = [
    {
      icon: <FaBriefcase />,
      title: "Add Job",
      action: () => navigate("/admin/jobs/add"),
    },
    {
      icon: <FaUserTie />,
      title: "Add Recruiter",
      action: () => navigate("/admin/recruiters/add"),
    },
    {
      icon: <FaChartLine />,
      title: "view analytics",
      action: () => navigate("/admin/analytics"),
    },
    {
      icon: <FaChartBar />,
      title: "View Reports",
      action: () => navigate("/admin/reports"),
    },
  ];

  return (
    <div className="quick-actions">

      <h3>Quick Actions</h3>

      <div className="actions-grid">

        {actions.map((action, index) => (

          <div
            className="action-card"
            key={index}
          >

            <div className="action-icon">
              {action.icon}
            </div>

            <h4>{action.title}</h4>

            <button onClick={action.action}>
              <FaPlus />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default QuickActions;