import { FC } from "react";
import "./style.scss";

interface LoaderProps {
  message?: string;
}

const Loader: FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loader;
