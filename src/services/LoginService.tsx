export type userType = {
  username: string;
  password: string;
};

export const loginUser = async (user: userType) => {
  console.log(user);

  const response = await fetch("http://localhost:3300/login", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },

    body: JSON.stringify({
      username: user.username,
      password: user.password,
    }),
  });

  if (!response.ok) {
    return false;
  }

  localStorage.setItem("username", user.username);
  return true;
};
