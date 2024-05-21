import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilesByFolderId,
  selectFolder,
} from "../../../reducers/folder/folderSlice";
import { AppDispatch, RootState } from "../../../stores/store"; // Import the RootState type
import RecentFiles from "../../overview/RecentFiles";
import {
  getFolderById,
  getFoldersByUserId,
} from "../../../reducers/folder/folderThunk";
import { jwtDecode } from "jwt-decode";
import FolderBreadcrumb from "./FolderBreadcrumb";

const FolderData: React.FC = () => {
  const { folderId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{
          id: string;
        }>(token);
        if (decoded) {
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  const fetchFolders = async () => {
    if (userId) {
      try {
        await dispatch(getFoldersByUserId(userId));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
  };

  const fetchFolder = async () => {
    if (folderId) {
      await dispatch(getFolderById(folderId));
    }
  };

  useEffect(() => {
    fetchFolders();
    fetchFolder();
  }, [dispatch, userId, folderId]);

  const files = useSelector((state: RootState) => {
    // Specify RootState type
    if (folderId) return selectFilesByFolderId(folderId)(state);
    return []; // Return an empty array if folderId is not defined
  });
  const folder = useSelector(selectFolder);

  useEffect(() => {
    // Log the files to the console
    console.log(files);
  }, [files]); // Add files as a dependency to useEffect if needed

  const undeletedFiles = files.filter((file) => !file.isDeleted);
  const breadcrumbItems = [
    { name: "Folders", path: "/folders" },
    { name: folder?.folderName || "Loading...", path: `/folders/${folderId}` },
  ];

  return (
    <div className="mt-6">
      <FolderBreadcrumb items={breadcrumbItems} />
      <RecentFiles
        tagFiles={undeletedFiles}
        fromFolders={true}
        folderId={folderId}
        fetchFolders={fetchFolders}
      />
    </div>
  ); // Adjust the JSX as needed
};

export default FolderData;
