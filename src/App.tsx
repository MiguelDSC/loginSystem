import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login
          onLogin={(data) => {
            setIsLoggedIn(data);
          }}
        />
      ) : (
        <>
          <h1>Welcome! {localStorage.getItem("username")}</h1>
          <button onClick={logoutHandler}>Logout</button>
        </>
      )}
    </div>
  );
}

export default App;
