import "./style.scss";
import "./style-mobile.scss";

import React, { FC } from "react";

import { MagicLinkForm } from "../MagicLinkForm";
import { LoginWrapperProps } from "./LoginWrapper.types";

const LoginWrapper: FC<LoginWrapperProps> = () => {
	return (
		<div className="LoginWrapper">
			<MagicLinkForm />
		</div>
	);
};

export default LoginWrapper;
