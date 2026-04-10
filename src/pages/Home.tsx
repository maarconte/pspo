import "./Home.scss";

import { AlertCircle, Clock, Layers, Play, Target, Undo2 } from "lucide-react";

import { Button, SegmentedControl } from "../ui";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import { useUserStore } from "../features/auth/stores/useAuthStore";
import { useInfoPopupStore } from "../stores/useInfoPopupStore";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const formation = useQuestionsStore((s) => s.formation);
  const setFormation = useQuestionsStore((s) => s.setFormation);
  const questions = useQuestionsStore((s) => s.questions);
  const startNewExam = useQuestionsStore((s) => s.startNewExam);

  const navigate = useNavigate();

  const user = useUserStore((s) => s.user);
  const openInfoPopup = useInfoPopupStore((s) => s.open);
  const isDismissed = useInfoPopupStore((s) => s.isDismissed);
  const isExpired = useInfoPopupStore((s) => s.isExpired());

  const handleStartExam = () => {
    if (!user && /* !isDismissed && */ !isExpired) {
      openInfoPopup();
    } else {
      startNewExam();
      navigate("/quizz");
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-content">
          <h1 className="hero-title">
          Study Group
          </h1>
          <p className="hero-subtitle">Test your knowledge and prepare for your certification</p>
        </div>
      </div>
      <div className="glass-card">
        <div className="selector-section">
          <h2>Module</h2>
          <SegmentedControl
            name="formation"
            value={formation}
            onChange={(value) => {
              setFormation(value);
            }}
            options={[
              { label: "PSPO-I", value: "pspo-I" },
              { label: "PSM-I", value: "PSM-I" },
            ]}
          />
        </div>

        <div className="bento-grid">
          <div className="bento-item">
            <div className="icon-container">
              <Layers size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>80 Questions</strong>
              <span>Randomly selected for a realistic exam simulation.</span>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>60 Minutes</strong>
              <span>The timer will start as soon as the quiz begins.</span>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Target size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>85% Required</strong>
              <span>Passing goal: you are allowed a maximum of 12 errors.</span>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <AlertCircle size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>Single Session</strong>
              <span>The exam must be completed in one go with no saving possible.</span>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Undo2 size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>Flexible</strong>
              <span>You can go back and modify your answers at any time.</span>
            </div>
          </div>
        </div>

        <div className="start-action">
          <Button
            label="Start Exam"
            icon={<Play size={18} fill="currentColor" />}
            onClick={handleStartExam}
            disabled={questions.length === 0}
            className="px-4 py-3"
          />
        </div>
      </div>
    </div>
  );
}
