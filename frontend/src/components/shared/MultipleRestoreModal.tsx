import React from "react";
import { useDispatch } from "react-redux";
import restoreImage from "../../assets/images/restore-modal.svg"; // Correctly import delete image
import { AppDispatch } from "../../stores/store";
import NotificationModal from "./NotificationModal"; // Adjust path if needed
import { restoreMultipleFiles } from "../../reducers/file/fileThunks";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

type MultipleRestoreModalProps = {
  heading?: string;
  description?: string;
  fetchAllFiles: () => void;
  deselectAll: () => void;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
  filesIds: string[] | undefined;
};

const MultipleRestoreModal: React.FC<MultipleRestoreModalProps> = ({
  heading = "Restore File?",
  description = "Do you really want to restore this item from the bin?",
  submitButtonText,
  onClose,
  isOpen,
  fetchAllFiles,
  filesIds,
  deselectAll,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDismiss = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
      if (!filesIds) {
        return;
      }
      await dispatch(restoreMultipleFiles(filesIds)).unwrap();
      showSuccessToast(
        `${filesIds.length} file${
          filesIds.length > 1 ? "s" : ""
        } restored successfully`
      );
      deselectAll();
      fetchAllFiles();
      onClose();
    } catch (error: any) {
      showErrorToast("Error deleting multiple files: " + error.message);
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

export default MultipleRestoreModal;
