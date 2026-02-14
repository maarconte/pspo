import { FC } from "react";
import "./Loader.scss";

const Loader: FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loader-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
