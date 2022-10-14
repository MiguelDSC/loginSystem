import { ChangeEvent, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

type userType = {
  username: string;
  password: string;
};

const loginUser = async (user: userType) => {
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
    console.log("incorrect details");
    return;
  }

  console.log("user logged in!");
};

function App() {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const submitHandler = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = {
      username: enteredUsername,
      password: enteredPassword,
    };

    setEnteredUsername("");
    setEnteredPassword("");
    loginUser(user);
  };

  return (
    <div className="App">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="enter username"
          onChange={(e) => {
            setEnteredUsername(e.target.value);
          }}
          value={enteredUsername}
        />
        <input
          type="password"
          placeholder="enter password"
          value={enteredPassword}
          onChange={(e) => {
            setEnteredPassword(e.target.value);
          }}
        />
        <button>login now</button>
      </form>
    </div>
  );
}

export default App;
