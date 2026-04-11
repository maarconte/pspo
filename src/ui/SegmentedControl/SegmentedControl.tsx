import React from "react";
import "./SegmentedControl.scss";

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  name,
}) => {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <label
          key={option.value}
          className={`segmented-item ${value === option.value ? "active" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <div className="segmented-label">
            {option.icon && <span className="segmented-icon">{option.icon}</span>}
            <span>{option.label}</span>
          </div>
        </label>
      ))}
      <div 
        className="segmented-slider" 
        style={{ 
          width: `calc(${100 / options.length}% - 4px)`,
          transform: `translateX(calc(${options.findIndex(o => o.value === value) * 100}%))`
        }} 
      />
    </div>
  );
};

export default SegmentedControl;
