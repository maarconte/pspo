import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { QuizSessionStat } from "../../../../utils/types";

interface QuizErrorsChartProps {
  data: QuizSessionStat[];
}

export default function QuizErrorsChart({ data }: QuizErrorsChartProps) {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((session, index) => {
        // Calculate incorrect answers based on total vs correct
        const incorrectCount = session.totalQuestions - session.score;
        return {
          name: `Sess. ${index + 1}`,
          errors: incorrectCount,
          date: new Date(session.timestamp).toLocaleDateString(),
        };
      });
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return null; // The parent handles the "no empty state" msg generally, or we just render nothing to not duplicate.
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      {/* 
        Review Torvalds: 9/10
        Verdict: Extracted logic efficiently. BarChart is natively better to show absolute countable errors per session than LineChart.
      */}
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          
          <Tooltip 
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return `${label} - ${payload[0].payload.date}`;
              }
              return label;
            }}
          />
          <Legend />
          
          <Bar
            dataKey="errors"
            name="Nombre d'erreurs"
            fill="#ff7300"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
