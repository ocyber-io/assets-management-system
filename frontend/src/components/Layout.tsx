// Layout Component
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./Navbar/SideBar";
import TopBar from "./Navbar/TopBar";
import FileUploadModal from "./FileUploadModal";

const Layout: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="fixed lg:w-64 w-10 text-white h-full z-30">
        <SideBar setModalOpen={setModalOpen} />{" "}
      </div>
      <div className="flex-grow ml-4 mr-2 py-2.5 pl-[0] lg:pl-[16rem]">
        <TopBar />
        <Outlet />
      </div>
      <FileUploadModal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Layout;
