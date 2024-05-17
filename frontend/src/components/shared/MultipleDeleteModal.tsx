import React from "react";
import { useDispatch } from "react-redux";
import deleteImage from "../../assets/images/delete-modal.svg"; // Correctly import delete image
import { deleteMultipleFiles } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import NotificationModal from "./NotificationModal"; // Adjust path if needed

type MultipleDeleteModalProps = {
  heading?: string;
  description?: string;
  fetchAllFiles: () => void;
  filesIds: string[] | undefined;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
  deselectAll: () => void;
};

const MultipleDeleteModal: React.FC<MultipleDeleteModalProps> = ({
  heading = "Move to bin?",
  description = "Do you really want to move this item to the bin? You can restore it later if needed.",
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
      await dispatch(deleteMultipleFiles(filesIds)).unwrap();
      showSuccessToast(
        `${filesIds.length} file${
          filesIds.length > 1 ? "s" : ""
        } deleted successfully`
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

export default MultipleDeleteModal;
