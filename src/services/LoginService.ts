import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { userType } from "../types/UserType";
const BASE_URL = "http://localhost";

export const loginUser = async (user: userType) => {
  const { setAuth } = useContext(AuthContext);
  const response = await fetch(
    `${BASE_URL}:${import.meta.env.VITE_PORT}/login`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        withCredentials: "true",
      },

      body: JSON.stringify(user),
    }
  );

  try {
    if (!response.ok) throw new Error("response from /login not ok");

    const result = await response.json();
    const accesToken = result.accesToken;
    setAuth({});

    return true;
  } catch (e) {}
};

export const registerUser = async (newUser: userType) => {
  const response = await fetch(
    `${BASE_URL}:${import.meta.env.VITE_PORT}/register`,
    {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(newUser),
    }
  );

  try {
    if (!response.ok) return response.statusText;
    return "succes";
  } catch (e) {}

  return true;
};
