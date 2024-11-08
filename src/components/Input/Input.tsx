import "./style.scss";

import { FC } from "react";

type InputProps = {
  value?: string | number;
  onChange?: (e: any) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  errorMessage?: string;
} & Record<string, any>;

const Input: FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  required,
  className,
  errorMessage,
  ...rest
}) => {
  return (
    <div className={`input-box ${className}`}>
      <input
        value={value}
        onChange={onChange}
        required
        {...rest}
        placeholder=""
      />
      <label>{placeholder}</label>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default Input;
