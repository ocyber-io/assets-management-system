import React from "react";
import deleteImage from "../../assets/images/delete-modal.svg"; // Correctly import delete image
import NotificationModal from "./NotificationModal"; // Adjust path if needed
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { deleteFile } from "../../reducers/file/fileThunks";

type DeleteConfirmationModalProps = {
  heading?: string;
  description?: string;
  fetchAllFiles: () => void;
  fetchFolders?: () => void;
  fileId: string | null;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  heading = "Are you Sure?",
  description = "Do you really want to delete this item? This process cannot be undone.",
  submitButtonText,
  onClose,
  isOpen,
  fileId,
  fetchAllFiles,
  fetchFolders,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDismiss = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!fileId) {
      showErrorToast("Invalid file identifier.");
      return;
    }

    try {
      await dispatch(deleteFile(fileId)).unwrap();
      showSuccessToast("File deleted successfully");
      fetchAllFiles();
      fetchFolders && fetchFolders();
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while deleting the file.");
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

export default DeleteConfirmationModal;
