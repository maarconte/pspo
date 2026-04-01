import "./Home.scss";

import { AlertCircle, Clock, Layers, Play, Target, Undo2 } from "lucide-react";

import { Button, Select } from "../ui";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { formation, setFormation, questions, startNewExam } = useQuestionsStore();
  const navigate = useNavigate();

  const handleStartExam = () => {
    startNewExam();
    navigate("/quizz");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-content">
          <h1 className="hero-title">
            Agile.training : {formation}
          </h1>
          <p className="hero-subtitle">Mettez à l'épreuve vos connaissances et préparez votre certification</p>
        </div>
</div>
      <div className="glass-card">
        <div className="selector-section">
          <h2>Module de préparation</h2>
          <Select
            name="formation"
            className="Select"
            value={formation}
            handleChange={(value: any) => {
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
              <span>Tirées aléatoirement pour une simulation réaliste de l'examen.</span>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>60 Minutes</strong>
              <span>Le chronomètre s'activera dès le démarrage du quiz.</span>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Target size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>85% Requis</strong>
              <span>Objectif de passe : vous avez droit à un maximum de 12 erreurs.</span>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <AlertCircle size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>Session Unique</strong>
              <span>L'examen doit être terminé d'une traite sans sauvegarde possible.</span>
            </div>
          </div>

          <div className="bento-item">
            <div className="icon-container">
              <Undo2 size={24} strokeWidth={2.5} />
            </div>
            <div className="bento-content">
              <strong>Flexible</strong>
              <span>Vous pouvez revenir en arrière et modifier vos réponses à tout moment.</span>
            </div>
          </div>
        </div>

        <div className="start-action">
          <Button
            label="Commencer l'examen"
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
