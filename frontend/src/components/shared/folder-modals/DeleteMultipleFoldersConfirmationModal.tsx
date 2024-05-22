import React from "react";
import { useDispatch } from "react-redux";
import { deleteMultipleFolders } from "../../../reducers/folder/folderThunk";
import { AppDispatch } from "../../../stores/store";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import deleteImage from "../../../assets/images/delete-modal.svg"; // Correctly import delete image
import NotificationModal from "../NotificationModal";

type DeleteMultipleFoldersConfirmationModalProps = {
  heading?: string;
  description?: string;
  folderIds: string[] | null;
  submitButtonText: string;
  onClose: () => void;
  fetchFolders: () => void;
  fetchAllFiles: () => void;
  isOpen: boolean;
};

const DeleteMultipleFoldersConfirmationModal: React.FC<
  DeleteMultipleFoldersConfirmationModalProps
> = ({
  heading = "Move to bin?",
  description = "Do you really want to move this item to the bin? You can restore it later if needed.",
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
    if (!folderIds) return;
    try {
      await dispatch(deleteMultipleFolders(folderIds)).unwrap();
      showSuccessToast(`${folderIds.length} Folder(s) deleted successfully`);
      fetchFolders();
      fetchAllFiles();
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while deleting the folders.");
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

export default DeleteMultipleFoldersConfirmationModal;
