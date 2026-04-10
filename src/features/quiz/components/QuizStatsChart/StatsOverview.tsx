import { useMemo } from "react";
import { CheckCircle, Clock, Activity, Trophy, AlertTriangle } from "lucide-react";
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
      const answeredCount = sess.details?.filter(d => d.userAnswer !== null).length || 0;
      const rate = answeredCount > 0 ? (sess.score / answeredCount) * 100 : 0;
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
      avgResponseTime: (sumAvgTimeMs / recentCount / 60000).toFixed(2), // minutes
    };
  }, [data]);

  if (!stats) return null;
  const isPassed = Number(stats?.avgSuccessRate) >= 85;

  return (
    <div className="stats-overview-grid">
      {/* Response Time Card */}
      <StatCard
        variant="warning"
        icon={<Clock size={24} strokeWidth={2.5} />}
        value={`${stats.avgResponseTime}m`}
        label="Avg. Duration (last 3)"
      />
      {/* Success Rate Card */}
      <StatCard
        variant={isPassed ? "success" : "danger"}
        isFeatured={true}
        icon={
          isPassed ? (
            <Trophy size={24} strokeWidth={2.5} />
          ) : (
            <AlertTriangle size={24} strokeWidth={2.5} />
          )
        }
        value={`${stats.avgSuccessRate}%`}
        label="Avg. Success (last 3)"
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
