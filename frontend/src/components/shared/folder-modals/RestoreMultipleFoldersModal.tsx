import React from "react";
import { useDispatch } from "react-redux";
import restoreImage from "../../../assets/images/restore-modal.svg"; // Correctly import delete image
import { restoreMultipleFolders } from "../../../reducers/folder/folderThunk";
import { AppDispatch } from "../../../stores/store";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import NotificationModal from "../NotificationModal";

type RestoreMultipleFoldersModalProps = {
  heading?: string;
  description?: string;
  fetchFolders: () => void;
  folderIds: string[] | null;
  submitButtonText: string;
  onClose: () => void;
  fetchAllFiles: () => void;
  isOpen: boolean;
};

const RestoreMultipleFoldersModal: React.FC<
  RestoreMultipleFoldersModalProps
> = ({
  heading = "Restore Folders?",
  description = "Do you really want to restore these folders from the bin?",
  submitButtonText,
  onClose,
  isOpen,
  folderIds,
  fetchFolders,
  fetchAllFiles,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDismiss = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!folderIds) {
      showErrorToast("Invalid file identifier.");
      return;
    }

    try {
      await dispatch(restoreMultipleFolders(folderIds)).unwrap();
      showSuccessToast("Folder restored successfully");
      fetchFolders();
      fetchAllFiles();
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while restoring the folder.");
    }
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      imageUrl={restoreImage}
      heading={heading}
      headingStyles="text-xl text-gray-600 font-extrabold mt-4"
      description={description}
      descriptionAndHeadingPosition="text-center"
      onCancel={handleDismiss}
      onSubmit={handleSubmit}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="hover:bg-blue-600"
      submitButtonExtraStyle="#3b82f6"
      closeModal={onClose}
    ></NotificationModal>
  );
};

export default RestoreMultipleFoldersModal;
