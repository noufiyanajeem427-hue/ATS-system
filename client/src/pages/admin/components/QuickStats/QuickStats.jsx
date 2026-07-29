import "./QuickStats.css";

function QuickStats() {

  const stats = [
    {
      title: "Jobs Open",
      value: "18",
      color: "#6366F1",
    },
    {
      title: "Today's Applications",
      value: "54",
      color: "#3B82F6",
    },
    {
      title: "Interviews",
      value: "9",
      color: "#10B981",
    },
    {
      title: "Companies",
      value: "24",
      color: "#F59E0B",
    },
  ];

  return (
    <div className="quick-stats">

      <h3>Quick Statistics</h3>

      {stats.map((item, index) => (

        <div className="quick-item" key={index}>

          <div>
            <h4>{item.title}</h4>
            <p>{item.value}</p>
          </div>

          <span
            className="status-dot"
            style={{ background: item.color }}
          ></span>

        </div>

      ))}

    </div>
  );
}

export default QuickStats;