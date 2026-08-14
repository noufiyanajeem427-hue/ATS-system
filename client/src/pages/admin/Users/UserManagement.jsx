import { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

import Header from "../components/Header/Header";
import AdminSidebar from "../components/Sidebar/AdminSidebar";

function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
    isVerified: true,
  });


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5001/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };


  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5001/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (err) {
      console.log("Error deleting user:", err);
    }
  };

  // =========================
  // UPDATE USER
  // =========================
  const updateUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/admin/users/${editingUser._id}`,
        editingUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowModal(false);

      fetchUsers();
    } catch (err) {
      console.log("Error updating user:", err);
    }
  };

  // =========================
  // FILTER USERS
  // =========================
  const filteredUsers = users.filter((user) => {
    const userName = user.name || "";
    const userEmail = user.email || "";
    const userRole = user.role || "";

    const searchMatch =
      userName.toLowerCase().includes(search.toLowerCase()) ||
      userEmail.toLowerCase().includes(search.toLowerCase());

    const roleMatch =
      roleFilter === "All Roles" ||
      userRole.toLowerCase() === roleFilter.toLowerCase();

    return searchMatch && roleMatch;
  });

  return (
    <div className="admin-dashboard">

      {/* =========================
          ADMIN SIDEBAR
      ========================= */}
      <AdminSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="admin-main">

        {/* HEADER */}
        <Header
          openSidebar={() => setSidebarOpen(true)}
        />

        {/* =========================
            USER MANAGEMENT PAGE
        ========================= */}
        <section className="user-management-page">

          {/* PAGE HEADER */}
          <div className="page-header">
            <h1>User Management</h1>

            <p>
              Manage candidates, HR users and administrators.
            </p>
          </div>

          {/* =========================
              TOOLBAR
          ========================= */}
          <div className="toolbar">

            {/* SEARCH */}
            <div className="search-box">
              <FaSearch />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            {/* ROLE FILTER */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All Roles">
                All Roles
              </option>

              <option value="Candidate">
                Candidate
              </option>

              <option value="HR">
                HR
              </option>
            </select>
          </div>
        </div>
          {/* =========================
              USERS TABLE
          ========================= */}
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

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <tr key={user._id}>

                    {/* NAME */}
                    <td>
                      {user.name}
                    </td>

                    {/* EMAIL */}
                    <td>
                      {user.email}
                    </td>

                    {/* ROLE */}
                    <td
                      style={{
                        textTransform: "capitalize",
                      }}
                    >
                      {user.role}
                    </td>

                    {/* STATUS */}
                    <td>

                      <span
                        className={
                          user.isVerified
                            ? "badge active"
                            : "badge blocked"
                        }
                      >
                        {user.isVerified
                          ? "Active"
                          : "Blocked"}
                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td>

                      {/* EDIT */}
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => {
                          setEditingUser({
                            ...user,
                          });

                          setShowModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        className="icon-btn delete"
                        onClick={() =>
                          deleteUser(user._id)
                        }
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="5"
                    className="no-users"
                  >
                    No users found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

          {/* =========================
              EDIT USER MODAL
          ========================= */}
          {showModal && (

            <div className="modal-overlay">

              <div className="modal">

                <h2>
                  Edit User
                </h2>

                {/* NAME */}
                <input
                  type="text"
                  placeholder="Name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value,
                    })
                  }
                />

                {/* EMAIL */}
                <input
                  type="email"
                  placeholder="Email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                />

                {/* ROLE */}
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value,
                    })
                  }
                >

                  <option value="candidate">
                    Candidate
                  </option>

                  <option value="hr">
                    HR
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                </select>

                {/* STATUS */}
                <select
                  value={
                    editingUser.isVerified
                      ? "true"
                      : "false"
                  }
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      isVerified:
                        e.target.value === "true",
                    })
                  }
                >

                  <option value="true">
                    Active
                  </option>

                  <option value="false">
                    Blocked
                  </option>

                </select>

                {/* MODAL BUTTONS */}
                <div className="modal-buttons">

                  <button
                    type="button"
                    onClick={updateUser}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default UserManagement;
