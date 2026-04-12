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
import "./QuizStatsChart.scss";
import { QuizSessionStat } from "../../../../utils/types";

interface QuizStatsChartProps {
  data: QuizSessionStat[];
  metric: 'successRate' | 'avgTime';
}

export default function QuizStatsChart({ data, metric }: QuizStatsChartProps) {

  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((session, index) => {
        const answeredQuestions = session.details?.filter(d => d.userAnswer !== null).length || 0;
        const percent = answeredQuestions > 0 ? (session.score / answeredQuestions) * 100 : 0;
        return {
          name: `Sess. ${index + 1}`,
          successRate: parseFloat(percent.toFixed(1)),
          avgTime: parseFloat((session.averageTimeMs / 60000).toFixed(2)),
          totalTime: parseFloat((session.totalTimeMs / 60000).toFixed(1)),
          date: new Date(session.timestamp).toLocaleDateString('en-FR', { day: '2-digit', month: 'short' }),
          time: new Date(session.timestamp).toLocaleTimeString('en-FR', { hour: '2-digit', minute: '2-digit' }),
          answeredQuestions,
          formation: session.formation,
        };
      });
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-light p-5 rounded">
        <p className="text-muted fw-bold">No data available yet. Take a quiz!</p>
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

  const isSuccess = metric === 'successRate';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-title">
            {label} - {data.date} - {data.time}
          </p>
          <div className="chart-tooltip-content">
            <div className="chart-tooltip-row">
              <span className="metric-label success">Module:</span>
              <span className="metric-value">{data.formation}</span>
            </div>
            <div className="chart-tooltip-row">
              <span className="metric-label success">Score:</span>
              <span className="metric-value">{data.successRate}%</span>
            </div>
            <div className="chart-tooltip-row">
              <span className="metric-label success">Questions:</span>
              <span className="metric-value">{data.answeredQuestions}/80</span>
            </div>
            <div className="chart-tooltip-row">
              <span className="metric-label avg-time">Time per question:</span>
              <span className="metric-value">{data.avgTime}m</span>
            </div>
            <div className="chart-tooltip-row">
              <span className="metric-label total-time">Total time:</span>
              <span className="metric-value">{data.totalTime}m</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="name"
            height={60}
            tick={<CustomAxisTick />}
            interval="preserveStartEnd"
            minTickGap={10}
          />

          {/* Primary Y-Axis */}
          <YAxis
            yAxisId="left"
            domain={isSuccess ? [0, 100] : [0, 'auto']}
            tickFormatter={(value) => isSuccess ? `${value}%` : `${value}m`}
          />

          {/* Secondary Y-Axis for Time Metrics (only in non-success mode) */}
          {!isSuccess && (
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 'auto']}
              tickFormatter={(value) => `${value}m`}
            />
          )}

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {isSuccess ? (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="successRate"
              name="Success Rate (%)"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={3}
            />
          ) : (
            <>
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgTime"
                name="Avg. Time/Question (m)"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
                strokeWidth={3}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalTime"
                name="Total Session Time (m)"
                stroke="#ffc658"
                strokeWidth={3}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
