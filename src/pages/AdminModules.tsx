import { useState } from 'react';
import { Layers, Plus } from 'lucide-react';
import { useModules } from '../features/admin/hooks/useModules';
import { ModulesTable } from '../features/admin/components/ModulesTable/ModulesTable';
import { ModuleFormModal } from '../features/admin/components/ModuleFormModal/ModuleFormModal';
import Button from '../ui/Button/Button';
import { Button_Type } from '../ui/Button/Button.types';
import type { Module } from '../features/admin/types/module.types';
import './AdminModules.scss';

export default function AdminModules() {
  const { modules, isLoading, error } = useModules();
  const [modalState, setModalState] = useState<{ isOpen: boolean; module?: Module }>({
    isOpen: false,
  });

  const openAddModal = () => setModalState({ isOpen: true, module: undefined });
  const openEditModal = (module: Module) => setModalState({ isOpen: true, module });
  const closeModal = () => setModalState({ isOpen: false });

  return (
    <div className="AdminModules admin-modules-page">
      <div className="container mt-5">
        <div className="admin-modules-page__hero">
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
          <ModulesTable modules={modules} onEdit={openEditModal} />
        )}
      </div>

      <ModuleFormModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        module={modalState.module}
      />
    </div>
  );
}
