import "./style.scss";

import { FC } from "react";

type InputProps = {
  value?: string | number;
  onChange?: (e: any) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  errorMessage?: string;
  type?: string;
} & Record<string, any>;

const Input: FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  required,
  className,
  errorMessage,
  type,
  ...rest
}) => {
  return (
    <div className={`input-box ${className}`}>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          required
          {...rest}
          placeholder=""
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          type={type}
          required
          {...rest}
          placeholder=""
        />
      )}
      <label>{placeholder}</label>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default Input;
