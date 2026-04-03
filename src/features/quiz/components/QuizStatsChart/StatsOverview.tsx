import { useMemo } from "react";
import { CheckCircle, Clock, Activity } from "lucide-react";
import { QuizSessionStat } from "../../../../utils/types";
import "./StatsOverview.scss";

interface StatsOverviewProps {
  data: QuizSessionStat[];
}

export default function StatsOverview({ data }: StatsOverviewProps) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalSessions = data.length;
    
    // Average success rate across ALL sessions
    const sumSuccessRate = data.reduce((acc, sess) => {
      const rate = sess.totalQuestions > 0 ? (sess.score / sess.totalQuestions) * 100 : 0;
      return acc + rate;
    }, 0);
    
    // Average time per question across ALL sessions
    const sumAvgTimeMs = data.reduce((acc, sess) => acc + sess.averageTimeMs, 0);

    return {
      totalSessions,
      avgSuccessRate: (sumSuccessRate / totalSessions).toFixed(1),
      avgResponseTime: (sumAvgTimeMs / totalSessions / 1000).toFixed(1), // seconds
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className="stats-overview-grid">
      {/* Success Rate Card */}
      <div className="stat-card success">
        <div className="icon-container">
          <CheckCircle size={24} strokeWidth={2.5} />
        </div>
        <div className="stat-content">
          <strong>{stats.avgSuccessRate}%</strong>
          <span>Réussite moyenne</span>
        </div>
      </div>

      {/* Response Time Card */}
      <div className="stat-card warning">
        <div className="icon-container">
          <Clock size={24} strokeWidth={2.5} />
        </div>
        <div className="stat-content">
          <strong>{stats.avgResponseTime}s</strong>
          <span>Temps moy./question</span>
        </div>
      </div>

      {/* Sessions Card */}
      <div className="stat-card info">
        <div className="icon-container">
          <Activity size={24} strokeWidth={2.5} />
        </div>
        <div className="stat-content">
          <strong>{stats.totalSessions}</strong>
          <span>Sessions totales</span>
        </div>
      </div>
    </div>
  );
}
