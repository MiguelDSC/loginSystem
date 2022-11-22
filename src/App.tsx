import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  let content = (
    <Login
      onLogin={(data) => {
        setIsLoggedIn(data);
      }}
      isRegisterd={(data) => setHasAccount(data)}
    />
  );

  if (!hasAccount) {
    content = <Register isRegisterd={(data) => setHasAccount(data)} />;
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <h1>Welcome! {localStorage.getItem("username")}</h1>
          <button onClick={logoutHandler}>Logout</button>
        </>
      ) : (
        content
      )}
    </div>
  );
}

export default App;
