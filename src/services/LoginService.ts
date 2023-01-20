import { userType } from "../types/UserType";

export const loginUser = async (user: userType) => {
  const response = await fetch(
    `http://localhost:${import.meta.env.VITE_PORT}/login`,
    {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(user),
    }
  );

  try {
    if (!response.ok) throw new Error("response not ok");

    const result = await response.json();
    console.log("");

    return true;
  } catch (e) {}
};

export const registerUser = async (newUser: userType) => {
  const response = await fetch(
    `http://localhost:${import.meta.env.VITE_PORT}/register`,
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
