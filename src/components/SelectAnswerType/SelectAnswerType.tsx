import "./style.scss";
import "./style-mobile.scss";

import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectAnswerTypeProps } from "./SelectAnswerType.types";
import { faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons";

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
          onChange={() => onChange}
          onBlur={() => onBlur}
          className={className}
          {...rest}
        />
        <span className="d-flex gap-05 align-items-center">
          <FontAwesomeIcon
            icon={
              id === "M" ? faSquareCheck : id === "S" ? faCircleDot : faToggleOn
            }
            color="#8b78c7"
          />
          {label}
        </span>
      </label>
    </div>
  );
};

export default SelectAnswerType;
