import React, { useEffect, useState } from "react";
import { FaFolderOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { selectFolders } from "../../reducers/folder/folderSlice";
import {
  addFileToFolder,
  getFoldersByUserId,
} from "../../reducers/folder/folderThunk";
import { AppDispatch } from "../../stores/store";
import NotificationModal from "./NotificationModal";
import { jwtDecode } from "jwt-decode";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

type MoveFileModalProps = {
  isOpen: boolean;
  fileId: string | null;
  onClose: () => void;
};

const MoveToFolderModal: React.FC<MoveFileModalProps> = ({
  isOpen,
  fileId,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const folders = useSelector(selectFolders);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{
          id: string;
          firstname: string;
          lastname: string;
          email: string;
          profilePicture: string;
          googleId: string;
        }>(token);
        if (decoded) {
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchFolders = async () => {
      if (userId) {
        await dispatch(getFoldersByUserId(userId));
      }
    };
    fetchFolders();
  }, [dispatch, userId]);

  const handleMoveFile = async () => {
    if (!selectedFolderId || !fileId) return;

    try {
      await dispatch(
        addFileToFolder({ folderId: selectedFolderId, fileId })
      ).unwrap();
      showSuccessToast("File moved successfully");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "Couldn't add file to folder";
      showErrorToast(`File already exists: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      heading="Move File"
      headingStyles="text-lg font-bold"
      onCancel={handleCancel}
      onSubmit={handleMoveFile}
      cancelButtonText="Cancel"
      cancelButtonStyle="bg-transparent border border-gray-200 hover:bg-gray-50"
      submitButtonText="Move"
      closeModal={onClose}
    >
      <div className="mt-4">
        <h1 className="font-semibold mb-2">Select Destination Folder</h1>
        <div className="relative">
          <select
            className="block w-full px-4 py-3 mt-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
            value={selectedFolderId}
            onChange={(e) => setSelectedFolderId(e.target.value)}
          >
            <option value="" className="">
              Select Folder
            </option>
            {folders.map((folder) => (
              <option key={folder._id} value={folder._id}>
                <FaFolderOpen className="inline-block mr-2 py-4" />
                {folder.folderName}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none h-5 w-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </NotificationModal>
  );
};

export default MoveToFolderModal;
