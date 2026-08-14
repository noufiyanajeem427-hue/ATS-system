import "./RecentUsers.css";
import { useEffect, useState } from "react";
import axios from "axios";

function RecentUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchRecentUsers();
  }, []);

  const fetchRecentUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5001/api/admin/recent-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Recent Users Response:", res.data);

      // IMPORTANT
      setUsers(res.data.users || []);

    } catch (err) {
      console.error("Recent Users Error:", err);
      setUsers([]);
    }
  };

  return (
    <div className="recent-users">

      <div className="recent-header">
        <h3>Recent Users</h3>
      </div>

      {users.length > 0 ? (
        users.map((user) => (
          <div
            className="recent-user"
            key={user._id}
          >

            <div className="avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.role}</p>
            </div>

            <span>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : ""}
            </span>

          </div>
        ))
      ) : (
        <p>No recent users.</p>
      )}

    </div>
  );
}

export default RecentUsers;