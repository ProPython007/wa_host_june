import React, { useEffect, useState } from 'react'
import "./login.css"
import PersonIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import LoginIcon from "@mui/icons-material/Login";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (username == "ayaan" && password == "ayaan") {
       localStorage.setItem("isLoggedIn", true);
       setIsLoggedIn(true);
    }
    else{
      setIsIncorrect(true);
    }
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={login}>
            <h2>ADMIN LOG IN</h2>
            <div className="login__field">
              <i className="login__icon">
                <PersonIcon />
              </i>
              <input
                type="text"
                className="login__input"
                placeholder="User name"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="login__field">
              <i className="login__icon">
                <PasswordIcon />
              </i>
              <input
                type="password"
                className="login__input"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="footerText">
              <span className='fp'>
                Forgot Password <LoginIcon />
              </span>

              {isIncorrect && (
                <span className="danger">Incorrect Username/Password</span>
              )}
            </div>
            <button className="login__submit">
              <span className="button__text">Log In</span>
              <i className="button__icon">
                <LoginIcon />
              </i>
            </button>
          </form>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
}

export default Login
