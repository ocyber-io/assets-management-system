import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../stores/store";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import NotificationModal from "../NotificationModal";
import { updateFolder } from "../../../reducers/folder/folderThunk";

type RenameFolderProps = {
  isOpen: boolean;
  onClose: () => void;
  folderId: string | null; // Add folderId prop
  initialFoldername: string;
};

const RenameFolderModal: React.FC<RenameFolderProps> = ({
  isOpen,
  onClose,
  folderId, // Receive folderId prop
  initialFoldername,
}) => {
  const [newFoldername, setNewFoldername] = useState(initialFoldername);
  const dispatch = useDispatch<AppDispatch>();

  const handleFolderNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewFoldername(event.target.value);
  };

  const handleSubmit = async () => {
    if (!folderId) {
      showErrorToast("Invalid folder identifier."); // Changed error message
      return;
    }

    if (newFoldername === "") {
      showErrorToast("Folder name cannot be empty"); // Changed error message
      return;
    }

    try {
      await dispatch(
        updateFolder({ folderId, updates: { folderName: newFoldername } }) // Updated updates object
      ).unwrap();
      showSuccessToast("Folder successfully renamed"); // Changed success message
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while renaming the folder."); // Changed error message
    }
  };

  return (
    <NotificationModal
      heading="Rename Folder" // Changed modal heading
      headingStyles="font-semibold text-xl"
      closeModal={onClose}
      submitButtonText="Rename" // Changed submit button text
      submitButtonStyle="bg-blue-500 hover:bg-blue-600"
      cancelButtonStyle="bg-transparent border-2 border-gray-200 hover:bg-blue-50"
      cancelButtonText="Cancel"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onCancel={onClose}
    >
      <div className="w-full mt-4 relative">
        <input
          type="text"
          value={newFoldername}
          onChange={handleFolderNameChange}
          className="resize-none rounded border-2 border-gray-200 w-full focus:outline-blue-500 pl-2 p-2"
          placeholder="Enter new folder name"
        />
      </div>
    </NotificationModal>
  );
};

export default RenameFolderModal;
