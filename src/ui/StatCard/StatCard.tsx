import React, { ReactNode } from "react";
import "./StatCard.scss";

export type StatCardVariant =
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "default";

export interface StatCardProps {
  /** The main value to display (e.g. "85%", "12s") */
  value: ReactNode;
  /** The label text under the value */
  label: ReactNode;
  /** The icon component to display */
  icon: ReactNode;
  /** Visual variant controlling icon color */
  variant?: StatCardVariant;
  /** Optional additional CSS class */
  className?: string;
  /** Whether the card should be visually featured/prominent */
  isFeatured?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  variant = "default",
  className = "",
  isFeatured = false,
}) => {
  return (
    <div
      className={`stat-card ${variant !== "default" ? variant : ""} ${isFeatured ? "is-featured" : ""} ${className}`.trim()}
    >
      <div className="icon-container">{icon}</div>
      <div className="stat-content">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
};

export default StatCard;
