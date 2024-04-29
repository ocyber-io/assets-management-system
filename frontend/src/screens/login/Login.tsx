import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/signup.css";
import googleLogo from "../../assets/icons/google.svg";
import eyeIcon from "../../assets/icons/view.svg"; // Make sure you have an eye icon asset
import signupImage from "../../assets/images/signup.svg";
import logo from "../../assets/logo.svg";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
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
              <h1 className="text-2xl font-bold">
                Welcome Back to Your Cloud Hub!
              </h1>
              <h2 className="text-lg font-semibold mt-1 max-w-sm">
                Sign in to access your cloud storage and collaborate seamlessly.
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
                <span className="px-1.5">Login with Google</span>
              </button>

              <div className="my-4 text-left">
                <div className="inline-block border-t-2 border-gray-200 md:w-40 w-28" />
                <span className="mx-4 text-gray-600 font-bold">or</span>
                <div className="inline-block border-t-2 border-gray-200 md:w-44 w-28" />
              </div>

              <form className="md:w-3/4 w-full">
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
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="mr-1 opacity-50 hover:opacity-90"
                  />
                  <div className="flex justify-between w-full">
                    <label
                      htmlFor="rememberMe"
                      className="text-xs font-bold text-gray-700"
                    >
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-xs text-blue-400 hover:text-blue-600 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalOpen(true);
                      }}
                    >
                      Forgot Password
                    </button>
                  </div>
                </div>
                <button className="mt-6 bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-md">
                  Login
                </button>
                <div className="mt-2 text-left text-sm">
                  <span className="text-gray-400 font-semibold">
                    Don't have an account?
                  </span>
                  <Link
                    to="/signup"
                    className="text-blue-400 font-bold hover:text-blue-600"
                  >
                    Signup
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="flex justify-start items-start md:mt-32 mt-4">
            <img src={signupImage} alt="Signup visual" />
          </div>
        </div>
      </div>
      <ForgotPasswordModal isOpen={modalOpen} onClose={onModalClose} />
    </>
  );
};

export default Login;
