import React, { ChangeEvent, useContext, useState } from "react";
import styles from "./Login.module.css";
import ErrorModal from "../Modal/ErrorModal";
import { loginUser } from "../../services/LoginService";
import { Link } from "react-router-dom";
import { userType } from "../../types/UserType";
import AuthContext from "../../context/AuthProvider";

interface LoginProps {
  onLogin: (data: boolean) => void;
}

function Login(props: LoginProps) {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [error, setError] = useState({
    message: "",
    title: "",
  });

  const submitHandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      enteredUsername.trim().length == 0 ||
      enteredPassword.trim().length == 0
    ) {
      setError({
        title: "input invalid",
        message: "username and password can't be left empty, try again!",
      });
      return;
    }

    const user: userType = {
      username: enteredUsername,
      password: enteredPassword,
    };

    const userExists = await loginUser(user);
    if (!userExists) {
      setError({
        title: "User not found",
        message: "No user has been found with given input, try again",
      });
    }

    // props.onLogin(userExists);
    localStorage.setItem("isLoggedIn", "1");
  };

  return (
    <div>
      {error.message && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onCloseModal={() => {
            setError({
              message: "",
              title: "",
            });
          }}
        />
      )}

      <form onSubmit={submitHandler} className={styles.form}>
        <div className={styles.center}>
          <input
            type="text"
            name="username"
            value={enteredUsername}
            onChange={(e) => {
              setEnteredUsername(e.target.value);
            }}
            className={styles["form-middle"]}
            placeholder="enter username"
          />
          <input
            type="password"
            className={styles["form-middle"]}
            placeholder="enter password"
            value={enteredPassword}
            onChange={(e) => {
              setEnteredPassword(e.target.value);
            }}
          />
          <button className={`btn btn-success ${styles["form-middle"]}`}>
            LOGIN
          </button>
          <p className={styles["form-middle"]}>
            Not registerd?
            <span>
              <Link to={"/register"}>Create an account</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
