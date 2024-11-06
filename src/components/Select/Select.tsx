import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useEffect, useRef, useState } from "react";

import { SelectProps } from "./Select.types";

const Select: FC<SelectProps> = ({
  options,
  placeholder,
  className,
  value,
  handleChange,
  ...rest
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelectToggle = () => {
    setIsOpened(!isOpened);
  };

  const handleOptionSelect = (optionValue: string) => {
    setIsOpened(false);
    if (handleChange) {
      handleChange(optionValue);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="Select" ref={selectRef}>
      <select className={`${className}`} {...rest} />
      <div className={`Select__wrapper ${isOpened ? "opened" : ""}`}>
        <div
          className={`Select__wrapper__trigger ${className}`}
          onClick={handleSelectToggle}
        >
          <span className={value && "isFiled"}>{value || placeholder}</span>
        </div>
        {
          <div className="Select__options">
            {options.map((option, index) => (
              <span
                className="Select__option"
                key={index}
                data-value={option}
                onClick={() => handleOptionSelect(option.value)}
              >
                {option.label}
              </span>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default Select;
