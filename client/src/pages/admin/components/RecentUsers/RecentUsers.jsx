import "./RecentUsers.css";

function RecentUsers() {

  const users = [
    {
      name: "Noufiya Najeem",
      role: "Candidate",
      joined: "2 mins ago",
    },
    {
      name: "Rahul Sharma",
      role: "Recruiter",
      joined: "10 mins ago",
    },
    {
      name: "Aisha Khan",
      role: "Candidate",
      joined: "30 mins ago",
    },
    {
      name: "John Mathew",
      role: "Recruiter",
      joined: "1 hour ago",
    },
  ];

  return (

    <div className="recent-users">

      <div className="recent-header">

        <h3>Recent Users</h3>

        <button>View All</button>

      </div>

      {users.map((user,index)=>(

        <div className="recent-user" key={index}>

          <div className="avatar">

            {user.name.charAt(0)}

          </div>

          <div className="user-info">

            <h4>{user.name}</h4>

            <p>{user.role}</p>

          </div>

          <span>{user.joined}</span>

        </div>

      ))}

    </div>

  );
}

export default RecentUsers;