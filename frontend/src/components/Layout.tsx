import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { fetchFiles } from "../reducers/file/fileThunks";
import { getFoldersByUserId } from "../reducers/folder/folderThunk";
import { AppDispatch } from "../stores/store";
import FileUploadModal from "./FileUploadModal";
import SideBar from "./Navbar/SideBar";
import TopBar from "./Navbar/TopBar";
import { useUser } from "./hooks/useUserDetails";
import NewFolderModal from "./shared/NewFolderModal";

const Layout: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, userInitials, userId } = useUser();

  useEffect(() => {
    if (userId) dispatch(fetchFiles(userId));
  }, [dispatch, userId]);

  const fetchFolders = async () => {
    if (userId) {
      try {
        await dispatch(getFoldersByUserId(userId));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [dispatch, userId]);

  return (
    <div className="flex">
      <div className="fixed lg:w-64 w-10 text-white h-full z-30 ">
        <SideBar
          setModalOpen={setModalOpen}
          setNewFolderModalOpen={setIsNewFolderModalOpen}
        />
      </div>
      <div className="flex-grow md:ml-4 md:mr-2 py-2.5 pl-0 xl:pl-[16rem]">
        {userInfo && <TopBar userInfo={userInfo} userInitials={userInitials} />}
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
      />
    </div>
  );
};

export default Layout;
