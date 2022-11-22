export type userType = {
  username: string;
  password: string;
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

  if (!response.ok) return false;

  return true;
};
