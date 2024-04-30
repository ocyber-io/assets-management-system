import { Outlet } from "react-router-dom";
import React from "react"; // It's a good practice to explicitly import React
import Breadcrumbs from "../../components/Breadcrumbs";

const Settings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 mt-2 min-h-screen flex flex-col px-4">
      <Breadcrumbs />
      <Outlet />
    </div>
  );
};

export default Settings;
