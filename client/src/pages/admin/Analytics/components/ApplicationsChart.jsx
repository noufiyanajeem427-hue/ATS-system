import "./ApplicationsChart.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function ApplicationsChart({ data = [] }) {

  return (
    <>
      <h2>Applications Per Month</h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={Array.isArray(data) ? data : []}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="applications"
            fill="#7C3AED"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default ApplicationsChart;