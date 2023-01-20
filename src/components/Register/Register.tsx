import React, { ChangeEvent, useState } from "react";
import styles from "../Login/Login.module.css";
import ErrorModal from "../Modal/ErrorModal";
import { registerUser } from "../../services/LoginService";
import { Link, useNavigate } from "react-router-dom";
import { userType } from "../../types/UserType";

function Register() {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [error, setError] = useState({
    message: "",
    title: "",
  });
  const navigate = useNavigate();

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

    const registrationResult = await registerUser(user);

    if (registrationResult !== "succes") {
      setError({
        message: `username "${user.username}" has already been taken, try with another`,
        title: "username taken",
      });
      return;
    }

    alert(`user ${user.username} has been registerd!`);

    navigate("/login");
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
            Register
          </button>
          <p className={styles["form-middle"]}>
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
