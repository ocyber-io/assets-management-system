import React from "react";
import deleteImage from "../../assets/images/delete-modal.svg"; // Correctly import delete image
import NotificationModal from "./NotificationModal"; // Adjust path if needed
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { deleteFolder } from "../../reducers/folder/folderThunk";

type DeleteFolderModalProps = {
  heading?: string;
  description?: string;
  folderId: string | null;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
};

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  heading = "Move to bin?",
  description = "Do you really want to move this item to the bin? You can restore it later if needed.",
  submitButtonText,
  onClose,
  isOpen,
  folderId,
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
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while moving the file.");
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

export default DeleteFolderModal;
