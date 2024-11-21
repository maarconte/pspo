import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useEffect, useState } from "react";

import Button from "../Button";
import Input from "../Input";
import { LoginWrapperProps } from "./LoginWrapper.types";

const LoginWrapper: FC<LoginWrapperProps> = () => {
  return (
    <div className="LoginWrapper">
      <div className="container">
        <h1>Login</h1>
        <p>Hi, welcome back</p>
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Button label="Login" />
      </div>
    </div>
  );
};

export default LoginWrapper;
