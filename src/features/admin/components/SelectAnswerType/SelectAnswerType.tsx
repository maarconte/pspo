import "./style.scss";
import "./style-mobile.scss";

import { FC } from "react";
import { CheckSquare, ToggleRight, Circle } from "lucide-react";
import { SelectAnswerTypeProps } from "./SelectAnswerType.types";

const SelectAnswerType: FC<SelectAnswerTypeProps> = ({
  field: { name, value, onChange, onBlur },
  id,
  className,
  label,
  ...rest
}) => {
  return (
    <div className="SelectAnswerType">
      <label>
        <input
          name={name}
          id={id}
          type="radio"
          value={id}
          checked={id === value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onBlur}
          className={className}
          {...rest}
        />
        <span className="d-flex gap-05 align-items-center">
          {id === "M" ? (
            <CheckSquare size={16} color="#8b78c7" />
          ) : id === "S" ? (
            <Circle size={16} color="#8b78c7" />
          ) : (
            <ToggleRight size={16} color="#8b78c7" />
          )}
          {label}
        </span>
      </label>
    </div>
  );
};

export default SelectAnswerType;
