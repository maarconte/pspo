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
        navigate("/");
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
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={props.login ? signIn : register}>
        {props.login ? "Sign In" : "Register"}
      </Button>
      <hr />
      <Button
        size="large"
        disabled={disabled}
        variant="contained"
        onClick={signInWithGoogle}
      >
        Sign In With Google
      </Button>

      {errorMessage}
    </>
  );
};

export default AuthContainer;
