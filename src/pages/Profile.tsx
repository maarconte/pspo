import React, { useState } from "react";
import { List, BarChart3 } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useQuizHistory } from "../hooks/useQuizHistory";
import QuizStatsChart from "../features/quiz/components/QuizStatsChart/QuizStatsChart";
import StatsOverview from "../features/quiz/components/QuizStatsChart/StatsOverview";
import ProfileBookmarks from "../features/quiz/components/ProfileBookmarks/ProfileBookmarks";
import ProfileErrors from "../features/quiz/components/ProfileErrors/ProfileErrors";
import { ProfileSessionsTable } from "../features/quiz/components/ProfileSessionsTable/ProfileSessionsTable";
import { Loader, SegmentedControl } from "../ui";
import ProfileHeader from "../features/quiz/components/ProfileHeader/ProfileHeader";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const { data: history, isLoading, error, refetch } = useQuizHistory();
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h2>Please log in to view your profile.</h2>
      </div>
    );
  }

  const viewOptions = [
    { label: "Graph", value: "graph", icon: <BarChart3 size={18} /> },
    { label: "List", value: "list", icon: <List size={18} /> },
  ];

  return (
    <div className="Profile">
      <div className="container mt-5">
        <ProfileHeader user={user} />

        <hr />

        <div className="mt-4">
          {isLoading && <Loader />}

          {error && (
            <div className="alert alert-danger">
              An error occurred while retrieving your statistics.
            </div>
          )}

          {!isLoading && !error && history && history.length > 0 && (
            <>
              <StatsOverview data={history} />

              <div className="section-header d-flex justify-content-between align-items-center mb-4 mt-5">
                <h2 className="h4 mb-0">My Quizzes</h2>
                <div style={{ width: "300px" }}>
                  <SegmentedControl
                    options={viewOptions}
                    value={viewMode}
                    onChange={(val) => setViewMode(val as "graph" | "list")}
                    name="view-mode"
                  />
                </div>
              </div>

              {viewMode === "list" ? (
                <div className="row mb-5">
                  <div className="col-12">
                    <ProfileSessionsTable history={history} onUpdate={refetch} />
                  </div>
                </div>
              ) : (
                <div className="mb-5">
                  <h3 className="h5 text-center mb-4 text-primary">Success Rate (%)</h3>
                  <QuizStatsChart data={history} metric="successRate" />
                  <h3 className="h5 text-center mb-4 text-primary">Average Time (m)</h3>
                  <QuizStatsChart data={history} metric="avgTime" />
                </div>
              )}

              <div className="row mb-3">
                      <div className="col-12">
                  <ProfileBookmarks history={history} onUpdate={refetch} />
                </div>
                <div className="col-12">
                  <ProfileErrors history={history} />
                </div>
              </div>
            </>
          )}

          {!isLoading && !error && history && history.length === 0 && (
            <div className="d-flex justify-content-center align-items-center bg-light p-5 rounded">
              <p className="text-muted fw-bold">No data available yet. Take a quiz!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
