import { LucideIcon } from "lucide-react";

export interface SelectAnswerTypeProps {
  value: string;
  onChange: (e: any) => void;
  field: {
    name: string;
    value: string;
    onChange: (e: any) => void;
    onBlur: (e: any) => void;
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
