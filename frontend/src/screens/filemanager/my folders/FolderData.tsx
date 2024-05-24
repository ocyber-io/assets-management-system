import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useUser } from "../../../components/hooks/useUserDetails";
import {
  selectFilesByFolderId,
  selectFolder,
} from "../../../reducers/folder/folderSlice";
import {
  getFolderById,
  getFoldersByUserId,
} from "../../../reducers/folder/folderThunk";
import { AppDispatch, RootState } from "../../../stores/store"; // Import the RootState type
import RecentFiles from "../../overview/RecentFiles";
import FolderBreadcrumb from "./FolderBreadcrumb";

const FolderData: React.FC = () => {
  const { folderId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {userId} = useUser();
  

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
