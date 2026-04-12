import "./style.scss";
import "./style-mobile.scss";

import React, { FC } from "react";
import { FileText, Flag, MessageSquareOff } from "lucide-react";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { QuestionsStatsProps } from "./QuestionsStats.types";
import StatCard from "../../../../ui/StatCard/StatCard";

const QuestionsStats: FC<QuestionsStatsProps> = () => {
  const { allQuestions } = useQuestionsStore();
  
  const flaggedQuestions = allQuestions.filter(
    (question) => question.isFlagged
  );
  
  const noFeedbackQuestions = allQuestions.filter(
    (question) => !question.feedback
  );

  return (
    <div className="QuestionsStats">
      <StatCard
        icon={<FileText size={24} />}
        value={allQuestions.length}
        label="Total questions"
        variant="info"
        className="QuestionsStats__stat"
      />
      
      <StatCard
        icon={<Flag size={24} />}
        value={flaggedQuestions.length}
        label="Reported"
        variant={flaggedQuestions.length > 0 ? "danger" : "default"}
        className="QuestionsStats__stat"
      />

      <StatCard
        icon={<MessageSquareOff size={24} />}
        value={noFeedbackQuestions.length}
        label="No feedback"
        variant={noFeedbackQuestions.length > 0 ? "warning" : "default"}
        className="QuestionsStats__stat"
      />
    </div>
  );
};

export default QuestionsStats;
