import { Icon } from "@fortawesome/fontawesome-svg-core";

export interface SelectAnswerTypeProps {
  field: {
    name: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void,
  }
  label: string;
  id: string;
  className?: string;
}
