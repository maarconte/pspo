import "./style.scss";
import "./style-mobile.scss";

import React, { FC } from "react";

import AuthContainer from "../Auth/AuthContainer";
import { LoginWrapperProps } from "./LoginWrapper.types";

const LoginWrapper: FC<LoginWrapperProps> = () => {
  return (
    <div className="LoginWrapper">
      <div className="container">
        <h1>Login</h1>
        <p>Hi, welcome back</p>
        <AuthContainer login />
      </div>
    </div>
  );
};

export default LoginWrapper;
