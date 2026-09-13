import { useEffect, useState, useTransition } from 'react';
import {
  subscribeToModules,
  updateModule,
  deleteModule,
} from '../api/modules.api';
import type { Module, UpdateModulePayload } from '../types/module.types';

interface UseModulesReturn {
  modules: Module[];
  isLoading: boolean;
  error: Error | null;
  isPending: boolean;
  handleUpdateModule: (id: string, payload: UpdateModulePayload, previousPdfPath?: string | null) => void;
  handleDeleteModule: (id: string, pdfPath?: string | null) => Promise<void>;
}

export const useModules = (): UseModulesReturn => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const unsubscribe = subscribeToModules(
      (data) => {
        setModules(data);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleUpdateModule = (
    id: string,
    payload: UpdateModulePayload,
    previousPdfPath?: string | null,
  ) => {
    startTransition(async () => {
      await updateModule(id, payload, previousPdfPath);
    });
  };

  const handleDeleteModule = async (id: string, pdfPath?: string | null) => {
    await deleteModule(id, pdfPath);
  };

  return { modules, isLoading, error, isPending, handleUpdateModule, handleDeleteModule };
};
