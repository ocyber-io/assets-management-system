import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../stores/store";
import { login, signUp } from "../reducers/user/userThunks";

const Test = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(signUp(signupData));
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(loginData));
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignupSubmit}>
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={signupData.firstname}
          onChange={handleSignupChange}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={signupData.lastname}
          onChange={handleSignupChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signupData.email}
          onChange={handleSignupChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={signupData.password}
          onChange={handleSignupChange}
        />
        <button type="submit">Signup</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleLoginChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleLoginChange}
        />
        <button type="submit">Login</button>
      </form>

      {userState.status === "loading" && <p>Loading...</p>}
      {userState.error && <p>Error: {userState.error}</p>}
      {userState.user && <p>Welcome, {userState.user.userId}!</p>}
    </div>
  );
};

export default Test;
