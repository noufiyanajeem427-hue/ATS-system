import "./CandidatePieChart.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#EF4444",
];

function CandidatePieChart({ data = [] }) {

  return (
    <>
      <h2>Candidate Status</h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>

          <Pie
            data={Array.isArray(data) ? data : []}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label
          >

            {Array.isArray(data) &&
              data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

          </Pie>

          <Tooltip />

          <Legend
            verticalAlign="bottom"
          />

        </PieChart>
      </ResponsiveContainer>
    </>
  );
}

export default CandidatePieChart;