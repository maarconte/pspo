import "./style.scss";

import { FC } from "react";

type InputProps = {
  value?: string | number;
  onChange?: (e: any) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  errorMessage?: string;
<<<<<<< HEAD
  type?: string;
=======
>>>>>>> aab479d (Last components)
} & Record<string, any>;

const Input: FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  required,
  className,
  errorMessage,
<<<<<<< HEAD
  type,
=======
>>>>>>> aab479d (Last components)
  ...rest
}) => {
  return (
    <div className={`input-box ${className}`}>
<<<<<<< HEAD
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
          required
          {...rest}
          placeholder=""
        />
      )}
=======
      <input
        value={value}
        onChange={onChange}
        required
        {...rest}
        placeholder=""
      />
>>>>>>> aab479d (Last components)
      <label>{placeholder}</label>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default Input;
