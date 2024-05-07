import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/icons/google.svg";
import { googleSignUp } from "../reducers/user/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "../stores/store";
import { useDispatch } from "react-redux";

interface UserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

const GoogleLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.get<UserInfo>(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const res = await dispatch(
          googleSignUp({
            email: response.data.email,
            given_name: response.data.given_name,
            family_name: response.data.family_name,
            googleId: response.data.id,
          })
        );
        unwrapResult(res);
        if (res) {
          navigate("/");
        }
      } catch (error) {
        console.error(
          "Error fetching user info or processing Google signup:",
          error
        );
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  return (
    <div>
      <button
        className="bg-white flex border-2 hover:bg-gray-50 text-base font-semibold border-gray-200 md:w-3/4 w-full justify-center rounded mt-4 py-3"
        onClick={() => login()}
      >
        <img className="mr-2 opacity-90" src={googleIcon} alt="Google logo" />
        <span className="px-1.5">Sign up with Google</span>
      </button>
    </div>
  );
};

export default GoogleLogin;
