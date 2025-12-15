import "./Button.scss";

import { ButtonProps, Button_Type } from "./Button.types";
import React, { FC } from "react";

import { Link } from "react-router-dom";

const Button: FC<ButtonProps> = ({
  label,
  size,
  style,
  type = Button_Type.PRIMARY,
  buttonType,
  disabled,
  onClick,
  icon,
  className,
  isIconButton,
  isLoader,
  iconHeight,
  url,
  ...rest
}) => {
  const getIconColor = () => {
    if (style === "outlined" && disabled && type === "secondary") {
      return "#8B8EB0";
    } else if (disabled && type === "primary") {
      return "#9FC1EF";
    } else if (style === "outlined" && type === "error") {
      return "#FF5326";
    } else if (style === "outlined" && type === "success") {
      return "#17EB79";
    } else if (style === "outlined" && type === "primary") {
      return "#1956A8";
    } else if (style === "outlined" && type === "secondary") {
      return "#171C60";
    } else if (type === "label") {
      return "#1956A8";
    } else if (type === "white") {
      return "#1956A8";
    } else if (type === "reverse_error") {
      return "#FF5326";
    } else if (type === "base") {
      return "#1956A8";
    }
    return "#fff";
  };

  const iconProps = {
    fill: getIconColor(),
    width: size === "more" ? "8px" : "16px",
    height: iconHeight ? iconHeight : "16px",
  };

  const buttonClass = `btn ${style ? "btn-" + style : "btn-solid"} ${
    size ? "btn-" + size : "btn-L"
  } ${type ? "btn-" + type : "btn-primary"} ${className} ${
    isIconButton && "btn-icon"
  }`;

  return (
    <>
      {type !== Button_Type.LINK ? (
        <button
          className={buttonClass}
          type={buttonType}
          disabled={disabled}
          onClick={onClick}
          {...rest}
        >
          {label}
          {icon &&
            !isLoader &&
            React.isValidElement(icon) &&
            React.cloneElement(icon, iconProps)}
        </button>
      ) : (
        <Link to={url ?? ""} className={buttonClass}>
          {label}
          {icon &&
            !isLoader &&
            React.isValidElement(icon) &&
            React.cloneElement(icon, iconProps)}
        </Link>
      )}
    </>
  );
};

export default Button;
