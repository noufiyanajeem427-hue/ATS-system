import "./QuickActions.css";
import {
  FaPlus,
  FaBriefcase,
  FaUserTie,
  FaBuilding,
  FaChartBar,
} from "react-icons/fa";

function QuickActions() {

  const actions = [
    {
      icon: <FaBriefcase />,
      title: "Add Job",
    },
    {
      icon: <FaUserTie />,
      title: "Add Recruiter",
    },
    {
      icon: <FaBuilding />,
      title: "Add Company",
    },
    {
      icon: <FaChartBar />,
      title: "View Reports",
    },
  ];

  return (

    <div className="quick-actions">

      <h3>Quick Actions</h3>

      <div className="actions-grid">

        {actions.map((action,index)=>(

          <div className="action-card" key={index}>

            <div className="action-icon">
              {action.icon}
            </div>

            <h4>{action.title}</h4>

            <button>

              <FaPlus />

            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default QuickActions;