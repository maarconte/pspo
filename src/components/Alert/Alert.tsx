import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useEffect, useState } from "react";

import { AlertProps } from "./Alert.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Alert: FC<AlertProps> = ({
  children,
  classes,
  color,
  severity = "success",
  variant = "standard",
}) => {
  const icon: any = {
    error: faTimes,
    info: faInfoCircle,
    success: faCheckCircle,
    warning: faExclamationTriangle,
  };
  return (
    <div className={`Alert ${severity} ${variant} ${classes}`}>
      <FontAwesomeIcon icon={icon[severity]} className="mr-1" />
      {children}
    </div>
  );
};

export default Alert;
