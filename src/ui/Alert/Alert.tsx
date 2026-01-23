import "./style.scss";
import "./style-mobile.scss";

import React, { FC } from "react";

import { AlertProps } from "./Alert.types";
import { CheckCircle, X, AlertTriangle, Info } from "lucide-react";

const Alert: FC<AlertProps> = ({
  children,
  classes,
  color,
  severity = "success",
  variant = "standard",
}) => {
  const IconComponent: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
    error: X,
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
  };

  const Icon = IconComponent[severity];

  return (
    <div className={`Alert ${severity} ${variant} ${classes}`}>
      <Icon size={16} className="mr-1" />
      {children}
    </div>
  );
};


export default Alert;
