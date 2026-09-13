import "./Home.scss";

import { useEffect } from "react";
import { AlertCircle, Clock, Layers, Play, Target, Undo2 } from "lucide-react";

import { Button, SegmentedControl } from "../ui";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import { useUserStore } from "../features/auth/stores/useAuthStore";
import { useInfoPopupStore } from "../stores/useInfoPopupStore";
import { useModules } from "../features/admin/hooks/useModules";
import { getFormationValue } from "../utils/helpers/formationLabel";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../lib/analytics";

const parseDurationMinutes = (hhmm?: string): number | null => {
  const match = hhmm ? /^(\d{2}):(\d{2})$/.exec(hhmm) : null;
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};

export default function Home() {
  const formation = useQuestionsStore((s) => s.formation);
  const setFormation = useQuestionsStore((s) => s.setFormation);
  const questions = useQuestionsStore((s) => s.questions);
  const startNewExam = useQuestionsStore((s) => s.startNewExam);
  const setQuizConfig = useQuestionsStore((s) => s.setQuizConfig);

  const navigate = useNavigate();

  const user = useUserStore((s) => s.user);
  const openInfoPopup = useInfoPopupStore((s) => s.open);
  const isDismissed = useInfoPopupStore((s) => s.isDismissed);
  const isExpired = useInfoPopupStore((s) => s.isExpired());

  const { modules } = useModules();
  const activeModules = modules.filter((m) => m.isActive);
  const moduleOptions = activeModules.map((m) => ({
    label: m.title,
    value: getFormationValue(m.title),
  }));
  const currentModule = activeModules.find(
    (m) => getFormationValue(m.title) === formation
  );

  const questionCount = currentModule?.questionCount ?? 80;
  const durationMinutes = parseDurationMinutes(currentModule?.quizDuration) ?? 60;
  const minSuccessPercent = currentModule?.minSuccessPercent ?? 85;
  const maxErrors = questionCount - Math.ceil((questionCount * minSuccessPercent) / 100);

  // Keep the selected formation pointed at an active module: switch away from
  // one that just got deactivated (or hasn't loaded yet) to the first available.
  useEffect(() => {
    if (activeModules.length === 0) return;
    const isCurrentActive = activeModules.some(
      (m) => getFormationValue(m.title) === formation
    );
    if (!isCurrentActive) {
      setFormation(getFormationValue(activeModules[0].title));
    }
  }, [activeModules, formation, setFormation]);

  // Keep the store's quiz config (question count, duration, pass threshold)
  // in sync with the module currently selected, so it applies both to the
  // initial question set and to the exam started from this screen.
  useEffect(() => {
    setQuizConfig({ questionCount, durationMinutes, minSuccessPercent });
  }, [questionCount, durationMinutes, minSuccessPercent, setQuizConfig]);

  const handleStartExam = () => {
    if (!user && !isDismissed && !isExpired) {
      openInfoPopup();
    } else {
      trackEvent('quiz_started', { formation, is_logged_in: !!user });
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
            options={moduleOptions}
          />
        </div>

        <div className="bento-grid">
          <div className="bento-item">
            <div className="icon-container">
              <Layers size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <p>  <strong>{questionCount} Questions </strong>  <span>Randomly selected for a realistic exam simulation.</span></p>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <p>
                <strong>{durationMinutes} Minutes </strong>
                <span>The timer will start as soon as the quiz begins.</span>
              </p>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Target size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <p>
                <strong>{minSuccessPercent}% Required </strong>
                <span>Passing goal: you are allowed a maximum of {maxErrors} errors.</span>
              </p>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <AlertCircle size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <p>
                <strong>Single Session </strong>
                <span>The exam must be completed in one go with no saving possible.</span>
              </p>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Undo2 size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <p>
                <strong>Flexible </strong>
                <span>You can go back and modify your answers at any time.</span>
              </p>
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
