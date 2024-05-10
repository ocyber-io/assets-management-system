import React from "react";
import warningImage from "../../assets/images/warning-modal.svg";
import NotificationModal from "./NotificationModal"; // Ensure correct path to NotificationModal
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { toggleFileDisable } from "../../reducers/file/fileThunks";

type WarningModalProps = {
  fileId: string | null;
  heading?: string;
  description?: string;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
  fetchAllFiles: () => void;
};

const WarningModal: React.FC<WarningModalProps> = ({
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

  const disableHandler = async () => {
    if (!fileId) {
      showErrorToast("Invalid file identifier.");
      return;
    }

    try {
      await dispatch(toggleFileDisable(fileId)).unwrap();
      showSuccessToast("File disabled successfully");
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
      onSubmit={disableHandler}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="bg-blue-500 hover:bg-blue-600"
      closeModal={onClose}
    />
  );
};

export default WarningModal;
