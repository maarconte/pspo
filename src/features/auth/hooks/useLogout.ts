import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useNavigate } from "react-router-dom";

export const useLogout = (navigateTo: string = "/") => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate(navigateTo);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
};
