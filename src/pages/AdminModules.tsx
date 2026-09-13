import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Layers, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useModules } from '../features/admin/hooks/useModules';
import { updateModule, deleteModule } from '../features/admin/api/modules.api';
import { ModulesTable } from '../features/admin/components/ModulesTable/ModulesTable';
import { ModuleFormModal } from '../features/admin/components/ModuleFormModal/ModuleFormModal';
import Button from '../ui/Button/Button';
import { Button_Type, Button_Style } from '../ui/Button/Button.types';
import Modal from '../ui/Modal/Modal';
import StatCard from '../ui/StatCard/StatCard';
import type { Module } from '../features/admin/types/module.types';
import './AdminModules.scss';

export default function AdminModules() {
  const navigate = useNavigate();
  const { modules, isLoading, error } = useModules();
  const [modalState, setModalState] = useState<{ isOpen: boolean; module?: Module }>({
    isOpen: false,
  });
  const [togglingModuleId, setTogglingModuleId] = useState<string | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [isDeletionBlockedOpen, setIsDeletionBlockedOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => setModalState({ isOpen: true, module: undefined });
  const openEditModal = (module: Module) => setModalState({ isOpen: true, module });
  const closeModal = () => setModalState({ isOpen: false });

  const handleToggleStatus = async (module: Module) => {
    setTogglingModuleId(module.id);
    try {
      await updateModule(module.id, { isActive: !module.isActive }, module.pdfPath);
      toast.success(
        module.isActive
          ? 'Le module a bien été désactivé'
          : 'Le module a bien été activé'
      );
    } catch {
      toast.error('Une erreur est survenue lors de la mise à jour du statut');
    } finally {
      setTogglingModuleId(null);
    }
  };

  const handleDeleteClick = (module: Module, isEmpty: boolean) => {
    if (isEmpty) {
      setModuleToDelete(module);
    } else {
      setIsDeletionBlockedOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!moduleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteModule(moduleToDelete.id, moduleToDelete.pdfPath);
      toast.success('Module supprimé');
    } catch {
      toast.error('Une erreur est survenue lors de la suppression du module');
    } finally {
      setIsDeleting(false);
      setModuleToDelete(null);
    }
  };

  const activeCount = modules.filter((m) => m.isActive).length;

  return (
    <div className="AdminModules admin-modules-page">
      <div className="container mt-5">
        <div className="admin-modules-page__hero">
          <Button
            label="Back"
            icon={<ArrowLeft size={16} />}
            style={Button_Style.OUTLINED}
            onClick={() => navigate('/admin')}
            className="admin-modules-page__back-btn"
          />
          <div className="admin-modules-page__hero-icon">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="admin-modules-page__title">Admin modules</h1>
            <p className="admin-modules-page__description">
              Gérez les modules de quiz proposés aux utilisateurs.
            </p>
          </div>
          <Button
            label="Add module"
            icon={<Plus size={16} />}
            type={Button_Type.PRIMARY}
            onClick={openAddModal}
            className="admin-modules-page__add-btn"
          />
        </div>

        <div className="admin-modules-page__stats">
          <StatCard
            icon={<Layers size={24} />}
            value={modules.length}
            label="Totals modules"
            variant="info"
          />
          <StatCard
            icon={<CheckCircle2 size={24} />}
            value={activeCount}
            label="Actifs"
            variant="success"
          />
        </div>

        {isLoading ? (
          <div className="admin-modules-page__loading">
            <span className="admin-modules-page__spinner" />
            <span>Chargement des modules...</span>
          </div>
        ) : error ? (
          <div className="admin-modules-page__error">
            Une erreur est survenue lors du chargement des modules.
          </div>
        ) : (
          <ModulesTable
            modules={modules}
            onEdit={openEditModal}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteClick}
            togglingModuleId={togglingModuleId}
          />
        )}
      </div>

      <ModuleFormModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        module={modalState.module}
      />

      <Modal
        isOpen={!!moduleToDelete}
        title="Supprimer un module"
        type="error"
        labelOnConfirm="Delete"
        labelOnCancel="Cancel"
        onClose={() => setModuleToDelete(null)}
        setIsClosed={() => setModuleToDelete(null)}
        onConfirm={handleConfirmDelete}
        isConfirmLoading={isDeleting}
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le module{' '}
          <strong>"{moduleToDelete?.title}"</strong> ?
        </p>
        <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Cette action est irréversible. Le PDF associé sera également supprimé.
        </p>
      </Modal>

      <Modal
        isOpen={isDeletionBlockedOpen}
        title="Suppression impossible"
        type="warning"
        labelOnConfirm="J'ai compris"
        hideCancelButton
        onClose={() => setIsDeletionBlockedOpen(false)}
        setIsClosed={() => setIsDeletionBlockedOpen(false)}
        onConfirm={() => setIsDeletionBlockedOpen(false)}
      >
        <p>
          Ce module comprend des questions, vous ne pouvez pas le supprimer par
          vous même. Pour réaliser la suppression, vous devez formuler la
          demande à l'équipe support.
        </p>
      </Modal>
    </div>
  );
}
