import React from "react";
import warningImage from "../../../assets/images/warning-modal.svg";
import { AppDispatch } from "../../../stores/store";
import { useDispatch } from "react-redux";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import NotificationModal from "../NotificationModal";
import { deleteFileFromFolder } from "../../../reducers/folder/folderThunk";

type RemoveFromFolderModalProps = {
  fileId: string | null;
  folderId: string | undefined; // Add folderId prop
  heading?: string;
  description?: string;
  submitButtonText: string;
  onClose: () => void;
  fetchFolders: () => void;
  isOpen: boolean;
};

const RemoveFromFolderModal: React.FC<RemoveFromFolderModalProps> = ({
  heading = "Warning!",
  description = "There is something that needs your attention. Please take action or dismiss this warning.",
  submitButtonText,
  onClose,
  isOpen,
  fileId,
  folderId,
  fetchFolders,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDismiss = () => {
    console.log("Warning dismissed");
    onClose();
  };

  const RemoveFileFromFolderHandler = async () => {
    if (!fileId || !folderId) {
      showErrorToast("Invalid file or folder identifier.");
      return;
    }

    try {
      await dispatch(deleteFileFromFolder({ folderId, fileId })).unwrap();
      showSuccessToast("File removed from folder successfully");
      onClose();
      fetchFolders();
    } catch (error: any) {
      showErrorToast(
        error.message ||
          "An error occurred while removing the file from the folder."
      );
    }
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      imageUrl={warningImage}
      heading={heading}
      headingStyles="text-xl text-gray-600 font-extrabold mt-4"
      description={description}
      descriptionAndHeadingPosition="text-center"
      onCancel={handleDismiss}
      onSubmit={RemoveFileFromFolderHandler}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="bg-blue-500 hover:bg-blue-600"
      closeModal={onClose}
    />
  );
};

export default RemoveFromFolderModal;
