import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import "../../assets/css/signup.css";
import googleLogo from "../../assets/icons/google.svg";
import signupImage from "../../assets/images/signup.svg";
import eyeIcon from "../../assets/icons/view.svg"; // Make sure you have an eye icon asset
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="md:mx-40 pb-36 mx-4">
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
            <button className="bg-white flex border-2 hover:bg-gray-50 text-base font-semibold border-gray-200 md:w-3/4 w-full justify-center rounded mt-4 py-3">
              <img
                className="mr-2 opacity-90"
                src={googleLogo}
                alt="Google logo"
              />
              <span className="px-1.5">Sign up with Google</span>
            </button>

            <div className="my-4 text-left">
              <div className="inline-block border-t-2 border-gray-200 md:w-40 w-28" />
              <span className="mx-4 text-gray-600 font-bold">or</span>
              <div className="inline-block border-t-2 border-gray-200 md:w-44 w-28" />
            </div>

            <form className="md:w-3/4 w-full">
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
                    placeholder="Paul"
                    className="w-full mt-1 px-3 py-3 border-2 border-gray-200 focus:outline-blue-500 rounded"
                  />
                </div>
                <div className="md:w-1/2 w-full">
                  <label htmlFor="lastName" className="font-bold text-gray-700">
                    Last Name
                  </label>
                  <input
                    placeholder="Walker"
                    type="text"
                    id="lastName"
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

              <button className="mt-6 bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-md">
                Sign Up
              </button>
            </form>
          </div>
        </div>

        <div className="flex justify-start items-start md:mt-32 mt-4">
          <img src={signupImage} alt="Signup visual" />
        </div>
      </div>

      <div className="mt-2 text-left  text-sm">
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
