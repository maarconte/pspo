export type Options = {
  value: string;
  label: string;
};

export type SelectProps = {
  placeholder?: string;
  value?: string;
  options: Options[];
  required?: boolean;
  className?: string;
  handleChange?: (value: string) => void;
} & Record<string, any>;
