import React from "react";
import { useDispatch } from "react-redux";
import restoreImage from "../../assets/images/restore-modal.svg"; // Correctly import delete image
import { restoreFile } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import NotificationModal from "./NotificationModal"; // Adjust path if needed

type RestoreModalProps = {
  heading?: string;
  description?: string;
  fetchAllFiles: () => void;
  fileId: string | null;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
};

const RestoreModal: React.FC<RestoreModalProps> = ({
  heading = "Restore File?",
  description = "Do you really want to restore this item from the bin?",
  submitButtonText,
  onClose,
  isOpen,
  fileId,
  fetchAllFiles,
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
      await dispatch(restoreFile(fileId)).unwrap();
      showSuccessToast("File restored successfully");
      fetchAllFiles();
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while restoring the file.");
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
    />
  );
};

export default RestoreModal;
