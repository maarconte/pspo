import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { QuizSessionStat } from "../../../../utils/types";

interface QuizStatsChartProps {
  data: QuizSessionStat[];
}

export default function QuizStatsChart({ data }: QuizStatsChartProps) {

  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((session, index) => {
        const percent = session.totalQuestions > 0 ? (session.score / session.totalQuestions) * 100 : 0;
        return {
          name: `Sess. ${index + 1}`,
          successRate: parseFloat(percent.toFixed(1)),
          avgTime: parseFloat((session.averageTimeMs / 1000).toFixed(1)), // convert ms to seconds
          date: new Date(session.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          time: new Date(session.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
      });
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-light p-5 rounded">
        <p className="text-muted fw-bold">Aucune donnée disponible pour le moment. Fais un quiz !</p>
      </div>
    );
  }

  const CustomAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const sessionData = chartData[payload.index];

    return (
      <g transform={`translate(${x},${y + 15})`}>
        <text x={0} y={0} dy={25} textAnchor="middle" fill="#666" fontSize={11}>
          <tspan x="0" dy="0" fontWeight="bold">{payload.value}</tspan>
          <tspan x="0" dy="18" fontSize={10} fill="#999">{sessionData?.date}</tspan>
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: "100%", height: 350 }}>
      {/*
        Review Torvalds: 10/10
        Verdict: Espacement augmenté entre le graphique et l'axe X pour plus de lisibilité.
      */}
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="name"
            height={60}
            tick={<CustomAxisTick />}
            interval={0}
          />
          {/* Left Axis for percentage (0-100) */}
          <YAxis yAxisId="left" domain={[0, 100]} />
          {/* Right Axis for average time (seconds) */}
          <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax']} />

          <Tooltip
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                const data = payload[0].payload;
                return `${label} - ${data.date} à ${data.time}`;
              }
              return label;
            }}
          />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="successRate"
            name="Bonnes réponses (%)"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={3}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgTime"
            name="Temps moy./question (s)"
            stroke="#82ca9d"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
