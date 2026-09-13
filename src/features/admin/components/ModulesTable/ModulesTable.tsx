import { FileText, Layers, Pencil } from 'lucide-react';
import type { Module } from '../../types/module.types';
import { useQuestionsStore } from '../../../../stores/useQuestionsStore';
import { getFormationLabel } from '../../../../utils/helpers/formationLabel';
import './style.scss';

interface ModulesTableProps {
  modules: Module[];
  onEdit: (module: Module) => void;
}

export const ModulesTable = ({ modules, onEdit }: ModulesTableProps) => {
  const allQuestions = useQuestionsStore((s) => s.allQuestions);

  const getLinkedQuestionCount = (module: Module) =>
    allQuestions.filter((q) => getFormationLabel(q.type) === module.title).length;

  if (modules.length === 0) {
    return (
      <div className="modules-table__empty">
        <Layers size={40} strokeWidth={1.2} />
        <p>Aucun module pour le moment.</p>
        <span>Cliquez sur "Add module" pour créer le premier module.</span>
      </div>
    );
  }

  return (
    <div className="modules-table">
      <div className="modules-table__wrapper">
        <table className="modules-table__table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Statut</th>
              <th>Quizz duration</th>
              <th>Nbr question</th>
              <th>Questions en base</th>
              <th>% minimum to success</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.id}>
                <td className="modules-table__title">{module.title}</td>
                <td>
                  <span
                    className={`badge ${
                      module.isActive ? 'badge--active' : 'badge--inactive'
                    }`}
                  >
                    {module.isActive ? 'Actived' : 'Desactived'}
                  </span>
                </td>
                <td>{module.quizDuration}</td>
                <td>{module.questionCount}</td>
                <td>{getLinkedQuestionCount(module)}</td>
                <td>{module.minSuccessPercent}%</td>
                <td>
                  {module.pdfUrl ? (
                    <a
                      href={module.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modules-table__pdf-link"
                      title={`Ouvrir le PDF de ${module.title}`}
                    >
                      <FileText size={16} />
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="modules-table__edit-btn"
                    onClick={() => onEdit(module)}
                    title={`Éditer ${module.title}`}
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
