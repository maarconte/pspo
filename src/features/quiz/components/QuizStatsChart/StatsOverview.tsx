import { useMemo } from "react";
import { CheckCircle, Clock, Activity } from "lucide-react";
import { QuizSessionStat } from "../../../../utils/types";
import { StatCard } from "../../../../ui";
import "./StatsOverview.scss";

interface StatsOverviewProps {
  data: QuizSessionStat[];
}

export default function StatsOverview({ data }: StatsOverviewProps) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalSessions = data.length;
    const recentData = data.slice(0, 3);
    const recentCount = recentData.length;

    // Average success rate across LAST 3 sessions
    const sumSuccessRate = recentData.reduce((acc, sess) => {
      const rate =
        sess.totalQuestions > 0 ? (sess.score / sess.totalQuestions) * 100 : 0;
      return acc + rate;
    }, 0);

    // Average time per question across LAST 3 sessions
    const sumAvgTimeMs = recentData.reduce(
      (acc, sess) => acc + sess.averageTimeMs,
      0,
    );

    return {
      totalSessions,
      avgSuccessRate: (sumSuccessRate / recentCount).toFixed(1),
      avgResponseTime: (sumAvgTimeMs / recentCount / 1000).toFixed(1), // seconds
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className="stats-overview-grid">
      {/* Success Rate Card */}
      <StatCard
        variant="success"
        icon={<CheckCircle size={24} strokeWidth={2.5} />}
        value={`${stats.avgSuccessRate}%`}
        label="Avg. Success (last 3)"
      />

      {/* Response Time Card */}
      <StatCard
        variant="warning"
        icon={<Clock size={24} strokeWidth={2.5} />}
        value={`${stats.avgResponseTime}s`}
        label="Avg. Duration (last 3)"
      />

      {/* Sessions Card */}
      <StatCard
        variant="info"
        icon={<Activity size={24} strokeWidth={2.5} />}
        value={stats.totalSessions}
        label="Total Sessions"
      />
    </div>
  );
}
