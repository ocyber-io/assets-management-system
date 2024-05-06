import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
