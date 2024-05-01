// Layout Component
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./Navbar/SideBar";
import TopBar from "./Navbar/TopBar";
import FileUploadModal from "./FileUploadModal";
import NewFolderModal from "./shared/NewFolderModal";

const Layout: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);

  const NewFolderSubmitHandler = () => {
    setIsNewFolderModalOpen(false);
    console.log("submit");
  };

  return (
    <div className="flex min-h-screen">
      <div className="fixed lg:w-64 w-10 text-white h-full z-30">
        <SideBar
          setModalOpen={setModalOpen}
          setNewFolderModalOpen={setIsNewFolderModalOpen}
        />{" "}
      </div>
      <div className="flex-grow md:ml-4 md:mr-2 py-2.5 pl-0 md:pl-[16rem]">
        <TopBar />
        <div className="md:pt-0 pt-24">
          <Outlet />
        </div>
      </div>
      <FileUploadModal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
      />
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onCancel={() => setIsNewFolderModalOpen(false)}
        onClose={() => setIsNewFolderModalOpen(false)}
        onSubmit={NewFolderSubmitHandler}
      />
    </div>
  );
};

export default Layout;
