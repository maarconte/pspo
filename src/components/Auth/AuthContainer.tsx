import { Providers, auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import Button from "../Button";
import Input from "../Input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  login: boolean;
}

const AuthContainer = (props: Props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const signInWithGoogle = () => {
    setDisabled(true);
    signInWithPopup(auth, Providers.google)
      .then(() => {
        setDisabled(false);
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(error.code + ": " + error.message);
        setDisabled(false);
      });
  };

  const signIn = () => {
    setDisabled(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setDisabled(false);
        navigate("/admin");
      })
      .catch((error: any) => {
        setErrorMessage(error.code + ": " + error.message);
        setDisabled(false);
      });
  };

  const register = () => {
    setDisabled(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setDisabled(false);
        navigate("/");
      })
      .catch((error: any) => {
        setErrorMessage(error.code + ": " + error.message);
        setDisabled(false);
      });
  };

  return (
    <>
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-1"
        name="email"
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-1"
        name="password"
      />
      {/* <a href="#" className="mb-1 d-block text-right">
        Forgot password ?
      </a> */}
      <Button
        onClick={signIn}
        label={"Sign in"}
        disabled={disabled}
        className="mb-1"
      />
      {errorMessage}
    </>
  );
};

export default AuthContainer;
