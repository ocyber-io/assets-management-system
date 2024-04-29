import { Outlet } from "react-router-dom";
import React from "react"; // It's a good practice to explicitly import React

const Settings: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Settings;
