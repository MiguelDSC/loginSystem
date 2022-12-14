export type userType = {
  username: string;
  password: string;
};

export const loginUser = async (user: userType) => {
  const response = await fetch(
    `http://localhost:${import.meta.env.VITE_PORT}/login`,
    {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    return false;
  }

  localStorage.setItem("username", user.username);
  return true;
};
