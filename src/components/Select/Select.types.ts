export type Options = {
  value: string | number;
  label: string;
};

export type SelectProps = {
  placeholder?: string;
  value?: string | number;
  options: Options[];
  required?: boolean;
  className?: string;
  handleChange?: (value: string | number) => void;
} & Record<string, any>;
