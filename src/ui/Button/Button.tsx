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
    if (React.isValidElement<{ color?: string }>(icon) && icon.props.color) {
      return icon.props.color;
    }
    const key = `${style || 'default'}-${disabled ? 'disabled' : 'enabled'}-${type}`;

    switch (key) {
      case "outlined-disabled-secondary":
        return "#8B8EB0";
      case "default-disabled-primary":
        return "#9FC1EF";
      case "outlined-enabled-error":
        return "#FF5326";
      case "outlined-enabled-success":
        return "#17EB79";
      case "outlined-enabled-primary":
        return "#5236ab";
      case "outlined-enabled-secondary":
        return "#171C60";
      case "tonal-enabled-error":
        return "#FF5326";
      case "tonal-enabled-primary":
        return "#5236ab";
      case "tonal-enabled-warning":
        return "#af7e19";
      default:
        break;
    }

    // Handle type-only cases
    switch (type) {
      case "label":
      case "white":
      case "base":
        return "#5236ab";
      case "reverse_error":
        return "#FF5326";
      default:
        return "#fff";
    }
  };

  const iconProps = {
    color: getIconColor(),
    width: size === "more" ? "8px" : "16px",
    height: iconHeight ? iconHeight : "16px",
  };

  const buttonClass = `btn ${style ? "btn-" + style : "btn-solid"} ${
    size ? "btn-" + size : "btn-L"
  } ${type ? "btn-" + type : "btn-primary"} ${className} ${
    isIconButton && "btn-icon"
  }`;

  const isExternal =
    url?.startsWith("http") ||
    url?.startsWith("https") ||
    url?.startsWith("mailto:");

  const renderContent = () => (
    <>
      {label && <span>{label}</span>}
      {isLoader && <div className="btn-loader" />}
      {icon &&
        !isLoader &&
        React.isValidElement(icon) &&
        React.cloneElement(icon, iconProps)}
    </>
  );

  if (url) {
    if (isExternal) {
      return (
        <a
          href={url}
          className={buttonClass}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {renderContent()}
        </a>
      );
    }
    return (
      <Link to={url} className={buttonClass} {...rest}>
        {renderContent()}
      </Link>
    );
  }

  return (
    <button
      className={buttonClass}
      type={buttonType}
      disabled={disabled || isLoader}
      onClick={onClick}
      {...rest}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
