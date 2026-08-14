import "./RecruitmentTrend.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function RecruitmentTrend({ data = [] }) {

  return (
    <>
      <h2>Recruitment Trend</h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart
          data={Array.isArray(data) ? data : []}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="hired"
            stroke="#7C3AED"
            strokeWidth={4}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default RecruitmentTrend;