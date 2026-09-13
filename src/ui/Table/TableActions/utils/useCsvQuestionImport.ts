import { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { toast } from "react-toastify";
import { useAddDoc } from "../../../../utils/hooks";
import { QUESTIONS_COLLECTION } from "../../../../utils/constants";
import { CsvQuestionRow, QuestionDraft, parseCsvRow } from "./csvImport";

interface ParseFileOptions {
  /** Open the preview modal as soon as parsing succeeds, skipping the extra "preview" click. */
  autoOpenPreview?: boolean;
}

/**
 * Parses a CSV file into QuestionDraft[] (every row stamped with the same
 * moduleType), and manages the resulting preview-then-write flow. Shared by
 * the generic "Import questions" action on the Admin page and the per-module
 * import action on the Admin modules page.
 */
export const useCsvQuestionImport = () => {
  const [csvData, setCsvData] = useState<QuestionDraft[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { handleAdd } = useAddDoc(QUESTIONS_COLLECTION);

  const parseFile = (
    file: File,
    moduleType: string,
    options?: ParseFileOptions
  ) => {
    file.text().then((text) => {
      // Without an explicit `newline`, Papa Parse's auto-detection can
      // misparse a quoted field sitting right at end-of-file. Detect the
      // file's actual convention instead of hardcoding one.
      const newline = text.includes("\r\n") ? "\r\n" : "\n";

      Papa.parse<CsvQuestionRow>(text, {
        header: true,
        skipEmptyLines: true,
        newline,
        complete: (result: ParseResult<CsvQuestionRow>) => {
          const errors: string[] = [];
          const questions: QuestionDraft[] = [];

          result.data.forEach((row, index) => {
            const parsed = parseCsvRow(row, index + 2, moduleType); // +1 header, +1 1-based
            if ("error" in parsed) {
              errors.push(parsed.error);
            } else {
              questions.push(parsed.question);
            }
          });

          if (errors.length > 0) {
            console.warn("Erreurs d'import CSV :", errors);
            toast.error(
              `${errors.length} ligne(s) ignorée(s) : ${errors
                .slice(0, 3)
                .join(" | ")}${errors.length > 3 ? "…" : ""}`
            );
          }

          setCsvData(questions);
          if (options?.autoOpenPreview && questions.length > 0) {
            setIsPreviewOpen(true);
          }
        },
        error: (error: Error) => {
          console.error("Error parsing CSV file:", error);
          toast.error("Impossible de lire le fichier CSV");
        },
      });
    });
  };

  const removeFromPreview = (index: number) => {
    setCsvData((current) => current.filter((_, i) => i !== index));
  };

  const openPreview = () => setIsPreviewOpen(true);

  const closePreview = () => {
    setIsPreviewOpen(false);
    setCsvData([]);
  };

  const confirmImport = async () => {
    if (csvData.length === 0) return;
    setIsImporting(true);
    try {
      for (const question of csvData) {
        await handleAdd(question);
      }
      setCsvData([]);
      setIsPreviewOpen(false);
      toast.success("The questions have been added");
    } catch (error) {
      toast.error(
        "An error occurred while adding the questions. Please try again."
      );
    } finally {
      setIsImporting(false);
    }
  };

  return {
    csvData,
    isPreviewOpen,
    isImporting,
    parseFile,
    openPreview,
    closePreview,
    removeFromPreview,
    confirmImport,
  };
};
