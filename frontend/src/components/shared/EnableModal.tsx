import React from "react";
import warningImage from "../../assets/images/warning-modal.svg";
import NotificationModal from "./NotificationModal";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { toggleFileDisable } from "../../reducers/file/fileThunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";

type EnableModalProps = {
  fileId: string | null;
  heading?: string;
  description?: string;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
  fetchAllFiles: () => void;
};

const EnableModal: React.FC<EnableModalProps> = ({
  heading = "Warning!",
  description = "There is something that needs your attention. Please take action or dismiss this warning.",
  submitButtonText,
  onClose,
  isOpen,
  fileId,
  fetchAllFiles,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDismiss = () => {
    console.log("Warning dismissed");
    onClose();
  };

  const enableHandler = async () => {
    if (!fileId) {
      showErrorToast("Invalid file identifier.");
      return;
    }

    try {
      await dispatch(toggleFileDisable(fileId)).unwrap();
      showSuccessToast("File enabled successfully");
      fetchAllFiles();
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while disabling the file.");
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
      onSubmit={enableHandler}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="bg-green-500 hover:bg-green-600"
      closeModal={onClose}
    />
  );
};

export default EnableModal;
