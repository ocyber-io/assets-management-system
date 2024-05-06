import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RedirectIfAuthenticatedProps {
  children: ReactNode;
}

const RedirectIfAuthenticated = ({
  children,
}: RedirectIfAuthenticatedProps) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
