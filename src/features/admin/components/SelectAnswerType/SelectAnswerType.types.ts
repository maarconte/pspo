import { LucideIcon } from "lucide-react";

export interface SelectAnswerTypeProps {
  value: string;
  onChange: (value: string) => void;
  field: {
    name: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
  };
  id: string;
  className?: string;
  label?: string;
}

export interface AnswerTypeOption {
  value: string;
  label: string;
  icon: LucideIcon;
}
