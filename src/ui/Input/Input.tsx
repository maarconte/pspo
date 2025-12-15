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
  name: string;
  id?: string;
} & Record<string, any>;

const Input: FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  required,
  className,
  errorMessage,
  type,
  name,
  id,
  ...rest
}) => {
  return (
    <div className={`input-box ${className}`}>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          required
          name={name}
          id={id || name}
          {...rest}
          placeholder=""
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          type={type}
          id={id || name}
          name={name}
          required
          {...rest}
          placeholder=""
        />
      )}
      <label htmlFor={id}>{placeholder}</label>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default Input;
