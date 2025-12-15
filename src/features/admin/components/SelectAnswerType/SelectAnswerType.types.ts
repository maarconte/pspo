import { LucideIcon } from "lucide-react";

export interface SelectAnswerTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export interface AnswerTypeOption {
  value: string;
  label: string;
  icon: LucideIcon;
}
