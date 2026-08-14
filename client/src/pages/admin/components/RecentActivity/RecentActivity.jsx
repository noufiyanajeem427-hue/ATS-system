import { useEffect, useState } from "react";
import axios from "axios";
import "./RecentActivity.css";

import {
  FaUserPlus,
  FaBriefcase,
  FaCheckCircle,
  FaUserTie,
} from "react-icons/fa";

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5001/api/admin/recent-activities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Recent Activities Response:",
        res.data
      );

      setActivities(res.data.activities || []);

    } catch (err) {
      console.error(
        "Recent Activities Error:",
        err
      );

      setActivities([]);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "candidate":
        return <FaUserPlus />;

      case "recruiter":
        return <FaUserTie />;

      case "job":
        return <FaBriefcase />;

      case "interview":
        return <FaCheckCircle />;

      default:
        return <FaBriefcase />;
    }
  };

  return (
    <div className="activity-card">

      <h3>Recent Activity</h3>

      {activities.length > 0 ? (

        activities.map((activity) => (

          <div
            className="activity-item"
            key={activity._id}
          >

            <div className="activity-icon">
              {getIcon(activity.type)}
            </div>

            <div className="activity-content">

              <h4>
                {activity.message}
              </h4>

              <p>
                {activity.createdAt
                  ? new Date(
                      activity.createdAt
                    ).toLocaleString()
                  : ""}
              </p>

            </div>

          </div>

        ))

      ) : (

        <p className="no-activity">
          No recent activities.
        </p>

      )}

    </div>
  );
}

export default RecentActivity;