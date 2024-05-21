import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/signup.css";
import eyeIcon from "../../assets/icons/view.svg";
import signupImage from "../../assets/images/signup.svg";
import logo from "../../assets/logo.svg";
import GoogleLogin from "../../components/GoogleLogin";
import { useDispatch } from "react-redux";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { validateSignUpForm } from "../../utils/validateSignUpForm";
import { AppDispatch } from "../../stores/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { signUp } from "../../reducers/user/userThunks";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
    };

    if (validateSignUpForm(formData)) {
      try {
        const actionResult = await dispatch(signUp(formData));
        unwrapResult(actionResult); // This will throw if the promise is rejected
        showSuccessToast("Signup Successful, Please Login to continue...");
        navigate("/login");
      } catch (error: any) {
        showErrorToast(error || "Failed to sign up");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="xl:mx-40 pb-36 mx-4">
      <div>
        <img
          src={logo}
          className="md:mt-12 mt-4 flex md:justify-start justify-center w-full md:w-auto"
          alt="logo"
        />
      </div>

      <div className="flex md:flex-row flex-col-reverse">
        <div className="max-w-lg w-full">
          <div className="md:mt-16 mt-4">
            <h1 className="text-2xl font-bold">Join the Cloud Revolution!</h1>
            <h2 className="text-lg font-semibold mt-1 max-w-sm">
              Create your account to revolutionize the way you manage your
              digital assets.
            </h2>
          </div>
          <div className="mt-8 font-medium text-gray-700">
            <p>Please enter your login details below!</p>
            <GoogleLogin />

            <div className="my-4 text-left">
              <div className="inline-block border-t-2 border-gray-200 md:w-40 w-28" />
              <span className="mx-4 text-gray-600 font-bold">or</span>
              <div className="inline-block border-t-2 border-gray-200 md:w-44 w-28" />
            </div>

            <form className="md:w-3/4 w-full" onSubmit={handleSignup}>
              <div className="flex space-x-4">
                <div className="md:w-1/2 w-full">
                  <label
                    htmlFor="firstName"
                    className="font-bold text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Paul"
                    className="w-full mt-1 px-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded"
                  />
                </div>
                <div className="md:w-1/2 w-full">
                  <label htmlFor="lastName" className="font-bold text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Walker"
                    className="w-full mt-1 px-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="email" className="font-bold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full mt-1 pl-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded"
                />
              </div>
              <div className="mt-4 relative">
                <label htmlFor="password" className="font-bold text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full mt-1 pl-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded pr-10"
                />
                <img
                  src={eyeIcon}
                  className="absolute right-4 top-10 cursor-pointer"
                  alt="Toggle visibility"
                  onClick={togglePasswordVisibility}
                />
              </div>

              <button
                type="submit"
                className="mt-6 bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-md"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        <div className="flex justify-start items-start md:mt-32 mt-4">
          <img src={signupImage} alt="Signup visual" />
        </div>
      </div>

      <div className="mt-2 text-left text-sm">
        <span className="text-gray-400 font-semibold">
          Already have an account?
        </span>{" "}
        <Link
          to="/login"
          className="text-blue-400 font-bold hover:text-blue-600"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
