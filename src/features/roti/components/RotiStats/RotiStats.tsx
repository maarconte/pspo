import "./style.scss";

import { MessageSquare, Star, Users } from "lucide-react";
import StatCard from "../../../../ui/StatCard/StatCard";
import { useRotiStats } from "../../hooks/useRotiStats";
import { ROTI_SCORES, type RotiEntry } from "../../types/roti.types";

const MAX_COMMENTS = 10;

const formatDate = (entry: RotiEntry): string =>
  entry.createdAt?.toDate?.().toLocaleDateString("en-GB") ?? "";

/** Admin block: ROTI ratings submitted from the end-of-quiz pop-up and the ROTI page. */
export default function RotiStats() {
  const { stats, isLoading, error } = useRotiStats();

  if (error) {
    return (
      <section className="roti-stats">
        <p className="roti-stats__message" role="alert">
          Unable to load ROTI ratings.
        </p>
      </section>
    );
  }

  const maxCount = Math.max(1, ...Object.values(stats.distribution));

  return (
    <section className="roti-stats">
      {isLoading ? (
        <p className="roti-stats__message">Loading...</p>
      ) : stats.total === 0 ? (
        <p className="roti-stats__message">No ROTI rating yet.</p>
      ) : (
        <>
          <div className="roti-stats__cards">
            <StatCard
              icon={<Users size={24} />}
              value={stats.total}
              label="Ratings"
              variant="info"
            />
            <StatCard
              icon={<Star size={24} />}
              value={`${stats.average?.toFixed(1)} / 5`}
              label="Average"
              variant={
                stats.average !== null && stats.average >= 4
                  ? "success"
                  : stats.average !== null && stats.average >= 3
                    ? "warning"
                    : "danger"
              }
            />
            <StatCard
              icon={<MessageSquare size={24} />}
              value={stats.comments.length}
              label="Comments"
            />
          </div>

          <ul className="roti-stats__distribution" aria-label="Ratings distribution">
            {[...ROTI_SCORES].reverse().map((score) => {
              const count = stats.distribution[score];
              return (
                <li key={score} data-score={score}>
                  <span className="roti-stats__score">{score}</span>
                  <span className="roti-stats__bar-track">
                    <span
                      className="roti-stats__bar"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </span>
                  <span className="roti-stats__count">
                    {count} ({Math.round((count / stats.total) * 100)}%)
                  </span>
                </li>
              );
            })}
          </ul>

          {stats.comments.length > 0 && (
            <div className="roti-stats__comments">
              <h3>Latest comments</h3>
              <ul>
                {stats.comments.slice(0, MAX_COMMENTS).map((entry) => (
                  <li key={entry.id} data-score={entry.score}>
                    <span className="roti-stats__comment-score">{entry.score}</span>
                    <div>
                      <p>{entry.comment}</p>
                      <small>
                        {formatDate(entry)} · {entry.source === "quiz" ? "End of quiz" : "ROTI page"}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
