import React from "react";
import deleteImage from "../../../assets/images/delete-modal.svg"; // Correctly import delete image
import { AppDispatch } from "../../../stores/store";
import { useDispatch } from "react-redux";
import { deleteFolder } from "../../../reducers/folder/folderThunk";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import NotificationModal from "../NotificationModal";

type DeleteFolderFromBinModalProps = {
  heading?: string;
  description?: string;
  folderId: string | null;
  submitButtonText: string;
  onClose: () => void;
  fetchFolders: () => void;
  fetchAllFiles: () => void;
  isOpen: boolean;
};

const DeleteFolderFromBinModal: React.FC<DeleteFolderFromBinModalProps> = ({
  heading = "Move to bin?",
  description = "Do you really want to move this item to the bin? You can restore it later if needed.",
  submitButtonText,
  onClose,
  isOpen,
  folderId,
  fetchFolders,
  fetchAllFiles,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDismiss = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!folderId) return;
    try {
      await dispatch(deleteFolder(folderId)).unwrap();
      showSuccessToast("Folder deleted successfully");
      fetchFolders();
      fetchAllFiles();
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while deleting the folder.");
    }
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      imageUrl={deleteImage}
      heading={heading}
      headingStyles="text-xl text-gray-600 font-extrabold mt-4"
      description={description}
      descriptionAndHeadingPosition="text-center"
      onCancel={handleDismiss}
      onSubmit={handleSubmit}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="hover:bg-red-600"
      submitButtonExtraStyle="#FF6B50"
      closeModal={onClose}
    />
  );
};

export default DeleteFolderFromBinModal;
