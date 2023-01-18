import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Test from "./components/Test";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  // const logoutHandler = () => {
  //   localStorage.removeItem("isLoggedIn");
  //   localStorage.removeItem("username");
  //   setIsLoggedIn(false);
  // };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <Login
              onLogin={(data) => {
                setIsLoggedIn(data);
              }}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>Unknown Url</h1>} />
      </Routes>
    </div>
  );
}

export default App;
