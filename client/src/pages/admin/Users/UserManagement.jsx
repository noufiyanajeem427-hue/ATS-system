import "./UserManagement.css";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

function UserManagement() {

  const users = [
    {
      name: "Noufiya Najeem",
      email: "noufiya@gmail.com",
      role: "Candidate",
      status: "Active",
    },
    {
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      role: "Recruiter",
      status: "Active",
    },
    {
      name: "John Mathew",
      email: "john@gmail.com",
      role: "Candidate",
      status: "Blocked",
    },
  ];

  return (

    <div className="user-management">

      <div className="page-header">

        <h1>User Management</h1>

      </div>

      <div className="toolbar">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search users..."
          />

        </div>

        <select>

          <option>All Roles</option>

          <option>Candidate</option>

          <option>Recruiter</option>

        </select>

        <button className="add-btn">

          + Add User

        </button>

      </div>

      <table>

        <thead>

          <tr>

            <th>Name</th>

            <th>Email</th>

            <th>Role</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user,index)=>(

            <tr key={index}>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>

                <span
                  className={
                    user.status==="Active"
                    ? "badge active"
                    : "badge blocked"
                  }
                >
                  {user.status}
                </span>

              </td>

              <td>

                <button className="icon-btn">

                  <FaEdit />

                </button>

                <button className="icon-btn delete">

                  <FaTrash />

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default UserManagement;